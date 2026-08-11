import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase 未配置：请在项目根目录创建 .env 文件，设置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY。\n' +
    '当前将以离线模式运行（数据仅存本地 localStorage）。',
  )
}

/** Supabase 客户端（未配置时返回 null，调用方需检查） */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true },
      })
    : null

/** 是否已配置 Supabase */
export const isCloudEnabled = () => supabase !== null
