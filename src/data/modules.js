// Demo data for the post-Phase-1 modules (PRD §5.1, §5.3–§5.8, §5.11).
// Where a number overlaps with the Meta Overview dataset it is either
// imported from gofunnel.js or constructed to sum to it exactly — the
// single-source rule (NFR-2) applies across pages, not just within one.

import { kpis, totals } from './gofunnel.js';
import { money, ratio } from '../lib/format.js';

/* ============================================================
   Goals & Alerts (FR-GO1–GO4) — the nervous system. Status here
   is what drives every pill/conditional format elsewhere.
   ============================================================ */
export const goals = [
  {
    group: 'Marketing',
    items: [
      { metric: 'ROAS', target: '2.0x', warning: '−15%', alert: '−40%', current: ratio(kpis.roas.value), status: 'negative', note: '1.24x vs 2.0x target' },
      { metric: 'Cost per Call', target: '≤ $300.00', warning: '+10%', alert: '+25%', current: money(kpis.costPerCall.value), status: 'warning', note: '6% over target' },
      { metric: 'CPL', target: null, warning: null, alert: null, current: '$275.00', status: null, suggest: { target: '≤ $250.00', warning: '+10%', alert: '+25%', status: 'warning', note: '30-day avg $262 — currently 10% over' } },
      { metric: 'Ad Spend (monthly cap)', target: null, warning: null, alert: null, current: money(kpis.adSpend.value), status: null, suggest: { target: '≤ $10,000 / mo', warning: '+5%', alert: '+15%', status: 'positive', note: 'Pacing under cap' } },
    ],
  },
  {
    group: 'Call Funnel',
    items: [
      { metric: 'Calls Booked', target: '25 / mo', warning: '−10%', alert: '−30%', current: '19', status: 'warning', note: '76% of goal, 24 days left' },
      { metric: 'Show Rate', target: '≥ 70%', warning: '−5pp', alert: '−15pp', current: '74%', status: 'positive', note: 'On track' },
      { metric: 'Book → Close', target: null, warning: null, alert: null, current: '21%', status: null, suggest: { target: '≥ 25%', warning: '−3pp', alert: '−8pp', status: 'warning', note: '30-day avg 24% — currently 4pp under' } },
      { metric: 'Avg Call Score', target: null, warning: null, alert: null, current: '71.4', status: null, suggest: { target: '≥ 75', warning: '−5', alert: '−12', status: 'warning', note: '30-day avg 72.9' } },
    ],
  },
  {
    group: 'Revenue',
    items: [
      { metric: 'Cash Collected', target: '$12,000 / mo', warning: '−15%', alert: '−35%', current: money(kpis.cashCollected.value), status: 'negative', note: '62% of goal' },
      { metric: 'AOV', target: null, warning: null, alert: null, current: '$1,874.25', status: null, suggest: { target: '≥ $1,800.00', warning: '−10%', alert: '−25%', status: 'positive', note: '30-day avg $1,812' } },
      { metric: 'CAC', target: null, warning: null, alert: null, current: '$1,512.49', status: null, suggest: { target: '≤ $1,400.00', warning: '+10%', alert: '+30%', status: 'warning', note: '30-day avg $1,377 — currently 8% over' } },
      { metric: 'MRR', target: null, warning: null, alert: null, current: '$4,230.00', status: null, suggest: { target: '≥ $5,000 / mo', warning: '−10%', alert: '−25%', status: 'warning', note: '30-day avg $4,180' } },
    ],
  },
];

export const goalSetCount = goals.flatMap((g) => g.items).filter((i) => i.target).length;
export const goalTotalCount = goals.flatMap((g) => g.items).length;

export const alertLog = [
  { date: 'Jun 5, 9:02 AM', text: 'Cash Collected fell below 65% of monthly pace', channel: 'In-app · Email', tone: 'negative' },
  { date: 'Jun 4, 7:30 AM', text: 'Cost per Call crossed warning threshold ($318.42 vs $300.00 goal)', channel: 'In-app', tone: 'warning' },
  { date: 'Jun 2, 10:15 AM', text: 'ROAS day-high 4.48x — best day this month', channel: 'In-app · Slack', tone: 'positive' },
];

