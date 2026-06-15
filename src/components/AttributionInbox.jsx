import { useState } from 'react';
import Icon from './Icon.jsx';
import { orphanedPayments, orphanedTotal, attribution, leads } from '../data/modules.js';
import { money, pct } from '../lib/format.js';

// Attribution Inbox (PRD §5.7). Attach/dismiss work locally so the
// resolution flow — including undo and the health write-back — is
// demonstrable in the prototype (FR-AI4).
export default function AttributionInbox() {
  const [selectedId, setSelectedId] = useState(orphanedPayments[0].id);
  const [resolved, setResolved] = useState({}); // id -> 'attached' | 'dismissed'
  const [lastAction, setLastAction] = useState(null);
  const [searching, setSearching] = useState(false);
  const [leadQuery, setLeadQuery] = useState('');

  const selected = orphanedPayments.find((p) => p.id === selectedId);
  const openCount = orphanedPayments.filter((p) => !resolved[p.id]).length;
  const attachedCash = orphanedPayments
    .filter((p) => resolved[p.id] === 'attached')
    .reduce((s, p) => s + p.amount, 0);
  const health = Math.round(
    ((attribution.attributedCash + attachedCash) / attribution.totalCash) * 100,
  );

  function resolve(item, kind) {
    setResolved((r) => ({ ...r, [item.id]: kind }));
    setLastAction({ id: item.id, kind, item });
    const next = orphanedPayments.find((p) => p.id !== item.id && !{ ...resolved, [item.id]: kind }[p.id]);
    if (next) setSelectedId(next.id);
  }

  function undo() {
    if (!lastAction) return;
    if (lastAction.kind === 'bulk') {
      setResolved((r) => {
        const copy = { ...r };
        for (const id of lastAction.ids) delete copy[id];
        return copy;
      });
    } else {
      setResolved((r) => {
        const copy = { ...r };
        delete copy[lastAction.id];
        return copy;
      });
      setSelectedId(lastAction.id);
    }
    setLastAction(null);
  }

  // FR-AI2 bulk action: attach everything with a ≥85% confidence match
  const bulkTargets = orphanedPayments.filter((p) => !resolved[p.id] && p.match && p.match.confidence >= 85);

  function bulkAttach() {
    const ids = bulkTargets.map((p) => p.id);
    const amount = bulkTargets.reduce((s, p) => s + p.amount, 0);
    setResolved((r) => ids.reduce((acc, id) => ({ ...acc, [id]: 'attached' }), { ...r }));
    setLastAction({ kind: 'bulk', ids, count: ids.length, amount });
  }

  const stats = [
    {
      label: 'Attribution Health',
      value: pct(health, 0),
      pill: { tone: health < 40 ? 'negative' : 'warning', text: `target ${attribution.target}%` },
      tooltip: 'Attributed cash + leads ÷ total, all time. Attaching a payment recalculates this immediately (FR-AI4).',
    },
    {
      label: 'Unattributed cash',
      value: money(orphanedTotal - attachedCash, { compact: true }),
      pill: { tone: 'negative', text: `${openCount} payments` },
      tooltip: `Orphaned payments with no linked lead — ${money(orphanedTotal)} found at audit vs ${money(attribution.attributedCash)} tracked.`,
    },
    {
      label: 'Unknown-source leads',
      value: `${attribution.unknownLeads}`,
      pill: { tone: 'negative', text: `of ${attribution.totalLeads} all time` },
      tooltip: '85% of leads have no attributed campaign. Resolving improves CAC and CPL accuracy.',
    },
    {
      label: 'Resolved this session',
      value: `${Object.keys(resolved).length}`,
      pill: { tone: Object.keys(resolved).length > 0 ? 'positive' : 'neutral', text: money(attachedCash, { compact: true }) + ' re-attributed' },
      tooltip: 'Attached payments write back to Payments, Pipeline and ROAS with one-click undo.',
    },
  ];

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Attribution Inbox</h1>
          <p className="page-sub">
            Every unattributed payment and lead in one queue — evidence, suggested matches, one-click attach.
          </p>
        </div>
        <button className="btn-secondary" onClick={bulkAttach} disabled={bulkTargets.length === 0}>
          {bulkTargets.length > 0
            ? `Bulk attach ${bulkTargets.length} high-confidence matches`
            : 'No high-confidence matches left'}
        </button>
      </div>

      <section className="inbox-stats" aria-label="Attribution health">
        {stats.map((s) => (
          <article className="card kpi-card today-card" key={s.label} title={s.tooltip}>
            <div className="kpi-label">
              {s.label}
              <Icon name="info" size={12} />
            </div>
            <div className="kpi-value" style={{ fontSize: 24 }}>{s.value}</div>
            <span className={`pill ${s.pill.tone}`}>
              <span className="dot" />
              {s.pill.text}
            </span>
          </article>
        ))}
      </section>

      {lastAction && (
        <div className="undo-toast" role="status">
          {lastAction.kind === 'bulk' ? (
            <>
              <b>{lastAction.count} payments · {money(lastAction.amount)}</b>
              {' '}attached in bulk — ROAS, Payments and Pipeline updated.
            </>
          ) : (
            <>
              <b>{money(lastAction.item.amount)}</b>
              {lastAction.kind === 'attached'
                ? ` attached to ${lastAction.item.match?.name ?? 'lead'} — ROAS, Payments and Pipeline updated.`
                : ' dismissed from the queue.'}
            </>
          )}
          <button onClick={undo}>Undo</button>
        </div>
      )}

      <div className="inbox-layout">
        <article className="card queue-list" aria-label="Unattributed payments queue">
          {orphanedPayments.map((p) => (
            <button
              key={p.id}
              className={`queue-item${p.id === selectedId ? ' selected' : ''}${resolved[p.id] ? ' resolved' : ''}`}
              onClick={() => setSelectedId(p.id)}
            >
              <span>
                <span className="queue-amount">{money(p.amount)}</span>
                <br />
                <span className="queue-meta">{p.date} · {p.source}</span>
              </span>
              <span style={{ minWidth: 0 }}>
                <span className="queue-payer">{p.payer}</span>
                <br />
                <span className="queue-meta">{p.product}</span>
              </span>
              <span className="queue-right">
                {resolved[p.id] === 'attached' ? (
                  <span className="pill positive"><span className="dot" />Attached</span>
                ) : resolved[p.id] === 'dismissed' ? (
                  <span className="pill neutral"><span className="dot" />Dismissed</span>
                ) : p.match ? (
                  <span className={`pill ${p.match.confidence >= 85 ? 'positive' : 'neutral'}`}>
                    <span className="dot" />
                    {p.match.confidence}%
                  </span>
                ) : (
                  <span className="pill neutral"><span className="dot" />No match</span>
                )}
              </span>
            </button>
          ))}
        </article>

        <article className="card evidence-panel" aria-label="Evidence and suggested matches">
          <div className="evidence-head">
            <span className="evidence-amount">{money(selected.amount)}</span>
            <span className="evidence-meta">{selected.product}</span>
          </div>
          <div className="evidence-meta">
            Received {selected.date}, 2026 via {selected.source} · payer {selected.payer}
          </div>

          <div className="evidence-fields">
            <div className="ev-field">
              <span className="side-label">Payment source</span>
              <span className="side-value">{selected.source}</span>
            </div>
            <div className="ev-field">
              <span className="side-label">Payer identity</span>
              <span className="side-value">{selected.payer}</span>
            </div>
            <div className="ev-field">
              <span className="side-label">Product matched</span>
              <span className="side-value">{selected.product}</span>
            </div>
          </div>

          <div className="panel-section-title">Suggested matches</div>
          {selected.match ? (
            <div className="match-card best">
              <span>
                <span className="match-name">{selected.match.name}</span>
                <br />
                <span className="match-evidence">{selected.match.evidence}</span>
              </span>
              <span className="confidence">
                <span className="confidence-num">{selected.match.confidence}% match</span>
                <span className="confidence-track">
                  <span className="confidence-fill" style={{ width: `${selected.match.confidence}%` }} />
                </span>
              </span>
              <button
                className="btn-attach"
                disabled={!!resolved[selected.id]}
                onClick={() => resolve(selected, 'attached')}
              >
                Attach
              </button>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: 20, textAlign: 'left' }}>
              <div className="empty-title">No confident match found</div>
              <p>
                The payer identity doesn't resolve to any lead by email, domain, amount or timing.
                Search leads manually, or dismiss if this payment is out of scope (e.g. a referral sale).
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button
              className={`btn-secondary${searching ? ' active' : ''}`}
              onClick={() => setSearching(!searching)}
            >
              {searching ? 'Close search' : 'Search leads manually'}
            </button>
            <button
              className="btn-secondary"
              disabled={!!resolved[selected.id]}
              onClick={() => resolve(selected, 'dismissed')}
            >
              Dismiss
            </button>
          </div>

          {searching && (
            <div className="panel-section">
              <div className="panel-section-title">Search all leads</div>
              <input
                className="input"
                placeholder="Search by name, email or company…"
                value={leadQuery}
                onChange={(e) => setLeadQuery(e.target.value)}
                autoFocus
              />
              <div className="tz-list" style={{ maxHeight: 180 }}>
                {leads
                  .filter((l) => l.name.toLowerCase().includes(leadQuery.toLowerCase()))
                  .map((l) => (
                    <button
                      key={l.name}
                      className="tz-item"
                      style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}
                      disabled={!!resolved[selected.id]}
                      onClick={() => {
                        resolve({ ...selected, match: { name: l.name } }, 'attached');
                        setSearching(false);
                        setLeadQuery('');
                      }}
                    >
                      <span style={{ fontWeight: 500, color: 'var(--ink-primary)' }}>{l.name}</span>
                      <span style={{ fontSize: 11.5, color: 'var(--ink-tertiary)' }}>
                        {l.stage} · {l.source}
                      </span>
                      <span className="link-inline" style={{ marginLeft: 'auto' }}>Attach</span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          <div className="panel-section">
            <div className="panel-section-title">What happens on attach</div>
            <p style={{ fontSize: 12.5, margin: 0, lineHeight: 1.6 }}>
              The payment is linked to the lead's timeline, cash moves from <i>Unattributed</i> into
              campaign ROAS, CAC recalculates, and Attribution Health updates — everywhere, with undo (FR-AI4).
            </p>
          </div>
        </article>
      </div>
    </>
  );
}
