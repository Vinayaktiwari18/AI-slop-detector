export default function Header() {
  return (
    <header className="header">
      <div className="header-logo">
        AI<span>_</span>SLOP<span>_</span>DETECTOR
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span className="gemini-badge active">◆ GEMINI ENHANCED</span>
        <div className="header-status">
          <div className="status-dot" />
          SYSTEM ONLINE
        </div>
      </div>
    </header>
  )
}