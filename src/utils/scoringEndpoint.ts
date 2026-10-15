/* GitHub Pages serves static files; hosted AI feedback needs a separate service. */
export function scoringEndpoint(hostname: string, configured = ''): string | null {
  if (['localhost', '127.0.0.1', '[::1]'].includes(hostname)) return '/api/deepseek-score'
  if (configured.trim()) return configured.trim()
  return hostname.endsWith('.github.io') ? null : '/api/deepseek-score'
}
