# Local development

This guide is for working on Peiyuan Zhai's website, not for creating a new
site from this repository.

## Requirements

- Node.js `>=22.12.0`
- pnpm `10.x`

Use pnpm because this repository includes `pnpm-lock.yaml`.

## Start the site

```bash
corepack enable
pnpm install
pnpm dev
```

Open <http://localhost:4321>. The development server reloads when site content,
configuration, components, or styles change.

## Production check

Run the following before publishing substantial changes:

```bash
pnpm format:check
pnpm lint
pnpm lint:styles
pnpm test:markdown
pnpm astro check
pnpm build
```

`pnpm build` writes the static site to `dist/`; `pnpm preview` serves that build
locally. Check the home page, publications, research projects, and any edited
page in both light and dark modes.

## Publish

The GitHub Actions workflow deploys the static build to GitHub Pages whenever
changes are pushed to `main`. It builds with the production site URL and root
base path, then publishes the generated files to the `gh-pages` branch.
