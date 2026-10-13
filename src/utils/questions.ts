import { builtinQuestions } from '../data'
import type { Question, QuestionType, SubQuestion } from '../types'
import { STORAGE_KEYS } from '../types'
import { load } from './storage'

/** 全部题目：内置 + 导入（localStorage） */
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

/** 共享选项池统一补到小题，供结果、错题和三问展示。 */
export function resolveItem(question: Question, item: SubQuestion): SubQuestion {
  return { ...item, options: item.options ?? question.optionPools?.[item.optionPoolId ?? ''] }
}
