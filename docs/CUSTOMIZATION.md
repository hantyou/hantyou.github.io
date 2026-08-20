# Site maintenance

This guide describes where to update the content and presentation of Peiyuan
Zhai's website.

## Content

Most editable website content lives in `src/content/`.

- `about.md`: biography shown on the about page.
- `now.md`: current-status page.
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

## Site identity and navigation

Update `src/site.config.ts` for the website title, description, canonical URL,
social links, navigation, publication-author highlighting, and footer options.
The configuration is validated with Zod during development.

## Assets

Static files in `public/` are served from the website root. This includes
favicons, social-preview images, documents, and fonts. Update references in
site configuration or content whenever an asset is renamed or removed.

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
anchors, external links, and sidenotes. Its configuration is in
`astro.config.ts`; the relevant plugins and transforms are in `src/lib/` and
`src/plugins/`.

Run `pnpm build` after content changes. For structural or styling changes, use
the full validation commands in [INSTALL.md](INSTALL.md).
