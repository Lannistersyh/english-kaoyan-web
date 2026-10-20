import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import http from 'node:http'
import { build } from 'esbuild'
import { createLocalServer } from '../server/http-server.js'

const values = new Map()
const browser = new EventTarget()
browser.localStorage = {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}
browser.alert = () => {}
globalThis.window = browser
const session = id => ({id,questionId:'essay-test',startedAt:1,finishedAt:2,answers:[],score:0,total:0})

// Run component handlers with isolated state and storage; no real account or browser data is used.
const mockReact = `
export const useRef = initial => { const h=globalThis.hookEnv,i=h.cursor++; return h.slots[i]??(h.slots[i]={current:initial}); };
export const useState = initial => { const h=globalThis.hookEnv,i=h.cursor++; if(!h.slots[i])h.slots[i]={value:typeof initial==='function'?initial():initial}; const cell=h.slots[i]; return [cell.value,update=>{cell.value=typeof update==='function'?update(cell.value):update}]; };
export const useEffect = (effect,deps) => { const h=globalThis.hookEnv,i=h.cursor++,old=h.slots[i]; if(!old||!deps||deps.some((v,n)=>!Object.is(v,old.deps[n]))) {h.slots[i]={deps,cleanup:old?.cleanup};h.effects.push(()=>{h.slots[i].cleanup?.();h.slots[i].cleanup=effect()})} };
export const useCallback = callback => callback;
export const useMemo = callback => callback();
export const useSyncExternalStore = (_subscribe,snapshot) => snapshot();
`
const result = await build({
  stdin:{contents:`
    export * from './src/hooks/useTimer.ts';
    export * from './src/hooks/useLocalStorage.ts';
    export * from './src/utils/storage.ts';
    export * from './src/utils/importer.ts';
    export * from './src/utils/review.ts';
    export * from './src/utils/scoring.ts';
    export * from './src/data/index.ts';
    export {PracticeSession} from './src/components/practice/PracticeSession.tsx';
    export {LoginPage} from './src/components/auth/LoginPage.tsx';
    export {PassageRenderer} from './src/components/practice/PassageRenderer.tsx';
    export {default as Vocabulary} from './src/pages/Vocabulary.tsx';
  `,resolveDir:process.cwd()},
  bundle:true,platform:'node',format:'esm',write:false,logLevel:'silent',jsx:'automatic',
  plugins:[{name:'isolated-hooks',setup(builder){
    builder.onResolve({filter:/^react$/},()=>({path:'react',namespace:'audit'}))
    builder.onResolve({filter:/^react\/jsx-runtime$/},()=>({path:'jsx',namespace:'audit'}))
    builder.onResolve({filter:/\/supabase$/},()=>({path:'cloud',namespace:'audit'}))
    builder.onResolve({filter:/\/AuthContext$/},()=>({path:'auth',namespace:'audit'}))
    builder.onLoad({filter:/.*/,namespace:'audit'},args=>({contents:args.path==='react'?mockReact:args.path==='jsx'
      ? 'export const Fragment="fragment";export const jsx=(type,props)=>({type,props});export const jsxs=jsx;'
      :args.path==='auth'?'export const useAuth=()=>globalThis.auditAuth;'
      :'export const supabase=null;export const isCloudEnabled=()=>Boolean(globalThis.auditCloudEnabled);'}))
  }}],
})
const app = await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'))
function hooks() {
  const env={slots:[],cursor:0,effects:[]}
  return callback=>{
    globalThis.hookEnv=env;env.cursor=0;env.effects=[]
    const output=callback()
    for(const effect of env.effects)effect()
    return output
  }
}
function find(node,predicate) {
  if(Array.isArray(node)) { for(const child of node){const result=find(child,predicate);if(result)return result} }
  else if(node&&typeof node==='object') {
    if(predicate(node))return node
    return find(node.props?.children,predicate)
  }
}
const label = node => Array.isArray(node)?node.map(label).join(''):node&&typeof node==='object'?label(node.props?.children):String(node??'')
const control = (tree,name) => find(tree,node=>node.type?.name==='Button'&&label(node).trim()===name)
const reset = () => {values.clear();app.setStorageUser(null)}

