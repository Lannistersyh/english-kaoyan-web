import type { SubQuestion } from '../../types'
import { PassageRenderer } from './PassageRenderer'
import type { BlockProps } from './types'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

function ReorderBody({ item, answer, onAnswer }: { item: SubQuestion; answer: string[]; onAnswer: (a: string[]) => void }) {
  const items = item.reorderItems ?? []
  const ordered = answer.length ? answer : item.fixedFirstId ? [item.fixedFirstId] : []
  const chosen = new Set(ordered)

  return (
    <div>
      <div className="form-label"> Ordered (click to remove {item.fixedFirstId ? "; the first paragraph is fixed" : ''}）</div>
      <div className="reorder-answer" style={{ marginBottom: 14 }}>
        {ordered.length === 0 && <span className="muted"> Click the paragraphs below in order to arrange them as you think correct </span>}
        {ordered.map((key) => (
          <button
            type="button"
            disabled={key === item.fixedFirstId}
            key={key}
            className="reorder-chip"
            onClick={() => onAnswer(ordered.filter((k) => k !== key))}
            title="Click to remove"
          >
            {LETTERS[parseInt(key, 10)]}
            <span className="small">{key === item.fixedFirstId ? "Fixed" : '×'}</span>
          </button>
        ))}
      </div>
      <div className="form-label"> Paragraphs to choose from (click to add to the order) </div>
      <div className="reorder-pool">
        {items.map((t, idx) => {
          const key = String(idx)
          return (
            <div
              key={key}
              role="button"
              tabIndex={chosen.has(key) ? -1 : 0}
              aria-disabled={chosen.has(key)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click() } }}
              className={`reorder-item${chosen.has(key) ? ' reorder-item--chosen' : ''}`}
              onClick={() => (chosen.has(key) ? undefined : onAnswer([...ordered, key]))}
            >
              <span style={{ fontWeight: 700, color: 'var(--c-primary)', marginRight: 8 }}>{LETTERS[idx]}.</span>
              {t}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* Gap-fill, reorder, and heading matching questions. */
export function MatchingBlock({ question, answers, onAnswer, uncertain, onUncertain }: BlockProps) {
  const items = question.items
  const pool = question.optionPools?.[items[0]?.optionPoolId ?? ''] ?? []

  if (items.every((it) => it.kind === 'gapfill') && question.passage) {
    return (
      <div>
        <PassageRenderer
          text={question.passage}
          renderGap={(n) => {
            const item = items[n - 1]
            if (!item) return null
            return (
              <span>
                <select
                  className="gap-select"
                  value={(answers[item.id] ?? [''])[0] ?? ''}
                  aria-label={` No. ${n} blank `}
                  onChange={(e) => onAnswer(item.id, e.target.value ? [e.target.value] : [])}
                  style={{ minWidth: 80, maxWidth: '100%' }}
                >
                  <option value=""> Please select… </option>
                  {pool.map((o, i) => (
                    <option key={o.id} value={o.id} disabled={items.some(other => other.id !== item.id && (answers[other.id] ?? []).includes(o.id))}>
                      {LETTERS[i]}
                    </option>
                  ))}
                </select>
              </span>
            )
          }}
        />
        <div style={{ marginTop: 14 }}>
          <div className="form-label"> Option pool (each sentence can be used only once) </div>
          <div className="reorder-pool">
            {pool.map((o, i) => (
              <div key={o.id} className="reorder-item" style={{ cursor: 'default' }}>
                <span style={{ fontWeight: 700, color: 'var(--c-primary)', marginRight: 8 }}>{LETTERS[i]}.</span>
                {o.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (items.every((it) => it.kind === 'reorder')) {
    return (
      <div>
        {items.map((item) => (
          <ReorderBody
            key={item.id}
            item={item}
            answer={answers[item.id] ?? []}
            onAnswer={(a) => onAnswer(item.id, a)}
          />
        ))}
        <div className="muted" style={{ marginTop: 10 }}>

           Logic chain for ordering questions: pay attention to pronoun references and logical connectives at the beginning and end of each paragraph (yet, what matters most, in the end…).
        </div>
      </div>
    )
  }

  // Heading matching
  return (
    <div>
      {items.map((item, idx) => {
        const selected = (answers[item.id] ?? [''])[0] ?? ''
        return (
          <div key={item.id} style={{ marginBottom: 18 }}>
            <div className="form-label">
              {idx + 1}. {item.stem}
            </div>
            {(item.options ?? []).map((o, i) => (
              <div
                key={o.id}
                role="radio"
                    aria-checked={selected === o.id}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onAnswer(item.id, [o.id]) } }}
                    className={`option${selected === o.id ? ' option--selected' : ''}`}
                onClick={() => onAnswer(item.id, [o.id])}
              >
                <span className="option__letter">{LETTERS[i]}.</span>
                <span>{o.text}</span>
              </div>
            ))}
            <label className="small muted" style={{ display: 'inline-flex', gap: 6, marginTop: 6 }}>
              <input type="checkbox" checked={uncertain[item.id] ?? false} onChange={(e) => onUncertain(item.id, e.target.checked)} />

               Unsure
            </label>
          </div>
        )
      })}
    </div>
  )
}
