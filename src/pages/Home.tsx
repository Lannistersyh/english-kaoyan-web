import type { Progress, Session, WrongRecord } from '../types'
import { STORAGE_KEYS } from '../types'
import { QUESTION_TYPE_LABELS } from '../data'
import { getAllQuestions } from '../utils/questions'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { formatTime } from '../utils/scoring'
import { Tag } from '../components/ui/Tag'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'

const BOARD_TARGETS = [
  { section: "Cloze", full: 10, target: 8, point: "Uncommon meanings of familiar words · Synonym discrimination · Logical connectives" },
  { section: "Reading Part A", full: 40, target: '34-36', point: "Logic visualization · Distractor types · Synonym substitution" },
  { section: "New question types Part B", full: 10, target: 10, point: "Pronoun reference · Logical connectives · Lexical repetition" },
  { section: "Paraphrasing", full: 10, target: '7-7.5', point: "Structure → Meaning → Clear expression" },
  { section: "Writing Part W", full: 30, target: '23-24', point: "Picture interpretation · Functional sentence patterns · Multi-dimensional argumentation" },
]

export default function Home() {
  const [progress] = useLocalStorage<Progress>(STORAGE_KEYS.progress, {})
  const [wrongRecords] = useLocalStorage<WrongRecord[]>(STORAGE_KEYS.wrongRecords, [])
  const [sessions] = useLocalStorage<Session[]>(STORAGE_KEYS.sessions, [])

  const allQuestions = getAllQuestions()
  const completedCount = allQuestions.filter(q => progress[q.id]?.completed).length
  const activeWrong = wrongRecords.filter((w) => w.status === 'active')
  const pendingThinking = wrongRecords.filter((w) => w.status === 'active' && !w.myThought)
  const masteredCount = wrongRecords.filter((w) => w.status === 'mastered').length
  const recent = [...sessions].sort((a, b) => b.startedAt - a.startedAt).slice(0, 6)

  return (
    <div className="study-page">
      <h1 className="page-title"> Dashboard </h1>
      <p className="page-sub"> Goal: 80+ on the postgraduate entrance exam English test. Consolidate abilities in each section through close reading, mistake review, and expression training. </p>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card__num">{allQuestions.length}</div>
          <div className="stat-card__label"> Total questions (built-in + imported) </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__num">{completedCount} / {allQuestions.length}</div>
          <div className="stat-card__label"> Completed </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__num">{activeWrong.length}</div>
          <div className="stat-card__label"> Mistakes to review </div>
          {pendingThinking.length > 0 && (
            <div className="small" style={{ color: 'var(--c-danger)', marginTop: 4 }}>
              {pendingThinking.length}   items awaiting the three questions
            </div>
          )}
        </div>
        <div className="stat-card">
          <div className="stat-card__num">{masteredCount}</div>
          <div className="stat-card__label"> Mistakes mastered </div>
        </div>
      </div>

      <Card title="Section goals" style={{ marginTop: 30 }}>
        <table className="target-table">
          <thead>
            <tr>
              <th> Section </th>
              <th> Full score </th>
              <th> Goal </th>
              <th> Breakthrough point </th>
            </tr>
          </thead>
          <tbody>
            {BOARD_TARGETS.map((t) => (
              <tr key={t.section}>
                <td><b>{t.section}</b></td>
                <td>{t.full}</td>
                <td><span className="stat-card__num" style={{ fontSize: 15 }}>{t.target}</span></td>
                <td className="muted small">{t.point}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="muted small" style={{ marginTop: 10 }}>

           The key to 80 points is not scoring 2 more points, but logical depth and refined expression: after each question, ask yourself the three questions (How did I think at the time / How did the distractor lure me / How does the correct option paraphrase the original).
        </div>
      </Card>

      <Card title="Recent practice" style={{ marginTop: 30 }}>
        {recent.length === 0 ? (
          <EmptyState icon="✏️" title="No practice records yet">

             Go to the &quot;Practice&quot; page and pick one to start
          </EmptyState>
        ) : (
          <div className="item-list">
            {recent.map((s) => {
              const q = allQuestions.find((x) => x.id === s.questionId)
              const durSec = s.finishedAt ? Math.round((s.finishedAt - s.startedAt) / 1000) : 0
              return (
                <div key={s.id} className="item-row" style={{ cursor: 'default' }}>
                  <div className="item-row__main">
                    <div className="item-row__title">
                      {q ? q.title : "(Question deleted)"}
                      {s.isReview && <Tag variant="warning"> Review </Tag>}
                      {q && <span className="muted small">　{QUESTION_TYPE_LABELS[q.type]}</span>}
                    </div>
                    <div className="item-row__meta">
                      {new Date(s.startedAt).toLocaleString('en-US')}   · Time spent  {formatTime(durSec)}
                    </div>
                  </div>
                  {!s.isReview && s.total > 0 && (
                    <b className="stat-card__num" style={{ fontSize: 15 }}>
                      {s.score} / {s.total}
                    </b>
                  )}
                  {!s.isReview && s.total === 0 && <span className="muted small"> Subjective question · Self-assessment </span>}
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <Card title="Study guidance" flat style={{ marginTop: 30 }}>
        <ul className="advice-list">
          <li><b> Reading: </b> Look at the structure notes (claim/evidence/attitude) before the questions, and learn to identify distractor types before judging </li>
          <li><b> Cloze: </b> Collect uncommon meanings of familiar words from mistakes into vocabulary flashcards and review them cyclically </li>
          <li><b> New question types: </b> The goal is a full score—focus firmly on pronoun reference and logical connectives; these two are enough to get 10 points </li>
          <li><b> Paraphrasing: </b> Restate 1-2 complex English sentences each day using the three-step method </li>
          <li><b> Writing: </b> Refuse to memorize whole templates; accumulate functional sentence patterns + one framework for ideas, and combine them freely in the exam room </li>
          <li><b> Rhythm: </b> Go through past exams at least 2-3 times; from the second pass onward, focus on how the distractors are designed, not the answers </li>
        </ul>
      </Card>
    </div>
  )
}
