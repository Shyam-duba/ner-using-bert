import React from 'react'

export default function ModelSelector({ models, selected, onToggle, loading }) {
  if (loading) {
    return (
      <section className="ms-section glass-card">
        <div style={{ padding: '28px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div className="spinner" style={{ margin: '0 auto 12px' }} />
          <p>Loading models…</p>
        </div>
      </section>
    )
  }

  return (
    <section className="ms-section glass-card">
      <div className="ms-header">
        <div>
          <h2 className="ms-title">Select Models</h2>
          <p className="ms-sub">Choose one or more models to compare their NER output</p>
        </div>
        <span className="badge" style={{ background: 'rgba(108,99,255,0.15)', color: '#a78bfa', border: '1px solid rgba(108,99,255,0.3)' }}>
          {selected.length} / {models.length} selected
        </span>
      </div>

      <div className="ms-grid">
        {models.map((model, i) => {
          const isSelected = selected.includes(model.key)
          return (
            <button
              key={model.key}
              id={`model-btn-${model.key}`}
              className={`ms-card ${isSelected ? 'ms-card--active' : ''}`}
              style={{ '--model-color': model.color }}
              onClick={() => onToggle(model.key)}
            >
              <div className="ms-card-top">
                <div className="ms-card-icon" style={{ background: `${model.color}22`, border: `1px solid ${model.color}55` }}>
                  <span style={{ fontSize: '1.1rem' }}>🤖</span>
                </div>
                <div className={`ms-check ${isSelected ? 'ms-check--on' : ''}`}>
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>
              <div className="ms-card-body">
                <h3 className="ms-card-name">{model.name}</h3>
                <p className="ms-card-desc">{model.description}</p>
                <div className="ms-card-id font-mono">{model.id}</div>
              </div>
              <div className="ms-card-bar" style={{ background: model.color }} />
            </button>
          )
        })}
      </div>

      <style>{`
        .ms-section { padding: 24px; }
        .ms-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 20px; gap: 12px; flex-wrap: wrap;
        }
        .ms-title { font-size: 1.05rem; font-weight: 700; }
        .ms-sub { font-size: 0.8rem; color: var(--text-muted); margin-top: 4px; }
        .ms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 14px;
        }
        .ms-card {
          position: relative; overflow: hidden;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 18px;
          cursor: pointer; text-align: left;
          transition: all 0.25s;
          font-family: inherit;
        }
        .ms-card:hover {
          border-color: var(--model-color, var(--border-hover));
          background: rgba(255,255,255,0.06);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .ms-card--active {
          border-color: var(--model-color) !important;
          background: rgba(255,255,255,0.06) !important;
          box-shadow: 0 0 0 1px var(--model-color), 0 8px 24px rgba(0,0,0,0.3);
        }
        .ms-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
        .ms-card-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .ms-check {
          width: 22px; height: 22px; border-radius: 50%;
          border: 2px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .ms-check--on { background: var(--model-color); border-color: var(--model-color); }
        .ms-card-name { font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 5px; }
        .ms-card-desc { font-size: 0.78rem; color: var(--text-secondary); line-height: 1.45; margin-bottom: 10px; }
        .ms-card-id { font-size: 0.68rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ms-card-bar {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 3px; border-radius: 0 0 var(--radius-md) var(--radius-md);
          opacity: 0; transition: opacity 0.25s;
        }
        .ms-card--active .ms-card-bar,
        .ms-card:hover .ms-card-bar { opacity: 1; }
      `}</style>
    </section>
  )
}
