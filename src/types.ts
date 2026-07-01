export type ReportLanguage = "zh-CN" | "en" | "mixed" | "unknown";

export type ReportRecord = {
  id: string;
  title: string;
  summary: string;
  href: string;
  language: ReportLanguage;
  mode: string;
  date: string;
  tags: string[];
  wordCount: number;
};
