import { useState } from 'react'
import { QUESTION_TYPE_LABELS } from '../data'
import type { Progress, QuestionType } from '../types'
import { STORAGE_KEYS } from '../types'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getQuestionsByType } from '../utils/questions'
import { PracticeSession } from '../components/practice/PracticeSession'
import { Tag } from '../components/ui/Tag'
import { EmptyState } from '../components/ui/EmptyState'
import { Card } from '../components/ui/Card'

const TABS: QuestionType[] = ['cloze', 'reading', 'matching']

export default function Practice() {
  const [tab, setTab] = useState<QuestionType>('cloze')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [progress] = useLocalStorage<Progress>(STORAGE_KEYS.progress, {})

  const active = activeId ? getQuestionsByType(tab).find((q) => q.id === activeId) : null

  if (active) {
    return (
      <PracticeSession
        question={active}
        onExit={() => setActiveId(null)}
      />
    )
  }

  const questions = getQuestionsByType(tab)

  return (
    <div>
      <h1 className="page-title">练习</h1>
      <p className="page-sub">客观题专项：做完自动判分 → 逐题解析（含干扰项类型）→ 错题进档案</p>
      <div className="toolbar">
        {TABS.map((t) => (
          <button
            key={t}
            className={`btn${tab === t ? ' btn--primary' : ''}`}
            onClick={() => setTab(t)}
          >
            {QUESTION_TYPE_LABELS[t]}
          </button>
        ))}
        <span className="toolbar__spacer" />
        <span className="muted">目标参考：完形错 ≤3 题，阅读错 ≤3 题，新题型满分</span>
      </div>

      {questions.length === 0 ? (
        <Card>
          <EmptyState icon="📭" title="该题型暂无题目">
            去「真题导入」粘贴你的真题，或等待内置题更新
          </EmptyState>
        </Card>
      ) : (
        <div className="item-list">
          {questions.map((q) => {
            const p = progress[q.id]
            return (
              <div key={q.id} className="item-row" onClick={() => setActiveId(q.id)}>
                <div className="item-row__main">
                  <div className="item-row__title">{q.title}</div>
                  <div className="item-row__meta">
                    {q.source === 'imported' ? (
                      <Tag variant="warning">导入</Tag>
                    ) : (
                      <Tag variant="plain">模拟题</Tag>
                    )}{' '}
                    {q.items.length > 0 ? `${q.items.length} 题` : '主观题'}
                    {q.suggestedMinutes ? ` · 建议 ${q.suggestedMinutes} 分钟` : ''}
                  </div>
                </div>
                <PracticeStatus p={p} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function PracticeStatus({ p }: { p?: Progress[string] }) {
  if (!p) return <span className="muted">未练习</span>
  const pct = p.total > 0 ? Math.round((p.bestScore / p.total) * 100) : 0
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontWeight: 700, color: 'var(--c-primary)' }}>{pct}%</div>
      <div className="muted small">
        练习 {p.attempts} 次 · 最好 {p.bestScore}/{p.total}
      </div>
    </div>
  )
}
