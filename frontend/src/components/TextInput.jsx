import React, { useState, useRef } from 'react'
import { extractFromUrl, extractFromFile } from '../api/nerApi'

const TABS = ['text', 'url', 'file']
const TAB_LABELS = { text: '✏️ Text', url: '🔗 URL', file: '📄 File' }
const MAX_CHARS = 50000

export default function TextInput({ onAnalyze, loading, selectedModels }) {
  const [tab, setTab] = useState('text')
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState(null)
  const [extracting, setExtracting] = useState(false)
  const [extractError, setExtractError] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef()

  const canAnalyze = text.trim().length > 0 && selectedModels.length > 0 && !loading

  const handleExtractUrl = async () => {
    if (!url.trim()) return
    setExtracting(true); setExtractError('')
    try {
      const res = await extractFromUrl(url.trim())
      setText(res.text)
      setTab('text')
    } catch (e) {
      setExtractError(e?.response?.data?.error || 'Failed to fetch URL')
    } finally {
      setExtracting(false)
    }
  }

  const handleFileChange = async (f) => {
    if (!f) return
    setFile(f); setExtracting(true); setExtractError('')
    try {
      const res = await extractFromFile(f)
      setText(res.text)
      setTab('text')
    } catch (e) {
      setExtractError(e?.response?.data?.error || 'Failed to read file')
    } finally {
      setExtracting(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFileChange(f)
  }

  return (
    <section className="ti-section glass-card">
      {/* Tab Bar */}
      <div className="ti-tabs">
        {TABS.map(t => (
          <button
            key={t}
            id={`tab-${t}`}
            className={`ti-tab ${tab === t ? 'ti-tab--active' : ''}`}
            onClick={() => { setTab(t); setExtractError('') }}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="ti-body">
        {/* TEXT TAB */}
        {tab === 'text' && (
          <div className="fade-up">
            <textarea
              id="text-input"
              className="ti-textarea"
              placeholder="Paste or type your text here… (articles, paragraphs, documents)"
              value={text}
              onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
              rows={10}
            />
            <div className="ti-footer">
              <span className="text-xs" style={{ color: text.length > MAX_CHARS * 0.9 ? '#f87171' : 'var(--text-muted)' }}>
                {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} chars
              </span>
              {text.length > 0 && (
                <button className="btn btn-ghost text-xs" style={{ padding: '5px 12px' }} onClick={() => setText('')}>
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* URL TAB */}
        {tab === 'url' && (
          <div className="fade-up ti-url-panel">
            <p className="ti-help">Enter an article or webpage URL — we'll extract the text automatically.</p>
            <div className="ti-url-row">
              <input
                id="url-input"
                className="ti-input"
                type="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleExtractUrl()}
              />
              <button className="btn btn-primary" onClick={handleExtractUrl} disabled={!url.trim() || extracting}>
                {extracting ? <><span className="spinner" /> Fetching…</> : 'Extract Text'}
              </button>
            </div>
            {extractError && <p className="ti-error">{extractError}</p>}
          </div>
        )}

        {/* FILE TAB */}
        {tab === 'file' && (
          <div className="fade-up">
            <div
              className={`ti-dropzone ${dragging ? 'ti-dropzone--drag' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".txt,.pdf,.docx"
                style={{ display: 'none' }}
                onChange={e => handleFileChange(e.target.files[0])}
                id="file-input"
              />
              {extracting ? (
                <><div className="spinner" style={{ margin: '0 auto 12px' }} /><p>Extracting text…</p></>
              ) : file ? (
                <>
                  <div className="ti-file-icon">📄</div>
                  <p className="ti-file-name">{file.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Click to change file</p>
                </>
              ) : (
                <>
                  <div className="ti-drop-icon">☁️</div>
                  <p className="ti-drop-text">Drag & drop or <span>click to upload</span></p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Supports .txt · .pdf · .docx</p>
                </>
              )}
            </div>
            {extractError && <p className="ti-error">{extractError}</p>}
          </div>
        )}

        {/* Analyze Button */}
        <div className="ti-analyze-row">
          {selectedModels.length === 0 && (
            <p className="ti-warn">⚠️ Select at least one model above</p>
          )}
          {text.trim().length === 0 && selectedModels.length > 0 && (
            <p className="ti-warn">⚠️ Enter or extract some text first</p>
          )}
          <button
            id="analyze-btn"
            className="btn btn-primary"
            style={{ padding: '13px 36px', fontSize: '1rem' }}
            onClick={() => onAnalyze(text)}
            disabled={!canAnalyze}
          >
            {loading
              ? <><span className="spinner" /> Analyzing…</>
              : <>⚡ Analyze with {selectedModels.length} Model{selectedModels.length !== 1 ? 's' : ''}</>
            }
          </button>
        </div>
      </div>

      <style>{`
        .ti-section { overflow: hidden; }
        .ti-tabs { display: flex; border-bottom: 1px solid var(--border); }
        .ti-tab {
          padding: 14px 22px; border: none; cursor: pointer;
          font-family: inherit; font-size: 0.88rem; font-weight: 600;
          background: transparent; color: var(--text-muted);
          border-bottom: 2px solid transparent; margin-bottom: -1px;
          transition: all 0.2s;
        }
        .ti-tab:hover { color: var(--text-primary); }
        .ti-tab--active { color: var(--text-primary); border-bottom-color: #6C63FF; }
        .ti-body { padding: 22px; display: flex; flex-direction: column; gap: 16px; }
        .ti-textarea {
          width: 100%; background: rgba(255,255,255,0.03);
          border: 1px solid var(--border); border-radius: var(--radius-md);
          color: var(--text-primary); font-family: inherit; font-size: 0.9rem;
          line-height: 1.6; padding: 14px 16px; resize: vertical;
          transition: border-color 0.2s; outline: none;
        }
        .ti-textarea:focus { border-color: var(--border-hover); }
        .ti-textarea::placeholder { color: var(--text-muted); }
        .ti-footer { display: flex; justify-content: space-between; align-items: center; margin-top: -8px; }
        .ti-url-panel { display: flex; flex-direction: column; gap: 14px; }
        .ti-help { font-size: 0.82rem; color: var(--text-muted); }
        .ti-url-row { display: flex; gap: 12px; }
        .ti-input {
          flex: 1; background: rgba(255,255,255,0.03);
          border: 1px solid var(--border); border-radius: var(--radius-md);
          color: var(--text-primary); font-family: inherit; font-size: 0.9rem;
          padding: 12px 16px; outline: none; transition: border-color 0.2s;
        }
        .ti-input:focus { border-color: var(--border-hover); }
        .ti-input::placeholder { color: var(--text-muted); }
        .ti-dropzone {
          border: 2px dashed var(--border); border-radius: var(--radius-lg);
          padding: 48px 24px; text-align: center; cursor: pointer;
          transition: all 0.25s; color: var(--text-secondary);
          display: flex; flex-direction: column; align-items: center; gap: 10px;
        }
        .ti-dropzone:hover, .ti-dropzone--drag {
          border-color: #6C63FF; background: rgba(108,99,255,0.06);
        }
        .ti-drop-icon, .ti-file-icon { font-size: 2.5rem; }
        .ti-drop-text { font-size: 0.9rem; }
        .ti-drop-text span { color: #6C63FF; text-decoration: underline; }
        .ti-file-name { font-weight: 600; font-size: 0.95rem; }
        .ti-error { color: #f87171; font-size: 0.82rem; padding: 8px 12px; background: rgba(248,113,113,0.1); border-radius: var(--radius-sm); }
        .ti-warn { color: var(--text-muted); font-size: 0.82rem; }
        .ti-analyze-row { display: flex; align-items: center; justify-content: flex-end; gap: 14px; flex-wrap: wrap; margin-top: 4px; }
      `}</style>
    </section>
  )
}
