import { ClozeBlock } from './ClozeBlock'
import { MatchingBlock } from './MatchingBlock'
import { PubMedReadingView } from './PubMedReadingView'
import { TranslationBlock } from './TranslationBlock'
import { WritingBlock } from './WritingBlock'
import type { BlockProps } from './types'

/** 按题型分发作答组件 */
export function QuestionView(props: BlockProps) {
  const { question } = props
  switch (question.type) {
    case 'cloze':
      return <ClozeBlock {...props} />
    case 'reading':
      // 阅读理解：PubMed 文章页形式（引文→标题→作者→Abstract→小题小节+右侧工具栏）
      return <PubMedReadingView {...props} />
    case 'matching':
      return <MatchingBlock {...props} />
    case 'translation':
      return <TranslationBlock {...props} />
    case 'writing':
      return <WritingBlock {...props} />
  }
}
