import { useState } from 'react';
import Icon from './Icon.jsx';
import { daily, kpis, PERIOD, totals } from '../data/gofunnel.js';
import { EM_DASH, money, num, pct, ratio } from '../lib/format.js';

const pctDelta = (cur, prev) => `${cur >= prev ? '+' : '−'}${(Math.abs(cur - prev) / prev * 100).toFixed(1)}%`;

// Period Δ vs previous period. Only metrics with previous-period data get a
// number; the rest render "—" (never "↑0%"). Calls Booked uses absolute
// change because the base (2) is below 10 (FR-G2).
const deltas = {
  spend: { text: pctDelta(kpis.adSpend.value, kpis.adSpend.prev), tooltip: `vs ${money(kpis.adSpend.prev)} previous period` },
  booked: { text: kpis.callsBooked.deltaDisplay, tooltip: 'vs 2 previous period — absolute change shown (base < 10)' },
  cash: { text: pctDelta(kpis.cashCollected.value, kpis.cashCollected.prev), tooltip: `vs ${money(kpis.cashCollected.prev)} previous period` },
  costPerCall: { text: pctDelta(kpis.costPerCall.value, kpis.costPerCall.prev), tooltip: `vs ${money(kpis.costPerCall.prev)} previous period · lower is better` },
  roas: { text: `+${(kpis.roas.value - kpis.roas.prev).toFixed(2)}x`, tooltip: `vs ${ratio(kpis.roas.prev)} previous period` },
};

const noDelta = { text: EM_DASH, tooltip: 'No comparison data for previous period' };

const dCostPerCall = (d) => (d.booked > 0 ? d.spend / d.booked : null);
const dCpl = (d) => (d.leads > 0 ? d.spend / d.leads : null);

// MTD column values are derived from the same daily series the cells use —
// the table can never disagree with itself or the KPI row.
const groups = [
  {
    name: 'Platform',
    rows: [
      { label: 'Ad Spend', cell: (d) => money(d.spend), total: money(totals.spend), delta: deltas.spend },
      { label: 'Impressions', cell: (d) => num(d.impressions), total: num(totals.impressions), delta: noDelta },
      { label: 'Clicks', cell: (d) => num(d.clicks), total: num(totals.clicks), delta: noDelta },
      { label: 'CPM', cell: (d) => money(d.cpm), total: money((totals.spend / totals.impressions) * 1000), delta: noDelta },
      { label: 'CPC', cell: (d) => money(d.cpc), total: money(totals.spend / totals.clicks), delta: noDelta },
      { label: 'Outbound CTR', cell: (d) => pct(d.ctr), total: pct((totals.clicks / totals.impressions) * 100), delta: noDelta },
    ],
  },
  {
    name: 'Conversion',
    rows: [
      { label: 'Leads', cell: (d) => num(d.leads), total: num(totals.leads), delta: noDelta },
      { label: 'Calls Booked', cell: (d) => num(d.booked), total: num(totals.booked), delta: deltas.booked },
      { label: 'Meetings Shown', cell: (d) => num(d.shown), total: num(totals.shown), delta: noDelta },
      { label: 'Deals Closed', cell: (d) => num(d.closed), total: num(totals.closed), delta: noDelta },
      { label: 'Cash Collected', cell: (d) => money(d.cash), total: money(totals.cash), delta: deltas.cash },
    ],
  },
  {
    name: 'Efficiency',
    rows: [
      {
        label: 'Cost per Call',
        cell: (d) => money(dCostPerCall(d)),
        total: money(totals.spend / totals.booked),
        cf: (d) => {
          const v = dCostPerCall(d);
          return v != null && v > kpis.costPerCall.goal ? 'cf-warning' : '';
        },
        delta: deltas.costPerCall,
      },
      { label: 'CPL', cell: (d) => money(dCpl(d)), total: money(totals.spend / totals.leads), delta: noDelta },
      {
        label: 'ROAS',
        cell: (d) => ratio(d.roas),
        total: ratio(totals.cash / totals.spend),
        cf: (d) => {
          if (d.roas == null) return '';
          if (d.roas >= kpis.roas.goal) return 'cf-positive';
          if (d.roas < 1) return 'cf-negative';
          return '';
        },
        delta: deltas.roas,
      },
    ],
  },
];

const presets = ['All', 'Platform', 'Conversion', 'Efficiency'];

export default function DailyTable() {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState('All');
  const [compare, setCompare] = useState(false);

  const visible = preset === 'All' ? groups : groups.filter((g) => g.name === preset);
  const colCount = daily.length + 2 + (compare ? 1 : 0);

  return (
    <section className="card daily-card" aria-label="Daily breakdown">
      <button className={`daily-toggle${open ? ' open' : ''}`} onClick={() => setOpen(!open)} aria-expanded={open}>
        <Icon name="chevronDown" size={14} />
        {open ? 'Hide daily breakdown' : 'Show daily breakdown'}
        <span className="daily-summary">
          {PERIOD.days} days · {PERIOD.range.replace(', 2026', '')}
        </span>
      </button>

      {open && (
        <>
          <div className="daily-controls">
            <div className="segmented" role="group" aria-label="Column groups">
              {presets.map((p) => (
                <button key={p} className={p === preset ? 'active' : ''} onClick={() => setPreset(p)}>
                  {p}
                </button>
              ))}
            </div>
            <button
              className={`compare-toggle${compare ? ' active' : ''}`}
              onClick={() => setCompare(!compare)}
              title="Adds a Δ column vs the previous 6-day period — not a second set of date columns"
            >
              Compare <Icon name="chevronDown" size={12} />
            </button>
          </div>

          <div className="daily-table-wrap">
            <table className="daily-table">
              <thead>
                <tr>
                  <th className="col-metric sticky-col">Metric</th>
                  <th className="col-total" title="Period total — same calculation as the KPI row">MTD</th>
                  {daily.map((d) => (
                    <th key={d.date}>{d.date}</th>
                  ))}
                  {compare && <th className="col-delta" title="Period total vs previous 6-day period">Δ vs prev</th>}
                </tr>
              </thead>
              <tbody>
                {visible.map((group) => (
                  <GroupRows key={group.name} group={group} compare={compare} colCount={colCount} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

function GroupRows({ group, compare, colCount }) {
  return (
    <>
      <tr className="group-row">
        <td className="sticky-col" colSpan={1}>{group.name}</td>
        <td colSpan={colCount - 1} />
      </tr>
      {group.rows.map((row) => (
        <tr key={row.label}>
          <td className="col-metric sticky-col">{row.label}</td>
          <td className="col-total">{row.total}</td>
          {daily.map((d) => {
            const text = row.cell(d);
            const cls = row.cf ? row.cf(d) : '';
            return (
              <td key={d.date} className={cls}>
                {text === EM_DASH ? <span className="muted" title="No data">{text}</span> : text}
              </td>
            );
          })}
          {compare && (
            <td className="col-delta" title={row.delta.tooltip}>
              {row.delta.text === EM_DASH ? <span className="muted">{EM_DASH}</span> : row.delta.text}
            </td>
          )}
        </tr>
      ))}
    </>
  );
}