/* ============================================================
   Attribution (FR-AI1–AI4, FR-P2). All-time figures from the
   Jun 10 audit: 18 orphaned payments ≈ $129,946 vs $15,494
   tracked; 159 of 186 leads with Unknown source.
   ============================================================ */
const orphanedItemsRaw = [
  { id: 'p1', amount: 14997, date: 'Jun 8', source: 'Stripe', payer: 'm.hartono@vexa.io', product: 'Scale Accelerator — PIF', match: { name: 'Marcus Hartono', evidence: 'Same email domain · call on Jun 5 · product price exact', confidence: 92 } },
  { id: 'p2', amount: 14997, date: 'Jun 4', source: 'Whop', payer: 'sandra.k@gmail.com', product: 'Scale Accelerator — PIF', match: { name: 'Sandra Kusuma', evidence: 'Email exact match on lead record · closed-won Jun 3', confidence: 97 } },
  { id: 'p3', amount: 14997, date: 'May 29', source: 'Stripe', payer: 'billing@nortia.co', product: 'Scale Accelerator — PIF', match: { name: 'Devon Aji (Nortia)', evidence: 'Company domain · amount + 2-day proximity to call', confidence: 78 } },
  { id: 'p4', amount: 12499, date: 'May 27', source: 'Stripe', payer: 'rzaki88@yahoo.com', product: 'Inner Circle — Annual', match: { name: 'Rio Zaki', evidence: 'Name similarity · booked call May 24', confidence: 71 } },
  { id: 'p5', amount: 2499, date: 'May 22', source: 'Fanbasis', payer: 'tia.lim@outlook.com', product: 'Foundations', match: { name: 'Tia Lim', evidence: 'Email exact match · form fill May 19', confidence: 95 } },
  { id: 'p6', amount: 9997, date: 'May 21', source: 'Stripe', payer: 'jcalloway@pm.me', product: 'Growth Sprint', match: { name: 'James Calloway', evidence: 'Amount + product match · no call record', confidence: 58 } },
  { id: 'p7', amount: 9997, date: 'May 18', source: 'Whop', payer: 'unknown-7741', product: 'Growth Sprint', match: null },
  { id: 'p8', amount: 7499, date: 'May 17', source: 'Stripe', payer: 'fitra.dewi@gmail.com', product: 'Growth Sprint — Split 1/2', match: { name: 'Fitra Dewi', evidence: 'Email exact match · closed-won May 15', confidence: 96 } },
  { id: 'p9', amount: 7499, date: 'May 12', source: 'Stripe', payer: 'okonkwo.b@zenmail.com', product: 'Growth Sprint — Split 1/2', match: { name: 'Ben Okonkwo', evidence: 'Name similarity · call May 9', confidence: 66 } },
  { id: 'p10', amount: 6997, date: 'May 11', source: 'Fanbasis', payer: 'aleena@studiokai.id', product: 'Launch Lab', match: { name: 'Aleena Putri', evidence: 'Company domain · amount exact', confidence: 74 } },
  { id: 'p11', amount: 4999, date: 'May 9', source: 'Stripe', payer: 'gmills@fastco.net', product: 'Launch Lab — Lite', match: null },
  { id: 'p12', amount: 4999, date: 'May 8', source: 'Stripe', payer: 'hperdana@gmail.com', product: 'Launch Lab — Lite', match: { name: 'Hadi Perdana', evidence: 'Email exact match · lead created May 6', confidence: 94 } },
  { id: 'p13', amount: 4999, date: 'May 6', source: 'Whop', payer: 'unknown-7203', product: 'Launch Lab — Lite', match: null },
  { id: 'p14', amount: 2499, date: 'May 5', source: 'Stripe', payer: 'noor.f@protonmail.com', product: 'Foundations', match: { name: 'Noor Fauzi', evidence: 'Amount + time proximity to call May 4', confidence: 69 } },
  { id: 'p15', amount: 2499, date: 'May 4', source: 'Stripe', payer: 'dwong@kineticlabs.io', product: 'Foundations', match: { name: 'Daniel Wong', evidence: 'Company domain match', confidence: 62 } },
  { id: 'p16', amount: 2499, date: 'May 3', source: 'Fanbasis', payer: 'unknown-6988', product: 'Foundations', match: null },
  { id: 'p17', amount: 2499, date: 'May 2', source: 'Stripe', payer: 'lestari.w@gmail.com', product: 'Foundations', match: { name: 'Lestari Wibowo', evidence: 'Email exact match · form fill Apr 30', confidence: 93 } },
  { id: 'p18', amount: 2975, date: 'May 1', source: 'Stripe', payer: 'kvasquez@mail.com', product: 'Growth Sprint — Split 2/2', match: { name: 'Karla Vasquez', evidence: 'Split-payment pair: 1/2 already attributed', confidence: 88 } },
];

