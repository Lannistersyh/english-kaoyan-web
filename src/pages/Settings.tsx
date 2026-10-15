import { useRef, useState } from 'react'
import type { Settings as SettingsData } from '../types'
import { STORAGE_KEYS } from '../types'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { estimateUsage, exportAll, importAll, remove, getStorageUser } from '../utils/storage'
import { useAuth } from '../lib/AuthContext'
import { isCloudEnabled } from '../lib/supabase'
import { pushToCloud, pullFromCloud, type SyncResult } from '../lib/sync'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'

const DEFAULT_SETTINGS: SettingsData = { promptThinkingOnWrong: true }

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(2)} MB`
}

export default function Settings() {
  const { user, signOut } = useAuth()
  const [settings, setSettings] = useLocalStorage<SettingsData>(STORAGE_KEYS.settings, DEFAULT_SETTINGS)
  const [usage, setUsage] = useState(() => estimateUsage())
  const [status, setStatus] = useState('')
  const [syncStatus, setSyncStatus] = useState('')
  const [syncing, setSyncing] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [confirmClear2, setConfirmClear2] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const cloudReady = isCloudEnabled()

  const flash = (msg: string) => {
    setStatus(msg)
    window.setTimeout(() => setStatus(''), 4000)
  }

  const flashSync = (msg: string) => {
    setSyncStatus(msg)
    window.setTimeout(() => setSyncStatus(''), 5000)
  }

  const doExport = (offline = false) => {
    try {
      const json = offline ? exportAll(null) : exportAll()
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const date = new Date()
      const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
      a.href = url
      a.download = `ekw-backup-${stamp}.json`
      a.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      flash("Backup file exported. It is recommended to back up to cloud storage regularly.")
    } catch (err) { flash(err instanceof Error ? err.message : 'Backup export failed.') }
  }

  const doImport = (file: File) => {
    const owner = getStorageUser()
    const reader = new FileReader()
    reader.onload = () => {
      if (getStorageUser() !== owner) return
      const failed = importAll(String(reader.result ?? ''))
      if (failed.length > 0) {
        flash(` Restore failed:${failed.join('、')}`)
      } else {
        setUsage(estimateUsage())
        flash("Restore successful. Page data has been updated.")
      }
    }
    reader.onerror = () => flash('Unable to read the backup file. Please try again.')
    reader.readAsText(file, 'utf-8')
  }

  const doClear = () => {
    for (const key of Object.values(STORAGE_KEYS)) remove(key)
    setUsage(0)
    setConfirmClear2(false)
    setConfirmClear(false)
    flash("All learning data for the current account has been cleared")
  }

  const doSync = async (dir: 'push' | 'pull') => {
    setSyncing(true)
    const result: SyncResult = dir === 'push' ? await pushToCloud() : await pullFromCloud()
    flashSync(result.ok ? `✅ ${result.message}` : `❌ ${result.message}`)
    if (result.ok) setUsage(estimateUsage())
    setSyncing(false)
  }

  const handleSignOut = async () => {
    setSyncing(true)
    try { await signOut() }
    catch (err) { flash(err instanceof Error ? err.message : 'Unable to log out. Please try again.') }
    finally { setSyncing(false) }
  }

  return (
    <div className="study-page">
      <h1 className="page-title"> Settings </h1>
      <p className="page-sub">
        {cloudReady && user
          ? ` Logged in ☁️ ${user.email} — Data automatically syncs to the cloud. Log in on another device to restore it.`
          : "Data is stored in the local browser (localStorage). Remember to back up before switching computers or clearing the browser."}
      </p>

      {status && (
        <div className="card card--flat" style={{ borderColor: 'var(--c-success)', marginBottom: 14 }}>
          <span className="small" style={{ color: 'var(--c-success)' }}>{status}</span>
        </div>
      )}

      {/* Cloud sync */}
      {cloudReady && user && (
        <Card title="Cloud sync" style={{ marginBottom: 30 }}>
          <p className="muted" style={{ marginBottom: 12 }}>

             Data is stored in Supabase PostgreSQL. Log in with the same account on each device to sync.
          </p>
          <div className="flex-row" style={{ gap: 10, flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              onClick={() => doSync('push')}
              disabled={syncing}
            >
              ⬆️ {syncing ? "Syncing..." : "Upload to cloud"}
            </Button>
            <Button
              onClick={() => doSync('pull')}
              disabled={syncing}
            >
              ⬇️ {syncing ? "Syncing..." : "Restore from cloud"}
            </Button>
          </div>
          {syncStatus && (
            <div className="small" style={{ marginTop: 10, color: syncStatus.startsWith('✅') ? 'var(--c-success)' : 'var(--c-danger)' }}>
              {syncStatus}
            </div>
          )}
          <div className="muted small" style={{ marginTop: 10 }}>

             💡 After practice is submitted, it will automatically upload (silent sync), no manual action needed. Existing offline data is kept in offline mode; you can export a backup and then restore it to the current account. When using across devices, first click &quot;Restore from cloud&quot; to pull the latest data.
          </div>
        </Card>
      )}

      {/* Account */}
      {cloudReady && user && (
        <Card title="Account" style={{ marginBottom: 30 }}>
          <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              <div>{user.email}</div>
              <div className="muted small"> The latest data will be automatically uploaded before logging out </div>
            </span>
            <Button variant="danger" onClick={handleSignOut} disabled={syncing}>

               Log out
            </Button>
          </div>
        </Card>
      )}

      {/* Practice preferences */}
      <Card title="Practice preferences" style={{ marginBottom: 30 }}>
        <label className="flex-row" style={{ justifyContent: 'space-between', cursor: 'pointer' }}>
          <span>
            <b> Automatically pop up the &quot;Three Questions&quot; form after a mistake </b>
            <div className="muted small"> After turning it off, you can still manually click to fill it in on the results page </div>
          </span>
          <input
            type="checkbox"
            checked={settings.promptThinkingOnWrong}
            onChange={(e) => setSettings({ ...settings, promptThinkingOnWrong: e.target.checked })}
          />
        </label>
      </Card>

      {/* Backups */}
      <Card title="Data backup and restore" style={{ marginBottom: 30 }}>
        <div className="flex-row" style={{ gap: 10, flexWrap: 'wrap' }}>
          <Button variant="primary" onClick={() => doExport()}>Export backup</Button>
          {user && <Button onClick={() => doExport(true)}> Export existing offline data </Button>}
          <Button onClick={() => fileRef.current?.click()}>Restore from backup</Button>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) doImport(f)
              e.target.value = ''
            }}
          />
        </div>
        <div className="muted small" style={{ marginTop: 10 }}>

           Currently using about  {formatBytes(usage)} (browser localStorage limit is about 5MB). Importing will overwrite data with the same name.
        </div>
      </Card>

      {/* Reset data */}
      <Card title="Danger zone">
        <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            <b> Clear all data </b>
            <div className="muted small"> Delete all progress, mistake archives, vocabulary, imported questions, and practice records (built-in questions are not affected) </div>
          </span>
          <Button variant="danger" onClick={() => setConfirmClear(true)}> Clear data </Button>
        </div>
      </Card>

      {confirmClear && (
        <Modal
          title="Confirm clearing?"
          onClose={() => setConfirmClear(false)}
          footer={
            <>
              <Button onClick={() => setConfirmClear(false)}> Cancel </Button>
              <Button variant="danger" onClick={() => setConfirmClear2(true)}> I confirm I want to clear it </Button>
            </>
          }
        >
          <p> This action cannot be undone. Have you exported a backup file? </p>
        </Modal>
      )}
      {confirmClear2 && (
        <Modal
          title="Final confirmation"
          onClose={() => setConfirmClear2(false)}
          footer={
            <>
              <Button onClick={() => setConfirmClear2(false)}> Cancel </Button>
              <Button variant="danger" onClick={doClear}> Yes, delete everything </Button>
            </>
          }
        >
          <p> Are you sure you want to clear all learning data? It is recommended to export a backup first. </p>
        </Modal>
      )}
    </div>
  )
}
