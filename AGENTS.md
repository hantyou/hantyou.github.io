# Personal website agent guide

This repository contains Peiyuan Zhai's personal academic website. It is a
static-first, Markdown-first Astro site; do not treat it as a reusable theme or
replace its personal content with generic sample material.

## Before editing

- Read `package.json`, `astro.config.ts`, `docs/INSTALL.md`,
  `docs/CUSTOMIZATION.md`, `src/site.config.ts`, and `src/content.config.ts`.
- Use Node.js `>=22.12.0` and pnpm. Preserve the existing static output and do
  not add a server adapter unless a requested feature needs on-demand rendering.
- Keep the attribution and license for the upstream `myscholar` template in the
  README and `LICENSE`.

## Content and design

- Treat `src/site.config.ts`, `src/content/`, `src/assets/`, and `public/` as
  the primary customization surfaces.
- Preserve content collection validation and useful schema errors.
- Reuse existing color, typography, spacing, shape, motion, card, button, and
  disclosure primitives before introducing new styles.
- Use Markdown for prose unless interactive components inside it are essential.
- Supply descriptive image alt text and valid author references.

## Development and validation

- Prefer native Astro, semantic HTML, and native CSS before client-side
  JavaScript or a UI framework.
- Preserve user changes in a dirty worktree and avoid unrelated rewrites.
- Format touched files, then run the narrowest relevant check. Before handoff,
  run:

```bash
pnpm format:check
pnpm lint
pnpm lint:styles
pnpm test:markdown
pnpm astro check
pnpm build
```

- For visual changes, inspect desktop and mobile layouts as well as keyboard,
  hover, focus, light, and dark states where applicable.

## Publishing

- Do not commit generated output from `dist/`, `.astro/`, `.playwright-cli/`,
  or `output/`.
- Pushing to `main` triggers the GitHub Pages deployment workflow.
