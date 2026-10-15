import type { WrongRecord } from '../types'
import type { GradedAnswer } from './scoring'

/* Only confident, consecutive correct reviews count toward mastery. */
export function updateReviewRecords(records: WrongRecord[], questionId: string, graded: GradedAnswer[], now = Date.now()): WrongRecord[] {
  return records.map(record => {
    if (record.questionId !== questionId) return record
    const answer = graded.find(item => item.itemId === record.itemId)
    if (!answer) return record
    if (answer.correct && !answer.uncertain) {
      const reviewCount = record.reviewCount + 1
      return { ...record, reviewCount, lastReviewAt: now, status: reviewCount >= 2 ? 'mastered' : record.status }
    }
    return {
      ...record, reviewCount: 0, lastReviewAt: now, status: 'active',
      ...(!answer.correct ? { wrongCount: record.wrongCount + 1, lastWrongAt: now, wrongAnswer: answer.answer, correctAnswer: answer.item.correctIds } : {}),
    }
  })
}
