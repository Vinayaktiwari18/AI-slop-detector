const BASE = '/api'

async function post(path, body, isForm = false) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    ...(isForm ? { body } : {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  })

  const text = await res.text()

  let data
  try {
    data = JSON.parse(text)
  } catch {
    console.error('Non-JSON response:', text.slice(0, 200))
    throw new Error('Server returned an unexpected response. Check if backend is online.')
  }

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