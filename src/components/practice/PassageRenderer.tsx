import type { ReactNode } from 'react'
import type { PassageAnnotation } from '../../types'

interface Mark {
  start: number
  end: number
  ann: PassageAnnotation
}

function findMarks(text: string, annotations: PassageAnnotation[]): Mark[] {
  const marks: Mark[] = []
  for (const ann of annotations) {
    if (!ann.text) continue
    let idx = text.indexOf(ann.text)
    while (idx !== -1) {
      marks.push({ start: idx, end: idx + ann.text.length, ann })
      idx = text.indexOf(ann.text, idx + 1)
    }
  }
  marks.sort((a, b) => a.start - b.start)
  // 合并重叠（保留先出现的）
  const merged: Mark[] = []
  for (const m of marks) {
    const last = merged[merged.length - 1]
    if (last && m.start < last.end) continue
    merged.push(m)
  }
  return merged
}

interface Props {
  text: string
  annotations?: PassageAnnotation[]
  renderGap?: (n: number) => ReactNode
}

/** 正文渲染：段落化 + 标注高亮 + {{n}} 占位替换 */
export function PassageRenderer({ text, annotations = [], renderGap }: Props) {
  const paragraphs = text.split(/\n\s*\n/)
  return (
    <div className="passage">
      {paragraphs.map((p, i) => (
        <p key={i}>{renderSegments(p, annotations, renderGap)}</p>
      ))}
    </div>
  )
}

function renderSegments(
  text: string,
  annotations: PassageAnnotation[],
  renderGap?: (n: number) => ReactNode,
): ReactNode[] {
  const marks = findMarks(text, annotations)
  const out: ReactNode[] = []
  let pos = 0
  let markIdx = 0
  let key = 0

  while (pos < text.length) {
    // 下一个 mark
    let nextMark = markIdx < marks.length && marks[markIdx].start >= pos ? marks[markIdx] : undefined

    // 下一个 {{n}} 占位符（在整个文本中搜索，不限于开头）
    let gapPos = -1
    let gapNum = 0
    if (renderGap) {
      const m = /\{\{(\d+)\}\}/.exec(text.slice(pos))
      if (m) {
        gapPos = pos + m.index
        gapNum = parseInt(m[1], 10)
      }
    }

    // 没有更多 mark 也没有更多 gap → 输出剩余文本结束
    if (!nextMark && gapPos === -1) {
      out.push(text.slice(pos))
      break
    }

    // mark 在 gap 之前 → 先处理 mark
    if (nextMark && (gapPos === -1 || nextMark.start < gapPos)) {
      if (nextMark.start > pos) out.push(text.slice(pos, nextMark.start))
      out.push(
        <mark key={key++} id={`ann-${nextMark.ann.id}`} className={`hl-${nextMark.ann.type}`}>
          {text.slice(nextMark.start, nextMark.end)}
        </mark>,
      )
      pos = nextMark.end
      markIdx++
    } else {
      // 处理 gap（{{n}} 占位符）
      if (gapPos > pos) out.push(text.slice(pos, gapPos))
      out.push(<span key={key++} className="gap-slot">{renderGap!(gapNum)}</span>)
      pos = gapPos + `{{${gapNum}}}`.length
    }
  }
  return out
}
