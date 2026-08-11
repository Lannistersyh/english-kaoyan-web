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
  unfamiliar: '不认识',
  familiar: '模糊',
  mastered: '认识',
}

const STATUS_ORDER: Record<VocabStatus, number> = { unfamiliar: 0, familiar: 1, mastered: 2 }

/** 词汇：熟词僻义闪卡 + 词库管理 */
export default function Vocabulary() {
  const [custom, setCustom] = useLocalStorage<VocabItem[]>(STORAGE_KEYS.vocab, [])
  const [vprogress, setVprogress] = useLocalStorage<VocabProgress>(STORAGE_KEYS.vocabProgress, {})
  const [mode, setMode] = useState<'review' | 'manage'>('review')
  const [index, setIndex] = useState(0)
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

  const current = sorted[index % sorted.length]

  const mark = (status: VocabStatus) => {
    setVprogress({ ...vprogress, [current.id]: status })
    setFlipped(false)
    setIndex((i) => i + 1)
  }

  const saveItem = () => {
    if (!editing) return
    if (custom.some((v) => v.id === editing.id)) {
      setCustom(custom.map((v) => (v.id === editing.id ? editing : v)))
    } else {
      setCustom([...custom, editing])
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
    <div>
      <h1 className="page-title">词汇</h1>
      <p className="page-sub">熟词僻义专项：如 address（处理）、subject（易受…的）、promising（有前景的）——GRE 阅读中的「隐藏生词」</p>

      <div className="toolbar">
        <button className={`btn${mode === 'review' ? ' btn--primary' : ''}`} onClick={() => { setMode('review'); setIndex(0); setFlipped(false) }}>
          🃏 闪卡复习
        </button>
        <button className={`btn${mode === 'manage' ? ' btn--primary' : ''}`} onClick={() => setMode('manage')}>
          📋 词库管理（{all.length} 词）
        </button>
        <span className="toolbar__spacer" />
        <span className="muted">
          待复习 {all.filter((v) => (vprogress[v.id] ?? 'unfamiliar') !== 'mastered').length} 词
        </span>
      </div>

      {mode === 'review' && (
        <Card>
          {all.length === 0 ? (
            <EmptyState icon="🗂️" title="词库为空">添加自定义词条开始复习</EmptyState>
          ) : (
            <div>
              <div className="flashcard" style={{ maxWidth: 560 }} onClick={() => setFlipped(!flipped)}>
                <div className={`flashcard__inner${flipped ? ' flashcard__inner--flipped' : ''}`}>
                  <div className="flashcard__face">
                    <div className="flashcard__word">{current.word}</div>
                    <div className="flashcard__pos">{current.partOfSpeech} · 点击翻转看僻义</div>
                  </div>
                  <div className="flashcard__face flashcard__face--back">
                    {current.meanings.map((m, i) => (
                      <div key={i} className="flashcard__meaning">{m}</div>
                    ))}
                    <div className="flashcard__example">"{current.example}"</div>
                    {current.note && <div className="muted" style={{ marginTop: 8 }}>💡 {current.note}</div>}
                  </div>
                </div>
              </div>
              <div className="flex-row" style={{ justifyContent: 'center', marginTop: 20 }}>
                <Button variant="danger" onClick={() => mark('unfamiliar')}>不认识</Button>
                <Button onClick={() => mark('familiar')}>模糊</Button>
                <Button variant="primary" onClick={() => mark('mastered')}>认识</Button>
              </div>
              <div className="muted" style={{ textAlign: 'center', marginTop: 12 }}>
                复习顺序：不认识的词优先出现 · 点击卡片翻面
              </div>
            </div>
          )}
        </Card>
      )}

      {mode === 'manage' && (
        <div>
          <div className="toolbar">
            <Button variant="primary" onClick={addNew}>+ 添加词条</Button>
            <span className="toolbar__spacer" />
            <span className="muted">搜索请用浏览器 Ctrl+F</span>
          </div>
          <div className="item-list">
            {all.map((v) => (
              <div key={v.id} className="item-row" style={{ cursor: 'default' }}>
                <div className="item-row__main">
                  <div className="item-row__title">
                    {v.word} <span className="muted small">{v.partOfSpeech}</span>{' '}
                    {v.builtin ? <Tag variant="plain">内置</Tag> : <Tag variant="warning">自定义</Tag>}
                    <Tag variant={vprogress[v.id] === 'mastered' ? 'success' : vprogress[v.id] === 'familiar' ? 'warning' : 'danger'}>
                      {STATUS_LABELS[vprogress[v.id] ?? 'unfamiliar']}
                    </Tag>
                  </div>
                  <div className="item-row__meta">
                    {v.meanings.join('；')}
                    {v.example && <div style={{ fontStyle: 'italic' }}>"{v.example}"</div>}
                  </div>
                </div>
                {!v.builtin && (
                  <Button variant="ghost" onClick={() => setEditing(v)}>编辑</Button>
                )}
                {!v.builtin && (
                  <Button variant="ghost" style={{ color: 'var(--c-danger)' }} onClick={() => setCustom(custom.filter((x) => x.id !== v.id))}>删除</Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {editing && (
        <Modal
          title={custom.some((v) => v.id === editing.id) ? '编辑词条' : '添加词条'}
          onClose={() => setEditing(null)}
          footer={
            <>
              <Button onClick={() => setEditing(null)}>取消</Button>
              <Button variant="primary" onClick={saveItem} disabled={!editing.word.trim()}>保存</Button>
            </>
          }
        >
          <div className="form-row">
            <div className="form-label">单词</div>
            <input className="input" value={editing.word} onChange={(e) => setEditing({ ...editing, word: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-label">词性</div>
            <select className="select" value={editing.partOfSpeech} onChange={(e) => setEditing({ ...editing, partOfSpeech: e.target.value })}>
              {['v.', 'n.', 'adj.', 'adv.', 'prep.'].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-label">义项（每行一个，如：n. 地址 / v. 处理）</div>
            <textarea
              className="textarea"
              value={editing.meanings.join('\n')}
              onChange={(e) => setEditing({ ...editing, meanings: e.target.value.split('\n').filter(Boolean) })}
            />
          </div>
          <div className="form-row">
            <div className="form-label">例句</div>
            <input className="input" value={editing.example} onChange={(e) => setEditing({ ...editing, example: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-label">备注（可选）</div>
            <input className="input" value={editing.note ?? ''} onChange={(e) => setEditing({ ...editing, note: e.target.value })} />
          </div>
        </Modal>
      )}
    </div>
  )
}
