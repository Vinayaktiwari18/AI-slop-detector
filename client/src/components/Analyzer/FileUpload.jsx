import { useRef } from 'react'
import { analyzeFile } from '../../services/api'
import { useFileReader } from '../../hooks/useFileReader'
import { formatBytes } from '../../utils/formatters'
import Button from '../ui/Button'

export default function FileUpload({ onResult, onError, setLoading, loading }) {
  const inputRef = useRef()
  const { file, dragging, onDrop, onDragOver, onDragLeave, onFileChange, clear } = useFileReader()

  const submit = async () => {
    if (!file) return
    setLoading(true)
    onError(null)
    try {
      const data = await analyzeFile(file)
      onResult(data)
    } catch (e) {
      onError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className="section-label">UPLOAD FILE</div>
      <div
        className={`file-drop${dragging ? ' dragging' : ''}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current.click()}
      >
        <div className="file-drop-icon">📄</div>
        <div className="file-drop-text">DROP FILE OR CLICK TO BROWSE</div>
        <div className="file-drop-hint">.TXT or .PDF · MAX 5MB</div>
        {file && <div className="file-name">✓ {file.name} ({formatBytes(file.size)})</div>}
        <input ref={inputRef} type="file" accept=".txt,.pdf" style={{ display: 'none' }} onChange={onFileChange} />
      </div>
      {file && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="primary" full onClick={submit} disabled={loading}>
            {loading ? 'SCANNING...' : '▶ ANALYZE FILE'}
          </Button>
          <Button onClick={clear}>✕</Button>
        </div>
      )}
    </div>
  )
}