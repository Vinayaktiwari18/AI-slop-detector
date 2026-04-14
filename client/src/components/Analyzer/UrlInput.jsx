import { useState } from 'react'
import Button from '../ui/Button'

export default function UrlInput({ onResult, onError, setLoading, loading }) {
  const [url, setUrl] = useState('')

  const submit = async () => {
    if (!url.trim().startsWith('http')) return onError('Enter a valid URL starting with http:// or https://')
    setLoading(true)
    onError(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onResult(data)
    } catch (e) {
      onError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className="section-label">ANALYZE URL</div>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
        Paste a blog post, article, or any public URL. The engine will scrape and analyze the main content.
      </p>
      <input
        className="url-input"
        type="url"
        placeholder="https://example.com/article..."
        value={url}
        onChange={e => setUrl(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && submit()}
      />
      <Button variant="primary" full onClick={submit} disabled={loading || !url.trim()}>
        {loading ? 'FETCHING + SCANNING...' : '▶ ANALYZE URL'}
      </Button>
    </div>
  )
}