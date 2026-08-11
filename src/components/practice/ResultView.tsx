import { useState } from 'react'
import type { Question } from '../../types'
import type { GradedAnswer } from '../../utils/scoring'
import { formatTime } from '../../utils/scoring'
import { Button } from '../ui/Button'
import { Tag } from '../ui/Tag'
import { ExplanationCard } from './ExplanationCard'

interface Props {
  question: Question
  graded: GradedAnswer[]
  score: number
  total: number
  timeSpent: number
  selfScores: Record<string, number>
  onSelfScore: (questionId: string, v: number) => void
  onAddToWrongBook: (itemId: string) => void
  onOpenThinking: (itemId: string) => void
  onRestart: () => void
  onBack: () => void
}

/** 判分结果 + 逐题解析 + 主观题自评 */
export function ResultView({
  question,
  graded,
  score,
  total,
  timeSpent,
  selfScores,
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
          {isSubjective ? '主观题' : `${score} / ${total}`}
        </div>
        <div className="muted">
          {isSubjective ? '请对照参考内容自评' : `用时 ${formatTime(timeSpent)}`}
          {!isSubjective && question.suggestedMinutes && timeSpent > question.suggestedMinutes * 60 && (
            <span style={{ color: 'var(--c-warning)' }}>　（超过建议用时，考场注意节奏）</span>
          )}
        </div>
      </div>

      {isSubjective ? (
        <SubjectiveReview
          question={question}
          selfScores={selfScores}
          onSelfScore={onSelfScore}
        />
      ) : (
        <>
          {uncertainRight.length > 0 && (
            <div className="card" style={{ borderColor: 'var(--c-warning)' }}>
              <div className="flex-row" style={{ marginBottom: 8 }}>
                <Tag variant="warning">答对但不确定</Tag>
                <span className="muted">以下题目虽然答对了，但你是蒙的——建议也收进错题档案（假性掌握是 80 分路上的最大陷阱）</span>
              </div>
              {uncertainRight.map((g) => (
                <div key={g.itemId} className="flex-row" style={{ justifyContent: 'space-between', marginTop: 6 }}>
                  <span className="small">{g.item.stem}</span>
                  <Button variant="ghost" onClick={() => onAddToWrongBook(g.itemId)}>
                    收入错题档案
                  </Button>
                </div>
              ))}
            </div>
          )}

          {wrongItems.length > 0 && (
            <div className="card" style={{ borderColor: 'var(--c-danger)' }}>
              <div className="flex-row" style={{ marginBottom: 4 }}>
                <Tag variant="danger">错题</Tag>
                <span className="muted">已自动收录进错题档案，点击「填写三问」记录你的错误思路（也可稍后在错题档案中补填）</span>
              </div>
            </div>
          )}

          <div className="form-label" style={{ marginTop: 18 }}>
            逐题解析
          </div>
          {graded.map((g, i) => (
            <div key={g.itemId}>
              <div className="form-label" style={{ margin: '12px 0 6px' }}>
                {i + 1}. {g.item.stem ?? (g.item.kind === 'reorder' ? '排序题' : '')}
              </div>
              <ExplanationCard graded={g} />
              {!g.correct && (
                <div style={{ marginTop: 6 }}>
                  <Button variant="ghost" onClick={() => onOpenThinking(g.itemId)}>
                    ✍️ 填写三问（我当时怎么想的 / 干扰项如何诱导我 / 正确项如何替换）
                  </Button>
                </div>
              )}
            </div>
          ))}
        </>
      )}

      <div className="flex-row" style={{ marginTop: 24, justifyContent: 'center' }}>
        <Button onClick={onBack}>返回题目列表</Button>
        <Button variant="primary" onClick={onRestart}>
          再练一次
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
          <div className="form-label">参考译文</div>
          <p style={{ margin: 0 }}>{question.referenceTranslation}</p>
          {question.translationSteps && question.translationSteps.length > 0 && (
            <div style={{ marginTop: 12 }}>
              {question.translationSteps.map((s) => (
                <div key={s.step} className={`step-card${openStep === s.step ? ' step-card--open' : ''}`}>
                  <div className="step-card__head" onClick={() => setOpenStep(openStep === s.step ? null : s.step)}>
                    第 {s.step} 步：{s.step === 1 ? '切分结构' : s.step === 2 ? '调整语序' : '意译通顺'}
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
          <div className="form-label">参考范文</div>
          <div style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>{question.referenceEssay}</div>
          {question.essayPatternIds && question.essayPatternIds.length > 0 && (
            <div className="muted" style={{ marginTop: 10 }}>
              范文使用句型（去「写作 → 句型库」查看中英对照与用法）：
              {question.essayPatternIds.join('、')}
            </div>
          )}
        </div>
      )}

      {question.tips && question.tips.length > 0 && (
        <div className="card card--flat">
          <div className="form-label">本题提示</div>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13.5 }}>
            {question.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="card">
        <div className="form-label">自评得分（0-10 分）</div>
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
            ? '对照参考译文自查：结构切分是否正确？语序是否自然？有无字面硬译？'
            : '对照范文自查：主题提炼是否精准？论证是否多维度？句型是否丰富？'}
        </div>
      </div>
    </div>
  )
}
