import { creatives } from '../data/modules.js';
import { money, ratio } from '../lib/format.js';

// Creatives (FR-A3): thumbnails, hook-rate and watch-time columns, and
// scale / refresh / pause tags derived from goal thresholds — the tag is
// a judgment with stated evidence, not decoration.
export default function CreativesTab() {
  return (
    <div className="creative-grid" style={{ marginTop: 16 }}>
      {creatives.map((c) => (
        <article className="card creative-card" key={c.name}>
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
  );
}
