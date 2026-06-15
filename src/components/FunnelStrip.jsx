import Icon from './Icon.jsx';
import { funnel } from '../data/gofunnel.js';
import { money, num } from '../lib/format.js';

// Stage widths decay visually; values & rates come straight from §4.3.
// Clicks→Leads has no rate in the source data, so none is invented.
const stages = [
  { label: 'Clicks', value: num(funnel.clicks), width: 100 },
  { label: 'Leads', value: num(funnel.leads), width: 86, rate: null },
  { label: 'Booked', value: num(funnel.booked), width: 72, rate: { value: funnel.rates.leadToBook, label: 'Lead → Book' } },
  { label: 'Shown', value: num(funnel.shown), width: 56, rate: { value: funnel.rates.showRate, label: 'Show rate' } },
  { label: 'Closed', value: num(funnel.closed), width: 38, rate: { value: funnel.rates.showToClose, label: 'Show → Close' } },
  { label: 'Cash', value: money(funnel.cash), width: 24, rate: null },
];

export default function FunnelStrip() {
  return (
    <section className="card funnel-card" aria-label="Funnel">
      <div className="funnel-header">
        <span className="funnel-title">Funnel · Meta-attributed</span>
        <span
          className="funnel-summary"
          title={`Closes ÷ Calls Booked = 4 ÷ 19 = ${funnel.rates.bookToClose}. Same cohort: bookings made Jun 1–6.`}
        >
          Book → Close {funnel.rates.bookToClose}
        </span>
      </div>
      <div className="funnel-strip">
        {stages.map((s, i) => (
          <FunnelSegment key={s.label} stage={s} isFirst={i === 0} />
        ))}
      </div>
    </section>
  );
}

function FunnelSegment({ stage, isFirst }) {
  return (
    <>
      {!isFirst && (
        <div className="funnel-arrow">
          {stage.rate ? (
            <>
              <span className="funnel-rate">{stage.rate.value}</span>
              <span className="funnel-rate-label">{stage.rate.label}</span>
            </>
          ) : (
            <Icon name="arrowRight" size={14} />
          )}
        </div>
      )}
      <div className="funnel-stage">
        <div className="funnel-stage-label">{stage.label}</div>
        <div className="funnel-stage-value">{stage.value}</div>
        <div className="funnel-stage-bar" style={{ width: `${stage.width}%`, opacity: 0.35 + (stage.width / 100) * 0.65 }} />
      </div>
    </>
  );
}
