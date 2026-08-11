import { useMemo, useState } from 'react'
import type { Question, WrongRecord } from '../types'
import { STORAGE_KEYS } from '../types'
import { QUESTION_TYPE_LABELS } from '../data'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getQuestion } from '../utils/questions'
import { PracticeSession } from '../components/practice/PracticeSession'
import { ThinkingForm } from '../components/practice/ThinkingForm'
import { Button } from '../components/ui/Button'
import { Tag } from '../components/ui/Tag'
import { EmptyState } from '../components/ui/EmptyState'

function timeAgo(ts: number): string {
  const days = Math.floor((Date.now() - ts) / 86400000)
  if (days <= 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 30) return `${days} 天前`
  return new Date(ts).toLocaleDateString('zh-CN')
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

      {shown.length === 0 ? (
        <EmptyState icon="📕" title="没有错题记录">
          {statusFilter === 'active' ? '做错题目后会自动收录到这里' : '练习时做错题会自动入档'}
        </EmptyState>
      ) : (
        <div className="item-list">
          {shown.map((r) => {
            const q = getQuestion(r.questionId)
            const item = q?.items.find((it) => it.id === r.itemId)
            return (
              <div key={r.id} className="card" style={{ marginBottom: 12 }}>
                <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div className="flex-row" style={{ gap: 8, marginBottom: 4 }}>
                      {q && <Tag variant="plain">{QUESTION_TYPE_LABELS[q.type]}</Tag>}
                      <Tag variant={r.status === 'mastered' ? 'success' : 'danger'}>
                        {r.status === 'mastered' ? '已掌握' : `错 ${r.wrongCount} 次`}
                      </Tag>
                      {!r.myThought && <Tag variant="warning">待补三问</Tag>}
                    </div>
                    <div style={{ fontWeight: 600 }}>{q ? q.title : '（题目已删除）'}</div>
                    <div className="muted small">
                      {item?.stem ?? (item?.kind === 'reorder' ? '排序题' : '')}
                      {'　'}最后错于 {timeAgo(r.lastWrongAt)}
                      {r.reviewCount > 0 ? ` · 回顾答对 ${r.reviewCount} 次` : ''}
                    </div>
                    {(r.myThought || r.distractorTrap || r.correctMapping) && (
                      <div style={{ marginTop: 8, background: '#f8fafc', padding: '8px 12px', borderRadius: 8, fontSize: 13 }}>
                        {r.myThought && <div><b>① 当时的想法：</b>{r.myThought}</div>}
                        {r.distractorTrap && <div><b>② 干扰项陷阱：</b>{r.distractorTrap}</div>}
                        {r.correctMapping && <div><b>③ 正确项替换：</b>{r.correctMapping}</div>}
                      </div>
                    )}
                  </div>
                  <div className="flex-row" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    {q && (
                      <Button variant="primary" style={{ padding: '5px 12px' }} onClick={() => setReviewing({ question: q, record: r })}>
                        重做
                      </Button>
                    )}
                    {!r.myThought && (
                      <Button variant="ghost" style={{ padding: '5px 12px' }} onClick={() => setEditing(r)}>
                        补填三问
                      </Button>
                    )}
                    {r.status === 'active' ? (
                      <Button variant="ghost" style={{ padding: '5px 12px' }} onClick={() => setRecords(records.map((x) => (x.id === r.id ? { ...x, status: 'mastered' } : x)))}>
                        标记掌握
                      </Button>
                    ) : (
                      <Button variant="ghost" style={{ padding: '5px 12px' }} onClick={() => setRecords(records.map((x) => (x.id === r.id ? { ...x, status: 'active' } : x)))}>
                        恢复待复习
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {editing && (
        <ThinkingForm
          item={getQuestion(editing.questionId)?.items.find((it) => it.id === editing.itemId) ?? { id: editing.itemId, kind: 'choice', correctIds: [] }}
          wrongAnswer={editing.wrongAnswer}
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
