import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { scoreTranslation, corsHeaders } from './score.js'
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.ttf': 'font/ttf', '.woff2': 'font/woff2' }
export function loadServerEnv(root) {
  for (const name of ['.env.local', '.env']) {
    const file = path.join(root, name)
    if (!fs.existsSync(file)) continue
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      const match = /^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/.exec(line)
      if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2')
    }
  }
}
export function createLocalServer(staticDir) {
  return http.createServer(async (req, res) => {
    const host = req.headers.host || ''
    let hostname
    try { hostname = new URL(`http://${host}`).hostname } catch { /* Invalid host */ }
    if (!['localhost', '127.0.0.1', '[::1]'].includes(hostname)) { res.writeHead(403); res.end(); return }
    const origin = req.headers.origin
    if (origin) {
      try { if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(origin).hostname)) throw new Error() }
      catch { res.writeHead(403); res.end(); return }
    }
    for (const [key, value] of Object.entries(corsHeaders(origin, true))) res.setHeader(key, value)
    const pathname = new URL(req.url, `http://${host}`).pathname
    if (req.method === 'GET' && pathname === '/__health') { res.writeHead(200, {'Content-Type': 'application/json'}); res.end(JSON.stringify({app:'english-study',mode:'local'})); return }
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }
    if (req.method === 'POST' && pathname === '/api/deepseek-score') {
      try {
        let body = ''; let size = 0
        for await (const chunk of req) { size += chunk.length; if (size > 100000) { res.writeHead(413); res.end(); return }; body += chunk.toString() }
        let payload
        try { payload = JSON.parse(body) } catch { res.writeHead(400); res.end(JSON.stringify({error:'Invalid JSON'})); return }
        const result = await scoreTranslation(payload, req.headers.authorization, {local:true})
        res.writeHead(200, {'Content-Type':'application/json'}); res.end(JSON.stringify(result))
      } catch (err) { res.writeHead(err.status || 502, {'Content-Type':'application/json'}); res.end(JSON.stringify({error:err.status ? err.message : 'Scoring service unavailable'})) }
      return
    }
    if (staticDir && (req.method === 'GET' || req.method === 'HEAD')) {
      let decoded
      try { decoded = decodeURIComponent(pathname) } catch { res.writeHead(400); res.end(); return }
      const file = path.resolve(staticDir, `.${decoded === '/' ? '/index.html' : decoded}`)
      if (!file.startsWith(path.resolve(staticDir) + path.sep)) { res.writeHead(403); res.end(); return }
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end('Not found'); return }
      res.writeHead(200, {'Content-Type':MIME[path.extname(file)] || 'application/octet-stream','Cache-Control':pathname.includes('/assets/')?'public, max-age=86400':'no-cache'})
      if (req.method === 'HEAD') res.end(); else fs.createReadStream(file).pipe(res)
      return
    }
    res.writeHead(404); res.end('Not found')
  })
}
