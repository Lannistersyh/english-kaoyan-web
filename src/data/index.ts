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

/** 全部内置题目（代码内置，不入 localStorage） */
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
  cloze: '完形填空',
  reading: '阅读理解',
  matching: '新题型',
  translation: '英译汉',
  writing: '写作',
}
