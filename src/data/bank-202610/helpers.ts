import type { Question, SubQuestion } from '../../types'

export const mockProvenance: NonNullable<Question['provenance']> = {
  kind: 'original-mock',
  note: 'Original exam-style practice. Scenarios and examples are fictional teaching material, not reports of published studies or past exam questions.',
}

type ChoiceSpec = {
  stem: string
  options: [string, string, string, string]
  correct: 0 | 1 | 2 | 3
  analysis: string
  // One explanation for each wrong option, in option order.
  traps?: [string, string, string]
}

export function choices(prefix: string, specs: ChoiceSpec[], score = 1): SubQuestion[] {
  return specs.map((spec, index) => {
    const id = `${prefix}-q${index + 1}`
    const options = spec.options.map((text, i) => ({ id: `${id}-${String.fromCharCode(97 + i)}`, text }))
    const wrong = options.filter((_, i) => i !== spec.correct)
    return {
      id, kind: 'choice', stem: spec.stem, options,
      correctIds: [options[spec.correct].id], score, analysis: spec.analysis,
      distractors: spec.traps?.map((why, i) => ({ optionId: wrong[i].id, type: 'Unsupported claim', why })),
    }
  })
}

export function annotations(prefix: string, rows: Array<[NonNullable<Question['passageAnnotations']>[number]['type'], string, string]>) {
  return rows.map(([type, text, note], i) => ({ id: `${prefix}-ann${i + 1}`, type, text, note }))
}
