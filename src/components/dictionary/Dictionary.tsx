import { useState, useEffect, useRef, useCallback } from 'react'

interface WordRecord {
  count: number
  unlocked: boolean
  timestamp: number
}

interface DictHistory {
  [word: string]: WordRecord
}

interface DictEntry {
  word: string
  phonetic: string
  definitions: string[]
  chineseDef: string
  pos: string // part of speech
}

const HISTORY_KEY = 'ekw:dictHistory'

function loadHistory(): DictHistory {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch { return {} }
}

function saveHistory(h: DictHistory) {
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(h))
}

async function fetchDefinition(word: string): Promise<DictEntry | null> {
  // Use MyMemory API - works from China
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|zh-CN`,
      { signal: controller.signal }
    )
    clearTimeout(timeout)

    if (!res.ok) return null
    const data = await res.json()
    if (data.responseStatus !== 200) return null

    const mainTranslation = data.responseData?.translatedText || ''
    const matches = data.matches || []

    // Extract detailed translations
    const detailedTrans: string[] = []
    let pos = ''
    for (const m of matches) {
      const trans = m.translation || ''
      // Filter out low quality or identical matches
      if (trans && trans !== word && trans.length > 1) {
        if (trans.includes('.') && !detailedTrans.some(d => d === trans)) {
          // This has part of speech标记
          const posMatch = trans.match(/^([a-z]+\.)\s*/)
          if (posMatch && !pos) pos = posMatch[1]
          detailedTrans.push(trans)
        } else if (!detailedTrans.includes(trans) && detailedTrans.length < 5) {
          detailedTrans.push(trans)
        }
      }
    }

    // If we got no detailed translations, use the main one
    const allTranslations = detailedTrans.length > 0 ? detailedTrans :
      (mainTranslation && mainTranslation !== word ? [mainTranslation] : [])

    if (allTranslations.length === 0) return null

    return {
      word,
      phonetic: '',
      definitions: allTranslations,
      chineseDef: allTranslations[0] || mainTranslation,
      pos,
    }
  } catch (e) {
    console.error('Dictionary fetch error:', e)
    return null
  }
}

export default function Dictionary() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<DictHistory>({})
  const [entry, setEntry] = useState<DictEntry | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentWord, setCurrentWord] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setHistory(loadHistory()) }, [])

  const handleInput = useCallback((val: string) => {
    setInput(val)
    setShowResult(false)
    setEntry(null)
    setError('')
  }, [])

  const handleSubmit = useCallback(async () => {
    const word = input.trim().toLowerCase()
    if (!word) return

    const prev = history[word] || { count: 0, unlocked: false, timestamp: 0 }
    const newCount = prev.count + 1
    const unlocked = newCount >= 3

    const updated = { ...history, [word]: { count: newCount, unlocked, timestamp: Date.now() } }
    setHistory(updated)
    saveHistory(updated)
    setCurrentWord(word)
    setInput('')
    setError('')

    if (unlocked) {
      setLoading(true)
      setShowResult(true)
      const result = await fetchDefinition(word)
      if (result) {
        setEntry(result)
      } else {
        setError('未找到释义，请检查拼写')
      }
      setLoading(false)
    } else {
      setShowResult(true)
      setEntry(null)
    }
  }, [input, history])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') { setInput(''); setShowResult(false); setEntry(null); setError('') }
  }

  // Recent words list
  const recentWords = Object.entries(history)
    .sort(([, a], [, b]) => b.timestamp - a.timestamp)
    .slice(0, 8)

  const getCount = (w: string) => history[w]?.count || 0

  return (
    <>
      {/* Toggle button - fixed on right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          right: isOpen ? 330 : 16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1001,
          width: 44,
          height: 44,
          borderRadius: 12,
          border: '1px solid var(--c-border)',
          background: 'var(--c-surface)',
          boxShadow: 'var(--shadow-lg)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          color: isOpen ? 'var(--c-primary)' : 'var(--c-text-secondary)',
        }}
        title={isOpen ? '关闭词典' : '打开词典'}
      >
        📖
      </button>

      {/* Dictionary panel */}
      <div style={{
        position: 'fixed',
        right: isOpen ? 0 : -340,
        top: 0,
        width: 328,
        height: '100vh',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: isOpen ? '-8px 0 32px rgba(0, 0, 0, 0.1)' : 'none',
        transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px 12px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          background: 'rgba(255, 255, 255, 0.9)',
        }}>
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#1d1d1f',
            letterSpacing: -0.3,
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <span style={{ fontSize: 16 }}>📖</span> 汉英小词典
          </div>

          {/* Search input */}
          <div style={{ position: 'relative' }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => handleInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入单词，敲三遍解锁释义..."
              autoFocus
              style={{
                width: '100%',
                padding: '9px 52px 9px 12px',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: 8,
                fontSize: 14,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                color: '#1d1d1f',
                background: 'rgba(0, 0, 0, 0.03)',
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#0071e3'
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 113, 227, 0.12)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(0, 0, 0, 0.12)'
                e.target.style.boxShadow = 'none'
              }}
            />
            {input.trim() && (
              <button
                onClick={handleSubmit}
                style={{
                  position: 'absolute',
                  right: 6,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '5px 12px',
                  border: 'none',
                  borderRadius: 6,
                  background: '#0071e3',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                查
              </button>
            )}
          </div>

          {/* Progress indicator */}
          {input.trim() && !showResult && (
            <div style={{
              marginTop: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              color: '#86868b',
            }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {[1, 2, 3].map(i => {
                  const cnt = getCount(input.trim().toLowerCase())
                  return (
                    <div key={i} style={{
                      width: 18,
                      height: 5,
                      borderRadius: 3,
                      background: i <= cnt ? '#0071e3' : 'rgba(0, 0, 0, 0.08)',
                      transition: 'background 0.2s',
                    }} />
                  )
                })}
              </div>
              <span>
                {getCount(input.trim().toLowerCase()) >= 3 ? '✨ 可以查了！按 Enter' :
                 getCount(input.trim().toLowerCase()) === 0 ? '输入 3 遍解锁释义' :
                 `已输入 ${getCount(input.trim().toLowerCase())}/3 遍`}
              </span>
            </div>
          )}
        </div>

        {/* Result area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 20px',
        }}>
          {showResult && (
            <div style={{ animation: 'fadeIn 0.25s ease' }}>
              {/* Current word display */}
              <div style={{
                marginBottom: 14,
                paddingBottom: 14,
                borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 8,
                }}>
                  <span style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: '#1d1d1f',
                    letterSpacing: -0.5,
                  }}>
                    {currentWord}
                  </span>
                  {entry?.pos && (
                    <span style={{
                      fontSize: 13,
                      color: '#86868b',
                      fontStyle: 'italic',
                    }}>
                      {entry.pos}
                    </span>
                  )}
                </div>

                {loading && (
                  <div style={{
                    marginTop: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: '#86868b',
                    fontSize: 13,
                  }}>
                    <div style={{
                      width: 14,
                      height: 14,
                      border: '2px solid rgba(0,0,0,0.1)',
                      borderTopColor: '#0071e3',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    查询中...
                  </div>
                )}

                {entry && (
                  <div style={{ marginTop: 10 }}>
                    {/* Main translation - highlighted */}
                    <div style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: '#1d1d1f',
                      lineHeight: 1.6,
                      marginBottom: 10,
                      padding: '10px 12px',
                      background: 'rgba(0, 113, 227, 0.06)',
                      borderRadius: 8,
                      borderLeft: '3px solid #0071e3',
                    }}>
                      {entry.definitions[0]}
                    </div>

                    {/* Other translations */}
                    {entry.definitions.length > 1 && (
                      <div style={{ marginBottom: 10 }}>
                        <div style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#86868b',
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                          marginBottom: 6,
                        }}>
                          其他释义
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {entry.definitions.slice(1).map((def, i) => (
                            <div key={i} style={{
                              fontSize: 14,
                              color: '#3d3d3d',
                              lineHeight: 1.6,
                              padding: '6px 10px',
                              background: 'rgba(0, 0, 0, 0.02)',
                              borderRadius: 6,
                            }}>
                              {def}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Success badge */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 8,
                      padding: '6px 10px',
                      background: 'rgba(52, 199, 89, 0.1)',
                      borderRadius: 6,
                      fontSize: 12,
                      color: '#34c759',
                    }}>
                      ✅ 已输入 3 遍，释义已解锁
                    </div>
                  </div>
                )}

                {error && (
                  <div style={{
                    marginTop: 10,
                    padding: '10px 12px',
                    background: '#fef3cd',
                    borderRadius: 8,
                    fontSize: 13,
                    color: '#856404',
                  }}>
                    ⚠️ {error}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recent words */}
          {!showResult && recentWords.length > 0 && (
            <div>
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#86868b',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 10,
              }}>
                最近查词
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {recentWords.map(([word, record]) => (
                  <button
                    key={word}
                    onClick={() => {
                      setCurrentWord(word)
                      setShowResult(true)
                      setError('')
                      if (record.unlocked) {
                        setLoading(true)
                        fetchDefinition(word).then(r => {
                          if (r) setEntry(r)
                          else setError('未找到释义')
                          setLoading(false)
                        })
                      } else {
                        setEntry(null)
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      border: 'none',
                      borderRadius: 8,
                      background: record.unlocked ? 'rgba(0, 113, 227, 0.06)' : 'rgba(0, 0, 0, 0.02)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = record.unlocked ? 'rgba(0, 113, 227, 0.12)' : 'rgba(0, 0, 0, 0.04)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = record.unlocked ? 'rgba(0, 113, 227, 0.06)' : 'rgba(0, 0, 0, 0.02)'}
                  >
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#1d1d1f' }}>
                      {record.unlocked ? '🔓' : '🔒'} {word}
                    </span>
                    <span style={{
                      fontSize: 11,
                      color: record.unlocked ? '#34c759' : '#86868b',
                      fontWeight: record.unlocked ? 600 : 400,
                    }}>
                      {record.count}/3
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!showResult && recentWords.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#86868b',
            }}>
              <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.5 }}>📖</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1d1d1f', marginBottom: 6 }}>
                Mac 风格汉英词典
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.8, maxWidth: 200, margin: '0 auto' }}>
                输入英文单词<br />
                <b>敲写 3 遍</b>解锁中文释义<br />
                深度记忆每一个生词
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 20px',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          fontSize: 11,
          color: '#86868b',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.7)',
        }}>
          MyMemory Translation API
        </div>
      </div>

      {/* Spin animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
