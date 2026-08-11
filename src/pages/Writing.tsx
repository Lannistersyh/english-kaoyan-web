import { useState } from 'react'
import type { Question } from '../types'
import { getQuestionsByType } from '../utils/questions'
import { PracticeSession } from '../components/practice/PracticeSession'
import { PatternLibrary } from '../components/writing/PatternLibrary'
import { Tag } from '../components/ui/Tag'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'

export default function Writing() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showLibrary, setShowLibrary] = useState(false)
  const questions = getQuestionsByType('writing')
  const active = questions.find((q) => q.id === activeId)

  if (active) {
    return <PracticeSession question={active} onExit={() => setActiveId(null)} />
  }

  return (
    <div>
      <h1 className="page-title">写作</h1>
      <p className="page-sub">图画作文（目标 23-24 分）：拒绝模板，练论证深度与句式丰富度</p>

      <div className="toolbar">
        <button className="btn" onClick={() => setShowLibrary(!showLibrary)}>
          📚 {showLibrary ? '收起' : '展开'}句型库（8 类功能句型，写作时速查）
        </button>
        <span className="toolbar__spacer" />
        <span className="muted">小作文 8 分 + 大作文 15-16 分</span>
      </div>

      {showLibrary && <PatternLibrary compact />}

      <h3 style={{ marginTop: 24 }}>图画作文练习</h3>
      {questions.length === 0 ? (
        <Card>
          <EmptyState icon="📝" title="暂无写作题目">去「真题导入」粘贴真题作文题</EmptyState>
        </Card>
      ) : (
        <div className="item-list">
          {questions.map((q: Question) => (
            <div key={q.id} className="item-row" onClick={() => setActiveId(q.id)}>
              <div className="item-row__main">
                <div className="item-row__title">{q.title}</div>
                <div className="item-row__meta">
                  {q.source === 'imported' ? <Tag variant="warning">导入</Tag> : <Tag variant="plain">模拟题</Tag>}
                  {' '}写作 → 对照范文（标注所用句型）
                </div>
              </div>
              <span className="muted">开始练习 →</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
