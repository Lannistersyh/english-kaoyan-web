import type { SubQuestion } from '../../types'
import { PassageRenderer } from './PassageRenderer'
import type { BlockProps } from './types'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

function ReorderBody({ item, answer, onAnswer }: { item: SubQuestion; answer: string[]; onAnswer: (a: string[]) => void }) {
  const items = item.reorderItems ?? []
  const chosen = new Set(answer)

  return (
    <div>
      <div className="form-label">已排顺序（点击右侧 × 可移除；首段 B 已固定）</div>
      <div className="reorder-answer" style={{ marginBottom: 14 }}>
        {answer.length === 0 && <span className="muted">从下方段落中依次点击，按你认为的正确顺序排列</span>}
        {answer.map((key) => (
          <span
            key={key}
            className="reorder-chip"
            onClick={() => onAnswer(answer.filter((k) => k !== key))}
            title="点击移除"
          >
            {LETTERS[parseInt(key, 10)]}
            <span className="small">×</span>
          </span>
        ))}
      </div>
      <div className="form-label">待选段落（点击加入顺序）</div>
      <div className="reorder-pool">
        {items.map((t, idx) => {
          const key = String(idx)
          return (
            <div
              key={key}
              className={`reorder-item${chosen.has(key) ? ' reorder-item--chosen' : ''}`}
              onClick={() => (chosen.has(key) ? undefined : onAnswer([...answer, key]))}
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

/** 新题型：7选5（gapfill）/ 排序（reorder）/ 小标题（choice） */
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
                  onChange={(e) => onAnswer(item.id, [e.target.value])}
                  style={{ minWidth: 200 }}
                >
                  <option value="">请选择…</option>
                  {pool.map((o, i) => (
                    <option key={o.id} value={o.id}>
                      {LETTERS[i]}
                    </option>
                  ))}
                </select>
              </span>
            )
          }}
        />
        <div style={{ marginTop: 14 }}>
          <div className="form-label">选项池（每句只能用一次）</div>
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
          排序题逻辑链：留意每段首尾的代词指代与逻辑连接词（yet, what matters most, in the end…）。
        </div>
      </div>
    )
  }

  // 小标题（choice）
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
                className={`option${selected === o.id ? ' option--selected' : ''}`}
                onClick={() => onAnswer(item.id, [o.id])}
              >
                <span className="option__letter">{LETTERS[i]}.</span>
                <span>{o.text}</span>
              </div>
            ))}
            <label className="small muted" style={{ display: 'inline-flex', gap: 6, marginTop: 6 }}>
              <input type="checkbox" checked={uncertain[item.id] ?? false} onChange={(e) => onUncertain(item.id, e.target.checked)} />
              不确定
            </label>
          </div>
        )
      })}
    </div>
  )
}
