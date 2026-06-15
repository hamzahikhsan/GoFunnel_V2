import { useState } from 'react';
import { themePresets, tokenGroups } from '../data/extras.js';

// Theme (FR-G9, DS-2): light-first on the Navy preset; dark mode is a
// user choice generated from the same tokens. Preset switching really
// swaps the accent custom properties — proof the whole UI is token-bound
// (one accent variable, zero hardcoded brand colors in components).
function applyPreset(p) {
  const root = document.documentElement;
  root.style.setProperty('--accent', p.accent);
  root.style.setProperty('--accent-hover', p.hover);
  root.style.setProperty('--accent-soft', p.soft);
  root.style.setProperty('--accent-ghost', p.ghost);
}

function readToken(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export default function ThemePage() {
  const [preset, setPreset] = useState('Navy');
  const [mode, setMode] = useState(document.documentElement.getAttribute('data-theme') === 'dark' ? 'Dark' : 'Light');
  // bump to re-read computed token values after a change
  const [, setTick] = useState(0);

  function pickPreset(p) {
    applyPreset(p);
    setPreset(p.name);
    setTick((t) => t + 1);
  }

  function pickMode(m) {
    if (m === 'Dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    setMode(m);
    setTick((t) => t + 1);
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Theme</h1>
          <p className="page-sub">
            All colors flow from tokens — switching a preset restyles every page instantly, nothing is hardcoded
          </p>
        </div>
      </div>

      <div className="section-head">
        <h2 className="section-title">Accent preset</h2>
        <span className="section-sub">One brand accent (Principle 3) — semantic colors never change</span>
      </div>
      <div className="preset-grid">
        {themePresets.map((p) => (
          <button
            key={p.name}
            className={`preset-card${preset === p.name ? ' selected' : ''}`}
            onClick={() => pickPreset(p)}
          >
            <span className="preset-swatches">
              <span className="preset-swatch" style={{ background: p.accent }} />
              <span className="preset-swatch" style={{ background: p.soft }} />
              <span className="preset-swatch" style={{ background: p.ghost }} />
            </span>
            <span className="preset-name">{p.name}</span>
            <br />
            <span className="preset-sub">{p.default ? 'Default · enterprise navy-indigo' : `Accent ${p.accent}`}</span>
          </button>
        ))}
      </div>

      <div className="section-head">
        <h2 className="section-title">Mode</h2>
        <span className="section-sub">Light-first by default; dark is opt-in, generated from the same tokens (FR-G9)</span>
      </div>
      <div className="mode-row" style={{ marginBottom: 16 }}>
        {['Light', 'Dark'].map((m) => (
          <button key={m} className={`mode-card${mode === m ? ' selected' : ''}`} onClick={() => pickMode(m)}>
            <span className="mode-name">{m}</span>
            <br />
            <span className="mode-sub">
              {m === 'Light' ? 'Default — “calm, credible, decisive” enterprise surface' : 'Opt-in — same tokens, re-derived for dark surfaces'}
            </span>
          </button>
        ))}
      </div>

      <article className="card" style={{ padding: '20px 24px' }}>
        <div className="section-head" style={{ marginTop: 0 }}>
          <h2 className="section-title">Design tokens (live values)</h2>
          <span className="section-sub">Copied literally from the Style Reference §2.1 — DS-2</span>
        </div>
        <div className="cc-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 0 }}>
          {tokenGroups.map((g) => (
            <div key={g.group}>
              <div className="panel-section-title" style={{ marginTop: 10 }}>{g.group}</div>
              {g.tokens.map((t) => (
                <div className="token-row" key={t}>
                  <span className="token-chip" style={{ background: `var(${t})` }} />
                  <span className="token-name">{t}</span>
                  <span className="token-value">{readToken(t)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </article>
    </>
  );
}
