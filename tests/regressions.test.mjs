import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { build } from 'esbuild'
import { scoreTranslation } from '../server/score.js'
import vercelHandler from '../api/deepseek-score.js'
import { handler as netlifyHandler } from '../netlify/functions/deepseek-score.js'

async function bundled(file) {
  const result = await build({ entryPoints: [file], bundle: true, platform: 'node', format: 'esm', write: false, logLevel: 'silent' })
  return import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'))
}
const scoring = await bundled('src/utils/scoring.ts')
const importer = await bundled('src/utils/importer.ts')
const data = await bundled('src/data/index.ts')
const storage = await bundled('src/utils/storage.ts')
const windowMock = new EventTarget()
const values = new Map()
windowMock.localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) }
windowMock.alert = () => {}
globalThis.window = windowMock

test('空标准答案、未作答及空选项不获分', () => {
  for (const kind of ['choice', 'gapfill', 'reorder']) {
    assert.equal(scoring.judgeAnswer({ kind, correctIds: [] }, []), false)
    assert.equal(scoring.judgeAnswer({ kind, correctIds: ['a'] }, []), false)
    assert.equal(scoring.judgeAnswer({ kind, correctIds: ['a'] }, ['']), false)
  }
  assert.equal(scoring.judgeAnswer({kind: 'choice', correctIds: ['a']}, ['a']), true)
})
test('缺答案导入被排除，已有六题模板继续兼容', () => {
  const bad = importer.parseImport('[题型] 阅读\n# 测试\n1. 题干\nA. 一\nB. 二')
  assert.equal(bad.questions.length, 0)
  assert.ok(bad.errors.length)
  const sample = fs.readFileSync('scratch-test/run.ts', 'utf8').match(/const SAMPLE = `([\s\S]*?)`/)[1]
  const result = importer.parseImport(sample)
  assert.equal(result.questions.length, 6)
  assert.deepEqual(result.errors, [])
})
test('排序答案与段落内容一致，内置题目答案均可解析', () => {
  const item = data.builtinQuestions.find(q => q.id === 'matching-2').items[0]
  assert.equal(scoring.judgeAnswer(item, ['1','3','0','5','2','4']), true)
  for (const q of data.builtinQuestions) for (const it of q.items) {
    assert.ok(it.correctIds.length, `${q.id}/${it.id}`)
    if (it.kind !== 'reorder') {
      const opts = it.options ?? q.optionPools?.[it.optionPoolId] ?? []
      assert.ok(it.correctIds.every(id => opts.some(o => o.id === id)))
    }
  }
})
test('账号切换互不混用，旧离线数据保持可用', () => {
  values.clear(); storage.setStorageUser(null)
  storage.save('ekw:sessions', ['guest'])
  storage.setStorageUser('alice'); assert.deepEqual(storage.load('ekw:sessions', []), [])
  storage.save('ekw:sessions', ['alice'])
  storage.setStorageUser('bob'); assert.deepEqual(storage.load('ekw:sessions', []), [])
  storage.setStorageUser('alice'); assert.deepEqual(storage.load('ekw:sessions', []), ['alice'])
  storage.setStorageUser(null); assert.deepEqual(storage.load('ekw:sessions', []), ['guest'])
})
test('写入通知发生时可读取新值，导入和清空包含查词历史', () => {
  values.clear(); storage.setStorageUser(null)
  let observed
  const listener = () => { observed = storage.load('ekw:sessions', []) }
  windowMock.addEventListener(storage.STORAGE_EVENT, listener)
  storage.save('ekw:sessions', ['new']); assert.deepEqual(observed, ['new'])
  windowMock.removeEventListener(storage.STORAGE_EVENT, listener)
  storage.save('ekw:dictHistory', { word: {count: 3} }); storage.save('ekw:patterns', ['pattern'])
  const backup = storage.exportAll()
  storage.remove('ekw:dictHistory'); assert.deepEqual(storage.load('ekw:dictHistory', {}), {})
  assert.deepEqual(storage.importAll(backup), [])
  assert.equal(storage.load('ekw:dictHistory', {}).word.count, 3)
  assert.deepEqual(storage.load('ekw:patterns', []), ['pattern'])
  const before = storage.exportAll()
  assert.ok(storage.importAll('{"ekw:sessions":{"v":1,"data":{}}}').length)
  assert.equal(storage.exportAll(), before)
})
test('公开评分入口拒绝匿名请求，无收费上游请求', async () => {
  const oldFetch = globalThis.fetch
  globalThis.fetch = () => { throw new Error('should not call upstream') }
  try {
    const payload = {englishText: 'Text', chineseTranslation: '译文'}
    await assert.rejects(scoreTranslation(payload, undefined), err => err.status === 401)
    const netlify = await netlifyHandler({httpMethod:'POST',headers:{},body:JSON.stringify(payload)})
    assert.equal(netlify.statusCode, 401)
    const res = {setHeader(){}, status(code){this.code=code;return this}, json(body){return body}}
    await vercelHandler({method:'POST',headers:{},body:payload},res)
    assert.equal(res.code,401)
  } finally { globalThis.fetch = oldFetch }
})
test('评分验证响应数值、文本长度和调用频次', async () => {
  const oldFetch = globalThis.fetch; const oldKey = process.env.DEEPSEEK_API_KEY
  process.env.DEEPSEEK_API_KEY = 'test-only'
  let calls = 0
  globalThis.fetch = async () => { calls++; return {ok:true,json:async()=>({choices:[{message:{content:'{"score":8,"comment":"测试"}'}}]})} }
  const payload = {englishText:'Text',chineseTranslation:'译文'}
  try {
    await assert.rejects(scoreTranslation({...payload,englishText:'x'.repeat(12001)},null,{local:true}),err=>err.status===413)
    for(let i=0;i<20;i++) assert.equal((await scoreTranslation(payload,null,{local:true})).score,8)
    await assert.rejects(scoreTranslation(payload,null,{local:true}),err=>err.status===429)
    assert.equal(calls,20)
  } finally { globalThis.fetch=oldFetch; if(oldKey===undefined)delete process.env.DEEPSEEK_API_KEY;else process.env.DEEPSEEK_API_KEY=oldKey }
})

