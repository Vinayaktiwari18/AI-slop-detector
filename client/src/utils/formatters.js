export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

export function buildHighlightedSegments(text, phrases) {
  if (!phrases || phrases.length === 0) return [{ text, highlighted: false }]

  // Sort by index
  const sorted = [...phrases].sort((a, b) => a.index - b.index)
  const segments = []
  let cursor = 0

  for (const { index, end } of sorted) {
    if (index < cursor) continue
    if (index > cursor) segments.push({ text: text.slice(cursor, index), highlighted: false })
    segments.push({ text: text.slice(index, end), highlighted: true })
    cursor = end
  }

  if (cursor < text.length) segments.push({ text: text.slice(cursor), highlighted: false })
  return segments
}

export function getScoreColor(score) {
  if (score < 20) return 'var(--green)'
  if (score < 40) return '#a3e635'
  if (score < 60) return 'var(--yellow)'
  if (score < 80) return 'var(--orange)'
  return 'var(--red)'
}

export function getScoreGlow(score) {
  if (score < 40) return 'var(--glow-green)'
  if (score < 60) return 'var(--glow-yellow)'
  return 'var(--glow-red)'
}