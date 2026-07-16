import { cpSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const publicDir = resolve(root, "public");
const outDir = resolve(root, "dist");

export function copyStatic() {
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  cpSync(publicDir, outDir, { recursive: true });
  console.log("[copy-static] copied public/ -> dist/");
}

if (import.meta.url === `file://${process.argv[1]}`.replace(/\\/g, "/")) {
  copyStatic();
}
