import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reportsDir = path.join(root, "public", "reports");
const outputFile = path.join(root, "src", "generated", "reports.ts");

const htmlEntityMap = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};

async function collectHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) return collectHtmlFiles(absolute);
      if (entry.isFile() && entry.name.endsWith(".html")) return [absolute];
      return [];
    }),
  );

  return files.flat();
}

function decodeHtml(value) {
  return value.replace(/&(amp|lt|gt|quot|#39);/g, (entity) => htmlEntityMap[entity] ?? entity);
}

function stripTags(value) {
  return decodeHtml(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}

function getTitle(html, fallback) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  return title ? stripTags(title) : fallback;
}

function getMeta(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta\\s+[^>]*name=["']${escaped}["'][^>]*content=["']([^"']*)["'][^>]*>`, "i"),
    new RegExp(`<meta\\s+[^>]*content=["']([^"']*)["'][^>]*name=["']${escaped}["'][^>]*>`, "i"),
    new RegExp(`<meta\\s+[^>]*property=["']${escaped}["'][^>]*content=["']([^"']*)["'][^>]*>`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtml(match[1].trim());
  }

  return "";
}

function getLang(html) {
  const lang = html.match(/<html[^>]*lang=["']([^"']+)["']/i)?.[1]?.trim();
  if (!lang) return "unknown";
  if (lang.toLowerCase().startsWith("zh")) return "zh-CN";
  if (lang.toLowerCase().startsWith("en")) return "en";
  return "mixed";
}

function countWords(html) {
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  const text = stripTags(body);
  const latinWords = text.match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g)?.length ?? 0;
  const cjkChars = text.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  return latinWords + Math.ceil(cjkChars / 2);
}

function toSlug(file) {
  return path.basename(file, ".html").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function toDate(value, fallback) {
  const fallbackIso = fallback.toISOString();
  const fallbackDatetime = `${fallbackIso.slice(0, 10)} ${fallbackIso.slice(11, 16)}`;
  const raw = value || fallbackDatetime;
  const fullMatch = raw.match(/\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/);
  if (fullMatch) return fullMatch[0].replace("T", " ");
  const dateMatch = raw.match(/\d{4}-\d{2}-\d{2}/);
  if (dateMatch) return `${dateMatch[0]} ${fallbackIso.slice(11, 16)}`;
  return raw;
}

function toTags(value) {
  if (!value) return [];
  return value
    .split(/[,/]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 8);
}

async function buildRecord(file) {
  const html = await readFile(file, "utf8");
  const relative = path.relative(path.join(root, "public"), file).split(path.sep).join("/");
  const info = await stat(file);
  const title = getMeta(html, "iris:title") || getMeta(html, "og:title") || getTitle(html, toSlug(file));
  const summary =
    getMeta(html, "iris:summary") ||
    getMeta(html, "description") ||
    getMeta(html, "og:description") ||
    "Self-contained Iris report.";

  return {
    id: getMeta(html, "iris:id") || toSlug(file),
    title,
    summary,
    href: relative,
    language: getMeta(html, "iris:language") || getLang(html),
    mode: getMeta(html, "iris:mode") || "analysis",
    date: toDate(getMeta(html, "iris:date") || getMeta(html, "date"), info.mtime),
    tags: toTags(getMeta(html, "iris:tags")),
    wordCount: countWords(html),
  };
}

const files = (await collectHtmlFiles(reportsDir)).sort();
const reports = await Promise.all(files.map(buildRecord));
reports.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

const source = `import type { ReportRecord } from "../types";

export const reports: ReportRecord[] = ${JSON.stringify(reports, null, 2)};
`;

await writeFile(outputFile, source);
console.log(`Indexed ${reports.length} report${reports.length === 1 ? "" : "s"}.`);
