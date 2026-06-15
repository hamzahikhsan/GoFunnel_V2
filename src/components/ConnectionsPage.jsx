import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { STATUS_META } from '../data/connectors.js';

// Connections (Flow & Connectors Brief §2). Connectors are data, so every
// card here is rendered from the same generic template — adding a tool is
// adding one object, never new layout code. No flow is a dead end: every
// button opens an overlay, mutates visible state, or fires an honest toast.

function StatusPill({ status }) {
  const meta = STATUS_META[status] ?? STATUS_META.not_connected;
  return (
    <span className={`pill ${meta.tone}`}>
      <span className="dot" />
      {meta.label}
    </span>
  );
}

// ---- 3-step Connect / Reconnect overlay (mock — no real OAuth, §5) ----
function ConnectFlowModal({ provider, mode, onComplete, onClose }) {
  const [step, setStep] = useState('permission');
  const account =
    mode === 'reconnect' && provider.id === 'fanbasis'
      ? 'fanbasis.com/dkfiller'
      : provider.account && provider.account !== 'Not connected'
        ? provider.account
        : `${provider.name} · demo workspace`;

  function start() {
    setStep('connecting');
    // Mock authorization — a brief delay, never a real credential exchange.
    setTimeout(() => setStep('connected'), 1100);
  }

  return (
    <>
      <div className="panel-overlay" onClick={step === 'connecting' ? undefined : onClose} />
      <div className="modal-wrap">
        <article className="modal-card" role="dialog" aria-label={`Connect ${provider.name}`}>
          <div className="modal-provider">
            <span className="conn-mono">{provider.mono}</span>
            <span className="modal-provider-name">{provider.name}</span>
          </div>

          {step === 'permission' && (
            <>
              <h2 className="modal-title">{mode === 'reconnect' ? `Reconnect ${provider.name}` : `Connect ${provider.name}`}</h2>
              <p className="modal-sub">GoFunnel will read:</p>
              <ul className="modal-pulls">
                {provider.pulls.map((p) => (
                  <li key={p}><Icon name="arrowRight" size={12} /> {p}</li>
                ))}
              </ul>
              <p className="modal-note">Read-only. You can disconnect anytime.</p>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={onClose}>Cancel</button>
                <button className="btn-primary" onClick={start}>{mode === 'reconnect' ? 'Reconnect' : `Connect ${provider.name}`}</button>
              </div>
            </>
          )}

          {step === 'connecting' && (
            <div className="modal-state">
              <span className="spinner" />
              <p className="modal-state-text">Authorizing with {provider.name}…</p>
            </div>
          )}

          {step === 'connected' && (
            <div className="modal-state">
              <span className="check-badge"><Icon name="arrowRight" size={16} /></span>
              <p className="modal-state-text"><b>Connected</b></p>
              <p className="modal-sub" style={{ textAlign: 'center' }}>
                Connected as {account} · first sync in ~2 min · pulling {provider.pulls.join(', ')}
              </p>
              <div className="modal-actions" style={{ justifyContent: 'center' }}>
                <button className="btn-primary" onClick={() => { onComplete(); onClose(); }}>Done</button>
              </div>
            </div>
          )}
        </article>
      </div>
    </>
  );
}

