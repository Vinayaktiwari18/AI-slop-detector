const BASE = import.meta.env.PROD
  ? 'https://ai-slop-detector-api.onrender.com/api'
  : '/api'

async function post(path, body, isForm = false) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    ...(isForm ? { body } : {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Analysis failed')
  return data
}

export const analyzeText = (text) => post('/analyze', { text })
export const analyzeUrl  = (url)  => post('/analyze', { url })
export const analyzeFile = (file) => {
  const form = new FormData()
  form.append('file', file)
  return post('/analyze', form, true)
}