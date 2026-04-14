import { getScoreColor } from '../../utils/formatters'

export default function SlopScore({ score }) {
  const color = getScoreColor(score)
  const radius = 72
  const circ = 2 * Math.PI * radius
  const offset = circ - (score / 100) * circ

  return (
    <div className="slop-score-container">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="var(--bg-elevated)" strokeWidth="6" />
        <circle
          cx="90" cy="90" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1), stroke 0.5s ease', filter: `drop-shadow(0 0 8px ${color})` }}
        />
        {/* Tick marks */}
        {[0,25,50,75].map(tick => {
          const angle = (tick / 100) * 360 - 90
          const rad = angle * Math.PI / 180
          const x1 = 90 + (radius - 10) * Math.cos(rad)
          const y1 = 90 + (radius - 10) * Math.sin(rad)
          const x2 = 90 + (radius + 2) * Math.cos(rad)
          const y2 = 90 + (radius + 2) * Math.sin(rad)
          return <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--border)" strokeWidth="1" />
        })}
        <text x="90" y="84" textAnchor="middle" fill={color} fontSize="32" fontFamily="'Bebas Neue'" style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
          {score}
        </text>
        <text x="90" y="102" textAnchor="middle" fill="var(--text-secondary)" fontSize="9" fontFamily="'Space Mono'" letterSpacing="2">
          SLOP SCORE
        </text>
      </svg>
    </div>
  )
}