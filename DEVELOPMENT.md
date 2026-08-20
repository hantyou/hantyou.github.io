# Development

This repository is the source of Peiyuan Zhai's personal academic website. It
is a static-first Astro site, not a general-purpose theme or starter.

## Project map

- `src/site.config.ts`: website identity, navigation, profile, publications,
  and footer configuration.
- `src/content/`: editable research, publication, project, biography, and blog
  content.
- `src/pages/`: routes.
- `src/components/`: page and interface components.
- `src/styles/`: shared design tokens and styling.
- `public/`: static assets.
- `astro.config.ts`: Astro, sitemap, image, and Markdown configuration.

## Commands

```bash
pnpm install
pnpm dev
pnpm sync
pnpm format
pnpm format:check
pnpm lint
pnpm lint:styles
pnpm test:markdown
pnpm astro check
pnpm build
pnpm preview
pnpm verify
```

## Working principles

- Keep the site static and Markdown-first.
- Prefer native Astro, HTML, and CSS over client-side JavaScript or additional
  frameworks.
- Keep profile, project, publication, and blog data valid against their content
  schemas.
- Use existing color, spacing, typography, shape, motion, card, and icon
  primitives before introducing new styling systems.
- Preserve the source attribution and licensing in the README and `LICENSE`.
- Check both light and dark modes after visual changes.

## Before publishing

Run `pnpm verify`, inspect the production build locally,
then push to `main`. The GitHub Pages workflow builds the site and deploys it
to the `gh-pages` branch.
