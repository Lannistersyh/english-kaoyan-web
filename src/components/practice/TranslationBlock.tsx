import type { BlockProps } from './types'

/** 翻译作答：显示原句 + 用户译文 + 对照参考译文（作答时折叠，交卷后展示） */
export function TranslationBlock({ question, answers, onAnswer }: BlockProps) {
  const text = (answers[question.id] ?? [''])[0] ?? ''
  return (
    <div>
      <div className="card card--flat" style={{ background: '#f8fafc' }}>
        <div className="form-label">原文（英一翻译为 5 个长难句，这里每句一练）</div>
        <p style={{ fontSize: 15.5, lineHeight: 2, margin: 0 }}>{question.passage}</p>
      </div>
      <div style={{ marginTop: 14 }}>
        <div className="form-label">你的译文（先自己完整译一遍，再对照拆解）</div>
        <textarea
          className="textarea"
          style={{ minHeight: 140 }}
          placeholder="在这里写出你的翻译……"
          value={text}
          onChange={(e) => onAnswer(question.id, [e.target.value])}
        />
      </div>
      <div className="muted" style={{ marginTop: 10 }}>
        提示：先切分句子结构（主谓宾/从句/修饰成分），再调整中文语序，最后意译通顺。
      </div>
    </div>
  )
}
