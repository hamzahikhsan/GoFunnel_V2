import { useState } from 'react';
import Icon from './Icon.jsx';
import { goals as seedGoals, alertLog } from '../data/modules.js';

// Goals & Alerts (PRD §5.11). Quick-fill applies suggested targets
// computed from 30-day averages to every unset goal (FR-GO2) — with the
// suggestion's evidence in the row tooltip and one-click undo. Goals set
// here drive every status pill and conditional format (FR-GO4 / FR-G4).
export default function GoalsPage() {
  const [goals, setGoals] = useState(seedGoals);
  const [filled, setFilled] = useState(false);

  const allItems = goals.flatMap((g) => g.items);
  const setCount = allItems.filter((i) => i.target).length;
  const suggestible = allItems.filter((i) => !i.target && i.suggest).length;

  function applySuggest(item) {
    return { ...item, ...item.suggest, suggested: true };
  }

  function quickFill() {
    setGoals(goals.map((g) => ({
      ...g,
      items: g.items.map((i) => (!i.target && i.suggest ? applySuggest(i) : i)),
    })));
    setFilled(true);
  }

  function undoFill() {
    setGoals(seedGoals);
    setFilled(false);
  }

  function fillOne(metric) {
    setGoals(goals.map((g) => ({
      ...g,
      items: g.items.map((i) => (i.metric === metric && i.suggest ? applySuggest(i) : i)),
    })));
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Goals &amp; Alerts</h1>
          <p className="page-sub">
            {setCount} of {allItems.length} goals set · thresholds drive KPI colors, conditional formatting and alerts platform-wide
          </p>
        </div>
        {filled ? (
          <button className="btn-secondary" onClick={undoFill}>Undo quick-fill</button>
        ) : (
          <button className="btn-primary" onClick={quickFill} disabled={suggestible === 0}>
            Quick-fill {suggestible} goals from 30-day averages
          </button>
        )}
      </div>

      <div className="goal-banner">
        <Icon name="target" size={16} />
        {filled ? (
          <span>
            <b>{suggestible || 'All'} suggested targets applied.</b> Each row's tooltip shows the 30-day
            evidence behind its target — review, adjust, or undo. Status pills across the platform update immediately.
          </span>
        ) : (
          <span>
            <b>Start with the 3 goals that matter.</b> ROAS, Cash Collected and Show Rate are set —
            quick-fill proposes targets for the rest from your 30-day averages, marked as suggestions until you confirm.
          </span>
        )}
      </div>

      {goals.map((group) => (
        <article className="card daily-card" key={group.group} style={{ marginBottom: 16 }}>
          <div className="section-head" style={{ padding: '16px 24px 0' }}>
            <h2 className="section-title">{group.group}</h2>
          </div>
          <div className="daily-table-wrap" style={{ borderTop: 'none', marginTop: 12 }}>
            <table className="daily-table">
              <thead>
                <tr>
                  <th className="col-metric">Metric</th>
                  <th>Current</th>
                  <th>Target</th>
                  <th>Warning at</th>
                  <th>Red alert at</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {group.items.map((g) => (
                  <tr key={g.metric} title={g.note}>
                    <td className="col-metric">
                      {g.metric}
                      {g.suggested && <span className="picker-tag" title="Pre-filled from your 30-day average — confirm or adjust">Suggested</span>}
                    </td>
                    <td>{g.current}</td>
                    <td>{g.target ?? <span className="muted">—</span>}</td>
                    <td>{g.warning ?? <span className="muted">—</span>}</td>
                    <td>{g.alert ?? <span className="muted">—</span>}</td>
                    <td style={{ textAlign: 'left' }}>
                      {g.target ? (
                        <span className={`pill ${g.status}`} title={g.note}>
                          <span className="dot" />
                          {g.status === 'positive' ? 'On track' : g.status === 'warning' ? 'Warning' : 'Off track'}
                        </span>
                      ) : g.suggest ? (
                        <button
                          className="goal-set-link"
                          title={`Suggested: ${g.suggest.target} (${g.suggest.note})`}
                          onClick={() => fillOne(g.metric)}
                        >
                          Set goal
                        </button>
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      ))}

      <article className="card" style={{ padding: '20px 24px' }}>
        <div className="section-head" style={{ marginTop: 0 }}>
          <h2 className="section-title">Alert log</h2>
          <span className="section-sub">Delivered in-app · email · Slack per goal settings</span>
        </div>
        <div className="attention-list">
          {alertLog.map((a) => (
            <div className="attention-item" key={a.text} style={{ cursor: 'default' }}>
              <span className={`attention-dot ${a.tone === 'positive' ? 'warning' : a.tone}`} style={a.tone === 'positive' ? { background: 'var(--positive)' } : undefined} />
              <span>
                <span className="attention-title">{a.text}</span>
                <br />
                <span className="attention-detail">{a.date} · {a.channel}</span>
              </span>
            </div>
          ))}
        </div>
      </article>
    </>
  );
}
