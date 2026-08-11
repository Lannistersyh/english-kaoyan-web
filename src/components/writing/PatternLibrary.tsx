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
  { key: 'introduction', label: '引出话题' },
  { key: 'describePicture', label: '描述图画' },
  { key: 'thesis', label: '点明主旨' },
  { key: 'example', label: '举例论证' },
  { key: 'cause', label: '因果分析' },
  { key: 'concession', label: '让步转折' },
  { key: 'conclusion', label: '总结' },
  { key: 'suggestion', label: '建议' },
]

const CATEGORY_LABELS: Record<PatternCategory, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.label]),
) as Record<PatternCategory, string>

interface Props {
  compact?: boolean // 写作页内嵌模式（不显示自定义表单）
}

/** 功能性句型库：中英对照 + 复制 + 自定义 */
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
      window.alert('复制失败，请手动选择复制')
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
    <div>
      <div className="toolbar">
        {[{ key: 'all', label: '全部' } as const, ...CATEGORIES].map((c) => (
          <button
            key={c.key}
            className={`btn${filter === c.key ? ' btn--primary' : ''}`}
            style={{ padding: '5px 12px', fontSize: 13 }}
            onClick={() => setFilter(c.key)}
          >
            {c.label}
          </button>
        ))}
        <span className="toolbar__spacer" />
        {!compact && (
          <Button variant="primary" onClick={() => setAdding(!adding)}>
            {adding ? '取消' : '+ 自定义句型'}
          </Button>
        )}
      </div>

      {adding && !compact && (
        <div className="card card--flat" style={{ background: '#f8fafc', marginBottom: 14 }}>
          <div className="form-row">
            <div className="form-label">英文句型（用 … 表示可变部分）</div>
            <input className="input" value={en} onChange={(e) => setEn(e.target.value)} placeholder="e.g. It is worth noting that …" />
          </div>
          <div className="form-row">
            <div className="form-label">中文释义</div>
            <input className="input" value={zh} onChange={(e) => setZh(e.target.value)} placeholder="e.g. 值得注意的是……" />
          </div>
          <div className="form-row">
            <div className="form-label">分类</div>
            <select className="select" value={cat} onChange={(e) => setCat(e.target.value as PatternCategory)}>
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>
          <Button variant="primary" onClick={addPattern} disabled={!en.trim() || !zh.trim()}>
            保存句型
          </Button>
        </div>
      )}

      {shown.length === 0 ? (
        <EmptyState icon="📚" title="该分类暂无句型" />
      ) : (
        <div className="item-list">
          {shown.map((p) => (
            <div key={p.id} className="collapse">
              <div className="collapse__head">
                <span>
                  <Tag variant="plain" >{CATEGORY_LABELS[p.category]}</Tag>{' '}
                  {p.builtin ? <Tag>内置</Tag> : <Tag variant="warning">自定义</Tag>}
                  <span style={{ marginLeft: 8, color: 'var(--c-text)' }}>{p.zh}</span>
                </span>
                <span className="flex-row" style={{ gap: 6 }}>
                  <Button
                    variant="ghost"
                    style={{ padding: '3px 10px', fontSize: 12.5 }}
                    onClick={() => copy(p)}
                  >
                    {copiedId === p.id ? '✓ 已复制' : '复制'}
                  </Button>
                  {!p.builtin && !compact && (
                    <Button variant="ghost" style={{ padding: '3px 10px', fontSize: 12.5, color: 'var(--c-danger)' }} onClick={() => removePattern(p.id)}>
                      删除
                    </Button>
                  )}
                </span>
              </div>
              <div className="collapse__body">
                <div style={{ fontWeight: 600, color: 'var(--c-primary)' }}>{p.en}</div>
                {p.usage && <div className="muted" style={{ marginTop: 4 }}>💡 {p.usage}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
