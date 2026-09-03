import { useMemo, useState } from 'react'
import type { Question, WrongRecord, SubQuestion } from '../types'
import { STORAGE_KEYS } from '../types'
import { QUESTION_TYPE_LABELS } from '../data'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getQuestion } from '../utils/questions'
import { PracticeSession } from '../components/practice/PracticeSession'
import { ThinkingForm } from '../components/practice/ThinkingForm'
import { Button } from '../components/ui/Button'
import { Tag } from '../components/ui/Tag'
import { EmptyState } from '../components/ui/EmptyState'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function timeAgo(ts: number): string {
  const days = Math.floor((Date.now() - ts) / 86400000)
  if (days <= 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 30) return `${days} 天前`
  return new Date(ts).toLocaleDateString('zh-CN')
}

function extractContext(passage: string, keywords: string[], radius = 80): string {
  if (!passage || keywords.length === 0) return ''
  const lower = passage.toLowerCase()
  for (const kw of keywords) {
    const idx = lower.indexOf(kw.toLowerCase())
    if (idx !== -1) {
      const start = Math.max(0, idx - radius)
      const end = Math.min(passage.length, idx + kw.length + radius)
      let excerpt = passage.slice(start, end)
      if (start > 0) excerpt = '…' + excerpt
      if (end < passage.length) excerpt = excerpt + '…'
      return excerpt
    }
  }
  return ''
}

function getOptionText(item: SubQuestion, optionId: string): string {
  if (item.options) {
    const opt = item.options.find(o => o.id === optionId)
    if (opt) {
      const idx = item.options.indexOf(opt)
      return `${LETTERS[idx]}. ${opt.text}`
    }
  }
  return optionId
}

function WrongItemCard({
  r, q, item, onEdit, onReview,
}: {
  r: WrongRecord
  q: Question | undefined
  item: SubQuestion | undefined
  onEdit: () => void
  onReview: () => void
}) {
  if (!item) return null

  const passage = q?.passage || ''
  const correctText = item.options?.find(o => item.correctIds.includes(o.id))?.text || ''
  const keywords = [
    ...(item.stem || '').split(/\s+/).filter(w => w.length > 4),
    ...correctText.split(/\s+/).filter(w => w.length > 4),
  ].slice(0, 3)
  const context = extractContext(passage, keywords)

  return (
    <div style={{
      padding: '12px 16px',
      borderLeft: '3px solid var(--c-danger)',
      background: '#fefefe',
      borderRadius: '0 8px 8px 0',
      marginBottom: 8,
    }}>
      {item.stem && (
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, color: '#1d1d1f' }}>
          {item.stem}
        </div>
      )}

      {item.options && item.options.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          {item.options.map((opt, idx) => {
            const isCorrect = item.correctIds.includes(opt.id)
            const isWrong = r.wrongAnswer.includes(opt.id)
            return (
              <div key={opt.id} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                padding: '5px 8px',
                marginBottom: 3,
                borderRadius: 6,
                background: isCorrect ? 'rgba(52, 199, 89, 0.1)' :
                           isWrong ? 'rgba(255, 59, 48, 0.08)' : 'transparent',
                border: isCorrect ? '1px solid rgba(52, 199, 89, 0.3)' :
                       isWrong ? '1px solid rgba(255, 59, 48, 0.2)' : '1px solid transparent',
                fontSize: 13,
                lineHeight: 1.5,
              }}>
                <span style={{
                  fontWeight: 600,
                  minWidth: 20,
                  color: isCorrect ? '#34c759' : isWrong ? '#ff3b30' : '#86868b',
                }}>
                  {LETTERS[idx]}.
                </span>
                <span style={{ flex: 1, color: '#1d1d1f' }}>{opt.text}</span>
                {isCorrect && <span style={{ color: '#34c759', fontSize: 12 }}>✓ 正确</span>}
                {isWrong && !isCorrect && <span style={{ color: '#ff3b30', fontSize: 12 }}>✗ 你的答案</span>}
              </div>
            )
          })}
        </div>
      )}

      {context && (
        <div style={{
          margin: '8px 0',
          padding: '8px 10px',
          background: 'rgba(0, 113, 227, 0.04)',
          borderRadius: 6,
          fontSize: 13,
          lineHeight: 1.7,
          color: '#3d3d3d',
          fontStyle: 'italic',
          borderLeft: '2px solid rgba(0, 113, 227, 0.2)',
        }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#0071e3', fontStyle: 'normal' }}>📖 核心句：</span>
          {context}
        </div>
      )}

      {item.analysis && (
        <div style={{
          margin: '8px 0',
          padding: '8px 10px',
          background: '#f0f7ff',
          borderRadius: 6,
          fontSize: 13,
          lineHeight: 1.6,
        }}>
          <b>💡 解析：</b>{item.analysis}
        </div>
      )}

      {item.distractors && item.distractors.length > 0 && (
        <div style={{ margin: '8px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#86868b', marginBottom: 4 }}>
            🎯 干扰项分析
          </div>
          {item.distractors.map((d, i) => {
            const optObj = item.options?.find(o => o.id === d.optionId)
            const optIdx = optObj && item.options ? item.options.indexOf(optObj) : -1
            return (
              <div key={i} style={{
                fontSize: 12,
                color: '#555',
                padding: '4px 0',
                borderBottom: i < item.distractors!.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
              }}>
                <span style={{ color: '#ff3b30', fontWeight: 600 }}>
                  {optIdx >= 0 ? LETTERS[optIdx] + '. ' : ''}{optObj?.text}
                </span>
                <Tag variant="danger">{d.type}</Tag>
                <span style={{ marginLeft: 4 }}>{d.why}</span>
              </div>
            )
          })}
        </div>
      )}

      {(r.myThought || r.distractorTrap || r.correctMapping) && (
        <div style={{
          marginTop: 10,
          background: '#f8fafc',
          padding: '8px 12px',
          borderRadius: 8,
          fontSize: 13,
          lineHeight: 1.6,
        }}>
          {r.myThought && <div style={{ marginBottom: 4 }}><b>① 我的想法：</b>{r.myThought}</div>}
          {r.distractorTrap && <div style={{ marginBottom: 4 }}><b>② 干扰项如何诱导我：</b>{r.distractorTrap}</div>}
          {r.correctMapping && <div><b>③ 正确项如何替换：</b>{r.correctMapping}</div>}
        </div>
      )}

      <div className="flex-row" style={{ marginTop: 10, gap: 8 }}>
        <Button variant="primary" style={{ padding: '4px 12px', fontSize: 12 }} onClick={onReview}>
          重做此题
        </Button>
        {(r.myThought || r.distractorTrap || r.correctMapping) ? (
          <Button variant="ghost" style={{ padding: '4px 12px', fontSize: 12 }} onClick={onEdit}>
            编辑三问
          </Button>
        ) : (
          <Button variant="ghost" style={{ padding: '4px 12px', fontSize: 12, color: 'var(--c-warning)' }} onClick={onEdit}>
            补填三问
          </Button>
        )}
      </div>
    </div>
  )
}

