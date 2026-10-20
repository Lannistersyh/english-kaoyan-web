import type { SubQuestion } from '../../types'
import { PassageRenderer } from './PassageRenderer'
import type { BlockProps } from './types'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

function GapSelect({
  item,
  value,
  onChange,
  index,
}: {
  item: SubQuestion
  value: string
  onChange: (optionId: string) => void
  index: number
}) {
  const options = item.options ?? []
  if (options.length === 0) {
    return (
      <span className="gap-slot">
        <span className="gap-select gap-select--empty"> (No options) </span>
      </span>
    )
  }

  // Use radio buttons instead of a dropdown so the options are clear at a glance
  return (
    <span className="gap-slot" style={{ display: 'inline-block', verticalAlign: 'middle', margin: '2px 4px' }}>
      <span
        role="radiogroup"
        aria-label={` Cloze question ${index} Question `}
        style={{
        display: 'inline-flex',
        gap: 3,
        alignItems: 'center',
        padding: '1px 4px',
        border: '1px solid var(--c-border)',
        borderRadius: 8,
        background: 'var(--c-primary-light)',
        flexWrap: 'wrap',
      }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: 'var(--c-primary)',
          color: '#fff',
          fontSize: 11,
          fontWeight: 700,
          flexShrink: 0,
        }}>
          {index}
        </span>
        {options.map((o, i) => (
          <label
            key={o.id}
            title={o.text}
            role="radio"
            aria-checked={value === o.id}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(o.id) } }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              padding: '2px 6px',
              borderRadius: 5,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: value === o.id ? 700 : 400,
              background: value === o.id ? 'var(--c-primary)' : 'transparent',
              color: value === o.id ? '#fff' : 'var(--c-primary)',
              border: value === o.id ? '1px solid var(--c-primary)' : '1px solid transparent',
              transition: 'all 0.12s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (value !== o.id) {
                (e.currentTarget as HTMLElement).style.background = 'rgba(31,78,156,0.08)'
              }
            }}
            onMouseLeave={(e) => {
              if (value !== o.id) {
                (e.currentTarget as HTMLElement).style.background = 'transparent'
              }
            }}
          >
            <input
              type="radio"
              name={`gap-${item.id}`}
              checked={value === o.id}
              onChange={() => onChange(o.id)}
              style={{ display: 'none' }}
            />
            <span style={{ fontWeight: 700, fontSize: 10, opacity: 0.7 }}>{LETTERS[i]}.</span>
            {o.text}
          </label>
        ))}
      </span>
    </span>
  )
}

/* Replace numbered cloze blanks with inline options. */
export function ClozeBlock({ question, answers, onAnswer }: BlockProps) {
  const items = question.items
  if (!question.passage) return null

  return (
    <div>
      <PassageRenderer
        text={question.passage}
        renderGap={(n) => {
          const item = items[n - 1]
          if (!item) return <span className="muted"> (Missing question  {n}）</span>
          return (
            <GapSelect
              item={item}
              value={(answers[item.id] ?? [''])[0] ?? ''}
              onChange={(optionId) => onAnswer(item.id, [optionId])}
              index={n}
            />
          )
        }}
      />
      <div className="muted" style={{ marginTop: 14 }}>

        Select an option for each numbered blank. This exercise has {items.length} blanks and is worth {items.reduce((sum, item) => sum + (item.score ?? 1), 0)} points in total.
      </div>
    </div>
  )
}
