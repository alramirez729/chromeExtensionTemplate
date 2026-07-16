# Contributing

Thanks for considering a contribution to this template.

## Scope

This repo is a **starter scaffold**, not a specific extension. Contributions
should improve the template experience for everyone using it (build tooling,
docs, DX, bug fixes) rather than add business logic or one-off features that
only make sense for a particular extension idea.

## Getting started

```bash
npm install
npm run dev
```

Load `dist/` as an unpacked extension in `chrome://extensions` (Developer
mode → "Load unpacked") to try your changes.

## Before opening a PR

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

All four should pass — CI runs the same checks.

## Style

- Formatting is enforced by Prettier (`npm run format`); don't hand-format.
- Keep the example functionality (link counter) minimal — it exists only to
  prove the scaffold works end-to-end, not to be a real feature.
- Avoid adding dependencies unless they clearly pay for themselves in a
  starter template used by many different projects.

## Commit messages

Short, imperative, and focused on *why* when it's not obvious from the diff.
