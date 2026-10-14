import { useState } from 'react'
import type { ImportResult, Question } from '../types'
import { STORAGE_KEYS } from '../types'
import { QUESTION_TYPE_LABELS } from '../data'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { parseImport } from '../utils/importer'
import { Button } from '../components/ui/Button'
import { Tag } from '../components/ui/Tag'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { Modal } from '../components/ui/Modal'

const TEMPLATE = `[Type] Reading
[Source] 2024 past exam Text1
# Text1 · Your title

First paragraph body...

Second paragraph body...

1. First question stem
A. Option A
B. Option B
C. Option C
D. Option D
[Answer] B
[Explanation] How the correct option paraphrases the original text...
[Distractor] A Concept substitution: ...
[Distractor] C Over-inference: ...

2. Second question stem
A. Option A
B. Option B
C. Option C
D. Option D
[Answer] D
[Explanation] ...
[Distractor] A Misattribution: ...

---

[Type] Cloze
[Source] Mock cloze
# Cloze practice

First sentence of the body, {{1}} is the first blank, {{2}} the second blank...

1. A. word1 B. word2 C. word3 D. word4
2. A. word1 B. word2 C. word3 D. word4
[Answer] A B

---

[Type] Matching
[Source] 7-choose-5 practice
# 7-choose-5 practice

First paragraph...

{{1}} Second paragraph...

{{2}} Third paragraph...
[Option Pool] A. Option sentence 1 | B. Option sentence 2 | C. Option sentence 3 | D. Option sentence 4 | E. Option sentence 5 | F. Option sentence 6 | G. Option sentence 7
[Answer] A C
[Explanation] Shared explanation: explain how to choose each blank... ([Distractor] can also be written after the answer in the same way)

---

[Type] Paraphrasing
[Source] Paraphrasing practice
# Paraphrasing a complex sentence

The sentence to be paraphrased, which contains a relative clause, is written here.
[Reference Paraphrase] Reference paraphrase...
[Step1] Segmentation structure explanation...
[Step2] Word order adjustment explanation...
[Step3] Paraphrasing tips...

---

[Type] Writing
[Source] Writing practice
# Picture essay practice

[Picture] Description of the picture content...
[Prompt] Write an essay of 160-200 words...
[Reference Essay] Reference essay...`

export default function Import() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<ImportResult | null>(null)
  const [imported, setImported] = useLocalStorage<Question[]>(STORAGE_KEYS.questions, [])
  const [managing, setManaging] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<Question | null>(null)

  const parse = () => {
    setResult(parseImport(text))
  }

  const confirmImport = () => {
    if (!result) return
    setImported([...imported, ...result.questions])
    setResult(null)
    setText('')
  }

  const copyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(TEMPLATE)
      window.alert("Template copied, paste it into the input box below and modify it")
    } catch {
      window.alert("Copy failed, please manually select and copy")
    }
  }

  return (
    <div className="study-page">
      <h1 className="page-title"> Import </h1>
      <p className="page-sub">

         Paste past exam text in the format to automatically parse it into practice questions (past exams are copyrighted, not built in, all depends on your own import)
      </p>

      <div className="toolbar">
        <Button variant="primary" onClick={copyTemplate}>Copy format template</Button>
        <Button variant={managing ? 'primary' : 'default'} onClick={() => setManaging(!managing)}>

           Question management ( {imported.length}   questions)
        </Button>
        <span className="toolbar__spacer" />
        <span className="muted"> Supports: Reading / Cloze / 7-choose-5 / Reorder / Paraphrasing / Writing </span>
      </div>

      {managing ? (
        <Card title="Imported questions" extra={<span className="muted"> Imported questions can be deleted here; after deletion, they are also removed from the practice list </span>}>
          {imported.length === 0 ? (
            <EmptyState icon="📥" title="No imported questions yet"> Paste and parse a past exam first </EmptyState>
          ) : (
            <div className="item-list">
              {imported.map((q) => (
                <div key={q.id} className="item-row" style={{ cursor: 'default' }}>
                  <div className="item-row__main">
                    <div className="item-row__title">
                      {q.title} <Tag variant="plain">{QUESTION_TYPE_LABELS[q.type]}</Tag>
                    </div>
                    <div className="item-row__meta">{q.sourceLabel} · {q.items.length > 0 ? `${q.items.length} sub-questions ` : "Subjective question"}</div>
                  </div>
                  <Button variant="danger" style={{ padding: '5px 12px' }} onClick={() => setConfirmDelete(q)}>

                     Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      ) : (
        <>
          <textarea
            className="textarea study-import-text"
            aria-label="Question text to import"
            placeholder={"Paste past exam text...\n\nNot sure about the format? Click \"Copy format template\" above"}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="toolbar" style={{ marginTop: 12 }}>
            <Button variant="primary" onClick={parse} disabled={!text.trim()}>

               Parse preview
            </Button>
            <Button onClick={() => setText('')} disabled={!text}> Clear </Button>
          </div>
        </>
      )}

      {result && (
        <Modal
          title={` Parse result:${result.questions.length} questions,${result.errors.length} problems `}
          onClose={() => setResult(null)}
          footer={
            <>
              <Button onClick={() => setResult(null)}> Cancel </Button>
              <Button variant="primary" onClick={confirmImport} disabled={result.questions.length === 0}>

                 Confirm import ( {result.questions.length}   questions)
              </Button>
            </>
          }
        >
          {result.errors.length > 0 && (
            <div className="card card--flat" style={{ borderColor: 'var(--c-warning)', marginBottom: 12 }}>
              <b className="small" style={{ color: 'var(--c-warning)' }}> Parse problems (invalid questions excluded): </b>
              <ul style={{ margin: '6px 0 0', paddingLeft: 18, fontSize: 13 }}>
                {result.errors.map((e, i) => (
                  <li key={i}> No.  {e.line}   Line: {e.message}</li>
                ))}
              </ul>
            </div>
          )}
          {result.questions.length === 0 ? (
            <EmptyState icon="⚠️" title="No questions parsed"> Please check the format, or copy the template for reference </EmptyState>
          ) : (
            <div className="item-list">
              {result.questions.map((q, i) => (
                <div key={i} className="card card--flat" style={{ padding: 12 }}>
                  <div className="flex-row" style={{ gap: 8, marginBottom: 4 }}>
                    <Tag variant="plain">{QUESTION_TYPE_LABELS[q.type]}</Tag>
                    <Tag>{q.sourceLabel}</Tag>
                    <b>{q.title}</b>
                  </div>
                  <div className="muted small">
                    {q.items.length > 0 ? `${q.items.length} sub-questions · ` : ''}
                    {q.items.filter((it) => it.correctIds.length > 0).length}   questions with answers
                    {q.referenceTranslation && "· Includes reference paraphrase"}
                    {q.referenceEssay && "· Includes reference essay"}
                  </div>
                  {q.passage && (
                    <div className="small muted" style={{ marginTop: 4 }}>
                      {q.passage.slice(0, 80)}{q.passage.length > 80 ? '……' : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}

      {confirmDelete && (
        <Modal
          title="Delete question"
          onClose={() => setConfirmDelete(null)}
          footer={
            <>
              <Button onClick={() => setConfirmDelete(null)}> Cancel </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setImported(imported.filter((x) => x.id !== confirmDelete.id))
                  setConfirmDelete(null)
                }}
              >

                 Confirm deletion
              </Button>
            </>
          }
        >
          <p> Are you sure you want to delete &quot; {confirmDelete.title} &quot;? Related mistake archive records will be kept but will show &quot;Question deleted&quot;. </p>
        </Modal>
      )}
    </div>
  )
}
