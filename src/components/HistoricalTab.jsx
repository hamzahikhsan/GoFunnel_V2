import { useState } from 'react';
import { daily } from '../data/gofunnel.js';
import { weekly, monthly } from '../data/extras.js';
import { money, num, ratio } from '../lib/format.js';

// Historical (FR-A5): Daily / Weekly / Monthly with true Canceled counts
// (the v1 "Canceled = 100" rendered a percentage as a count) and section
// subtotals. ROAS derived in one place: cash ÷ spend, "—" when undefined.
const granularities = ['Daily', 'Weekly', 'Monthly'];

function Row({ r, label }) {
  const roas = r.spend > 0 ? r.cash / r.spend : null;
  return (
    <tr>
      <td className="col-metric" style={{ fontWeight: 500, color: 'var(--ink-primary)' }}>{label}</td>
      <td>{money(r.spend)}</td>
      <td>{num(r.leads)}</td>
      <td>{num(r.booked)}</td>
      <td>{num(r.canceled ?? 0)}</td>
      <td>{num(r.shown)}</td>
      <td>{num(r.closed)}</td>
      <td>{money(r.cash)}</td>
      <td className={roas != null && roas < 1 ? 'cf-negative' : roas != null && roas >= 2 ? 'cf-positive' : ''}>
        {roas != null ? ratio(roas) : '—'}
      </td>
    </tr>
  );
}

export default function HistoricalTab() {
  const [gran, setGran] = useState('Daily');

  const rows =
    gran === 'Daily'
      ? daily.map((d) => ({ ...d, canceled: 0, label: d.date }))
      : gran === 'Weekly'
        ? weekly.map((w) => ({ ...w, label: w.period }))
        : monthly.map((m) => ({ ...m, label: m.period }));

  const subtotal = rows.reduce(
          (t, r) => ({
            spend: t.spend + r.spend,
            leads: t.leads + r.leads,
            booked: t.booked + r.booked,
            canceled: t.canceled + (r.canceled ?? 0),
            shown: t.shown + r.shown,
            closed: t.closed + r.closed,
            cash: t.cash + r.cash,
          }),
    { spend: 0, leads: 0, booked: 0, canceled: 0, shown: 0, closed: 0, cash: 0 },
  );

  return (
    <article className="card daily-card" style={{ marginTop: 16 }}>
      <div className="daily-controls" style={{ borderTop: 'none' }}>
        <div className="segmented" role="group" aria-label="Granularity">
          {granularities.map((g) => (
            <button key={g} className={g === gran ? 'active' : ''} onClick={() => setGran(g)}>
              {g}
            </button>
          ))}
        </div>
        <span className="section-sub">Canceled shows true counts · axes chronological · single date axis</span>
      </div>
      <div className="daily-table-wrap">
        <table className="daily-table">
          <thead>
            <tr>
              <th className="col-metric">{gran === 'Daily' ? 'Date' : 'Period'}</th>
              <th>Spend</th>
              <th>Leads</th>
              <th>Booked</th>
              <th>Canceled</th>
              <th>Shown</th>
              <th>Closes</th>
              <th>Cash</th>
              <th>ROAS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <Row key={r.label} r={r} label={r.label} />
            ))}
            <tr className="total-row">
              <td className="col-metric">{gran === 'Daily' ? 'MTD subtotal' : 'Subtotal'}</td>
              <td>{money(subtotal.spend)}</td>
              <td>{num(subtotal.leads)}</td>
              <td>{num(subtotal.booked)}</td>
              <td>{num(subtotal.canceled)}</td>
              <td>{num(subtotal.shown)}</td>
              <td>{num(subtotal.closed)}</td>
              <td>{money(subtotal.cash)}</td>
              <td>{ratio(subtotal.cash / subtotal.spend)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="daily-controls">
        <span className="section-sub">
          KPI “vs prev” on the Overview compares the same-length window (May 26–31), so weekly/monthly rows here won't match those deltas — by design, not by bug.
        </span>
      </div>
    </article>
  );
}
