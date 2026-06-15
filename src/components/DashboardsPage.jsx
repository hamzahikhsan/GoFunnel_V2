import { useState } from 'react';
import Icon from './Icon.jsx';
import { metricCatalog, dashboardSeed } from '../data/extras.js';

// Dashboards (PRD §5.10): one merged flow — canvas → add component →
// metric picker. The picker replaces v1's flat 300-metric checkbox list
// with search, collapsible categories, favorites and plain-language
// descriptions (FR-D2). Components inherit theme tokens automatically.
function MetricPicker({ onPick, onClose }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState({ Marketing: true });

  const q = query.trim().toLowerCase();
  const favorites = metricCatalog.flatMap((c) => c.metrics).filter((m) => m.fav);
  const recents = metricCatalog.flatMap((c) => c.metrics).filter((m) => m.recent);

  return (
    <>
      <div className="panel-overlay" onClick={onClose} />
      <aside className="side-panel" style={{ padding: 0 }} aria-label="Metric picker">
        <div className="side-panel-head" style={{ padding: '20px 24px 0' }}>
          <div>
            <h2 className="side-panel-title">Add component</h2>
            <p className="side-panel-sub">300+ metrics · search or browse by category</p>
          </div>
          <button className="side-panel-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="picker-search">
          <input
            className="input"
            placeholder="Search metrics — try “cost” or “churn”…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        {q === '' && (
          <>
            <div className="rail-title" style={{ padding: '8px 16px 2px' }}>Favorites</div>
            {favorites.map((m) => (
              <button className="picker-metric" key={`fav-${m.name}`} onClick={() => onPick(m)}>
                <span className="pm-name">{m.name}<span className="picker-tag">★ Fav</span></span>
                <br />
                <span className="pm-desc">{m.desc}</span>
              </button>
            ))}
            <div className="rail-title" style={{ padding: '8px 16px 2px' }}>Recently used</div>
            {recents.map((m) => (
              <button className="picker-metric" key={`rec-${m.name}`} onClick={() => onPick(m)}>
                <span className="pm-name">{m.name}</span>
                <br />
                <span className="pm-desc">{m.desc}</span>
              </button>
            ))}
          </>
        )}

        {metricCatalog.map((cat) => {
          const matches = cat.metrics.filter(
            (m) => q === '' || m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q),
          );
          if (q !== '' && matches.length === 0) return null;
          const isOpen = q !== '' || open[cat.category];
          return (
            <div className="picker-cat" key={cat.category}>
              <button
                className={`picker-cat-head${isOpen ? ' open' : ''}`}
                onClick={() => setOpen({ ...open, [cat.category]: !open[cat.category] })}
              >
                {cat.category} ({matches.length})
                <Icon name="chevronDown" size={13} />
              </button>
              {isOpen &&
                matches.map((m) => (
                  <button className="picker-metric" key={m.name} onClick={() => onPick(m)}>
                    <span className="pm-name">{m.name}</span>
                    <br />
                    <span className="pm-desc">{m.desc}</span>
                  </button>
                ))}
            </div>
          );
        })}
      </aside>
    </>
  );
}

export default function DashboardsPage() {
  const [components, setComponents] = useState(dashboardSeed);
  const [picking, setPicking] = useState(false);

  function addMetric(m) {
    setComponents([...components, { id: `d${Date.now()}`, title: m.name, value: m.sample, note: m.desc }]);
    setPicking(false);
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Dashboards</h1>
          <p className="page-sub">
            One builder for dashboards and components — every card inherits theme tokens and goal thresholds (FR-D3)
          </p>
        </div>
        <button className="btn-primary" onClick={() => setPicking(true)}>Add component</button>
      </div>

      <div className="section-head">
        <h2 className="section-title">Morning dashboard</h2>
        <span className="section-sub">{components.length} components · shared with 2 teammates</span>
      </div>

      <div className="dash-canvas">
        {components.map((c) => (
          <article className="card kpi-card today-card" key={c.id}>
            <div className="kpi-label">
              {c.title}
              <button
                className="block-remove"
                style={{ marginLeft: 'auto', padding: 0 }}
                aria-label={`Remove ${c.title}`}
                onClick={() => setComponents(components.filter((x) => x.id !== c.id))}
              >
                ✕
              </button>
            </div>
            <div className="kpi-value" style={{ fontSize: 24 }}>{c.value}</div>
            <span className="kpi-prev">{c.note}</span>
          </article>
        ))}
        <button className="dash-add" onClick={() => setPicking(true)}>
          <Icon name="grid" size={18} />
          Add component
        </button>
      </div>

      {picking && <MetricPicker onPick={addMetric} onClose={() => setPicking(false)} />}
    </>
  );
}
