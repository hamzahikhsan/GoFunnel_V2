// Data for the completion pass: segments, historical, cohorts, the
// dashboard metric catalog and theme presets. Every dimension below sums
// exactly to the MTD totals in gofunnel.js (spend $6,049.95 · cash
// $7,497.00 · 22 leads · 19 booked) — slicing the same pie, never a
// second pie (NFR-2).

// ---- Segmented Insights (FR-A4) — humanized labels, never raw enums ----
export const segments = {
  Gender: [
    { label: 'Women', spend: 3629.97, cash: 5414.92, leads: 13, booked: 12 },
    { label: 'Men', spend: 2118.48, cash: 2082.08, leads: 8, booked: 6 },
    { label: 'Unknown', spend: 301.5, cash: 0, leads: 1, booked: 1 },
  ],
  Age: [
    { label: '25–34', spend: 2177.98, cash: 2499.25, leads: 8, booked: 7 },
    { label: '35–44', spend: 1814.99, cash: 4164.92, leads: 7, booked: 6 },
    { label: '45–54', spend: 1209.99, cash: 832.83, leads: 4, booked: 4 },
    { label: '18–24', spend: 544.5, cash: 0, leads: 2, booked: 1 },
    { label: '55+', spend: 302.49, cash: 0, leads: 1, booked: 1 },
  ],
  Device: [
    { label: 'Mobile', spend: 4839.96, cash: 4997.75, leads: 17, booked: 15 },
    { label: 'Desktop', spend: 1209.99, cash: 2499.25, leads: 5, booked: 4 },
  ],
  Platform: [
    { label: 'Instagram', spend: 3327.47, cash: 5414.92, leads: 12, booked: 11 },
    { label: 'Facebook', spend: 2419.98, cash: 2082.08, leads: 9, booked: 8 },
    { label: 'Audience Network', spend: 302.5, cash: 0, leads: 1, booked: 0 },
  ],
  Placement: [
    { label: 'Reels', spend: 2540.98, cash: 4164.92, leads: 9, booked: 8 },
    { label: 'Feed', spend: 2177.98, cash: 3332.08, leads: 8, booked: 7 },
    { label: 'Stories', spend: 1028.49, cash: 0, leads: 4, booked: 4 },
    { label: 'Audience Network', spend: 302.5, cash: 0, leads: 1, booked: 0 },
  ],
};

// ---- Historical (FR-A5) — true Canceled counts, section subtotals ----
export const weekly = [
  { period: 'W23 · Jun 1–6', spend: 6049.95, leads: 22, booked: 19, canceled: 1, shown: 14, closed: 4, cash: 7497.0 },
  { period: 'W22 · May 25–31', spend: 9577.27, leads: 8, booked: 2, canceled: 2, shown: 4, closed: 3, cash: 9661.66 },
];

export const monthly = [
  { period: 'Jun 2026 (MTD)', spend: 6049.95, leads: 22, booked: 19, canceled: 1, shown: 14, closed: 4, cash: 7497.0 },
  { period: 'May 2026', spend: 31402.18, leads: 71, booked: 14, canceled: 6, shown: 11, closed: 9, cash: 28544.91 },
  { period: 'Apr 2026', spend: 27883.55, leads: 64, booked: 18, canceled: 4, shown: 13, closed: 8, cash: 41210.42 },
];

// ---- Payments cohorts (FR-P3) — computed on attributed payments only ----
export const cohorts = [
  { cohort: 'Apr 2026', customers: 8, m0: '100%', m1: '38%', m2: '25%' },
  { cohort: 'May 2026', customers: 9, m0: '100%', m1: '33%', m2: null },
  { cohort: 'Jun 2026', customers: 4, m0: '100%', m1: null, m2: null },
];

export const subscriptionStatus = [
  { label: 'Active', count: 41, tone: 'positive' },
  { label: 'Past due', count: 5, tone: 'warning' },
  { label: 'Canceled', count: 12, tone: 'neutral' },
];

