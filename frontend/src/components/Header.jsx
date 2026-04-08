import React from 'react'

export default function Header({ backendStatus }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-logo">
          <div className="logo-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" stroke="url(#grad1)" strokeWidth="2"/>
              <path d="M8 14h12M14 8v12" stroke="url(#grad1)" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="8" cy="14" r="2.5" fill="#6C63FF"/>
              <circle cx="20" cy="14" r="2.5" fill="#00D4FF"/>
              <circle cx="14" cy="8" r="2.5" fill="#FF6584"/>
              <circle cx="14" cy="20" r="2.5" fill="#a78bfa"/>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#6C63FF"/>
                  <stop offset="1" stopColor="#00D4FF"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1 className="logo-title grad-text">NER Comparator</h1>
            <p className="logo-sub">Named Entity Recognition · Model Analysis</p>
          </div>
        </div>
        <div className="header-status">
          <span className={`status-dot ${backendStatus === 'online' ? 'online' : backendStatus === 'checking' ? 'checking' : 'offline'}`} />
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Backend {backendStatus === 'online' ? 'Online' : backendStatus === 'checking' ? 'Checking…' : 'Offline'}
          </span>
        </div>
      </div>
      <style>{`
        .app-header {
          position: sticky; top: 0; z-index: 100;
          background: rgba(8,13,26,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }
        .header-inner {
          max-width: 1300px; margin: 0 auto;
          padding: 14px 28px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .header-logo { display: flex; align-items: center; gap: 14px; }
        .logo-icon {
          width: 46px; height: 46px;
          background: rgba(108,99,255,0.1);
          border: 1px solid rgba(108,99,255,0.3);
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
        }
        .logo-title { font-size: 1.3rem; font-weight: 800; line-height: 1; }
        .logo-sub { font-size: 0.72rem; color: var(--text-muted); margin-top: 3px; letter-spacing: 0.05em; }
        .header-status { display: flex; align-items: center; gap: 8px; }
        .status-dot {
          width: 9px; height: 9px; border-radius: 50%;
          transition: background 0.3s;
        }
        .status-dot.online  { background: #4ade80; box-shadow: 0 0 8px #4ade80; }
        .status-dot.offline { background: #f87171; }
        .status-dot.checking { background: #facc15; animation: pulse 1s infinite; }
      `}</style>
    </header>
  )
}