test('Invalid nested backup records are rejected atomically and damaged local data falls back safely',()=>{
  reset();app.save('ekw:sessions',[session('keep')])
  const before=app.exportAll()
  const bad={
    'ekw:questions':[{}], 'ekw:sessions':[null], 'ekw:wrongRecords':[{}], 'ekw:progress':{q:null},
    'ekw:vocab':[{word:'word'}], 'ekw:vocabProgress':{word:'invalid'}, 'ekw:patterns':[null],
    'ekw:settings':{}, 'ekw:dictHistory':{word:{count:3}},
  }
  for(const [key,data]of Object.entries(bad)) {
    assert.ok(app.importAll(JSON.stringify({[key]:{v:1,data}})).length,key)
    assert.equal(app.exportAll(),before,key)
    values.set(key,JSON.stringify({v:1,data}))
    const fallback={safe:true}
    assert.equal(app.load(key,fallback),fallback,key)
    values.delete(key)
    app.save('ekw:sessions',[session('keep')])
  }
})

test('Valid records and the legacy dictionary format survive backup and restore',()=>{
  reset()
  const lookup={count:3,unlocked:true,timestamp:1}
  values.set('ekw:dictHistory',JSON.stringify({constructor:lookup}))
  assert.deepEqual(app.load('ekw:dictHistory',{}).constructor,lookup)
  app.save('ekw:questions',app.builtinQuestions)
  app.save('ekw:sessions',[session('saved')])
  app.save('ekw:vocab',app.builtinVocabulary)
  app.save('ekw:patterns',app.builtinPatterns)
  app.save('ekw:settings',{promptThinkingOnWrong:true})
  const backup=app.exportAll();values.clear()
  assert.deepEqual(app.importAll(backup),[])
  assert.equal(app.load('ekw:questions',[]).length,app.builtinQuestions.length)
  assert.deepEqual(app.load('ekw:dictHistory',{}).constructor,lookup)
})

test('Imports reject unreachable blanks and repeated single-use answers',()=>{
  const template=answer=>`[Type] Matching\n# Matching\n{{1}} text {{2}}\n[Option Pool] A. First | B. Second\n[Answer] ${answer}`
  for(const answer of ['A','A A'])assert.equal(app.parseImport(template(answer)).questions.length,0)
  assert.equal(app.parseImport(template('A B')).questions.length,1)
  assert.equal(app.parseImport(template('A B').replace('{{2}}','{{3}}')).questions.length,0)
})

test('All passage annotations preserve the article text and expose unique jump targets, including overlaps',()=>{
  const ids=node=>{
    if(Array.isArray(node))return node.flatMap(ids)
    if(!node||typeof node!=='object')return []
    return [...(node.props?.id?[node.props.id]:[]),...ids(node.props?.children)]
  }
  let checked=0
  const patterns=new Set(app.builtinPatterns.map(pattern=>pattern.id))
  for(const question of app.builtinQuestions) {
    for(const id of question.essayPatternIds??[])assert.ok(patterns.has(id),id)
    if(!question.passageAnnotations?.length)continue
    const tree=app.PassageRenderer({text:question.passage,annotations:question.passageAnnotations})
    assert.equal(label(tree),question.passage.split(/\n\s*\n/).join(''),question.id)
    const anchors=ids(tree)
    assert.equal(new Set(anchors).size,anchors.length,question.id)
    for(const annotation of question.passageAnnotations) {
      assert.ok(question.passage.includes(annotation.text),annotation.id)
      assert.ok(anchors.includes(`ann-${annotation.id}`),annotation.id)
      checked++
    }
  }
  assert.equal(checked,153)
  const tree=app.PassageRenderer({text:'An alpha {{01}} omega.',annotations:[
    {id:'outer',type:'claim',text:'alpha {{01}} omega',note:''},{id:'inner',type:'keyword',text:'alpha',note:''},
  ],renderGap:number=>`[${number}]`})
  assert.equal(label(tree),'An alpha [1] omega.')
  assert.deepEqual(ids(tree).sort(),['ann-inner','ann-outer'])
})

