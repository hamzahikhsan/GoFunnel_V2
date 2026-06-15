import { useState } from 'react';
import Icon from './Icon.jsx';
import { pipelineStages, leads, leadTimeline, pipelineKpis } from '../data/modules.js';

// Pipeline (PRD §5.5). Stage bar above the table (FR-L1), unknown-source
// rows badged with a bulk path to the Attribution Inbox (FR-L2), lead
// drill-in side panel with touchpoint timeline (FR-L3).
function LeadPanel({ lead, onClose }) {
  return (
    <>
      <div className="panel-overlay" onClick={onClose} />
      <aside className="side-panel" aria-label="Lead detail">
        <div className="side-panel-head">
          <div>
            <h2 className="side-panel-title">{lead.name}</h2>
            <p className="side-panel-sub">{lead.stage} · source: {lead.source}</p>
          </div>
          <button className="side-panel-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="panel-section">
          <div className="panel-section-title">Touchpoint timeline</div>
          {leadTimeline.map((t) => (
            <div className="transcript-item" key={t.t + t.label}>
              <span className="transcript-t" style={{ width: 48 }}>{t.t}</span>
              <span className="transcript-text">
                <b style={{ color: 'var(--ink-primary)', fontWeight: 550 }}>{t.label}</b> — {t.detail}
              </span>
            </div>
          ))}
        </div>

        <div className="panel-section">
          <div className="panel-section-title">Next action</div>
          <p style={{ fontSize: 12.5, margin: 0 }}>{lead.nextAction} · assigned closer Alex T.</p>
        </div>
      </aside>
    </>
  );
}

export default function PipelinePage({ onNavigate }) {
  const [openLead, setOpenLead] = useState(null);
  const total = pipelineStages.reduce((s, st) => s + st.count, 0);
  const unknownCount = leads.filter((l) => l.unknown).length;

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Pipeline</h1>
          <p className="page-sub">22 leads · Jun 1–6 · stages humanized and ordered, one name per concept</p>
        </div>
      </div>

      <section className="inbox-stats" aria-label="Pipeline metrics">
        {pipelineKpis.map((k) => (
          <article className="card kpi-card today-card" key={k.label} title={k.tooltip}>
            <div className="kpi-label">
              {k.label}
              <Icon name="info" size={12} />
            </div>
            <div className="kpi-value" style={{ fontSize: 24 }}>{k.value}</div>
            <span className="kpi-prev">{k.sub}</span>
          </article>
        ))}
      </section>

      <article className="card" style={{ padding: '18px 24px', marginBottom: 16 }}>
        <div className="section-head" style={{ marginTop: 0, marginBottom: 10 }}>
          <h2 className="section-title">Stages</h2>
          <span className="section-sub">{total} leads in range</span>
        </div>
        <div className="stage-bar">
          {pipelineStages.map((s) => (
            <div
              className="stage-seg"
              key={s.name}
              style={{
                flex: Math.max(s.count, 1),
                background: s.name === 'Closed won' ? 'var(--positive-soft)' : s.name === 'Closed lost' ? 'var(--neutral-soft)' : 'var(--accent-soft)',
              }}
            >
              <div className="s-count">{s.count}</div>
              <div className="s-name">{s.name}</div>
            </div>
          ))}
        </div>
      </article>

      <article className="card daily-card">
        <div className="daily-controls" style={{ borderTop: 'none' }}>
          <span className="section-sub">
            Showing {leads.length} of {total} leads in this range · stage counts above are the full-period totals · {unknownCount} with unknown source in this view
          </span>
          <button className="compare-toggle" onClick={() => onNavigate('Attribution Inbox')}>
            Resolve {unknownCount} in Attribution Inbox →
          </button>
        </div>
        <div className="daily-table-wrap">
          <table className="daily-table">
            <thead>
              <tr>
                <th className="col-metric">Lead</th>
                <th style={{ textAlign: 'left' }}>Source</th>
                <th style={{ textAlign: 'left' }}>Stage</th>
                <th>Value</th>
                <th style={{ textAlign: 'left' }}>Last touch</th>
                <th style={{ textAlign: 'left' }}>Next action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.name} className="clickable" onClick={() => setOpenLead(l)}>
                  <td className="col-metric" style={{ fontWeight: 500, color: 'var(--ink-primary)' }}>{l.name}</td>
                  <td style={{ textAlign: 'left' }}>
                    {l.unknown ? (
                      <span className="pill neutral" title="No attributed campaign — resolve in Attribution Inbox">
                        <span className="dot" />
                        Unknown source
                      </span>
                    ) : (
                      l.source
                    )}
                  </td>
                  <td style={{ textAlign: 'left' }}>{l.stage}</td>
                  <td>{l.value}</td>
                  <td style={{ textAlign: 'left' }}>{l.lastTouch}</td>
                  <td style={{ textAlign: 'left' }}>{l.nextAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {openLead && <LeadPanel lead={openLead} onClose={() => setOpenLead(null)} />}
    </>
  );
}
