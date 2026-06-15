import { useState } from 'react';
import Icon from './Icon.jsx';
import { timezones } from '../data/extras.js';

// Report builder (FR-R4). The draft is ephemeral until named/saved
// (FR-R2): leaving an empty draft discards it silently — no zombie
// "Untitled · Paused · 0 recipients" records. Publish is gated by the
// setup-completeness checklist.
const blockDescriptions = {
  title: ['Title', 'Report heading with resolved date — “DK Filler · Week of Jun 8”, never raw {{date}}'],
  text: ['Paragraph', 'Helios narrative summary: what changed, why, what to do'],
  kpi: ['KPI Card', 'Value vs goal with status color — e.g. ROAS 1.24x vs 2.0x'],
  table: ['Comparison Table', 'Metrics vs previous period with computed Δ columns'],
  chart: ['Chart', 'ROAS trend with goal line, axes chronological'],
  quote: ['Quote', 'Pull-quote from a scored call transcript'],
  csv: ['CSV Attachment', 'Raw daily rows for the recipient\'s own analysis'],
};

const libraryBlocks = ['title', 'text', 'kpi', 'table', 'chart', 'quote', 'csv'];
const cadences = ['Not scheduled', 'Daily · 7:30 AM', 'Weekly · Mon 8:00 AM', 'Monthly · 1st, 9:00 AM'];

