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

for (const target of targets) {
  console.log(`\n[build] ${target}`);
  await build({ configFile, mode: target });
}

copyStatic();

console.log("\n[build] done -> dist/ (load this folder as an unpacked extension)");
