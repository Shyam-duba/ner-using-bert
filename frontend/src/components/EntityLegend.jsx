import React from 'react'

export default function EntityLegend({ labelCounts, entityColors }) {
  const labels = Object.keys(labelCounts).sort((a, b) => labelCounts[b] - labelCounts[a])
  if (!labels.length) return null

  return (
    <div className="el-root">
      <p className="el-title">Entity Legend</p>
      <div className="el-grid">
        {labels.map(label => (
          <div key={label} className="el-item">
            <span
              className="el-dot"
              style={{ background: entityColors[label] || '#aaa' }}
            />
            <span className="el-label">{label}</span>
            <span className="el-count">{labelCounts[label]}</span>
          </div>
        ))}
      </div>
      <style>{`
        .el-root { margin-top: 20px; }
        .el-title { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); margin-bottom: 10px; font-weight: 600; }
        .el-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .el-item {
          display: flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: 99px;
          padding: 4px 12px;
          font-size: 0.78rem;
        }
        .el-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .el-label { color: var(--text-secondary); font-weight: 500; }
        .el-count {
          background: rgba(255,255,255,0.08);
          border-radius: 99px;
          padding: 1px 7px;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-primary);
        }
      `}</style>
    </div>
  )
}
