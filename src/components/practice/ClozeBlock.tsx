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
        <span className="gap-select gap-select--empty">（无选项）</span>
      </span>
    )
  }

  // 用 radio 按钮替代下拉框，选项一目了然
  return (
    <span className="gap-slot" style={{ display: 'inline-block', verticalAlign: 'middle', margin: '2px 4px' }}>
      <span style={{
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

/** 完形填空：正文 {{n}} 占位替换为行内单选按钮 */
export function ClozeBlock({ question, answers, onAnswer }: BlockProps) {
  const items = question.items
  if (!question.passage) return null

  return (
    <div>
      <PassageRenderer
        text={question.passage}
        renderGap={(n) => {
          const item = items[n - 1]
          if (!item) return <span className="muted">（缺题 {n}）</span>
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
        💡 点击文中蓝色标签直接选择答案（A/B/C/D），选中后变蓝底白字。完形每题 0.5 分，错 3 题以内才能拿到目标 8 分。
      </div>
    </div>
  )
}
