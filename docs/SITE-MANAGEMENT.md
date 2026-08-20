# Managing your website

This guide is for the owner of this website. It explains how to change content
without needing an AI assistant or changing the site's code.

The site is **Markdown-first**: most changes are ordinary text files. The
website is rebuilt from those files whenever you publish a change.

## The simplest workflow

You have two good ways to edit the site:

1. **GitHub in the browser** — best for a quick text correction, a new blog
   post, or a small project update. Open the file in your website repository,
   use the pencil icon, commit the change, and wait for the hosting provider to
   finish rebuilding the site.
2. **Your computer** — best for adding images, a CV PDF, or several changes at
   once. Open this folder in VS Code, run `pnpm dev`, and visit
   `http://localhost:4321/zhai` to check the result before committing.

The private, click-to-edit dashboard discussed during the redesign is a future
feature. Until it exists, the files in this guide are the safe source of truth.

## Before you edit

- Change source files under `src/` and `public/`; never edit `dist/`. The
  `dist/` folder is generated automatically and is replaced every time the site
  builds.
- Keep a copy of important images and PDFs on your computer.
- Make one focused change at a time, preview it, then publish it.
- If a build reports an error, read the first error message. It normally names
  the file and field that needs attention.

## Where to change each part of the site

| You want to change | Edit this file or folder |
| --- | --- |
| Name, position, email, links, navigation, homepage research-interest chips | `src/site.config.ts` |
| Portrait | `src/assets/avatar.png` |
| About text | `src/content/about.md` |
| Current work / short biography | `src/content/now.md` |
| CV introduction text | `src/content/cv.md` |
| Downloadable CV PDF | `public/assets/pdf/peiyuan_zhai_cv.pdf` |
| Research projects | `src/content/projects/` |
| Publications | `src/content/publications/main.bib` |
| Publication thumbnails | `public/img/publications/` |
| Project images | `public/img/projects/` |
| Blog posts | `src/content/blog/` |
| Education, research appointments, teaching history | `src/content/experience.json` |
| Blog author biography and links | `src/content/people.toml` |

## Editing text pages

`about.md`, `now.md`, and `cv.md` are plain Markdown files. You can write
normal paragraphs and use simple Markdown:

```md
# Heading

This is a paragraph with a [useful link](https://example.com).

- A bullet point
- Another bullet point
```

Save the file and preview it. You do not need to edit an Astro component to
change this text.

## Updating your profile and links

Open `src/site.config.ts`. The most common fields are in the `PROFILE` object:

```ts
name: "Peiyuan Zhai",
tagline: "PhD Researcher · TU Delft",
email: "p.zhai@tudelft.nl",
links: {
  github: "https://github.com/your-name",
  linkedin: "https://www.linkedin.com/in/your-name",
  cv: "/assets/pdf/peiyuan_zhai_cv.pdf",
},
```

Only replace text between quotation marks and keep the commas, braces, and
indentation. The `researchInterests` list controls the small topic links on the
homepage. To point a label to a project, use its project URL, for example
`/projects/radar-lidar-fusion`.

## Replacing your portrait, CV, or an image

For the few files that already have a fixed path, the easiest approach is to
replace the file while keeping its name:

- Portrait: `src/assets/avatar.png`
- CV: `public/assets/pdf/peiyuan_zhai_cv.pdf`

For a new project or publication image, upload it to the relevant `public/img/`
folder. Use a short lowercase filename with hyphens, such as
`public/img/projects/cooperative-mapping.png`. In Markdown, refer to it as:

```md
![A concise description of the image](/zhai/img/projects/cooperative-mapping.png)
```

Write useful alt text inside the square brackets. Prefer WebP, PNG, or JPEG
images and keep files reasonably small so the site stays fast.

## Adding or editing a project

Each project is one Markdown file in `src/content/projects/`. The filename is
important: `radar-lidar-fusion.md` becomes `/projects/radar-lidar-fusion` and
its ID is `radar-lidar-fusion`.

Copy an existing project file, rename it, and replace the information. This is
a safe starting point for a standalone project:

