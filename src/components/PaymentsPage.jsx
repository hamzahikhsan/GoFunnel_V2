import { useState } from 'react';
import Icon from './Icon.jsx';
import { payments, paymentsTotal, orphanedPayments, orphanedTotal, ltv } from '../data/modules.js';
import { cohorts, subscriptionStatus } from '../data/extras.js';
import { money } from '../lib/format.js';

// Real CSV download (FR-G7) — generated from the same data the table shows
function exportCsv() {
  const header = 'date,customer,product,source,amount,status\n';
  const rows = payments
    .map((p) => [p.date, p.customer, `"${p.product}"`, p.source, p.amount.toFixed(2), p.status].join(','))
    .join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'payments-jun-1-6-2026.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

// Payments (PRD §5.6). The MTD log sums to the exact cash figure on the
// Meta Overview KPI row ($7,497.00) — single source across pages (NFR-2).
const tabs = ['Logs', 'Orphaned', 'Cohorts', 'LTV & Churn'];

function LogsTab({ onNavigate }) {
  const attributedCount = payments.filter((p) => p.attributed).length;
  const unknownCount = payments.length - attributedCount;
  return (
    <article className="card daily-card">
      <div className="daily-controls" style={{ borderTop: 'none' }}>
        <span className="section-sub">
          {payments.length} payments · Jun 1–6 · total {money(paymentsTotal)} — the same cash figure as the Overview KPI · {attributedCount} attributed, {unknownCount} source unknown
        </span>
        <button className="compare-toggle" onClick={exportCsv}>Export CSV</button>
      </div>
      <div className="daily-table-wrap">
        <table className="daily-table">
          <thead>
            <tr>
              <th className="col-metric">Date</th>
              <th style={{ textAlign: 'left' }}>Customer</th>
              <th style={{ textAlign: 'left' }}>Product</th>
              <th style={{ textAlign: 'left' }}>Source</th>
              <th>Amount</th>
              <th style={{ textAlign: 'left' }}>Attribution</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.customer + p.amount}>
                <td className="col-metric">{p.date}</td>
                <td style={{ textAlign: 'left', fontWeight: 500, color: 'var(--ink-primary)' }}>{p.customer}</td>
                <td style={{ textAlign: 'left' }}>{p.product}</td>
                <td style={{ textAlign: 'left' }}>{p.source}</td>
                <td>{money(p.amount)}</td>
                <td style={{ textAlign: 'left' }}>
                  {p.attributed ? (
                    <span className="pill positive"><span className="dot" />Attributed</span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span className="pill neutral" title="Cash received, campaign source still unknown — resolve in Attribution Inbox">
                        <span className="dot" />Source unknown
                      </span>
                      <button
                        onClick={() => onNavigate('Attribution Inbox')}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--accent)', fontSize: 12, fontWeight: 500 }}
                      >
                        Resolve →
                      </button>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function OrphanedTab({ onNavigate }) {
  const preview = orphanedPayments.slice(0, 6);
  return (
    <>
      <article className="card" style={{ padding: '18px 24px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div>
          <div className="kpi-label">Orphaned total value</div>
          <div className="kpi-value" style={{ fontSize: 24 }}>{money(orphanedTotal)}</div>
          <span className="kpi-prev">{orphanedPayments.length} payments with no linked lead — 8.4× the attributed cash</span>
        </div>
        <button className="btn-primary" style={{ marginLeft: 'auto' }} onClick={() => onNavigate('Attribution Inbox')}>
          Resolve in Attribution Inbox
        </button>
      </article>
      <article className="card daily-card">
        <div className="daily-table-wrap" style={{ borderTop: 'none' }}>
          <table className="daily-table">
            <thead>
              <tr>
                <th className="col-metric">Date</th>
                <th style={{ textAlign: 'left' }}>Payer</th>
                <th style={{ textAlign: 'left' }}>Product</th>
                <th>Amount</th>
                <th style={{ textAlign: 'left' }}>Suggested match</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((p) => (
                <tr key={p.id}>
                  <td className="col-metric">{p.date}</td>
                  <td style={{ textAlign: 'left' }}>{p.payer}</td>
                  <td style={{ textAlign: 'left' }}>{p.product}</td>
                  <td>{money(p.amount)}</td>
                  <td style={{ textAlign: 'left' }}>
                    {p.match ? (
                      <span className={`pill ${p.match.confidence >= 85 ? 'positive' : 'neutral'}`}>
                        <span className="dot" />
                        {p.match.name} · {p.match.confidence}%
                      </span>
                    ) : (
                      <span className="muted">No confident match</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="daily-controls">
          <span className="section-sub">Showing 6 of {orphanedPayments.length} — the full queue with evidence panels lives in the Attribution Inbox</span>
        </div>
      </article>
    </>
  );
}

function CohortsTab({ onNavigate }) {
  return (
    <article className="card daily-card">
      <div className="daily-controls" style={{ borderTop: 'none' }}>
        <span className="section-sub">
          Repeat-payment retention by first-payment month · attributed payments only — empty cells are future months, not missing data
        </span>
        <button className="compare-toggle" onClick={() => onNavigate('Attribution Inbox')}>
          18 excluded payments → Inbox
        </button>
      </div>
      <div className="daily-table-wrap">
        <table className="daily-table">
          <thead>
            <tr>
              <th className="col-metric">Cohort</th>
              <th>Customers</th>
              <th>Month 0</th>
              <th>Month 1</th>
              <th>Month 2</th>
            </tr>
          </thead>
          <tbody>
            {cohorts.map((c) => (
              <tr key={c.cohort}>
                <td className="col-metric" style={{ fontWeight: 500, color: 'var(--ink-primary)' }}>{c.cohort}</td>
                <td>{c.customers}</td>
                <td>{c.m0}</td>
                <td>{c.m1 ?? <span className="muted" title="This cohort hasn't reached Month 1 yet">—</span>}</td>
                <td>{c.m2 ?? <span className="muted" title="This cohort hasn't reached this month yet">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="daily-controls">
        <span className="section-sub">
          18 unattributed payments (~$129.9K) are excluded — resolving them in the Attribution Inbox recomputes these cohorts retroactively (FR-AI4).
        </span>
      </div>
    </article>
  );
}

function LtvTab() {
  const max = Math.max(...ltv.distribution.map((d) => d.count));
  return (
    <div className="cc-grid">
      <article className="card" style={{ padding: '20px 24px' }}>
        <div className="section-head" style={{ marginTop: 0 }}>
          <h2 className="section-title">LTV distribution</h2>
          <span className="section-sub">{ltv.payingCustomers} paying customers, all time</span>
        </div>
        {ltv.distribution.map((d) => (
          <div className="dist-row" key={d.band}>
            <span className="dist-label">{d.band}</span>
            <span className="dist-track">
              <span className="dist-fill" style={{ width: `${(d.count / max) * 100}%` }} />
            </span>
            <span className="dist-count">{d.count}</span>
          </div>
        ))}
      </article>
      <article className="card" style={{ padding: '20px 24px' }}>
        <div className="section-head" style={{ marginTop: 0 }}>
          <h2 className="section-title">Subscription health</h2>
          <span className="section-sub">judgments from Goals thresholds</span>
        </div>
        {[
          { label: 'Average LTV', value: ltv.avgLtv, pill: null },
          { label: 'MRR', value: ltv.mrr, pill: null },
          { label: '90-day churn', value: ltv.churn90d.value, pill: { tone: ltv.churn90d.judgment, text: ltv.churn90d.label } },
        ].map((m) => (
          <div className="attention-item" key={m.label} style={{ cursor: 'default', alignItems: 'center' }}>
            <span>
              <span className="attention-detail">{m.label}</span>
              <br />
              <span className="attention-title" style={{ fontSize: 18, fontVariantNumeric: 'tabular-nums' }}>{m.value}</span>
            </span>
            {m.pill && (
              <span className={`pill ${m.pill.tone}`} style={{ marginLeft: 'auto' }}>
                <span className="dot" />
                {m.pill.text}
              </span>
            )}
          </div>
        ))}
        <div className="panel-section">
          <div className="panel-section-title">Status breakdown — {ltv.payingCustomers} customers</div>
          {subscriptionStatus.map((s) => (
            <div className="dist-row" key={s.label}>
              <span className="dist-label">{s.label}</span>
              <span className="dist-track">
                <span
                  className="dist-fill"
                  style={{
                    width: `${(s.count / ltv.payingCustomers) * 100}%`,
                    background: s.tone === 'positive' ? 'var(--series-2)' : s.tone === 'warning' ? 'var(--warning)' : 'var(--series-5)',
                  }}
                />
              </span>
              <span className="dist-count">{s.count}</span>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

export default function PaymentsPage({ onNavigate }) {
  const [tab, setTab] = useState('Logs');
  return (
    <>
      <nav className="tabbar" aria-label="Payments tabs">
        {tabs.map((t) => (
          <button key={t} className={t === tab ? 'active' : ''} onClick={() => setTab(t)}>
            {t}
            {t === 'Orphaned' && (
              <span className="nav-badge" style={{ marginLeft: 6 }}>{orphanedPayments.length}</span>
            )}
          </button>
        ))}
      </nav>
      {tab === 'Logs' && <LogsTab onNavigate={onNavigate} />}
      {tab === 'Orphaned' && <OrphanedTab onNavigate={onNavigate} />}
      {tab === 'Cohorts' && <CohortsTab onNavigate={onNavigate} />}
      {tab === 'LTV & Churn' && <LtvTab />}
      <p className="chart-note" style={{ marginTop: 8 }}>
        <Icon name="info" size={11} /> All payment charts use chronologically sorted axes and one locale (FR-P5, FR-G2).
      </p>
    </>
  );
}
