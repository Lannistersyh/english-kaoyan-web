import { builtinQuestions } from '../data'
import type { Question, QuestionType } from '../types'
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
