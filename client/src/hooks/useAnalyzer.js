import { useState } from 'react'
import { analyzeText, analyzeUrl, analyzeFile } from '../services/api'

export function useAnalyzer() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const run = async (fn) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fn()
      setResult(data)
    } catch (e) {
      setError(e.message)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const runText = (text) => run(() => analyzeText(text))
  const runUrl = (url) => run(() => analyzeUrl(url))
  const runFile = (file) => run(() => analyzeFile(file))

  const reset = () => { setResult(null); setError(null) }

  return { result, loading, error, runText, runUrl, runFile, reset }
}