import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../../types'
import { lookupEnglishWord, type DictEntry } from '../../utils/dictionary'

interface WordRecord {
  count: number
  unlocked: boolean
  timestamp: number
}

interface DictHistory {
  [word: string]: WordRecord
}

export default function Dictionary() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [history, setHistory] = useLocalStorage<DictHistory>(STORAGE_KEYS.dictHistory, {})
  const [entry, setEntry] = useState<DictEntry | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentWord, setCurrentWord] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const requestId = useRef(0)

  useEffect(() => {
    const open = () => setIsOpen(true)
    window.addEventListener('ekw:dictionary-open', open)
    return () => { window.removeEventListener('ekw:dictionary-open', open); requestId.current++ }
  }, [])

  useEffect(() => { if (isOpen) inputRef.current?.focus() }, [isOpen])

  const handleInput = useCallback((val: string) => {
    requestId.current++
    setLoading(false)
    setInput(val)
    setShowResult(false)
    setEntry(null)
    setError('')
  }, [])

  const showWord = useCallback(async (word: string, unlocked: boolean) => {
    const id = ++requestId.current
    setCurrentWord(word)
    setEntry(null)
    setError('')
    setShowResult(true)
    setLoading(unlocked)
    if (!unlocked) return
    const result = await lookupEnglishWord(word)
    if (id !== requestId.current) return
    if (result) setEntry(result)
    else setError('No definition found. Check the spelling or try again.')
    setLoading(false)
  }, [])

  const handleSubmit = useCallback(async () => {
    const word = input.trim().toLowerCase()
    if (!word) return

    const prev = history[word] || { count: 0, unlocked: false, timestamp: 0 }
    const newCount = prev.count + 1
    const unlocked = newCount >= 3

    const updated = { ...history, [word]: { count: newCount, unlocked, timestamp: Date.now() } }
    setHistory(updated)
    setInput('')
    await showWord(word, unlocked)
  }, [input, history, setHistory, showWord])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') handleInput('')
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
        className="dictionary-toggle"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          right: isOpen ? 'min(330px, calc(100vw - 46px))' : 16,
          zIndex: 1001,
          width: 44,
          height: 44,
          borderRadius: 0,
          border: '1px solid var(--c-border)',
          background: 'var(--c-surface)',
          boxShadow: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          transition: 'none',
          color: isOpen ? 'var(--c-primary)' : 'var(--c-text-secondary)',
        }}
        title={isOpen ? "Close dictionary" : "Open dictionary"}
      >
        📖
      </button>

      {/* Dictionary panel */}
      {isOpen && <div style={{
        position: 'fixed',
        right: isOpen ? 0 : -340,
        top: 0,
        width: 'min(328px, calc(100vw - 48px))',
        height: '100vh',
        zIndex: 1000,
        background: '#ffffff',
        borderLeft: '1px solid var(--c-border)',
        boxShadow: 'none',
        transition: 'none',
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
            <span style={{ fontSize: 16 }}>📖</span>   English mini dictionary
          </div>

          {/* Search input */}
          <div style={{ position: 'relative' }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => handleInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a word, type it three times to unlock the definition..."
              style={{
                width: '100%',
                padding: '9px 52px 9px 12px',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: 8,
                fontSize: 14,
                fontFamily: 'var(--font-stack)',
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
                  fontFamily: 'var(--font-stack)',
                }}
              >

                 Look up
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
                {getCount(input.trim().toLowerCase()) >= 3 ? "✨ Ready to look up! Press Enter" :
                 getCount(input.trim().toLowerCase()) === 0 ? "Type 3 times to unlock the definition" :
                 ` Entered ${getCount(input.trim().toLowerCase())}/3 times `}
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

                     Looking up...
                  </div>
                )}

                {entry && (
                  <div style={{ marginTop: 10 }}>
                    {/* Primary definition */}
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

                    {/* Other definitions */}
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

                           Other definitions
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

                       ✅ Entered 3 times, definition unlocked
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

                 Recent lookups
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {recentWords.map(([word, record]) => (
                  <button
                    key={word}
                    onClick={() => showWord(word, record.unlocked)}
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
                      fontFamily: 'var(--font-stack)',
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

                 English dictionary
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.8, maxWidth: 200, margin: '0 auto' }}>

                 Enter an English word <br />
                <b> Type it 3 times </b> Unlock the English definition <br />

                 Deeply memorize every new word
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
          Datamuse · Local study vocabulary
        </div>
      </div>}

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