```md
---
title: "Project title"
selected: true
fromDate: "2027-01"
types:
  - research
skills:
  - First topic
  - Second topic
description: "One sentence shown in the project list."
---

Explain the project here. You can use headings, images, links, and lists.
```

Dates use `YYYY-MM`. `selected: true` makes the project eligible for featured
areas of the site.

### Adding a research strand under an umbrella project

The SPEAR setup can also be used for a larger project with several smaller
research strands.

1. Create the umbrella project's Markdown file, for example
   `connected-perception.md`.
2. Create each strand as its own Markdown file.
3. In every strand, set `parentProject` to the umbrella filename without
   `.md`:

```md
---
title: "Cooperative occupancy mapping"
parentProject: "connected-perception"
timelineLabel: "2027 · Cooperative mapping"
timelineOrder: 1
types:
  - research
description: "A one-sentence overview."
researchQuestion: "What question does this work answer?"
contribution: "What is your contribution?"
relatedPublications:
  - your-bibtex-key
---

Longer project explanation.
```

`timelineOrder` controls the order: `1` comes before `2`. The citation key in
`relatedPublications` must exactly match an entry in `main.bib`.

At present, the interactive Research-page timeline is designed around SPEAR.
The project detail pages already understand parent/child links, but a second
umbrella group needs one small, one-time display update before it receives an
equivalent timeline on the Research page. Do not edit
`src/content.config.ts` for ordinary projects; it is the validation rulebook,
not a project form.

## Adding a publication

Open `src/content/publications/main.bib` and copy an existing BibTeX entry.
The key immediately after `@article{` or `@inproceedings{` is the publication
ID used by projects.

```bibtex
@inproceedings{zhai2027example,
  author = {Zhai, Peiyuan and Coauthor, Name},
  title = {Paper title},
  booktitle = {Conference name},
  year = {2027},
  pdf = {https://example.com/paper.pdf},
  summary = {A short plain-language paper summary.},
  contribution = {Your role or the main contribution.},
  project = {cooperative-occupancy-mapping},
  keywords = {Occupancy Grid Mapping, Automotive Radar}
}
```

For the richer publication preview, use the optional `summary`,
`contribution`, and `project` fields. The `project` value should be the
project filename without `.md`.

## Writing a blog post

Copy [the post template](../src/content/blog/2026-08-20-blog-post-template.md)
into `src/content/blog/`, then give it a descriptive filename such as
`2027-01-15-radar-mapping-notes.md`.

Set `draft: true` while writing. Change it to `draft: false` only when the post
is ready to appear publicly.

```md
---
title: "A clear post title"
description: "A one- or two-sentence summary."
createdAt: "2027-01-15"
tags:
  - research
  - radar
draft: true
---

Write the post here.
```

## Checking and publishing a change

### In GitHub

1. Edit or upload the source file.
2. Add a short commit message, such as `Add camera-aided mapping project`.
3. Commit to a branch or directly to `main` once you are confident.
4. If your hosting is connected to GitHub, it rebuilds and publishes the site
   automatically after a successful commit to `main`.

### On your computer

```bash
pnpm dev
```

Open `http://localhost:4321/zhai` and check the affected page. Before
publishing, run:

```bash
pnpm build
```

If it succeeds, commit and push your changes to the production branch. The
hosting provider publishes the new build automatically once deployment has
been configured.

## Things to leave alone unless you are intentionally developing the site

- `src/components/`, `src/layouts/`, `src/pages/`, and `src/styles/` control
  the website's interface and layout.
- `src/content.config.ts` and `src/schemas.ts` validate your content.
- `astro.config.ts` controls the site's public URL and `/zhai` path.
- `package.json`, `pnpm-lock.yaml`, and `wrangler.jsonc` control tooling and
  deployment.
- `dist/` is generated output.

If you only want to update your content, you should not need to change any of
these files.

## If something looks wrong

1. Check that a project filename, `parentProject`, publication key, and image
   path are spelled exactly the same everywhere they are referenced.
2. Make sure Markdown front matter starts and ends with `---`.
3. Run `pnpm build` and read the first reported error.
4. Restore the last working version through GitHub's file history if needed.

For larger visual changes or a new research-group layout, work on a branch so
the public site stays stable until the change is ready.