export const orphanedPayments = orphanedItemsRaw;
export const orphanedTotal = orphanedItemsRaw.reduce((s, p) => s + p.amount, 0); // = 129,946

export const attribution = {
  health: 11, // % of all-time cash + leads attributed (audit: $15,494 of ~$145K cash; 27 of 186 leads)
  target: 80,
  attributedCash: 15494,
  totalCash: 15494 + 129946,
  unknownLeads: 159,
  totalLeads: 186,
  trend: [
    { date: 'May 9', health: 9 },
    { date: 'May 16', health: 9 },
    { date: 'May 23', health: 10 },
    { date: 'May 30', health: 10 },
    { date: 'Jun 6', health: 11 },
  ],
};

/* ============================================================
   Ads Manager (FR-A1–A2). Campaign rows sum exactly to the MTD
   totals in gofunnel.js (spend $6,049.95 · 22 leads · 19 booked
   · 4 closed · $7,497.00 cash).
   ============================================================ */
export const campaigns = [
  { name: 'UGC — Client Testimonial', status: 'Active', spend: 1433.2, leads: 7, booked: 8, closed: 3, cash: 6247.75, tag: 'Scale' },
  { name: 'Case Study — Lookalike 2%', status: 'Active', spend: 1986.4, leads: 9, booked: 7, closed: 1, cash: 1249.25, tag: null },
  { name: 'Retargeting — 30d Engagers', status: 'Active', spend: 1033.35, leads: 4, booked: 3, closed: 0, cash: 0, tag: null },
  { name: 'Webinar Funnel — Cost Cap', status: 'Active', spend: 847.0, leads: 0, booked: 0, closed: 0, cash: 0, tag: 'Review' },
  { name: 'Meta (Campaign Unknown)', status: null, spend: 750.0, leads: 2, booked: 1, closed: 0, cash: 0, tag: null, unattributed: true },
];

// Guard: campaign rows must reconcile with the daily series totals.
const cSum = campaigns.reduce((s, c) => s + c.spend, 0);
if (Math.abs(cSum - totals.spend) > 0.01) {
  console.warn(`Campaign spend ${cSum} != daily total ${totals.spend}`);
}

export const creatives = [
  {
    name: 'UGC — Client Testimonial v3',
    campaign: 'UGC — Client Testimonial',
    format: 'Video · 9:16 · 42s',
    hookRate: '38%',
    watchTime: '14.2s avg',
    spend: 1433.2,
    roas: 4.36,
    tag: { label: 'Scale', tone: 'positive' },
    note: 'Drove both Jun 2 closes. Hook rate nearly 2× account average.',
  },
  {
    name: 'Case Study — $0 → $40K carousel',
    campaign: 'Case Study — Lookalike 2%',
    format: 'Carousel · 4 cards',
    hookRate: '21%',
    watchTime: '—',
    spend: 1986.4,
    roas: 0.63,
    tag: { label: 'Refresh', tone: 'warning' },
    note: 'CTR healthy but cash lags — creative fatigue after 21 days live.',
  },
  {
    name: 'Webinar invite — talking head',
    campaign: 'Webinar Funnel — Cost Cap',
    format: 'Video · 1:1 · 28s',
    hookRate: '9%',
    watchTime: '3.1s avg',
    spend: 847.0,
    roas: 0,
    tag: { label: 'Pause', tone: 'negative' },
    note: '$847 spent, zero leads. Hook rate bottom decile for the account.',
  },
];

