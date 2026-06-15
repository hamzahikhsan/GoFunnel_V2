import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import Icon from './Icon.jsx';
import { kpis, daily, cumulative } from '../data/gofunnel.js';
import { money, num, ratio } from '../lib/format.js';

// Pills carry goal status (the only place semantic color is allowed);
// "vs prev" stays plain tertiary text — secondary context per FR-G4.
const cards = [
  {
    label: 'Ad Spend',
    value: money(kpis.adSpend.value),
    pill: { tone: 'neutral', text: 'No goal set' },
    prev: `vs ${money(kpis.adSpend.prev)} prev`,
    spark: daily.map((d) => ({ v: d.spend })),
    tooltip: `Total Meta ad spend for Jun 1–6. Previous period: ${money(kpis.adSpend.prev)}. No goal set for this metric.`,
  },
  {
    label: 'Calls Booked',
    value: num(kpis.callsBooked.value),
    pill: { tone: 'warning', text: '76% of goal' },
    // Absolute change, not "+850%" — comparison base (2) is below 10 (FR-G2)
    prev: `${kpis.callsBooked.deltaDisplay} vs prev (2)`,
    spark: daily.map((d) => ({ v: d.booked })),
    tooltip: `Calls booked attributed to Meta ads. Goal: 25 this month (currently 19 = 76%). Change shown as +17 calls because the previous-period base (2) is too small for a meaningful percentage.`,
  },
  {
    label: 'Cost per Call',
    value: money(kpis.costPerCall.value),
    pill: { tone: 'warning', text: '6% over goal' },
    prev: `vs ${money(kpis.costPerCall.prev)} prev`,
    spark: cumulative.map((d) => ({ v: d.costPerCall })),
    tooltip: `Ad Spend ÷ Calls Booked = ${money(kpis.adSpend.value)} ÷ 19 = ${money(kpis.costPerCall.value)}. Lower is better. Goal: ≤ ${money(kpis.costPerCall.goal)}.`,
  },
  {
    label: 'Cash Collected',
    value: money(kpis.cashCollected.value),
    pill: { tone: 'negative', text: '62% of goal' },
    prev: `vs ${money(kpis.cashCollected.prev)} prev`,
    spark: daily.map((d) => ({ v: d.cash })),
    tooltip: `Total cash collected from Meta-attributed deals. Goal: ${money(kpis.cashCollected.goal, { compact: true })} this month (currently ${money(kpis.cashCollected.value)} = 62%).`,
  },
  {
    label: 'ROAS',
    value: ratio(kpis.roas.value),
    pill: { tone: 'negative', text: 'Below 2.0x goal' },
    prev: `vs ${ratio(kpis.roas.prev)} prev`,
    spark: cumulative.map((d) => ({ v: d.spend > 0 ? d.cash / d.spend : null })),
    tooltip: `Cash Collected ÷ Ad Spend = ${money(kpis.cashCollected.value)} ÷ ${money(kpis.adSpend.value)} = ${ratio(kpis.roas.value)}. Goal: 2.0x. Single calculation — matches the daily table.`,
  },
];

function Sparkline({ data }) {
  return (
    <div className="kpi-spark">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
          <Area
            type="monotone"
            dataKey="v"
            stroke="var(--accent)"
            strokeWidth={1.5}
            fill="var(--accent)"
            fillOpacity={0.06}
            isAnimationActive={false}
            dot={false}
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function KpiRow() {
  return (
    <section className="kpi-row" aria-label="Key metrics">
      {cards.map((c) => (
        <article className="card kpi-card" key={c.label} title={c.tooltip}>
          <div className="kpi-label">
            {c.label}
            <Icon name="info" size={12} />
          </div>
          <div className="kpi-value">{c.value}</div>
          <div className="kpi-context">
            <span className={`pill ${c.pill.tone}`}>
              <span className="dot" />
              {c.pill.text}
            </span>
            <span className="kpi-prev">{c.prev}</span>
          </div>
          <Sparkline data={c.spark} />
        </article>
      ))}
    </section>
  );
}
