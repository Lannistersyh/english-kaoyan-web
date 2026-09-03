import type {
  DistractorType,
  ImportResult,
  Option,
  Question,
  SubQuestion,
  TranslationStep,
} from '../types'
import { uid } from './ids'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

const TYPE_MAP: Record<string, Question['type']> = {
  完形: 'cloze',
  完形填空: 'cloze',
  阅读: 'reading',
  阅读理解: 'reading',
  新题型: 'matching',
  排序: 'matching',
  七选五: 'matching',
  翻译: 'translation',
  英译汉: 'translation',
  写作: 'writing',
  图画作文: 'writing',
}

const DISTRACTOR_TYPES: DistractorType[] = ['偷换概念', '局部正确', '因果倒置', '过度推断', '无中生有', '张冠李戴']

interface PendingItem {
  stem?: string
  kind: SubQuestion['kind']
  options?: Option[]
  optionPoolId?: string
  reorderItems?: string[]
  answerLetters: string[]
  analysis?: string
  distractors: { letter: string; type: DistractorType; why: string }[]
  done?: boolean // 已物化，防止重复入列
}

/**
 * 真题粘贴文本解析器（行式协议，宽容输入、明确报错）。
 * 支持：阅读/完形/小标题（choice）、7选5（gapfill）、排序（reorder）、翻译、写作。
 */
