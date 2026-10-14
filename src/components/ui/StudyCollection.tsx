import { useMemo, useState } from 'react'
import type { Progress, Question } from '../../types'
import { STORAGE_KEYS } from '../../types'
import { QUESTION_TYPE_LABELS } from '../../data'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { EmptyState } from './EmptyState'

interface Props {
  questions: Question[]
  onOpen: (id: string) => void
}

/* Shared PubMed-style results for the study collections. */
export function StudyCollection({ questions, onOpen }: Props) {
  const [source, setSource] = useState('')
  const [incomplete, setIncomplete] = useState(false)
  const [progress] = useLocalStorage<Progress>(STORAGE_KEYS.progress, {})
  const sources = useMemo(() => [...new Set(questions.map(q => q.sourceLabel))].sort(), [questions])
  const shown = questions.filter(q => (!source || q.sourceLabel === source) && (!incomplete || !progress[q.id]?.completed))

  return (
    <div className="study-collection">
      <div className="pm-results-head" role="status">
        <b>{shown.length} {shown.length === 1 ? 'result' : 'results'}</b>
        {(source || incomplete) && (
          <button className="text-link" type="button" onClick={() => { setSource(''); setIncomplete(false) }}>Clear filters</button>
        )}
      </div>
      <div className="pm-results-layout">
        <aside className="pm-filters" aria-label="Collection filters">
          <div className="pm-filter-group">
            <label className="pm-filter-group__label study-filter-label">
              Source
              <select className="select" value={source} onChange={e => setSource(e.target.value)}>
                <option value="">All sources</option>
                {sources.map(label => <option key={label} value={label}>{label}</option>)}
              </select>
            </label>
          </div>
          <div className="pm-filter-group">
            <div className="pm-filter-group__label">Status</div>
            <label className="pm-filter-item">
              <input type="checkbox" checked={incomplete} onChange={e => setIncomplete(e.target.checked)} />
              Incomplete
            </label>
          </div>
          <p className="study-filter-note">Open a result to start an exercise and view its reference material.</p>
        </aside>
        <div className="pm-results-list">
          {shown.length === 0 && <EmptyState title="No exercises match these filters">Clear the filters to view the collection.</EmptyState>}
          {shown.map((q, index) => {
            const record = progress[q.id]
            const excerpt = (q.passage || q.writingPrompt || q.figureDescription || '').replace(/\{\{\d+\}\}/g, '____')
            return (
              <article className="docsum" key={q.id}>
                <span className="docsum__num" aria-hidden="true">{index + 1}.</span>
                <div className="docsum__main">
                  <h2 className="study-result-heading">
                    <button className="docsum__title" type="button" onClick={() => onOpen(q.id)}>{q.title}</button>
                  </h2>
                  <div className="docsum__meta">
                    {QUESTION_TYPE_LABELS[q.type]} · {q.items.length ? `${q.items.length} questions` : 'Self-assessment'}
                    {q.suggestedMinutes ? ` · ${q.suggestedMinutes} min` : ''}
                  </div>
                  <div className="docsum__cit">{q.sourceLabel}{q.source === 'imported' ? ' · Imported exercise' : ' · Study material'}</div>
                  {excerpt && <p className="docsum__snippet">{excerpt}</p>}
                  {q.vocabNotes?.length ? <div className="study-keywords">Keywords: {q.vocabNotes.slice(0, 3).map(v => v.split(' ')[0]).join(' · ')}</div> : null}
                </div>
                <div className="docsum__side">
                  {record?.completed ? <span className="study-completed">Completed</span> : 'Not practiced'}
                  {record?.total ? <div>Best score: {record.bestScore}/{record.total}</div> : null}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
