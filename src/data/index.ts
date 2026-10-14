import type { Question, QuestionType } from '../types'
import { clozeQuestions } from './cloze'
import { readingQuestions } from './reading'
import { matchingQuestions } from './matching'
import { translationQuestions } from './translation'
import { writingQuestions } from './writing'
import { newsArticles } from './news'
import { sciencePhilosophyArticles } from './science-philosophy'

export { builtinVocabulary } from './vocabulary'
export { builtinPatterns } from './patterns'
export { newsArticles } from './news'
export { sciencePhilosophyArticles } from './science-philosophy'

/* All built-in questions (built into the code, not stored in localStorage) */
export const builtinQuestions: Question[] = [
  ...clozeQuestions,
  ...readingQuestions,
  ...matchingQuestions,
  ...translationQuestions,
  ...writingQuestions,
  ...newsArticles,
  ...sciencePhilosophyArticles,
]

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  cloze: "Cloze",
  reading: "Reading Comprehension",
  matching: "New Question Types",
  translation: "Paraphrasing",
  writing: "Writing",
}
