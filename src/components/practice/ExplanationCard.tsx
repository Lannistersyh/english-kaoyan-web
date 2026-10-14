import type { GradedAnswer } from '../../utils/scoring'
import { Tag } from '../ui/Tag'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

function optionLetter(optionId: string, options: { id: string }[] | undefined): string {
  const idx = (options ?? []).findIndex((o) => o.id === optionId)
  return idx === -1 ? '?' : LETTERS[idx]
}

/* Single-question explanation card: answer comparison + synonym substitution + distractor type analysis + familiar word with uncommon meaning */
export function ExplanationCard({ graded }: { graded: GradedAnswer }) {
  const { item, answer, correct, uncertain } = graded
  const options = item.options ?? []
  const isReorder = item.kind === 'reorder'
  const isChoice = item.kind === 'choice' || item.kind === 'gapfill'

  return (
    <div className={`explanation${correct ? ' explanation--correct' : ' explanation--wrong'}`}>
      <div className="flex-row" style={{ marginBottom: 6, gap: 8 }}>
        {correct ? <Tag variant="success"> ✓ Correct </Tag> : <Tag variant="danger"> ✗ Incorrect </Tag>}
        {uncertain && <Tag variant="warning"> ⚠ Unsure </Tag>}
        {isReorder && <Tag variant="plain"> Reorder </Tag>}
      </div>

      {isChoice && (
        <div style={{ marginBottom: 6 }}>
          <span className="small">

             Your answer:
            {answer.length === 0 ? (
              <span className="muted"> (Not answered) </span>
            ) : (
              answer.map((a) => optionLetter(a, options)).join(', ')
            )}
            　
            　 Correct:
            {item.correctIds.map((c) => optionLetter(c, options)).join(', ')}
          </span>
        </div>
      )}
      {isReorder && (
        <div className="small" style={{ marginBottom: 6 }}>

           Your order: {answer.length === 0 ? "(Not answered)" : answer.map(k => LETTERS[Number(k)]).join(' → ')}
          　
          　 Correct: {item.correctIds.map(k => LETTERS[Number(k)]).join(' → ')}
        </div>
      )}

      {item.analysis && (
        <div style={{ marginTop: 6 }}>
          <b className="small"> Solution approach: </b>
          <div>{item.analysis}</div>
        </div>
      )}

      {item.distractors && item.distractors.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <b className="small"> Distractor analysis: </b>
          {item.distractors.map((d) => (
            <div key={d.optionId} className="distractor">
              <span className="distractor__tag">
                <Tag variant="danger">{d.type}</Tag>
              </span>
              <span>
                {optionLetter(d.optionId, options)}   item —  {d.why}
              </span>
            </div>
          ))}
        </div>
      )}

      {item.vocabNotes && item.vocabNotes.length > 0 && (
        <div style={{ marginTop: 8 }} className="small">
          <b> Familiar word with uncommon meaning: </b>
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
