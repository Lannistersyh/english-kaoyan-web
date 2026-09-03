import http from 'http'
import fs from 'fs'
import path from 'path'

// 加载.env.local文件
function loadEnvLocal() {
  try {
    const envPath = path.join(process.cwd(), '.env.local')
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8')
      content.split('\n').forEach(line => {
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=')
          if (key && valueParts.length > 0) {
            process.env[key.trim()] = valueParts.join('=').trim()
          }
        }
      })
    }
  } catch (error) {
    console.warn('Warning: Could not load .env.local file:', error.message)
  }
}

loadEnvLocal()

const PORT = process.env.PORT || 3003

const server = http.createServer(async (req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  if (req.method === 'POST' && req.url === '/api/deepseek-score') {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    
    req.on('end', async () => {
      try {
        const { englishText, chineseTranslation, referenceTranslation } = JSON.parse(body)
        
        if (!englishText || !chineseTranslation) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Missing required fields' }))
          return
        }

        const apiKey = process.env.DEEPSEEK_API_KEY
        if (!apiKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'API key not configured' }))
          return
        }

        const refPart = referenceTranslation
          ? `\n参考译文：${referenceTranslation}`
          : ''

        const prompt = `你是一位考研英语翻译评分老师（满分 10 分）。请对以下学生的翻译进行打分并给出简短点评（50 字以内）。

英文原文：${englishText}

学生译文：${chineseTranslation}${refPart}

请从"信（准确）、达（通顺）、雅（地道）"三个维度评判。按 JSON 格式回复：
{"score": <整数0-10>, "comment": "<点评>"}`

        const deepseekRes = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 200,
            temperature: 0.3,
          }),
        })

        if (!deepseekRes.ok) {
          const errorText = await deepseekRes.text()
          res.writeHead(502, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ 
            error: `DeepSeek API error: ${deepseekRes.status}`, 
            details: errorText 
          }))
          return
        }

        const data = await deepseekRes.json()
        const raw = data.choices?.[0]?.message?.content ?? ''
        // 尝试从回复中提取 JSON
        const jsonMatch = raw.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({
            score: Math.max(0, Math.min(10, Math.round(parsed.score ?? 5))),
            comment: String(parsed.comment ?? '无法点评').slice(0, 100),
          }))
          return
        }
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ score: 5, comment: '无法解析AI回复' }))
      } catch (error) {
        console.error('Server error:', error)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Internal server error', details: error.message }))
      }
    })
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
  }
})

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
