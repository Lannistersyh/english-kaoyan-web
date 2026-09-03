export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'DeepSeek API key not configured' })
  }

  const { englishText, chineseTranslation, referenceTranslation } = req.body || {}
  if (!englishText || !chineseTranslation) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const prompt = `你是英语翻译评分专家。请从"信（忠实原文）"、"达（通顺流畅）"、"雅（文采表达）"三个维度对以下英译汉翻译进行评分（0-10分，取整），并用50字以内点评不足之处。

原文：${englishText}
参考译文：${referenceTranslation || '无'}
用户译文：${chineseTranslation}

请严格按以下JSON格式返回（不要返回其他内容）：
{"score": 分数, "comment": "点评"}`

  try {
    const upstream = await fetch('https://api.deepseek.com/chat/completions', {
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

    if (!upstream.ok) {
      return res.status(502).json({ error: `DeepSeek error: ${upstream.status}` })
    }

    const data = await upstream.json()
    const content = data.choices?.[0]?.message?.content || ''
    const jsonMatch = content.match(/\{[^}]+\}/)
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Failed to parse AI response' })
    }

    const result = JSON.parse(jsonMatch[0])
    return res.status(200).json({
      score: Math.max(0, Math.min(10, Math.round(result.score ?? 5))),
      comment: String(result.comment ?? '').slice(0, 100),
    })
  } catch (err) {
    console.error('[deepseek] error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
