import { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import NarrativeBar from './components/NarrativeBar.jsx';
import KpiRow from './components/KpiRow.jsx';
import FunnelStrip from './components/FunnelStrip.jsx';
import ChartRow from './components/ChartRow.jsx';
import SecondaryMetrics from './components/SecondaryMetrics.jsx';
import DailyTable from './components/DailyTable.jsx';
import ReportsPage from './components/ReportsPage.jsx';
import CommandCenter from './components/CommandCenter.jsx';
import AttributionInbox from './components/AttributionInbox.jsx';
import GoalsPage from './components/GoalsPage.jsx';
import CallsPage from './components/CallsPage.jsx';
import PipelinePage from './components/PipelinePage.jsx';
import PaymentsPage from './components/PaymentsPage.jsx';
import HeliosPage from './components/HeliosPage.jsx';
import AdsManager from './components/AdsManager.jsx';
import CreativesTab from './components/CreativesTab.jsx';
import SegmentsTab from './components/SegmentsTab.jsx';
import HistoricalTab from './components/HistoricalTab.jsx';
import DashboardsPage from './components/DashboardsPage.jsx';
import ThemePage from './components/ThemePage.jsx';
import ConnectionsPage from './components/ConnectionsPage.jsx';
import { connectorCategories, availableConnectors } from './data/connectors.js';

const metaTabs = ['Meta Overview', 'Ads Manager', 'Creatives', 'Segmented Insights', 'Historical'];

function MetaInsights({ onNavigate }) {
  const [tab, setTab] = useState('Meta Overview');
  return (
    <>
      <nav className="tabbar" aria-label="Meta Insights tabs">
        {metaTabs.map((t) => (
          <button key={t} className={t === tab ? 'active' : ''} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </nav>
      {tab === 'Meta Overview' && (
        <>
          <NarrativeBar onNavigate={onNavigate} />
          <KpiRow />
          <FunnelStrip />
          <ChartRow onNavigate={onNavigate} />
          <SecondaryMetrics />
          <DailyTable />
        </>
      )}
      {tab === 'Ads Manager' && <AdsManager onNavigate={onNavigate} />}
      {tab === 'Creatives' && <CreativesTab />}
      {tab === 'Segmented Insights' && <SegmentsTab />}
      {tab === 'Historical' && <HistoricalTab />}
    </>
  );
}

// Breadcrumb + date-range metadata per route. The component body owns the
// element rendering so stateful pages (Connections, Command Center banner)
// can read the lifted connector state.
const pageMeta = {
  'Command Center': { breadcrumb: ['Home', 'Command Center'], dateRange: true },
  'Meta Insights': { breadcrumb: ['Reports', 'Meta Insights'], dateRange: true },
  'Calls': { breadcrumb: ['Reports', 'Calls'], dateRange: true },
  'Pipeline': { breadcrumb: ['Reports', 'Pipeline'], dateRange: true },
  'Payments': { breadcrumb: ['Reports', 'Payments'], dateRange: true },
  'Attribution Inbox': { breadcrumb: ['Attribution', 'Attribution Inbox'], dateRange: false },
  'Helios': { breadcrumb: ['AI', 'Helios'], dateRange: false },
  'Scheduled Reports': { breadcrumb: ['Tools', 'Automated Reports'], dateRange: false },
  'Dashboards': { breadcrumb: ['Tools', 'Dashboards'], dateRange: true },
  'Goals': { breadcrumb: ['Tools', 'Goals & Alerts'], dateRange: false },
  'Theme': { breadcrumb: ['Tools', 'Theme'], dateRange: false },
  'Connections': { breadcrumb: ['Settings', 'Connections'], dateRange: false },
};

export default function App() {
  const [page, setPage] = useState('Command Center');
  // Connector state is lifted so the Connections page can mutate it and the
  // Command Center setup banner can react to it (Brief §2–§3).
  const [connectors, setConnectors] = useState(connectorCategories);
  const [available, setAvailable] = useState(availableConnectors);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const meta = pageMeta[page];
  const navigate = (name) => pageMeta[name] && setPage(name);

  const unhealthy = connectors.flatMap((c) => c.connectors).filter((c) => c.status !== 'connected');

  function renderPage() {
    switch (page) {
      case 'Command Center':
        return (
          <CommandCenter
            onNavigate={navigate}
            unhealthy={unhealthy}
            bannerDismissed={bannerDismissed}
            onDismissBanner={() => setBannerDismissed(true)}
          />
        );
      case 'Meta Insights': return <MetaInsights onNavigate={navigate} />;
      case 'Calls': return <CallsPage />;
      case 'Pipeline': return <PipelinePage onNavigate={navigate} />;
      case 'Payments': return <PaymentsPage onNavigate={navigate} />;
      case 'Attribution Inbox': return <AttributionInbox />;
      case 'Helios': return <HeliosPage onNavigate={navigate} />;
      case 'Scheduled Reports': return <ReportsPage />;
      case 'Dashboards': return <DashboardsPage />;
      case 'Goals': return <GoalsPage />;
      case 'Theme': return <ThemePage />;
      case 'Connections':
        return (
          <ConnectionsPage
            connectors={connectors}
            setConnectors={setConnectors}
            available={available}
            setAvailable={setAvailable}
          />
        );
      default: return null;
    }
  }

  return (
    <div className="shell">
      <Sidebar activePage={page} onNavigate={navigate} />
      <div className="shell-main">
        <Topbar breadcrumb={meta.breadcrumb} showDateRange={meta.dateRange} onNavigate={navigate} />
        <main className="shell-content">
          <div className="page">{renderPage()}</div>
        </main>
      </div>
    </div>
  );
}
