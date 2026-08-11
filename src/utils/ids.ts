/** 生成唯一 id（带前缀便于排查） */
export function uid(prefix = ''): string {
  const rand = crypto.randomUUID
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10)
  return prefix ? `${prefix}_${rand}` : rand
}
