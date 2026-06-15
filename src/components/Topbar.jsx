import { useState } from 'react';
import Icon from './Icon.jsx';

const ranges = ['MTD', 'WTD', '3M', 'Custom'];

export default function Topbar({ breadcrumb, showDateRange = true }) {
  const [range, setRange] = useState('MTD');

  return (
    <header className="topbar">
      <button
        className="client-switcher"
        title="Agency mode: switch between client workspaces. Prototype has one client (DK Filler)."
      >
        <span className="avatar">DK</span>
        DK Filler
        <Icon name="chevronsUpDown" size={12} />
      </button>
      <div className="breadcrumb">
        {breadcrumb.map((part, i) => (
          <span key={part} className={i === breadcrumb.length - 1 ? 'crumb-current' : undefined}>
            {i > 0 && <span style={{ marginRight: 8 }}>/</span>}
            {part}
          </span>
        ))}
      </div>
      <div className="topbar-spacer" />
      {showDateRange && (
        <div
          className="segmented"
          role="group"
          aria-label="Date range"
          title="Selected range persists across pages (FR-G1). The prototype dataset covers Jun 1–6, so every range shows the same numbers."
        >
          {ranges.map((r) => (
            <button key={r} className={r === range ? 'active' : ''} onClick={() => setRange(r)}>
              {r}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
