import { useState } from 'react'
import type { Question } from '../../types'
import type { GradedAnswer } from '../../utils/scoring'
import { formatTime } from '../../utils/scoring'
import { Button } from '../ui/Button'
import { Tag } from '../ui/Tag'
import { resolveItem } from '../../utils/questions'
import { ExplanationCard } from './ExplanationCard'

interface Props {
  question: Question
  graded: GradedAnswer[]
  score: number
  total: number
  timeSpent: number
  selfScores: Record<string, number>
  submittedText?: string
  onSelfScore: (questionId: string, v: number) => void
  onAddToWrongBook: (itemId: string) => void
  onOpenThinking: (itemId: string) => void
  onRestart: () => void
  onBack: () => void
}

/* Scoring results + question-by-question analysis + subjective question self-assessment */
export function ResultView({
  question,
  graded,
  score,
  total,
  timeSpent,
  selfScores,
  submittedText,
  onSelfScore,
  onAddToWrongBook,
  onOpenThinking,
  onRestart,
  onBack,
}: Props) {
  const isSubjective = question.type === 'translation' || question.type === 'writing'
  const wrongItems = graded.filter((g) => !g.correct)
  const uncertainRight = graded.filter((g) => g.correct && g.uncertain)

  return (
    <div>
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 15 }}>{question.title}</div>
        <div className="stat-card__num" style={{ fontSize: 34, margin: '8px 0' }}>
          {isSubjective ? "Subjective question" : `${score} / ${total}`}
        </div>
        <div className="muted">
          {isSubjective ? "Please self-assess by comparing with the reference content" : ` Time used ${formatTime(timeSpent)}`}
          {!isSubjective && question.suggestedMinutes && timeSpent > question.suggestedMinutes * 60 && (
            <span style={{ color: 'var(--c-warning)' }}>　　 (Exceeded suggested time, pay attention to pacing in the exam room) </span>
          )}
        </div>
      </div>

      {isSubjective ? (
        <>
          <div className="card">
            <div className="form-label">{question.type === 'writing' ? 'Your essay' : 'Your English paraphrase'}</div>
            <p className="study-prose study-prose--pre">{submittedText}</p>
          </div>
          <SubjectiveReview
            question={question}
            selfScores={selfScores}
            onSelfScore={onSelfScore}
          />
        </>
      ) : (
        <>
          {uncertainRight.length > 0 && (
            <div className="card" style={{ borderColor: 'var(--c-warning)' }}>
              <div className="flex-row" style={{ marginBottom: 8 }}>
                <Tag variant="warning"> Answered correctly but uncertain </Tag>
                <span className="muted"> Although the following questions were answered correctly, you guessed—it is recommended to also include them in the wrong-question archive (false mastery is the biggest trap on the road to 80 points) </span>
              </div>
              {uncertainRight.map((g) => (
                <div key={g.itemId} className="flex-row" style={{ justifyContent: 'space-between', marginTop: 6 }}>
                  <span className="small">{g.item.stem}</span>
                  <Button variant="ghost" onClick={() => onAddToWrongBook(g.itemId)}>

                     Include in wrong-question archive
                  </Button>
                </div>
              ))}
            </div>
          )}

          {wrongItems.length > 0 && (
            <div className="card" style={{ borderColor: 'var(--c-danger)' }}>
              <div className="flex-row" style={{ marginBottom: 4 }}>
                <Tag variant="danger"> Wrong question </Tag>
                <span className="muted"> Automatically included in the wrong-question archive. Click &quot;Fill in the three questions&quot; to record your mistaken thinking (you can also fill it in later in the wrong-question archive) </span>
              </div>
            </div>
          )}

          <div className="form-label" style={{ marginTop: 18 }}>

             Question-by-question analysis
          </div>
          {graded.map((g, i) => (
            <div key={g.itemId}>
              <div className="form-label" style={{ margin: '12px 0 6px' }}>
                {i + 1}. {g.item.stem ?? (g.item.kind === 'reorder' ? "Ordering question" : '')}
              </div>
              <ExplanationCard graded={{ ...g, item: resolveItem(question, g.item) }} />
              {!g.correct && (
                <div style={{ marginTop: 6 }}>
                  <Button variant="ghost" onClick={() => onOpenThinking(g.itemId)}>

                     ✍️ Fill in the three questions (What was I thinking at the time / How did the distractor lure me / How did the correct option substitute)
                  </Button>
                </div>
              )}
            </div>
          ))}
        </>
      )}

      <div className="flex-row" style={{ marginTop: 24, justifyContent: 'center' }}>
        <Button onClick={onBack}> Back to question list </Button>
        <Button variant="primary" onClick={onRestart}>

           Practice again
        </Button>
      </div>
    </div>
  )
}

