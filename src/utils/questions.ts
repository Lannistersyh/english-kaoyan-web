import { builtinQuestions } from '../data'
import type { Question, QuestionType, SubQuestion } from '../types'
import { STORAGE_KEYS } from '../types'
import { load } from './storage'

/* All questions: built-in + imported (localStorage) */
export function getAllQuestions(): Question[] {
  const imported = load<Question[]>(STORAGE_KEYS.questions, [])
  return [...builtinQuestions, ...imported]
}

export function getQuestion(id: string): Question | undefined {
  return getAllQuestions().find((q) => q.id === id)
}

export function getQuestionsByType(type: QuestionType): Question[] {
  return getAllQuestions().filter((q) => q.type === type)
}

/* Shared option pool is uniformly filled into sub-questions for display in results, wrong answers, and the three-question view. */
export function resolveItem(question: Question, item: SubQuestion): SubQuestion {
  return { ...item, options: item.options ?? question.optionPools?.[item.optionPoolId ?? ''] }
}
