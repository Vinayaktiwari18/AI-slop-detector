export default function Badge({ children, color = 'var(--green)' }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '20px',
      border: `1px solid ${color}`,
      color,
      fontSize: '10px',
      letterSpacing: '1px',
      background: `${color}15`,
    }}>
      {children}
    </span>
  )
}