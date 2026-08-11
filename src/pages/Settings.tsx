import { useRef, useState } from 'react'
import type { Settings as SettingsData } from '../types'
import { STORAGE_KEYS } from '../types'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { estimateUsage, exportAll, importAll, remove } from '../utils/storage'
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

  const doExport = () => {
    const json = exportAll()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const date = new Date()
    const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
    a.href = url
    a.download = `ekw-backup-${stamp}.json`
    a.click()
    URL.revokeObjectURL(url)
    flash('已导出备份文件，建议定期备份到网盘')
  }

  const doImport = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const failed = importAll(String(reader.result ?? ''))
      if (failed.length > 0) {
        flash(`恢复失败：${failed.join('、')}`)
      } else {
        setUsage(estimateUsage())
        flash('恢复成功，数据已覆盖（切页或刷新后生效）')
      }
    }
    reader.readAsText(file, 'utf-8')
  }

  const doClear = () => {
    for (const key of Object.values(STORAGE_KEYS)) remove(key)
    setUsage(0)
    setConfirmClear2(false)
    setConfirmClear(false)
    flash('已清空全部数据，刷新后生效')
  }

  const doSync = async (dir: 'push' | 'pull') => {
    setSyncing(true)
    const result: SyncResult = dir === 'push' ? await pushToCloud() : await pullFromCloud()
    flashSync(result.ok ? `✅ ${result.message}` : `❌ ${result.message}`)
    if (result.ok) setUsage(estimateUsage())
    setSyncing(false)
  }

  const handleSignOut = async () => {
    // 退出前推送一次
    if (cloudReady && user) {
      setSyncing(true)
      await pushToCloud()
    }
    await signOut()
    window.sessionStorage.removeItem('ekw:offline')
    window.location.reload()
  }

  return (
    <div>
      <h1 className="page-title">设置</h1>
      <p className="page-sub">
        {cloudReady && user
          ? `已登录 ☁️ ${user.email} — 数据自动同步到云端，换设备登录即可恢复`
          : '数据保存在本机浏览器（localStorage），换电脑或清浏览器前记得备份。'}
      </p>

      {status && (
        <div className="card card--flat" style={{ borderColor: 'var(--c-success)', marginBottom: 14 }}>
          <span className="small" style={{ color: 'var(--c-success)' }}>{status}</span>
        </div>
      )}

      {/* ── 云端同步 ── */}
      {cloudReady && user && (
        <Card title="☁️ 云端同步" style={{ marginBottom: 18 }}>
          <p className="muted" style={{ marginBottom: 12 }}>
            数据存储于 Supabase PostgreSQL。每台设备登录同一账号即可同步。
          </p>
          <div className="flex-row" style={{ gap: 10, flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              onClick={() => doSync('push')}
              disabled={syncing}
            >
              ⬆️ {syncing ? '同步中...' : '上传到云端'}
            </Button>
            <Button
              onClick={() => doSync('pull')}
              disabled={syncing}
            >
              ⬇️ {syncing ? '同步中...' : '从云端恢复'}
            </Button>
          </div>
          {syncStatus && (
            <div className="small" style={{ marginTop: 10, color: syncStatus.startsWith('✅') ? 'var(--c-success)' : 'var(--c-danger)' }}>
              {syncStatus}
            </div>
          )}
          <div className="muted small" style={{ marginTop: 10 }}>
            💡 练习提交后会自动上传（静默同步），无需手动操作。跨设备使用时先点「从云端恢复」拉取最新数据。
          </div>
        </Card>
      )}

      {/* ── 账号 ── */}
      {cloudReady && user && (
        <Card title="🔐 账号" style={{ marginBottom: 18 }}>
          <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              <div>{user.email}</div>
              <div className="muted small">退出前会自动上传最新数据</div>
            </span>
            <Button variant="danger" onClick={handleSignOut}>
              退出登录
            </Button>
          </div>
        </Card>
      )}

      {/* ── 行为设置 ── */}
      <Card title="行为设置" style={{ marginBottom: 18 }}>
        <label className="flex-row" style={{ justifyContent: 'space-between', cursor: 'pointer' }}>
          <span>
            <b>做错后自动弹出「三问」表单</b>
            <div className="muted small">关闭后仍可在结果页手动点击填写</div>
          </span>
          <input
            type="checkbox"
            checked={settings.promptThinkingOnWrong}
            onChange={(e) => setSettings({ ...settings, promptThinkingOnWrong: e.target.checked })}
          />
        </label>
      </Card>

      {/* ── 备份 ── */}
      <Card title="数据备份与恢复" style={{ marginBottom: 18 }}>
        <div className="flex-row" style={{ gap: 10, flexWrap: 'wrap' }}>
          <Button variant="primary" onClick={doExport}>⬇️ 导出备份 JSON</Button>
          <Button onClick={() => fileRef.current?.click()}>⬆️ 从备份恢复</Button>
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
          当前占用约 {formatBytes(usage)}（浏览器 localStorage 上限约 5MB）。导入会覆盖同名数据。
        </div>
      </Card>

      {/* ── 危险区 ── */}
      <Card title="危险区">
        <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            <b>清空全部数据</b>
            <div className="muted small">删除所有进度、错题档案、词库、导入题目与练习记录（内置题目不受影响）</div>
          </span>
          <Button variant="danger" onClick={() => setConfirmClear(true)}>清空数据</Button>
        </div>
      </Card>

      {confirmClear && (
        <Modal
          title="确认清空？"
          onClose={() => setConfirmClear(false)}
          footer={
            <>
              <Button onClick={() => setConfirmClear(false)}>取消</Button>
              <Button variant="danger" onClick={() => setConfirmClear2(true)}>我确认要清空</Button>
            </>
          }
        >
          <p>此操作不可恢复。已导出备份文件了吗？</p>
        </Modal>
      )}
      {confirmClear2 && (
        <Modal
          title="最后确认"
          onClose={() => setConfirmClear2(false)}
          footer={
            <>
              <Button onClick={() => setConfirmClear2(false)}>取消</Button>
              <Button variant="danger" onClick={doClear}>是的，全部删除</Button>
            </>
          }
        >
          <p>真的要清空全部学习数据吗？建议先导出备份。</p>
        </Modal>
      )}
    </div>
  )
}
