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
  cloze: 'cloze', reading: 'reading', matching: 'matching', reorder: 'matching',
  gapfill: 'matching', '7-of-5': 'matching', '7-choose-5': 'matching',
  paraphrasing: 'translation', paraphrase: 'translation', translation: 'translation', writing: 'writing',
}

const DISTRACTOR_TYPES: DistractorType[] = ["Concept substitution", "Partially true", "Reversed causality", "Over-inference", "Unsupported claim", "Misattribution"]

interface PendingItem {
  stem?: string
  kind: SubQuestion['kind']
  options?: Option[]
  optionPoolId?: string
  reorderItems?: string[]
  answerLetters: string[]
  analysis?: string
  distractors: { letter: string; type: DistractorType; why: string }[]
  done?: boolean // Already materialized to prevent duplicate enqueueing
}

/* * Past exam pasted text parser (line-based protocol, lenient input, explicit errors).
 * Supports: reading/cloze/subheading (choice), 7-choose-5 (gapfill), reorder, translation, writing. */
export function parseImport(text: string): ImportResult {
  const errors: ImportResult['errors'] = []
  const questions: Question[] = []

  // Limit import size (100KB)
  const MAX_SIZE = 100 * 1024
  if (text.length > MAX_SIZE) {
    errors.push({ line: 0, message: ` Text too large (${Math.round(text.length / 1024)} KB), please keep it within 100KB. It is recommended to import in batches.` })
    return { questions, errors }
  }

  const lines = text.split(/\r?\n/)

  let q: Question = newQuestion()
  let passages: string[] = []
  let item: PendingItem | null = null
  /* Unanswered items in creation order, awaiting answer distribution. */
  let openItems: PendingItem[] = []
  let reorderMode = false
  let pool: Option[] | null = null
  let poolId: string | null = null
  let stepLines: Partial<Record<1 | 2 | 3, string>> = {}
  let writingSection: 'figure' | 'prompt' | 'essay' | null = null
  /* Create gap-fill items after reading the answer count; share pending explanations and distractors. */
  let gapPending: { letters: string[]; analyses: string[]; distractors: { letter: string; type: DistractorType; why: string }[] } | null = null

  const pushError = (lineNo: number, message: string) => errors.push({ line: lineNo, message })

  const finalizeItem = (pending?: PendingItem) => {
    const it = pending ?? item
    if (!it || it.done) return
    it.done = true
    const allOptions = it.kind === 'gapfill' ? pool ?? [] : it.options ?? []
    const correctIds: string[] = []
    if (it.kind === 'reorder') {
      // Map letters to paragraph indices in their original order.
      correctIds.push(
        ...it.answerLetters.map((l) => {
          const idx = LETTERS.indexOf(l.toUpperCase())
          if (idx === -1 || idx >= (it.reorderItems ?? []).length) {
            pushError(0, ` Answer letters for reorder questions ${l} Out of paragraph range `)
            return null
          }
          return String(idx)
        }).filter((x): x is string => x !== null),
      )
    } else {
      for (const letter of it.answerLetters) {
        const idx = LETTERS.indexOf(letter.toUpperCase())
        if (idx === -1) {
          pushError(0, ` Sub-question "${it.stem ?? ''}" answer letter ${letter} Unable to recognize `)
          continue
        }
        const opt = allOptions[idx]
        if (opt) correctIds.push(opt.id)
        else pushError(0, ` Sub-question "${it.stem ?? ''}" answer ${letter} Out of option range `)
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
      score: q.type === 'cloze' ? 0.5 : undefined,
      analysis: it.analysis,
      distractors: it.distractors.map((d) => {
        const idx = LETTERS.indexOf(d.letter.toUpperCase())
        return { optionId: allOptions[idx]?.id ?? `unknown-${d.letter}`, type: d.type, why: d.why }
      }),
    })
    if (!pending) item = null
  }

  /* Create gap-fill items from pending answers. */
  const materializeGap = () => {
    if (!gapPending) return
    const sharedAnalysis = gapPending.analyses.join('\n') || undefined
    gapPending.letters.forEach((letter, i) => {
      const idx = LETTERS.indexOf(letter.toUpperCase())
      const opt = pool?.[idx]
      if (!opt) pushError(0, ` No. ${i + 1} blanks: answer ${letter} Out of option pool range `)
      q.items.push({
        id: uid('it'),
        kind: 'gapfill',
        stem: ` No. ${i + 1} blank `,
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
      pushError(0, `7-choose-5: the passage has ${gapCount} blanks, but the answer provided ${gapPending.letters.length} items, please check `)
    }
    gapPending = null
  }

  const finishQuestion = () => {
    materializeGap()
    // Finalize pending items after distributing answers.
    for (const it of openItems) finalizeItem(it)
    finalizeItem() // Finalize any remaining active reorder item.
    if (q.items.length === 0 && passages.length === 0 && !q.referenceTranslation && !q.referenceEssay) return
    q.passage = passages.join('\n\n')
    if (poolId && pool) q.optionPools = { [poolId]: pool }
    const steps = ([1, 2, 3] as const)
      .filter((s) => stepLines[s])
      .map((s) => ({ step: s, zh: stepLines[s] as string }) satisfies TranslationStep)
    if (steps.length) q.translationSteps = steps
    if (q.type !== 'translation' && q.type !== 'writing') {
      const invalid = q.items.filter(it => it.correctIds.length === 0 ||
        (it.kind === 'choice' && (it.options?.length ?? 0) < 2) ||
        (it.kind === 'reorder' && (it.correctIds.length !== it.reorderItems?.length || new Set(it.correctIds).size !== it.correctIds.length)))
      if (!q.items.length || invalid.length) {
        pushError(0, `「${q.title}" is missing valid sub-questions or standard answers, not saved. Please complete and re-import `)
        return
      }
      if (q.type === 'cloze' || q.items.some(it => it.kind === 'gapfill')) {
        const blanks = [...q.passage.matchAll(/\{\{(\d+)\}\}/g)].map(match => Number(match[1]))
        const numbers = new Set(blanks)
        const validBlanks = numbers.size === q.items.length && q.items.every((_, index) => numbers.has(index + 1))
        const gapAnswers = q.items.filter(it => it.kind === 'gapfill').map(it => it.correctIds[0])
        if (!validBlanks || new Set(gapAnswers).size !== gapAnswers.length) {
          pushError(0, `"${q.title}" has missing or inconsistent blanks, or repeats an answer in a single-use option pool; not saved`)
          return
        }
      }
    }
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

    // Type, source, and title markers begin a new question.
    const typeMatch = /^\[Type\]\s*(.+)$/.exec(line)
    if (typeMatch) {
      const t = TYPE_MAP[typeMatch[1].trim().toLowerCase()]
      if (t) {
        if (q.title.trim() !== "Untitled question" || passages.length || q.items.length) startNew()
        q.type = t
      } else pushError(lineNo, ` Unrecognized question type "${typeMatch[1]}", available: cloze/reading/new question type/translation/writing `)
      continue
    }
    const tagMatch = /^\[Source\]\s*(.+)$/.exec(line)
    if (tagMatch) {
      if (q.title.trim() !== "Untitled question" || passages.length || q.items.length) startNew()
      q.sourceLabel = tagMatch[1].trim()
      continue
    }
    const titleMatch = /^#\s*(.+)$/.exec(line)
    if (titleMatch) {
      if (q.title.trim() !== "Untitled question" || passages.length || q.items.length) startNew()
      q.title = titleMatch[1].trim()
      continue
    }

    const ansMatch = /^\[Answer\]\s*(.+)$/.exec(line)
    if (ansMatch) {
      // Extract A-G letters, including grouped answer lists such as "1-5 BCADA 6-10 DBCAD".
      const letters = (ansMatch[1].match(/[A-Ga-g]/g) ?? []).map((l) => l.toUpperCase())
      if (letters.length === 0) {
        pushError(lineNo, "[Answer] line did not recognize A-G letters")
        continue
      }
      if (reorderMode) {
        if (!item) item = { kind: 'reorder', answerLetters: [], distractors: [], reorderItems: [] }
        item.answerLetters = letters
      } else if (poolId && pool && openItems.length === 0) {
        // The gap-fill answer count determines the blank count.
        materializeGap()
        gapPending = { letters, analyses: [], distractors: [] }
      } else {
        // Distribute answers to pending items in creation order.
        const free = openItems.filter((it) => it.answerLetters.length === 0)
        if (letters.length === free.length && free.length > 0) {
          free.forEach((it, i) => {
            it.answerLetters = [letters[i]]
          })
        } else {
          pushError(lineNo, ` Number of answer letters (${letters.length}) does not match the number of pending sub-questions (${free.length}), please check each question `)
        }
      }
      continue
    }
    const analysisMatch = /^\[Explanation\]\s*(.+)$/.exec(line)
    if (analysisMatch) {
      if (item) item.analysis = (item.analysis ? item.analysis + '\n' : '') + analysisMatch[1].trim()
      else if (gapPending) gapPending.analyses.push(analysisMatch[1].trim())
      else pushError(lineNo, "[Explanation] is missing sub-questions before it")
      continue
    }
    const distractorMatch = /^\[Distractor\]\s*([A-Ga-g])[\s,]*([^:]+)?[:：]\s*(.*)$/i.exec(line)
    if (distractorMatch) {
      const typeText = distractorMatch[2]
      let type: DistractorType = "Concept substitution"
      if (typeText) {
        const found = DISTRACTOR_TYPES.find((t) => typeText.toLowerCase().includes(t.toLowerCase()))
        if (found) type = found
        else pushError(lineNo, ` Distractor type "${typeText}" is not in the list (Concept substitution/Partially true/Reversed causality/Over-inference/Unsupported claim/Misattribution), treated as "Concept substitution"`)
      }
      if (item) {
        item.distractors.push({ letter: distractorMatch[1], type, why: distractorMatch[3].trim() })
      } else if (gapPending) {
        gapPending.distractors.push({ letter: distractorMatch[1], type, why: distractorMatch[3].trim() })
      } else {
        pushError(lineNo, "[Distractor] Missing question number before it")
      }
      continue
    }
    const poolMatch = /^\[Option Pool\]\s*(.+)$/.exec(line)
    if (poolMatch) {
      pool = poolMatch[1].split('|').map((s) => s.trim()).filter(Boolean).map((s) => {
        const m = /^[A-Ga-g][.、)]\s*(.*)$/.exec(s)
        return { id: uid('opt'), text: (m ? m[1] : s).trim() }
      })
      poolId = uid('pool')
      continue
    }
    if (/^\[Reorder\]/.test(line)) {
      reorderMode = true
      continue
    }
    // Ignore separators.
    if (/^[-=_]{3,}$/.test(line)) continue
    const refMatch = /^\[(?:Reference Paraphrase|Reference Translation)\]\s*(.*)$/.exec(line)
    if (refMatch) {
      q.referenceTranslation = (q.referenceTranslation ? q.referenceTranslation + '\n' : '') + refMatch[1].trim()
      continue
    }
    const stepMatch = /^\[Step(\d)\]\s*(.*)$/.exec(line)
    if (stepMatch) {
      const s = parseInt(stepMatch[1], 10) as 1 | 2 | 3
      stepLines[s] = (stepLines[s] ? stepLines[s] + '\n' : '') + stepMatch[2].trim()
      continue
    }
    const secMatch = /^\[(Picture|Prompt|Reference Essay)\]\s*(.*)$/.exec(line)
    if (secMatch) {
      const key = secMatch[1] === 'Picture' ? 'figure' : secMatch[1] === 'Prompt' ? 'prompt' : 'essay'
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

    // Collect paragraphs in reorder mode.
    if (reorderMode) {
      if (!item) item = { kind: 'reorder', answerLetters: [], distractors: [], reorderItems: [] }
      item.reorderItems!.push(lines[ln])
      continue
    }

    // Single-line cloze options.
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
      item = { kind: 'choice', answerLetters: [], distractors: [], options: opts, stem: ` No. ${stemMatch![1]} blank ` }
      openItems.push(item)
      continue
    }

    // Keep the preceding item pending until answers are distributed.
    const stemMatch = /^(\d+)[.、)]\s*(.*)$/.exec(line)
    if (stemMatch) {
      item = { kind: 'choice', answerLetters: [], distractors: [] }
      item.stem = stemMatch[2].trim() || ` No. ${stemMatch[1]} Question `
      openItems.push(item)
      continue
    }

    // Option line.
    const optMatch = /^([A-Ga-g])[.、)]\s*(.*)$/.exec(line)
    if (optMatch) {
      if (item && item.kind !== 'reorder') {
        if (!item.options) item.options = []
        item.options.push({ id: uid('opt'), text: optMatch[2].trim() })
        continue
      }
      pushError(lineNo, "Missing question number before option line (options must follow 1. Question stem)")
      continue
    }

    // Plain text belongs to the passage.
    passages.push(lines[ln])
  }

  finishQuestion()
  if (questions.length === 1 && questions[0].title === "Untitled question") {
    questions[0].title = questions[0].sourceLabel === "Imported questions" ? "Imported questions" : questions[0].sourceLabel
  }
  return { questions, errors }
}

function newQuestion(): Question {
  return {
    id: uid('imp'),
    type: 'reading',
    source: 'imported',
    sourceLabel: "Imported questions",
    title: "Untitled question",
    items: [],
  }
}
