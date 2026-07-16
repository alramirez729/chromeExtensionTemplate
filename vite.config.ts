import { resolve } from "node:path";
import { defineConfig, type UserConfig } from "vite";

const root = resolve(__dirname);

export type BuildTarget = "popup" | "options" | "background" | "content";

/**
 * Each target gets its own standalone Vite build (see scripts/build.mjs and
 * scripts/dev.mjs). Background and content scripts are bundled as single
 * IIFE files with no code-splitting, since MV3 content scripts and
 * classic-script service workers can't load separate chunks.
 */
export function getConfig(target: BuildTarget): UserConfig {
  const outDir = resolve(root, "dist");
  const shared: UserConfig = {
    publicDir: false,
    build: {
      outDir,
      emptyOutDir: false,
      sourcemap: true,
      minify: false,
    },
  };

  switch (target) {
    // popup/options each get `root` pointed at their own folder so the
    // built HTML lands flat at dist/popup.html / dist/options.html instead
    // of being nested under dist/src/....
    case "popup":
      return defineConfig({
        ...shared,
        root: resolve(root, "src/popup"),
        build: {
          ...shared.build,
          outDir,
          rollupOptions: {
            input: resolve(root, "src/popup/popup.html"),
          },
        },
      });

    case "options":
      return defineConfig({
        ...shared,
        root: resolve(root, "src/options"),
        build: {
          ...shared.build,
          outDir,
          rollupOptions: {
            input: resolve(root, "src/options/options.html"),
          },
        },
      });

    case "background":
      return defineConfig({
        ...shared,
        build: {
          ...shared.build,
          lib: {
            entry: resolve(root, "src/background/background.ts"),
            formats: ["es"],
            fileName: () => "background.js",
            name: "background",
          },
        },
      });

    case "content":
      return defineConfig({
        ...shared,
        build: {
          ...shared.build,
          lib: {
            entry: resolve(root, "src/content/content.ts"),
            formats: ["iife"],
            fileName: () => "content.js",
            name: "content",
          },
        },
      });
  }
}

// scripts/build.mjs and scripts/dev.mjs invoke Vite's JS API with
// `mode` set to one of the BuildTarget values below, so this file stays the
// single source of truth for all four target configs. Vite transpiles this
// TS config itself, so the build scripts never need to import it directly.
export default defineConfig(({ mode }) => getConfig(mode as BuildTarget));
