import type { BlockProps } from './types'

/* Translation answering: show the original sentence + user translation + reference translation for comparison (collapsed while answering, displayed after submission) */
export function TranslationBlock({ question, answers, onAnswer }: BlockProps) {
  const text = (answers[question.id] ?? [''])[0] ?? ''
  return (
    <div>
      <section className="study-review-context">
        <div className="form-label"> Original sentence </div>
        <p className="study-prose" style={{ margin: 0 }}>{question.passage}</p>
      </section>
      <div style={{ marginTop: 14 }}>
        <label className="form-label" htmlFor="paraphrase-answer">Your English paraphrase</label>
        <textarea
          id="paraphrase-answer"
          className="textarea study-editor"
          style={{ minHeight: 140 }}
          placeholder="Write your English paraphrase here..."
          value={text}
          onChange={(e) => onAnswer(question.id, [e.target.value])}
        />
      </div>
      <div className="muted" style={{ marginTop: 10 }}>

         Tip: Identify the main claim and modifiers, then restate them in clear English without changing the meaning.
      </div>
    </div>
  )
}
