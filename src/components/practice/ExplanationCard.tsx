import type { GradedAnswer } from '../../utils/scoring'
import { Tag } from '../ui/Tag'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

function optionLetter(optionId: string, options: { id: string }[] | undefined): string {
  const idx = (options ?? []).findIndex((o) => o.id === optionId)
  return idx === -1 ? '?' : LETTERS[idx]
}

/** 单题解析卡：答案对照 + 同义替换 + 干扰项类型分析 + 熟词僻义 */
export function ExplanationCard({ graded }: { graded: GradedAnswer }) {
  const { item, answer, correct, uncertain } = graded
  const options = item.options ?? []
  const isReorder = item.kind === 'reorder'
  const isChoice = item.kind === 'choice' || item.kind === 'gapfill'

  return (
    <div className={`explanation${correct ? ' explanation--correct' : ' explanation--wrong'}`}>
      <div className="flex-row" style={{ marginBottom: 6, gap: 8 }}>
        {correct ? <Tag variant="success">✓ 答对</Tag> : <Tag variant="danger">✗ 答错</Tag>}
        {uncertain && <Tag variant="warning">⚠ 不确定</Tag>}
        {isReorder && <Tag variant="plain">排序</Tag>}
      </div>

      {isChoice && (
        <div style={{ marginBottom: 6 }}>
          <span className="small">
            你的答案：
            {answer.length === 0 ? (
              <span className="muted">（未作答）</span>
            ) : (
              answer.map((a) => optionLetter(a, options)).join(', ')
            )}
            　正确：
            {item.correctIds.map((c) => optionLetter(c, options)).join(', ')}
          </span>
        </div>
      )}
      {isReorder && (
        <div className="small" style={{ marginBottom: 6 }}>
          你的顺序：{answer.length === 0 ? '（未作答）' : answer.join(' → ')}
          　正确：{item.correctIds.join(' → ')}
        </div>
      )}

      {item.analysis && (
        <div style={{ marginTop: 6 }}>
          <b className="small">解题思路：</b>
          <div>{item.analysis}</div>
        </div>
      )}

      {item.distractors && item.distractors.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <b className="small">干扰项分析：</b>
          {item.distractors.map((d) => (
            <div key={d.optionId} className="distractor">
              <span className="distractor__tag">
                <Tag variant="danger">{d.type}</Tag>
              </span>
              <span>
                {optionLetter(d.optionId, options)} 项 —— {d.why}
              </span>
            </div>
          ))}
        </div>
      )}

      {item.vocabNotes && item.vocabNotes.length > 0 && (
        <div style={{ marginTop: 8 }} className="small">
          <b>熟词僻义：</b>
          <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
            {item.vocabNotes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
