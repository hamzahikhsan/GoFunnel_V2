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
          <ChartRow />
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

const pages = {
  'Command Center': { breadcrumb: ['Home', 'Command Center'], dateRange: true, render: (nav) => <CommandCenter onNavigate={nav} /> },
  'Meta Insights': { breadcrumb: ['Reports', 'Meta Insights'], dateRange: true, render: (nav) => <MetaInsights onNavigate={nav} /> },
  'Calls': { breadcrumb: ['Reports', 'Calls'], dateRange: true, render: () => <CallsPage /> },
  'Pipeline': { breadcrumb: ['Reports', 'Pipeline'], dateRange: true, render: (nav) => <PipelinePage onNavigate={nav} /> },
  'Payments': { breadcrumb: ['Reports', 'Payments'], dateRange: true, render: (nav) => <PaymentsPage onNavigate={nav} /> },
  'Attribution Inbox': { breadcrumb: ['Attribution', 'Attribution Inbox'], dateRange: false, render: () => <AttributionInbox /> },
  'Helios': { breadcrumb: ['AI', 'Helios'], dateRange: false, render: (nav) => <HeliosPage onNavigate={nav} /> },
  'Scheduled Reports': { breadcrumb: ['Tools', 'Automated Reports'], dateRange: false, render: () => <ReportsPage /> },
  'Dashboards': { breadcrumb: ['Tools', 'Dashboards'], dateRange: true, render: () => <DashboardsPage /> },
  'Goals': { breadcrumb: ['Tools', 'Goals & Alerts'], dateRange: false, render: () => <GoalsPage /> },
  'Theme': { breadcrumb: ['Tools', 'Theme'], dateRange: false, render: () => <ThemePage /> },
};

export default function App() {
  const [page, setPage] = useState('Command Center');
  const current = pages[page];
  const navigate = (name) => pages[name] && setPage(name);

  return (
    <div className="shell">
      <Sidebar activePage={page} onNavigate={navigate} />
      <div className="shell-main">
        <Topbar breadcrumb={current.breadcrumb} showDateRange={current.dateRange} />
        <main className="shell-content">
          <div className="page">{current.render(navigate)}</div>
        </main>
      </div>
    </div>
  );
}
