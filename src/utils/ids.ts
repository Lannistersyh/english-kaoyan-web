/* Generate unique id (with prefix for easier troubleshooting) */
export function uid(prefix = ''): string {
  const rand = crypto.randomUUID
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10)
  return prefix ? `${prefix}_${rand}` : rand
}
