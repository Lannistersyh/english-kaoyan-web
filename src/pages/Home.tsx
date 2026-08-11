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
  { section: '完形填空', full: 10, target: 8, point: '熟词僻义 · 近义辨析 · 逻辑衔接词' },
  { section: '阅读 Part A', full: 40, target: '34-36', point: '逻辑可视化 · 干扰项类型 · 同义替换' },
  { section: '新题型 Part B', full: 10, target: 10, point: '代词指代 · 逻辑连接词 · 词汇重现' },
  { section: '英译汉 Part C', full: 10, target: '7-7.5', point: '三步翻译法：切分 → 重组 → 意译' },
  { section: '写作 Part W', full: 30, target: '23-24', point: '图画立意 · 功能性句型 · 多维论证' },
]

export default function Home() {
  const [progress] = useLocalStorage<Progress>(STORAGE_KEYS.progress, {})
  const [wrongRecords] = useLocalStorage<WrongRecord[]>(STORAGE_KEYS.wrongRecords, [])
  const [sessions] = useLocalStorage<Session[]>(STORAGE_KEYS.sessions, [])

  const allQuestions = getAllQuestions()
  const completedCount = Object.values(progress).filter((p) => p.completed).length
  const activeWrong = wrongRecords.filter((w) => w.status === 'active')
  const pendingThinking = wrongRecords.filter((w) => w.status === 'active' && !w.myThought)
  const masteredCount = wrongRecords.filter((w) => w.status === 'mastered').length
  const recent = [...sessions].sort((a, b) => b.startedAt - a.startedAt).slice(0, 6)

  return (
    <div>
      <h1 className="page-title">仪表盘</h1>
      <p className="page-sub">目标：GRE Verbal 165+。缺的不是词汇量，而是逻辑深度与表达精致度。</p>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card__num">{allQuestions.length}</div>
          <div className="stat-card__label">总题量（内置+导入）</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__num">{completedCount} / {allQuestions.length}</div>
          <div className="stat-card__label">已完成</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__num">{activeWrong.length}</div>
          <div className="stat-card__label">错题待巩固</div>
          {pendingThinking.length > 0 && (
            <div className="small" style={{ color: 'var(--c-danger)', marginTop: 4 }}>
              {pendingThinking.length} 条待补三问
            </div>
          )}
        </div>
        <div className="stat-card">
          <div className="stat-card__num">{masteredCount}</div>
          <div className="stat-card__label">已掌握错题</div>
        </div>
      </div>

      <Card title="🎯 分板块目标（80 分路线图）" style={{ marginTop: 18 }}>
        <table className="target-table">
          <thead>
            <tr>
              <th>板块</th>
              <th>满分</th>
              <th>目标</th>
              <th>突破点</th>
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
          80 分的关键不是多做 2 分，而是逻辑深度与表达精致度：做完每道题都问自己三问（我当时怎么想的 / 干扰项如何诱导我 / 正确项如何同义替换）。
        </div>
      </Card>

      <Card title="🕐 最近练习" style={{ marginTop: 18 }}>
        {recent.length === 0 ? (
          <EmptyState icon="✏️" title="还没有练习记录">
            去「练习」页选一篇开始吧
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
                      {q ? q.title : '（题目已删除）'}
                      {s.isReview && <Tag variant="warning">回顾</Tag>}
                      {q && <span className="muted small">　{QUESTION_TYPE_LABELS[q.type]}</span>}
                    </div>
                    <div className="item-row__meta">
                      {new Date(s.startedAt).toLocaleString('zh-CN')} · 用时 {formatTime(durSec)}
                    </div>
                  </div>
                  {!s.isReview && s.total > 0 && (
                    <b className="stat-card__num" style={{ fontSize: 15 }}>
                      {s.score} / {s.total}
                    </b>
                  )}
                  {!s.isReview && s.total === 0 && <span className="muted small">主观题 · 自评</span>}
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <Card title="💡 提分建议" flat style={{ marginTop: 18 }}>
        <ul className="advice-list">
          <li><b>阅读：</b>先看结构笔记（claim/evidence/态度）再看题，学会先识别干扰项类型再判断</li>
          <li><b>完形：</b>把错题里的熟词僻义收进词汇闪卡，循环复习</li>
          <li><b>新题型：</b>目标是满分——盯死代词指代与逻辑连接词，这两条足够拿 10 分</li>
          <li><b>翻译：</b>每天手译 1-2 句真题长难句，严格走三步法</li>
          <li><b>写作：</b>拒绝背整篇模板，积累功能性句型 + 一个立意框架，考场上自由组合</li>
          <li><b>节奏：</b>真题至少过 2-3 遍，第二遍起重点看干扰项设计，而不是答案</li>
        </ul>
      </Card>
    </div>
  )
}
