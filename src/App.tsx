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
import { Modal } from './components/ui/Modal'
import { exportAll } from './utils/storage'

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
  { view: 'home', label: "Home" },
  { view: 'news', label: "News Reading" },
  { view: 'philosophy', label: "Science and Philosophy" },
  { view: 'practice', label: "Practice" },
  { view: 'translation', label: "Paraphrasing" },
  { view: 'writing', label: "Writing" },
  { view: 'vocabulary', label: "Vocabulary" },
  { view: 'wrongbook', label: "Review Book" },
  { view: 'import', label: "Import" },
  { view: 'settings', label: "Settings" },
]

/* Common props for section pages: global search term and navigation callbacks */
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
  const [view, setView] = useState<ViewName>('practice')
  const [showLogin, setShowLogin] = useState(false)

  // Global search term: after input, jump to the practice list and filter
  const [search, setSearch] = useState('')
  const [searchRevision, setSearchRevision] = useState(0)
  const [bannerOpen, setBannerOpen] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)

  const saveBackup = () => {
    const url = URL.createObjectURL(new Blob([exportAll()], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `english-study-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  // Loading
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
          <p> Loading... </p>
        </div>
      </div>
    )
  }

  // Cloud login is optional; the study interface opens immediately.
  const cloudReady = isCloudEnabled()

  if (!user && cloudReady && showLogin) {
    return <LoginPage />
  }

  const Page = VIEWS[view]

  return (
    <div className="pm-page">
      {/* PubMed government banner */}
      <div className="gov-banner">
        <div className="gov-banner__inner">
          <svg className="gov-banner__flag" viewBox="0 0 16 11" aria-hidden="true">
            <rect width="16" height="11" fill="#b22234" />
            {[0, 2, 4, 6, 8, 10].map(y => <rect key={y} y={y + 0.5} width="16" height="1" fill="#fff" />)}
            <rect width="7" height="5.5" fill="#3c3b6e" />
            {[1, 3, 5].map(x => [1, 2.7, 4.4].map(y => <circle key={`${x}-${y}`} cx={x} cy={y} r="0.3" fill="white" />))}
          </svg>
          <span>An official website of the</span>
          <button className="gov-banner__link" type="button" aria-expanded={bannerOpen} onClick={() => setBannerOpen(!bannerOpen)}>Here's how you know</button>
        </div>
        {bannerOpen && <div className="gov-banner__details">This personal study replica uses the PubMed layout. Your practice data and account are managed by this English learning website.</div>}
      </div>

      {/* NCBI dark blue header */}
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
              <>
                <span className="ncbi-user">Offline mode</span>
                {cloudReady && <button className="ncbi-login" type="button" onClick={() => setShowLogin(true)}>Log in</button>}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Gray search bar */}
      <div className="search-band">
        <div className="search-band__inner">
          <div className="pm-logo" onClick={() => setView('home')} role="button" tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setView('home') } }}>
            <span className="pm-logo__pub">Pub</span>
            <span className="pm-logo__swoosh" />
            <span className="pm-logo__med">Med</span><sup>®</sup>
          </div>
          <form className="pm-search" onSubmit={(e) => { e.preventDefault(); setSearchRevision(revision => revision + 1); setView('practice') }}>
            <input
              className="pm-search__input"
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search questions"
            />
            <button className="pm-search__btn" type="submit">Search</button>
          </form>
        </div>
        <div className="search-band__links">
          <button type="button" className="text-link" onClick={() => setView('practice')}>Advanced</button>
          <button type="button" className="text-link" onClick={() => setGuideOpen(true)}>User Guide</button>
        </div>
      </div>

      {/* White action bar + section navigation */}
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
            <button className="btn" type="button" onClick={saveBackup}>Save</button>
            <button className="btn" type="button" onClick={() => setView('wrongbook')}>Send to</button>
            <button className="btn" type="button" onClick={() => setView('settings')}>Display options ⚙</button>
          </div>
        </div>
      </div>

      <Dictionary key={user?.id ?? 'guest'} />
      <main className="layout__content">
        <Page key={`${user?.id ?? 'guest'}:${view}:${view === 'practice' ? searchRevision : ''}`} search={search} onSearch={setSearch} onNavigate={setView} />
      </main>

      {guideOpen && <Modal title="User Guide" onClose={() => setGuideOpen(false)}>
        <p>Search the practice library or choose a learning section from the navigation bar.</p>
        <p>Start a question, submit your answers, and compare them with the English explanations. Mistakes and uncertain answers appear in the Review Book.</p>
        <p>Use the dictionary button to look up words. Type the same word three times to unlock its English definitions.</p>
        <p>Save downloads a study backup. Import accepts the English format template. Display options opens your practice and backup settings.</p>
      </Modal>}

      {/* Footer */}
      <footer className="pm-footer">
        <div className="pm-footer__inner">
          <button type="button" className="text-link" onClick={() => setGuideOpen(true)}>Support</button>
          <button type="button" className="text-link" onClick={() => setGuideOpen(true)}>Accessibility</button>
          <a href="https://www.nlm.nih.gov/">NLM</a>
          <a href="https://www.nih.gov/">NIH</a>
          <a href="https://www.hhs.gov/">HHS</a>
          <a href="https://www.usa.gov/">USA.gov</a>
          <div className="pm-footer__copy">

             English Study · Personal study replica of the PubMed layout
          </div>
        </div>
      </footer>
    </div>
  )
}
