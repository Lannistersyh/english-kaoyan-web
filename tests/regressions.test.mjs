import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import http from 'node:http'
import ts from 'typescript'
import { build } from 'esbuild'
import { scoreTranslation } from '../server/score.js'
import vercelHandler from '../api/deepseek-score.js'
import { handler as netlifyHandler } from '../netlify/functions/deepseek-score.js'
import { createLocalServer } from '../server/http-server.js'

async function bundled(file) {
  const result = await build({ entryPoints: [file], bundle: true, platform: 'node', format: 'esm', write: false, logLevel: 'silent' })
  return import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'))
}
const scoring = await bundled('src/utils/scoring.ts')
const importer = await bundled('src/utils/importer.ts')
const data = await bundled('src/data/index.ts')
const storage = await bundled('src/utils/storage.ts')
const dictionary = await bundled('src/utils/dictionary.ts')
const { scoringEndpoint } = await bundled('src/utils/scoringEndpoint.ts')
const windowMock = new EventTarget()
const values = new Map()
windowMock.localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) }
windowMock.alert = () => {}
globalThis.window = windowMock
const session = id => ({id, questionId:'reading-1', startedAt:1, finishedAt:2, answers:[], score:0, total:0})
const pattern = id => ({id, category:'thesis', en:'Study sentence.', zh:'Usage explanation.', builtin:false})
const lookup = {count:3, unlocked:true, timestamp:1}

test('GitHub Pages does not call a missing AI API; local and connected hosted endpoints remain available', () => {
  assert.equal(scoringEndpoint('lannistersyh.github.io'), null)
  assert.equal(scoringEndpoint('127.0.0.1'), '/api/deepseek-score')
  assert.equal(scoringEndpoint('lannistersyh.github.io', 'https://example.com/api/deepseek-score'), 'https://example.com/api/deepseek-score')
  assert.equal(scoringEndpoint('example.netlify.app'), '/api/deepseek-score')
})

