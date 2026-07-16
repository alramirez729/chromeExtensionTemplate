import { rmSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { build } from "vite";
import { copyStatic } from "./copy-static.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const outDir = resolve(root, "dist");
const configFile = resolve(root, "vite.config.ts");

const targets = ["popup", "options", "background", "content"];

if (existsSync(outDir)) {
  rmSync(outDir, { recursive: true, force: true });
}

copyStatic();
console.log(
  "[dev] note: manifest.json/icons are only copied once at startup — restart `npm run dev` after editing files in public/\n",
);

// Each target runs its own persistent Rollup watcher; they all write into
// the same dist/ folder independently.
await Promise.all(
  targets.map((target) =>
    build({ configFile, mode: target, build: { watch: {} } }),
  ),
);

console.log(
  "[dev] watching popup, options, background, content -> dist/ (load dist/ as an unpacked extension, reload it after each rebuild)",
);