function SubjectiveReview({
  question,
  selfScores,
  onSelfScore,
}: {
  question: Question
  selfScores: Record<string, number>
  onSelfScore: (questionId: string, v: number) => void
}) {
  const score = selfScores[question.id] ?? 5
  const [openStep, setOpenStep] = useState<number | null>(null)
  const isTranslation = question.type === 'translation'

  return (
    <div>
      {isTranslation && question.referenceTranslation && (
        <div className="card">
          <div className="form-label"> Reference Paraphrase </div>
          <p className="study-prose" style={{ margin: 0 }}>{question.referenceTranslation}</p>
          {question.translationSteps && question.translationSteps.length > 0 && (
            <div style={{ marginTop: 12 }}>
              {question.translationSteps.map((s) => (
                <div key={s.step} className={`step-card${openStep === s.step ? ' step-card--open' : ''}`}>
                  <div className="step-card__head" onClick={() => setOpenStep(openStep === s.step ? null : s.step)}>

                     No.  {s.step}   Step: {s.step === 1 ? "Segment structure" : s.step === 2 ? "Adjust word order" : "Paraphrase smoothly"}
                    <span>{openStep === s.step ? '▲' : '▼'}</span>
                  </div>
                  <div className="step-card__body">
                    <div style={{ whiteSpace: 'pre-wrap' }}>{s.zh}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!isTranslation && question.referenceEssay && (
        <div className="card">
          <div className="form-label"> Reference essay </div>
          <div className="study-prose study-prose--pre">{question.referenceEssay}</div>
          {question.essayPatternIds && question.essayPatternIds.length > 0 && (
            <div className="muted" style={{ marginTop: 10 }}>

               Sentence patterns used in the model essay (go to &quot;Writing → Pattern Library&quot; to view English examples and explanations and usage):
              {question.essayPatternIds.join('、')}
            </div>
          )}
        </div>
      )}

      {question.tips && question.tips.length > 0 && (
        <div className="card card--flat">
          <div className="form-label"> Question tips </div>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13.5 }}>
            {question.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="card">
        <div className="form-label"> Self-assessment score (0-10 points) </div>
        <div className="flex-row">
          <input
            type="range"
            min={0}
            max={10}
            step={0.5}
            value={score}
            onChange={(e) => onSelfScore(question.id, parseFloat(e.target.value))}
            style={{ flex: 1 }}
          />
          <span className="stat-card__num" style={{ fontSize: 22 }}>
            {score.toFixed(1)}
          </span>
        </div>
        <div className="muted" style={{ marginTop: 8 }}>
          {isTranslation
            ? "Compare your paraphrase with the reference: Are all key ideas preserved? Is the sentence structure clear? Is the wording natural?"
            : question.targetWords
              ? `Check the purpose, recipient, required points, format, and tone. Aim for about ${question.targetWords} words and use clear, accurate English.`
              : "Check against the model essay: Is the theme extraction accurate? Is the argument multi-dimensional? Are the sentence patterns rich?"}
        </div>
      </div>
    </div>
  )
}
