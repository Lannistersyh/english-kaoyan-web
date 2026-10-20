import type { Question } from '../../types'
import { safeSourceUrl } from '../../utils/questionSource'

export function QuestionProvenance({ question }: { question: Question }) {
  const source = question.provenance
  if (!source) return null
  const href = safeSourceUrl(source.sourceUrl)
  return (
    <div className="study-provenance">
      <b>{source.kind === 'past-exam' ? 'Past exam task' : 'Original mock exercise'}</b>
      {source.year ? ` · ${source.year}` : ''}
      {source.paper ? ` · ${source.paper}` : ''}
      {source.section ? ` · ${source.section}` : ''}
      <p>{source.note}</p>
      {href && <a href={href} target="_blank" rel="noopener noreferrer">View source: {source.sourceName || 'Published paper'}</a>}
    </div>
  )
}
