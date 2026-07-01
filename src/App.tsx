import { shelfProfile } from "./content/shelf";
import { reports } from "./generated/reports";
import type { ReportRecord } from "./types";

const collator = new Intl.Collator("zh-CN", { numeric: true });

function withBase(path: string) {
  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${base}${path.replace(/^\//, "")}`;
}

function formatDate(value: string) {
  if (!value) return "Undated";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function sortReports(list: ReportRecord[]) {
  return [...list].sort((a, b) => {
    const dateOrder = b.date.localeCompare(a.date);
    return dateOrder || collator.compare(a.title, b.title);
  });
}

export default function App() {
  const sortedReports = sortReports(reports);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <main className="page-shell" id="main-content">
        <header className="shelf-header">
          <div className="brand-row">
            <p className="eyebrow">Iris / shelf</p>
          </div>
          <a
            className="logo-link"
            href="https://github.com/iCyris/Iris"
            target="_blank"
            rel="noreferrer"
            aria-label="Open iCyris/Iris on GitHub"
          >
            <img src={withBase("assets/iris-mark-transparent.png")} alt="" />
          </a>
          <div className="title-copy">
            <h1>{shelfProfile.title}</h1>
            <p className="deck">{shelfProfile.deck}</p>
          </div>
        </header>

        <section className="report-grid" aria-label="Reports">
          {sortedReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </section>
      </main>
    </>
  );
}

function ReportCard({ report }: { report: ReportRecord }) {
  return (
    <a className="report-card" href={withBase(report.href)}>
      <span className="report-date">{formatDate(report.date)}</span>
      <h2>{report.title}</h2>
      <p>{report.summary}</p>
      {report.tags.length > 0 && (
        <span className="report-tags">{report.tags.join(" / ")}</span>
      )}
    </a>
  );
}
