exports.handler = async (event) => {
  // 只允许 POST 请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const { englishText, chineseTranslation, referenceTranslation } = JSON.parse(event.body)
    
    if (!englishText || !chineseTranslation) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      }
    }

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key not configured' }),
      }
    }

    const refPart = referenceTranslation
      ? `\n参考译文：${referenceTranslation}`
      : ''

    const prompt = `你是一位考研英语翻译评分老师（满分 10 分）。请对以下学生的翻译进行打分并给出简短点评（50 字以内）。

英文原文：${englishText}

学生译文：${chineseTranslation}${refPart}

请从"信（准确）、达（通顺）、雅（地道）"三个维度评判。按 JSON 格式回复：
{"score": <整数0-10>, "comment": "<点评>"}`

    const res = await fetch('https://api.deepseek.com/chat/completions', {
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

    if (!res.ok) {
      const errorText = await res.text()
      return {
        statusCode: 502,
        body: JSON.stringify({ error: `DeepSeek API error: ${res.status}`, details: errorText }),
      }
    }

    const data = await res.json()
    const raw = data.choices?.[0]?.message?.content ?? ''
    // 尝试从回复中提取 JSON
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        statusCode: 200,
        body: JSON.stringify({
          score: Math.max(0, Math.min(10, Math.round(parsed.score ?? 5))),
          comment: String(parsed.comment ?? '无法点评').slice(0, 100),
        }),
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ score: 5, comment: '无法解析AI回复' }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    }
  }
}
