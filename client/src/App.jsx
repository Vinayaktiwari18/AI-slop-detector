import { useState } from 'react'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import Particles from './components/Particles'
import TextInput from './components/Analyzer/TextInput'
import FileUpload from './components/Analyzer/FileUpload'
import UrlInput from './components/Analyzer/UrlInput'
import LiveAnalyzer from './components/Analyzer/LiveAnalyzer'
import SlopScore from './components/Results/SlopScore'
import SignalBreakdown from './components/Results/SignalBreakdown'
import HighlightedText from './components/Results/HighlightedText'
import Verdict from './components/Results/Verdict'

const TABS = [
  { id: 'TEXT', icon: '⌨', label: 'TEXT' },
  { id: 'FILE', icon: '📄', label: 'FILE' },
  { id: 'URL',  icon: '🔗', label: 'URL'  },
  { id: 'LIVE', icon: '⚡', label: 'LIVE' },
]

export default function App() {
  const [tab, setTab] = useState('TEXT')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleResult = (data) => { setResult(data); setError(null) }
  const handleError = (msg) => { if (msg) { setError(msg); setResult(null) } else setError(null) }
  const handleTab = (id) => { setTab(id); setResult(null); setError(null) }

  const inputProps = { onResult: handleResult, onError: handleError, setLoading, loading }

  return (
    <>
      <Particles />
      <div className="app">
        <Header />
        <main className="main">

          {/* LEFT — INPUT */}
          <div className="left-panel">
            <div>
              <div style={{ fontSize: '10px', letterSpacing: '3px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                INPUT MODE
              </div>
              <div className="tabs">
                {TABS.map(t => (
                  <button
                    key={t.id}
                    className={`tab${tab === t.id ? ' active' : ''}`}
                    onClick={() => handleTab(t.id)}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              {tab === 'TEXT' && <TextInput {...inputProps} />}
              {tab === 'FILE' && <FileUpload {...inputProps} />}
              {tab === 'URL'  && <UrlInput  {...inputProps} />}
              {tab === 'LIVE' && <LiveAnalyzer onResult={handleResult} onError={handleError} />}
            </div>

            {error && <div className="error-msg">⚠ {error}</div>}

            {result && !loading && (
              <div className="meta-row">
                <div><span>SOURCE </span>{result.source.toUpperCase()}</div>
                <div><span>WORDS </span>{result.wordCount}</div>
                <div><span>CHARS </span>{result.textLength}</div>
                {result.metadata?.title && (
                  <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span>PAGE </span>{result.metadata.title}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT — RESULTS */}
          <div className="right-panel">
            {loading && (
              <div className="scanning-overlay">
                <div className="scanning-ring" />
                <div className="scanning-text">SCANNING</div>
                <div className="scanning-sub">RUNNING MULTI-SIGNAL ANALYSIS</div>
              </div>
            )}

            {!loading && result && (
              <>
                <Verdict verdict={result.verdict} score={result.finalScore} />
                <SlopScore score={result.finalScore} verdict={result.verdict} />
                <SignalBreakdown signals={result.signals} />
                <HighlightedText
                  text={result.analyzedText}
                  phrases={result.signals?.heuristics?.foundPhrases}
                />
              </>
            )}

            {!loading && !result && (
              <div className="placeholder">
                <div className="placeholder-icon">🔬</div>
                <div className="placeholder-text">AWAITING INPUT</div>
                <div className="placeholder-sub">SELECT A MODE AND SUBMIT TEXT TO ANALYZE</div>
              </div>
            )}
          </div>

        </main>
        <Footer />
      </div>
    </>
  )
}