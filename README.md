# Peiyuan Zhai's website

This repository contains the source for [Peiyuan Zhai's personal academic
website](https://slipzhai.cc/zhai): a PhD researcher at Delft University of
Technology working on autonomous perception, sensor fusion, and Bayesian
learning.

The site presents research projects, publications, teaching, a CV, and
occasional writing. It is a static Astro site whose content is primarily kept
in Markdown, JSON, TOML, and BibTeX files.

## How this site differs from its source project

This is a maintained personal website rather than a reusable theme. Its content,
site configuration, navigation, assets, and GitHub Pages deployment are tailored
to Peiyuan Zhai's research and professional profile. Instructions for creating,
contributing to, or publishing a general Astro theme have been removed.

## Repository guide

- `src/content/`: website content, including the about page, blog posts,
  projects, experience, people, and publications.
- `src/site.config.ts`: site identity, navigation, profile links, and footer
  configuration.
- `src/pages/` and `src/components/`: Astro routes and presentation components.
- `public/`: static assets, including documents, fonts, favicons, and images.

For practical content and configuration guidance, see
[docs/CUSTOMIZATION.md](docs/CUSTOMIZATION.md). Development commands and
project conventions are collected in [DEVELOPMENT.md](DEVELOPMENT.md).

## Work on the site locally

This project uses Node.js `>=22.12.0` and pnpm.

```bash
corepack enable
pnpm install
pnpm dev
```

Open <http://localhost:4321>. Before publishing a change, run:

```bash
pnpm format:check
pnpm lint
pnpm lint:styles
pnpm test:markdown
pnpm astro check
pnpm build
```

Pushing to `main` deploys the production build through the GitHub Pages
workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Origin and credits

This website is a customized fork of
[myscholar](https://github.com/mychiffonn/myscholar), the Astro Scholar template
created by [My (Chiffon) Nguyen](https://github.com/mychiffonn). The template's
design and code provided the starting point for this site; the content,
structure, and research presentation here are specific to Peiyuan Zhai.

Astro Scholar is built on
[astro-erudite](https://github.com/jktrn/astro-erudite) and acknowledges
influences from [Maggie Appleton's digital garden](https://github.com/MaggieAppleton/maggieappleton.com-V3)
and [al-folio](https://github.com/alshedivat/al-folio). The original
[Apache-2.0 license](LICENSE) and its copyright notice are retained in this
repository. Unless otherwise stated, website content is licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
