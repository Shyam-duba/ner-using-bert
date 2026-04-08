import React from 'react'
import ResultsPanel from './ResultsPanel'

export default function ComparisonView({ results, text, models, entityColors }) {
  if (!results) return null

  const keys = Object.keys(results)
  if (keys.length === 0) return null

  // Map model keys to model info
  const modelMap = {}
  models.forEach(m => { modelMap[m.key] = m })

  return (
    <div className="cv-root fade-up">
      <div className="cv-header">
        <h2 className="grad-text" style={{ fontSize: '1.2rem', fontWeight: 800 }}>
          ⚡ Analysis Results
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)', marginTop: 4 }}>
          {keys.length > 1
            ? `Comparing ${keys.length} models side by side`
            : 'Single model results'}
        </p>
      </div>

      {/* Summary Comparison Table (if multiple models) */}
      {keys.length > 1 && (
        <div className="cv-summary glass-card">
          <table className="cv-summary-table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Entities Found</th>
                <th>Avg Confidence</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {keys.map(k => {
                const r = results[k]
                const m = modelMap[k]
                return (
                  <tr key={k}>
                    <td>
                      <div className="cv-model-cell">
                        <span className="cv-model-dot" style={{ background: m?.color || '#888' }} />
                        <span style={{ fontWeight: 600 }}>{r.model_name}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700 }}>{r.entity_count}</td>
                    <td>
                      <span style={{ fontWeight: 700 }}>{(r.avg_confidence * 100).toFixed(1)}%</span>
                    </td>
                    <td className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
                      {r.time_ms < 1000 ? `${r.time_ms}ms` : `${(r.time_ms/1000).toFixed(1)}s`}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Result Panels */}
      <div className={`cv-grid cv-grid-${Math.min(keys.length, 3)}`}>
        {keys.map(k => {
          const m = modelMap[k]
          return (
            <ResultsPanel
              key={k}
              result={results[k]}
              text={text}
              entityColors={entityColors}
              modelColor={m?.color || '#888'}
            />
          )
        })}
      </div>

      <style>{`
        .cv-root { margin-top: 10px; }
        .cv-header { margin-bottom: 18px; }
        .cv-summary { padding: 0; margin-bottom: 18px; overflow: hidden; }
        .cv-summary-table {
          width: 100%; border-collapse: collapse; font-size: 0.85rem;
        }
        .cv-summary-table th {
          text-align: left; padding: 14px 18px;
          background: rgba(255,255,255,0.04);
          color: var(--text-muted); font-weight: 600;
          font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em;
          border-bottom: 1px solid var(--border);
        }
        .cv-summary-table td {
          padding: 14px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .cv-summary-table tr:last-child td { border-bottom: none; }
        .cv-summary-table tr:hover td { background: rgba(255,255,255,0.03); }
        .cv-model-cell { display: flex; align-items: center; gap: 10px; }
        .cv-model-dot { width: 10px; height: 10px; border-radius: 50%; }
        .cv-grid { display: grid; gap: 20px; }
        .cv-grid-1 { grid-template-columns: 1fr; }
        .cv-grid-2 { grid-template-columns: repeat(2, 1fr); }
        .cv-grid-3 { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 900px) {
          .cv-grid-2, .cv-grid-3 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