export function parseImport(text: string): ImportResult {
  const errors: ImportResult['errors'] = []
  const questions: Question[] = []

  // 限制导入大小（100KB）
  const MAX_SIZE = 100 * 1024
  if (text.length > MAX_SIZE) {
    errors.push({ line: 0, message: `文本过大（${Math.round(text.length / 1024)}KB），请控制在 100KB 以内。建议分批导入。` })
    return { questions, errors }
  }

  const lines = text.split(/\r?\n/)

  let q: Question = newQuestion()
  let passages: string[] = []
  let item: PendingItem | null = null
  /** 当前题尚未定答案的小题（按创建顺序），供 [答案] 分发 */
  let openItems: PendingItem[] = []
  let reorderMode = false
  let pool: Option[] | null = null
  let poolId: string | null = null
  let stepLines: Partial<Record<1 | 2 | 3, string>> = {}
  let writingSection: 'figure' | 'prompt' | 'essay' | null = null
  /** 7选5：由 [答案] 的字母数延迟创建空位小题，期间 [解析]/[干扰项] 挂到 pending 上共享 */
  let gapPending: { letters: string[]; analyses: string[]; distractors: { letter: string; type: DistractorType; why: string }[] } | null = null

  const pushError = (lineNo: number, message: string) => errors.push({ line: lineNo, message })

  const finalizeItem = (pending?: PendingItem) => {
    const it = pending ?? item
    if (!it || it.done) return
    it.done = true
    const allOptions = it.kind === 'gapfill' ? pool ?? [] : it.options ?? []
    const correctIds: string[] = []
    if (it.kind === 'reorder') {
      // 字母 → reorderItems 下标（段落按出现顺序即 A,B,C...）
      correctIds.push(
        ...it.answerLetters.map((l) => {
          const idx = LETTERS.indexOf(l.toUpperCase())
          if (idx === -1 || idx >= (it.reorderItems ?? []).length) {
            pushError(0, `排序题答案字母 ${l} 超出段落范围`)
            return null
          }
          return String(idx)
        }).filter((x): x is string => x !== null),
      )
    } else {
      for (const letter of it.answerLetters) {
        const idx = LETTERS.indexOf(letter.toUpperCase())
        if (idx === -1) {
          pushError(0, `小题「${it.stem ?? ''}」答案字母 ${letter} 无法识别`)
          continue
        }
        const opt = allOptions[idx]
        if (opt) correctIds.push(opt.id)
        else pushError(0, `小题「${it.stem ?? ''}」答案 ${letter} 超出选项范围`)
      }
    }
    q.items.push({
      id: uid('it'),
      kind: it.kind,
      stem: it.stem,
      options: it.options,
      optionPoolId: it.kind === 'gapfill' ? poolId ?? undefined : undefined,
      reorderItems: it.reorderItems,
      correctIds,
      analysis: it.analysis,
      distractors: it.distractors.map((d) => {
        const idx = LETTERS.indexOf(d.letter.toUpperCase())
        return { optionId: allOptions[idx]?.id ?? `unknown-${d.letter}`, type: d.type, why: d.why }
      }),
    })
    if (!pending) item = null
  }

  /** 把挂起的 7选5 答案物化成空位小题 */
  const materializeGap = () => {
    if (!gapPending) return
    const sharedAnalysis = gapPending.analyses.join('\n') || undefined
    gapPending.letters.forEach((letter, i) => {
      const idx = LETTERS.indexOf(letter.toUpperCase())
      const opt = pool?.[idx]
      if (!opt) pushError(0, `第 ${i + 1} 个空：答案 ${letter} 超出选项池范围`)
      q.items.push({
        id: uid('it'),
        kind: 'gapfill',
        stem: `第 ${i + 1} 空`,
        optionPoolId: poolId ?? undefined,
        correctIds: opt ? [opt.id] : [],
        analysis: sharedAnalysis,
        distractors: gapPending!.distractors.map((d) => ({
          optionId: pool?.[LETTERS.indexOf(d.letter.toUpperCase())]?.id ?? `unknown-${d.letter}`,
          type: d.type,
          why: d.why,
        })),
      })
    })
    const gapCount = new Set(passages.join('\n').match(/\{\{(\d+)\}\}/g) ?? []).size
    if (gapCount > 0 && gapCount !== gapPending.letters.length) {
      pushError(0, `7选5：正文有 ${gapCount} 个空位，但答案给了 ${gapPending.letters.length} 个，请核对`)
    }
    gapPending = null
  }

  const finishQuestion = () => {
    materializeGap()
    // 延迟物化：把所有待定小题一次性入列（此时答案已分发完毕）
    for (const it of openItems) finalizeItem(it)
    finalizeItem() // 兜底：reorder 等活动小题
    if (q.items.length === 0 && passages.length === 0 && !q.referenceTranslation && !q.referenceEssay) return
    q.passage = passages.join('\n\n')
    if (poolId && pool) q.optionPools = { [poolId]: pool }
    const steps = ([1, 2, 3] as const)
      .filter((s) => stepLines[s])
      .map((s) => ({ step: s, zh: stepLines[s] as string }) satisfies TranslationStep)
    if (steps.length) q.translationSteps = steps
    questions.push(q)
  }

  const startNew = () => {
    finishQuestion()
    q = newQuestion()
    passages = []
    item = null
    openItems = []
    reorderMode = false
    pool = null
    poolId = null
    stepLines = {}
    writingSection = null
  }

  for (let ln = 0; ln < lines.length; ln++) {
    const lineNo = ln + 1
    const line = lines[ln].trim()
    if (!line) continue

    // 新题标记（题型/标签/标题都视为新题开始）
    const typeMatch = /^\[题型\]\s*(.+)$/.exec(line)
    if (typeMatch) {
      const t = TYPE_MAP[typeMatch[1].trim()]
      if (t) {
        if (q.title.trim() !== '未命名题目' || passages.length || q.items.length) startNew()
        q.type = t
      } else pushError(lineNo, `无法识别的题型「${typeMatch[1]}」，可选：完形/阅读/新题型/翻译/写作`)
      continue
    }
    const tagMatch = /^\[标签\]\s*(.+)$/.exec(line)
    if (tagMatch) {
      if (q.title.trim() !== '未命名题目' || passages.length || q.items.length) startNew()
      q.sourceLabel = tagMatch[1].trim()
      continue
    }
    const titleMatch = /^#\s*(.+)$/.exec(line)
    if (titleMatch) {
      if (q.title.trim() !== '未命名题目' || passages.length || q.items.length) startNew()
      q.title = titleMatch[1].trim()
      continue
    }

    const ansMatch = /^\[答案\]\s*(.+)$/.exec(line)
    if (ansMatch) {
      // 提取行内所有 A-G 字母（兼容 "1-5 BCADA 6-10 DBCAD" 的真题答案行）
      const letters = (ansMatch[1].match(/[A-Ga-g]/g) ?? []).map((l) => l.toUpperCase())
      if (letters.length === 0) {
        pushError(lineNo, '[答案] 行没有识别出 A-G 字母')
        continue
      }
      if (reorderMode) {
        if (!item) item = { kind: 'reorder', answerLetters: [], distractors: [], reorderItems: [] }
        item.answerLetters = letters
      } else if (poolId && pool && openItems.length === 0) {
        // 7选5：答案字母数 = 空位数，先物化旧的，再挂起新的
        materializeGap()
        gapPending = { letters, analyses: [], distractors: [] }
      } else {
        // 普通小题：按创建顺序分发给尚未定答案的小题（支持逐题一行，也支持末尾块式答案）
        const free = openItems.filter((it) => it.answerLetters.length === 0)
        if (letters.length === free.length && free.length > 0) {
          free.forEach((it, i) => {
            it.answerLetters = [letters[i]]
          })
        } else {
          pushError(lineNo, `答案字母数（${letters.length}）与待定小题数（${free.length}）不一致，请逐题核对`)
        }
      }
      continue
    }
    const analysisMatch = /^\[解析\]\s*(.+)$/.exec(line)
    if (analysisMatch) {
      if (item) item.analysis = (item.analysis ? item.analysis + '\n' : '') + analysisMatch[1].trim()
      else if (gapPending) gapPending.analyses.push(analysisMatch[1].trim())
      else pushError(lineNo, '[解析] 前缺少小题')
      continue
    }
    const distractorMatch = /^\[干扰项\]\s*([A-Ga-g])[\s，,、]*([一-鿿]+)?[：:]\s*(.*)$/.exec(line)
    if (distractorMatch) {
      const typeText = distractorMatch[2]
      let type: DistractorType = '偷换概念'
      if (typeText) {
        const found = DISTRACTOR_TYPES.find((t) => typeText.includes(t))
        if (found) type = found
        else pushError(lineNo, `干扰项类型「${typeText}」不在列表内（偷换概念/局部正确/因果倒置/过度推断/无中生有/张冠李戴），按「偷换概念」处理`)
      }
      if (item) {
        item.distractors.push({ letter: distractorMatch[1], type, why: distractorMatch[3].trim() })
      } else if (gapPending) {
        gapPending.distractors.push({ letter: distractorMatch[1], type, why: distractorMatch[3].trim() })
      } else {
        pushError(lineNo, '[干扰项] 前缺少小题')
      }
      continue
    }
    const poolMatch = /^\[选项池\]\s*(.+)$/.exec(line)
    if (poolMatch) {
      pool = poolMatch[1].split('|').map((s) => s.trim()).filter(Boolean).map((s) => {
        const m = /^[A-Ga-g][.、)]\s*(.*)$/.exec(s)
        return { id: uid('opt'), text: (m ? m[1] : s).trim() }
      })
      poolId = uid('pool')
      continue
    }
    if (/^\[排序\]/.test(line)) {
      reorderMode = true
      continue
    }
    // 分隔线（--- / ===）：忽略
    if (/^[-=_]{3,}$/.test(line)) continue
    const refMatch = /^\[参考译文\]\s*(.*)$/.exec(line)
    if (refMatch) {
      q.referenceTranslation = (q.referenceTranslation ? q.referenceTranslation + '\n' : '') + refMatch[1].trim()
      continue
    }
    const stepMatch = /^\[步骤(\d)\]\s*(.*)$/.exec(line)
    if (stepMatch) {
      const s = parseInt(stepMatch[1], 10) as 1 | 2 | 3
      stepLines[s] = (stepLines[s] ? stepLines[s] + '\n' : '') + stepMatch[2].trim()
      continue
    }
    const secMatch = /^\[(图画描述|写作要求|参考范文)\]\s*(.*)$/.exec(line)
    if (secMatch) {
      const key = secMatch[1] === '图画描述' ? 'figure' : secMatch[1] === '写作要求' ? 'prompt' : 'essay'
      writingSection = key
      if (secMatch[2].trim()) {
        if (key === 'figure') q.figureDescription = (q.figureDescription ?? '') + secMatch[2].trim()
        else if (key === 'prompt') q.writingPrompt = (q.writingPrompt ?? '') + secMatch[2].trim()
        else q.referenceEssay = (q.referenceEssay ?? '') + secMatch[2].trim()
      }
      continue
    }
    if (writingSection) {
      const add = line
      if (writingSection === 'figure') q.figureDescription = (q.figureDescription ?? '') + '\n' + add
      else if (writingSection === 'prompt') q.writingPrompt = (q.writingPrompt ?? '') + '\n' + add
      else q.referenceEssay = (q.referenceEssay ?? '') + '\n' + add
      continue
    }

    // 排序模式：收集段落
    if (reorderMode) {
      if (!item) item = { kind: 'reorder', answerLetters: [], distractors: [], reorderItems: [] }
      item.reorderItems!.push(lines[ln])
      continue
    }

    // 完形单行：1. A. xxx B. xxx C. xxx D. xxx
    if (/^\d+[.、)]\s+[A-Ga-g][.、)]/.test(line) && /[A-Ga-g][.、)]/.test(line.replace(/^\d+[.、)]\s+[A-Ga-g][.、)]/, ''))) {
      item = null
      const stemMatch = /^(\d+)[.、)]/.exec(line)
      const opts: Option[] = []
      const body = line.replace(/^\d+[.、)]\s*/, '')
      const segs = body.split(/\s+(?=[A-Ga-g][.、)])/).filter((s) => /^[A-Ga-g][.、)]/.test(s))
      for (const seg of segs) {
        const m = /^([A-Ga-g])[.、)]\s*(.*)$/.exec(seg.trim())
        if (m) opts.push({ id: uid('opt'), text: m[2].trim() })
      }
      item = { kind: 'choice', answerLetters: [], distractors: [], options: opts, stem: `第 ${stemMatch![1]} 空` }
      openItems.push(item)
      continue
    }

    // 小题题干（上一个小题挂起等待答案分发，不再提前物化）
    const stemMatch = /^(\d+)[.、)]\s*(.*)$/.exec(line)
    if (stemMatch) {
      item = { kind: 'choice', answerLetters: [], distractors: [] }
      item.stem = stemMatch[2].trim() || `第 ${stemMatch[1]} 题`
      openItems.push(item)
      continue
    }

    // 选项行（A. xxx 或 A、xxx）
    const optMatch = /^([A-Ga-g])[.、)]\s*(.*)$/.exec(line)
    if (optMatch) {
      if (item && item.kind !== 'reorder') {
        if (!item.options) item.options = []
        item.options.push({ id: uid('opt'), text: optMatch[2].trim() })
        continue
      }
      pushError(lineNo, '选项行前缺少小题（选项需跟在 1. 题干 之后）')
      continue
    }

    // 普通文本：文章段落
    passages.push(lines[ln])
  }

  finishQuestion()
  if (questions.length === 1 && questions[0].title === '未命名题目') {
    questions[0].title = questions[0].sourceLabel === '导入题' ? '导入题' : questions[0].sourceLabel
  }
  return { questions, errors }
}

function newQuestion(): Question {
  return {
    id: uid('imp'),
    type: 'reading',
    source: 'imported',
    sourceLabel: '导入题',
    title: '未命名题目',
    items: [],
  }
}
