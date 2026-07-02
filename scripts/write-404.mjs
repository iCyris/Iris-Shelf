import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "docs");

await mkdir(outDir, { recursive: true });
await copyFile(path.join(outDir, "index.html"), path.join(outDir, "404.html"));
console.log("Wrote docs/404.html for GitHub Pages fallback.");
