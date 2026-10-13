import { scoreTranslation, corsHeaders } from '../server/score.js'
export default async function handler(req, res) {
  for (const [key, value] of Object.entries(corsHeaders(req.headers.origin))) res.setHeader(key, value)
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try { return res.status(200).json(await scoreTranslation(req.body, req.headers.authorization)) }
  catch (err) { return res.status(err.status || 502).json({ error: err.status ? err.message : '评分服务暂时不可用' }) }
}
