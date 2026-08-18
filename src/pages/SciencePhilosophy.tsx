import { useState } from 'react'
import { sciencePhilosophyArticles } from '../data'
import { PracticeSession } from '../components/practice/PracticeSession'

const SOURCE_COLORS: Record<string, string> = {
  'Nautilus': '#1a6b8a',
  'The Atlantic': '#2c2c2c',
  'Scientific American': '#c8102e',
  'Aeon': '#6b3fa0',
  'The New Yorker': '#1a1a1a',
  'Nature': '#2a7d2a',
  'MIT Technology Review': '#a31f34',
  'The Economist': '#e3120b',
  'Stanford Encyclopedia Review': '#8c1515',
  'The Guardian': '#052962',
  'The New York Review of Books': '#333333',
  'London Review of Books': '#1a1a1a',
  'Philosophy Now': '#4a6741',
  'BBC Culture': '#bb1919',
  'Financial Times': '#f2c572',
}

/** 科学哲学精读 */
export default function SciencePhilosophy() {
  const [activeId, setActiveId] = useState<string | null>(null)

  const active = sciencePhilosophyArticles.find((q) => q.id === activeId)
  if (active) {
    return <PracticeSession question={active} onExit={() => setActiveId(null)} />
  }

  return (
    <div>
      <h1 className="page-title">科学哲学精读</h1>
      <p className="page-sub">
        Borges · Wiener · Shannon · Gödel · Kuhn · Heisenberg · Turing — 从控制论到存在主义，从信息论到东方哲学。每篇 3 题 + 逻辑标注 + 词汇解析。
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 18,
      }}>
        {sciencePhilosophyArticles.map((article, i) => (
          <div
            key={article.id}
            onClick={() => setActiveId(article.id)}
            style={{
              background: 'var(--c-surface)',
              border: '1px solid var(--c-border)',
              borderRadius: 12,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: 'var(--shadow)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-lg)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow)'
            }}
          >
            {/* 来源标签 */}
            <div style={{
              padding: '10px 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{
                display: 'inline-block',
                fontSize: 11,
                fontWeight: 700,
                color: '#fff',
                background: SOURCE_COLORS[article.sourceLabel] || '#666',
                borderRadius: 4,
                padding: '2px 8px',
                letterSpacing: 0.5,
              }}>
                {article.sourceLabel}
              </span>
              <span style={{ fontSize: 11, color: 'var(--c-muted)' }}>
                {article.suggestedMinutes} min
              </span>
            </div>

            {/* 标题 */}
            <div style={{ padding: '10px 16px 6px' }}>
              <h3 style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 700,
                lineHeight: 1.35,
                color: 'var(--c-text)',
              }}>
                {article.title}
              </h3>
            </div>

            {/* 题号预览 */}
            <div style={{
              padding: '0 16px 12px',
              fontSize: 12,
              color: 'var(--c-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span style={{
                display: 'inline-block',
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'var(--c-primary)',
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                textAlign: 'center',
                lineHeight: '20px',
              }}>
                {i + 1}
              </span>
              {article.items.length} questions · {(article.passage ?? '').split(/\s+/).length} words
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
