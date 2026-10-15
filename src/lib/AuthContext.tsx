import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, isCloudEnabled } from './supabase'
import { setStorageUser } from '../utils/storage'
import { installAutoSync, pushToCloud } from './sync'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error?: string }>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState>({
  user: null,
  session: null,
  loading: true,
  signUp: async () => ({}),
  signIn: async () => ({}),
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isCloudEnabled()) {
      setLoading(false)
      return
    }

    const stopSync = installAutoSync()
    let active = true
    let authRevision = 0
    // Initial session
    supabase!.auth.getSession().then(({ data }) => {
      if (!active) return
      if (authRevision === 0) {
        setStorageUser(data.session?.user.id ?? null)
        setSession(data.session)
        setUser(data.session?.user ?? null)
      }
      setLoading(false)
    }).catch(() => { if (active) setLoading(false) })

    // Listen for authentication state changes
    const { data: sub } = supabase!.auth.onAuthStateChange((_event, newSession) => {
      if (!active) return
      authRevision++
      setStorageUser(newSession?.user.id ?? null)
      setSession(newSession)
      setUser(newSession?.user ?? null)
      setLoading(false)
    })

    return () => { active = false; stopSync(); sub.subscription.unsubscribe() }
  }, [])

  const signUp = async (email: string, password: string) => {
    if (!supabase) return { error: "Supabase not configured" }
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) return { error: error.message }
    return {}
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: "Supabase not configured" }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
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
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
