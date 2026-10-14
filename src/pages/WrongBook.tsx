import { useMemo, useState } from 'react'
import type { Question, WrongRecord, SubQuestion } from '../types'
import { STORAGE_KEYS } from '../types'
import { QUESTION_TYPE_LABELS } from '../data'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getQuestion, resolveItem } from '../utils/questions'
import { PracticeSession } from '../components/practice/PracticeSession'
import { ThinkingForm } from '../components/practice/ThinkingForm'
import { Button } from '../components/ui/Button'
import { Tag } from '../components/ui/Tag'
import { EmptyState } from '../components/ui/EmptyState'
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function timeAgo(ts: number): string {
  const days = Math.floor((Date.now() - ts) / 86400000)
  if (days <= 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 30) return `${days} days ago `
  return new Date(ts).toLocaleDateString('en-US')
}

function extractContext(passage: string, keywords: string[], radius = 80): string {
  if (!passage || keywords.length === 0) return ''
  const lower = passage.toLowerCase()
  for (const kw of keywords) {
    const idx = lower.indexOf(kw.toLowerCase())
    if (idx !== -1) {
      const start = Math.max(0, idx - radius)
      const end = Math.min(passage.length, idx + kw.length + radius)
      let excerpt = passage.slice(start, end)
      if (start > 0) excerpt = '…' + excerpt
      if (end < passage.length) excerpt = excerpt + '…'
      return excerpt
    }
  }
  return ''
}


