/**
 * 全部数据模型与 localStorage key 约定（系统契约层）
 * 修改结构时请同步提升 STORAGE_VERSION 并写迁移函数
 */

// ========== 题型 ==========

export type QuestionType = 'cloze' | 'reading' | 'matching' | 'translation' | 'writing'
export type QuestionSource = 'builtin' | 'imported'

/** 小题作答方式 */
export type SubQuestionKind =
  | 'choice' // 单选：阅读小题 / 完形每空 / 小标题
  | 'gapfill' // 7选5：共享选项池，每空选一
  | 'reorder' // 排序：打乱段落，排成正确顺序
  | 'freeform' // 主观题（翻译/写作整题），无标准选项，自评

// ========== 题目 ==========

export interface Option {
  id: string
  text: string
}

/** 干扰项分析（阅读核心训练点） */
export type DistractorType =
  | '偷换概念'
  | '局部正确'
  | '因果倒置'
  | '过度推断'
  | '无中生有'
  | '张冠李戴'

export interface DistractorAnalysis {
  optionId: string
  type: DistractorType
  why: string // 该干扰项如何诱导、对应原文哪处
}

export interface SubQuestion {
  id: string
  kind: SubQuestionKind
  stem?: string // 阅读题干 / 小标题题目标题；完形空格由正文 {{n}} 定位
  options?: Option[] // choice：本题选项；gapfill 用 optionPoolId 引用共享池
  optionPoolId?: string // 7选5 共享选项池
  correctIds: string[] // choice/gapfill: [正确项id]；reorder: 正确顺序的 key 数组
  reorderItems?: string[] // 排序题：乱序片段（下标即 key）
  analysis?: string // 解题思路：正确项如何同义替换原文
  distractors?: DistractorAnalysis[]
  vocabNotes?: string[] // 熟词僻义/生词注释
  score?: number // 默认 1
}

/** 文章逻辑可视化标注（Claim vs Evidence、作者态度） */
export interface PassageAnnotation {
  id: string
  type: 'claim' | 'evidence' | 'attitude' | 'keyword'
  text: string // 要高亮的原文片段（渲染时匹配，全部出现处高亮）
  note: string // 批注
}

/** 翻译三步法：1切分 → 2重组 → 3意译 */
export interface TranslationStep {
  step: 1 | 2 | 3
  zh: string // 该步骤的参考内容
}

export interface Question {
  id: string
  type: QuestionType
  source: QuestionSource
  sourceLabel: string // '模拟题' / '2024真题 Text2'
  title: string
  suggestedMinutes?: number
  passage?: string // 文章/正文（完形空位 {{n}}，7选5 空位 {{n}}）
  passageAnnotations?: PassageAnnotation[]
  optionPools?: Record<string, Option[]> // 7选5 共享选项池（optionPoolId → 选项）
  items: SubQuestion[]
  // ---- 翻译题 ----
  referenceTranslation?: string
  translationSteps?: TranslationStep[]
  // ---- 写作题 ----
  figureDescription?: string // 图画描述文字
  writingPrompt?: string // 写作要求
  referenceEssay?: string
  essayPatternIds?: string[] // 范文用到的句型 id
  // ---- 通用 ----
  tips?: string[] // 大题级提示
  vocabNotes?: string[] // 题级生词/熟词僻义注释（翻译写作题用）
  schemaVersion?: number
}

// ========== 作答记录与练习 Session ==========

export interface AnswerRecord {
  itemId: string
  answer: string[] // choice/gapfill: [选项id]；reorder: [key数组]；freeform: []
  uncertain: boolean // "不确定"标记（答对但蒙对 → 可入错题档）
  correct: boolean
  selfScore?: number // 翻译/写作自评 0-10
  aiComment?: string // AI 评分点评
  timeSpent: number // 秒
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

// ========== 错题思维档案（三问为核心） ==========

export interface WrongRecord {
  id: string
  questionId: string
  itemId: string
  firstWrongAt: number
  lastWrongAt: number
  wrongCount: number
  wrongAnswer: string[]
  correctAnswer: string[]
  myThought: string // ① 我当时怎么想的
  distractorTrap: string // ② 干扰项如何诱导我
  correctMapping: string // ③ 正确选项如何同义替换
  status: 'active' | 'mastered'
  reviewCount: number
  lastReviewAt?: number
}

// ========== 进度与词库 ==========

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
  meanings: string[] // 常见义 + 僻义
  example: string
  note?: string
  builtin: boolean
}
export type VocabStatus = 'unfamiliar' | 'familiar' | 'mastered'
export type VocabProgress = Record<string, VocabStatus>

export type PatternCategory =
  | 'introduction' // 引出话题
  | 'describePicture' // 描述图画
  | 'thesis' // 点明主旨
  | 'example' // 举例论证
  | 'cause' // 因果分析
  | 'concession' // 让步转折
  | 'conclusion' // 总结
  | 'suggestion' // 建议

export interface Pattern {
  id: string
  category: PatternCategory
  en: string
  zh: string
  usage?: string
  builtin: boolean
}

// ========== 设置与导入 ==========

export interface Settings {
  promptThinkingOnWrong: boolean // 交卷后自动弹出三问表单
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
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]
