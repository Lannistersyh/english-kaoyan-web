import http from 'node:http'
import fs from 'node:fs'
import { scoreTranslation, corsHeaders } from './server/score.js'
for (const file of ['.env', '.env.local']) {
  if (!fs.existsSync(file)) continue
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const match = /^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/.exec(line)
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2')
  }
}
const PORT = Number(process.env.PORT || 3003)
const server = http.createServer(async (req, res) => {
  const local = ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress)
  const origin = req.headers.origin
  let host
  try { host = new URL(`http://${req.headers.host}`).hostname } catch { /* Invalid Host */ }
  if (!local || !['localhost', '127.0.0.1', '[::1]'].includes(host)) { res.writeHead(403); res.end(); return }
  if (origin) {
    try { if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(origin).hostname)) throw new Error() }
    catch { res.writeHead(403); res.end(); return }
  }
  for (const [key, value] of Object.entries(corsHeaders(origin, true))) res.setHeader(key, value)
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }
  if (req.method !== 'POST' || req.url !== '/api/deepseek-score') { res.writeHead(404); res.end(); return }
  try {
    let body = ''; let size = 0
    for await (const chunk of req) { size += chunk.length; if (size > 100000) { res.writeHead(413); res.end(); return }; body += chunk.toString() }
    let payload
    try { payload = JSON.parse(body) } catch { res.writeHead(400); res.end(JSON.stringify({ error: "JSON format error" })); return }
    const result = await scoreTranslation(payload, req.headers.authorization, { local: true })
    res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(result))
  } catch (err) { res.writeHead(err.status || 502, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: err.status ? err.message : "Scoring service is temporarily unavailable" })) }
})
server.listen(PORT, '127.0.0.1', () => console.log(`AI proxy: http://127.0.0.1:${PORT}`))
