import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cumulative, daily, efficiency, kpis, roasInsight } from '../data/gofunnel.js';
import { money, ratio } from '../lib/format.js';

const axisTick = { fontSize: 11, fill: 'var(--ink-tertiary)', fontFamily: 'Inter' };

function ChartTooltip({ active, payload, label, format }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="tt-date">{label}</div>
      {payload.map((p) => (
        <div className="tt-row" key={p.name}>
          <span>{p.name}</span>
          <b>{format(p.value)}</b>
        </div>
      ))}
    </div>
  );
}

// Helios insight chip anchored to an anomaly point (FR-G5)
function InsightChip({ viewBox }) {
  const { x, y } = viewBox;
  return (
    <foreignObject x={x - 8} y={y - 34} width={150} height={26} style={{ overflow: 'visible' }}>
      <span
        title={roasInsight.text}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          background: 'var(--accent-soft)',
          color: 'var(--accent)',
          border: '1px solid var(--accent-ghost)',
          borderRadius: 6,
          padding: '2px 7px',
          fontSize: 11,
          fontWeight: 550,
          whiteSpace: 'nowrap',
          cursor: 'help',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {ratio(roasInsight.value)} · Best day
      </span>
    </foreignObject>
  );
}

function Frame({ title, headline, legend, note, children }) {
  return (
    <article className="card chart-card">
      <header className="chart-header">
        <div className="chart-title">{title}</div>
        <div className="chart-headline">{headline}</div>
        {legend && (
          <div className="chart-legend">
            {legend.map((l) => (
              <span key={l.name}>
                <span className="swatch" style={{ background: l.color }} />
                {l.name}
              </span>
            ))}
          </div>
        )}
      </header>
      <div style={{ height: 170 }}>{children}</div>
      {note && <div className="chart-note">{note}</div>}
    </article>
  );
}

const grid = (
  <CartesianGrid stroke="var(--gridline)" vertical={false} strokeDasharray="0" />
);

function RoasChart() {
  return (
    <Frame
      title="ROAS Trend"
      headline={
        <>
          <span className="hv">{ratio(kpis.roas.value)}</span>
          <span>MTD · goal 2.0x</span>
        </>
      }
      note="Daily ROAS · gap = no data yet"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={daily} margin={{ top: 28, right: 20, bottom: 0, left: -18 }}>
          {grid}
          <XAxis dataKey="date" tick={axisTick} axisLine={false} tickLine={false} dy={4} />
          <YAxis
            tick={axisTick}
            axisLine={false}
            tickLine={false}
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
            tickFormatter={(v) => `${v}x`}
          />
          <Tooltip content={<ChartTooltip format={(v) => ratio(v)} />} cursor={{ stroke: 'var(--border-strong)' }} />
          <ReferenceLine
            y={kpis.roas.goal}
            stroke="var(--ink-tertiary)"
            strokeDasharray="4 4"
            label={{ value: 'Goal 2.0x', position: 'insideTopRight', fontSize: 10, fill: 'var(--ink-tertiary)' }}
          />
          <Line
            type="monotone"
            dataKey="roas"
            name="ROAS"
            stroke="var(--accent)"
            strokeWidth={1.8}
            dot={{ r: 2.5, fill: 'var(--accent)', strokeWidth: 0 }}
            isAnimationActive={false}
          />
          <ReferenceDot
            x={roasInsight.date}
            y={roasInsight.value}
            r={4}
            fill="var(--accent)"
            stroke="var(--surface-card)"
            strokeWidth={2}
            label={<InsightChip />}
          />
        </LineChart>
      </ResponsiveContainer>
    </Frame>
  );
}

function PairChart({ title, headline, lines, format, note }) {
  return (
    <Frame
      title={title}
      headline={headline}
      legend={lines.map((l) => ({ name: l.name, color: l.color }))}
      note={note}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={cumulative} margin={{ top: 12, right: 20, bottom: 0, left: -8 }}>
          {grid}
          <XAxis dataKey="date" tick={axisTick} axisLine={false} tickLine={false} dy={4} />
          <YAxis
            tick={axisTick}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : Math.round(v)}`}
          />
          <Tooltip content={<ChartTooltip format={format} />} cursor={{ stroke: 'var(--border-strong)' }} />
          {lines.map((l) => (
            <Line
              key={l.key}
              type="monotone"
              dataKey={l.key}
              name={l.name}
              stroke={l.color}
              strokeWidth={1.8}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Frame>
  );
}

export default function ChartRow() {
  return (
    <section className="chart-row" aria-label="Trend charts">
      <RoasChart />
      <PairChart
        title="Cost/Call vs CC/Call"
        headline={
          <>
            <span className="hv">{money(efficiency.ccPerCall)}</span>
            <span>CC/Call vs {money(efficiency.costPerCall)} Cost/Call</span>
            <span className="hv-margin">· Margin {ratio(efficiency.callMargin)}</span>
          </>
        }
        lines={[
          { key: 'ccPerCall', name: 'CC/Call', color: 'var(--accent)' },
          { key: 'costPerCall', name: 'Cost/Call', color: 'var(--series-4)' },
        ]}
        format={(v) => money(v)}
        note="Cumulative MTD — endpoints match headline values"
      />
      <PairChart
        title="AOV vs CAC"
        headline={
          <>
            <span className="hv">{money(efficiency.aov)}</span>
            <span>AOV vs {money(efficiency.cac)} CAC</span>
            <span className="hv-margin">· {ratio(efficiency.aovMargin)}</span>
          </>
        }
        lines={[
          { key: 'aov', name: 'AOV', color: 'var(--accent)' },
          { key: 'cac', name: 'CAC', color: 'var(--series-4)' },
        ]}
        format={(v) => money(v)}
        note="Cumulative MTD — starts at first close (Jun 2)"
      />
    </section>
  );
}
