import type { Question } from '../../types'
import { PassageRenderer } from './PassageRenderer'

const ANNOTATION_LABELS = {
  claim: '论点 Claim',
  evidence: '论据 Evidence',
  attitude: '态度 Attitude',
  keyword: '关键词',
} as const

/** 阅读文章视图：标注高亮 + 结构笔记（点击滚动定位） */
export function PassageView({ question }: { question: Question }) {
  const annotations = question.passageAnnotations ?? []
  if (!question.passage) return null

  return (
    <div>
      <PassageRenderer text={question.passage} annotations={annotations} />
      {annotations.length > 0 && (
        <div className="notes-panel">
          <div className="form-label" style={{ marginBottom: 8 }}>
            文章结构笔记（点击高亮定位）
          </div>
          {annotations.map((a) => (
            <div
              key={a.id}
              className="notes-item"
              onClick={() =>
                document.getElementById(`ann-${a.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }
            >
              <span className={`notes-item__type notes-item__type--${a.type}`}>
                {ANNOTATION_LABELS[a.type]}
              </span>
              <span>
                {a.note}
                <span className="muted"> 「{a.text.length > 40 ? `${a.text.slice(0, 40)}…` : a.text}」</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