/* ============================================================
   Calls (FR-C1–C5). One count basis: 19 booked / 14 shown /
   4 closed MTD — identical to the funnel object.
   ============================================================ */
export const callKpis = [
  { label: 'Calls Taken', value: '14', pill: { tone: 'neutral', text: 'No goal set' }, prev: 'vs 11 prev', tooltip: 'Booked calls where the lead showed (Jun 1–6). Same cohort as the Show Rate denominator.' },
  { label: 'Show Rate', value: '74%', pill: { tone: 'positive', text: 'On track' }, prev: 'vs 70% goal', tooltip: 'Shows ÷ Booked, same cohort (14 ÷ 19). Capped at 100% by definition — shows from earlier bookings annotated, never counted twice.' },
  { label: 'Avg Call Score', value: '71.4', pill: { tone: 'neutral', text: 'No goal set' }, prev: 'vs 72.9 prev', tooltip: 'Mean AI score (0–100). Rubric: 0–49 needs coaching · 50–69 average · 70–84 strong · 85+ exceptional. Direction computed from polarity: 71.4 < 72.9 = down.' },
  { label: 'Close Rate', value: '29%', pill: { tone: 'neutral', text: 'No goal set' }, prev: 'Show → Close', tooltip: 'Closes ÷ Shows (4 ÷ 14). Book → Close is 21% (4 ÷ 19) — both shown, never mixed.' },
  { label: 'Obj. Handle Rate', value: '64%', pill: { tone: 'neutral', text: 'No goal set' }, prev: '16 of 25 handled', tooltip: 'Objections handled ÷ objections raised across scored calls. An objection counts as handled when the prospect re-engages after the response.' },
];

