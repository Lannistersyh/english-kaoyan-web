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
  return marks
}

interface Props {
  text: string
  annotations?: PassageAnnotation[]
  renderGap?: (n: number) => ReactNode
}

/* Body text rendering: paragraphing + annotation highlighting + {{n}} placeholder replacement */
export function PassageRenderer({ text, annotations = [], renderGap }: Props) {
  const paragraphs = text.split(/\n\s*\n/)
  const anchored = new Set<string>()
  return (
    <div className="passage">
      {paragraphs.map((p, i) => (
        <p key={i}>{renderSegments(p, annotations, renderGap, anchored)}</p>
      ))}
    </div>
  )
}

function renderSegments(
  text: string,
  annotations: PassageAnnotation[],
  renderGap: Props['renderGap'],
  anchored: Set<string>,
): ReactNode[] {
  const marks = findMarks(text, annotations)
  const gaps = renderGap ? [...text.matchAll(/\{\{(\d+)\}\}/g)].map(match => ({
    start: match.index!, end: match.index! + match[0].length, number: Number(match[1]),
  })) : []
  const points = [...new Set([0, text.length, ...marks.flatMap(mark => [mark.start, mark.end]), ...gaps.flatMap(gap => [gap.start, gap.end])])].sort((a, b) => a - b)
  const out: ReactNode[] = []
  let cursor = 0

  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i]
    if (start < cursor) continue
    const gap = gaps.find(gap => gap.start === start)
    const end = gap?.end ?? points[i + 1]
    let node: ReactNode = gap ? <span className="gap-slot">{renderGap!(gap.number)}</span> : text.slice(start, end)
    const active = marks.filter(mark => mark.start < end && mark.end > start)
    // Preserve every overlapping annotation and give each note a unique jump target.
    for (const mark of [...active].reverse()) {
      const id = `ann-${mark.ann.id}`
      const first = !anchored.has(id)
      anchored.add(id)
      node = <mark id={first ? id : undefined} className={`hl-${mark.ann.type}`}>{node}</mark>
    }
    out.push(<span key={start}>{node}</span>)
    cursor = end
  }
  return out
}
