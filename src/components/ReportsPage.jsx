import { useState } from 'react';
import { reports as seedReports, statusTone, templates } from '../data/reports.js';
import ReportBuilder from './ReportBuilder.jsx';

// Abstract block skeleton standing in for a template preview thumbnail (FR-R1)
function TemplateThumb({ blocks }) {
  return (
    <div className="template-thumb" aria-hidden="true">
      {blocks[0] === 'empty' ? (
        <span className="thumb-empty">+</span>
      ) : (
        blocks.map((b, i) => <span key={i} className={`thumb-block thumb-${b}`} />)
      )}
    </div>
  );
}

function TemplateGallery({ onPick }) {
  return (
    <section aria-label="Report templates">
      <div className="section-head">
        <h2 className="section-title">Start from a template</h2>
        <span className="section-sub">Pre-built blocks and schedule — rename and send</span>
      </div>
      <div className="template-grid">
        {templates.map((t) => (
          <button className="card template-card" key={t.name} onClick={() => onPick(t)}>
            <TemplateThumb blocks={t.blocks} />
            <div className="template-name">{t.name}</div>
            {t.cadence && <div className="template-cadence">{t.cadence}</div>}
            <p className="template-desc">{t.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

const filters = ['All', 'Scheduled', 'Draft', 'Paused', 'Error'];

function ReportList({ reports, onFix }) {
  const [filter, setFilter] = useState('All');
  const visible = filter === 'All' ? reports : reports.filter((r) => r.status === filter);

  return (
    <section aria-label="Your reports">
      <div className="section-head">
        <h2 className="section-title">Your reports</h2>
        <div className="segmented" role="group" aria-label="Filter by status">
          {filters.map((f) => (
            <button key={f} className={f === filter ? 'active' : ''} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="report-list">
        {visible.map((r) => (
          <ReportCard key={r.name} report={r} onFix={onFix} />
        ))}
        {visible.length === 0 && (
          <div className="card empty-state">
            <div className="empty-title">No {filter.toLowerCase()} reports</div>
            <p>Reports appear here once one reaches the “{filter}” state.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function ReportCard({ report, onFix }) {
  const incomplete = report.checklist?.filter((c) => !c.done) ?? [];
  return (
    <article className="card report-card">
      <div className="report-main">
        <div className="report-title-row">
          <span className="report-name">{report.name}</span>
          <span className={`pill ${statusTone[report.status]}`}>
            <span className="dot" />
            {report.status}
          </span>
        </div>
        <div className="report-meta">
          <span>{report.cadence}</span>
          {report.timezone && <span>· {report.timezone}</span>}
          <span>
            ·{' '}
            {report.recipients.length > 0
              ? `${report.recipients.length} recipient${report.recipients.length > 1 ? 's' : ''}`
              : 'No recipients yet'}
          </span>
        </div>
        {report.status === 'Draft' && incomplete.length > 0 && (
          <div className="report-checklist">
            {incomplete.length} step{incomplete.length > 1 ? 's' : ''} before this can send:{' '}
            {incomplete.map((c) => c.label).join(' · ')}
          </div>
        )}
        {report.status === 'Error' && (
          <div className="report-error">
            {report.lastSent.result} —{' '}
            <button className="link-inline" onClick={() => onFix(report)}>fix recipient</button>
          </div>
        )}
      </div>
      <div className="report-side">
        {report.nextRun && (
          <div className="report-side-item">
            <span className="side-label">Next run</span>
            <span className="side-value">{report.nextRun}</span>
          </div>
        )}
        {report.lastSent && report.status !== 'Error' && (
          <div className="report-side-item">
            <span className="side-label">Last sent</span>
            <span className="side-value">
              {report.lastSent.date}
              {report.lastSent.openRate && ` · ${report.lastSent.openRate} opened`}
            </span>
          </div>
        )}
        {!report.nextRun && !report.lastSent && (
          <div className="report-side-item">
            <span className="side-label">Last edited</span>
            <span className="side-value">Jun 12, 4:12 PM</span>
          </div>
        )}
      </div>
    </article>
  );
}

export default function ReportsPage() {
  const [reports, setReports] = useState(seedReports);
  // builder: null | { template?, initial? } — template comes from the
  // gallery, initial from "fix recipient" on an existing report
  const [builder, setBuilder] = useState(null);

  function publish({ name, recipients, cadence, timezone, blocks }) {
    const next = {
      name,
      status: 'Scheduled',
      cadence,
      timezone,
      nextRun: cadence.startsWith('Daily') ? 'Jun 14, 7:30 AM' : cadence.startsWith('Weekly') ? 'Jun 15, 8:00 AM' : 'Jul 1, 9:00 AM',
      recipients,
      blocks,
      lastSent: null,
    };
    setReports([next, ...reports.filter((r) => r.name !== name)]);
    setBuilder(null);
  }

  if (builder) {
    return (
      <ReportBuilder
        template={builder.template}
        initial={builder.initial}
        onClose={() => setBuilder(null)}
        onPublish={publish}
      />
    );
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Automated Reports</h1>
          <p className="page-sub">Design once, deliver on schedule — email, Slack or PDF.</p>
        </div>
        <button className="btn-primary" onClick={() => setBuilder({})}>
          New report
        </button>
      </div>
      <TemplateGallery onPick={(t) => setBuilder({ template: t })} />
      <ReportList
        reports={reports}
        onFix={(r) =>
          setBuilder({
            initial: { name: r.name, recipients: [], cadence: r.cadence, timezone: r.timezone, blocks: ['title', 'kpi', 'table'] },
          })
        }
      />
    </>
  );
}
