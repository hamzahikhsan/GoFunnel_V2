import { useState } from 'react';
import { campaigns, creatives } from '../data/modules.js';
import { money, num, ratio } from '../lib/format.js';
import { totals } from '../data/gofunnel.js';

// Ads Manager (FR-A1–A2). Campaign rows sum exactly to the Overview MTD
// totals; the Unattributed row is styled distinctly and links to the
// Attribution Inbox instead of pretending to be a campaign.
const levels = ['Campaigns', 'Ad sets', 'Ads'];

function CampaignPanel({ campaign, onClose }) {
  const cr = creatives.find((c) => c.campaign === campaign.name);
  return (
    <>
      <div className="panel-overlay" onClick={onClose} />
      <aside className="side-panel" aria-label="Campaign detail">
        <div className="side-panel-head">
          <div>
            <h2 className="side-panel-title">{campaign.name}</h2>
            <p className="side-panel-sub">{campaign.status} · Jun 1–6 · drill-in instead of horizontal scroll (FR-A1)</p>
          </div>
          <button className="side-panel-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="panel-section">
          <div className="panel-section-title">Performance</div>
          {[
            ['Spend', money(campaign.spend)],
            ['Leads', num(campaign.leads)],
            ['Calls booked', num(campaign.booked)],
            ['Closes', num(campaign.closed)],
            ['Cash collected', money(campaign.cash)],
            ['ROAS', campaign.spend > 0 ? ratio(campaign.cash / campaign.spend) : '—'],
          ].map(([label, value]) => (
            <div className="transcript-item" key={label}>
              <span className="transcript-t" style={{ width: 110 }}>{label}</span>
              <span className="transcript-text" style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--ink-primary)', fontWeight: 500 }}>{value}</span>
            </div>
          ))}
        </div>

        {cr && (
          <div className="panel-section">
            <div className="panel-section-title">Top creative</div>
            <p style={{ fontSize: 12.5, margin: '0 0 4px', fontWeight: 550, color: 'var(--ink-primary)' }}>{cr.name}</p>
            <p style={{ fontSize: 12.5, margin: 0, lineHeight: 1.6 }}>{cr.note}</p>
          </div>
        )}

        {campaign.closed > 0 && (
          <div className="panel-section">
            <div className="panel-section-title">Linked deals</div>
            <p style={{ fontSize: 12.5, margin: 0, lineHeight: 1.6 }}>
              {campaign.closed} closed deal{campaign.closed > 1 ? 's' : ''} totaling {money(campaign.cash)} —
              attributed end-to-end from ad click to payment.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

export default function AdsManager({ onNavigate }) {
  const [level, setLevel] = useState('Campaigns');
  const [open, setOpen] = useState(null);

  return (
    <>
      <article className="card daily-card" style={{ marginTop: 16 }}>
        <div className="daily-controls" style={{ borderTop: 'none' }}>
          <div className="segmented" role="group" aria-label="Level">
            {levels.map((l) => (
              <button key={l} className={l === level ? 'active' : ''} onClick={() => setLevel(l)}>
                {l}
              </button>
            ))}
          </div>
          <span className="section-sub">Row click opens a drill-in panel · totals reconcile with the Overview</span>
        </div>

        {level === 'Campaigns' ? (
          <div className="daily-table-wrap">
            <table className="daily-table">
              <thead>
                <tr>
                  <th className="col-metric">Campaign</th>
                  <th>Spend</th>
                  <th>Leads</th>
                  <th>Booked</th>
                  <th>Closes</th>
                  <th>Cash</th>
                  <th>ROAS</th>
                  <th style={{ textAlign: 'left' }}>Signal</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr
                    key={c.name}
                    className={c.unattributed ? 'row-unattributed' : 'clickable'}
                    onClick={c.unattributed ? undefined : () => setOpen(c)}
                  >
                    <td className="col-metric" style={c.unattributed ? undefined : { fontWeight: 500, color: 'var(--ink-primary)' }}>
                      {c.unattributed ? (
                        <>
                          Unattributed{' '}
                          <button className="link-inline" onClick={() => onNavigate('Attribution Inbox')}>
                            resolve in Inbox →
                          </button>
                        </>
                      ) : (
                        c.name
                      )}
                    </td>
                    <td>{money(c.spend)}</td>
                    <td className={c.leads === 0 && c.spend > 0 ? 'cf-negative' : ''}>{num(c.leads)}</td>
                    <td>{num(c.booked)}</td>
                    <td>{num(c.closed)}</td>
                    <td>{money(c.cash)}</td>
                    <td className={c.spend > 0 && c.cash / c.spend < 1 ? 'cf-negative' : c.spend > 0 && c.cash / c.spend >= 2 ? 'cf-positive' : ''}>
                      {c.spend > 0 ? ratio(c.cash / c.spend) : '—'}
                    </td>
                    <td style={{ textAlign: 'left' }}>
                      {c.tag ? (
                        <span className={`pill ${c.tag === 'Scale' ? 'positive' : 'warning'}`}>
                          <span className="dot" />
                          {c.tag}
                        </span>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td className="col-metric">All campaigns</td>
                  <td>{money(totals.spend)}</td>
                  <td>{num(totals.leads)}</td>
                  <td>{num(totals.booked)}</td>
                  <td>{num(totals.closed)}</td>
                  <td>{money(totals.cash)}</td>
                  <td>{ratio(totals.cash / totals.spend)}</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-title">{level} view not in this prototype</div>
            <p>The {level.toLowerCase()} breakdown reuses the same table frame and drill-in panel as Campaigns (FR-A1).</p>
          </div>
        )}
      </article>

      {open && <CampaignPanel campaign={open} onClose={() => setOpen(null)} />}
    </>
  );
}
