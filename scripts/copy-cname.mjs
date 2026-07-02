import { copyFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "CNAME");
const dest = path.join(root, "docs", "CNAME");

try {
  await access(src);
  await copyFile(src, dest);
  console.log("Copied CNAME into docs/ for GitHub Pages custom domain.");
} catch {
  console.log("No CNAME file at repo root — skipping custom domain setup.");
}