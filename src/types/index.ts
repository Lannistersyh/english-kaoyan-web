/* * All data models and localStorage key conventions (system contract layer)
 * When modifying the structure, please also bump STORAGE_VERSION and write a migration function */

// ========== Question types ==========

export type QuestionType = 'cloze' | 'reading' | 'matching' | 'translation' | 'writing'
export type QuestionSource = 'builtin' | 'imported'

/* Answer mode for sub-questions */
export type SubQuestionKind =
  | 'choice' // Single choice: reading sub-questions / each cloze blank / subheadings
  | 'gapfill' // 7-choose-5: shared option pool, choose one for each blank
  | 'reorder' // Reorder: shuffle paragraphs, arrange into the correct order
  | 'freeform' // Subjective questions (translation/writing as a whole), no standard options, self-assessed

// ========== Questions ==========

export interface Option {
  id: string
  text: string
}

/* Distractor analysis (core training point for reading) */
export type DistractorType =
  | "Concept substitution"
  | "Partially true"
  | "Reversed causality"
  | "Over-inference"
  | "Unsupported claim"
  | "Misattribution"
  | "Opposite meaning"
  | "Literal misreading"
  | "Over-specific claim"
  | "Degree error"
  | "Irrelevant option"
  | "Surface reading"

export interface DistractorAnalysis {
  optionId: string
  type: DistractorType
  why: string // How this distractor misleads and which part of the passage it corresponds to
}

export interface SubQuestion {
  id: string
  kind: SubQuestionKind
  stem?: string // Reading question stem / subheading question title; cloze blanks are located by {{n}} in the passage
  options?: Option[] // choice: options for this question; gapfill uses optionPoolId to reference the shared pool
  optionPoolId?: string // 7-choose-5 shared option pool
  correctIds: string[] // choice/gapfill: [correct option id]; reorder: array of keys in the correct order
  fixedFirstId?: string // The key of the first paragraph already given for reorder questions
  reorderItems?: string[] // Reorder: shuffled segments (index is the key)
  analysis?: string // Solution approach: how the correct option paraphrases the passage
  distractors?: DistractorAnalysis[]
  vocabNotes?: string[] // Notes on uncommon meanings of familiar words / new words
  score?: number // Default 1
}

/* Visual annotation of passage logic (Claim vs Evidence, author's attitude) */
export interface PassageAnnotation {
  id: string
  type: 'claim' | 'evidence' | 'attitude' | 'keyword'
  text: string // Passage fragments to highlight (matched during rendering, all occurrences highlighted)
  note: string // Annotation
}

/* Three-step paraphrasing method: 1 segment → 2 reorganize → 3 paraphrase */
export interface TranslationStep {
  step: 1 | 2 | 3
  zh: string // Reference content for this step
}

export interface Question {
  id: string
  type: QuestionType
  source: QuestionSource
  sourceLabel: string // 'Mock exam' / '2024 real exam Text2'
  title: string
  suggestedMinutes?: number
  passage?: string // Passage/text (cloze blanks {{n}}, 7-choose-5 blanks {{n}})
  passageAnnotations?: PassageAnnotation[]
  optionPools?: Record<string, Option[]> // 7-choose-5 shared option pool (optionPoolId → options)
  items: SubQuestion[]
  // ---- Translation questions ----
  referenceTranslation?: string
  translationSteps?: TranslationStep[]
  // ---- Writing questions ----
  figureDescription?: string // Picture description text
  writingPrompt?: string // Writing requirements
  referenceEssay?: string
  essayPatternIds?: string[] // IDs of sentence patterns used in the model essay
  // ---- General ----
  tips?: string[] // Question-level prompt
  vocabNotes?: string[] // Question-level notes on new words / uncommon meanings of familiar words (for translation and writing questions)
  schemaVersion?: number
}

// ========== Answer records and practice Session ==========

export interface AnswerRecord {
  itemId: string
  answer: string[] // choice/gapfill: [option ids]; reorder: [key array]; freeform: []
  uncertain: boolean // "Unsure" mark (answered correctly but guessed → can be added to wrong question archive)
  correct: boolean
  selfScore?: number // Translation/writing self-assessment 0-10
  aiComment?: string // AI scoring comments
  timeSpent: number // seconds
}

export interface Session {
  id: string
  questionId: string
  startedAt: number
  finishedAt?: number
  answers: AnswerRecord[]
  score: number
  total: number
  isReview?: boolean
}

// ========== Wrong question thinking archive (three questions as the core) ==========

export interface WrongRecord {
  id: string
  questionId: string
  itemId: string
  firstWrongAt: number
  lastWrongAt: number
  wrongCount: number
  wrongAnswer: string[]
  correctAnswer: string[]
  myThought: string // ① What I was thinking at the time
  distractorTrap: string // ② How the distractor misled me
  correctMapping: string // ③ How the correct option paraphrases
  status: 'active' | 'mastered'
  reviewCount: number
  lastReviewAt?: number
}

// ========== Progress and vocabulary ==========

export interface QuestionProgress {
  attempts: number
  bestScore: number
  total: number
  lastAt: number
  completed: boolean
}
export type Progress = Record<string, QuestionProgress>

export interface VocabItem {
  id: string
  word: string
  partOfSpeech: string
  meanings: string[] // Common meaning + uncommon meaning
  example: string
  note?: string
  builtin: boolean
}
export type VocabStatus = 'unfamiliar' | 'familiar' | 'mastered'
export type VocabProgress = Record<string, VocabStatus>

export type PatternCategory =
  | 'introduction' // Introduce the topic
  | 'describePicture' // Describe the picture
  | 'thesis' // State the main idea
  | 'example' // Give examples for argumentation
  | 'cause' // Causal analysis
  | 'concession' // Concession and transition
  | 'conclusion' // Summary
  | 'suggestion' // Suggestions

export interface Pattern {
  id: string
  category: PatternCategory
  en: string
  zh: string
  usage?: string
  builtin: boolean
}

// ========== Settings and import ==========

export interface Settings {
  promptThinkingOnWrong: boolean // Automatically pop up the three-question form after submitting
}

export interface ImportError {
  line: number
  message: string
}

export interface ImportResult {
  questions: Question[]
  errors: ImportError[]
}

// ========== localStorage ==========

export const STORAGE_VERSION = 1

export const STORAGE_KEYS = {
  questions: 'ekw:questions',
  sessions: 'ekw:sessions',
  wrongRecords: 'ekw:wrongRecords',
  progress: 'ekw:progress',
  vocab: 'ekw:vocab',
  vocabProgress: 'ekw:vocabProgress',
  patterns: 'ekw:patterns',
  settings: 'ekw:settings',
  dictHistory: 'ekw:dictHistory',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]