// One count basis (Fix Brief §1): 19 booked → 14 shown → 12 scored →
// 4 closed-won + 2 closed-lost, with 5 no-show/missed. The golden rule:
// a newly added row NEVER carries cash and is NEVER 'Closed won' — otherwise
// the $7,497.00 MTD total breaks. The 4 closed-won + cash below are untouched.
export const calls = [
  { id: 'c1', date: 'Jun 5, 4:30 PM', lead: 'Priya Raman', closer: 'Alex T.', duration: '52 min', stage: 'Follow-up scheduled', score: 81, outcome: null, needsReview: false },
  { id: 'c2', date: 'Jun 5, 1:00 PM', lead: 'Tomás Rivera', closer: 'Alex T.', duration: '38 min', stage: 'No show', score: null, outcome: null, needsReview: false },
  { id: 'c3', date: 'Jun 5, 10:00 AM', lead: 'Grace Adeyemi', closer: 'Jordan M.', duration: '61 min', stage: 'Proposal sent', score: 77, outcome: null, needsReview: false },
  { id: 'c4', date: 'Jun 4, 3:30 PM', lead: 'Hendra Wijaya', closer: 'Jordan M.', duration: '47 min', stage: 'Closed won', score: 88, outcome: '$1,249.25', needsReview: false },
  { id: 'c5', date: 'Jun 4, 11:00 AM', lead: 'Mia Tanaka', closer: 'Alex T.', duration: '74 min', stage: 'Closed lost', score: 44, outcome: null, needsReview: true },
  { id: 'c6', date: 'Jun 3, 2:00 PM', lead: 'Samuel Osei', closer: 'Jordan M.', duration: '55 min', stage: 'Closed won', score: 79, outcome: '$832.83', needsReview: false },
  { id: 'c7', date: 'Jun 3, 9:30 AM', lead: 'Anya Volkov', closer: 'Alex T.', duration: '29 min', stage: 'Missed meeting', score: null, outcome: null, needsReview: false },
  { id: 'c8', date: 'Jun 2, 4:00 PM', lead: 'Sandra Kusuma', closer: 'Jordan M.', duration: '66 min', stage: 'Closed won', score: 91, outcome: '$2,915.67', needsReview: false },
  { id: 'c9', date: 'Jun 2, 11:30 AM', lead: 'Liam Carter', closer: 'Alex T.', duration: '58 min', stage: 'Closed won', score: 84, outcome: '$2,499.25', needsReview: false },
  { id: 'c10', date: 'Jun 1, 2:30 PM', lead: 'Rosa Mendez', closer: 'Jordan M.', duration: '83 min', stage: 'Closed lost', score: 38, outcome: null, needsReview: true },
  // ---- 9 rows added to complete the 19-booked basis (no cash, no closed-won) ----
  // 6 shown & still open (4 scored, 2 not yet scored):
  { id: 'c11', date: 'Jun 6, 3:00 PM', lead: 'Marcus Hartono', closer: 'Alex T.', duration: '49 min', stage: 'Proposal sent', score: 73, outcome: null, needsReview: false },
  { id: 'c12', date: 'Jun 6, 11:00 AM', lead: 'Devon Aji', closer: 'Jordan M.', duration: '44 min', stage: 'Follow-up scheduled', score: 68, outcome: null, needsReview: false },
  { id: 'c13', date: 'Jun 5, 5:30 PM', lead: 'Aleena Putri', closer: 'Alex T.', duration: '57 min', stage: 'Qualified', score: 70, outcome: null, needsReview: false },
  { id: 'c14', date: 'Jun 4, 1:30 PM', lead: 'Noor Fauzi', closer: 'Jordan M.', duration: '41 min', stage: 'Proposal sent', score: 64, outcome: null, needsReview: false },
  { id: 'c15', date: 'Jun 3, 4:30 PM', lead: 'Karla Vasquez', closer: 'Alex T.', duration: '36 min', stage: 'Qualified', score: null, outcome: null, needsReview: false },
  { id: 'c16', date: 'Jun 1, 11:00 AM', lead: 'Ben Okonkwo', closer: 'Jordan M.', duration: '45 min', stage: 'Follow-up scheduled', score: null, outcome: null, needsReview: false },
  // 3 no-show / missed (never shown, never scored):
  { id: 'c17', date: 'Jun 6, 9:30 AM', lead: 'Rio Zaki', closer: 'Alex T.', duration: '30 min', stage: 'No show', score: null, outcome: null, needsReview: false },
  { id: 'c18', date: 'Jun 3, 10:30 AM', lead: 'Lestari Wibowo', closer: 'Jordan M.', duration: '45 min', stage: 'Missed meeting', score: null, outcome: null, needsReview: false },
  { id: 'c19', date: 'Jun 1, 4:00 PM', lead: 'Hadi Perdana', closer: 'Alex T.', duration: '30 min', stage: 'No show', score: null, outcome: null, needsReview: false },
];

// Count-basis guard (Fix Brief §0): keep the four call dimensions reconciled.
const _shown = calls.filter((c) => c.stage !== 'No show' && c.stage !== 'Missed meeting').length;
const _scored = calls.filter((c) => c.score != null).length;
const _won = calls.filter((c) => c.stage === 'Closed won').length;
const _lost = calls.filter((c) => c.stage === 'Closed lost').length;
if (calls.length !== 19 || _shown !== 14 || _scored !== 12 || _won !== 4 || _lost !== 2) {
  console.warn(`Calls basis drift: ${calls.length} booked / ${_shown} shown / ${_scored} scored / ${_won} won / ${_lost} lost`);
}

