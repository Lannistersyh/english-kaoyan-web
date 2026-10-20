import test from 'node:test'
import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const result = await build({
  stdin: { contents: `
    export * from './src/data/index.ts';
    export * from './src/data/bank-202610/index.ts';
    export * from './src/utils/scoring.ts';
    export * from './src/utils/questions.ts';
    export * from './src/utils/validation.ts';
    export * from './src/utils/questionSource.ts';
    export { WritingBlock } from './src/components/practice/WritingBlock.tsx';
    export { ClozeBlock } from './src/components/practice/ClozeBlock.tsx';
    export { QuestionProvenance } from './src/components/practice/QuestionProvenance.tsx';
  `, resolveDir: process.cwd() },
  bundle: true, platform: 'node', format: 'esm', write: false, logLevel: 'silent', jsx: 'automatic',
})
const app = await import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'))
const added = app.october2026Questions
const words = value => value.trim().split(/\s+/).length
const props = question => ({question, answers:{}, uncertain:{}, onAnswer(){}, onUncertain(){}})
const render = (Component, properties) => renderToStaticMarkup(createElement(Component, properties))

test('October expansion adds exactly eight sourced past tasks and sixteen original mocks', () => {
  assert.equal(added.length, 24)
  assert.equal(added.filter(q => q.provenance.kind === 'past-exam').length, 8)
  assert.equal(added.filter(q => q.provenance.kind === 'original-mock').length, 16)
  assert.deepEqual(Object.fromEntries(['reading','cloze','matching','translation','writing'].map(type => [type, added.filter(q => q.type === type).length])),
    {reading:8,cloze:3,matching:3,translation:2,writing:8})
  assert.equal(added.reduce((sum,q) => sum+q.items.length,0),111)
  assert.equal(/\p{Script=Han}/u.test(JSON.stringify(added)),false)
})

test('Legacy question identifiers remain available and the expanded catalog has unique IDs', () => {
  const ids = new Set()
  for (const q of app.builtinQuestions) {
    assert.ok(!ids.has(q.id),q.id);ids.add(q.id)
  }
  const existing = app.builtinQuestions.filter(q => !added.some(a => a.id === q.id))
  assert.equal(existing.length,48)
  for (const [type,count] of [['cloze',8],['reading',4],['matching',3],['translation',4],['writing',3]]) {
    for(let i=1;i<=count;i++) assert.ok(ids.has(`${type}-${i}`),`${type}-${i}`)
  }
  const itemIds = app.builtinQuestions.flatMap(q => q.items.map(item => item.id))
  assert.equal(new Set(itemIds).size,itemIds.length)
  const annotationIds = app.builtinQuestions.flatMap(q => (q.passageAnnotations??[]).map(a => a.id))
  assert.equal(new Set(annotationIds).size,annotationIds.length)
})

test('New objective items have valid keys, distinct options, explanations, and exact scoring', () => {
  const optionIds = new Set()
  for (const q of added) {
    const answers = {}
    for (const item of q.items) {
      assert.ok(item.analysis?.length>50,item.id)
      assert.ok(Number.isFinite(item.score)&&item.score>0,item.id)
      const resolved = app.resolveItem(q,item)
      if (item.kind === 'reorder') {
        assert.deepEqual([...item.correctIds].sort(),item.reorderItems.map((_,i)=>String(i)).sort())
        assert.equal(item.correctIds[0],item.fixedFirstId)
      } else {
        assert.equal(item.correctIds.length,1,item.id)
        assert.ok(resolved.options.some(o => o.id===item.correctIds[0]),item.id)
        assert.equal(new Set(resolved.options.map(o=>o.text)).size,resolved.options.length,item.id)
        if (item.options) for (const option of item.options) {
          assert.ok(!optionIds.has(option.id),option.id);optionIds.add(option.id)
        }
        assert.equal(app.judgeAnswer(resolved,[resolved.options.find(o=>o.id!==item.correctIds[0]).id]),false,item.id)
      }
      answers[item.id]=item.correctIds
      assert.equal(app.judgeAnswer(resolved,item.correctIds),true,item.id)
      assert.equal(app.judgeAnswer(resolved,[]),false,item.id)
    }
    if(q.items.length) {
      const graded=app.gradeAnswers(q.items.map(item=>app.resolveItem(q,item)),answers,{})
      assert.equal(graded.score,10,q.id)
      assert.equal(graded.total,10,q.id)
    }
  }
})

test('Each new reading has a full passage, five explained questions, and four exact annotations', () => {
  const correctPositions = new Set()
  for (const q of added.filter(q => q.type==='reading')) {
    assert.ok(words(q.passage)>=300 && words(q.passage)<=450,q.id)
    assert.equal(q.passage.split('\n\n').length,4,q.id)
    assert.equal(q.items.length,5,q.id)
    assert.equal(q.passageAnnotations.length,4,q.id)
    for (const note of q.passageAnnotations) assert.ok(q.passage.includes(note.text),note.id)
    for (const item of q.items) {
      assert.equal(item.options.length,4,item.id)
      correctPositions.add(item.options.findIndex(o=>o.id===item.correctIds[0]))
      assert.deepEqual(item.distractors.map(d=>d.optionId).sort(),item.options.filter(o=>!item.correctIds.includes(o.id)).map(o=>o.id).sort(),item.id)
      for (const trap of item.distractors) assert.ok(trap.why.length>15,item.id)
    }
  }
  assert.equal(correctPositions.size,4)
})

