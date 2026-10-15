import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, isCloudEnabled } from './supabase'
import { setStorageUser } from '../utils/storage'
import { installAutoSync, pushToCloud } from './sync'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  continueOffline: () => void
  signUp: (email: string, password: string) => Promise<{ error?: string }>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState>({
  user: null,
  session: null,
  loading: true,
  continueOffline: () => {},
  signUp: async () => ({}),
  signIn: async () => ({}),
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)
  const offlineRequested = useRef(false)
  const authAttempt = useRef(0)

  const continueOffline = () => {
    offlineRequested.current = true
    authAttempt.current++
    setOffline(true)
    setStorageUser(null)
    setSession(null)
    setUser(null)
    setLoading(false)
  }

  useEffect(() => {
    if (offline || !isCloudEnabled()) {
      setLoading(false)
      return
    }

    const stopSync = installAutoSync()
    let active = true
    let authRevision = 0
    // A failed refresh or a browser auth lock must not block the study library.
    const timeout = window.setTimeout(() => {
      if (active && !offlineRequested.current) continueOffline()
    }, 5000)
    const finish = (newSession: Session | null) => {
      window.clearTimeout(timeout)
      setStorageUser(newSession?.user.id ?? null)
      setSession(newSession)
      setUser(newSession?.user ?? null)
      setLoading(false)
    }
    // Initial session
    supabase!.auth.getSession().then(({ data, error }) => {
      if (!active || offlineRequested.current) return
      if (authRevision === 0) {
        if (error) continueOffline()
        else finish(data.session)
      }
    }).catch(() => { if (active && !offlineRequested.current && authRevision === 0) continueOffline() })

    // Listen for authentication state changes
    const { data: sub } = supabase!.auth.onAuthStateChange((_event, newSession) => {
      if (!active || offlineRequested.current) return
      authRevision++
      finish(newSession)
    })

    return () => { active = false; window.clearTimeout(timeout); stopSync(); sub.subscription.unsubscribe() }
  }, [offline])

  const completeSignIn = (newSession: Session | null) => {
    if (!newSession) return
    offlineRequested.current = false
    setOffline(false)
    setStorageUser(newSession.user.id)
    setSession(newSession)
    setUser(newSession.user)
    setLoading(false)
  }

  const signUp = async (email: string, password: string) => {
    if (!supabase) return { error: "Supabase not configured" }
    const attempt = ++authAttempt.current
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (attempt !== authAttempt.current) return { error: 'Sign-up was canceled. You can continue offline or try again.' }
    if (error) return { error: error.message }
    completeSignIn(data.session)
    return {}
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: "Supabase not configured" }
    const attempt = ++authAttempt.current
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (attempt !== authAttempt.current) return { error: 'Sign-in was canceled. You can continue offline or try again.' }
    if (error) return { error: error.message }
    completeSignIn(data.session)
    return {}
  }

  const signOut = async () => {
    if (!supabase) return
    // Flush pending study changes for either logout entry point.
    if (user) await pushToCloud()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, continueOffline, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
