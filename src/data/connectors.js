// Connectors (Flow & Connectors Brief §2.1). A connector is just data —
// adding a tool means adding one object to a category's `connectors` array,
// never new bespoke code. The presentation layer below is fully generic.
//
// Story consistency (Brief §2.1 note): Fanbasis is intentionally
// `action_needed`. Its expired token since May 28 is *why* several Fanbasis
// payments (p5/p10/p16 in modules.js) sit orphaned in the Attribution Inbox
// and why Attribution Health is only 11%. Do not change the orphaned data —
// this just gives that fact a visible cause.

// status: 'connected' | 'action_needed' | 'not_connected'
export const connectorCategories = [
  {
    category: 'Ad Platforms',
    blurb: 'Spend, impressions, clicks, campaign & creative performance.',
    connectors: [
      { id: 'meta', name: 'Meta Ads', mono: 'M', status: 'connected', account: 'DK Filler Ads (act_4471…)', lastSync: 'Jun 6, 10:02 AM', pulls: ['Spend', 'Impressions', 'Clicks', 'Campaigns', 'Creatives'] },
    ],
  },
  {
    category: 'CRM & Booking',
    blurb: 'Leads, pipeline stages, booked calls, recordings & transcripts.',
    connectors: [
      { id: 'ghl', name: 'GoHighLevel', mono: 'G', status: 'connected', account: 'dkfiller.gohighlevel.com', lastSync: 'Jun 6, 9:58 AM', pulls: ['Leads', 'Pipeline stages', 'Contacts'] },
      { id: 'calendly', name: 'Calendly', mono: 'C', status: 'connected', account: 'calendly.com/dkfiller', lastSync: 'Jun 6, 9:40 AM', pulls: ['Booked calls', 'No-shows'] },
      { id: 'fathom', name: 'Fathom', mono: 'F', status: 'connected', account: 'fathom.video · 2 seats', lastSync: 'Jun 5, 6:10 PM', pulls: ['Recordings', 'Transcripts', 'AI call scores'] },
    ],
  },
  {
    category: 'Payments',
    blurb: 'Cash collected, products, subscriptions — the cash side of ROAS.',
    connectors: [
      { id: 'stripe', name: 'Stripe', mono: 'S', status: 'connected', account: 'acct_1Q…DK', lastSync: 'Jun 6, 10:00 AM', pulls: ['Payments', 'Subscriptions', 'Refunds'] },
      { id: 'whop', name: 'Whop', mono: 'W', status: 'connected', account: 'whop.com/dkfiller', lastSync: 'Jun 6, 9:55 AM', pulls: ['Payments', 'Memberships'] },
      { id: 'fanbasis', name: 'Fanbasis', mono: 'Fb', status: 'action_needed', account: 'token expired May 28', lastSync: 'May 28, 3:12 PM', pulls: ['Payments'], note: 'Reconnect needed — some Fanbasis payments since May 28 are unmatched and sit in the Attribution Inbox.' },
    ],
  },
  {
    category: 'Alerts',
    blurb: 'Where goal breaches & Helios anomalies are delivered.',
    connectors: [
      { id: 'slack', name: 'Slack', mono: 'Sl', status: 'connected', account: '#gofunnel-alerts', lastSync: 'real-time', pulls: ['Outbound alerts'] },
    ],
  },
];

// "Add connector" catalog — providers not yet installed.
export const availableConnectors = [
  { id: 'tiktok', name: 'TikTok Ads', mono: 'T', category: 'Ad Platforms', pulls: ['Spend', 'Impressions', 'Clicks', 'Creatives'] },
  { id: 'google', name: 'Google Ads', mono: 'G', category: 'Ad Platforms', pulls: ['Spend', 'Clicks', 'Conversions'] },
  { id: 'hubspot', name: 'HubSpot', mono: 'H', category: 'CRM & Booking', pulls: ['Leads', 'Deals', 'Contacts'] },
  { id: 'paypal', name: 'PayPal', mono: 'P', category: 'Payments', pulls: ['Payments', 'Refunds'] },
  { id: 'gmail', name: 'Email (SMTP)', mono: '@', category: 'Alerts', pulls: ['Outbound alerts'] },
];

export const STATUS_META = {
  connected: { tone: 'positive', label: 'Connected' },
  action_needed: { tone: 'warning', label: 'Action needed' },
  not_connected: { tone: 'neutral', label: 'Not connected' },
};