// ---- "+ Add connector" catalog ----
function CatalogModal({ available, onPick, onClose }) {
  const [q, setQ] = useState('');
  const filtered = available.filter((a) => a.name.toLowerCase().includes(q.toLowerCase()));
  const cats = [...new Set(filtered.map((a) => a.category))];
  return (
    <>
      <div className="panel-overlay" onClick={onClose} />
      <div className="modal-wrap">
        <article className="modal-card" role="dialog" aria-label="Add connector">
          <h2 className="modal-title">Add a connector</h2>
          <div className="cmdk-input">
            <Icon name="search" size={14} />
            <input autoFocus placeholder="Search providers…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          {cats.length === 0 && <p className="modal-sub">No providers match “{q}”.</p>}
          {cats.map((cat) => (
            <div key={cat} className="catalog-group">
              <div className="nav-section-label" style={{ padding: '8px 0 4px' }}>{cat}</div>
              {filtered.filter((a) => a.category === cat).map((a) => (
                <button key={a.id} className="catalog-row" onClick={() => onPick(a)}>
                  <span className="conn-mono sm">{a.mono}</span>
                  <span className="catalog-name">{a.name}</span>
                  <span className="catalog-add">Connect <Icon name="arrowRight" size={12} /></span>
                </button>
              ))}
            </div>
          ))}
          <div className="modal-actions">
            <button className="btn-secondary" onClick={onClose}>Close</button>
          </div>
        </article>
      </div>
    </>
  );
}

