import type { Question, SubQuestion } from '../../types'
import { PassageRenderer } from './PassageRenderer'
import type { BlockProps } from './types'

const ANNOTATION_LABELS = {
  claim: "Claim",
  evidence: "Evidence",
  attitude: "Attitude",
  keyword: "Keywords",
} as const

/* Illustrative metadata preserves the PubMed article layout for practice materials. */
function mockMetadata(question: Question) {
  const seed = [...question.id].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const authors = ['Chen L', 'Wang J', 'Liu Y', 'Zhang H', 'Zhao M', 'Sun Q', 'Li X', 'Wu K']
  const year = 2024 - (seed % 3)
  const firstPage = 10 + (seed % 90)
  return {
    citation: `${year} Oct;${620 + (seed % 20)}(${1 + (seed % 4)}):${firstPage}-${firstPage + question.items.length}.`,
    year,
    authors: Array.from({ length: 3 + (seed % 3) }, (_, i) => authors[(seed + i * 3) % authors.length]).join(', '),
    doi: `10.1000/ekw.${question.id.replace(/[^a-z0-9]/gi, '')}`,
    pmid: question.id.replace(/[^0-9]/g, '').padEnd(8, '0').slice(0, 8),
  }
}

/* Article layout for close reading and question navigation. */
export function PubMedReadingView({ question, answers, onAnswer, uncertain, onUncertain }: BlockProps) {
  const annotations = question.passageAnnotations ?? []
  const metadata = mockMetadata(question)

  return (
    <div className="pm-article">
      {/* Article and questions */}
      <article className="pm-article__main">
        <div className="pm-cit" title="Illustrative citation for a practice article">
          <span className="pm-cit__chevron" aria-hidden="true">⌄</span>
          {metadata.citation} doi: {metadata.doi}. eCollection {metadata.year}.
        </div>

        <h1 className="pm-title" id="reading-title">{question.title.replace(/^Reading\s*·?\s*/, '')}</h1>

        <div className="pm-authors" title="Illustrative author names for the practice layout">
          <b>{metadata.authors}.</b>
        </div>

        {/* Reading passage */}
        <div className="pm-section" id="reading-passage">
          <h2 className="pm-section__title">Abstract</h2>
          <div className="pm-section__content">
            <PassageRenderer text={question.passage ?? ''} annotations={annotations} />
          </div>

          {annotations.length > 0 && (
            <div className="notes-panel">
              <div className="pm-aside__label" style={{ marginBottom: 8 }}> Structure notes </div>
              {annotations.map((a) => (
                <div
                  key={a.id}
                  className="notes-item"
                  onClick={() => document.getElementById(`ann-${a.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                >
                  <span className={`notes-item__type notes-item__type--${a.type}`}>{ANNOTATION_LABELS[a.type]}</span>
                  <span>
                    {a.note}
                    <span className="muted"> 「{a.text.length > 40 ? `${a.text.slice(0, 40)}…` : a.text}」</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Individual questions */}
        {question.items.map((item, i) => (
          <QuestionSection
            key={item.id}
            item={item}
            index={i + 1}
            selected={(answers[item.id] ?? [''])[0] ?? ''}
            uncertain={uncertain[item.id] ?? false}
            onAnswer={onAnswer}
            onUncertain={onUncertain}
          />
        ))}

        <div className="pm-ids" title="Illustrative identifiers for the practice layout">
          <div><b>PMID:</b> {metadata.pmid}</div>
          <div><b>DOI:</b> {metadata.doi}</div>
        </div>
      </article>

      {/* Reading tools */}
      <aside className="pm-aside">
        <div className="pm-aside__box">
          <div className="pm-aside__label">Full text links</div>
          <button className="pm-aside__btn pm-aside__btn--secondary" type="button" onClick={() => document.getElementById('reading-passage')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}><span style={{ color: 'var(--c-danger)', fontWeight: 700 }}>FREE</span> Full-text close reading</button>
          <button className="pm-aside__btn pm-aside__btn--secondary" type="button" onClick={() => document.getElementById(`question-${question.items[0]?.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Exam reading questions</button>
        </div>

        <div className="pm-aside__box">
          <div className="pm-aside__label">Actions</div>
          <button className="pm-aside__btn" type="button" onClick={() => window.dispatchEvent(new Event('ekw:dictionary-open'))}> 📖 Look up word </button>
          <button className="pm-aside__btn" type="button" onClick={() => document.getElementById('reading-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}> ↑ Back to title </button>
        </div>

        <div className="pm-aside__box">
          <div className="pm-aside__label">Questions</div>
          {question.items.map((it, index) => (
            <button key={it.id} className="pm-aside__link text-link" type="button" title={it.stem ?? ''} onClick={() => document.getElementById(`question-${it.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
              {index + 1}. {it.stem && it.stem.length > 34 ? `${it.stem.slice(0, 34)}…` : it.stem ?? ''}
            </button>
          ))}
        </div>
      </aside>
    </div>
  )
}

function QuestionSection({
  item, index, selected, uncertain, onAnswer, onUncertain,
}: {
  item: SubQuestion
  index: number
  selected: string
  uncertain: boolean
  onAnswer: (itemId: string, a: string[]) => void
  onUncertain: (itemId: string, v: boolean) => void
}) {
  return (
    <div className="pm-section" id={`question-${item.id}`}>
      <h2 className="pm-section__title">Question {index}</h2>
      <div className="pm-section__content">
        <p style={{ marginBottom: 10 }}>{item.stem}</p>
        {(item.options ?? []).map((o, idx) => (
          <div
            key={o.id}
            role="radio"
            aria-checked={selected === o.id}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onAnswer(item.id, [o.id]) } }}
            className={`option${selected === o.id ? ' option--selected' : ''}`}
            onClick={() => onAnswer(item.id, [o.id])}
          >
            <span className="option__letter">{String.fromCharCode(65 + idx)}.</span>
            <span>{o.text}</span>
          </div>
        ))}
        <label className="small muted" style={{ display: 'inline-flex', gap: 6, marginTop: 6 }}>
          <input
            type="checkbox"
            checked={uncertain}
            onChange={(e) => onUncertain(item.id, e.target.checked)}
          />

           Uncertain (to prevent &quot;lucky guesses&quot; from slipping into the wrong-question archive)
        </label>
      </div>
    </div>
  )
}