export const callDetail = {
  scoreBreakdown: [
    { label: 'Discovery depth', value: 78 },
    { label: 'Objection handling', value: 64 },
    { label: 'Next-step clarity', value: 82 },
    { label: 'Talk-time balance', value: 61 },
  ],
  highlights: [
    { t: '04:12', text: '"We\'re spending about $8K a month on ads and honestly can\'t tell which half works."' },
    { t: '23:40', text: 'Objection — price vs. agency retainer. Handled with case-study comparison; prospect re-engaged.' },
    { t: '51:08', text: 'Next step agreed: proposal + intro to ops lead by Friday.' },
  ],
};

export const callInsights = {
  rangeNote: null, // set to a string when auto-widened (FR-C4)
  objections: [
    { text: '“Too expensive vs. hiring in-house”', count: 7, handled: 4 },
    { text: '“Need to ask my business partner”', count: 5, handled: 3 },
    { text: '“We tried an agency before, it failed”', count: 4, handled: 3 },
    { text: '“Not sure ads are our bottleneck”', count: 3, handled: 1 },
  ],
  buyingSignals: [
    { text: 'Asked about onboarding timeline', count: 6 },
    { text: 'Asked for client references', count: 4 },
    { text: 'Discussed budget unprompted', count: 4 },
  ],
  painPoints: [
    { text: 'Can\'t attribute revenue to specific campaigns', count: 8 },
    { text: 'Inconsistent lead quality month-to-month', count: 6 },
    { text: 'Founder is the only closer', count: 5 },
  ],
  aspirations: [
    { text: 'Reach $50K/mo without raising ad spend', count: 5 },
    { text: 'Hire a second closer within the quarter', count: 3 },
  ],
};

/* ============================================================
   Pipeline (FR-L1–L4). 22 MTD leads — matches funnel.leads.
   ============================================================ */
export const pipelineStages = [
  { name: 'New contact', count: 2 },
  { name: 'Qualified', count: 1 },
  { name: 'Call booked', count: 5 },
  { name: 'Showed', count: 8 },
  { name: 'Closed won', count: 4 },
  { name: 'Closed lost', count: 2 },
];

export const leads = [
  { name: 'Priya Raman', source: 'UGC — Client Testimonial', stage: 'Showed', value: '$14,997', lastTouch: 'Call · Jun 5', nextAction: 'Send proposal' },
  { name: 'Grace Adeyemi', source: 'Case Study — Lookalike 2%', stage: 'Showed', value: '$9,997', lastTouch: 'Call · Jun 5', nextAction: 'Proposal review Jun 9' },
  { name: 'Hendra Wijaya', source: 'UGC — Client Testimonial', stage: 'Closed won', value: '$1,249.25', lastTouch: 'Payment · Jun 4', nextAction: 'Onboarding' },
  { name: 'Mia Tanaka', source: 'Unknown', stage: 'Closed lost', value: '—', lastTouch: 'Call · Jun 4', nextAction: 'Nurture sequence', unknown: true },
  { name: 'Samuel Osei', source: 'Case Study — Lookalike 2%', stage: 'Closed won', value: '$832.83', lastTouch: 'Payment · Jun 3', nextAction: 'Onboarding' },
  { name: 'Sandra Kusuma', source: 'UGC — Client Testimonial', stage: 'Closed won', value: '$2,915.67', lastTouch: 'Payment · Jun 2', nextAction: 'Onboarding' },
  { name: 'Liam Carter', source: 'Unknown', stage: 'Closed won', value: '$2,499.25', lastTouch: 'Payment · Jun 2', nextAction: 'Onboarding', unknown: true },
  { name: 'Anya Volkov', source: 'Retargeting — 30d Engagers', stage: 'Call booked', value: '—', lastTouch: 'Missed meeting · Jun 3', nextAction: 'Rebook call' },
  { name: 'Tomás Rivera', source: 'Unknown', stage: 'Call booked', value: '—', lastTouch: 'No show · Jun 5', nextAction: 'Rebook call', unknown: true },
  { name: 'Rosa Mendez', source: 'Case Study — Lookalike 2%', stage: 'Closed lost', value: '—', lastTouch: 'Call · Jun 1', nextAction: 'Nurture sequence' },
];