test('云同步使用提交时的快照，并同步句型与查词历史', async () => {
  windowMock.sessionStorage = {setItem(){}}
  let cloudRow = null
  const uploads = []
  globalThis.mockSupabase = {
    auth: {getSession:async()=>({data:{session:{user:{id:'alice'}}}})},
    from: () => ({upsert:async(row)=>{uploads.push(row);return {}},select:()=>({eq:()=>({maybeSingle:async()=>({data:cloudRow})})})}),
  }
  const result = await build({stdin:{contents:"export * from './src/lib/sync.ts'; export * from './src/utils/storage.ts'",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',write:false,logLevel:'silent',plugins:[{name:'mock-cloud',setup(build){build.onResolve({filter:/^\.\/supabase$/},()=>({path:'cloud',namespace:'mock'}));build.onLoad({filter:/.*/,namespace:'mock'},()=>({contents:'export const supabase = globalThis.mockSupabase; export const isCloudEnabled = () => true;'}))}}]})
  const mod=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'))
  values.clear();mod.setStorageUser('alice')
  mod.save('ekw:sessions',['first']);mod.save('ekw:patterns',['custom']);mod.save('ekw:dictHistory',{hello:{count:3}})
  const first=mod.pushToCloud()
  mod.save('ekw:sessions',['first','second'])
  const second=mod.pushToCloud()
  assert.equal((await first).ok,true);assert.equal((await second).ok,true)
  assert.deepEqual(uploads[0].sessions.data,['first'])
  assert.deepEqual(uploads[1].sessions.data,['first','second'])
  assert.deepEqual(uploads[1].settings.extras.patterns.data,['custom'])
  assert.equal(uploads[1].settings.extras.dictHistory.data.hello.count,3)
  cloudRow=uploads[1]
  mod.remove('ekw:patterns');mod.remove('ekw:dictHistory')
  assert.equal((await mod.pullFromCloud()).ok,true)
  assert.deepEqual(mod.load('ekw:patterns',[]),['custom'])
  assert.equal(mod.load('ekw:dictHistory',{}).hello.count,3)
  mod.setStorageUser('bob')
  assert.equal((await mod.pushToCloud()).ok,false)
  assert.equal(uploads.length,2)
})
