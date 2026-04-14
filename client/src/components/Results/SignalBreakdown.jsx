import { getScoreColor } from '../../utils/formatters'

const SIGNALS = [
  { key: 'heuristics', label: 'HEURISTICS', sub: 'Slop phrases & patterns' },
  { key: 'entropy',    label: 'ENTROPY',    sub: 'Burstiness & vocabulary' },
  { key: 'gemini',     label: 'GEMINI AI',  sub: 'Neural classification' },
]

export default function SignalBreakdown({ signals }) {
  return (
    <div className="signals">
      <div className="signals-header">SIGNAL BREAKDOWN</div>
      {SIGNALS.map(({ key, label, sub }) => {
        const raw = signals?.[key]
        const val = raw ? (key === 'gemini' ? raw.aiProbability : raw.score) : null

        return (
          <div key={key}>
            <div className="signal-label-row">
              <div>
                <span className="signal-name">{label}</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '8px' }}>{sub}</span>
              </div>
              <span className="signal-value" style={{ color: val !== null ? getScoreColor(val) : 'var(--text-muted)' }}>
                {val !== null ? `${val}/100` : 'N/A'}
              </span>
            </div>
            <div className="signal-bar-bg">
              <div
                className="signal-bar-fill"
                style={{
                  width: val !== null ? `${val}%` : '0%',
                  background: val !== null ? getScoreColor(val) : 'var(--border)',
                  boxShadow: val !== null ? `0 0 8px ${getScoreColor(val)}` : 'none',
                }}
              />
            </div>
            {key === 'heuristics' && raw && (
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {raw.foundPhrases?.length || 0} slop phrases · avg sentence {raw.avgSentenceLength} words
              </div>
            )}
            {key === 'entropy' && raw && (
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                burstiness {raw.burstiness} · vocab richness {raw.typeTokenRatio}
              </div>
            )}
            {key === 'gemini' && raw && (
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {raw.confidence?.toUpperCase()} confidence · {raw.verdict?.replace(/_/g, ' ')}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}