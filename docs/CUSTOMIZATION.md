# Site maintenance

This guide describes where to update the content and presentation of Peiyuan
Zhai's website.

## Content

Most editable website content lives in `src/content/`.

- `about.md`: biography shown on the about page.
- `now.md`: current-status page.
- `talks/`: talks, seminars, and conference presentations (one file each).
- `blog/`: Markdown posts.
- `projects/`: research project pages.
- `experience.json`: education, research, and teaching timeline.
- `people.toml`: author records used by posts.
- `publications/main.bib`: BibTeX data for the publications page.

Blog posts use Markdown with frontmatter such as:

```yaml
---
title: Example post
description: Short social and SEO description.
createdAt: 2026-01-15
tags:
  - research
authors:
  - peiyuan
draft: false
---
```

## Talks

Each talk is one Markdown file in `src/content/talks/`. The frontmatter drives
the card on `/talks`; the body is the abstract shown on the talk's own page at
`/talks/<file-name>`. Adding a talk means adding a file; no code changes are
needed.

```yaml
---
title: Sparsity-Aware Occupancy Grid Mapping
event: Three Minute Thesis, EUSIPCO 2026
location: Bruges, Belgium
date: 2026-09
description: One or two lines shown on the card and used for SEO.
video: https://youtu.be/VIDEO_ID
slides: /assets/pdf/2026-eusipco-slides.pdf
thumbnail: ../../assets/talks/2026-eusipco.png
---

The abstract. Ordinary Markdown - paragraphs, callouts, math, images.
```

`title`, `event`, and `date` are required; everything else is optional. Talks
sort by `date`, most recent first. The file name becomes the URL, so keep it
lowercase and kebab-case.

### Video

`video` takes the ordinary share URL (`https://youtu.be/ID`,
`https://www.youtube.com/watch?v=ID`, or a `/shorts/` or `/live/` link). The
talk page converts it to a privacy-preserving `youtube-nocookie.com` embed and
renders a responsive 16:9 player. A URL that isn't recognizably YouTube still
gets a link on the card, just no embedded player.

### Slides and posters

Put the PDF under `public/`, for example
`public/assets/pdf/2026-eusipco-slides.pdf`, and point `slides` (or `poster`)
at it with a site-root-relative path - no `/zhai` prefix, see "Deploy base
path" below. Both render as an embedded preview on the talk page: `slides` as a
16:9 box, `poster` as a portrait one.

### Thumbnail

`thumbnail` is the card image, given relative to the Markdown file, and is
optimized at build time. Generate one from the first page of the slides with
`pdftoppm`, which ships with `poppler-utils`:

```bash
pdftoppm -png -r 150 -f 1 -l 1 -singlefile \
  public/assets/pdf/2026-eusipco-slides.pdf \
  src/assets/talks/2026-eusipco
```

Commit the generated PNG alongside the content. Set
`thumbnailOrientation: portrait` for a poster so the card reserves a 3:4 box
instead of 16:9. Without a `thumbnail` the card simply renders text-only.

## Site identity and navigation

Update `src/site.config.ts` for the website title, description, canonical URL,
social links, navigation, publication-author highlighting, and footer options.
The configuration is validated with Zod during development.

## Assets

Static files in `public/` are served from the website root. This includes
favicons, social-preview images, documents, and fonts. Update references in
site configuration or content whenever an asset is renamed or removed.

## Deploy base path

The site is served from different paths depending on the target: slipzhai.cc
serves it under `/zhai`, GitHub Pages (hantyou.github.io) serves it at the
root. `astro.config.ts` defaults `base` to `/zhai` and reads the `SITE_BASE`
environment variable to override it, which is how the GitHub Pages workflow
builds at the root.

Always set the base with `SITE_BASE`, never with Astro's `--base` CLI flag.
The flag is applied after `astro.config.ts` is evaluated, so the
`internal-links` plugin below is constructed with the wrong base: `.astro`
links would use the flag's value while Markdown links kept the default, and
one of the two sets would 404. Any deploy target -- a self-hosted server as
much as CI -- has to pass `SITE_BASE`:

```bash
SITE_BASE=/           pnpm astro build --site https://hantyou.github.io
SITE_BASE=/zhai       pnpm astro build --site https://slipzhai.cc
```

Never hardcode the base in a link. Write every internal link site-root-relative
(`/assets/pdf/cv.pdf`, `/people`) and the base is applied at build time:

- In `.astro` and `.ts` files, wrap the path in `withBase()` from
  `src/lib/links.ts`.
- In Markdown content, write the plain path — the `internal-links` plugin
  (`src/lib/internal-links.ts`) rewrites `href`, `src`, and `data` attributes
  during the build.

A link written as `/zhai/assets/...` bypasses both and breaks on any target
whose base is not `/zhai`.

## Presentation

- Colors: `src/styles/color.css`
- Typography and spacing: `src/styles/typography*.css` and `src/styles/layout.css`
- Shape and motion tokens: `src/styles/shape.css`
- Reusable icons: `src/icon.config.ts` and `src/assets/icons/`
- Page routes: `src/pages/`
- Components: `src/components/`

Prefer existing design tokens and native Astro, HTML, and CSS. Check light and
dark modes after visual changes.

## Markdown features

The Markdown pipeline supports GFM, callouts, math, code highlighting, heading
anchors, external links, base-relative internal links, and sidenotes. Its configuration is in
`astro.config.ts`; the relevant plugins and transforms are in `src/lib/` and
`src/plugins/`.

Run `pnpm build` after content changes. For structural or styling changes, use
the full validation commands in [INSTALL.md](INSTALL.md).
