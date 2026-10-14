import { useState } from 'react'
import { QUESTION_TYPE_LABELS } from '../data'
import type { Progress, Question, QuestionType } from '../types'
import { STORAGE_KEYS } from '../types'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getAllQuestions } from '../utils/questions'
import { PracticeSession } from '../components/practice/PracticeSession'
import { EmptyState } from '../components/ui/EmptyState'
import { Card } from '../components/ui/Card'
import type { PageProps } from '../App'

const TABS: (QuestionType | 'all')[] = ['all', 'cloze', 'reading', 'matching']

/* Assemble searchable text: title + article + question stem */
function searchableText(q: Question): string {
  return [q.title, q.passage, ...(q.items ?? []).map((i) => i.stem ?? '')].join(' ').toLowerCase()
}

/* Summary line: take the first two sentences of the article */
function snippet(q: Question): string {
  if (!q.passage) return q.items.length > 0 ? q.items[0].stem ?? "Objective questions" : "Subjective question · Self-assessment by comparison"
  const sents = q.passage.replace(/\{\{\d+\}\}/g, ' ___ ').split(/(?<=[.!?])\s+/).slice(0, 2).join(' ')
  return sents.length > 260 ? `${sents.slice(0, 260)}…` : sents
}

export default function Practice({ search = '' }: PageProps) {
  const [tab, setTab] = useState<QuestionType | 'all'>('all')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [onlyUnfinished, setOnlyUnfinished] = useState(false)
  const [onlyImported, setOnlyImported] = useState(false)
  const [onlyWrong, setOnlyWrong] = useState(false)
  const [progress] = useLocalStorage<Progress>(STORAGE_KEYS.progress, {})
  const [wrongRecords] = useLocalStorage<{ questionId: string }[]>(STORAGE_KEYS.wrongRecords, [])

  const active = activeId ? getAllQuestions().find((q) => q.id === activeId) : null

  if (active) {
    return (
      <PracticeSession
        question={active}
        onExit={() => setActiveId(null)}
      />
    )
  }

  const term = search.trim().toLowerCase()
  const all = getAllQuestions().filter(q => ['cloze', 'reading', 'matching'].includes(q.type) && (tab === 'all' || q.type === tab))
  const wrongIds = new Set(wrongRecords.map((r) => r.questionId))
  const questions = all.filter((q) => {
    if (term && !searchableText(q).includes(term)) return false
    if (onlyImported && q.source !== 'imported') return false
    if (onlyUnfinished && progress[q.id]?.completed) return false
    if (onlyWrong && !wrongIds.has(q.id)) return false
    return true
  })

  return (
    <div>
      <div className="pm-results-head">
        <span>{questions.length.toLocaleString()} result{questions.length === 1 ? '' : 's'}</span>
        {term && <span>for: <b>{search}</b></span>}
      </div>

      <div className="pm-results-layout">
        {/* Question filters */}
        <aside className="pm-filters">
          <div className="pm-filter-group">
            <div className="pm-filter-group__label"> Type </div>
            {TABS.map((t) => (
              <label key={t} className={`pm-filter-item${tab === t ? '' : ' pm-filter-item--off'}`}>
                <input type="radio" name="qtype" checked={tab === t} onChange={() => setTab(t)} />
                {t === 'all' ? 'All article types' : QUESTION_TYPE_LABELS[t]}
              </label>
            ))}
          </div>
          <div className="pm-filter-group">
            <div className="pm-filter-group__label"> Status </div>
            <label className="pm-filter-item">
              <input type="checkbox" checked={onlyUnfinished} onChange={(e) => setOnlyUnfinished(e.target.checked)} />

               Incomplete
            </label>
            <label className="pm-filter-item">
              <input type="checkbox" checked={onlyWrong} onChange={(e) => setOnlyWrong(e.target.checked)} />

               Has mistakes
            </label>
            <label className="pm-filter-item">
              <input type="checkbox" checked={onlyImported} onChange={(e) => setOnlyImported(e.target.checked)} />

               Imported questions
            </label>
          </div>
          <div className="pm-filter-group">
            <div className="pm-filter-group__label"> Target reference </div>
            <div className="pm-filter-item pm-filter-item--off" style={{ cursor: 'default' }}>

               Cloze mistakes ≤3 · Reading mistakes ≤3 · Full score on new question types
            </div>
          </div>
        </aside>

        {/* Search results */}
        <div className="pm-results-list">
          {questions.length === 0 ? (
            <Card>
              <EmptyState icon="📭" title="No matching questions">
                {term ? ` No questions containing "${search}" were found, try other keywords ` : "No questions for this type yet, go to \"Past exam import\" and paste your past exam"}
              </EmptyState>
            </Card>
          ) : (
            questions.map((q, i) => {
              const p = progress[q.id]
              return (
                <div key={q.id} className="docsum">
                  <div className="docsum__num">{i + 1}.</div>
                  <div className="docsum__main">
                    <button
                      type="button"
                      className="docsum__title"
                      onClick={() => setActiveId(q.id)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveId(q.id) } }}
                    >
                      {q.title.replace(/\s*·\s*/g, ' ').replace(/^Cloze\s*/, '').replace(/^Reading\s*/, '')}.
                    </button>
                    <div className="docsum__meta">
                      {q.source === 'imported' ? "Import" : "Mock question"} · {q.items.length > 0 ? `${q.items.length} sub-questions ` : "Subjective question"}
                    </div>
                    <div className="docsum__cit">

                       Postgraduate entrance exam English close reading training.  {q.suggestedMinutes ? ` Suggestions ${q.suggestedMinutes} minutes. ` : ''}
                      {p ? ` Completed ${p.attempts} times · Best ${p.bestScore}/${p.total}.` : 'Free full text'}
                    </div>
                    <div className="docsum__snippet">{snippet(q)}</div>
                  </div>
                  <div className="docsum__side">
                    {p ? `${Math.round((p.bestScore / Math.max(1, p.total)) * 100)}%` : "Not practiced"}
                    {wrongIds.has(q.id) && <div style={{ color: 'var(--c-danger)' }}> Has mistakes </div>}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
