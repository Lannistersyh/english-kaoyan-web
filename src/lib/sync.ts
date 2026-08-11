import { supabase, isCloudEnabled } from './supabase'
import { STORAGE_KEYS } from '../types'
import { exportAll, importAll } from '../utils/storage'

export type SyncDirection = 'push' | 'pull'

export interface SyncResult {
  ok: boolean
  direction: SyncDirection
  message: string
}

/**
 * 将本地 localStorage 全量推送到 Supabase。
 * 用当前用户 UID 写入 user_data 表。
 */
export async function pushToCloud(): Promise<SyncResult> {
  if (!isCloudEnabled()) {
    return { ok: false, direction: 'push', message: 'Supabase 未配置：请设置环境变量后重启' }
  }

  const { data } = await supabase!.auth.getSession()
  const userId = data.session?.user?.id
  if (!userId) {
    return { ok: false, direction: 'push', message: '未登录：请先登录再同步' }
  }

  try {
    const json = exportAll()
    const parsed = JSON.parse(json) as Record<string, unknown>

    const row = {
      user_id: userId,
      progress: parsed[STORAGE_KEYS.progress] ?? {},
      sessions: parsed[STORAGE_KEYS.sessions] ?? [],
      wrong_records: parsed[STORAGE_KEYS.wrongRecords] ?? [],
      vocab: parsed[STORAGE_KEYS.vocab] ?? [],
      vocab_progress: parsed[STORAGE_KEYS.vocabProgress] ?? {},
      settings: parsed[STORAGE_KEYS.settings] ?? { promptThinkingOnWrong: true },
      imported_questions: parsed[STORAGE_KEYS.questions] ?? [],
    }

    const { error } = await supabase!.from('user_data').upsert(row, {
      onConflict: 'user_id',
    })

    if (error) throw error

    return { ok: true, direction: 'push', message: `已上传 · ${new Date().toLocaleTimeString('zh-CN')}` }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '未知错误'
    return { ok: false, direction: 'push', message: `上传失败：${msg}` }
  }
}

/**
 * 从 Supabase 拉取数据，合并到本地 localStorage。
 * 策略：云端覆盖本地（云端是权威源）。
 * 拉取前自动备份本地数据到 sessionStorage 以防万一。
 */
export async function pullFromCloud(): Promise<SyncResult> {
  if (!isCloudEnabled()) {
    return { ok: false, direction: 'pull', message: 'Supabase 未配置：请设置环境变量后重启' }
  }

  const { data } = await supabase!.auth.getSession()
  const userId = data.session?.user?.id
  if (!userId) {
    return { ok: false, direction: 'pull', message: '未登录：请先登录再同步' }
  }

  try {
    // 备份本地数据
    const localBackup = exportAll()
    window.sessionStorage.setItem('ekw:pre-pull-backup', localBackup)

    const { data: row, error } = await supabase!
      .from('user_data')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) throw error

    if (!row) {
      return { ok: true, direction: 'pull', message: '云端尚无数据，本地数据保持不变' }
    }

    // 构建与 exportAll 格式一致的 JSON 进行导入
    const cloudData: Record<string, unknown> = {
      [STORAGE_KEYS.progress]: row.progress ?? {},
      [STORAGE_KEYS.sessions]: row.sessions ?? [],
      [STORAGE_KEYS.wrongRecords]: row.wrong_records ?? [],
      [STORAGE_KEYS.vocab]: row.vocab ?? [],
      [STORAGE_KEYS.vocabProgress]: row.vocab_progress ?? {},
      [STORAGE_KEYS.settings]: row.settings ?? { promptThinkingOnWrong: true },
      [STORAGE_KEYS.questions]: row.imported_questions ?? [],
    }

    const failed = importAll(JSON.stringify(cloudData))
    if (failed.length > 0) {
      return { ok: false, direction: 'pull', message: `部分数据写入失败：${failed.join('、')}` }
    }

    const updatedAt = row.updated_at
      ? new Date(row.updated_at as string).toLocaleString('zh-CN')
      : '未知'

    return { ok: true, direction: 'pull', message: `已从云端恢复 · ${updatedAt}` }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '未知错误'
    return { ok: false, direction: 'pull', message: `下载失败：${msg}` }
  }
}

/**
 * 快速静默推送（不显示结果，用于自动同步场景）。
 * 失败时仅 console.warn，不打扰用户。
 */
export async function silentPush(): Promise<void> {
  const result = await pushToCloud()
  if (!result.ok) {
    console.warn('[sync] 自动同步失败:', result.message)
  }
}
