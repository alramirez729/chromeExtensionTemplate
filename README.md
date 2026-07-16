# Chrome Extension Starter Template

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![CI](https://github.com/your-org/your-repo/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/your-repo/actions/workflows/ci.yml)

A minimal, opinionated scaffold for building **Manifest V3** Chrome
extensions with TypeScript, Vite, ESLint/Prettier, and Vitest already wired
up — plus a small working example (popup → content script → background →
storage) so you can verify everything works the moment you clone it.

This is a blank slate. It does not contain any specific extension's business
logic — just enough structure and tooling to be a sane starting point for
popup + background + content-script + options-page + storage extensions.

## Who this is for

Anyone starting a new Chrome extension who wants:

- Manifest V3 out of the box
- TypeScript with a sane `tsconfig`
- A bundler (Vite) that produces a ready-to-load `dist/` folder
- ESLint + Prettier already configured for extension code (`chrome.*`
  globals, service worker + content script environments)
- A minimal example wiring popup ↔ content script ↔ background ↔ storage,
  so you know the scaffold actually works before you build on it

If you want React/Vue, a design system, or cross-browser polyfills baked in
by default, this probably isn't for you — see [Non-goals](#non-goals) below
for how to layer those in yourself.

## Quick start

```bash
git clone https://github.com/your-org/your-repo.git my-extension
cd my-extension
npm install
npm run dev
```

Then, in Chrome:

1. Go to `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked** and select the `dist/` folder
4. Click the extension icon in the toolbar and try **"Count links on this
   page"** on any regular `http(s)://` tab

`npm run dev` rebuilds on file changes, but Chrome does not hot-reload
extensions automatically — after a rebuild, click the reload icon for the
extension on `chrome://extensions` (and reload the page for content-script
changes to take effect).

> `public/manifest.json` and `public/icons/*` are only copied into `dist/`
> once, at dev-server startup. If you edit either, restart `npm run dev`.

## Project structure

```
/src
  /background        service worker (src/background/background.ts)
  /content            content script (src/content/content.ts)
  /popup              popup UI: popup.html, popup.ts, popup.css
  /options             options page UI: options.html, options.ts, options.css
  /shared             utils shared across all of the above:
                         constants.ts   message types + storage keys
                         messaging.ts   typed wrappers around chrome.runtime /
                                        chrome.tabs messaging
                         storage.ts     typed wrappers around chrome.storage
                         format.ts      a plain utility function (see tests)
/public
  manifest.json        MV3 manifest — copied into dist/ as-is
  /icons               icon16.png / icon48.png / icon128.png
/dist                  build output — load this in chrome://extensions (gitignored)
/scripts
  build.mjs             production build (see "Build system" below)
  dev.mjs                watch-mode build for local dev
  copy-static.mjs       copies public/ -> dist/
vite.config.ts          per-target Vite config (popup/options/background/content)
vitest.config.ts        unit test config
eslint.config.js        flat ESLint config
.prettierrc.json        Prettier config
```

## The example functionality

A tiny, self-contained example proves the wiring works end-to-end:

1. **Popup** — click "Count links on this page". It messages the content
   script in the active tab.
2. **Content script** — counts `<a>` tags on the page and replies with the
   count. It also reads a setting from `chrome.storage.sync` on load and, if
   enabled, outlines every link on the page.
3. **Background service worker** — listens for the result, stores it in
   `chrome.storage.local` (per-device), and logs it.
4. **Options page** — a single checkbox ("Highlight links on every page"),
   persisted to `chrome.storage.sync` (follows the user's signed-in Chrome
   profile), read by the content script.

Delete or replace all of this once you understand how the pieces connect —
none of it is meant to survive into a real extension.

## Build system

There's no single `vite build` here. MV3 content scripts and classic-script
service workers can't load separate JS chunks the way a web page can, so
`vite.config.ts` exports a `getConfig(target)` factory — one standalone,
non-code-splitting build per target (`popup`, `options`, `background`,
`content`). `scripts/build.mjs` / `scripts/dev.mjs` run all four via Vite's
JS API and merge the output into `dist/`.

- `npm run build` — clean production build → `dist/`
- `npm run dev` — same four builds in watch mode, output → `dist/`

If you'd rather use a single unified build (accepting some duplication in
the content/background bundles), look at
[`@crxjs/vite-plugin`](https://github.com/crxjs/chrome-extension-tools) as a
drop-in alternative — it wasn't used here to keep the dependency list small
and the config easy to read end-to-end.

## Scripts

| Command                | What it does                                  |
| ----------------------- | ---------------------------------------------- |
| `npm run dev`           | Watch-mode build → `dist/`                    |
| `npm run build`         | Production build → `dist/`                    |
| `npm run lint`          | ESLint, zero warnings allowed                 |
| `npm run lint:fix`      | ESLint with `--fix`                           |
| `npm run format`        | Prettier, writes changes                      |
| `npm run format:check`  | Prettier, check only (used in CI)             |
| `npm run typecheck`     | `tsc --noEmit`                                |
| `npm test`               | Run unit tests (Vitest)                       |

## Post-clone checklist

Files to edit when starting a new extension from this template:

- [ ] `public/manifest.json` — `name`, `short_name`, `description`,
      `version`, and review `permissions` / `host_permissions`
      (see [Manifest fields](#manifest-fields) below)
- [ ] `public/icons/icon16.png`, `icon48.png`, `icon128.png` — replace the
      generated placeholder icons with real artwork (same filenames/sizes)
- [ ] `package.json` — `name`, `description`, `version`
- [ ] `README.md` — replace this file with docs for your actual extension
- [ ] `LICENSE` — update the copyright holder, or replace the license
      entirely if MIT doesn't fit
- [ ] Every `MY_EXTENSION_NAME` / `MY_EXTENSION_DESCRIPTION` placeholder in
      `src/popup/popup.html`, `src/options/options.html`,
      `src/background/background.ts` — search the repo for `MY_EXTENSION_`
      to find them all
- [ ] Delete or replace the example functionality described above
      (`COUNT_LINKS`/`LINKS_COUNTED` messages, the highlight toggle) once
      you no longer need it as a reference
- [ ] `.github/workflows/ci.yml` — update the badge URL at the top of this
      README to point at your repo
- [ ] In GitHub repo **Settings → General**, enable **"Template
      repository"** so others can click **"Use this template"**

## Manifest fields

`manifest.json` doesn't support comments, so here's what each section does
and how to extend it:

| Field                | Purpose                                                                 |
| --------------------- | ------------------------------------------------------------------------ |
| `manifest_version`     | Always `3` here — this template does not support MV2.                  |
| `name` / `short_name` / `description` / `version` | Shown in the Chrome Web Store and `chrome://extensions`. Rename these first. |
| `icons`                 | Toolbar/store icons at 16/48/128px. Referenced from `public/icons/`.  |
| `action.default_popup`   | HTML shown when the toolbar icon is clicked (`src/popup`).           |
| `background.service_worker` | The MV3 background script. `"type": "module"` lets it use ES `import`. |
| `content_scripts`         | Scripts auto-injected into matching pages. `matches: ["<all_urls>"]` is broad on purpose for the demo — narrow it to your actual target sites (e.g. `"https://example.com/*"`) before shipping. |
| `options_page`             | HTML for the extension's settings page (`src/options`).            |
| `permissions`               | Chrome API permissions. Starts with just `storage` + `activeTab` — the minimum the example needs. |
| `host_permissions`           | Origins the extension can access without a content script (e.g. for `fetch` from the background worker). Starts empty — add specific origins as needed, and avoid `<all_urls>` unless you truly need it (it triggers extra scrutiny in Chrome Web Store review and a scarier install prompt for users). |

### Adding permissions safely

- Only request what you use — reviewers and users can both see the
  permission list, and unused permissions are a common review rejection
  reason.
- Prefer `activeTab` (no prompt, only grants access when the user invokes
  the extension) over broad `host_permissions` when possible.
- If you do need specific hosts, list them explicitly
  (`"https://api.example.com/*"`) rather than reaching for `<all_urls>`.

## TypeScript vs. plain JavaScript

The template ships with TypeScript because the shared messaging/storage
helpers benefit from typed message shapes. If you'd rather use plain JS:

1. Rename `.ts` files to `.js` (drop the type-only syntax — annotations,
   `interface`s, `as` casts, generics).
2. Remove `typescript`, `typescript-eslint`, and `@types/*` from
   `package.json`, and delete `tsconfig.json`.
3. Simplify `eslint.config.js` to drop the `typescript-eslint` config
   (`@eslint/js`'s recommended config alone is enough for plain JS).
4. `vite.config.ts` → `vite.config.js` (drop the `type` import and the
   `BuildTarget` type annotation).

## Testing

`npm test` runs [Vitest](https://vitest.dev) against `src/**/*.test.ts`.
There's one example test, `src/shared/format.test.ts`, covering a plain
utility function.

Chrome extension APIs (`chrome.*`) aren't available under Node, so this
setup only covers logic you can factor out as plain functions — the pattern
used by `src/shared/format.ts`. Prefer pulling business logic out of
`content.ts`/`background.ts`/`popup.ts` into testable `shared/` helpers where
you can.

UI/E2E testing (actually driving Chrome with the extension loaded) is out of
scope for this starter. If you need it later, look at:

- [Puppeteer's extension testing docs](https://pptr.dev/guides/chrome-extensions)
- [Playwright's extension testing docs](https://playwright.dev/docs/chrome-extensions)

## Cross-browser support (optional)

All `chrome.*` calls are made directly and only through the wrappers in
`src/shared/messaging.ts` and `src/shared/storage.ts` — if you want to
target Firefox/Edge later, the smallest change is dropping in
[`webextension-polyfill`](https://github.com/mozilla/webextension-polyfill)
and swapping those two files over to the promise-based `browser.*` API. This
isn't done by default to keep the dependency list minimal for the common
case (Chrome-only).

## Publishing to the Chrome Web Store

1. `npm run build`
2. Zip the **contents** of `dist/` (not the folder itself) — e.g. from
   inside `dist/`: `zip -r ../extension.zip .`
3. Create a [Chrome Web Store developer account](https://chrome.google.com/webstore/devconsole) (one-time **$5 USD** registration fee)
4. In the [Developer Dashboard](https://chrome.google.com/webstore/devconsole), click **New Item** and upload `extension.zip`
5. Fill in the store listing (description, screenshots, privacy practices —
   required if you request sensitive permissions) and submit for review
6. Review typically takes anywhere from a few hours to a few days; extensions
   requesting broad host permissions or using remote code get extra scrutiny

See the [official publishing docs](https://developer.chrome.com/docs/webstore/publish) for current requirements.

## Non-goals

- No specific extension's business logic — this is a blank-slate scaffold.
- No UI framework (React/Vue/etc.) by default, to keep the template
  lightweight. To add one: point `src/popup/popup.html`'s script tag at a
  `.tsx`/`.jsx` entry, add the framework + its Vite plugin
  (e.g. `@vitejs/plugin-react`) to `vite.config.ts`'s shared config, and
  repeat for `src/options` if desired. `src/background` and `src/content`
  generally shouldn't use a UI framework — they don't render a DOM tree of
  their own.
