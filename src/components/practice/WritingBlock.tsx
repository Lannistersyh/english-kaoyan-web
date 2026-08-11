import type { BlockProps } from './types'

/** 写作作答：图画描述 + 写作要求 + 用户作文 + 对照范文（作答时折叠） */
export function WritingBlock({ question, answers, onAnswer }: BlockProps) {
  const text = (answers[question.id] ?? [''])[0] ?? ''
  return (
    <div>
      <div className="card card--flat" style={{ background: '#f8fafc' }}>
        <div className="form-label">图画描述</div>
        <p style={{ margin: 0 }}>{question.figureDescription}</p>
      </div>
      <div className="card card--flat">
        <div className="form-label">写作要求</div>
        <p className="muted" style={{ margin: 0 }}>
          {question.writingPrompt}
        </p>
      </div>
      {question.tips && question.tips.length > 0 && (
        <div className="card card--flat">
          <div className="form-label">写作框架提示</div>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13.5 }}>
            {question.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}
      <div style={{ marginTop: 14 }}>
        <div className="form-label">你的作文（160-200 词）</div>
        <textarea
          className="textarea"
          style={{ minHeight: 260 }}
          placeholder="在这里写作……"
          value={text}
          onChange={(e) => onAnswer(question.id, [e.target.value])}
        />
      </div>
    </div>
  )
}