test('Restarting a completed exercise resets and resumes its timer',()=>{
  const intervals=new Map();let id=0
  browser.setInterval=callback=>{intervals.set(++id,callback);return id}
  browser.clearInterval=id=>intervals.delete(id)
  const render=hooks()
  let timer=render(()=>app.useTimer(true))
  intervals.values().next().value();timer=render(()=>app.useTimer(true));assert.equal(timer.seconds,1)
  timer.setPaused(true);timer=render(()=>app.useTimer(true));assert.equal(intervals.size,0)
  timer.reset();timer=render(()=>app.useTimer(true))
  assert.equal(timer.paused,false);assert.equal(timer.seconds,0)
  intervals.values().next().value();timer=render(()=>app.useTimer(true));assert.equal(timer.seconds,1)
})

test('An old async setter cannot write to another account after switching',()=>{
  reset();app.setStorageUser('alice')
  const render=hooks()
  const [,oldSetter]=render(()=>app.useLocalStorage('ekw:sessions',[]))
  app.setStorageUser('bob');app.save('ekw:sessions',[session('bob')])
  oldSetter(current=>[...current,session('alice')])
  assert.deepEqual(app.load('ekw:sessions',[]).map(row=>row.id),['bob'])
})

test('Self-assessment updates its own attempt and preserves attempts saved elsewhere',()=>{
  reset()
  const question={id:'essay-test',type:'writing',source:'imported',sourceLabel:'Test',title:'Essay',items:[],referenceEssay:'A reference essay.'}
  const render=hooks(),props={question,onExit(){}}
  let tree=render(()=>app.PracticeSession(props));control(tree,'Start answering').props.onClick()
  tree=render(()=>app.PracticeSession(props))
  find(tree,node=>node.type?.name==='QuestionView').props.onAnswer(question.id,['My submitted essay.'])
  tree=render(()=>app.PracticeSession(props));control(tree,'Submit').props.onClick()
  tree=render(()=>app.PracticeSession(props))
  const review=find(tree,node=>node.type?.name==='ResultView')
  assert.equal(review.props.submittedText,'My submitted essay.')
  app.save('ekw:sessions',[...app.load('ekw:sessions',[]),session('other-tab')])
  review.props.onSelfScore(question.id,8)
  const saved=app.load('ekw:sessions',[])
  assert.equal(saved[0].answers[0].selfScore,8)
  assert.equal(saved[1].id,'other-tab')
  assert.equal(saved[1].answers.length,0)
})

test('Vocabulary review continues with the next word after mastery changes its sort position',()=>{
  reset();const render=hooks()
  let tree=render(()=>app.Vocabulary())
  assert.equal(find(tree,node=>node.type==='h2').props.children,app.builtinVocabulary[0].word)
  control(tree,'Know').props.onClick();tree=render(()=>app.Vocabulary())
  assert.equal(find(tree,node=>node.type==='h2').props.children,app.builtinVocabulary[1].word)
})

test('Custom vocabulary keeps a trailing newline while typing multiple definitions',()=>{
  reset();const render=hooks()
  let tree=render(()=>app.Vocabulary())
  find(tree,node=>node.type==='button'&&label(node).includes('Vocabulary management')).props.onClick()
  tree=render(()=>app.Vocabulary());control(tree,'+ Add entry').props.onClick()
  tree=render(()=>app.Vocabulary())
  find(tree,node=>node.type==='textarea').props.onChange({target:{value:'First definition\n'}})
  tree=render(()=>app.Vocabulary())
  assert.equal(find(tree,node=>node.type==='textarea').props.value,'First definition\n')
})

test('Incomplete or malformed cloud configuration leaves the offline study interface available',async()=>{
  const warn=console.warn,fetch=globalThis.fetch
  console.warn=()=>{};globalThis.fetch=()=>{throw new Error('No external request is expected')}
  try {
    for(const url of ['', 'not-a-valid-cloud-url']) {
      const result=await build({entryPoints:['src/lib/supabase.ts'],bundle:true,platform:'browser',format:'esm',write:false,logLevel:'silent',define:{
        'import.meta.env.VITE_SUPABASE_URL':JSON.stringify(url), 'import.meta.env.VITE_SUPABASE_ANON_KEY':JSON.stringify('test-key'),
      }})
      const config=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'))
      assert.equal(config.isCloudEnabled(),false)
      assert.equal(config.supabase,null)
    }
  } finally {console.warn=warn;globalThis.fetch=fetch}
})

