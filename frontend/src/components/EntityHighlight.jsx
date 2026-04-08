import React, { useState } from 'react'

export default function EntityHighlight({ text, entities, modelColor }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)

  if (!text || !entities) return null

  // Build segments: split text by entity spans
  const segments = []
  let cursor = 0
  const sorted = [...entities].sort((a, b) => a.start - b.start)

  sorted.forEach((ent, i) => {
    if (ent.start > cursor) {
      segments.push({ type: 'text', content: text.slice(cursor, ent.start) })
    }
    if (ent.end > ent.start) {
      segments.push({ type: 'entity', content: text.slice(ent.start, ent.end) || ent.text, entity: ent, idx: i })
    }
    cursor = ent.end
  })
  if (cursor < text.length) segments.push({ type: 'text', content: text.slice(cursor) })

  return (
    <div className="eh-root">
      <p className="eh-text">
        {segments.map((seg, i) => {
          if (seg.type === 'text') {
            return <span key={i}>{seg.content}</span>
          }
          const { entity, idx } = seg
          const isHovered = hoveredIdx === idx
          return (
            <span key={i} className="eh-entity-wrap">
              <mark
                className="eh-entity"
                style={{
                  background: entity.color + '33',
                  borderBottom: `2px solid ${entity.color}`,
                  color: entity.color,
                  boxShadow: isHovered ? `0 0 12px ${entity.color}66` : 'none',
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {seg.content}
                {isHovered && (
                  <span className="eh-tooltip" style={{ borderColor: entity.color }}>
                    <span className="eh-tooltip-label" style={{ color: entity.color }}>{entity.label}</span>
                    <span className="eh-tooltip-score">{(entity.score * 100).toFixed(1)}% confidence</span>
                  </span>
                )}
              </mark>
            </span>
          )
        })}
      </p>

      <style>{`
        .eh-root { }
        .eh-text {
          font-size: 0.92rem; line-height: 1.9;
          color: var(--text-primary); white-space: pre-wrap;
          word-break: break-word;
        }
        .eh-entity-wrap { position: relative; }
        .eh-entity {
          position: relative;
          border-radius: 3px;
          padding: 1px 4px;
          cursor: default;
          transition: box-shadow 0.2s;
          font-size: inherit; line-height: inherit;
        }
        .eh-tooltip {
          position: absolute; bottom: calc(100% + 6px); left: 50%;
          transform: translateX(-50%);
          background: #0e1629;
          border: 1px solid;
          border-radius: var(--radius-sm);
          padding: 6px 10px;
          white-space: nowrap;
          z-index: 100;
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          pointer-events: none;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
          animation: fadeUp 0.15s ease;
        }
        .eh-tooltip::after {
          content: '';
          position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
          border: 5px solid transparent;
          border-top-color: currentColor;
        }
        .eh-tooltip-label { font-weight: 700; font-size: 0.75rem; letter-spacing: 0.06em; text-transform: uppercase; }
        .eh-tooltip-score { font-size: 0.7rem; color: var(--text-muted); }
      `}</style>
    </div>
  )
}
