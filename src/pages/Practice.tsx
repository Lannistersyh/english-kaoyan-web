import { useState } from 'react'
import { QUESTION_TYPE_LABELS } from '../data'
import type { Progress, Question, QuestionType } from '../types'
import { STORAGE_KEYS } from '../types'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getQuestionsByType } from '../utils/questions'
import { PracticeSession } from '../components/practice/PracticeSession'
import { EmptyState } from '../components/ui/EmptyState'
import { Card } from '../components/ui/Card'
import type { PageProps } from '../App'

const TABS: QuestionType[] = ['cloze', 'reading', 'matching']

/** 拼装可检索文本：标题 + 文章 + 题干 */
function searchableText(q: Question): string {
  return [q.title, q.passage, ...(q.items ?? []).map((i) => i.stem ?? '')].join(' ').toLowerCase()
}

/** 摘要行：取文章前两句 */
function snippet(q: Question): string {
  if (!q.passage) return q.items.length > 0 ? q.items[0].stem ?? '客观题' : '主观题 · 对照自评'
  const sents = q.passage.replace(/\{\{\d+\}\}/g, ' ___ ').split(/(?<=[.!?])\s+/).slice(0, 2).join(' ')
  return sents.length > 260 ? `${sents.slice(0, 260)}…` : sents
}

export default function Practice({ search = '' }: PageProps) {
  const [tab, setTab] = useState<QuestionType>('cloze')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [onlyUnfinished, setOnlyUnfinished] = useState(false)
  const [onlyImported, setOnlyImported] = useState(false)
  const [onlyWrong, setOnlyWrong] = useState(false)
  const [progress] = useLocalStorage<Progress>(STORAGE_KEYS.progress, {})
  const [wrongRecords] = useLocalStorage<{ questionId: string }[]>(STORAGE_KEYS.wrongRecords, [])

  const active = activeId ? getQuestionsByType(tab).find((q) => q.id === activeId) : null

  if (active) {
    return (
      <PracticeSession
        question={active}
        onExit={() => setActiveId(null)}
      />
    )
  }

  const term = search.trim().toLowerCase()
  const all = getQuestionsByType(tab)
  const wrongIds = new Set(wrongRecords.map((r) => r.questionId))
  const questions = all.filter((q) => {
    if (term && !searchableText(q).includes(term)) return false
    if (onlyImported && q.source !== 'imported') return false
    if (onlyUnfinished && progress[q.id]?.completed) return false
    if (onlyWrong && !wrongIds.has(q.id)) return false
    return true
  })

  return (
    <div>
      <div className="pm-results-head">
        <span>{questions.length.toLocaleString()} result{questions.length === 1 ? '' : 's'}</span>
        {term && <span>for: <b>{search}</b></span>}
      </div>

      <div className="pm-results-layout">
        {/* 左侧过滤器（PubMed filters） */}
        <aside className="pm-filters">
          <div className="pm-filter-group">
            <div className="pm-filter-group__label">题型</div>
            {TABS.map((t) => (
              <label key={t} className={`pm-filter-item${tab === t ? '' : ' pm-filter-item--off'}`}>
                <input type="radio" name="qtype" checked={tab === t} onChange={() => setTab(t)} />
                {QUESTION_TYPE_LABELS[t]}
              </label>
            ))}
          </div>
          <div className="pm-filter-group">
            <div className="pm-filter-group__label">状态</div>
            <label className="pm-filter-item">
              <input type="checkbox" checked={onlyUnfinished} onChange={(e) => setOnlyUnfinished(e.target.checked)} />
              未完成
            </label>
            <label className="pm-filter-item">
              <input type="checkbox" checked={onlyWrong} onChange={(e) => setOnlyWrong(e.target.checked)} />
              有错题
            </label>
            <label className="pm-filter-item">
              <input type="checkbox" checked={onlyImported} onChange={(e) => setOnlyImported(e.target.checked)} />
              导入题
            </label>
          </div>
          <div className="pm-filter-group">
            <div className="pm-filter-group__label">目标参考</div>
            <div className="pm-filter-item pm-filter-item--off" style={{ cursor: 'default' }}>
              完形错 ≤3 · 阅读错 ≤3 · 新题型满分
            </div>
          </div>
        </aside>

        {/* 结果列表（PubMed docsum） */}
        <div className="pm-results-list">
          {questions.length === 0 ? (
            <Card>
              <EmptyState icon="📭" title="没有匹配的题目">
                {term ? `没有找到包含「${search}」的题目，试试其他关键词` : '该题型暂无题目，去「真题导入」粘贴你的真题'}
              </EmptyState>
            </Card>
          ) : (
            questions.map((q, i) => {
              const p = progress[q.id]
              return (
                <div key={q.id} className="docsum">
                  <div className="docsum__num">{i + 1}.</div>
                  <div className="docsum__main">
                    <button
                      type="button"
                      className="docsum__title"
                      onClick={() => setActiveId(q.id)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveId(q.id) } }}
                    >
                      {q.title.replace(/\s*·\s*/g, ' ').replace(/^完形填空\s*/, '').replace(/^阅读理解\s*/, '')}.
                    </button>
                    <div className="docsum__meta">
                      {q.source === 'imported' ? '导入' : '模拟题'} · {q.items.length > 0 ? `${q.items.length} 个小题` : '主观题'}
                    </div>
                    <div className="docsum__cit">
                      考研英语精读训练. {q.suggestedMinutes ? `建议 ${q.suggestedMinutes} 分钟. ` : ''}
                      {p ? `已完成 ${p.attempts} 次 · 最好 ${p.bestScore}/${p.total}.` : 'Free full text'}
                    </div>
                    <div className="docsum__snippet">{snippet(q)}</div>
                  </div>
                  <div className="docsum__side">
                    {p ? `${Math.round((p.bestScore / Math.max(1, p.total)) * 100)}%` : '未练习'}
                    {wrongIds.has(q.id) && <div style={{ color: 'var(--c-danger)' }}>有错题</div>}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
