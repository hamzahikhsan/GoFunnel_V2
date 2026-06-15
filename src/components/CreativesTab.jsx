import { useState } from 'react';
import { creatives } from '../data/modules.js';
import { money, ratio } from '../lib/format.js';

// Creatives (FR-A3): thumbnails, hook-rate and watch-time columns, and
// scale / refresh / pause tags derived from goal thresholds — the tag is
// a judgment with stated evidence, not decoration. Clicking a card opens a
// drill-in side panel (Flow Brief §4.2) so the cards aren't dead ends.

function CreativePanel({ creative, onClose }) {
  const c = creative;
  const stats = [
    { label: 'Hook rate', value: c.hookRate },
    { label: 'Watch time', value: c.watchTime },
    { label: 'Spend', value: money(c.spend, { compact: true }) },
    { label: 'ROAS', value: c.roas > 0 ? ratio(c.roas) : '—' },
  ];
  return (
    <>
      <div className="panel-overlay" onClick={onClose} />
      <aside className="side-panel" aria-label="Creative detail">
        <div className="side-panel-head">
          <div>
            <h2 className="side-panel-title">{c.name}</h2>
            <p className="side-panel-sub">{c.campaign} · {c.format}</p>
          </div>
          <button className="side-panel-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="creative-thumb" style={{ borderRadius: 10, margin: '14px 0' }}>{c.format}</div>

        <div className="panel-section">
          <div className="panel-section-title">Performance</div>
          {stats.map((s) => (
            <div className="score-bar-row" key={s.label} style={{ justifyContent: 'space-between' }}>
              <span className="score-bar-label" style={{ width: 'auto' }}>{s.label}</span>
              <span className="score-bar-num" style={{ width: 'auto' }}>{s.value}</span>
            </div>
          ))}
          <span className={`pill ${c.tag.tone}`} title="Derived from goal thresholds (FR-A3)" style={{ marginTop: 10 }}>
            <span className="dot" />
            {c.tag.label}
          </span>
        </div>

        <div className="panel-section">
          <div className="panel-section-title">Why this tag</div>
          <p style={{ fontSize: 12.5, color: 'var(--ink-secondary)', lineHeight: 1.6, margin: 0 }}>{c.note}</p>
        </div>
      </aside>
    </>
  );
}

export default function CreativesTab() {
  const [open, setOpen] = useState(null);
  return (
    <>
      <div className="creative-grid" style={{ marginTop: 16 }}>
        {creatives.map((c) => (
          <article className="card creative-card clickable" key={c.name} onClick={() => setOpen(c)} style={{ cursor: 'pointer' }}>
            <div className="creative-thumb">{c.format}</div>
            <div className="creative-body">
              <div className="creative-name">{c.name}</div>
              <div className="creative-meta">{c.campaign}</div>
              <div className="creative-stats">
                <div className="creative-stat">
                  <div className="cs-label">Hook rate</div>
                  <div className="cs-value">{c.hookRate}</div>
                </div>
                <div className="creative-stat">
                  <div className="cs-label">Watch time</div>
                  <div className="cs-value">{c.watchTime}</div>
                </div>
                <div className="creative-stat">
                  <div className="cs-label">Spend</div>
                  <div className="cs-value">{money(c.spend, { compact: true })}</div>
                </div>
                <div className="creative-stat">
                  <div className="cs-label">ROAS</div>
                  <div className="cs-value">{c.roas > 0 ? ratio(c.roas) : '—'}</div>
                </div>
              </div>
              <span className={`pill ${c.tag.tone}`} title="Derived from goal thresholds (FR-A3)">
                <span className="dot" />
                {c.tag.label}
              </span>
              <p className="creative-note">{c.note}</p>
            </div>
          </article>
        ))}
      </div>
      {open && <CreativePanel creative={open} onClose={() => setOpen(null)} />}
    </>
  );
}