export const leadTimeline = [
  { t: 'May 28', label: 'Ad click', detail: 'UGC — Client Testimonial v3' },
  { t: 'May 28', label: 'Form fill', detail: 'VSL funnel — qualification form' },
  { t: 'Jun 1', label: 'Call booked', detail: 'via Calendly · closer Alex T.' },
  { t: 'Jun 5', label: 'Call held', detail: '52 min · score 81' },
];

export const pipelineKpis = [
  { label: 'Leads (MTD)', value: '22', sub: 'vs 9 prev', tooltip: 'Leads created Jun 1–6 — same count as the Meta Overview funnel.' },
  { label: 'Unknown source', value: '3 of 22', sub: '14% this period', tooltip: 'MTD leads with no attributed campaign. All-time: 159 of 186 (85%) — resolve in Attribution Inbox.' },
  { label: 'Avg touchpoints to close', value: '4.3', sub: '4 closed deals', tooltip: 'Ad click → form → call(s) → payment, averaged over the 4 deals closed in range.' },
  { label: 'Pipeline value', value: '$24,994', sub: '2 open proposals', tooltip: 'Sum of product value for open opportunities past the Showed stage.' },
];

/* ============================================================
   Payments (FR-P1–P5). MTD log sums to $7,497.00 — the same
   cash figure as the KPI row and funnel.
   ============================================================ */
export const payments = [
  { date: 'Jun 4', customer: 'Hendra Wijaya', product: 'Foundations — Split 2/2', source: 'Stripe', amount: 1249.25, status: 'Succeeded', attributed: true },
  { date: 'Jun 3', customer: 'Samuel Osei', product: 'Foundations — Split 1/2', source: 'Stripe', amount: 832.83, status: 'Succeeded', attributed: true },
  { date: 'Jun 2', customer: 'Sandra Kusuma', product: 'Growth Sprint — Split 1/2', source: 'Stripe', amount: 2915.67, status: 'Succeeded', attributed: true },
  // Liam's cash is in MTD ($7,497.00 total unchanged) but his campaign source is
  // still unknown — matches his Pipeline row (Fix Brief §3). Honest system state.
  { date: 'Jun 2', customer: 'Liam Carter', product: 'Foundations + upsell', source: 'Whop', amount: 2499.25, status: 'Succeeded', attributed: false },
];

export const paymentsTotal = payments.reduce((s, p) => s + p.amount, 0); // = 7,497.00

export const ltv = {
  avgLtv: '$3,118',
  payingCustomers: 58,
  churn90d: { value: '8.6%', judgment: 'warning', label: 'Above 6% goal' },
  mrr: '$4,230',
  distribution: [
    { band: '$0 – $999', count: 14 },
    { band: '$1,000 – $2,499', count: 19 },
    { band: '$2,500 – $4,999', count: 13 },
    { band: '$5,000 – $9,999', count: 8 },
    { band: '$10,000+', count: 4 },
  ],
};

/* ============================================================
   Helios (FR-X1–X4)
   ============================================================ */
export const heliosHistory = [
  { id: 'h1', title: 'Why did ROAS spike on Jun 2?', date: 'Today', active: true },
  { id: 'h2', title: 'Which creative should I scale?', date: 'Yesterday' },
  { id: 'h3', title: 'Compare closers on show rate', date: 'Jun 9' },
  { id: 'h4', title: 'Draft a client update for May', date: 'Jun 2' },
];

export const heliosPinned = [
  { text: 'UGC Testimonial creative converts 2.1× account average on cold traffic.', date: 'Pinned Jun 5' },
  { text: '18 orphaned payments are deflating true ROAS by an estimated 0.4–0.6x.', date: 'Pinned Jun 3' },
];

