import Icon from './Icon.jsx';
import FunnelStrip from './FunnelStrip.jsx';
import { today, dailyBrief, attention, quickActions } from '../data/modules.js';

// The morning answer screen (PRD §5.1). Today strip is honest about the
// partial day: spend hasn't synced yet, so spend/ROAS render "—" with the
// cause in the tooltip — never "$0.00 ↑0%" (FR-G2).
export default function CommandCenter({ onNavigate }) {
  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Good morning, Daniel</h1>
          <p className="page-sub">Saturday, Jun 6 · DK Filler · all numbers vs your goals</p>
        </div>
      </div>

      <section className="today-row" aria-label="Today at a glance">
        {today.map((t) => (
          <article className="card kpi-card today-card" key={t.label} title={t.tooltip}>
            <div className="kpi-label">
              {t.label}
              <Icon name="info" size={12} />
            </div>
            <div className="kpi-value" style={{ fontSize: 24 }}>{t.display}</div>
            <span className="kpi-prev">{t.sub}</span>
            <div className="t-mtd">{t.mtd}</div>
          </article>
        ))}
      </section>

      <div className="cc-grid">
        <article className="card" style={{ padding: '20px 24px' }}>
          <div className="section-head" style={{ marginTop: 0 }}>
            <h2 className="section-title">Helios Daily Brief</h2>
            <span className="section-sub">Generated 7:02 AM · refreshes on load</span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: '10px 0 14px' }}>{dailyBrief.text}</p>
          <button className="chip-btn" onClick={() => onNavigate('Helios')}>
            <Icon name="spark" size={13} />
            Ask a follow-up
          </button>
          <button className="chip-btn" onClick={() => onNavigate('Attribution Inbox')}>
            Resolve top matches
            <Icon name="arrowRight" size={13} />
          </button>
        </article>

        <article className="card" style={{ padding: '20px 24px' }}>
          <div className="section-head" style={{ marginTop: 0 }}>
            <h2 className="section-title">Needs attention</h2>
            <span className="section-sub">{attention.length} items</span>
          </div>
          <div className="attention-list">
            {attention.map((a) => (
              <button className="attention-item" key={a.title} onClick={() => onNavigate(a.target)}>
                <span className={`attention-dot ${a.tone}`} />
                <span>
                  <span className="attention-title">{a.title}</span>
                  <br />
                  <span className="attention-detail">{a.detail}</span>
                </span>
                <span className="attention-action">{a.action} →</span>
              </button>
            ))}
          </div>
        </article>
      </div>

      <FunnelStrip />

      <div className="quick-actions" aria-label="Quick actions">
        {quickActions.map((q) => (
          <button className="qa-btn" key={q.label} onClick={() => onNavigate(q.target)}>
            <Icon name={q.icon} size={14} />
            {q.label}
          </button>
        ))}
      </div>
    </>
  );
}
