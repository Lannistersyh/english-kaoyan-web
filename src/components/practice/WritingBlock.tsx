import type { BlockProps } from './types'

/* Writing answering: picture description + writing requirements + user essay + model essay for comparison (collapsed while answering) */
export function WritingBlock({ question, answers, onAnswer }: BlockProps) {
  const text = (answers[question.id] ?? [''])[0] ?? ''
  return (
    <div>
      <section className="study-review-context">
        <div className="form-label"> Picture description </div>
        <p className="study-prose" style={{ margin: 0 }}>{question.figureDescription}</p>
      </section>
      <div className="card card--flat">
        <div className="form-label"> Writing requirements </div>
        <p className="study-prose" style={{ margin: 0 }}>
          {question.writingPrompt}
        </p>
      </div>
      {question.tips && question.tips.length > 0 && (
        <div className="card card--flat">
          <div className="form-label"> Writing framework tips </div>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13.5 }}>
            {question.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}
      <div style={{ marginTop: 14 }}>
        <label className="form-label" htmlFor="writing-answer">Your essay (160-200 words)</label>
        <textarea
          id="writing-answer"
          className="textarea study-editor"
          style={{ minHeight: 260 }}
          placeholder="Write here..."
          value={text}
          onChange={(e) => onAnswer(question.id, [e.target.value])}
        />
      </div>
    </div>
  )
}
