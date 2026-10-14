import { useRef, useState } from 'react'
import {
  STORAGE_KEYS,
  type Progress,
  type Question,
  type Session,
  type Settings,
  type WrongRecord,
} from '../../types'
import { load } from '../../utils/storage'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useTimer } from '../../hooks/useTimer'
import { formatTime, gradeAnswers, type GradedAnswer } from '../../utils/scoring'
import { resolveItem } from '../../utils/questions'
import { uid } from '../../utils/ids'
import { Button } from '../ui/Button'
import { Tag } from '../ui/Tag'
import { QuestionView } from './QuestionView'
import { ResultView } from './ResultView'
import { ThinkingForm } from './ThinkingForm'
import { Card } from '../ui/Card'
import { QUESTION_TYPE_LABELS } from '../../data'

interface Props {
  question: Question
  isReview?: boolean
  onExit: () => void
  onGraded?: (graded: GradedAnswer[], score: number, total: number) => void
}

type Phase = 'setup' | 'answering' | 'graded'

/* * Practice state machine: setup → answering (timed) → graded (scoring/analysis/wrong questions archived/three questions) */
export function PracticeSession({ question, isReview = false, onExit, onGraded }: Props) {
  const [phase, setPhase] = useState<Phase>('setup')
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [uncertain, setUncertain] = useState<Record<string, boolean>>({})
  const [graded, setGraded] = useState<GradedAnswer[] | null>(null)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [selfScores, setSelfScores] = useState<Record<string, number>>({})
  const [thinkingItemId, setThinkingItemId] = useState<string | null>(null)

  const [sessions, setSessions] = useLocalStorage<Session[]>(STORAGE_KEYS.sessions, [])
  const [wrongRecords, setWrongRecords] = useLocalStorage<WrongRecord[]>(STORAGE_KEYS.wrongRecords, [])
  const [progress, setProgress] = useLocalStorage<Progress>(STORAGE_KEYS.progress, {})

  const timer = useTimer(phase === 'answering')
  const startedAtRef = useRef(0)
  const isSubjective = question.type === 'translation' || question.type === 'writing'
  const hasSubjectiveAnswer = Boolean((answers[question.id] ?? [''])[0]?.trim())

  const start = () => {
    startedAtRef.current = Date.now()
    setPhase('answering')
  }

  const upsertWrong = (records: WrongRecord[], g: GradedAnswer) => {
    const existing = records.find((r) => r.questionId === question.id && r.itemId === g.itemId)
    const now = Date.now()
    if (existing) {
      existing.wrongCount += 1
      existing.lastWrongAt = now
      existing.wrongAnswer = g.answer
      existing.correctAnswer = g.item.correctIds
      existing.status = 'active'
    } else {
      records.push({
        id: uid('wr'),
        questionId: question.id,
        itemId: g.itemId,
        firstWrongAt: now,
        lastWrongAt: now,
        wrongCount: 1,
        wrongAnswer: g.answer,
        correctAnswer: g.item.correctIds,
        myThought: '',
        distractorTrap: '',
        correctMapping: '',
        status: 'active',
        reviewCount: 0,
      })
    }
  }

  const updateProgress = (s: number, t: number) => {
    const prev = progress[question.id] ?? { attempts: 0, bestScore: 0, total: t, lastAt: 0, completed: false }
    const next: Progress = {
      ...progress,
      [question.id]: {
        attempts: prev.attempts + 1,
        bestScore: Math.max(prev.bestScore, s),
        total: t,
        lastAt: Date.now(),
        completed: true,
      },
    }
    setProgress(next)
  }

  const submit = () => {
    if (isSubjective && !hasSubjectiveAnswer) return
    timer.setPaused(true)
    const now = Date.now()
    if (isSubjective) {
      // Subjective question: no scoring, proceed to self-assessment
      setGraded([])
      setSessions([
        ...sessions,
        {
          id: uid('s'),
          questionId: question.id,
          startedAt: startedAtRef.current,
          finishedAt: now,
          answers: [{ itemId: question.id, answer: answers[question.id] ?? [], uncertain: false, correct: false, timeSpent: Math.round((now - startedAtRef.current) / 1000) }],
          score: 0,
          total: 0,
          isReview,
        },
      ])
      updateProgress(0, 0)
      setPhase('graded')
      return
    }

    const result = gradeAnswers(question.items, answers, uncertain)
    setGraded(result.graded)
    setScore(result.score)
    setTotal(result.total)

    if (!isReview) {
      const newWrong = [...wrongRecords]
      for (const g of result.graded) {
        if (!g.correct) upsertWrong(newWrong, g)
      }
      setWrongRecords(newWrong)
      updateProgress(result.score, result.total)
    }

    setSessions([
      ...sessions,
      {
        id: uid('s'),
        questionId: question.id,
        startedAt: startedAtRef.current,
        finishedAt: now,
        answers: result.graded.map((g) => ({
          itemId: g.itemId,
          answer: g.answer,
          uncertain: g.uncertain,
          correct: g.correct,
          timeSpent: Math.round((now - startedAtRef.current) / 1000),
        })),
        score: result.score,
        total: result.total,
        isReview,
      },
    ])

    setPhase('graded')
    onGraded?.(result.graded, result.score, result.total)

    // When the setting is enabled, automatically pop up the three-question form for the first wrong question
    const settings = load<Settings>(STORAGE_KEYS.settings, { promptThinkingOnWrong: true })
    if (!isReview && settings.promptThinkingOnWrong) {
      const firstWrong = result.graded.find((g) => !g.correct)
      if (firstWrong) setThinkingItemId(firstWrong.itemId)
    }
  }

  const addToWrongBook = (itemId: string) => {
    const g = graded?.find((x) => x.itemId === itemId)
    if (!g) return
    const newWrong = [...wrongRecords]
    upsertWrong(newWrong, g)
    setWrongRecords(newWrong)
  }

  const saveThinking = (myThought: string, distractorTrap: string, correctMapping: string) => {
    if (thinkingItemId) {
      setWrongRecords(
        wrongRecords.map((r) =>
          r.questionId === question.id && r.itemId === thinkingItemId
            ? { ...r, myThought, distractorTrap, correctMapping }
            : r,
        ),
      )
    }
    setThinkingItemId(null)
  }

  const handleSelfScore = (qid: string, v: number) => {
    setSelfScores({ ...selfScores, [qid]: v })
    setSessions(
      sessions.map((s, i) =>
        i === sessions.length - 1 && s.questionId === question.id
          ? {
              ...s,
              answers: s.answers.map((a) => (a.itemId === qid ? { ...a, selfScore: v } : a)),
            }
          : s,
      ),
    )
  }

  const thinkingItem = thinkingItemId
    ? question.items.find((it) => it.id === thinkingItemId)
    : undefined

  if (phase === 'setup') {
    if (question.type !== 'reading') {
      return (
        <div className="study-page">
          <div className="docsum__cit">{question.sourceLabel} · {QUESTION_TYPE_LABELS[question.type]}</div>
          <h1 className="page-title">{question.title}</h1>
          <p className="page-sub">
            {question.items.length ? `${question.items.length} questions` : 'Self-assessment with reference material'}
            {question.suggestedMinutes ? ` · Suggested time: ${question.suggestedMinutes} minutes` : ''}
            {isReview ? ' · Review exercise' : ''}
          </p>
          {question.tips?.length ? (
            <Card title="Exercise guidance">
              <ul className="advice-list">{question.tips.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
            </Card>
          ) : null}
          <div className="flex-row">
            <Button onClick={onExit}>Back</Button>
            <Button variant="primary" onClick={start}>Start answering</Button>
          </div>
        </div>
      )
    }
    return (
      <div className="card" style={{ textAlign: 'center', padding: 40 }}>
        <div className="flex-row" style={{ justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <Tag variant="plain">{question.sourceLabel}</Tag>
          <Tag>{question.title}</Tag>
          {isReview && <Tag variant="warning"> Wrong-question review </Tag>}
        </div>
        <p className="muted">
          {question.items.length > 0 ? ` Total ${question.items.length} Question ` : "Subjective question · Self-assessment by comparison"}
          {question.suggestedMinutes ? `　Suggested time ${question.suggestedMinutes} minutes ` : ''}
        </p>
        {question.tips && question.tips.length > 0 && (
          <div style={{ textAlign: 'left', margin: '12px auto', maxWidth: 520 }}>
            <div className="form-label"> Question tips </div>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13.5 }}>
              {question.tips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex-row" style={{ justifyContent: 'center', marginTop: 18 }}>
          <Button onClick={onExit}> Back </Button>
          <Button variant="primary" onClick={start}>

             Start answering
          </Button>
        </div>
      </div>
    )
  }

  if (phase === 'graded' && graded) {
    return (
      <div className={question.type === 'reading' ? undefined : 'study-page'}>
        <div className="flex-row" style={{ marginBottom: 12 }}>
          <Button variant="ghost" onClick={onExit}>

             ← Back
          </Button>
          <span className="muted"> Time used  {formatTime(timer.seconds)}</span>
        </div>
        <ResultView
          question={question}
          graded={graded}
          score={score}
          total={total}
          timeSpent={timer.seconds}
          selfScores={selfScores}
          onSelfScore={handleSelfScore}
          onAddToWrongBook={addToWrongBook}
          onOpenThinking={setThinkingItemId}
          onRestart={() => {
            setAnswers({})
            setUncertain({})
            setGraded(null)
            setSelfScores({})
            timer.reset()
            startedAtRef.current = Date.now()
            setPhase('answering')
          }}
          onBack={onExit}
        />
        {thinkingItem && (() => {
          const existingRec = wrongRecords.find((r) => r.questionId === question.id && r.itemId === thinkingItem.id)
          return (
            <ThinkingForm
              item={resolveItem(question, thinkingItem)}
              wrongAnswer={existingRec?.wrongAnswer ?? []}
              initialThought={existingRec?.myThought}
              initialTrap={existingRec?.distractorTrap}
              initialMapping={existingRec?.correctMapping}
              onSave={saveThinking}
              onSkip={() => setThinkingItemId(null)}
            />
          )
        })()}
      </div>
    )
  }

  // answering
  return (
    <div className={question.type === 'reading' ? undefined : 'study-page'}>
      {/* Reading session actions */}
      <div className={`action-bar${question.type === 'reading' ? '' : ' action-bar--study'}`} style={question.type === 'reading' ? { marginBottom: 20, marginLeft: -20, marginRight: -20, marginTop: -24 } : undefined}>
        <div className="action-bar__inner">
          <Button variant="ghost" onClick={onExit}>

             ← Back to search
          </Button>
          <span className="muted small">{question.sourceLabel}</span>
          <span className="action-bar__actions" style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="muted">
              ⏱ {formatTime(timer.seconds)}
              {question.suggestedMinutes ? ` / ${question.suggestedMinutes} minutes suggested ` : ''}
            </span>
            <Button variant="primary" onClick={submit} disabled={isSubjective && !hasSubjectiveAnswer}>

               Submit
            </Button>
          </span>
        </div>
      </div>
      {question.type !== 'reading' && <header className="study-session-heading">
        <h1 className="page-title">{question.title}</h1>
        <p className="page-sub">{QUESTION_TYPE_LABELS[question.type]} · {question.sourceLabel}</p>
      </header>}
      <QuestionView
        question={question}
        answers={answers}
        uncertain={uncertain}
        onAnswer={(itemId, a) => setAnswers({ ...answers, [itemId]: a })}
        onUncertain={(itemId, v) => setUncertain({ ...uncertain, [itemId]: v })}
      />
      <div className="flex-row" style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--c-divider)' }}>
        <span className="muted">

           Completed  {Object.keys(answers).filter((k) => (answers[k] ?? []).length > 0).length} /{' '}
          {question.items.length > 0 ? question.items.length : '—'}   Question
        </span>
        <span className="toolbar__spacer" />
        <Button variant="primary" onClick={submit} disabled={isSubjective && !hasSubjectiveAnswer}>

           Submit
        </Button>
      </div>
    </div>
  )
}