// ---- Dashboards metric catalog (FR-D2) — plain-language descriptions ----
export const metricCatalog = [
  {
    category: 'Marketing',
    metrics: [
      { name: 'ROAS', desc: 'Cash collected per dollar of ad spend', sample: '1.24x', fav: true },
      { name: 'Ad Spend', desc: 'Total Meta spend in the selected range', sample: '$6,049.95' },
      { name: 'CPM', desc: 'Cost per 1,000 impressions', sample: '$4.28' },
      { name: 'CPC', desc: 'Cost per link click', sample: '$0.26' },
      { name: 'Outbound CTR', desc: 'Clicks leaving Meta ÷ impressions', sample: '1.66%' },
      { name: 'CPL', desc: 'Ad spend per lead created', sample: '$275.00' },
    ],
  },
  {
    category: 'Funnel',
    metrics: [
      { name: 'Leads', desc: 'New leads created in range', sample: '22' },
      { name: 'Calls Booked', desc: 'Sales calls scheduled from ads', sample: '19' },
      { name: 'Show Rate', desc: 'Booked calls where the lead showed', sample: '74%', recent: true },
      { name: 'Book → Close', desc: 'Closes ÷ calls booked, same cohort', sample: '21%' },
    ],
  },
  {
    category: 'Sales',
    metrics: [
      { name: 'Cash Collected', desc: 'Money actually received, not booked revenue', sample: '$7,497.00', fav: true },
      { name: 'AOV', desc: 'Average cash per closed deal', sample: '$1,874.25' },
      { name: 'CAC', desc: 'Ad spend per closed deal', sample: '$1,512.49', recent: true },
      { name: 'Avg Call Score', desc: 'Mean AI score (0–100) across calls', sample: '71.4' },
    ],
  },
  {
    category: 'Subscriptions',
    metrics: [
      { name: 'MRR', desc: 'Monthly recurring revenue', sample: '$4,230' },
      { name: 'LTV', desc: 'Average lifetime cash per customer', sample: '$3,118' },
      { name: '90-day Churn', desc: 'Subscribers lost in the last 90 days', sample: '8.6%' },
    ],
  },
  {
    category: 'Attribution',
    metrics: [
      { name: 'Attribution Health', desc: 'Share of cash + leads with a known source', sample: '11%' },
      { name: 'Orphaned Total', desc: 'Cash with no linked lead', sample: '$129,946' },
    ],
  },
];

export const dashboardSeed = [
  { id: 'd1', title: 'ROAS', value: '1.24x', note: 'vs 2.0x goal' },
  { id: 'd2', title: 'Cash Collected', value: '$7,497.00', note: '62% of goal' },
  { id: 'd3', title: 'Show Rate', value: '74%', note: 'on track' },
];

// ---- Theme (FR-G9, DS-2) — presets are token swaps, not new CSS ----
export const themePresets = [
  { name: 'Navy', accent: '#5266EB', hover: '#4356D6', soft: '#EDF0FE', ghost: '#CDDDFF', default: true },
  { name: 'Graphite', accent: '#4B5566', hover: '#3C4452', soft: '#EEF0F3', ghost: '#CBD2DC' },
  { name: 'Forest', accent: '#2F7A5B', hover: '#266349', soft: '#E9F3EE', ghost: '#BFDFD1' },
  { name: 'Claret', accent: '#9C4257', hover: '#823646', soft: '#F7ECEF', ghost: '#E3C2CB' },
];

export const tokenGroups = [
  { group: 'Surfaces', tokens: ['--surface-page', '--surface-card', '--surface-sunken', '--surface-hover'] },
  { group: 'Ink', tokens: ['--ink-primary', '--ink-secondary', '--ink-tertiary', '--ink-disabled'] },
  { group: 'Borders', tokens: ['--border-default', '--border-strong', '--gridline'] },
  { group: 'Accent', tokens: ['--accent', '--accent-hover', '--accent-soft', '--accent-ghost'] },
  { group: 'Semantic', tokens: ['--positive', '--warning', '--negative'] },
];

// ---- Timezones (FR-G8) — searchable IANA sample, not a US-only list ----
export const timezones = [
  'Asia/Jakarta', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Dubai', 'Asia/Kolkata',
  'Australia/Sydney', 'Europe/London', 'Europe/Berlin', 'Europe/Paris',
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'America/Sao_Paulo', 'Africa/Lagos', 'Pacific/Auckland', 'UTC',
];
