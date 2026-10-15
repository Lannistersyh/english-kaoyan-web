import { useMemo, useState } from 'react'
import type { Question, Session } from '../types'
import { STORAGE_KEYS } from '../types'
import { getQuestionsByType } from '../utils/questions'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { PracticeSession } from '../components/practice/PracticeSession'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Tag } from '../components/ui/Tag'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { Modal } from '../components/ui/Modal'
import { StudyCollection } from '../components/ui/StudyCollection'
import { scoringEndpoint } from '../utils/scoringEndpoint'

type Tab = 'practice' | 'history'

function formatDate(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/* API keys remain on the scoring server. */
async function aiScoreTranslation(englishText: string, chineseTranslation: string, referenceTranslation?: string): Promise<{ score: number; comment: string }> {
  const endpoint = scoringEndpoint(window.location.hostname, import.meta.env.VITE_AI_API_URL)
  if (!endpoint) throw new Error('AI feedback is unavailable on this site. Compare your answer with the reference and self-assess.')
  const session = supabase ? (await supabase.auth.getSession()).data.session : null
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}) },
    body: JSON.stringify({ englishText, chineseTranslation, referenceTranslation }),
    signal: AbortSignal.timeout(25000),
  })
  let data
  try { data = await res.json() } catch { throw new Error("Scoring service is not connected. Please check the service configuration.") }
  if (!res.ok) throw new Error(data.error || "AI scoring failed. Please try again later.")
  if (!Number.isFinite(data.score) || typeof data.comment !== 'string') throw new Error("Scoring result format is abnormal")
  return { score: Math.max(0, Math.min(10, Math.round(data.score))), comment: data.comment.trim().slice(0, 1000) }
}
export default function Translation() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('practice')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  // Expanded question groups
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  // AI scoring state
  const [aiScoringId, setAiScoringId] = useState<string | null>(null)
  const [aiError, setAiError] = useState('')
  const aiAvailable = Boolean(scoringEndpoint(window.location.hostname, import.meta.env.VITE_AI_API_URL))

  const questions = getQuestionsByType('translation')
  const allQuestions = useMemo(() => {
    const map = new Map<string, Question>()
    questions.forEach((q) => map.set(q.id, q))
    return map
  }, [questions])

  const [sessions, setSessions] = useLocalStorage<Session[]>(STORAGE_KEYS.sessions, [])

  // Group by question ID
  const groupedSessions = useMemo(() => {
    const groups = new Map<string, Session[]>()
    for (const s of sessions) {
      if (!allQuestions.has(s.questionId)) continue
      const arr = groups.get(s.questionId) || []
      arr.push(s)
      groups.set(s.questionId, arr)
    }
    // Newest records first within each group
    for (const arr of groups.values()) {
      arr.sort((a, b) => b.startedAt - a.startedAt)
    }
    // Sort groups by their latest attempt
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

    try {
      const result = await aiScoreTranslation(q.passage, userText, q.referenceTranslation)
      setSessions(current => current.map(s => s.id !== session.id ? s : {
        ...s, answers: s.answers.map(a => a.itemId === s.questionId ? { ...a, selfScore: result.score, aiComment: result.comment } : a),
      }))
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "AI scoring failed. Please try again later.")
    } finally { setAiScoringId(null) }
  }

  const active = questions.find((q) => q.id === activeId)

  if (active) {
    return <PracticeSession question={active} onExit={() => setActiveId(null)} />
  }

  return (
    <div className="study-page">
      <h1 className="page-title"> Paraphrasing </h1>

      {/* Tab bar */}
      <div className="toolbar study-tabs" aria-label="Paraphrasing views">
        <button className={`btn${tab === 'practice' ? ' btn--primary' : ''}`} onClick={() => setTab('practice')}>
          Practice
        </button>
        <button className={`btn${tab === 'history' ? ' btn--primary' : ''}`} onClick={() => setTab('history')}>

          History ({sessions.filter((s) => allQuestions.has(s.questionId)).length})
        </button>
      </div>

      {/* Practice tab */}
      {tab === 'practice' && (
        <>
          <p className="page-sub">

             English paraphrasing: identify the sentence structure, restate it clearly, and compare your version with the reference.
          </p>

          {questions.length === 0 ? (
            <Card>
              <EmptyState icon="📖" title="No paraphrasing questions yet"> Go to &quot;Import&quot; and add an English paraphrasing question </EmptyState>
            </Card>
          ) : (
            <StudyCollection questions={questions} onOpen={setActiveId} />
          )}

          <Card title="Three-step paraphrasing method" className="study-section">
            <ol className="advice-list">
              <li><b> Segment </b> : First find the subject-verb-object main structure, then find clauses, participles, and parentheticals — split long sentences into short chunks; </li>
              <li><b> Reorganize </b> : Use clear English word order, resolve pronoun references, and split long clauses when helpful; </li>
              <li><b> Paraphrase </b> : Choose precise vocabulary and natural English phrasing while preserving the original meaning. </li>
            </ol>
          </Card>
        </>
      )}

      {/* History tab */}
      {tab === 'history' && (
        <>
          <p className="page-sub">

             Grouped and collapsed by article · AI scoring · Self-assessment comparison · Track progress
          </p>
          {!aiAvailable && <p className="muted">AI feedback is unavailable on this site. You can compare your answer with the reference and use self-assessment.</p>}

          {aiError && (
            <div className="card card--flat" style={{ borderColor: 'var(--c-danger)', marginBottom: 14, color: 'var(--c-danger)' }}>
              {aiError}
            </div>
          )}

          {groupedSessions.length === 0 ? (
            <Card>
              <EmptyState icon="📜" title="No paraphrasing records yet"> Go to the &quot;Practice&quot; page and complete a paraphrasing exercise; it will automatically appear here. </EmptyState>
            </Card>
          ) : (
            <div>
              {groupedSessions.map(([qid, groupSessions]) => {
                const q = allQuestions.get(qid)
                const isGroupOpen = expandedGroups.has(qid)
                const totalInGroup = groupSessions.length

                return (
                  <div key={qid} className="study-group">
                    {/* Collapsible group heading */}
                    <button
                      className="study-group__toggle"
                      type="button"
                      aria-expanded={isGroupOpen}
                      aria-controls={`paraphrase-group-${qid}`}
                      onClick={() => toggleGroup(qid)}
                    >
                      <span>
                        <span className="study-group__title">
                          {q?.title ?? "(Question deleted)"}
                        </span>
                        <span className="study-group__metadata">
                          {totalInGroup}   practice records
                          {' · '} Recent  {formatDate(groupSessions[0].startedAt)}
                        </span>
                      </span>
                      <span className="muted">{isGroupOpen ? 'Collapse' : 'Expand'}</span>
                    </button>

                    {/* Expanded records */}
                    {isGroupOpen && (
                      <div id={`paraphrase-group-${qid}`}>
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
                              {/* Summary */}
                              <div className="study-record-summary">
                                <button className="study-record-toggle" type="button" aria-expanded={isExpanded} onClick={() => setExpandedId(isExpanded ? null : s.id)}>
                                  <span className="study-group__metadata">
                                    {s.isReview && <Tag variant="warning"> Review </Tag>}
                                    {' '}{formatDate(s.startedAt)}   · Time spent  {Math.floor(durSec / 60)} minutes  {durSec % 60}   seconds
                                  </span>
                                  <span className="study-group__metadata">
                                    {selfScore !== undefined && (
                                      <Tag variant={selfScore >= 7 ? 'success' : selfScore >= 5 ? 'warning' : 'danger'}>
                                        {aiComment ? 'AI' : 'Self-assessment'} {selfScore}/10
                                      </Tag>
                                    )}
                                    {aiComment && (
                                      <span className="muted small">
                                        {aiComment}
                                      </span>
                                    )}
                                  </span>
                                  <span className="muted">{isExpanded ? 'Collapse record' : 'Expand record'}</span>
                                </button>
                                <div className="flex-row" style={{ gap: 4 }}>
                                  {/* AI scoring action */}
                                  <Button
                                    variant="ghost"
                                    disabled={Boolean(aiScoringId) || !aiAvailable}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleAiScore(s)
                                    }}
                                  >
                                    {aiScoringId === s.id ? 'Scoring…' : 'AI scoring'}
                                  </Button>
                                  {/* Delete action */}
                                  <Button
                                    variant="ghost"
                                    style={{ color: 'var(--c-danger)' }}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setDeleteTarget(s.id)
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>

                              {/* Expanded details */}
                              {isExpanded && (
                                <div style={{ marginTop: 10, paddingLeft: 4 }}>
                                  {/* Original sentence */}
                                  <div className="study-review-context">
                                    <div className="form-label">Original text</div>
                                    <p className="study-prose" style={{ margin: 0 }}>
                                      {q?.passage ?? "(Original text deleted)"}
                                    </p>
                                  </div>

                                  {/* My paraphrase */}
                                  <div className="study-review-context">
                                    <div className="form-label">My paraphrase</div>
                                    <p className="study-prose study-prose--pre" style={{ margin: 0 }}>
                                      {userText.trim() || <span className="muted"> (Not filled in) </span>}
                                    </p>
                                  </div>

                                  {/* Reference paraphrase */}
                                  {q?.referenceTranslation && (
                                    <div className="study-review-context">
                                      <div className="form-label">Reference paraphrase</div>
                                      <p className="study-prose" style={{ margin: 0 }}>
                                        {q.referenceTranslation}
                                      </p>
                                    </div>
                                  )}

                                  {/* Three-step explanation */}
                                  {q?.translationSteps && q.translationSteps.length > 0 && (
                                    <div className="study-review-explanation">
                                      <div className="form-label">Three-step analysis</div>
                                      <ol className="advice-list">
                                        {q.translationSteps.map((step) => (
                                          <li key={step.step}>
                                            <b>Step {step.step}: </b>{step.zh}
                                          </li>
                                        ))}
                                      </ol>
                                    </div>
                                  )}

                                  {/* Self-assessment */}
                                  <div className="flex-row" style={{ gap: 10, marginBottom: 8 }}>
                                    <span className="muted small">Self-assessment (0-10):</span>
                                    {[2, 4, 5, 6, 7, 8, 9, 10].map((v) => (
                                      <Button
                                        key={v}
                                        variant={selfScore === v && !aiComment ? 'primary' : 'ghost'}
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

                                  {/* Practice again */}
                                  {q && (
                                    <Button
                                      variant="primary"
                                      role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click() } }} onClick={() => setActiveId(q.id)}
                                    >

                                       Practice again
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

      {/* Delete confirmation dialog */}
      {deleteTarget && (
        <Modal
          title="Confirm deletion"
          onClose={() => setDeleteTarget(null)}
          footer={
            <>
              <Button onClick={() => setDeleteTarget(null)}> Cancel </Button>
              <Button variant="danger" onClick={() => doDelete(deleteTarget)}> Confirm deletion </Button>
            </>
          }
        >
          <p> This cannot be undone after deletion. Are you sure you want to delete this paraphrasing record? </p>
        </Modal>
      )}
    </div>
  )
}
