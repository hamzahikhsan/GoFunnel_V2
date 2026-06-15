import { useState } from 'react';
import Icon from './Icon.jsx';
import { heliosHistory, heliosPinned, heliosConversation, starterPrompts } from '../data/modules.js';

// Helios workspace (PRD §5.8): history rail, conversation with ranked
// drivers, pinned insights, and the "make this recurring" bridge into
// Automated Reports (FR-X3).
const modes = ['Pulse', 'Standard', 'Deep Dive'];
const modeHints = {
  Pulse: 'Pulse: one-line answers, fastest',
  Standard: 'Standard: answer + ranked drivers',
  'Deep Dive': 'Deep Dive: full analysis with charts and caveats',
};

export default function HeliosPage({ onNavigate }) {
  const [mode, setMode] = useState('Standard');
  const [draft, setDraft] = useState('');

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Helios</h1>
          <p className="page-sub">Context-aware: this conversation is scoped to DK Filler · MTD Jun 1–6</p>
        </div>
        <div className="segmented" role="group" aria-label="Helios mode">
          {modes.map((m) => (
            <button key={m} className={m === mode ? 'active' : ''} title={modeHints[m]} onClick={() => setMode(m)}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="helios-layout">
        <article className="card helios-rail" aria-label="Conversation history">
          <div className="rail-title">History</div>
          {heliosHistory.map((h) => (
            <button key={h.id} className={`rail-item${h.active ? ' active' : ''}`}>
              {h.title}
              <span className="rail-date">{h.date}</span>
            </button>
          ))}
        </article>

        <article className="card helios-chat" aria-label="Conversation">
          {heliosConversation.map((m, i) =>
            m.role === 'user' ? (
              <div className="chat-msg user" key={i}>{m.text}</div>
            ) : (
              <div className="chat-msg helios" key={i}>
                <div className="chat-author">
                  <Icon name="spark" size={13} />
                  Helios
                </div>
                {m.text}
                <div className="driver-table">
                  <div className="driver-row">
                    <span>Ranked drivers</span>
                    <span>Impact</span>
                  </div>
                  {m.drivers.map((d) => (
                    <div className="driver-row" key={d.label}>
                      <span>{d.label}</span>
                      <span className="d-impact">{d.impact}</span>
                    </div>
                  ))}
                </div>
                <div>
                  {m.actions.map((a) => (
                    <button
                      className="chip-btn"
                      key={a}
                      onClick={a.includes('recurring') ? () => onNavigate('Scheduled Reports') : undefined}
                      title={a.includes('recurring') ? 'Opens a pre-filled Automated Report draft (FR-X3)' : undefined}
                    >
                      {a.includes('recurring') && <Icon name="send" size={13} />}
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            ),
          )}

          <div style={{ margin: '8px 0 16px' }}>
            {starterPrompts.map((p) => (
              <button className="chip-btn" key={p} onClick={() => setDraft(p)}>{p}</button>
            ))}
          </div>

          <div className="chat-input" style={{ padding: 0, border: 'none' }}>
            <input
              className="input"
              style={{ borderRadius: 10, padding: '10px 14px' }}
              placeholder="Ask about your funnel, campaigns, calls or cash…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              aria-label="Ask Helios"
            />
            <span style={{ color: 'var(--accent)', flexShrink: 0 }} title="Generation is out of prototype scope — the conversation above shows the answer format">
              <Icon name="arrowRight" size={14} />
            </span>
          </div>
        </article>

        <div>
          <article className="card helios-rail" aria-label="Pinned insights" style={{ marginBottom: 16 }}>
            <div className="rail-title">Pinned insights</div>
            {heliosPinned.map((p) => (
              <div className="pinned-item" key={p.text}>
                {p.text}
                <span className="rail-date">{p.date}</span>
              </div>
            ))}
          </article>
          <article className="card helios-rail" aria-label="Proactive feed">
            <div className="rail-title">Proactive feed</div>
            <div className="pinned-item">
              Anomalies Helios detects (like the Jun 2 ROAS spike) post automatically to the
              Command Center attention queue and optional Slack (FR-X4).
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
