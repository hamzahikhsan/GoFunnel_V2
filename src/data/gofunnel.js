// Single source of truth — demo account "DK Filler", MTD Jun 1–6 2026.
// Numbers copied verbatim from GoFunnel_v2_Build_Brief.md §4. Every metric on
// screen is either listed here or derived from this object in one place.

export const PERIOD = { label: 'MTD', range: 'Jun 1–6, 2026', days: 6 };

export const kpis = {
  adSpend: { value: 6049.95, prev: 9577.27, goal: null },
  callsBooked: { value: 19, prev: 2, deltaDisplay: '+17 calls', goal: 25 },
  costPerCall: { value: 318.42, prev: 299.29, goal: 300, polarity: 'lower' },
  cashCollected: { value: 7497.0, prev: 9661.66, goal: 12000 },
  roas: { value: 1.24, prev: 1.01, goal: 2.0 },
};

export const funnel = {
  clicks: 23457,
  leads: 22,
  booked: 19,
  shown: 14,
  closed: 4,
  cash: 7497.0,
  rates: { leadToBook: '86%', showRate: '74%', showToClose: '29%', bookToClose: '21%' },
};

export const daily = [
  { date: 'Jun 1', spend: 1140.83, impressions: 267451, clicks: 3096, cpm: 4.27, cpc: 0.37, ctr: 1.16, leads: 4, booked: 1, shown: 5, closed: 0, cash: 0,       roas: 0.0 },
  { date: 'Jun 2', spend: 1209.84, impressions: 289751, clicks: 4681, cpm: 4.18, cpc: 0.26, ctr: 1.62, leads: 4, booked: 4, shown: 0, closed: 2, cash: 5414.92, roas: 4.48 },
  { date: 'Jun 3', spend: 1176.6,  impressions: 262295, clicks: 4945, cpm: 4.49, cpc: 0.24, ctr: 1.89, leads: 5, booked: 7, shown: 4, closed: 1, cash: 832.83,  roas: 0.71 },
  { date: 'Jun 4', spend: 1254.85, impressions: 302467, clicks: 5105, cpm: 4.15, cpc: 0.25, ctr: 1.69, leads: 4, booked: 3, shown: 2, closed: 1, cash: 1249.25, roas: 1.0 },
  { date: 'Jun 5', spend: 1267.83, impressions: 291576, clicks: 5630, cpm: 4.35, cpc: 0.23, ctr: 1.93, leads: 5, booked: 2, shown: 3, closed: 0, cash: 0,       roas: 0.0 },
  { date: 'Jun 6', spend: 0,       impressions: 0,      clicks: 0,    cpm: null, cpc: null, ctr: null, leads: 0, booked: 2, shown: 0, closed: 0, cash: 0,       roas: null },
];

export const secondary = {
  reach: { impressions: 1413540, reach: 904754, frequency: 1.56, clicks: 23457 },
  acquisition: { cpm: 4.28, outboundCtr: 1.66, cpc: 0.26, cpl: 275.0 },
};

export const efficiency = {
  ccPerCall: 394.58,
  costPerCall: 318.42,
  callMargin: 1.24,
  aov: 1874.25,
  cac: 1512.49,
  aovMargin: 1.24,
};

export const narrative = {
  lead: 'ROAS is 1.24x this month — profitable, but below your 2.0x goal.',
  body:
    'The gain came from 2 closes on Jun 2 (UGC — Client Testimonial — closed the day at 4.48x ROAS). ' +
    'Watch-out: “Webinar Cost Cap” has spent $847 with zero leads, and 18 unattributed ' +
    'payments (~$129.9K) are inflating your true CAC.',
};

export const roasInsight = {
  date: 'Jun 2',
  value: 4.48,
  text: 'Best day — 2 closes from UGC Testimonial creative',
};

export const attributionInboxCount = 18;

// Period totals derived from the daily series — the same numbers as the KPI
// row by construction (they sum exactly), so headline and table can never
// contradict (PRD NFR-2, Build Brief checklist "ROAS headline = ROAS tabel").
export const totals = daily.reduce(
  (t, d) => ({
    spend: t.spend + d.spend,
    impressions: t.impressions + d.impressions,
    clicks: t.clicks + d.clicks,
    leads: t.leads + d.leads,
    booked: t.booked + d.booked,
    shown: t.shown + d.shown,
    closed: t.closed + d.closed,
    cash: t.cash + d.cash,
  }),
  { spend: 0, impressions: 0, clicks: 0, leads: 0, booked: 0, shown: 0, closed: 0, cash: 0 },
);

// Cumulative MTD ratio series. Ratio metrics are charted as running
// period-to-date values so the last point equals the headline number —
// the single-calculation-service rule (PRD NFR-2) made visible.
export const cumulative = daily.reduce((acc, d, i) => {
  const p = acc[i - 1] || { spend: 0, cash: 0, booked: 0, closed: 0 };
  const spend = p.spend + d.spend;
  const cash = p.cash + d.cash;
  const booked = p.booked + d.booked;
  const closed = p.closed + d.closed;
  acc.push({
    date: d.date,
    spend,
    cash,
    booked,
    closed,
    costPerCall: booked > 0 ? spend / booked : null,
    ccPerCall: booked > 0 ? cash / booked : null,
    cac: closed > 0 ? spend / closed : null,
    aov: closed > 0 ? cash / closed : null,
  });
  return acc;
}, []);
