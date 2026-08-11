import { useState } from 'react'
import { newsArticles } from '../data'
import { PracticeSession } from '../components/practice/PracticeSession'
import { Tag } from '../components/ui/Tag'
import { Card } from '../components/ui/Card'

const SOURCE_COLORS: Record<string, string> = {
  'The Economist': '#e3120b',
  'BBC Future': '#bb1919',
  'CNN': '#cc0000',
  'The Atlantic': '#2c2c2c',
  'Nature Briefing': '#4a9b3f',
  'The New Yorker': '#1a1a1a',
}

/** 外刊精读：杂志式排版，点击文章进入练习模式 */
export default function News() {
  const [activeId, setActiveId] = useState<string | null>(null)

  const active = newsArticles.find((q) => q.id === activeId)
  if (active) {
    return <PracticeSession question={active} onExit={() => setActiveId(null)} />
  }

  return (
    <div>
      <h1 className="page-title">外刊精读</h1>
      <p className="page-sub">
        BBC · The Economist · CNN · The Atlantic — 精选短篇，每篇 3 题 + 逻辑标注 + 词汇解析。读外刊不是读答案，是读论证。
      </p>

      <div className="news-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 18,
      }}>
        {newsArticles.map((article) => (
          <div
            key={article.id}
            className="news-card"
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
              padding: '10px 16px',
              borderBottom: `3px solid ${SOURCE_COLORS[article.sourceLabel] ?? 'var(--c-primary)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: SOURCE_COLORS[article.sourceLabel] ?? 'var(--c-primary)',
              }}>
                {article.sourceLabel}
              </span>
              <Tag variant="plain">{article.items.length} 题 · 约 {article.passage?.split(/\s+/).length ?? 0} 词</Tag>
            </div>

            {/* 标题和摘要 */}
            <div style={{ padding: '14px 16px' }}>
              <h3 style={{
                margin: '0 0 8px',
                fontSize: 16,
                lineHeight: 1.4,
                color: 'var(--c-text)',
              }}>
                {article.title}
              </h3>
              {article.passage && (
                <p style={{
                  margin: 0,
                  fontSize: 13,
                  color: 'var(--c-text-secondary)',
                  lineHeight: 1.6,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {article.passage.slice(0, 200).replace(/\{\{\d+\}\}/g, '____')}...
                </p>
              )}
              {article.vocabNotes && article.vocabNotes.length > 0 && (
                <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {article.vocabNotes!.slice(0, 3).map((v, i) => (
                    <span key={i} style={{
                      display: 'inline-block',
                      padding: '1px 8px',
                      borderRadius: 4,
                      background: 'var(--c-primary-light)',
                      color: 'var(--c-primary)',
                      fontSize: 11,
                    }}>
                      {v.split(' ')[0]}
                    </span>
                  ))}
                  {article.vocabNotes!.length > 3 && (
                    <span className="muted" style={{ fontSize: 11 }}>+{article.vocabNotes!.length - 3}</span>
                  )}
                </div>
              )}
            </div>

            {/* 底部按钮 */}
            <div style={{
              padding: '10px 16px',
              borderTop: '1px solid var(--c-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#fafbfd',
            }}>
              <span style={{ fontSize: 12, color: 'var(--c-text-secondary)' }}>
                ⏱ 建议 {article.suggestedMinutes} 分钟
              </span>
              <span style={{ fontSize: 13, color: 'var(--c-primary)', fontWeight: 600 }}>
                开始阅读 →
              </span>
            </div>
          </div>
        ))}
      </div>

      <Card flat style={{ marginTop: 24, background: 'var(--c-primary-light)' }}>
        <div style={{ fontSize: 13 }}>
          <b>📰 外刊栏目说明</b>
          <ul style={{ margin: '6px 0 0', paddingLeft: 18, lineHeight: 1.9 }}>
            <li>每篇文章标注 <b>Claim（论点）</b>、<b>Evidence（证据）</b>、<b>Attitude（态度）</b>、<b>Keyword（关键概念）</b></li>
            <li>阅读理解题附带 <b>干扰项类型分析</b>（偷换概念 / 无中生有 / 张冠李戴 / 过度推断 / 因果倒置）</li>
            <li>生词标注<b>熟词僻义</b>与例句，可在词汇页闪卡复习</li>
            <li>想要更多文章？用「📥 真题导入」粘贴外刊文本，选「阅读」格式即可入库</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
