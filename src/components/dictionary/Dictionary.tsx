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
  try {
    // 1. Get English definition from Free Dictionary API
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
    if (!res.ok) return null
    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) return null

    const entry = data[0]
    const phonetic = entry.phonetic || entry.phonetics?.[0]?.text || ''
    const meanings = entry.meanings || []
    const definitions: string[] = []
    meanings.forEach((m: any) => {
      (m.definitions || []).slice(0, 2).forEach((d: any) => {
        if (d.definition) definitions.push(d.definition)
      })
    })

    // 2. Translate to Chinese using MyMemory API
    let chineseDef = ''
    const textToTranslate = definitions.slice(0, 3).join('; ')
    if (textToTranslate) {
      try {
        const tRes = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|zh-CN`
        )
        const tData = await tRes.json()
        if (tData.responseStatus === 200 && tData.responseData?.translatedText) {
          chineseDef = tData.responseData.translatedText
        }
      } catch { /* translation failed, show English only */ }
    }

    return { word: entry.word, phonetic, definitions: definitions.slice(0, 3), chineseDef }
  } catch { return null }
}

export default function Dictionary() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<DictHistory>({})
  const [entry, setEntry] = useState<DictEntry | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentWord, setCurrentWord] = useState('')
  const [showResult, setShowResult] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setHistory(loadHistory()) }, [])

  const handleInput = useCallback((val: string) => {
    setInput(val)
    setShowResult(false)
    setEntry(null)
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

    if (unlocked) {
      setLoading(true)
      setShowResult(true)
      const result = await fetchDefinition(word)
      setEntry(result)
      setLoading(false)
    } else {
      setShowResult(true)
      setEntry(null)
    }
  }, [input, history])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') { setInput(''); setShowResult(false); setEntry(null) }
  }

  // Recent words list
  const recentWords = Object.entries(history)
    .sort(([, a], [, b]) => b.timestamp - a.timestamp)
    .slice(0, 8)

  const remaining = currentWord && !showResult ? 0 :
    currentWord && showResult ? 0 :
    input ? Math.max(0, 3 - (history[input.trim().toLowerCase()]?.count || 0)) : 3

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
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: isOpen ? '-8px 0 32px rgba(0, 0, 0, 0.08)' : 'none',
        transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header - Mac style */}
        <div style={{
          padding: '16px 20px 12px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          background: 'rgba(255, 255, 255, 0.8)',
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
              style={{
                width: '100%',
                padding: '9px 12px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: 8,
                fontSize: 14,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                color: '#1d1d1f',
                background: 'rgba(0, 0, 0, 0.03)',
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--c-primary)'
                e.target.style.boxShadow = '0 0 0 3px rgba(31, 78, 156, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)'
                e.target.style.boxShadow = 'none'
              }}
            />
            {input && (
              <button
                onClick={handleSubmit}
                style={{
                  position: 'absolute',
                  right: 6,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '4px 10px',
                  border: 'none',
                  borderRadius: 6,
                  background: 'var(--c-primary)',
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
          {input && !showResult && (
            <div style={{
              marginTop: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              color: '#86868b',
            }}>
              <div style={{
                display: 'flex',
                gap: 4,
              }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{
                    width: 16,
                    height: 4,
                    borderRadius: 2,
                    background: i <= (history[input.trim().toLowerCase()]?.count || 0)
                      ? 'var(--c-primary)'
                      : 'rgba(0, 0, 0, 0.08)',
                    transition: 'background 0.2s',
                  }} />
                ))}
              </div>
              <span>
                {remaining === 0 ? '可以查了！按 Enter' :
                 remaining === 3 ? '输入 3 遍解锁释义' :
                 `还需输入 ${remaining} 遍`}
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
            <div style={{
              animation: 'fadeIn 0.25s ease',
            }}>
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
                  {entry?.phonetic && (
                    <span style={{
                      fontSize: 14,
                      color: '#86868b',
                      fontFamily: 'Georgia, serif',
                    }}>
                      {entry.phonetic}
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
                      borderTopColor: 'var(--c-primary)',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    查询中...
                  </div>
                )}

                {entry && (
                  <div style={{ marginTop: 10 }}>
                    {entry.chineseDef && (
                      <div style={{
                        fontSize: 15,
                        color: '#1d1d1f',
                        lineHeight: 1.6,
                        marginBottom: 8,
                        padding: '8px 10px',
                        background: 'rgba(31, 78, 156, 0.06)',
                        borderRadius: 6,
                        borderLeft: '3px solid var(--c-primary)',
                      }}>
                        {entry.chineseDef}
                      </div>
                    )}

                    {entry.definitions.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#86868b',
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                          marginBottom: 6,
                        }}>
                          English Definitions
                        </div>
                        {entry.definitions.map((def, i) => (
                          <div key={i} style={{
                            fontSize: 13,
                            color: '#3d3d3d',
                            lineHeight: 1.6,
                            padding: '4px 0',
                            borderBottom: i < entry.definitions.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                          }}>
                            <span style={{
                              color: '#86868b',
                              fontSize: 11,
                              marginRight: 6,
                            }}>
                              {i + 1}.
                            </span>
                            {def}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {!loading && !entry && currentWord && (
                  <div style={{
                    marginTop: 10,
                    padding: '10px 12px',
                    background: '#fef3cd',
                    borderRadius: 6,
                    fontSize: 13,
                    color: '#856404',
                  }}>
                    ⚠️ 未找到释义，请检查拼写
                  </div>
                )}
              </div>

              {/* Unlock animation */}
              {!loading && history[currentWord]?.unlocked && !entry && currentWord && (
                <div style={{
                  textAlign: 'center',
                  padding: '20px 0',
                  animation: 'fadeIn 0.5s ease',
                }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>✨</div>
                  <div style={{ fontSize: 14, color: '#1d1d1f', fontWeight: 600 }}>
                    已输入 3 遍，正在查询...
                  </div>
                </div>
              )}
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
                      if (record.unlocked) {
                        setLoading(true)
                        fetchDefinition(word).then(r => { setEntry(r); setLoading(false) })
                      } else {
                        setEntry(null)
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      border: 'none',
                      borderRadius: 6,
                      background: record.unlocked ? 'rgba(31, 78, 156, 0.06)' : 'rgba(0, 0, 0, 0.02)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(31, 78, 156, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = record.unlocked ? 'rgba(31, 78, 156, 0.06)' : 'rgba(0, 0, 0, 0.02)'}
                  >
                    <span style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: '#1d1d1f',
                    }}>
                      {record.unlocked ? '🔓' : '🔒'} {word}
                    </span>
                    <span style={{
                      fontSize: 11,
                      color: '#86868b',
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
              <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.6 }}>📖</div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                Mac 风格汉英词典
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.6 }}>
                输入单词并敲写 3 遍<br />
                解锁释义，加深记忆
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
          background: 'rgba(255, 255, 255, 0.6)',
        }}>
          Free Dictionary API · MyMemory Translation
        </div>
      </div>

      {/* Spin animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  )
}