export const heliosConversation = [
  { role: 'user', text: 'Why did ROAS spike on Jun 2?' },
  {
    role: 'helios',
    text:
      'Jun 2 hit 4.48x ROAS — your best day this month — on $1,209.84 of spend. Two deals closed for $5,414.92 total, ' +
      'both from calls booked through the UGC — Client Testimonial campaign (creative v3, 38% hook rate). ' +
      'The rest of the account was flat: without those two closes, the day lands at 0.00x.',
    drivers: [
      { label: 'UGC Testimonial — 2 closes', impact: '+$5,414.92 cash' },
      { label: 'CPC dropped to $0.26 (−10% d/d)', impact: '+4,681 clicks' },
      { label: 'Other campaigns', impact: '$0 cash' },
    ],
    actions: ['Scale UGC Testimonial budget +20%', 'Make this a recurring insight'],
  },
];

export const starterPrompts = [
  'What changed this week and why?',
  'Where am I losing the most cash in the funnel?',
  'Which campaign should I cut first?',
  'Summarize this month for my client',
];

/* ============================================================
   Command Center (FR-H1–H5). Today = Jun 6 — the partial day in
   the daily series (spend syncs ~10 AM, so spend/ROAS are "—",
   not "$0.00 / ↑0%" — FR-G2 made visible on the landing page).
   ============================================================ */
export const today = [
  { label: 'Spend today', value: null, display: '—', sub: 'Meta sync ~10 AM', mtd: money(kpis.adSpend.value), tooltip: 'No spend data for Jun 6 yet — Meta delivers spend in the morning sync. Undefined renders as "—", never "$0.00 ↑0%".' },
  { label: 'Calls booked', value: 2, display: '2', sub: 'of 1/day pace', mtd: '19 MTD', tooltip: '2 calls booked so far today. Monthly goal 25 → ~0.9/day pace needed.' },
  { label: 'Cash collected', value: 0, display: '$0.00', sub: 'no closes yet', mtd: money(kpis.cashCollected.value) + ' MTD', tooltip: 'No payments recorded today (a true zero — payments sync in real time).' },
  { label: 'ROAS today', value: null, display: '—', sub: 'needs spend data', mtd: ratio(kpis.roas.value) + ' MTD', tooltip: 'ROAS undefined until today\'s spend arrives (division by zero renders "—").' },
  { label: 'Closes', value: 0, display: '0', sub: '2 calls on calendar', mtd: '4 MTD', tooltip: 'Deals closed today. Two booked calls are still upcoming.' },
];

export const dailyBrief = {
  text:
    'You\'re at 1.24x ROAS for June — profitable but 38% below your 2.0x goal, driven almost entirely by two Jun 2 closes ' +
    'from the UGC Testimonial creative. Webinar Cost Cap has now burned $847 with zero leads and should be paused or rebuilt. ' +
    'Biggest lever today isn\'t ads: 18 unattributed payments (~$129.9K) are hiding your real ROAS — resolving the top 5 ' +
    'high-confidence matches would take about two minutes.',
};

export const attention = [
  { tone: 'negative', title: 'Cash Collected at 62% of monthly goal', detail: '$7,497.00 of $12,000 · 24 days left', action: 'Review funnel', target: 'Meta Insights' },
  { tone: 'negative', title: '18 orphaned payments worth $129,946', detail: '9 have high-confidence suggested matches ready to attach', action: 'Open Attribution Inbox', target: 'Attribution Inbox' },
  { tone: 'warning', title: 'Webinar Cost Cap: $847 spent, 0 leads', detail: 'Hook rate 9% — bottom decile for the account', action: 'Review campaign', target: 'Meta Insights' },
  { tone: 'warning', title: '2 calls flagged for review', detail: 'Closed-lost with scores 44 and 38 — objection handling gaps', action: 'Review calls', target: 'Calls' },
  { tone: 'negative', title: 'Monthly Client Report failed to send', detail: 'Invalid recipient address · Jun 1, 9:00 AM', action: 'Fix recipient', target: 'Scheduled Reports' },
];

export const quickActions = [
  { label: 'Ask Helios', icon: 'spark', target: 'Helios' },
  { label: 'New report', icon: 'send', target: 'Scheduled Reports' },
  { label: 'Review calls', icon: 'phone', target: 'Calls' },
  { label: 'Attribution Inbox', icon: 'inbox', target: 'Attribution Inbox' },
];
