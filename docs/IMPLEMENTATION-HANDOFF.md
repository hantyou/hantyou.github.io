# Portfolio redesign implementation handoff

## Status

The first front-end redesign is complete and validated. It keeps Astro Scholar's
static-first, Markdown-first architecture while making the site feel more
personal, academic, and interactive.

The production build succeeds. The current build warns that the `updates`
collection is empty; this is expected because the example updates were removed.

## Completed public-site work

### Identity and navigation

- The homepage retains a classic academic introduction with portrait, name,
  position, contact links, concise history, research interests, and two calls
  to action: **Download CV** and **Explore research**.
- Each research-interest label links directly to its most relevant research
  strand.
- The public phone number and separate personal-website link were removed.
- Navigation now uses **Research** and **Now & About**.
- Light and dark modes remain available.
- Display headings use an editorial serif stack while body/UI copy stays
  sans-serif.

### SPEAR research experience

- SPEAR is represented as the umbrella PhD project.
- The user's official contribution is structured as:

  ```text
  SPEAR
  └─ Multimodal sensing for automotive radar
     ├─ Radar–LiDAR fusion for occupancy mapping
     ├─ Camera-aided occupancy-grid mapping
     └─ Dynamic occupancy-grid mapping
  ```

- The homepage and Research page render a shared interactive research timeline.
  A visitor can hover, focus, or tap a strand to preview it; click to pin the
  preview; and close it with the close control or Escape.
- The SPEAR detail page now connects to all three strands. Each strand's detail
  page identifies its parent project and displays its research question,
  contribution, and direct links to related papers.
- The SPEAR overview is a paraphrase of the official TU Delft SPS project page:
  <https://sps.ewi.tudelft.nl/Research/project.php?id=204&ti=66>.

### Publications

- Publications are chronological by default, with the existing relevance view
  plus combined topic and publication-type filters.
- A quick-view panel works through hover, keyboard focus, or a **Quick view**
  button. It shows a summary, contribution, related research strand, topics,
  and paper links when the publication provides that metadata.
- Live GitHub activity appears as a compact homepage summary and as the fuller
  Research-page activity view.
- Custom BibTeX fields now supported by the public-site loader are `summary`,
  `contribution`, and `project`.

## Important content model

Project Markdown front matter now supports:

- `parentProject`
- `timelineLabel`
- `timelineOrder`
- `researchQuestion`
- `contribution`
- `relatedPublications`

Publication BibTeX supports the extra fields above. The citation key is the
stable ID used by `relatedPublications`.

## Future server-side work

The user wants an owner-only, human-friendly editing experience, but it is not
part of the current public static build. The intended sequence is:

1. Keep Markdown, project data, and BibTeX as the portable source of truth.
2. Add a private editor dashboard for the user only.
3. Allow dashboard editing of profile details, portrait, project data, posts,
   publication metadata, and later image/PDF/video uploads.
4. Profile changes may publish immediately; project and post changes must
   support a draft/review/publish flow.
5. Later, add in-page editing on top of the same authenticated content system.

Do not expose editing controls or uploads to public visitors. Do not replace the
static public site with a client-heavy application.

## Validation already run

- `pnpm format:check`
- `pnpm lint`
- `pnpm lint:styles`
- `pnpm test:markdown`
- `pnpm astro check`
- `pnpm build`

All passed. The build only reports the intentional empty-updates collection.
