import { ClozeBlock } from './ClozeBlock'
import { MatchingBlock } from './MatchingBlock'
import { PassageView } from './PassageView'
import { TranslationBlock } from './TranslationBlock'
import { WritingBlock } from './WritingBlock'
import type { BlockProps } from './types'

/** 按题型分发作答组件 */
export function QuestionView(props: BlockProps) {
  const { question } = props
  switch (question.type) {
    case 'cloze':
      return <ClozeBlock {...props} />
    case 'reading':
      return (
        <div>
          <PassageView question={question} />
          {question.items.map((item, i) => {
            const selected = (props.answers[item.id] ?? [''])[0] ?? ''
            return (
              <div key={item.id} style={{ marginTop: 20 }}>
                <div className="form-label">
                  {i + 1}. {item.stem}
                </div>
                {(item.options ?? []).map((o, idx) => (
                  <div
                    key={o.id}
                    className={`option${selected === o.id ? ' option--selected' : ''}`}
                    onClick={() => props.onAnswer(item.id, [o.id])}
                  >
                    <span className="option__letter">{String.fromCharCode(65 + idx)}.</span>
                    <span>{o.text}</span>
                  </div>
                ))}
                <label className="small muted" style={{ display: 'inline-flex', gap: 6, marginTop: 6 }}>
                  <input
                    type="checkbox"
                    checked={props.uncertain[item.id] ?? false}
                    onChange={(e) => props.onUncertain(item.id, e.target.checked)}
                  />
                  不确定（防止"蒙对"漏进错题档案）
                </label>
              </div>
            )
          })}
        </div>
      )
    case 'matching':
      return <MatchingBlock {...props} />
    case 'translation':
      return <TranslationBlock {...props} />
    case 'writing':
      return <WritingBlock {...props} />
  }
}
