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
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true },
      })
    : null

/* Whether Supabase is configured */
export const isCloudEnabled = () => supabase !== null