test('Twenty-blank cloze passages have consecutive reachable blanks and render their actual totals', () => {
  for (const q of added.filter(q=>q.type==='cloze')) {
    assert.ok(words(q.passage)>=250 && words(q.passage)<=350,q.id)
    assert.equal(q.items.length,20)
    assert.deepEqual([...q.passage.matchAll(/\{\{(\d+)\}\}/g)].map(m=>Number(m[1])),Array.from({length:20},(_,i)=>i+1))
    assert.ok(q.items.every(item=>item.score===0.5&&item.options.length===4))
    const html=render(app.ClozeBlock,props(q))
    assert.match(html,/20 blanks/)
    assert.match(html,/10 points in total/)
    assert.doesNotMatch(html,/\{\{|Missing question/)
    assert.equal((html.match(/role="radiogroup"/g)||[]).length,20)
  }
})

test('New matching tasks preserve single-use answers and the manually checked discourse order', () => {
  const gap=added.find(q=>q.id==='mock-matching-202610-01')
  assert.equal(gap.optionPools['oral-history'].length,7)
  assert.equal(new Set(gap.items.map(i=>i.correctIds[0])).size,5)
  assert.deepEqual(gap.items.map(i=>i.correctIds[0].slice(-1)),['e','b','g','a','d'])
  const headings=added.find(q=>q.id==='mock-matching-202610-02')
  assert.deepEqual(headings.items.map(i=>i.options.find(o=>i.correctIds.includes(o.id)).text),[
    'Define the proposition','Establish the numerical baseline','Trace the evidence to its source','Consider alternative causes','Limit the conclusion to what is supported',
  ])
  const order=added.find(q=>q.id==='mock-matching-202610-03').items[0]
  assert.deepEqual(order.correctIds,['2','4','0','3','1','5'])
  assert.match(order.reorderItems[4],/During those observations/)
  assert.match(order.reorderItems[0],/To address this hesitation/)
  assert.match(order.reorderItems[3],/With this revised sign/)
  assert.match(order.reorderItems[1],/That improvement/)
  assert.match(order.reorderItems[5],/Those later reports/)
  assert.equal(app.judgeAnswer(order,['2','0','4','3','1','5']),false)
})

test('Past tasks retain verified year/paper/recipient mappings and original responses near 100 words', () => {
  const scenarios = [
    ['2022','ii',/food festival/i,/international students/i],
    ['2023','i',/Professor Smith/i,/responsibilities/i],
    ['2024','i',/Paul/,/oral report/],
    ['2024','ii',/Jack/,/survey plan/],
    ['2025','i',/Paul/,/demonstrations/],
    ['2025','ii',/classic Chinese novel/,/John/],
    ['2026','i',/Paul/,/viewed in person/],
    ['2026','ii',/Jack/,/learn more/],
  ]
  for (const [year,paper,context,prompt] of scenarios) {
    const q=added.find(q=>q.id===`past-${year}-${paper}-writing-a`)
    assert.equal(q.provenance.year,Number(year))
    assert.equal(q.provenance.paper,paper==='i'?'English I':'English II')
    assert.equal(q.provenance.section,'Writing A')
    assert.match(q.figureDescription,context);assert.match(q.writingPrompt,prompt)
    assert.equal(q.targetWords,100)
    assert.ok(words(q.referenceEssay)>=90&&words(q.referenceEssay)<=115,q.id)
    assert.match(q.referenceEssay,/Li Ming$/)
    assert.match(q.provenance.note,/not an official answer key/)
    const html=render(app.QuestionProvenance,{question:q})
    assert.match(html,/target="_blank" rel="noopener noreferrer"/)
    assert.ok(html.includes(q.provenance.sourceName))
    assert.match(render(app.WritingBlock,props(q)),/Your response \(about 100 words\)/)
    assert.doesNotMatch(render(app.WritingBlock,props(q)),/160-200|Picture description/)
  }
  assert.match(render(app.WritingBlock,props(app.builtinQuestions.find(q=>q.id==='writing-1'))),/160-200 words/)
  assert.doesNotMatch(render(app.WritingBlock,props({id:'no-picture',items:[],writingPrompt:'Write a notice.'})),/Picture description/)
})

test('Optional source metadata is safe to render and survives validation without invalidating old questions', () => {
  assert.equal(app.validStoredData('ekw:questions',app.builtinQuestions),true)
  const original=added[0]
  assert.equal(app.validStoredData('ekw:questions',[{...original,provenance:undefined,targetWords:undefined}]),true)
  for (const url of ['javascript:alert(1)','data:text/html,test','file:///etc/passwd','https://user:secret@example.com/','not a url']) {
    assert.equal(app.safeSourceUrl(url),undefined)
    const bad={...original,provenance:{...original.provenance,sourceUrl:url}}
    assert.equal(app.validStoredData('ekw:questions',[bad]),false)
    assert.doesNotMatch(render(app.QuestionProvenance,{question:bad}),/<a /)
  }
  for (const metadata of [{targetWords:-1},{targetWords:1.5},{provenance:null},{provenance:{kind:'real',note:'test'}},{provenance:{kind:'past-exam',year:'2024',note:'test'}}]) {
    assert.equal(app.validStoredData('ekw:questions',[{...original,...metadata}]),false)
  }
})
