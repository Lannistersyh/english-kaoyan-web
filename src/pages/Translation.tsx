import { useMemo, useState } from 'react'
import type { Question, Session } from '../types'
import { STORAGE_KEYS } from '../types'
import { getQuestionsByType } from '../utils/questions'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { PracticeSession } from '../components/practice/PracticeSession'
import { Button } from '../components/ui/Button'
import { Tag } from '../components/ui/Tag'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { Modal } from '../components/ui/Modal'

type Tab = 'practice' | 'history'

function formatDate(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** 调用 DeepSeek API 对翻译进行 AI 评分（CORS 直连，无需代理） */
async function aiScoreTranslation(
  englishText: string,
  chineseTranslation: string,
  referenceTranslation?: string,
): Promise<{ score: number; comment: string } | null> {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY as string
  if (!apiKey) {
    console.warn('[AI] DeepSeek API key not configured')
    return null
  }

  const prompt = `你是英语翻译评分专家。请从"信（忠实原文）"、"达（通顺流畅）"、"雅（文采表达）"三个维度对以下英译汉翻译进行评分（0-10分，取整），并用50字以内点评不足之处。

原文：${englishText}
参考译文：${referenceTranslation || '无'}
用户译文：${chineseTranslation}

请严格按以下JSON格式返回（不要返回其他内容）：
{"score": 分数, "comment": "点评"}`

  try {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.3,
      }),
      signal: AbortSignal.timeout(15000),
    })

    if (!res.ok) {
      console.error('[AI] DeepSeek API error:', res.status)
      return null
    }

    const data = await res.json()
    const msg = data.choices?.[0]?.message?.content || ''
    const jsonMatch = msg.match(/\{[^}]+\}/)
    if (!jsonMatch) return null

    const result = JSON.parse(jsonMatch[0])
    return {
      score: Math.max(0, Math.min(10, Math.round(result.score ?? 5))),
      comment: String(result.comment ?? '').slice(0, 100),
    }
  } catch (err) {
    console.error('[AI] Score error:', err)
    return null
  }
}
export default function Translation() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('practice')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  // 文章级折叠：展开的 questionId 集合
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  // 确认删除
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  // AI 评分状态
  const [aiScoringId, setAiScoringId] = useState<string | null>(null)
  const [aiError, setAiError] = useState('')

  const questions = getQuestionsByType('translation')
  const allQuestions = useMemo(() => {
    const map = new Map<string, Question>()
    questions.forEach((q) => map.set(q.id, q))
    return map
  }, [questions])

  const [sessions, setSessions] = useLocalStorage<Session[]>(STORAGE_KEYS.sessions, [])

  // 按 questionId 分组
  const groupedSessions = useMemo(() => {
    const groups = new Map<string, Session[]>()
    for (const s of sessions) {
      if (!allQuestions.has(s.questionId)) continue
      const arr = groups.get(s.questionId) || []
      arr.push(s)
      groups.set(s.questionId, arr)
    }
    // 每组内部按时间倒序
    for (const arr of groups.values()) {
      arr.sort((a, b) => b.startedAt - a.startedAt)
    }
    // 组间按最新一次练习时间倒序
    return [...groups.entries()].sort((a, b) => {
      return b[1][0].startedAt - a[1][0].startedAt
    })
  }, [sessions, allQuestions])

  const toggleGroup = (qid: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(qid)) next.delete(qid)
      else next.add(qid)
      return next
    })
  }

  const doDelete = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId))
    setDeleteTarget(null)
    setExpandedId(null)
  }

  const handleAiScore = async (session: Session) => {
    const q = allQuestions.get(session.questionId)
    const userText = session.answers[0]?.answer?.[0] ?? ''
    if (!q?.passage || !userText.trim()) return

    setAiScoringId(session.id)
    setAiError('')

    const result = await aiScoreTranslation(
      q.passage,
      userText,
      q.referenceTranslation,
    )

    if (result) {
      setSessions(
        sessions.map((s) => {
          if (s.id !== session.id) return s
          return {
            ...s,
            answers: s.answers.map((a) =>
              a.itemId === s.questionId
                ? { ...a, selfScore: result.score, aiComment: result.comment }
                : a,
            ),
          }
        }),
      )
    } else {
      setAiError('AI 评分失败，请检查网络后重试')
    }
    setAiScoringId(null)
  }

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
          📜 历史记录（{sessions.filter((s) => allQuestions.has(s.questionId)).length}）
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
            按文章分组折叠 · AI 评分 · 自评对比 · 追踪进步轨迹
          </p>

          {aiError && (
            <div className="card card--flat" style={{ borderColor: 'var(--c-danger)', marginBottom: 14, color: 'var(--c-danger)' }}>
              {aiError}
            </div>
          )}

          {groupedSessions.length === 0 ? (
            <Card>
              <EmptyState icon="📜" title="暂无翻译记录">去「练习」页完成一次翻译后自动出现在这里</EmptyState>
            </Card>
          ) : (
            <div>
              {groupedSessions.map(([qid, groupSessions]) => {
                const q = allQuestions.get(qid)
                const isGroupOpen = expandedGroups.has(qid)
                const totalInGroup = groupSessions.length

                return (
                  <div key={qid} className="card" style={{ marginBottom: 12 }}>
                    {/* 组标题：可折叠 */}
                    <div
                      className="flex-row"
                      style={{ justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => toggleGroup(qid)}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                          {q?.title ?? '(题目已删除)'}
                        </div>
                        <div className="muted small">
                          {totalInGroup} 次练习记录
                          {' · '}最近 {formatDate(groupSessions[0].startedAt)}
                        </div>
                      </div>
                      <span className="muted" style={{ fontSize: 13, marginRight: 8 }}>
                        {isGroupOpen ? '收起 ↑' : `展开 ${totalInGroup} 条 ↓`}
                      </span>
                    </div>

                    {/* 展开的每条记录 */}
                    {isGroupOpen && (
                      <div style={{ marginTop: 10, borderTop: '1px solid var(--c-border)' }}>
                        {groupSessions.map((s, idx) => {
                          const userText = s.answers[0]?.answer?.[0] ?? ''
                          const selfScore = s.answers[0]?.selfScore
                          const aiComment = s.answers[0]?.aiComment ?? ''
                          const durSec = s.finishedAt ? Math.round((s.finishedAt - s.startedAt) / 1000) : 0
                          const isExpanded = expandedId === s.id

                          return (
                            <div key={s.id} style={{
                              borderBottom: idx < groupSessions.length - 1 ? '1px solid var(--c-border)' : 'none',
                              padding: '10px 0',
                            }}>
                              {/* 摘要行 */}
                              <div
                                className="flex-row"
                                style={{ justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                                onClick={() => setExpandedId(isExpanded ? null : s.id)}
                              >
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 13, color: 'var(--c-text-secondary)' }}>
                                    {s.isReview && <Tag variant="warning">回顾</Tag>}
                                    {' '}{formatDate(s.startedAt)} · 用时 {Math.floor(durSec / 60)} 分 {durSec % 60} 秒
                                  </div>
                                  <div className="flex-row" style={{ gap: 8, marginTop: 2 }}>
                                    {selfScore !== undefined && (
                                      <Tag variant={selfScore >= 7 ? 'success' : selfScore >= 5 ? 'warning' : 'danger'}>
                                        {aiComment ? '🤖 AI' : '⭐ 自评'} {selfScore}/10
                                      </Tag>
                                    )}
                                    {aiComment && (
                                      <span className="muted small" style={{ flex: 1 }}>
                                        {aiComment}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex-row" style={{ gap: 4 }}>
                                  {/* AI 评分按钮 */}
                                  <Button
                                    variant="ghost"
                                    style={{ padding: '3px 8px', fontSize: 11 }}
                                    disabled={aiScoringId === s.id}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleAiScore(s)
                                    }}
                                  >
                                    {aiScoringId === s.id ? '🤖 评分中…' : '🤖 AI 评分'}
                                  </Button>
                                  {/* 删除按钮 */}
                                  <Button
                                    variant="ghost"
                                    style={{ padding: '3px 8px', fontSize: 11, color: 'var(--c-danger)' }}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setDeleteTarget(s.id)
                                    }}
                                  >
                                    🗑
                                  </Button>
                                  <span className="muted" style={{ fontSize: 12 }}>
                                    {isExpanded ? '收起 ↑' : '展开 ↓'}
                                  </span>
                                </div>
                              </div>

                              {/* 展开区 */}
                              {isExpanded && (
                                <div style={{ marginTop: 10, paddingLeft: 4 }}>
                                  {/* 原文 */}
                                  <div className="card card--flat" style={{ background: '#f8fafc', marginBottom: 8 }}>
                                    <div className="form-label">📖 原文</div>
                                    <p style={{ fontSize: 14.5, lineHeight: 1.9, margin: 0, fontStyle: 'italic' }}>
                                      {q?.passage ?? '（原文已删除）'}
                                    </p>
                                  </div>

                                  {/* 我的译文 */}
                                  <div className="card card--flat" style={{ marginBottom: 8, borderLeft: '3px solid var(--c-primary)' }}>
                                    <div className="form-label">✏️ 我的译文</div>
                                    <p style={{ fontSize: 14, lineHeight: 1.9, margin: 0, whiteSpace: 'pre-wrap' }}>
                                      {userText.trim() || <span className="muted">（未填写）</span>}
                                    </p>
                                  </div>

                                  {/* 参考译文 */}
                                  {q?.referenceTranslation && (
                                    <div className="card card--flat" style={{ marginBottom: 8, borderLeft: '3px solid var(--c-success)' }}>
                                      <div className="form-label">🎯 参考译文</div>
                                      <p style={{ fontSize: 14, lineHeight: 1.9, margin: 0 }}>
                                        {q.referenceTranslation}
                                      </p>
                                    </div>
                                  )}

                                  {/* 三步拆解 */}
                                  {q?.translationSteps && q.translationSteps.length > 0 && (
                                    <div className="card card--flat" style={{ marginBottom: 8, background: '#fffcf0' }}>
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

                                  {/* 自评 */}
                                  <div className="flex-row" style={{ gap: 10, marginBottom: 8 }}>
                                    <span className="muted small">⭐ 自评（0-10）：</span>
                                    {[2, 4, 5, 6, 7, 8, 9, 10].map((v) => (
                                      <Button
                                        key={v}
                                        variant={selfScore === v && !aiComment ? 'primary' : 'ghost'}
                                        style={{ padding: '3px 10px', fontSize: 12 }}
                                        onClick={() => {
                                          setSessions(sessions.map((s2) => {
                                            if (s2.id !== s.id) return s2
                                            return {
                                              ...s2,
                                              answers: s2.answers.map((a) =>
                                                a.itemId === s2.questionId ? { ...a, selfScore: v, aiComment: '' } : a,
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
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* 删除确认 Modal */}
      {deleteTarget && (
        <Modal
          title="确认删除"
          onClose={() => setDeleteTarget(null)}
          footer={
            <>
              <Button onClick={() => setDeleteTarget(null)}>取消</Button>
              <Button variant="danger" onClick={() => doDelete(deleteTarget)}>确认删除</Button>
            </>
          }
        >
          <p>删除后不可恢复，确定要删除这条翻译记录吗？</p>
        </Modal>
      )}
    </div>
  )
}