function QuestionGroup({
  questionId,
  records,
  onEdit,
  onReview,
  onToggleMastered,
}: {
  questionId: string
  records: WrongRecord[]
  onEdit: (r: WrongRecord) => void
  onReview: (q: Question, r: WrongRecord) => void
  onToggleMastered: (r: WrongRecord) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const q = getQuestion(questionId)
  const activeCount = records.filter(r => r.status === 'active').length

  return (
    <div className="card" style={{ marginBottom: 12, overflow: 'hidden' }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          cursor: 'pointer',
          background: expanded ? '#fafbfd' : 'transparent',
          borderBottom: expanded ? '1px solid var(--c-border)' : 'none',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { if (!expanded) e.currentTarget.style.background = '#f5f7fa' }}
        onMouseLeave={(e) => { if (!expanded) e.currentTarget.style.background = 'transparent' }}
      >
        <div style={{ flex: 1 }}>
          <div className="flex-row" style={{ gap: 8, marginBottom: 4 }}>
            {q && <Tag variant="plain">{QUESTION_TYPE_LABELS[q.type]}</Tag>}
            {q?.source === 'imported' && <Tag variant="warning">导入</Tag>}
            {activeCount > 0 && <Tag variant="danger">{activeCount} 题待复习</Tag>}
            {activeCount === 0 && <Tag variant="success">全部掌握</Tag>}
          </div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>
            {q ? q.title : '（题目已删除）'}
          </div>
          <div className="muted small" style={{ marginTop: 2 }}>
            共 {records.length} 道小题错题 · 最后错于 {timeAgo(Math.max(...records.map(r => r.lastWrongAt)))}
          </div>
        </div>
        <div style={{
          fontSize: 18,
          color: '#86868b',
          transition: 'transform 0.2s',
          transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
        }}>
          ›
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '8px 0' }}>
          {records.map(r => {
            const item = q?.items.find(it => it.id === r.itemId)
            return (
              <div key={r.id} style={{ position: 'relative' }}>
                <WrongItemCard
                  r={r}
                  q={q}
                  item={item}
                  onEdit={() => onEdit(r)}
                  onReview={() => { if (q) onReview(q, r) }}
                />
                <div style={{ position: 'absolute', top: 12, right: 16 }}>
                  {r.status === 'active' ? (
                    <button
                      onClick={() => onToggleMastered(r)}
                      style={{
                        padding: '3px 10px',
                        border: '1px solid var(--c-border)',
                        borderRadius: 6,
                        background: 'transparent',
                        color: '#86868b',
                        fontSize: 11,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      标记掌握
                    </button>
                  ) : (
                    <button
                      onClick={() => onToggleMastered(r)}
                      style={{
                        padding: '3px 10px',
                        border: '1px solid rgba(52, 199, 89, 0.3)',
                        borderRadius: 6,
                        background: 'rgba(52, 199, 89, 0.08)',
                        color: '#34c759',
                        fontSize: 11,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      ✓ 已掌握
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function WrongBook() {
  const [records, setRecords] = useLocalStorage<WrongRecord[]>(STORAGE_KEYS.wrongRecords, [])
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'mastered'>('active')
  const [reviewing, setReviewing] = useState<{ question: Question; record: WrongRecord } | null>(null)
  const [editing, setEditing] = useState<WrongRecord | null>(null)

  const shown = useMemo(() => {
    return [...records]
      .filter((r) => statusFilter === 'all' || r.status === statusFilter)
      .sort((a, b) => b.lastWrongAt - a.lastWrongAt)
  }, [records, statusFilter])

  const grouped = useMemo(() => {
    const map = new Map<string, WrongRecord[]>()
    for (const r of shown) {
      const arr = map.get(r.questionId) || []
      arr.push(r)
      map.set(r.questionId, arr)
    }
    return [...map.entries()].sort(([, a], [, b]) => {
      const latestA = Math.max(...a.map(r => r.lastWrongAt))
      const latestB = Math.max(...b.map(r => r.lastWrongAt))
      return latestB - latestA
    })
  }, [shown])

  const handleGraded = (graded: { itemId: string; correct: boolean }[]) => {
    if (!reviewing) return
    const now = Date.now()
    setRecords(
      records.map((r) => {
        const g = graded.find((x) => x.itemId === r.itemId)
        if (!g) return r
        if (g.correct) {
          const reviewCount = r.reviewCount + 1
          return { ...r, reviewCount, lastReviewAt: now, status: reviewCount >= 2 ? 'mastered' : r.status }
        }
        return { ...r, wrongCount: r.wrongCount + 1, lastWrongAt: now, status: 'active' }
      }),
    )
  }

  const toggleMastered = (r: WrongRecord) => {
    setRecords(records.map(x =>
      x.id === r.id ? { ...x, status: x.status === 'active' ? 'mastered' : 'active' } : x
    ))
  }

  if (reviewing) {
    return (
      <PracticeSession
        question={reviewing.question}
        isReview
        onGraded={(graded) => handleGraded(graded.map((g) => ({ itemId: g.itemId, correct: g.correct })))}
        onExit={() => setReviewing(null)}
      />
    )
  }

  const activeCount = records.filter((r) => r.status === 'active').length

  return (
    <div>
      <h1 className="page-title">错题档案</h1>
      <p className="page-sub">
        错题三问是 80 分的核心训练：①我当时怎么想的 ②干扰项如何诱导我 ③正确项如何同义替换。回顾答对 2 次自动标记「已掌握」
      </p>

      <div className="toolbar">
        {(['active', 'all', 'mastered'] as const).map((s) => (
          <button
            key={s}
            className={`btn${statusFilter === s ? ' btn--primary' : ''}`}
            onClick={() => setStatusFilter(s)}
          >
            {s === 'active' ? `待复习（${activeCount}）` : s === 'all' ? '全部' : '已掌握'}
          </button>
        ))}
        <span className="toolbar__spacer" />
        <span className="muted">
          共 {records.length} 条 · 掌握 {records.filter((r) => r.status === 'mastered').length} 条
        </span>
      </div>

      {grouped.length === 0 ? (
        <EmptyState icon="📕" title="没有错题记录">
          {statusFilter === 'active' ? '做错题目后会自动收录到这里' : '练习时做错题会自动入档'}
        </EmptyState>
      ) : (
        <div>
          {grouped.map(([questionId, recs]) => (
            <QuestionGroup
              key={questionId}
              questionId={questionId}
              records={recs}
              onEdit={(r) => setEditing(r)}
              onReview={(q, r) => setReviewing({ question: q, record: r })}
              onToggleMastered={toggleMastered}
            />
          ))}
        </div>
      )}

      {editing && (
        <ThinkingForm
          item={getQuestion(editing.questionId)?.items.find((it) => it.id === editing.itemId) ?? { id: editing.itemId, kind: 'choice', correctIds: [] }}
          wrongAnswer={editing.wrongAnswer}
          initialThought={editing.myThought}
          initialTrap={editing.distractorTrap}
          initialMapping={editing.correctMapping}
          onSave={(t, tr, m) => {
            setRecords(records.map((x) => (x.id === editing.id ? { ...x, myThought: t, distractorTrap: tr, correctMapping: m } : x)))
            setEditing(null)
          }}
          onSkip={() => setEditing(null)}
        />
      )}
    </div>
  )
}
