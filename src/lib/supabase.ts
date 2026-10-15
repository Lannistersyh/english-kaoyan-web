import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase not configured: please create a .env file in the project root directory and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY." +
    "It will currently run in offline mode (data is stored only in local localStorage).",
  )
}

/* Supabase client (returns null when not configured; callers must check) */
function configuredClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null
  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  } catch {
    console.warn('Cloud configuration is invalid. The study site will remain available in offline mode.')
    return null
  }
}
export const supabase = configuredClient()

/* Whether Supabase is configured */
export const isCloudEnabled = () => supabase !== null
