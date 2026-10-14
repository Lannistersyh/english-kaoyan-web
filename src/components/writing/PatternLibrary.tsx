import { useState } from 'react'
import { builtinPatterns } from '../../data'
import type { Pattern, PatternCategory } from '../../types'
import { STORAGE_KEYS } from '../../types'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { uid } from '../../utils/ids'
import { Button } from '../ui/Button'
import { Tag } from '../ui/Tag'
import { EmptyState } from '../ui/EmptyState'

const CATEGORIES: { key: PatternCategory; label: string }[] = [
  { key: 'introduction', label: "Introduce the topic" },
  { key: 'describePicture', label: "Describe the picture" },
  { key: 'thesis', label: "State the main idea" },
  { key: 'example', label: "Give examples for argumentation" },
  { key: 'cause', label: "Causal analysis" },
  { key: 'concession', label: "Concession and transition" },
  { key: 'conclusion', label: "Summary" },
  { key: 'suggestion', label: "Suggestions" },
]

const CATEGORY_LABELS: Record<PatternCategory, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.label]),
) as Record<PatternCategory, string>

interface Props {
  compact?: boolean // Embedded mode in the writing page (do not show the custom form)
}

/* Functional sentence pattern library: English examples and explanations + copy + custom */
export function PatternLibrary({ compact = false }: Props) {
  const [custom, setCustom] = useLocalStorage<Pattern[]>(STORAGE_KEYS.patterns, [])
  const [filter, setFilter] = useState<PatternCategory | 'all'>('all')
  const [adding, setAdding] = useState(false)
  const [en, setEn] = useState('')
  const [zh, setZh] = useState('')
  const [cat, setCat] = useState<PatternCategory>('thesis')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const all = [...builtinPatterns, ...custom]
  const shown = filter === 'all' ? all : all.filter((p) => p.category === filter)

  const copy = async (p: Pattern) => {
    try {
      await navigator.clipboard.writeText(p.en)
      setCopiedId(p.id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch {
      window.alert("Copy failed, please manually select and copy")
    }
  }

  const addPattern = () => {
    if (!en.trim() || !zh.trim()) return
    setCustom([...custom, { id: uid('p'), category: cat, en: en.trim(), zh: zh.trim(), builtin: false }])
    setEn('')
    setZh('')
    setAdding(false)
  }

  const removePattern = (id: string) => {
    setCustom(custom.filter((p) => p.id !== id))
  }

  return (
    <section className="study-page pattern-library" aria-label="Sentence pattern library">
      <h2 className="study-section-title">Sentence pattern library</h2>
      <div className="pm-results-head" role="status">{shown.length} sentence patterns</div>
      <div className="pm-results-layout">
        <aside className="pm-filters" aria-label="Sentence pattern filters">
          <label className="pm-filter-group__label study-filter-label">
            Function
            <select className="select" value={filter} onChange={e => setFilter(e.target.value as PatternCategory | 'all')}>
              <option value="all">All functions</option>
              {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </label>
          {!compact && <Button variant="primary" style={{ marginTop: 16 }} onClick={() => setAdding(!adding)}>{adding ? 'Cancel' : 'Add sentence pattern'}</Button>}
        </aside>
        <div className="pm-results-list">
          {adding && !compact && (
            <div className="card card--flat">
              <div className="form-row">
                <label className="form-label" htmlFor="pattern-sentence">English sentence pattern</label>
                <input id="pattern-sentence" className="input" value={en} onChange={e => setEn(e.target.value)} placeholder="Use … for variable parts" />
              </div>
              <div className="form-row">
                <label className="form-label" htmlFor="pattern-meaning">Meaning and usage</label>
                <input id="pattern-meaning" className="input" value={zh} onChange={e => setZh(e.target.value)} />
              </div>
              <div className="form-row">
                <label className="form-label" htmlFor="pattern-category">Function</label>
                <select id="pattern-category" className="select" value={cat} onChange={e => setCat(e.target.value as PatternCategory)}>
                  {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </div>
              <Button variant="primary" onClick={addPattern} disabled={!en.trim() || !zh.trim()}>Save sentence pattern</Button>
            </div>
          )}
          {shown.length === 0 ? <EmptyState title="No sentence patterns in this category" /> : shown.map((p, index) => (
            <article className="study-pattern" key={p.id}>
              <div className="study-pattern__meta">
                <span><span className="docsum__num">{index + 1}. </span><Tag>{CATEGORY_LABELS[p.category]}</Tag><Tag>{p.builtin ? 'Built-in' : 'Custom'}</Tag></span>
                <div className="flex-row">
                  <Button variant="ghost" onClick={() => copy(p)}>{copiedId === p.id ? 'Copied' : 'Copy'}</Button>
                  {!p.builtin && !compact && <Button variant="danger" onClick={() => removePattern(p.id)}>Delete</Button>}
                </div>
              </div>
              <p className="study-prose">{p.en}</p>
              <div className="study-pattern__description">{p.zh}</div>
              {p.usage && <p className="muted">{p.usage}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
