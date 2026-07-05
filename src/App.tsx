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
  const parts = value.split(/[T ]/);
  const datePart = parts[0];
  const timePart = parts[1] ?? "";
  const [y, m, d] = datePart.split("-");
  if (!y || !m || !d) return value;
  const dateStr = `${y}/${m}/${d}`;
  if (timePart && timePart !== "00:00") return `${dateStr} · ${timePart}`;
  return dateStr;
}

function formatShortDate(value: string) {
  if (!value) return "";
  const parts = value.split(/[T ]/);
  const datePart = parts[0];
  const segments = datePart.split("-");
  if (segments.length < 3) return datePart;
  return `${segments[1]}/${segments[2]}`;
}

function formatWordCount(value: number) {
  if (!value) return "";
  return `${new Intl.NumberFormat("en-US").format(value)} words`;
}

function formatMode(value: string) {
  if (!value) return "Report";
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
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
          <div className="masthead-row">
            <span>Iris / report shelf</span>
            <span>{sortedReports.length.toString().padStart(2, "0")} reports</span>
          </div>
          <div className="title-copy">
            <h1>{shelfProfile.title}</h1>
            <p className="deck" lang="zh-CN">{shelfProfile.deck}</p>
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
        </header>

        <div className="index-label" aria-hidden="true">
          <span>Latest reports</span>
        </div>
        <section className="report-grid" aria-label="Reports">
          {sortedReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </section>

        <footer className="shelf-footer">
          <p className="footer-text">
            Built with{" "}
            <a href="https://github.com/iCyris/Iris-Shelf" target="_blank" rel="noreferrer">
              Iris Shelf
            </a>{" "}
            ·{" "}
            <a href="https://cyris.moe/" target="_blank" rel="noreferrer">
              Cyris
            </a>
          </p>
        </footer>
      </main>
    </>
  );
}

function ReportCard({ report }: { report: ReportRecord }) {
  const langLabel =
    report.language === "zh-CN" ? "Chinese" : report.language === "en" ? "English" : "";
  const usefulSummary =
    report.summary && report.summary !== "Self-contained Iris report."
      ? report.summary
      : report.language === "zh-CN"
        ? "一篇完整的 Iris 报告，把判断、证据与余地放回同一张纸面。"
        : "A self-contained Iris report, shaped for a complete read.";
  const wordCount = formatWordCount(report.wordCount);
  const readLabel = report.language === "zh-CN" ? "阅读报告" : "Read report";
  const shortDate = formatShortDate(report.date);

  return (
    <a
      className="report-card"
      href={withBase(report.href)}
      aria-label={`${readLabel}: ${report.title}`}
      data-lang={report.language}
    >
      <span className="entry-date" aria-hidden="true">{shortDate}</span>
      <span className="entry-main">
        <span className="entry-kicker">
          <span>{formatMode(report.mode)}</span>
          {langLabel && <span>{langLabel}</span>}
          <span>{formatDate(report.date)}</span>
        </span>
        <h2 lang={report.language}>
          <svg className="hover-mark" width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden="true">
            <path d="M1 6h8M7.5 2.5l3 3.5-3 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {report.title}
        </h2>
        <span className="entry-summary" lang={report.language}>{usefulSummary}</span>
        {report.tags.length > 0 && (
          <span className="entry-tags">{report.tags.join(" / ")}</span>
        )}
      </span>
      <span className="entry-aside">
        {wordCount && <span className="entry-words">{wordCount}</span>}
      </span>
    </a>
  );
}
