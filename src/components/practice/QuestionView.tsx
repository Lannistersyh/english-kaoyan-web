import { ClozeBlock } from './ClozeBlock'
import { MatchingBlock } from './MatchingBlock'
import { PubMedReadingView } from './PubMedReadingView'
import { TranslationBlock } from './TranslationBlock'
import { WritingBlock } from './WritingBlock'
import type { BlockProps } from './types'

/* Dispatch answering components by question type */
export function QuestionView(props: BlockProps) {
  const { question } = props
  switch (question.type) {
    case 'cloze':
      return <ClozeBlock {...props} />
    case 'reading':
      // Reading comprehension: PubMed article page format (citation → title → authors → Abstract → question subsections + right-side toolbar)
      return <PubMedReadingView {...props} />
    case 'matching':
      return <MatchingBlock {...props} />
    case 'translation':
      return <TranslationBlock {...props} />
    case 'writing':
      return <WritingBlock {...props} />
  }
}
