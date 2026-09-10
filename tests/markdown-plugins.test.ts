import assert from "node:assert/strict"
import test from "node:test"
import { markdownToHtml } from "satteri"

import { calloutDirective } from "../src/lib/callout.ts"
import { externalLinks } from "../src/lib/external-links.ts"
import { headingAnchors } from "../src/lib/heading-anchors.ts"
import { headingNamespace } from "../src/lib/heading-namespace.ts"
import { internalLinks } from "../src/lib/internal-links.ts"
import { temmlMath } from "../src/lib/math.ts"
import { normalizeHeadings } from "../src/plugins/satteri-normalize-headings.ts"
import { satteriSidenotes } from "../src/plugins/satteri-sidenotes.ts"

void test("sidenote state resets between documents", async () => {
  const hastPlugins = satteriSidenotes()
  const first = await markdownToHtml("First.[^note]\n\n[^note]: First note.", {
    hastPlugins,
  })
  const second = await markdownToHtml(
    "Second.[^note]\n\n[^note]: Second note.",
    { hastPlugins },
  )

  assert.match(first.html, /id="sn-1"/)
  assert.match(second.html, /id="sn-1"/)
  assert.doesNotMatch(second.html, /id="sn-2"/)
  assert.match(second.html, /Second note/)
  assert.doesNotMatch(second.html, /First note/)
})

void test("repeated references receive unique controls and backrefs", async () => {
  const { html } = await markdownToHtml(
    "First.[^note] Second.[^note]\n\n[^note]: Shared note.",
    { hastPlugins: satteriSidenotes() },
  )
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])

  assert.match(html, /id="sn-1"/)
  assert.match(html, /id="sn-1-2"/)
  assert.match(html, /href="#snref-1"/)
  assert.match(html, /href="#snref-1-2"/)
  assert.equal(new Set(ids).size, ids.length)
})

void test("footnote label stays accessible without entering the heading outline", async () => {
  const { html } = await markdownToHtml("Text.[^note]\n\n[^note]: Note.", {
    hastPlugins: [...satteriSidenotes(), headingAnchors],
  })

  assert.match(
    html,
    /<div class="sr-only" id="footnote-label">Footnotes<\/div>/,
  )
  assert.doesNotMatch(html, /<h2[^>]*id="footnote-label"/)
  assert.doesNotMatch(html, /href="#footnote-label"/)
})

void test("the configured Satteri feature pipeline composes correctly", async () => {
  const markdown = [
    "# Heading",
    "",
    "An [external link](https://example.com), a [[/projects|wikilink]], and a note.[^note]",
    "",
    ":::note[Callout]",
    "Callout body.",
    ":::",
    "",
    "$$",
    "x^2",
    "$$",
    "",
    "[^note]: Footnote body.",
  ].join("\n")
  const { html } = await markdownToHtml(markdown, {
    features: { directive: true, math: true, wikilinks: true },
    mdastPlugins: [normalizeHeadings, calloutDirective, temmlMath],
    hastPlugins: [externalLinks, ...satteriSidenotes(), headingAnchors],
  })

  assert.match(html, /<h2 id="heading">/)
  assert.match(html, /target="_blank"/)
  assert.match(html, /href="\/projects"/)
  assert.match(html, /<details data-callout="note" open>/)
  assert.match(html, /<math-display>/)
  assert.match(html, /class="sidenote"/)
})

void test("subpost heading namespaces reset for every document", () => {
  const hastPlugins = [headingNamespace, headingAnchors]
  const first = markdownToHtml("## Repeated\n\n## Repeated", {
    hastPlugins,
    fileURL: new URL("file:///content/blog/series/first.md"),
  })
  const second = markdownToHtml("## Repeated", {
    hastPlugins,
    fileURL: new URL("file:///content/blog/series/second.md"),
  })

  assert.match(first.html, /id="first-repeated"/)
  assert.match(first.html, /id="first-repeated-1"/)
  assert.match(second.html, /id="second-repeated"/)
  assert.doesNotMatch(second.html, /id="second-repeated-1"/)
})

void test("internal links resolve against the configured base", () => {
  const { html } = markdownToHtml(
    [
      "[Slides](/assets/pdf/slides.pdf)",
      "",
      "![Diagram](/img/projects/spear.png)",
    ].join("\n"),
    { hastPlugins: [internalLinks("/zhai")] },
  )

  assert.match(html, /href="\/zhai\/assets\/pdf\/slides\.pdf"/)
  assert.match(html, /src="\/zhai\/img\/projects\/spear\.png"/)
})

void test("internal links inside raw HTML resolve against the base", () => {
  const { html } = markdownToHtml(
    '<object class="talk-pdf" data="/assets/pdf/slides.pdf" type="application/pdf"><a href="/assets/pdf/slides.pdf">Open the slides PDF</a></object>',
    { hastPlugins: [internalLinks("/zhai")] },
  )

  assert.match(html, /data="\/zhai\/assets\/pdf\/slides\.pdf"/)
  assert.match(html, /href="\/zhai\/assets\/pdf\/slides\.pdf"/)
})

void test("only site-root-relative internal URLs are rewritten", () => {
  const markdown = [
    "[External](https://example.com/slides.pdf)",
    "",
    "[Anchor](#section)",
    "",
    "[Already based](/zhai/assets/pdf/slides.pdf)",
    "",
    '<iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID"></iframe>',
  ].join("\n")
  const { html } = markdownToHtml(markdown, {
    hastPlugins: [internalLinks("/zhai")],
  })

  assert.match(html, /href="https:\/\/example\.com\/slides\.pdf"/)
  assert.match(html, /href="#section"/)
  assert.match(
    html,
    /src="https:\/\/www\.youtube-nocookie\.com\/embed\/VIDEO_ID"/,
  )
  assert.doesNotMatch(html, /\/zhai\/zhai\//)
})

void test("a root base leaves internal links untouched", () => {
  const { html } = markdownToHtml(
    '[Slides](/assets/pdf/slides.pdf)\n\n<object data="/assets/pdf/slides.pdf"></object>',
    { hastPlugins: [internalLinks("/")] },
  )

  assert.match(html, /href="\/assets\/pdf\/slides\.pdf"/)
  assert.match(html, /data="\/assets\/pdf\/slides\.pdf"/)
})
