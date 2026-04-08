import React from 'react'
import EntityHighlight from './EntityHighlight'
import EntityLegend from './EntityLegend'

export default function ResultsPanel({ result, text, entityColors, modelColor }) {
  if (!result) return null

  const { entities, entity_count, label_counts, avg_confidence, time_ms, model_name, error } = result

  if (error) {
    return (
      <div className="rp-error glass-card fade-up">
        <p>❌ Error from <strong>{model_name}</strong></p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{error}</p>
      </div>
    )
  }

  return (
    <div className="rp-root glass-card fade-up">
      {/* Header */}
      <div className="rp-head">
        <div className="rp-head-left">
          <div className="rp-dot" style={{ background: modelColor }} />
          <h3 className="rp-model-name">{model_name}</h3>
        </div>
        <div className="rp-stats">
          <div className="rp-stat">
            <span className="rp-stat-val">{entity_count}</span>
            <span className="rp-stat-lbl">Entities</span>
          </div>
          <div className="rp-stat-div" />
          <div className="rp-stat">
            <span className="rp-stat-val">{(avg_confidence * 100).toFixed(1)}%</span>
            <span className="rp-stat-lbl">Avg Conf.</span>
          </div>
          <div className="rp-stat-div" />
          <div className="rp-stat">
            <span className="rp-stat-val">{time_ms < 1000 ? `${time_ms}ms` : `${(time_ms/1000).toFixed(1)}s`}</span>
            <span className="rp-stat-lbl">Time</span>
          </div>
        </div>
      </div>

      {/* Highlighted Text */}
      <div className="rp-content">
        {entity_count === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>
            No entities found in the text.
          </p>
        ) : (
          <EntityHighlight text={text} entities={entities} modelColor={modelColor} />
        )}
      </div>

      {/* Legend */}
      {entity_count > 0 && (
        <div className="rp-legend">
          <EntityLegend labelCounts={label_counts} entityColors={entityColors} />
        </div>
      )}

      {/* Entity Table */}
      {entity_count > 0 && (
        <div className="rp-table-wrap">
          <p className="el-title" style={{ padding: '0 0 10px' }}>Detected Entities</p>
          <div className="rp-table-scroll">
            <table className="rp-table">
              <thead>
                <tr>
                  <th>Entity</th>
                  <th>Label</th>
                  <th>Confidence</th>
                  <th>Position</th>
                </tr>
              </thead>
              <tbody>
                {entities.map((ent, i) => (
                  <tr key={i}>
                    <td className="font-mono" style={{ color: ent.color, fontWeight: 600 }}>{ent.text}</td>
                    <td>
                      <span className="badge" style={{
                        background: (ent.color || '#aaa') + '22',
                        color: ent.color || '#aaa',
                        border: `1px solid ${(ent.color || '#aaa')}44`
                      }}>{ent.label}</span>
                    </td>
                    <td>
                      <div className="rp-conf-bar-bg">
                        <div className="rp-conf-bar" style={{ width: `${ent.score * 100}%`, background: ent.color }} />
                      </div>
                      <span className="text-xs">{(ent.score * 100).toFixed(1)}%</span>
                    </td>
                    <td className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{ent.start}–{ent.end}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        .rp-root { overflow: hidden; }
        .rp-error { padding: 20px; border-left: 3px solid #f87171; }
        .rp-head {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 14px;
          padding: 18px 22px;
          border-bottom: 1px solid var(--border);
        }
        .rp-head-left { display: flex; align-items: center; gap: 10px; }
        .rp-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
        .rp-model-name { font-size: 1rem; font-weight: 700; }
        .rp-stats { display: flex; align-items: center; gap: 14px; }
        .rp-stat { display: flex; flex-direction: column; align-items: center; }
        .rp-stat-val { font-weight: 700; font-size: 0.95rem; }
        .rp-stat-lbl { font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
        .rp-stat-div { width: 1px; height: 28px; background: var(--border); }
        .rp-content { padding: 22px; }
        .rp-legend { padding: 0 22px 18px; }
        .rp-table-wrap { padding: 0 22px 22px; }
        .rp-table-scroll { max-height: 300px; overflow-y: auto; border-radius: var(--radius-sm); }
        .rp-table {
          width: 100%; border-collapse: collapse;
          font-size: 0.82rem;
        }
        .rp-table thead { position: sticky; top: 0; }
        .rp-table th {
          text-align: left; padding: 8px 12px;
          background: rgba(255,255,255,0.04);
          color: var(--text-muted); font-weight: 600;
          font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em;
          border-bottom: 1px solid var(--border);
        }
        .rp-table td {
          padding: 8px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          vertical-align: middle;
        }
        .rp-table tr:hover td { background: rgba(255,255,255,0.03); }
        .rp-conf-bar-bg {
          width: 60px; height: 5px;
          background: rgba(255,255,255,0.08);
          border-radius: 99px; overflow: hidden;
          display: inline-block; vertical-align: middle;
          margin-right: 6px;
        }
        .rp-conf-bar { height: 100%; border-radius: 99px; transition: width 0.5s ease; }
      `}</style>
    </div>
  )
}
