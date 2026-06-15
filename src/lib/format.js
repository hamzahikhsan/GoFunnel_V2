// All number/date rendering goes through here — one locale (en-US), one set of
// rules (PRD FR-G2): currency 2dp, "—" for undefined, tabular by CSS.

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const usd0 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const int = new Intl.NumberFormat('en-US');

export const EM_DASH = '—';

export function money(v, { compact = false } = {}) {
  if (v == null) return EM_DASH;
  return compact ? usd0.format(v) : usd.format(v);
}

export function num(v) {
  return v == null ? EM_DASH : int.format(v);
}

export function ratio(v, dp = 2) {
  return v == null ? EM_DASH : `${v.toFixed(dp)}x`;
}

export function pct(v, dp = 2) {
  return v == null ? EM_DASH : `${v.toFixed(dp)}%`;
}
