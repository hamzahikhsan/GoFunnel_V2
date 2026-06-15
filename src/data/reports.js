// Automated Reports demo data (PRD §5.9). Statuses are honest and mutually
// exclusive: Draft / Scheduled / Paused / Error / Sent — no zombie
// "Untitled · Paused · 0 recipients" records (FR-R2).

export const templates = [
  {
    name: 'Daily Ops Pulse',
    cadence: 'Daily',
    description: 'Spend, ROAS, calls and cash from yesterday — in your inbox before standup.',
    blocks: ['kpi', 'kpi', 'chart'],
  },
  {
    name: 'Weekly Executive Summary',
    cadence: 'Weekly',
    description: 'Narrative summary, KPI table and funnel trend for owners and stakeholders.',
    blocks: ['title', 'text', 'chart'],
  },
  {
    name: 'Monthly Client Report',
    cadence: 'Monthly',
    description: 'Client-ready PDF: results vs goals, creative highlights, next-month plan.',
    blocks: ['title', 'kpi', 'table'],
  },
  {
    name: 'Closer Leaderboard',
    cadence: 'Weekly',
    description: 'Calls taken, show rate, close rate and cash per closer, ranked.',
    blocks: ['table', 'chart'],
  },
  {
    name: 'Start from scratch',
    cadence: null,
    description: 'Blank canvas with the full block library: KPI cards, tables, charts, text.',
    blocks: ['empty'],
  },
];

export const reports = [
  {
    name: 'Weekly Executive Summary',
    status: 'Scheduled',
    cadence: 'Weekly · Mon 8:00 AM',
    timezone: 'Asia/Jakarta',
    nextRun: 'Jun 15, 8:00 AM',
    recipients: ['daniel@dkfiller.com', 'ops@dkfiller.com', '#exec-reports (Slack)'],
    lastSent: { date: 'Jun 8, 8:00 AM', result: 'Delivered', openRate: '67%' },
  },
  {
    name: 'Daily Ops Pulse',
    status: 'Scheduled',
    cadence: 'Daily · 7:30 AM',
    timezone: 'Asia/Jakarta',
    nextRun: 'Jun 14, 7:30 AM',
    recipients: ['team@dkfiller.com'],
    lastSent: { date: 'Jun 13, 7:30 AM', result: 'Delivered', openRate: '82%' },
  },
  {
    name: 'Monthly Client Report — DK Filler',
    status: 'Error',
    cadence: 'Monthly · 1st, 9:00 AM',
    timezone: 'Asia/Jakarta',
    nextRun: 'Retry pending',
    recipients: ['client@dkfiller.com'],
    lastSent: { date: 'Jun 1, 9:00 AM', result: 'Send failed — invalid recipient address', openRate: null },
  },
  {
    name: 'Closer Leaderboard',
    status: 'Paused',
    cadence: 'Weekly · Fri 5:00 PM',
    timezone: 'Asia/Jakarta',
    nextRun: 'Paused by you, Jun 5',
    recipients: ['sales@dkfiller.com'],
    lastSent: { date: 'May 30, 5:00 PM', result: 'Delivered', openRate: '54%' },
  },
  {
    name: 'Creative performance recap',
    status: 'Draft',
    cadence: 'Not scheduled yet',
    timezone: null,
    nextRun: null,
    recipients: [],
    lastSent: null,
    checklist: [
      { label: 'Name report', done: true },
      { label: 'Add ≥ 1 recipient', done: false },
      { label: 'Set schedule', done: false },
    ],
  },
];

export const statusTone = {
  Scheduled: 'positive',
  Sent: 'positive',
  Draft: 'neutral',
  Paused: 'neutral',
  Error: 'negative',
};
