import { builtinVocabulary } from '../data/vocabulary'

export interface DictEntry {
  word: string
  phonetic: string
  definitions: string[]
  pos: string
}

export async function lookupEnglishWord(word: string): Promise<DictEntry | null> {
  const local = builtinVocabulary.find(item => item.word.toLowerCase() === word.toLowerCase())
  if (local) return { word, phonetic: '', definitions: local.meanings, pos: local.partOfSpeech || '' }
  try {
    const query = new URLSearchParams({ sp: word, qe: 'sp', md: 'dr', ipa: '1', max: '1' })
    const response = await fetch(`https://api.datamuse.com/words?${query}`, { signal: AbortSignal.timeout(8000) })
    if (!response.ok) return null
    const rows = await response.json() as { word?: string; defs?: string[]; tags?: string[] }[]
    const row = rows.find(item => item.word?.toLowerCase() === word.toLowerCase())
    const definitions = (row?.defs ?? []).map(definition => definition.replace('\t', ': ').trim()).filter(definition => definition && !/\p{Script=Han}/u.test(definition))
    if (!definitions.length) return null
    return {
      word,
      phonetic: row?.tags?.find(tag => tag.startsWith('ipa_pron:'))?.slice(9) || '',
      definitions: [...new Set(definitions)].slice(0, 6),
      pos: row?.defs?.[0]?.split('\t')[0] || '',
    }
  } catch { return null }
}