test('Review updates keep the latest wrong answer and require two confident consecutive successes',()=>{
  const record={id:'w',questionId:'q',itemId:'shared',firstWrongAt:1,lastWrongAt:1,wrongCount:1,wrongAnswer:['b'],correctAnswer:['a'],myThought:'',distractorTrap:'',correctMapping:'',status:'active',reviewCount:0}
  const foreign={...record,id:'foreign',questionId:'different-question'}
  const item={id:'shared',kind:'choice',correctIds:['a']}
  const graded=(answer,uncertain=false)=>app.gradeAnswers([item],{shared:[answer]},{shared:uncertain}).graded
  let records=app.updateReviewRecords([record,foreign],'q',graded('a'),2)
  assert.equal(records[0].reviewCount,1);assert.equal(records[1],foreign)
  records=app.updateReviewRecords(records,'q',graded('c'),3)
  assert.deepEqual(records[0].wrongAnswer,['c']);assert.equal(records[0].reviewCount,0)
  records=app.updateReviewRecords(records,'q',graded('a'),4);assert.equal(records[0].status,'active')
  records=app.updateReviewRecords(records,'q',graded('a'),5);assert.equal(records[0].status,'mastered')
  records=app.updateReviewRecords(records,'q',graded('a',true),6);assert.equal(records[0].status,'active')
  assert.equal(record.wrongCount,1)
})

test('The login screen handles rejected connections and returns to offline use through its callback',async()=>{
  globalThis.auditCloudEnabled=true
  globalThis.auditAuth={signIn:async()=>{throw new Error('Test network unavailable')},signUp:async()=>({})}
  let offline=false;const props={onOffline:()=>{offline=true}},render=hooks()
  let tree=render(()=>app.LoginPage(props))
  find(tree,node=>node.type==='input'&&node.props.type==='email').props.onChange({target:{value:'test@example.com'}})
  find(tree,node=>node.type==='input'&&node.props.type==='password').props.onChange({target:{value:'test123'}})
  tree=render(()=>app.LoginPage(props));await find(tree,node=>node.type==='form').props.onSubmit({preventDefault(){}})
  tree=render(()=>app.LoginPage(props));assert.match(label(tree),/Test network unavailable/)
  assert.equal(control(tree,'Log in').props.disabled,false)
  control(tree,'Use offline (data is stored only on this device)').props.onClick();assert.equal(offline,true)
  globalThis.auditCloudEnabled=false
})

test('Malformed request URLs cannot stop the server and split UTF-8 bodies are decoded intact',async()=>{
  const folder=fs.mkdtempSync(path.join(os.tmpdir(),'english-site-audit-'))
  fs.writeFileSync(path.join(folder,'index.html'),'Study')
  const server=createLocalServer(folder);await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))
  const port=server.address().port,oldKey=process.env.DEEPSEEK_API_KEY
  process.env.DEEPSEEK_API_KEY=''
  try {
    const status=await new Promise((resolve,reject)=>{
      http.get({hostname:'127.0.0.1',port,path:'http://['},res=>{res.resume();resolve(res.statusCode)}).on('error',reject)
    })
    assert.equal(status,400)
    assert.equal((await fetch(`http://127.0.0.1:${port}/__health`)).status,200)
    const body=Buffer.from(JSON.stringify({englishText:'é'.repeat(12000),chineseTranslation:'A paraphrase.'}))
    const split=body.indexOf(Buffer.from('é'))+1
    const scoringStatus=await new Promise((resolve,reject)=>{
      const request=http.request({hostname:'127.0.0.1',port,path:'/api/deepseek-score',method:'POST'},res=>{res.resume();resolve(res.statusCode)})
      request.on('error',reject);request.write(body.subarray(0,split));setTimeout(()=>request.end(body.subarray(split)),10)
    })
    assert.equal(scoringStatus,503)
  } finally {
    if(oldKey===undefined)delete process.env.DEEPSEEK_API_KEY;else process.env.DEEPSEEK_API_KEY=oldKey
    server.closeAllConnections();await new Promise(resolve=>server.close(resolve));fs.rmSync(folder,{recursive:true,force:true})
  }
})
