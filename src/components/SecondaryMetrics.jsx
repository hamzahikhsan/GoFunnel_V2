import { secondary } from '../data/gofunnel.js';
import { money, num, pct } from '../lib/format.js';

const rows = [
  {
    group: 'Reach',
    metrics: [
      { label: 'Impressions', value: num(secondary.reach.impressions), tooltip: 'Total times ads were shown.' },
      { label: 'Reach', value: num(secondary.reach.reach), tooltip: 'Unique people who saw an ad.' },
      { label: 'Frequency', value: secondary.reach.frequency.toFixed(2), tooltip: 'Impressions ÷ Reach — avg views per person.' },
      { label: 'Clicks', value: num(secondary.reach.clicks), tooltip: 'Total outbound clicks.' },
    ],
  },
  {
    group: 'Acquisition',
    metrics: [
      { label: 'CPM', value: money(secondary.acquisition.cpm), tooltip: 'Ad Spend ÷ Impressions × 1,000.' },
      { label: 'Outbound CTR', value: pct(secondary.acquisition.outboundCtr), tooltip: 'Outbound Clicks ÷ Impressions.' },
      { label: 'CPC', value: money(secondary.acquisition.cpc), tooltip: 'Ad Spend ÷ Clicks.' },
      { label: 'CPL', value: money(secondary.acquisition.cpl), tooltip: 'Ad Spend ÷ Leads = $6,049.95 ÷ 22.' },
    ],
  },
];

export default function SecondaryMetrics() {
  return (
    <section className="card secondary-card" aria-label="Platform metrics">
      {rows.map((row) => (
        <div className="secondary-row" key={row.group}>
          <span className="secondary-group-label">{row.group}</span>
          {row.metrics.map((m) => (
            <div className="secondary-metric" key={m.label} title={m.tooltip}>
              <div className="m-label">{m.label}</div>
              <div className="m-value">{m.value}</div>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
