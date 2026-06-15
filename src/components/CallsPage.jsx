import { useState } from 'react';
import Icon from './Icon.jsx';
import { callKpis, calls, callDetail, callInsights } from '../data/modules.js';

const tabs = ['Log', 'Insights', 'Closed Deal Insights'];

const SCORE_RUBRIC =
  'AI call score 0–100. 0–49 needs coaching · 50–69 average · 70–84 strong · 85+ exceptional.';

// One count basis, derived from the call log so every tab reads the same numbers
// (Fix Brief §1). No hardcoded 19/14/12 — they fall out of the data.
const BOOKED = calls.length;
const SHOWN = calls.filter((c) => c.stage !== 'No show' && c.stage !== 'Missed meeting').length;
const SCORED = calls.filter((c) => c.score != null).length;

function ScorePill({ score }) {
  if (score == null) return <span className="muted">—</span>;
  const tone = score >= 70 ? 'high' : score >= 50 ? 'mid' : 'low';
  return (
    <span className={`score-pill ${tone}`} title={SCORE_RUBRIC}>
      {score}
    </span>
  );
}

function CallDetailPanel({ call, onClose }) {
  return (
    <>
      <div className="panel-overlay" onClick={onClose} />
      <aside className="side-panel" aria-label="Call detail">
        <div className="side-panel-head">
          <div>
            <h2 className="side-panel-title">{call.lead}</h2>
            <p className="side-panel-sub">
              {call.date} · {call.duration} · {call.closer} · {call.stage}
            </p>
          </div>
          <button className="side-panel-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div style={{ margin: '14px 0' }}>
          <div className="recording-stub">
            <span className="play">▶</span>
            Recording · {call.duration} · provided by Fathom
          </div>
        </div>

        <div className="panel-section">
          <div className="panel-section-title">Score breakdown — {call.score ?? '—'} overall</div>
          {callDetail.scoreBreakdown.map((s) => (
            <div className="score-bar-row" key={s.label}>
              <span className="score-bar-label">{s.label}</span>
              <span className="score-bar-track">
                <span className="score-bar-fill" style={{ width: `${s.value}%` }} />
              </span>
              <span className="score-bar-num">{s.value}</span>
            </div>
          ))}
          <p style={{ fontSize: 11.5, color: 'var(--ink-tertiary)', margin: '8px 0 0' }}>{SCORE_RUBRIC}</p>
        </div>

        <div className="panel-section">
          <div className="panel-section-title">Transcript highlights</div>
          {callDetail.highlights.map((h) => (
            <div className="transcript-item" key={h.t}>
              <span className="transcript-t">{h.t}</span>
              <span className="transcript-text">{h.text}</span>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

function LogTab({ onOpen }) {
  const [reviewOnly, setReviewOnly] = useState(false);
  const rows = reviewOnly ? calls.filter((c) => c.needsReview) : calls;
  return (
    <article className="card daily-card">
      <div className="daily-controls" style={{ borderTop: 'none' }}>
        <span className="section-sub">
          {reviewOnly
            ? `${rows.length} of ${BOOKED} booked · Jun 1–6`
            : `${BOOKED} booked · ${SHOWN} shown · ${SCORED} scored · Jun 1–6 — one count basis across all tabs`}
        </span>
        <button
          className={`compare-toggle${reviewOnly ? ' active' : ''}`}
          onClick={() => setReviewOnly(!reviewOnly)}
        >
          Needs review ({calls.filter((c) => c.needsReview).length})
        </button>
      </div>
      <div className="daily-table-wrap">
        <table className="daily-table">
          <thead>
            <tr>
              <th className="col-metric">Lead</th>
              <th style={{ textAlign: 'left' }}>Date</th>
              <th style={{ textAlign: 'left' }}>Closer</th>
              <th>Duration</th>
              <th style={{ textAlign: 'left' }}>Stage</th>
              <th>Score</th>
              <th>Cash</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="clickable" onClick={() => onOpen(c)}>
                <td className="col-metric" style={{ fontWeight: 500, color: 'var(--ink-primary)' }}>{c.lead}</td>
                <td style={{ textAlign: 'left' }}>{c.date}</td>
                <td style={{ textAlign: 'left' }}>{c.closer}</td>
                <td>{c.duration}</td>
                <td style={{ textAlign: 'left' }}>{c.stage}</td>
                <td><ScorePill score={c.score} /></td>
                <td>{c.outcome ?? <span className="muted">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function InsightsTab() {
  const sections = [
    { title: 'Objections', rows: callInsights.objections, sub: (r) => `${r.handled} handled` },
    { title: 'Buying signals', rows: callInsights.buyingSignals },
    { title: 'Pain points', rows: callInsights.painPoints },
    { title: 'Aspirations', rows: callInsights.aspirations },
  ];
  return (
    <div className="insight-cols">
      {sections.map((s) => (
        <article className="card insight-list-card" key={s.title}>
          <div className="section-head" style={{ marginTop: 0, marginBottom: 6 }}>
            <h2 className="section-title">{s.title}</h2>
            <span className="section-sub">from {SCORED} scored calls</span>
          </div>
          {s.rows.map((r) => (
            <div className="insight-row" key={r.text}>
              <span className="insight-text">{r.text}</span>
              {s.sub && <span className="insight-sub">{s.sub(r)}</span>}
              <span className="insight-count">×{r.count}</span>
            </div>
          ))}
        </article>
      ))}
    </div>
  );
}

function ClosedDealsTab() {
  const closed = calls.filter((c) => c.stage === 'Closed won');
  return (
    <article className="card daily-card">
      <div className="daily-controls" style={{ borderTop: 'none' }}>
        <span className="section-sub">
          {closed.length} closed-won calls · Jun 1–6 · same basis as the Log tab (FR-C1)
        </span>
      </div>
      <div className="daily-table-wrap">
        <table className="daily-table">
          <thead>
            <tr>
              <th className="col-metric">Lead</th>
              <th style={{ textAlign: 'left' }}>Closer</th>
              <th>Score</th>
              <th>Duration</th>
              <th>Cash collected</th>
            </tr>
          </thead>
          <tbody>
            {closed.map((c) => (
              <tr key={c.id}>
                <td className="col-metric" style={{ fontWeight: 500, color: 'var(--ink-primary)' }}>{c.lead}</td>
                <td style={{ textAlign: 'left' }}>{c.closer}</td>
                <td><ScorePill score={c.score} /></td>
                <td>{c.duration}</td>
                <td>{c.outcome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

export default function CallsPage() {
  const [tab, setTab] = useState('Log');
  const [openCall, setOpenCall] = useState(null);

  return (
    <>
      <nav className="tabbar" aria-label="Calls tabs">
        {tabs.map((t) => (
          <button key={t} className={t === tab ? 'active' : ''} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </nav>

      <section className="kpi-row" aria-label="Call metrics" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {callKpis.map((k) => (
          <article className="card kpi-card today-card" key={k.label} title={k.tooltip}>
            <div className="kpi-label">
              {k.label}
              <Icon name="info" size={12} />
            </div>
            <div className="kpi-value" style={{ fontSize: 24 }}>{k.value}</div>
            <div className="kpi-context">
              <span className={`pill ${k.pill.tone}`}>
                <span className="dot" />
                {k.pill.text}
              </span>
              <span className="kpi-prev">{k.prev}</span>
            </div>
          </article>
        ))}
      </section>

      {tab === 'Log' && <LogTab onOpen={setOpenCall} />}
      {tab === 'Insights' && <InsightsTab />}
      {tab === 'Closed Deal Insights' && <ClosedDealsTab />}

      {openCall && <CallDetailPanel call={openCall} onClose={() => setOpenCall(null)} />}
    </>
  );
}
