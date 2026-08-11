import { useState } from 'react'
import type { Question } from '../types'
import { getQuestionsByType } from '../utils/questions'
import { PracticeSession } from '../components/practice/PracticeSession'
import { Tag } from '../components/ui/Tag'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'

export default function Translation() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const questions = getQuestionsByType('translation')
  const active = questions.find((q) => q.id === activeId)

  if (active) {
    return <PracticeSession question={active} onExit={() => setActiveId(null)} />
  }

  return (
    <div>
      <h1 className="page-title">翻译</h1>
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
    </div>
  )
}
