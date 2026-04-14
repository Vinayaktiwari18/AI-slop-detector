import { buildHighlightedSegments } from '../../utils/formatters'

export default function HighlightedText({ text, phrases }) {
  if (!text) return null
  const segments = buildHighlightedSegments(text, phrases)
  const count = phrases?.length || 0

  return (
    <div className="highlighted-section">
      <div className="highlighted-section-header">
        ANALYZED TEXT {count > 0 && `· ${count} SLOP PHRASE${count !== 1 ? 'S' : ''} FLAGGED`}
      </div>
      <div className="highlighted-text">
        {segments.map((seg, i) =>
          seg.highlighted
            ? <mark key={i} className="slop-highlight" title="AI slop phrase">{seg.text}</mark>
            : <span key={i}>{seg.text}</span>
        )}
      </div>
    </div>
  )
}