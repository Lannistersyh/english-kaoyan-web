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
  { view: 'home', label: '首页' },
  { view: 'news', label: '外刊' },
  { view: 'philosophy', label: '科哲' },
  { view: 'practice', label: '练习' },
  { view: 'translation', label: '翻译' },
  { view: 'writing', label: '写作' },
  { view: 'vocabulary', label: '词汇' },
  { view: 'wrongbook', label: '错题档案' },
  { view: 'import', label: '真题导入' },
  { view: 'settings', label: '设置' },
]

/** 分区页面通用 props：全局搜索词与导航回调 */
export type PageProps = {
  search?: string
  onSearch?: (s: string) => void
  onNavigate?: (v: ViewName) => void
}

const VIEWS: Record<ViewName, (props: PageProps) => JSX.Element> = {
  home: Home as (props: PageProps) => JSX.Element,
  practice: Practice as (props: PageProps) => JSX.Element,
  news: News as (props: PageProps) => JSX.Element,
  philosophy: SciencePhilosophy as (props: PageProps) => JSX.Element,
  translation: Translation as (props: PageProps) => JSX.Element,
  writing: Writing as (props: PageProps) => JSX.Element,
  vocabulary: Vocabulary as (props: PageProps) => JSX.Element,
  wrongbook: WrongBook as (props: PageProps) => JSX.Element,
  import: Import as (props: PageProps) => JSX.Element,
  settings: Settings as (props: PageProps) => JSX.Element,
}

export default function App() {
  const { user, loading, signOut } = useAuth()
  const [view, setView] = useState<ViewName>('home')

  // 全局搜索词：输入后跳到练习列表并过滤
  const [search, setSearch] = useState('')

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
    <div className="pm-page">
      {/* 政府横幅 */}
      <div className="gov-banner">
        <div className="gov-banner__inner">
          <svg className="gov-banner__flag" viewBox="0 0 16 11" aria-hidden="true">
            <rect width="16" height="11" fill="#B22234" />
            {[0, 2, 4, 6, 8, 10].map(y => <rect key={y} y={y + 0.5} width="16" height="1" fill="#fff" />)}
            <rect width="7" height="5.5" fill="#3C3B6E" />
          </svg>
          <span>An official website of the</span>
          <button className="gov-banner__link" type="button">Here's how you know</button>
        </div>
      </div>

      {/* NCBI 深蓝头 */}
      <header className="ncbi-header">
        <div className="ncbi-header__inner">
          <span className="ncbi-logo"><span className="ncbi-logo__mark">»</span>NIH</span>
          <div className="ncbi-header__title">
            <div className="ncbi-header__agency">National Library of Medicine</div>
            <div className="ncbi-header__sub">National Center for Biotechnology Information</div>
          </div>
          <div className="ncbi-header__right">
            {user ? (
              <>
                <span className="ncbi-user" title={user.email}>{user.email}</span>
                <button className="ncbi-login" type="button" onClick={() => signOut()}>Log out</button>
              </>
            ) : (
              <span className="ncbi-user">{cloudReady && offlineBypass ? 'Offline mode' : ''}</span>
            )}
          </div>
        </div>
      </header>

      {/* 灰色搜索带 */}
      <div className="search-band">
        <div className="search-band__inner">
          <div className="pm-logo" onClick={() => setView('home')} role="button" tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') setView('home') }}>
            <span className="pm-logo__pub">Pub</span>
            <span className="pm-logo__swoosh" />
            <span className="pm-logo__med">Med</span><sup>®</sup>
          </div>
          <form className="pm-search" onSubmit={(e) => { e.preventDefault(); setView('practice') }}>
            <input
              className="pm-search__input"
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="搜索题目"
            />
            <button className="pm-search__btn" type="submit">Search</button>
          </form>
        </div>
        <div className="search-band__links">
          <span onClick={() => setView('import')} role="button" tabIndex={0}>Advanced</span>
          <span onClick={() => setView('settings')} role="button" tabIndex={0}>User Guide</span>
        </div>
      </div>

      {/* 白色动作栏 + 分区导航 */}
      <div className="action-bar">
        <div className="action-bar__inner">
          <nav className="action-bar__nav">
            {NAV.map((item) => (
              <button
                key={item.view}
                className={`action-nav-item${view === item.view ? ' action-nav-item--active' : ''}`}
                onClick={() => setView(item.view)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="action-bar__actions">
            {view !== 'practice' && (
              <button className="btn" type="button" onClick={() => setView('practice')}>Save</button>
            )}
            <button className="btn" type="button" onClick={() => setView('wrongbook')}>Send to</button>
            <button className="btn" type="button" onClick={() => setView('settings')}>Display options ⚙</button>
          </div>
        </div>
      </div>

      <Dictionary key={user?.id ?? 'guest'} />
      <main className="layout__content">
        <Page key={`${user?.id ?? 'guest'}:${view}`} search={search} onSearch={setSearch} onNavigate={setView} />
      </main>

      {/* 页脚 */}
      <footer className="pm-footer">
        <div className="pm-footer__inner">
          <span onClick={() => setView('settings')} role="button" tabIndex={0}>Support</span>
          <span onClick={() => setView('settings')} role="button" tabIndex={0}>Accessibility</span>
          <span onClick={() => setView('settings')} role="button" tabIndex={0}>NLM</span>
          <span onClick={() => setView('settings')} role="button" tabIndex={0}>NIH</span>
          <span onClick={() => setView('settings')} role="button" tabIndex={0}>HHS</span>
          <span onClick={() => setView('settings')} role="button" tabIndex={0}>USA.gov</span>
          <div className="pm-footer__copy">
            考研英语精读训练 · Verbal Mastery —— NIH / NLM / NCBI 视觉致敬，仅用于个人学习
          </div>
        </div>
      </footer>
    </div>
  )
}
