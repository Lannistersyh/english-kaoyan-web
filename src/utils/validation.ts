import { STORAGE_KEYS, type StorageKey } from '../types'

type RecordValue = Record<string, unknown>
const object = (value: unknown): value is RecordValue => value !== null && typeof value === 'object' && !Array.isArray(value)
const text = (value: unknown): value is string => typeof value === 'string'
const strings = (value: unknown) => Array.isArray(value) && value.every(text)
const number = (value: unknown) => typeof value === 'number' && Number.isFinite(value) && value >= 0
const id = (value: unknown) => text(value) && value.trim().length > 0 && !['__proto__', 'constructor', 'prototype'].includes(value)
const optional = (row: RecordValue, key: string, check: (value: unknown) => boolean) => row[key] === undefined || check(row[key])
const oneOf = (value: unknown, choices: readonly string[]) => text(value) && choices.includes(value)
function list(value: unknown, check: (row: RecordValue) => boolean): boolean {
  return Array.isArray(value) && value.every(row => object(row) && check(row))
}
function records(value: unknown, check: (row: unknown) => boolean): boolean {
  return object(value) && Object.entries(value).every(([key, row]) => key.trim().length > 0 && check(row))
}
const option = (row: RecordValue) => id(row.id) && text(row.text)
const subQuestion = (row: RecordValue): boolean => id(row.id) && oneOf(row.kind, ['choice', 'gapfill', 'reorder', 'freeform']) && strings(row.correctIds)
  && optional(row, 'stem', text) && optional(row, 'score', number) && optional(row, 'analysis', text)
  && optional(row, 'options', value => list(value, option)) && optional(row, 'optionPoolId', id)
  && optional(row, 'fixedFirstId', id) && optional(row, 'reorderItems', strings) && optional(row, 'vocabNotes', strings)
  && optional(row, 'distractors', value => list(value, d => id(d.optionId) && text(d.type) && text(d.why)))
const question = (row: RecordValue): boolean => id(row.id) && text(row.title) && text(row.sourceLabel)
  && oneOf(row.type, ['cloze', 'reading', 'matching', 'translation', 'writing']) && oneOf(row.source, ['builtin', 'imported'])
  && list(row.items, subQuestion) && optional(row, 'suggestedMinutes', number)
  && ['passage', 'referenceTranslation', 'figureDescription', 'writingPrompt', 'referenceEssay'].every(key => optional(row, key, text))
  && ['tips', 'vocabNotes', 'essayPatternIds'].every(key => optional(row, key, strings))
  && optional(row, 'optionPools', value => records(value, pool => list(pool, option)))
  && optional(row, 'passageAnnotations', value => list(value, a => id(a.id) && oneOf(a.type, ['claim', 'evidence', 'attitude', 'keyword']) && text(a.text) && text(a.note)))
  && optional(row, 'translationSteps', value => list(value, step => [1, 2, 3].includes(step.step as number) && text(step.zh)))
const answer = (row: RecordValue) => id(row.itemId) && strings(row.answer) && typeof row.uncertain === 'boolean'
  && typeof row.correct === 'boolean' && number(row.timeSpent) && optional(row, 'selfScore', value => number(value) && (value as number) <= 10)
  && optional(row, 'aiComment', text)

/* Check nested records before they reach components or replace a valid backup. */
export function validStoredData(key: StorageKey, value: unknown): boolean {
  switch (key) {
    case STORAGE_KEYS.questions:
      return list(value, question)
    case STORAGE_KEYS.sessions:
      return list(value, row => id(row.id) && id(row.questionId) && number(row.startedAt) && optional(row, 'finishedAt', number)
        && list(row.answers, answer) && number(row.score) && number(row.total) && optional(row, 'isReview', v => typeof v === 'boolean'))
    case STORAGE_KEYS.wrongRecords:
      return list(value, row => ['id', 'questionId', 'itemId'].every(key => id(row[key]))
        && ['firstWrongAt', 'lastWrongAt', 'wrongCount', 'reviewCount'].every(key => number(row[key]))
        && strings(row.wrongAnswer) && strings(row.correctAnswer) && ['myThought', 'distractorTrap', 'correctMapping'].every(key => text(row[key]))
        && oneOf(row.status, ['active', 'mastered']) && optional(row, 'lastReviewAt', number))
    case STORAGE_KEYS.progress:
      return records(value, row => object(row) && ['attempts', 'bestScore', 'total', 'lastAt'].every(key => number(row[key])) && typeof row.completed === 'boolean')
    case STORAGE_KEYS.vocab:
      return list(value, row => id(row.id) && text(row.word) && text(row.partOfSpeech) && strings(row.meanings) && text(row.example)
        && typeof row.builtin === 'boolean' && optional(row, 'note', text))
    case STORAGE_KEYS.vocabProgress:
      return records(value, row => oneOf(row, ['unfamiliar', 'familiar', 'mastered']))
    case STORAGE_KEYS.patterns:
      return list(value, row => id(row.id) && oneOf(row.category, ['introduction', 'describePicture', 'thesis', 'example', 'cause', 'concession', 'conclusion', 'suggestion'])
        && text(row.en) && text(row.zh) && optional(row, 'usage', text) && typeof row.builtin === 'boolean')
    case STORAGE_KEYS.settings:
      return object(value) && typeof value.promptThinkingOnWrong === 'boolean'
    case STORAGE_KEYS.dictHistory:
      return records(value, row => object(row) && number(row.count) && typeof row.unlocked === 'boolean' && number(row.timestamp))
  }
}
