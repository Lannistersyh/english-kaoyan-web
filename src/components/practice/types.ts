import type { Question } from '../../types'

/* Props shared by answering components for each question type */
export interface BlockProps {
  question: Question
  answers: Record<string, string[]>
  uncertain: Record<string, boolean>
  onAnswer: (itemId: string, answer: string[]) => void
  onUncertain: (itemId: string, v: boolean) => void
}
