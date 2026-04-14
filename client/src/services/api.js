const BASE = '/api'

async function post(path, body, isForm = false) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    ...(isForm
      ? { body }
      : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    ),
  })

  const text = await res.text()
  try {
    const data = JSON.parse(text)
    if (!res.ok) throw new Error(data.error || 'Analysis failed')
    return data
  } catch {
    throw new Error('Backend offline or unreachable. Try again in 30 seconds.')
  }
}

export const analyzeText = (text) => post('/analyze', { text })
export const analyzeUrl  = (url)  => post('/analyze', { url })
export const analyzeFile = (file) => {
  const form = new FormData()
  form.append('file', file)
  return post('/analyze', form, true)
}