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

    // Password strength validation during registration
    if (isSignUp) {
      if (password.length < 6) {
        setError("Password must be at least 6 characters")
        setLoading(false)
        return
      }
      if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
        setError("Password must contain letters and numbers")
        setLoading(false)
        return
      }
    }

    const fn = isSignUp ? signUp : signIn
    const result = await fn(email, password)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    if (isSignUp) {
      setInfo("Registration successful! Please check your email for the confirmation link (some Supabase projects have email confirmation enabled), then log in.")
      setLoading(false)
      return
    }

    // Automatically fetch cloud data after successful login
    setInfo("Login successful, syncing data...")
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
          <h2 style={{ margin: 0, fontSize: 20 }}> Postgraduate Entrance Exam English · Intensive Reading Training </h2>
          <p className="muted" style={{ marginTop: 6 }}>
            {cloudReady
              ? isSignUp ? "Create an account to start cross-device syncing" : "Log in to sync your study data"
              : "Offline mode · Data is stored only in the local browser"}
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
            <b> Supabase not configured </b> : Create  <code>.env</code>   file and set the key to enable cloud sync.
            Currently only local storage is used, and data does not transfer between devices.
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
              <div className="form-label"> Email </div>
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
              <div className="form-label"> Password </div>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
            </div>
            <Button
              variant="primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
              disabled={loading || !email.trim() || password.length < 6}
            >
              {loading ? "Processing..." : isSignUp ? "Sign up" : "Log in"}
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
            {isSignUp ? "Already have an account? Log in" : "No account? Sign up"}
          </button>
        </div>

        {/* Offline mode: enter directly */}
        {(
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button onClick={() => {
              // Offline mode: do nothing; AuthContext's user is null but loading has finished
              // Set a flag to skip login
              window.sessionStorage.setItem('ekw:offline', '1')
              window.location.reload()
            }}>

               Use offline (data is stored only on this device)
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
