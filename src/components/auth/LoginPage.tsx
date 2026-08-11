import { useState } from 'react'
import { useAuth } from '../../lib/AuthContext'
import { isCloudEnabled } from '../../lib/supabase'
import { pullFromCloud } from '../../lib/sync'
import { Button } from '../ui/Button'

export function LoginPage() {
  const { signIn, signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)

    const fn = isSignUp ? signUp : signIn
    const result = await fn(email, password)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    if (isSignUp) {
      setInfo('注册成功！请检查邮箱确认链接（部分 Supabase 项目开启了邮箱确认），然后登录。')
      setLoading(false)
      return
    }

    // 登录成功后自动拉取云端数据
    setInfo('登录成功，正在同步数据...')
    const syncResult = await pullFromCloud()
    setInfo(syncResult.message)
    setLoading(false)
  }

  const cloudReady = isCloudEnabled()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--c-bg)',
      fontFamily: 'var(--font-stack)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        padding: '32px 28px',
        background: 'var(--c-surface)',
        borderRadius: 12,
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--c-border)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📖</div>
          <h2 style={{ margin: 0, fontSize: 20 }}>GRE · 精英训练</h2>
          <p className="muted" style={{ marginTop: 6 }}>
            {cloudReady
              ? isSignUp ? '创建账号，开始跨设备同步' : '登录以同步学习数据'
              : '离线模式 · 数据仅存本地浏览器'}
          </p>
        </div>

        {!cloudReady && (
          <div style={{
            padding: 16,
            borderRadius: 8,
            background: 'var(--c-warning-light)',
            marginBottom: 16,
            fontSize: 13,
            color: 'var(--c-warning)',
          }}>
            <b>Supabase 未配置</b>：创建 <code>.env</code> 文件并设置密钥后可开启云端同步。
            当前仅使用本地存储，换设备数据不互通。
          </div>
        )}

        {error && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 8,
            background: 'var(--c-danger-light)',
            color: 'var(--c-danger)',
            fontSize: 13,
            marginBottom: 14,
          }}>
            {error}
          </div>
        )}

        {info && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 8,
            background: 'var(--c-success-light)',
            color: 'var(--c-success)',
            fontSize: 13,
            marginBottom: 14,
          }}>
            {info}
          </div>
        )}

        {cloudReady && (
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-label">邮箱</div>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>
            <div className="form-row">
              <div className="form-label">密码</div>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少 6 位"
                minLength={6}
                required
              />
            </div>
            <Button
              variant="primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
              disabled={loading || !email.trim() || password.length < 6}
            >
              {loading ? '处理中...' : isSignUp ? '注册' : '登录'}
            </Button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <button
            className="btn btn--ghost"
            style={{ fontSize: 13 }}
            onClick={() => {
              if (!cloudReady) return
              setIsSignUp(!isSignUp)
              setError('')
              setInfo('')
            }}
            disabled={!cloudReady}
          >
            {isSignUp ? '已有账号？去登录' : '没有账号？注册'}
          </button>
        </div>

        {/* 离线模式：直接进入 */}
        {!cloudReady && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button onClick={() => {
              // 离线模式：什么都不用做，AuthContext 的 user 为 null 但 loading 结束
              // 设置一个标记跳过登录
              window.sessionStorage.setItem('ekw:offline', '1')
              window.location.reload()
            }}>
              离线使用（数据仅存本机）
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
