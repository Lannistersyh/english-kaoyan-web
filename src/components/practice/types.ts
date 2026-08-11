import type { Question } from '../../types'

/** 各题型作答组件共享的 props */
export interface BlockProps {
  question: Question
  answers: Record<string, string[]>
  uncertain: Record<string, boolean>
  onAnswer: (itemId: string, answer: string[]) => void
  onUncertain: (itemId: string, v: boolean) => void
}
