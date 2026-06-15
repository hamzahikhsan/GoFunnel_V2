import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';

const ranges = ['MTD', 'WTD', '3M', 'Custom'];

// Pages reachable from the command palette (Brief §4.1 search).
const NAV_PAGES = [
  { name: 'Command Center', crumb: 'Home' },
  { name: 'Meta Insights', crumb: 'Reports' },
  { name: 'Calls', crumb: 'Reports' },
  { name: 'Pipeline', crumb: 'Reports' },
  { name: 'Payments', crumb: 'Reports' },
  { name: 'Attribution Inbox', crumb: 'Attribution' },
  { name: 'Helios', crumb: 'AI' },
  { name: 'Scheduled Reports', crumb: 'Tools' },
  { name: 'Dashboards', crumb: 'Tools' },
  { name: 'Goals', crumb: 'Tools' },
  { name: 'Theme', crumb: 'Tools' },
  { name: 'Connections', crumb: 'Settings' },
];

const RANGE_NOTE = 'Prototype dataset covers Jun 1–6 — all ranges show the same MTD numbers.';

function CommandPalette({ onNavigate, onClose }) {
  const [q, setQ] = useState('');
  const results = NAV_PAGES.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  function go(name) { onNavigate(name); onClose(); }
  return (
    <div className="cmdk-overlay" onClick={onClose}>
      <div className="cmdk-card" onClick={(e) => e.stopPropagation()}>
        <div className="cmdk-input">
          <Icon name="search" size={15} />
          <input
            autoFocus
            placeholder="Jump to a page…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && results[0]) go(results[0].name);
              if (e.key === 'Escape') onClose();
            }}
          />
        </div>
        <div className="cmdk-list">
          {results.length === 0 && <div className="menu-note">No page matches “{q}”.</div>}
          {results.map((p, i) => (
            <button key={p.name} className={`cmdk-row${i === 0 ? ' active' : ''}`} onClick={() => go(p.name)}>
              {p.name}
              <span className="cmdk-crumb">{p.crumb}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Topbar({ breadcrumb, showDateRange = true, onNavigate }) {
  const [range, setRange] = useState('MTD');
  const [openMenu, setOpenMenu] = useState(null); // 'client' | 'date'
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const clientRef = useRef();
  const dateRef = useRef();
  const toastTimer = useRef();

  useEffect(() => {
    if (!openMenu) return undefined;
    function onDown(e) {
      const ref = openMenu === 'client' ? clientRef : dateRef;
      if (ref.current && !ref.current.contains(e.target)) setOpenMenu(null);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [openMenu]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  function honestToast() {
    clearTimeout(toastTimer.current);
    setToast(RANGE_NOTE);
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  }

  function pickRange(r) {
    if (r === 'Custom') { setOpenMenu(openMenu === 'date' ? null : 'date'); return; }
    setRange(r);
    setOpenMenu(null);
    if (r !== 'MTD') honestToast();
  }

  return (
    <header className="topbar">
      <div className="tb-menu-wrap" ref={clientRef}>
        <button
          className="client-switcher"
          onClick={() => setOpenMenu(openMenu === 'client' ? null : 'client')}
          title="Agency mode: switch between client workspaces. Prototype has one client (DK Filler)."
        >
          <span className="avatar">DK</span>
          DK Filler
          <Icon name="chevronsUpDown" size={12} />
        </button>
        {openMenu === 'client' && (
          <div className="menu">
            <button className="menu-item">DK Filler <span className="check">✓</span></button>
            <button className="menu-item" disabled>+ Add client workspace (agency mode)</button>
            <div className="menu-note">Prototype has one workspace.</div>
          </div>
        )}
      </div>

      <div className="breadcrumb">
        {breadcrumb.map((part, i) => (
          <span key={part} className={i === breadcrumb.length - 1 ? 'crumb-current' : undefined}>
            {i > 0 && <span style={{ marginRight: 8 }}>/</span>}
            {part}
          </span>
        ))}
      </div>

      <div className="topbar-spacer" />

      <button className="tb-icon-btn" aria-label="Search" title="Search pages (⌘K)" onClick={() => setPaletteOpen(true)}>
        <Icon name="search" size={16} />
      </button>
      <button className="tb-icon-btn" aria-label="Ask Helios" title="Ask Helios" onClick={() => onNavigate?.('Helios')}>
        <Icon name="spark" size={16} />
      </button>

      {showDateRange && (
        <div className="tb-menu-wrap" ref={dateRef}>
          <div
            className="segmented"
            role="group"
            aria-label="Date range"
            title="Selected range persists across pages (FR-G1). The prototype dataset covers Jun 1–6, so every range shows the same numbers."
          >
            {ranges.map((r) => (
              <button
                key={r}
                className={r === range || (r === 'Custom' && openMenu === 'date') ? 'active' : ''}
                onClick={() => pickRange(r)}
              >
                {r}
              </button>
            ))}
          </div>
          {openMenu === 'date' && (
            <div className="menu right date-popover">
              <label htmlFor="d-from">From</label>
              <input id="d-from" type="date" defaultValue="2026-06-01" />
              <label htmlFor="d-to">To</label>
              <input id="d-to" type="date" defaultValue="2026-06-06" />
              <p className="pop-note">Prototype dataset only covers Jun 1–6. Custom ranges show the same MTD numbers.</p>
              <div style={{ marginTop: 10 }}>
                <button className="btn-primary" onClick={() => { setRange('Custom'); setOpenMenu(null); honestToast(); }}>Apply</button>
              </div>
            </div>
          )}
        </div>
      )}

      {paletteOpen && <CommandPalette onNavigate={onNavigate} onClose={() => setPaletteOpen(false)} />}

      {toast && (
        <div className="toast-stack">
          <div className="undo-toast"><span>{toast}</span></div>
        </div>
      )}
    </header>
  );
}
