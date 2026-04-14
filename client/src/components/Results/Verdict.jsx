import { getScoreColor, getScoreGlow } from '../../utils/formatters'

export default function Verdict({ verdict, score }) {
  const color = verdict?.color || getScoreColor(score)

  return (
    <div
      className="verdict-banner"
      style={{
        borderColor: color,
        background: `${color}12`,
        boxShadow: `0 0 30px ${color}25`,
      }}
    >
      <div>
        <div style={{ fontSize: '10px', letterSpacing: '3px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
          VERDICT
        </div>
        <div className="verdict-label" style={{ color }}>
          {verdict?.label || 'ANALYZING'}
        </div>
      </div>
      <div className="verdict-score" style={{ color }}>
        {score}
        <span style={{ fontSize: '16px', opacity: 0.5 }}>/100</span>
      </div>
    </div>
  )
}