import Icon from './Icon.jsx';
import { attributionInboxCount } from '../data/gofunnel.js';
import { attribution } from '../data/modules.js';

const sections = [
  {
    label: 'Home',
    items: [{ name: 'Command Center', icon: 'home' }],
  },
  {
    label: 'Reports',
    items: [
      { name: 'Meta Insights', icon: 'chart' },
      { name: 'Calls', icon: 'phone' },
      { name: 'Pipeline', icon: 'pipeline' },
      { name: 'Payments', icon: 'card' },
    ],
  },
  {
    label: 'Attribution',
    items: [{ name: 'Attribution Inbox', icon: 'inbox', badge: attributionInboxCount }],
  },
  {
    label: 'AI',
    items: [{ name: 'Helios', icon: 'spark' }],
  },
  {
    label: 'Tools',
    items: [
      { name: 'Scheduled Reports', icon: 'send' },
      { name: 'Dashboards', icon: 'grid' },
      { name: 'Goals', icon: 'target' },
      { name: 'Theme', icon: 'palette' },
    ],
  },
];

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-mark">G</span>
        GoFunnel
      </div>
      <nav className="sidebar-nav">
        {sections.map((section) => (
          <div className="nav-section" key={section.label}>
            <div className="nav-section-label">{section.label}</div>
            {section.items.map((item) => (
              <button
                key={item.name}
                className={`nav-item${item.name === activePage ? ' active' : ''}`}
                aria-current={item.name === activePage ? 'page' : undefined}
                onClick={() => onNavigate(item.name)}
              >
                <Icon name={item.icon} />
                {item.name}
                {item.badge != null && <span className="nav-badge">{item.badge}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <button
        className="sidebar-health"
        onClick={() => onNavigate('Attribution Inbox')}
        title="Attributed cash + leads ÷ total, all time. Click to open the Attribution Inbox."
      >
        <div className="health-label">Attribution Health</div>
        <div className="health-value">{attribution.health}%</div>
        <div className="health-track">
          <div className="health-fill" style={{ width: `${attribution.health}%` }} />
        </div>
        <div className="health-sub">{attributionInboxCount} items need review</div>
      </button>
      <div className="sidebar-user">
        <span className="avatar">DG</span>
        <span className="user-email">design@gofunnel.test</span>
      </div>
    </aside>
  );
}
