import { useState } from 'react'
import { useAuth } from './lib/AuthContext'
import { isCloudEnabled } from './lib/supabase'
import { LoginPage } from './components/auth/LoginPage'
import Home from './pages/Home'
import Practice from './pages/Practice'
import News from './pages/News'
import SciencePhilosophy from './pages/SciencePhilosophy'
import Translation from './pages/Translation'
import Writing from './pages/Writing'
import Vocabulary from './pages/Vocabulary'
import WrongBook from './pages/WrongBook'
import Import from './pages/Import'
import Settings from './pages/Settings'
import Dictionary from './components/dictionary/Dictionary'

export type ViewName =
  | 'home'
  | 'practice'
  | 'news'
  | 'philosophy'
  | 'translation'
  | 'writing'
  | 'vocabulary'
  | 'wrongbook'
  | 'import'
  | 'settings'

const NAV: { view: ViewName; label: string }[] = [
  { view: 'home', label: '🏠 首页' },
  { view: 'news', label: '📰 外刊' },
  { view: 'philosophy', label: '🔬 科哲' },
  { view: 'practice', label: '✏️ 练习' },
  { view: 'translation', label: '🈯 翻译' },
  { view: 'writing', label: '📝 写作' },
  { view: 'vocabulary', label: '🗂️ 词汇' },
  { view: 'wrongbook', label: '📕 错题档案' },
  { view: 'import', label: '📥 真题导入' },
  { view: 'settings', label: '⚙️ 设置' },
]

const VIEWS: Record<ViewName, () => JSX.Element> = {
  home: Home,
  practice: Practice,
  news: News,
  philosophy: SciencePhilosophy,
  translation: Translation,
  writing: Writing,
  vocabulary: Vocabulary,
  wrongbook: WrongBook,
  import: Import,
  settings: Settings,
}

export default function App() {
  const { user, loading } = useAuth()
  const [view, setView] = useState<ViewName>('home')

  // 加载中
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--c-bg)',
        fontFamily: 'var(--font-stack)',
        color: 'var(--c-text-secondary)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📖</div>
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  // 未登录 & 云端已配置 → 显示登录页
  const cloudReady = isCloudEnabled()
  const offlineBypass = window.sessionStorage.getItem('ekw:offline') === '1'

  if (!user && cloudReady && !offlineBypass) {
    return <LoginPage />
  }

  const Page = VIEWS[view]

  return (
    <div className="layout">
      <aside className="layout__sidebar">
        <div className="layout__brand">
          GRE · 精英训练
          <br />
          <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.65 }}>Verbal Mastery</span>
        </div>
        {user && (
          <div style={{
            padding: '6px 12px 10px',
            fontSize: 11,
            color: 'rgba(255,255,255,0.5)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            marginBottom: 4,
            wordBreak: 'break-all',
          }}>
            ☁️ {user.email}
          </div>
        )}
        {!user && cloudReady && offlineBypass && (
          <div style={{
            padding: '6px 12px 10px',
            fontSize: 11,
            color: 'rgba(255,255,255,0.5)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            marginBottom: 4,
          }}>
            📴 离线模式
          </div>
        )}
        <nav className="layout__nav">
          {NAV.map((item) => (
            <button
              key={item.view}
              className={`layout__nav-item${view === item.view ? ' layout__nav-item--active' : ''}`}
              onClick={() => setView(item.view)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
      <Dictionary />
      <main className="layout__content">
        <Page key={view} />
      </main>
    </div>
  )
}
