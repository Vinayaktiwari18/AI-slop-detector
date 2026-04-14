import { useState } from 'react'
import { analyzeText } from '../../services/api'
import Button from '../ui/Button'

export default function TextInput({ onResult, onError, setLoading, loading }) {
  const [text, setText] = useState('')

  const submit = async () => {
    if (text.trim().length < 50) return onError('Please enter at least 50 characters.')
    setLoading(true)
    onError(null)
    try {
      const data = await analyzeText(text)
      onResult(data)
    } catch (e) {
      onError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className="section-label">PASTE TEXT</div>
      <textarea
        className="analyzer-textarea"
        placeholder="Paste any text here to analyze for AI generation patterns..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <div className="char-counter">{text.length} chars / {text.split(/\s+/).filter(Boolean).length} words</div>
      <Button variant="primary" full onClick={submit} disabled={loading || text.trim().length < 50}>
        {loading ? 'SCANNING...' : '▶ ANALYZE TEXT'}
      </Button>
    </div>
  )
}