test("Empty reference answers, unanswered questions, and empty options earn no points", () => {
  for (const kind of ['choice', 'gapfill', 'reorder']) {
    assert.equal(scoring.judgeAnswer({ kind, correctIds: [] }, []), false)
    assert.equal(scoring.judgeAnswer({ kind, correctIds: ['a'] }, []), false)
    assert.equal(scoring.judgeAnswer({ kind, correctIds: ['a'] }, ['']), false)
  }
  assert.equal(scoring.judgeAnswer({kind: 'choice', correctIds: ['a']}, ['a']), true)
})
test("Imports missing answers are excluded; the existing six-question template remains compatible", () => {
  const bad = importer.parseImport("[Type] Reading\n# Test\n1. Question stem\nA. One\nB. Two")
  assert.equal(bad.questions.length, 0)
  assert.ok(bad.errors.length)
  const sample = fs.readFileSync('tests/fixtures/import-sample.txt', 'utf8')
  const result = importer.parseImport(sample)
  assert.equal(result.questions.length, 6)
  assert.deepEqual(result.errors, [])
})
test('The template shown on the Import page parses every advertised category', () => {
  const source = ts.createSourceFile('Import.tsx', fs.readFileSync('src/pages/Import.tsx', 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  let template
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === 'TEMPLATE') template = node.initializer.text
    ts.forEachChild(node, visit)
  }
  visit(source)
  const result = importer.parseImport(template)
  assert.deepEqual(result.errors, [])
  assert.deepEqual(result.questions.map(q => q.type), ['reading', 'cloze', 'matching', 'translation', 'writing'])
  const writing = result.questions.at(-1)
  assert.match(writing.figureDescription, /Description of the picture/)
  assert.match(writing.writingPrompt, /160-200 words/)
  assert.equal(writing.referenceEssay, 'Reference essay...')
  assert.ok(result.questions.find(q => q.type === 'cloze').items.every(item => item.score === 0.5))
})
test('Built-in content remains complete and contains no Chinese characters', () => {
  assert.equal(data.builtinQuestions.length, 72)
  assert.equal(data.builtinQuestions.reduce((n, q) => n + q.items.length, 0), 296)
  assert.equal(/\p{Script=Han}/u.test(JSON.stringify(data.builtinQuestions)), false)
})
test('Dictionary lookup works offline for study words and uses exact English definitions online', async () => {
  const oldFetch = globalThis.fetch
  try {
    globalThis.fetch = () => { throw new Error('offline') }
    const local = await dictionary.lookupEnglishWord('address')
    assert.ok(local.definitions.some(definition => definition.includes('handle')))
    globalThis.fetch = async () => ({ok:true,json:async()=>[{word:'conviction',defs:['n\tA firmly held belief.'],tags:['ipa_pron:kʌnvɪkʃən']}]})
    const online = await dictionary.lookupEnglishWord('conviction')
    assert.deepEqual(online.definitions, ['n: A firmly held belief.'])
    assert.equal(online.phonetic, 'kʌnvɪkʃən')
    assert.equal(await dictionary.lookupEnglishWord('misspelledword'), null)
  } finally { globalThis.fetch = oldFetch }
})
test("Reorder answers match the passage content, and all built-in question answers can be parsed", () => {
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
test("Account switching does not mix data, and old offline data remains usable", () => {
  values.clear(); storage.setStorageUser(null)
  storage.save('ekw:sessions', [session('guest')])
  storage.setStorageUser('alice'); assert.deepEqual(storage.load('ekw:sessions', []), [])
  storage.save('ekw:sessions', [session('alice')])
  storage.setStorageUser('bob'); assert.deepEqual(storage.load('ekw:sessions', []), [])
  storage.setStorageUser('alice'); assert.deepEqual(storage.load('ekw:sessions', []), [session('alice')])
  storage.setStorageUser(null); assert.deepEqual(storage.load('ekw:sessions', []), [session('guest')])
})
test("New values can be read when a write notification occurs; import and clear include word lookup history", () => {
  values.clear(); storage.setStorageUser(null)
  let observed
  const listener = () => { observed = storage.load('ekw:sessions', []) }
  windowMock.addEventListener(storage.STORAGE_EVENT, listener)
  storage.save('ekw:sessions', [session('new')]); assert.deepEqual(observed, [session('new')])
  windowMock.removeEventListener(storage.STORAGE_EVENT, listener)
  storage.save('ekw:dictHistory', { word: lookup }); storage.save('ekw:patterns', [pattern('pattern')])
  const backup = storage.exportAll()
  storage.remove('ekw:dictHistory'); assert.deepEqual(storage.load('ekw:dictHistory', {}), {})
  assert.deepEqual(storage.importAll(backup), [])
  assert.equal(storage.load('ekw:dictHistory', {}).word.count, 3)
  assert.deepEqual(storage.load('ekw:patterns', []), [pattern('pattern')])
  const before = storage.exportAll()
  assert.ok(storage.importAll('{"ekw:sessions":{"v":1,"data":{}}}').length)
  assert.equal(storage.exportAll(), before)
})
test("The public scoring endpoint rejects anonymous requests, with no paid upstream requests", async () => {
  const oldFetch = globalThis.fetch
  globalThis.fetch = () => { throw new Error('should not call upstream') }
  try {
    const payload = {englishText: 'Text', chineseTranslation: "Translation"}
    await assert.rejects(scoreTranslation(payload, undefined), err => err.status === 401)
    const netlify = await netlifyHandler({httpMethod:'POST',headers:{},body:JSON.stringify(payload)})
    assert.equal(netlify.statusCode, 401)
    const res = {setHeader(){}, status(code){this.code=code;return this}, json(body){return body}}
    await vercelHandler({method:'POST',headers:{},body:payload},res)
    assert.equal(res.code,401)
  } finally { globalThis.fetch = oldFetch }
})
test("Scoring validates response values, text length, and call frequency", async () => {
  const oldFetch = globalThis.fetch; const oldKey = process.env.DEEPSEEK_API_KEY
  process.env.DEEPSEEK_API_KEY = 'test-only'
  let calls = 0
  globalThis.fetch = async () => { calls++; return {ok:true,json:async()=>({choices:[{message:{content:"{\"score\":8,\"comment\":\"Test\"}"}}]})} }
  const payload = {englishText:'Text',chineseTranslation:"Translation"}
  try {
    await assert.rejects(scoreTranslation({...payload,englishText:'x'.repeat(12001)},null,{local:true}),err=>err.status===413)
    for(let i=0;i<20;i++) assert.equal((await scoreTranslation(payload,null,{local:true})).score,8)
    await assert.rejects(scoreTranslation(payload,null,{local:true}),err=>err.status===429)
    assert.equal(calls,20)
  } finally { globalThis.fetch=oldFetch; if(oldKey===undefined)delete process.env.DEEPSEEK_API_KEY;else process.env.DEEPSEEK_API_KEY=oldKey }
})

test("Cloud sync uses the snapshot at submission time and syncs sentence patterns and word lookup history", async () => {
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
  mod.save('ekw:sessions',[session('first')]);mod.save('ekw:patterns',[pattern('custom')]);mod.save('ekw:dictHistory',{hello:lookup})
  const first=mod.pushToCloud()
  mod.save('ekw:sessions',[session('first'),session('second')])
  const second=mod.pushToCloud()
  assert.equal((await first).ok,true);assert.equal((await second).ok,true)
  assert.deepEqual(uploads[0].sessions.data,[session('first')])
  assert.deepEqual(uploads[1].sessions.data,[session('first'),session('second')])
  assert.deepEqual(uploads[1].settings.extras.patterns.data,[pattern('custom')])
  assert.equal(uploads[1].settings.extras.dictHistory.data.hello.count,3)
  cloudRow=uploads[1]
  mod.remove('ekw:patterns');mod.remove('ekw:dictHistory')
  assert.equal((await mod.pullFromCloud()).ok,true)
  assert.deepEqual(mod.load('ekw:patterns',[]),[pattern('custom')])
  assert.equal(mod.load('ekw:dictHistory',{}).hello.count,3)
  mod.setStorageUser('bob')
  assert.equal((await mod.pushToCloud()).ok,false)
  assert.equal(uploads.length,2)
})

test('The local launcher server serves the app and rejects foreign origins and unsafe requests', async () => {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'english-study-server-test-'))
  fs.writeFileSync(path.join(folder, 'index.html'), '<html lang="en">English Study</html>')
  const server = createLocalServer(folder)
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}`
  try {
    assert.equal((await (await fetch(`${base}/__health`)).json()).app, 'english-study')
    assert.match(await (await fetch(base)).text(), /English Study/)
    const head = await fetch(base, {method:'HEAD'})
    assert.equal(head.status, 200)
    assert.equal(await head.text(), '')
    assert.equal((await fetch(`${base}/__health`, {headers:{Origin:'https://example.com'}})).status, 403)
    const foreignHost = await new Promise((resolve, reject) => {
      http.get(`${base}/__health`, {headers:{Host:'example.com'}}, response => { response.resume(); resolve(response.statusCode) }).on('error', reject)
    })
    assert.equal(foreignHost, 403)
    assert.equal((await fetch(`${base}/%2e%2e%2foutside.txt`)).status, 403)
    assert.equal((await fetch(`${base}/api/deepseek-score`, {method:'POST',body:'broken JSON'})).status, 400)
    assert.equal((await fetch(`${base}/api/deepseek-score`, {method:'POST',body:JSON.stringify({englishText:'',chineseTranslation:''})})).status, 400)
  } finally {
    server.closeAllConnections()
    await new Promise(resolve => server.close(resolve))
    fs.rmSync(folder, {recursive:true,force:true})
  }
})