// ---- Manage side-panel (connected sources) ----
function ManagePanel({ connector, onSync, onDisconnect, onClose }) {
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <div className="panel-overlay" onClick={onClose} />
      <aside className="side-panel" aria-label={`Manage ${connector.name}`}>
        <div className="side-panel-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="conn-mono">{connector.mono}</span>
            <div>
              <h2 className="side-panel-title">{connector.name}</h2>
              <p className="side-panel-sub">{connector.account}</p>
            </div>
          </div>
          <button className="side-panel-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="panel-section">
          <div className="panel-section-title">Status</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5 }}>
            <StatusPill status={connector.status} />
            <span style={{ color: 'var(--ink-tertiary)' }}>Last sync: {connector.lastSync}</span>
          </div>
        </div>

        <div className="panel-section">
          <div className="panel-section-title">Pulls into GoFunnel</div>
          {connector.pulls.map((p) => (
            <div className="transcript-item" key={p} style={{ padding: '5px 0' }}>
              <span className="transcript-text"><b style={{ color: 'var(--ink-primary)', fontWeight: 550 }}>{p}</b></span>
            </div>
          ))}
        </div>

        <div className="panel-section">
          <button className="btn-secondary" style={{ marginRight: 10 }} onClick={onSync}>Sync now</button>
          {!confirm ? (
            <button className="btn-ghost-danger" onClick={() => setConfirm(true)}>Disconnect</button>
          ) : (
            <div className="confirm-row">
              <span>Disconnect {connector.name}? This stops its data sync.</span>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="btn-secondary" onClick={() => setConfirm(false)}>Cancel</button>
                <button className="btn-ghost-danger" onClick={() => onDisconnect(connector)}>Disconnect</button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default function ConnectionsPage({ connectors, setConnectors, available, setAvailable }) {
  const [flow, setFlow] = useState(null); // { provider, mode }
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [manage, setManage] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef();

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  function showToast(text, undo) {
    clearTimeout(toastTimer.current);
    setToast({ text, undo });
    toastTimer.current = setTimeout(() => setToast(null), 6000);
  }

  function patchConnector(id, patch) {
    setConnectors((cats) =>
      cats.map((cat) => ({ ...cat, connectors: cat.connectors.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
    );
  }

  function completeFlow(provider, mode) {
    if (mode === 'add') {
      const row = { id: provider.id, name: provider.name, mono: provider.mono, status: 'connected', account: `${provider.name} · demo workspace`, lastSync: 'just now', pulls: provider.pulls ?? [] };
      setConnectors((cats) => cats.map((cat) => (cat.category === provider.category ? { ...cat, connectors: [...cat.connectors, row] } : cat)));
      setAvailable((av) => av.filter((a) => a.id !== provider.id));
      showToast(`Connected ${provider.name}.`, () => {
        setConnectors((cats) => cats.map((cat) => (cat.category === provider.category ? { ...cat, connectors: cat.connectors.filter((c) => c.id !== provider.id) } : cat)));
        setAvailable((av) => (av.some((a) => a.id === provider.id) ? av : [...av, provider]));
      });
      return;
    }
    const prev = { status: provider.status, account: provider.account, lastSync: provider.lastSync };
    const account = mode === 'reconnect' && provider.id === 'fanbasis' ? 'fanbasis.com/dkfiller'
      : provider.account && provider.account !== 'Not connected' ? provider.account : `${provider.name} · demo workspace`;
    patchConnector(provider.id, { status: 'connected', lastSync: 'just now', account });
    showToast(`Connected ${provider.name}.`, () => patchConnector(provider.id, prev));
  }

  function disconnect(c) {
    const prev = { status: c.status, account: c.account, lastSync: c.lastSync };
    patchConnector(c.id, { status: 'not_connected', account: 'Not connected', lastSync: '—' });
    setManage(null);
    showToast(`Disconnected ${c.name}.`, () => patchConnector(c.id, prev));
  }

  const all = connectors.flatMap((c) => c.connectors);
  const healthy = all.filter((c) => c.status === 'connected').length;
  const needs = all.length - healthy;

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Connections</h1>
          <p className="page-sub">
            How GoFunnel gets your data. {healthy} of {all.length} sources healthy{needs > 0 ? ` · ${needs} need${needs > 1 ? '' : 's'} attention` : ''}.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setCatalogOpen(true)}>+ Add connector</button>
      </div>

      <div className="goal-banner" style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border-default)', color: 'var(--ink-secondary)' }}>
        Connected sources feed every number in GoFunnel. <b>A broken source is a blind spot in your ROAS.</b>
      </div>

      {connectors.map((cat) => (
        <section key={cat.category} style={{ marginBottom: 24 }}>
          <div className="conn-cat-head">
            <span className="nav-section-label">{cat.category}</span>
            <span className="section-sub">{cat.blurb}</span>
          </div>
          <div className="conn-grid">
            {cat.connectors.map((c) => (
              <article className="card conn-card" key={c.id}>
                <span className="conn-mono">{c.mono}</span>
                <div className="conn-main">
                  <div className="conn-name-row">
                    <span className="conn-name">{c.name}</span>
                    <StatusPill status={c.status} />
                  </div>
                  <div className="conn-account">{c.account}</div>
                  <div className="conn-sync">Last sync: {c.lastSync}</div>
                  <div className="conn-pulls">Pulls: {c.pulls.join(' · ')}</div>
                  {c.note && (
                    <div className="conn-note">
                      {c.note}
                    </div>
                  )}
                </div>
                <div className="conn-action">
                  {c.status === 'connected' && (
                    <button className="btn-secondary" onClick={() => setManage(c)}>Manage</button>
                  )}
                  {c.status === 'action_needed' && (
                    <button className="btn-primary" onClick={() => setFlow({ provider: c, mode: 'reconnect' })}>Reconnect</button>
                  )}
                  {c.status === 'not_connected' && (
                    <button className="btn-primary" onClick={() => setFlow({ provider: c, mode: 'connect' })}>Connect</button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      {flow && (
        <ConnectFlowModal
          provider={flow.provider}
          mode={flow.mode}
          onComplete={() => completeFlow(flow.provider, flow.mode)}
          onClose={() => setFlow(null)}
        />
      )}
      {catalogOpen && (
        <CatalogModal
          available={available}
          onPick={(a) => { setCatalogOpen(false); setFlow({ provider: { ...a, account: null }, mode: 'add' }); }}
          onClose={() => setCatalogOpen(false)}
        />
      )}
      {manage && (
        <ManagePanel
          connector={manage}
          onSync={() => showToast(`Sync queued for ${manage.name}.`)}
          onDisconnect={disconnect}
          onClose={() => setManage(null)}
        />
      )}

      {toast && (
        <div className="toast-stack">
          <div className="undo-toast">
            <span><b>{toast.text}</b></span>
            {toast.undo && (
              <button onClick={() => { toast.undo(); setToast(null); }}>Undo</button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
