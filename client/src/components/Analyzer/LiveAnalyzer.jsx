import { useState, useEffect } from 'react'
import { useDebounce } from '../../hooks/useDebounce'

export default function LiveAnalyzer({ onResult, onError }) {
  const [text, setText] = useState('')
  const [scanning, setScanning] = useState(false)
  const debounced = useDebounce(text, 1200)

  useEffect(() => {
    if (debounced.trim().length < 50) return
    setScanning(true)
    fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: debounced }),
    })
      .then(r => r.json())
      .then(data => { onResult(data); setScanning(false) })
      .catch(e => { onError(e.message); setScanning(false) })
  }, [debounced])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="section-label">LIVE ANALYSIS</div>
        {scanning && (
          <div className="live-indicator">
            <div className="live-dot" />
            SCANNING
          </div>
        )}
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
        Type or paste text. Analysis triggers automatically after 1.2s of inactivity.
      </p>
      <textarea
        className="analyzer-textarea"
        style={{ minHeight: '280px' }}
        placeholder="Start typing... analysis runs automatically."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span className="char-counter">{text.length} chars</span>
        {text.length > 0 && text.length < 50 && (
          <span style={{ fontSize: '11px', color: 'var(--yellow)' }}>
            {50 - text.length} more chars needed
          </span>
        )}
      </div>
    </div>
  )
}