import { useState } from 'react';
import { segments } from '../data/extras.js';
import { totals } from '../data/gofunnel.js';
import { money, num, ratio, pct } from '../lib/format.js';

// Segmented Insights (FR-A4): humanized labels ("Women 18–24", never
// "female:18-24"), best/worst summary computed from the same rows the
// table shows, every dimension summing to the MTD totals.
const dims = Object.keys(segments);

export default function SegmentsTab() {
  const [dim, setDim] = useState('Gender');
  const rows = segments[dim];

  // Best/worst by ROAS among segments with meaningful spend (≥5% of total)
  const eligible = rows.filter((r) => r.spend >= totals.spend * 0.05);
  const byRoas = [...eligible].sort((a, b) => b.cash / b.spend - a.cash / a.spend);
  const best = byRoas[0];
  const worst = byRoas[byRoas.length - 1];

  return (
    <>
      <div className="cc-grid" style={{ marginTop: 16, gridTemplateColumns: '1fr 1fr' }}>
        <article className="card" style={{ padding: '16px 20px' }} title="Highest ROAS among segments with ≥5% of spend — small bases excluded to avoid misleading winners (FR-G2)">
          <div className="kpi-label">Best segment — {dim}</div>
          <div className="kpi-value" style={{ fontSize: 20 }}>{best.label}</div>
          <span className="kpi-prev">
            {ratio(best.cash / best.spend)} ROAS on {money(best.spend)} spend
          </span>
        </article>
        <article className="card" style={{ padding: '16px 20px' }} title="Lowest ROAS among segments with ≥5% of spend">
          <div className="kpi-label">Needs review — {dim}</div>
          <div className="kpi-value" style={{ fontSize: 20 }}>{worst.label}</div>
          <span className="kpi-prev">
            {ratio(worst.cash / worst.spend)} ROAS on {money(worst.spend)} spend
          </span>
        </article>
      </div>

      <article className="card daily-card">
        <div className="daily-controls" style={{ borderTop: 'none' }}>
          <div className="segmented" role="group" aria-label="Dimension">
            {dims.map((d) => (
              <button key={d} className={d === dim ? 'active' : ''} onClick={() => setDim(d)}>
                {d}
              </button>
            ))}
          </div>
          <span className="section-sub">Every dimension sums to the Overview totals — one pie, sliced</span>
        </div>
        <div className="daily-table-wrap">
          <table className="daily-table">
            <thead>
              <tr>
                <th className="col-metric">{dim}</th>
                <th>Spend</th>
                <th>Share</th>
                <th>Leads</th>
                <th>Booked</th>
                <th>Cash</th>
                <th>ROAS</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <td className="col-metric" style={{ fontWeight: 500, color: 'var(--ink-primary)' }}>{r.label}</td>
                  <td>{money(r.spend)}</td>
                  <td>{pct((r.spend / totals.spend) * 100, 0)}</td>
                  <td>{num(r.leads)}</td>
                  <td>{num(r.booked)}</td>
                  <td>{money(r.cash)}</td>
                  <td className={r.cash / r.spend < 1 ? 'cf-negative' : r.cash / r.spend >= 2 ? 'cf-positive' : ''}>
                    {ratio(r.cash / r.spend)}
                  </td>
                </tr>
              ))}
              <tr className="total-row">
                <td className="col-metric">All {dim.toLowerCase()}</td>
                <td>{money(totals.spend)}</td>
                <td>100%</td>
                <td>{num(totals.leads)}</td>
                <td>{num(totals.booked)}</td>
                <td>{money(totals.cash)}</td>
                <td>{ratio(totals.cash / totals.spend)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </>
  );
}