function WrongItemCard({ r, q, item, onEdit, onReview }: {
  r: WrongRecord
  q: Question | undefined
  item: SubQuestion | undefined
  onEdit: () => void
  onReview: () => void
}) {
  if (!item) return <p className="muted">Question deleted. Thinking record: {r.myThought || 'None'} {r.distractorTrap} {r.correctMapping}</p>

  const options = item.options ?? q?.optionPools?.[item.optionPoolId ?? ''] ?? []
  const passage = q?.passage || ''
  const correctText = options.find(o => item.correctIds.includes(o.id))?.text || ''
  const sourceQuotes = [...(item.analysis || '').matchAll(/["“]([^"”]{12,})["”]/g)].map(match => match[1]).filter(quote => passage.toLowerCase().includes(quote.toLowerCase()))
  const keywords = [...sourceQuotes, ...correctText.split(/\s+/).filter(w => w.length > 4)].slice(0, 3)
  const context = extractContext(passage, keywords)
  let clozeContext = ''
  if ((q?.type === 'cloze' || item.kind === 'gapfill') && q?.passage) {
    const blank = `{{${q.items.findIndex(it => it.id === item.id) + 1}}}`
    const paragraph = q.passage.split(/\n\s*\n/).find(para => para.includes(blank))
    if (paragraph) {
      const sentence = paragraph.split(/(?<=[.!?])\s+/).find(sent => sent.includes(blank)) || paragraph
      clozeContext = sentence.replace(blank, '______').trim()
    }
  }

  return (
    <div>
      {clozeContext ? <div className="study-review-context">
        <div className="form-label">Blank in context</div>
        <p className="study-prose">{clozeContext}</p>
      </div> : item.stem && !/^\d+$/.test(item.stem) ? <p>{item.stem}</p> : null}

      {options.map((opt, idx) => {
        const correct = item.correctIds.includes(opt.id)
        const wrong = r.wrongAnswer.includes(opt.id)
        return <div key={opt.id} className={`study-review-option${correct ? ' study-review-option--correct' : wrong ? ' study-review-option--wrong' : ''}`}>
          <b>{LETTERS[idx]}.</b>
          <span className="study-review-option__text">{opt.text}</span>
          {correct && <Tag variant="success">Correct</Tag>}
          {wrong && !correct && <Tag variant="danger">Your answer</Tag>}
        </div>
      })}

      {context && <div className="study-review-context">
        <div className="form-label">Passage context</div>
        <p className="study-prose">{context}</p>
      </div>}

      {item.kind === 'reorder' && <div className="study-review-explanation">
        <p>Your order: {r.wrongAnswer.map(k => LETTERS[Number(k)]).join(' → ') || 'Not answered'}</p>
        <p>Correct order: {item.correctIds.map(k => LETTERS[Number(k)]).join(' → ')}</p>
        <ol className="study-prose">{item.correctIds.map(k => <li key={k}><b>{LETTERS[Number(k)]}.</b> {item.reorderItems?.[Number(k)]}</li>)}</ol>
      </div>}

      {item.analysis && <div className="study-review-explanation"><div className="form-label">Explanation</div><p>{item.analysis}</p></div>}
      {item.distractors?.length ? <div className="study-review-explanation">
        <div className="form-label">Distractor analysis</div>
        {item.distractors.map((d, i) => {
          const option = options.find(o => o.id === d.optionId)
          const index = option ? options.indexOf(option) : -1
          return <div key={i} className="study-review-distractor">
            <b>{index >= 0 ? `${LETTERS[index]}. ` : ''}{option?.text}</b>{' '}<Tag variant="danger">{d.type}</Tag>
            <div>{d.why}</div>
          </div>
        })}
      </div> : null}

      {(r.myThought || r.distractorTrap || r.correctMapping) && <div className="study-review-context">
        {r.myThought && <p><b>What I was thinking:</b> {r.myThought}</p>}
        {r.distractorTrap && <p><b>How the distractor misled me:</b> {r.distractorTrap}</p>}
        {r.correctMapping && <p><b>How the correct option paraphrases:</b> {r.correctMapping}</p>}
      </div>}
      <div className="flex-row">
        <Button variant="primary" onClick={onReview}>Redo this question</Button>
        <Button variant="ghost" onClick={onEdit}>{r.myThought || r.distractorTrap || r.correctMapping ? 'Edit the three questions' : 'Fill in the three questions'}</Button>
      </div>
    </div>
  )
}

function QuestionGroup({ questionId, records, onEdit, onReview, onToggleMastered }: {
  questionId: string
  records: WrongRecord[]
  onEdit: (r: WrongRecord) => void
  onReview: (q: Question, r: WrongRecord) => void
  onToggleMastered: (r: WrongRecord) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const q = getQuestion(questionId)
  const activeCount = records.filter(r => r.status === 'active').length
  return (
    <article className="study-group">
      <button className="study-group__toggle" type="button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
        <span>
          <span className="study-group__title">{q?.title || '(Question deleted)'}</span>
          <span className="study-group__metadata">
            {q && `${QUESTION_TYPE_LABELS[q.type]} · `}{records.length} mistakes · Last mistake: {timeAgo(Math.max(...records.map(r => r.lastWrongAt)))}
          </span>
          <span className="study-group__metadata">{activeCount ? `${activeCount} to review` : 'All mastered'}</span>
        </span>
        <span>{expanded ? 'Collapse' : 'Expand'}</span>
      </button>
      {expanded && records.map(r => {
        const index = q?.items.findIndex(it => it.id === r.itemId) ?? -1
        const item = index >= 0 ? q?.items[index] : undefined
        return <section className="study-review-item" key={r.id}>
          <div className="study-review-heading">
            <h3>{index >= 0 ? `Question ${index + 1}` : 'Unavailable question'}</h3>
            <Button variant={r.status === 'mastered' ? 'ghost' : 'default'} onClick={() => onToggleMastered(r)}>{r.status === 'mastered' ? 'Mastered' : 'Mark as mastered'}</Button>
          </div>
          <WrongItemCard r={r} q={q} item={item} onEdit={() => onEdit(r)} onReview={() => { if (q) onReview(q, r) }} />
        </section>
      })}
    </article>
  )
}

export default function WrongBook() {
  const [records, setRecords] = useLocalStorage<WrongRecord[]>(STORAGE_KEYS.wrongRecords, [])
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'mastered'>('active')
  const [reviewing, setReviewing] = useState<{ question: Question; record: WrongRecord } | null>(null)
  const [editing, setEditing] = useState<WrongRecord | null>(null)

  const shown = useMemo(() => {
    return [...records]
      .filter((r) => statusFilter === 'all' || r.status === statusFilter)
      .sort((a, b) => b.lastWrongAt - a.lastWrongAt)
  }, [records, statusFilter])

  const grouped = useMemo(() => {
    const map = new Map<string, WrongRecord[]>()
    for (const r of shown) {
      const arr = map.get(r.questionId) || []
      arr.push(r)
      map.set(r.questionId, arr)
    }
    return [...map.entries()].sort(([, a], [, b]) => {
      const latestA = Math.max(...a.map(r => r.lastWrongAt))
      const latestB = Math.max(...b.map(r => r.lastWrongAt))
      return latestB - latestA
    })
  }, [shown])

  const handleGraded = (graded: { itemId: string; correct: boolean }[]) => {
    if (!reviewing) return
    const now = Date.now()
    setRecords(
      records.map((r) => {
        const g = graded.find((x) => x.itemId === r.itemId)
        if (!g) return r
        if (g.correct) {
          const reviewCount = r.reviewCount + 1
          return { ...r, reviewCount, lastReviewAt: now, status: reviewCount >= 2 ? 'mastered' : r.status }
        }
        return { ...r, wrongCount: r.wrongCount + 1, lastWrongAt: now, status: 'active' }
      }),
    )
  }

  const toggleMastered = (r: WrongRecord) => {
    setRecords(records.map(x =>
      x.id === r.id ? { ...x, status: x.status === 'active' ? 'mastered' : 'active' } : x
    ))
  }

  if (reviewing) {
    return (
      <PracticeSession
        question={reviewing.question}
        isReview
        onGraded={(graded) => handleGraded(graded.map((g) => ({ itemId: g.itemId, correct: g.correct })))}
        onExit={() => setReviewing(null)}
      />
    )
  }

  const activeCount = records.filter((r) => r.status === 'active').length

  return (
    <div className="study-page">
      <h1 className="page-title"> Review Book </h1>
      <p className="page-sub">

         The three questions for wrong answers are the core training for an 80: ① What was I thinking at the time ② How did the distractor mislead me ③ How does the correct option paraphrase. After answering correctly twice in review, it is automatically marked as &quot;Mastered&quot;
      </p>

      <div className="toolbar study-tabs">
        {(['active', 'all', 'mastered'] as const).map((s) => (
          <button
            key={s}
            className={`btn${statusFilter === s ? ' btn--primary' : ''}`}
            onClick={() => setStatusFilter(s)}
          >
            {s === 'active' ? `To review (${activeCount})` : s === 'all' ? "All" : "Mastered"}
          </button>
        ))}
        <span className="toolbar__spacer" />
        <span className="muted">

           Total  {records.length}   items · Mastered  {records.filter((r) => r.status === 'mastered').length}   items
        </span>
      </div>

      {grouped.length === 0 ? (
        <EmptyState icon="📕" title="No wrong question records">
          {statusFilter === 'active' ? "Wrong questions will be automatically saved here after you answer them incorrectly" : "Wrong questions during practice will be automatically archived"}
        </EmptyState>
      ) : (
        <div>
          {grouped.map(([questionId, recs]) => (
            <QuestionGroup
              key={questionId}
              questionId={questionId}
              records={recs}
              onEdit={(r) => setEditing(r)}
              onReview={(q, r) => setReviewing({ question: q, record: r })}
              onToggleMastered={toggleMastered}
            />
          ))}
        </div>
      )}

      {editing && (
        <ThinkingForm
          item={(() => { const q = getQuestion(editing.questionId); const item = q?.items.find(it => it.id === editing.itemId); return q && item ? resolveItem(q, item) : { id: editing.itemId, kind: 'choice' as const, correctIds: [] } })()}
          wrongAnswer={editing.wrongAnswer}
          initialThought={editing.myThought}
          initialTrap={editing.distractorTrap}
          initialMapping={editing.correctMapping}
          onSave={(t, tr, m) => {
            setRecords(records.map((x) => (x.id === editing.id ? { ...x, myThought: t, distractorTrap: tr, correctMapping: m } : x)))
            setEditing(null)
          }}
          onSkip={() => setEditing(null)}
        />
      )}
    </div>
  )
}