export default function ReportBuilder({ template, initial, onClose, onPublish }) {
  const [name, setName] = useState(initial?.name ?? (template && template.name !== 'Start from scratch' ? template.name : ''));
  const [blocks, setBlocks] = useState(
    template && template.blocks[0] !== 'empty' ? [...template.blocks] : initial?.blocks ?? [],
  );
  const [recipients, setRecipients] = useState(initial?.recipients ?? []);
  const [recipientInput, setRecipientInput] = useState('');
  const [cadence, setCadence] = useState(initial?.cadence ?? 'Not scheduled');
  const [tzQuery, setTzQuery] = useState('');
  const [timezone, setTimezone] = useState(initial?.timezone ?? 'Asia/Jakarta');
  const [testSent, setTestSent] = useState(false);

  const tzMatches = timezones.filter((t) => t.toLowerCase().includes(tzQuery.toLowerCase()));

  const checklist = [
    { label: 'Name report', done: name.trim().length > 0 },
    { label: 'Add ≥ 1 recipient', done: recipients.length > 0 },
    { label: 'Set schedule', done: cadence !== 'Not scheduled' },
    { label: 'Add ≥ 1 block', done: blocks.length > 0 },
  ];
  const complete = checklist.every((c) => c.done);

  function addRecipient() {
    const v = recipientInput.trim();
    if (v && !recipients.includes(v)) setRecipients([...recipients, v]);
    setRecipientInput('');
  }

  const isEmpty = !name.trim() && recipients.length === 0 && blocks.length === 0;

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">{name.trim() || 'New report'}</h1>
          <p className="page-sub">
            {template ? `From template: ${template.name}` : 'Editing report'} · drafts are ephemeral until
            named — closing an empty draft discards it (FR-R2)
          </p>
        </div>
        <button className="btn-secondary" onClick={() => onClose(isEmpty)}>
          {isEmpty ? 'Discard empty draft' : 'Back to reports'}
        </button>
      </div>

      <div className="builder-layout">
        <article className="card builder-canvas">
          <div className="section-head" style={{ marginTop: 0 }}>
            <h2 className="section-title">Blocks</h2>
            <span className="section-sub">{blocks.length} in report · drag order final in production</span>
          </div>
          {blocks.length === 0 && (
            <div className="empty-state" style={{ padding: 28 }}>
              <div className="empty-title">No blocks yet</div>
              <p>Add blocks from the library below — every block inherits theme tokens and goal thresholds.</p>
            </div>
          )}
          {blocks.map((b, i) => (
            <div className="builder-block" key={`${b}-${i}`}>
              <span className="block-kind">{blockDescriptions[b][0]}</span>
              <span className="block-desc">{blockDescriptions[b][1]}</span>
              <button
                className="block-remove"
                aria-label={`Remove ${blockDescriptions[b][0]}`}
                onClick={() => setBlocks(blocks.filter((_, j) => j !== i))}
              >
                ✕
              </button>
            </div>
          ))}
          <div className="block-library">
            {libraryBlocks.map((b) => (
              <button className="chip-btn" key={b} style={{ margin: 0 }} onClick={() => setBlocks([...blocks, b])}>
                + {blockDescriptions[b][0]}
              </button>
            ))}
          </div>
          <div className="panel-section" style={{ marginTop: 18 }}>
            <div className="panel-section-title">AI assistant</div>
            <div className="chat-input" style={{ marginTop: 0 }}>
              Describe the report and Helios drafts the blocks…
              <span style={{ marginLeft: 'auto', color: 'var(--accent)' }}>
                <Icon name="spark" size={14} />
              </span>
            </div>
          </div>
        </article>

        <div>
          <article className="card" style={{ padding: '20px 24px', marginBottom: 16 }}>
            <div className="field">
              <label className="field-label" htmlFor="rb-name">Report name</label>
              <input
                id="rb-name"
                className="input"
                placeholder="e.g. Weekly Executive Summary — DK Filler"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="rb-recipient">Recipients (email or #slack-channel)</label>
              <div>
                {recipients.map((r) => (
                  <span className="recipient-chip" key={r}>
                    {r}
                    <button onClick={() => setRecipients(recipients.filter((x) => x !== r))} aria-label={`Remove ${r}`}>✕</button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  id="rb-recipient"
                  className="input"
                  placeholder="daniel@dkfiller.com"
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addRecipient()}
                />
                <button className="btn-secondary" onClick={addRecipient}>Add</button>
              </div>
            </div>

            <div className="field">
              <span className="field-label">Schedule</span>
              <div className="segmented" role="group" aria-label="Cadence" style={{ display: 'inline-flex', flexWrap: 'wrap' }}>
                {cadences.map((c) => (
                  <button key={c} className={c === cadence ? 'active' : ''} onClick={() => setCadence(c)}>
                    {c.split(' · ')[0]}
                  </button>
                ))}
              </div>
              {cadence !== 'Not scheduled' && (
                <p style={{ fontSize: 12, color: 'var(--ink-tertiary)', margin: '6px 0 0' }}>{cadence} · {timezone}</p>
              )}
            </div>

            <div className="field">
              <label className="field-label" htmlFor="rb-tz">Timezone — full IANA list (FR-G8)</label>
              <input
                id="rb-tz"
                className="input"
                placeholder="Search 400+ timezones…"
                value={tzQuery}
                onChange={(e) => setTzQuery(e.target.value)}
              />
              <div className="tz-list">
                {tzMatches.map((t) => (
                  <button
                    key={t}
                    className={`tz-item${t === timezone ? ' selected' : ''}`}
                    onClick={() => setTimezone(t)}
                  >
                    {t}
                  </button>
                ))}
                {tzMatches.length === 0 && <div className="tz-item">No matches — try “Asia” or “Europe”</div>}
              </div>
            </div>
          </article>

          <article className="card" style={{ padding: '20px 24px' }}>
            <div className="panel-section-title">Before this can send</div>
            {checklist.map((c) => (
              <div className={`checklist-item${c.done ? ' done' : ''}`} key={c.label}>
                <span className="check">{c.done ? '✓' : ''}</span>
                {c.label}
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button className="btn-secondary" onClick={() => setTestSent(true)} disabled={blocks.length === 0}>
                {testSent ? 'Test sent ✓' : 'Send test to me'}
              </button>
              <button
                className="btn-primary"
                disabled={!complete}
                title={complete ? undefined : 'Complete the checklist to publish'}
                onClick={() => onPublish({ name: name.trim(), recipients, cadence, timezone, blocks })}
              >
                Publish
              </button>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
