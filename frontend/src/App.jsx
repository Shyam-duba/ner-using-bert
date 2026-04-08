import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import ModelSelector from './components/ModelSelector'
import TextInput from './components/TextInput'
import ComparisonView from './components/ComparisonView'
import { fetchModels, analyzeText, healthCheck } from './api/nerApi'

export default function App() {
  const [backendStatus, setBackendStatus] = useState('checking')
  const [models, setModels] = useState([])
  const [entityColors, setEntityColors] = useState({})
  const [selectedModels, setSelectedModels] = useState([])
  const [loading, setLoading] = useState(false)
  const [modelsLoading, setModelsLoading] = useState(true)
  const [results, setResults] = useState(null)
  const [analyzedText, setAnalyzedText] = useState('')
  const [error, setError] = useState('')

  // Check backend & load models on mount
  useEffect(() => {
    const init = async () => {
      try {
        await healthCheck()
        setBackendStatus('online')
        const data = await fetchModels()
        setModels(data.models)
        setEntityColors(data.entity_colors || {})
        setModelsLoading(false)
      } catch {
        setBackendStatus('offline')
        setModelsLoading(false)
      }
    }
    init()
  }, [])

  const toggleModel = (key) => {
    setSelectedModels(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  const handleAnalyze = async (text) => {
    setLoading(true)
    setError('')
    setResults(null)
    try {
      const data = await analyzeText(text, selectedModels)
      setResults(data.results)
      setAnalyzedText(data.text)
    } catch (e) {
      setError(e?.response?.data?.error || 'Analysis failed. Check backend.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <Header backendStatus={backendStatus} />

      <main className="app-main">
        {backendStatus === 'offline' && (
          <div className="app-offline glass-card fade-up">
            <h3>⚠️ Backend Not Available</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)', marginTop: 6 }}>
              Start the Flask server first:
            </p>
            <pre className="app-offline-cmd font-mono">
              cd backend{'\n'}pip install -r requirements.txt{'\n'}python app.py
            </pre>
          </div>
        )}

        {/* Step 1: Model Selection */}
        <section className="app-step fade-up" style={{ animationDelay: '0.05s' }}>
          <div className="app-step-num">1</div>
          <div className="app-step-content">
            <ModelSelector
              models={models}
              selected={selectedModels}
              onToggle={toggleModel}
              loading={modelsLoading}
            />
          </div>
        </section>

        {/* Step 2: Text Input */}
        <section className="app-step fade-up" style={{ animationDelay: '0.15s' }}>
          <div className="app-step-num">2</div>
          <div className="app-step-content">
            <TextInput
              onAnalyze={handleAnalyze}
              loading={loading}
              selectedModels={selectedModels}
            />
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="glass-card fade-up" style={{ padding: '16px 22px', borderLeft: '3px solid #f87171' }}>
            <p style={{ color: '#f87171', fontWeight: 600 }}>❌ {error}</p>
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="app-loading fade-up">
            <div className="spinner" />
            <div>
              <p style={{ fontWeight: 600 }}>Running NER analysis…</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)', marginTop: 4 }}>
                First run may take longer as models are downloaded
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {results && !loading && (
          <section className="app-step fade-up" style={{ animationDelay: '0.05s' }}>
            <div className="app-step-num" style={{ background: 'var(--grad-accent)' }}>3</div>
            <div className="app-step-content">
              <ComparisonView
                results={results}
                text={analyzedText}
                models={models}
                entityColors={entityColors}
              />
            </div>
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          NER Comparator · Built with Flask + React · Powered by Hugging Face Transformers
        </p>
      </footer>

      <style>{`
        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .app-main {
          max-width: 1300px; width: 100%;
          margin: 0 auto;
          padding: 32px 24px 60px;
          display: flex; flex-direction: column; gap: 24px;
          flex: 1;
        }
        .app-step {
          display: flex; gap: 18px; align-items: flex-start;
        }
        .app-step-num {
          width: 32px; height: 32px; flex-shrink: 0;
          background: var(--grad-primary);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 0.85rem;
          margin-top: 22px;
        }
        .app-step-content { flex: 1; min-width: 0; }
        .app-offline {
          padding: 28px;
          border-left: 3px solid #facc15;
          text-align: center;
        }
        .app-offline-cmd {
          margin-top: 14px;
          background: rgba(255,255,255,0.05);
          padding: 14px;
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          color: var(--text-secondary);
          text-align: left;
          display: inline-block;
        }
        .app-loading {
          display: flex; align-items: center; gap: 16px;
          padding: 24px;
          justify-content: center;
        }
        .app-footer {
          text-align: center;
          padding: 20px;
          border-top: 1px solid var(--border);
        }
      `}</style>
    </div>
  )
}
