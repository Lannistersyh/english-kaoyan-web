import type { AnswerRecord, SubQuestion } from '../types'

/**
 * 客观题判分：
 * - choice/gapfill：答案 id 与 correctIds 比对
 * - reorder：数组全等比较
 * - freeform：不判对错，由用户自评（correct 恒 false）
 */
export function judgeAnswer(item: SubQuestion, answer: string[]): boolean {
  if (item.kind === 'freeform') return false
  if (item.kind === 'reorder') {
    if (answer.length !== item.correctIds.length) return false
    return answer.every((a, i) => a === item.correctIds[i])
  }
  // choice / gapfill
  if (answer.length !== item.correctIds.length) return false
  const sortedAnswer = [...answer].sort()
  const sortedCorrect = [...item.correctIds].sort()
  return sortedAnswer.every((a, i) => a === sortedCorrect[i])
}

export interface GradedAnswer extends AnswerRecord {
  item: SubQuestion
}

/** 对一次作答进行判分，返回逐题判定结果与得分 */
export function gradeAnswers(
  items: SubQuestion[],
  rawAnswers: Record<string, string[]>,
  uncertainFlags: Record<string, boolean>,
): { graded: GradedAnswer[]; score: number; total: number } {
  const graded: GradedAnswer[] = items.map((item) => {
    const answer = rawAnswers[item.id] ?? []
    const correct = judgeAnswer(item, answer)
    return {
      itemId: item.id,
      answer,
      uncertain: uncertainFlags[item.id] ?? false,
      correct,
      timeSpent: 0,
      item,
    }
  })
  const total = items.reduce((s, it) => s + (it.score ?? 1), 0)
  const score = graded.reduce(
    (s, g) => s + (g.correct ? (g.item.score ?? 1) : 0),
    0,
  )
  return { graded, score, total }
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
