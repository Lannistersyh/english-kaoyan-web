import { useMemo, useState } from 'react'
import type { Question, Session } from '../types'
import { STORAGE_KEYS } from '../types'
import { getQuestionsByType } from '../utils/questions'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { PracticeSession } from '../components/practice/PracticeSession'
import { Tag } from '../components/ui/Tag'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'

type Tab = 'practice' | 'history'

function formatDate(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function Translation() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('practice')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const questions = getQuestionsByType('translation')
  const allQuestions = useMemo(() => {
    const map = new Map<string, Question>()
    questions.forEach((q) => map.set(q.id, q))
    return map
  }, [questions])

  const [sessions, setSessions] = useLocalStorage<Session[]>(STORAGE_KEYS.sessions, [])

  const translationSessions = useMemo(() => {
    return [...sessions]
      .filter((s) => allQuestions.has(s.questionId))
      .sort((a, b) => b.startedAt - a.startedAt)
  }, [sessions, allQuestions])

  const active = questions.find((q) => q.id === activeId)

  if (active) {
    return <PracticeSession question={active} onExit={() => setActiveId(null)} />
  }

  return (
    <div>
      <h1 className="page-title">翻译</h1>

      {/* Tab bar */}
      <div className="toolbar" style={{ marginBottom: 18 }}>
        <button className={`btn${tab === 'practice' ? ' btn--primary' : ''}`} onClick={() => setTab('practice')}>
          🈯 练习
        </button>
        <button className={`btn${tab === 'history' ? ' btn--primary' : ''}`} onClick={() => setTab('history')}>
          📜 历史记录（{translationSessions.length}）
        </button>
      </div>

      {/* ══════ 练习 Tab ══════ */}
      {tab === 'practice' && (
        <>
          <p className="page-sub">
            英译汉 · 三步翻译法（切分结构 → 调整语序 → 意译通顺）。先自己译，再展开逐步对照
          </p>

          {questions.length === 0 ? (
            <Card>
              <EmptyState icon="🈯" title="暂无翻译题目">去「真题导入」粘贴真题翻译</EmptyState>
            </Card>
          ) : (
            <div className="item-list">
              {questions.map((q: Question) => (
                <div key={q.id} className="item-row" onClick={() => setActiveId(q.id)}>
                  <div className="item-row__main">
                    <div className="item-row__title">{q.title}</div>
                    <div className="item-row__meta">
                      {q.source === 'imported' ? <Tag variant="warning">导入</Tag> : <Tag variant="plain">模拟题</Tag>}
                      {' '}目标 7-7.5 分（共 10 分，允许扣 2.5-3 分）
                    </div>
                  </div>
                  <span className="muted">开始练习 →</span>
                </div>
              ))}
            </div>
          )}

          <div className="card" style={{ marginTop: 20, background: 'var(--c-primary-light)' }}>
            <b>三步翻译法口诀：</b>
            <ol style={{ margin: '6px 0 0', paddingLeft: 20, fontSize: 14 }}>
              <li><b>切分</b>：先找主谓宾主干，再找从句、分词、插入语——把长句拆成短块；</li>
              <li><b>重组</b>：按中文习惯调整语序（定语前置、状语提前、被动转主动）；</li>
              <li><b>意译</b>：把抽象名词转为动词/形容词，避免字面硬译，让译文像中文。</li>
            </ol>
          </div>
        </>
      )}

      {/* ══════ 历史记录 Tab ══════ */}
      {tab === 'history' && (
        <>
          <p className="page-sub">
            记录每次翻译练习，对比参考译文，追踪进步轨迹。
          </p>

          {translationSessions.length === 0 ? (
            <Card>
              <EmptyState icon="📜" title="暂无翻译记录">去「练习」页完成一次翻译后自动出现在这里</EmptyState>
            </Card>
          ) : (
            <div className="item-list">
              {translationSessions.map((s) => {
                const q = allQuestions.get(s.questionId)
                const userText = s.answers[0]?.answer?.[0] ?? ''
                const selfScore = s.answers[0]?.selfScore
                const durSec = s.finishedAt ? Math.round((s.finishedAt - s.startedAt) / 1000) : 0
                const isExpanded = expandedId === s.id

                return (
                  <div key={s.id} className="card" style={{ marginBottom: 12 }}>
                    {/* 摘要行 */}
                    <div
                      className="flex-row"
                      style={{ justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => setExpandedId(isExpanded ? null : s.id)}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, marginBottom: 2 }}>
                          {q?.title ?? '（题目已删除）'}
                          {s.isReview && <Tag variant="warning">回顾</Tag>}
                        </div>
                        <div className="muted small">
                          {formatDate(s.startedAt)} · 用时 {Math.floor(durSec / 60)} 分 {durSec % 60} 秒
                          {selfScore !== undefined && ` · 自评 ${selfScore}/10`}
                        </div>
                      </div>
                      <span className="muted" style={{ fontSize: 13, marginRight: 8 }}>
                        {isExpanded ? '收起 ↑' : '展开对照 ↓'}
                      </span>
                    </div>

                    {/* 展开区：原文 / 我的译文 / 参考译文 */}
                    {isExpanded && (
                      <div style={{ marginTop: 14, borderTop: '1px solid var(--c-border)', paddingTop: 12 }}>
                        {/* 原文 */}
                        <div className="card card--flat" style={{ background: '#f8fafc', marginBottom: 10 }}>
                          <div className="form-label">📖 原文</div>
                          <p style={{ fontSize: 14.5, lineHeight: 1.9, margin: 0, fontStyle: 'italic' }}>
                            {q?.passage ?? '（原文已删除）'}
                          </p>
                        </div>

                        {/* 我的译文 */}
                        <div className="card card--flat" style={{ marginBottom: 10, borderLeft: '3px solid var(--c-primary)' }}>
                          <div className="form-label">✏️ 我的译文（{formatDate(s.startedAt)}）</div>
                          <p style={{ fontSize: 14, lineHeight: 1.9, margin: 0, whiteSpace: 'pre-wrap' }}>
                            {userText.trim() || <span className="muted">（未填写）</span>}
                          </p>
                        </div>

                        {/* 参考译文 */}
                        {q?.referenceTranslation && (
                          <div className="card card--flat" style={{ borderLeft: '3px solid var(--c-success)' }}>
                            <div className="form-label">🎯 参考译文</div>
                            <p style={{ fontSize: 14, lineHeight: 1.9, margin: 0 }}>
                              {q.referenceTranslation}
                            </p>
                          </div>
                        )}

                        {/* 参考步骤拆解（如有） */}
                        {q?.translationSteps && q.translationSteps.length > 0 && (
                          <div className="card card--flat" style={{ marginTop: 10, background: '#fffcf0' }}>
                            <div className="form-label">🔍 三步拆解对照</div>
                            <ol style={{ margin: '6px 0 0', paddingLeft: 20, fontSize: 13, lineHeight: 1.8 }}>
                              {q.translationSteps.map((step) => (
                                <li key={step.step}>
                                  <b>Step {step.step}：</b>{step.zh}
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* 自评调整 */}
                        <div className="flex-row" style={{ marginTop: 12, gap: 10 }}>
                          <span className="muted small">自评打分（0-10）：</span>
                          {[2, 4, 5, 6, 7, 8, 9, 10].map((v) => (
                            <Button
                              key={v}
                              variant={selfScore === v ? 'primary' : 'ghost'}
                              style={{ padding: '3px 10px', fontSize: 12 }}
                              onClick={() => {
                                setSessions(sessions.map((s2) => {
                                  if (s2.id !== s.id) return s2
                                  return {
                                    ...s2,
                                    answers: s2.answers.map((a) =>
                                      a.itemId === s2.questionId ? { ...a, selfScore: v } : a,
                                    ),
                                  }
                                }))
                              }}
                            >
                              {v}
                            </Button>
                          ))}
                        </div>

                        {/* 再练一次 */}
                        <div style={{ marginTop: 12 }}>
                          {q && (
                            <Button
                              variant="primary"
                              style={{ padding: '5px 14px' }}
                              onClick={() => setActiveId(q.id)}
                            >
                              再练一次
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
