import { scoreTranslation, corsHeaders } from '../../server/score.js'
export async function handler(event) {
  const headers = { 'Content-Type': 'application/json', ...corsHeaders(event.headers.origin) }
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' }
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  if ((event.body?.length || 0) > 100000) return { statusCode: 413, headers, body: JSON.stringify({ error: "Text is too long" }) }
  let payload
  try { payload = JSON.parse(event.body || '{}') } catch { return { statusCode: 400, headers, body: JSON.stringify({ error: "JSON format error" }) } }
  try { return { statusCode: 200, headers, body: JSON.stringify(await scoreTranslation(payload, event.headers.authorization)) } }
  catch (err) { return { statusCode: err.status || 502, headers, body: JSON.stringify({ error: err.status ? err.message : "Scoring service is temporarily unavailable" }) } }
}
