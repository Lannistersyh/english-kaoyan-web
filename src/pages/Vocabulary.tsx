import { useMemo, useState } from 'react'
import { builtinVocabulary } from '../data'
import type { VocabItem, VocabProgress, VocabStatus } from '../types'
import { STORAGE_KEYS } from '../types'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { uid } from '../utils/ids'
import { Button } from '../components/ui/Button'
import { Tag } from '../components/ui/Tag'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'

const STATUS_LABELS: Record<VocabStatus, string> = {
  unfamiliar: "Don't know",
  familiar: "Vague",
  mastered: "Know",
}

const STATUS_ORDER: Record<VocabStatus, number> = { unfamiliar: 0, familiar: 1, mastered: 2 }

/* Vocabulary: familiar words with uncommon meanings flashcards + vocabulary management */
export default function Vocabulary() {
  const [custom, setCustom] = useLocalStorage<VocabItem[]>(STORAGE_KEYS.vocab, [])
  const [vprogress, setVprogress] = useLocalStorage<VocabProgress>(STORAGE_KEYS.vocabProgress, {})
  const [mode, setMode] = useState<'review' | 'manage'>('review')
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [flipped, setFlipped] = useState(false)
  const [editing, setEditing] = useState<VocabItem | null>(null)

  const all = useMemo(() => [...builtinVocabulary, ...custom], [custom])

  const sorted = useMemo(() => {
    return [...all].sort((a, b) => {
      const sa = STATUS_ORDER[vprogress[a.id] ?? 'unfamiliar']
      const sb = STATUS_ORDER[vprogress[b.id] ?? 'unfamiliar']
      return sa - sb
    })
  }, [all, vprogress])

  const index = Math.max(0, sorted.findIndex(item => item.id === currentId))
  const current = sorted[index]

  const mark = (status: VocabStatus) => {
    if (!current) return
    const next = sorted[(index + 1) % sorted.length]
    setVprogress(previous => ({ ...previous, [current.id]: status }))
    setFlipped(false)
    setCurrentId(next.id)
  }

  const saveItem = () => {
    if (!editing) return
    const entry = { ...editing, word: editing.word.trim(), meanings: editing.meanings.map(meaning => meaning.trim()).filter(Boolean) }
    if (custom.some((v) => v.id === editing.id)) {
      setCustom(custom.map((v) => (v.id === editing.id ? entry : v)))
    } else {
      setCustom([...custom, entry])
    }
    setEditing(null)
  }

  const addNew = () => {
    setEditing({
      id: uid('v'),
      word: '',
      partOfSpeech: 'v.',
      meanings: [],
      example: '',
      note: '',
      builtin: false,
    })
  }

  return (
    <div className="study-page">
      <h1 className="page-title"> Vocabulary </h1>
      <p className="page-sub">Review familiar words with uncommon meanings, definitions, and English examples. Add your own entries to the collection.</p>

      <div className="toolbar study-tabs">
        <button className={`btn${mode === 'review' ? ' btn--primary' : ''}`} onClick={() => { setMode('review'); setCurrentId(null); setFlipped(false) }}>

          Word review
        </button>
        <button className={`btn${mode === 'manage' ? ' btn--primary' : ''}`} onClick={() => setMode('manage')}>

          Vocabulary management ({all.length} words)
        </button>
        <span className="toolbar__spacer" />
        <span className="muted">

           To review  {all.filter((v) => (vprogress[v.id] ?? 'unfamiliar') !== 'mastered').length}   words
        </span>
      </div>

      {mode === 'review' && (
        <Card className="study-vocabulary-review">
          {all.length === 0 ? (
            <EmptyState icon="🗂️" title="Vocabulary is empty"> Add custom entries to start reviewing </EmptyState>
          ) : (
            <div>
              <section className="vocabulary-entry" aria-label={`Vocabulary entry: ${current.word}`}>
                <div className="study-pattern__meta">
                  <span className="pm-filter-group__label">Vocabulary entry</span>
                  <Button variant="ghost" aria-expanded={flipped} aria-controls="vocabulary-meanings" onClick={() => setFlipped(!flipped)}>{flipped ? 'Hide meanings' : 'Show meanings'}</Button>
                </div>
                <h2 className="flashcard__word">{current.word}</h2>
                <div className="muted">{current.partOfSpeech}</div>
                {flipped ? <div id="vocabulary-meanings">
                  {current.meanings.map((m, i) => <p key={i} className="flashcard__meaning">{m}</p>)}
                  <p className="study-prose">“{current.example}”</p>
                  {current.note && <p className="muted">{current.note}</p>}
                </div> : <p className="muted" style={{ marginTop: 24 }}>Show the meanings to review this word and its example.</p>}
              </section>
              <div className="flex-row" style={{ justifyContent: 'center', marginTop: 20 }}>
                <Button variant="danger" onClick={() => mark('unfamiliar')}> Don't know </Button>
                <Button onClick={() => mark('familiar')}> Vague </Button>
                <Button variant="primary" onClick={() => mark('mastered')}> Know </Button>
              </div>
              <div className="muted" style={{ textAlign: 'center', marginTop: 12 }}>

                Review order: unfamiliar words first · Show or hide meanings as you review
              </div>
            </div>
          )}
        </Card>
      )}

      {mode === 'manage' && (
        <div>
          <div className="toolbar">
            <Button variant="primary" onClick={addNew}> + Add entry </Button>
            <span className="toolbar__spacer" />
            <span className="muted"> To search, use browser Ctrl+F </span>
          </div>
          <div className="item-list">
            {all.map((v) => (
              <div key={v.id} className="item-row" style={{ cursor: 'default' }}>
                <div className="item-row__main">
                  <div className="item-row__title">
                    {v.word} <span className="muted small">{v.partOfSpeech}</span>{' '}
                    {v.builtin ? <Tag variant="plain"> Built-in </Tag> : <Tag variant="warning"> Custom </Tag>}
                    <Tag variant={vprogress[v.id] === 'mastered' ? 'success' : vprogress[v.id] === 'familiar' ? 'warning' : 'danger'}>
                      {STATUS_LABELS[vprogress[v.id] ?? 'unfamiliar']}
                    </Tag>
                  </div>
                  <div className="item-row__meta">
                    {v.meanings.join('；')}
                    {v.example && <div className="study-prose vocabulary-example">“{v.example}”</div>}
                  </div>
                </div>
                {!v.builtin && (
                  <Button variant="ghost" onClick={() => setEditing(v)}> Edit </Button>
                )}
                {!v.builtin && (
                  <Button variant="ghost" style={{ color: 'var(--c-danger)' }} onClick={() => setCustom(custom.filter((x) => x.id !== v.id))}> Delete </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {editing && (
        <Modal
          title={custom.some((v) => v.id === editing.id) ? "Edit entry" : "Add entry"}
          onClose={() => setEditing(null)}
          footer={
            <>
              <Button onClick={() => setEditing(null)}> Cancel </Button>
              <Button variant="primary" onClick={saveItem} disabled={!editing.word.trim()}> Save </Button>
            </>
          }
        >
          <div className="form-row">
            <div className="form-label"> Word </div>
            <input className="input" value={editing.word} onChange={(e) => setEditing({ ...editing, word: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-label"> Part of speech </div>
            <select className="select" value={editing.partOfSpeech} onChange={(e) => setEditing({ ...editing, partOfSpeech: e.target.value })}>
              {['v.', 'n.', 'adj.', 'adv.', 'prep.'].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-label"> Definitions (one per line, e.g.: n. address / v. handle) </div>
            <textarea
              className="textarea"
              value={editing.meanings.join('\n')}
              onChange={(e) => setEditing({ ...editing, meanings: e.target.value.split('\n') })}
            />
          </div>
          <div className="form-row">
            <div className="form-label"> Example sentence </div>
            <input className="input" value={editing.example} onChange={(e) => setEditing({ ...editing, example: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-label"> Notes (optional) </div>
            <input className="input" value={editing.note ?? ''} onChange={(e) => setEditing({ ...editing, note: e.target.value })} />
          </div>
        </Modal>
      )}
    </div>
  )
}
