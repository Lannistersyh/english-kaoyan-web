import type { Question, SubQuestion } from '../../types'
import { PassageRenderer } from './PassageRenderer'
import type { BlockProps } from './types'

const ANNOTATION_LABELS = {
  claim: '论点 Claim',
  evidence: '论据 Evidence',
  attitude: '态度 Attitude',
  keyword: '关键词',
} as const

/** 伪作者行：从标题生成稳定"作者"名单，纯视觉用 */
function fakeAuthors(q: Question): string {
  const seed = q.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const surnames = ['Chen L', 'Wang J', 'Liu Y', 'Zhang H', 'Zhao M', 'Sun Q', 'Li X', 'Wu K']
  const n = 3 + (seed % 3)
  return Array.from({ length: n }, (_, i) => surnames[(seed + i * 3) % surnames.length]).join(', ') + '.'
}

/** 伪引文行 */
function fakeCitation(q: Question): string {
  const seed = q.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const year = 2024 - (seed % 3)
  const vol = 620 + (seed % 20)
  const issue = 1 + (seed % 4)
  const pages = `${(seed % 90) + 10}-${(seed % 90) + 10 + q.items.length}`
  return `${year} Oct;${vol}(${issue}):${pages}.`
}

/** 与引文行一致的 eCollection 年份 */
function fakeCollectionYear(q: Question): number {
  const seed = q.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return 2024 - (seed % 3)
}

/**
 * PubMed 文章页形式的阅读作答视图：
 * 左列 = 引文行 → 衬线标题 → 作者 → Abstract（原文+结构笔记）→ 各小题小节
 * 右列 = FULL TEXT LINKS / ACTIONS 侧栏
 */
export function PubMedReadingView({ question, answers, onAnswer, uncertain, onUncertain }: BlockProps) {
  const annotations = question.passageAnnotations ?? []

  return (
    <div className="pm-article">
      {/* 左列：文章主体 */}
      <article className="pm-article__main">
        <div className="pm-cit">
          <span className="pm-cit__chevron" aria-hidden="true">⌄</span>
          {fakeCitation(question)} doi: 10.1000/ekw.{question.id.replace(/[^a-z0-9]/gi, '')}. eCollection {fakeCollectionYear(question)}.
        </div>

        <h1 className="pm-title">{question.title.replace(/^阅读理解\s*·?\s*/, '')}</h1>

        <div className="pm-authors">
          <b>{fakeAuthors(question)}</b>
        </div>

        {/* 原文作为 Abstract 区块 */}
        <div className="pm-section">
          <h2 className="pm-section__title">Abstract</h2>
          <div className="pm-section__content">
            <PassageRenderer text={question.passage ?? ''} annotations={annotations} />
          </div>

          {annotations.length > 0 && (
            <div className="notes-panel">
              <div className="pm-aside__label" style={{ marginBottom: 8 }}>结构笔记</div>
              {annotations.map((a) => (
                <div
                  key={a.id}
                  className="notes-item"
                  onClick={() => document.getElementById(`ann-${a.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                >
                  <span className={`notes-item__type notes-item__type--${a.type}`}>{ANNOTATION_LABELS[a.type]}</span>
                  <span>
                    {a.note}
                    <span className="muted"> 「{a.text.length > 40 ? `${a.text.slice(0, 40)}…` : a.text}」</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 小题：各作小节 */}
        {question.items.map((item, i) => (
          <QuestionSection
            key={item.id}
            item={item}
            index={i + 1}
            selected={(answers[item.id] ?? [''])[0] ?? ''}
            uncertain={uncertain[item.id] ?? false}
            onAnswer={onAnswer}
            onUncertain={onUncertain}
          />
        ))}

        <div className="pm-ids">
          <div><b>PMID:</b> {question.id.replace(/[^0-9]/g, '').padEnd(8, '0').slice(0, 8) || '39358518'}</div>
          <div><b>DOI:</b> 10.1000/ekw.{question.id}</div>
        </div>
      </article>

      {/* 右列：工具栏 */}
      <aside className="pm-aside">
        <div className="pm-aside__box">
          <div className="pm-aside__label">Full text links</div>
          <button className="pm-aside__btn pm-aside__btn--secondary" type="button">
            <span style={{ color: 'var(--c-danger)', fontWeight: 700 }}>FREE</span> 全文精读
          </button>
          <button className="pm-aside__btn pm-aside__btn--secondary" type="button">考研阅读</button>
        </div>

        <div className="pm-aside__box">
          <div className="pm-aside__label">Actions</div>
          <button className="pm-aside__btn" type="button">📖 查词</button>
          <button className="pm-aside__btn" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑ 返回标题</button>
        </div>

        <div className="pm-aside__box">
          <div className="pm-aside__label">Questions</div>
          {question.items.slice(0, 3).map((it) => (
            <div key={it.id} className="pm-aside__link" title={it.stem ?? ''}>
              {it.stem && it.stem.length > 34 ? `${it.stem.slice(0, 34)}…` : it.stem ?? ''}
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}

function QuestionSection({
  item, index, selected, uncertain, onAnswer, onUncertain,
}: {
  item: SubQuestion
  index: number
  selected: string
  uncertain: boolean
  onAnswer: (itemId: string, a: string[]) => void
  onUncertain: (itemId: string, v: boolean) => void
}) {
  return (
    <div className="pm-section">
      <h2 className="pm-section__title">Question {index}</h2>
      <div className="pm-section__content">
        <p style={{ marginBottom: 10 }}>{item.stem}</p>
        {(item.options ?? []).map((o, idx) => (
          <div
            key={o.id}
            role="radio"
            aria-checked={selected === o.id}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onAnswer(item.id, [o.id]) } }}
            className={`option${selected === o.id ? ' option--selected' : ''}`}
            onClick={() => onAnswer(item.id, [o.id])}
          >
            <span className="option__letter">{String.fromCharCode(65 + idx)}.</span>
            <span>{o.text}</span>
          </div>
        ))}
        <label className="small muted" style={{ display: 'inline-flex', gap: 6, marginTop: 6 }}>
          <input
            type="checkbox"
            checked={uncertain}
            onChange={(e) => onUncertain(item.id, e.target.checked)}
          />
          不确定（防止"蒙对"漏进错题档案）
        </label>
      </div>
    </div>
  )
}
