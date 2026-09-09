import { defineConfig } from "astro/config"
import sitemap from "@astrojs/sitemap"
import { satteri } from "@astrojs/markdown-satteri"
import {
  blockExpressiveCode,
  inlineExpressiveCode,
} from "./src/lib/expressive-code"
import { temmlMath } from "./src/lib/math"
import { calloutDirective } from "./src/lib/callout"
import { externalLinks } from "./src/lib/external-links"
import { internalLinks } from "./src/lib/internal-links"
import { headingNamespace } from "./src/lib/heading-namespace"
import { headingAnchors } from "./src/lib/heading-anchors"
import { satteriSidenotes } from "./src/plugins/satteri-sidenotes"
import { normalizeHeadings } from "./src/plugins/satteri-normalize-headings"

// Deploy targets differ: slipzhai.cc serves the site under `/zhai`, while
// GitHub Pages (hantyou.github.io) serves it at the root. Set `SITE_BASE` to
// override. Markdown content is written base-free and rewritten by the
// `internal-links` plugin below, so content never hardcodes a base.
const base = process.env.SITE_BASE ?? "/zhai"

export default defineConfig({
  site: "https://slipzhai.cc",
  base,
  compressHTML: true,
  trailingSlash: "never",
  output: "static",
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  image: {
    responsiveStyles: true,
    layout: "constrained",
    remotePatterns: [
      { protocol: "data" },
      { protocol: "https", hostname: "gravatar.com" },
    ],
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !/\/blog\/[^/]+\/[^/]+\/?$/.test(page) &&
        !/\/people\/[^/]+\/?$/.test(page) &&
        !page.includes("/blog/tags/"),
    }),
  ],
  server: { port: 4321, host: true },
  devToolbar: { enabled: false },
  markdown: {
    syntaxHighlight: false,
    processor: satteri({
      features: { directive: true, math: true, wikilinks: true },
      mdastPlugins: [
        normalizeHeadings,
        calloutDirective,
        inlineExpressiveCode,
        temmlMath,
      ],
      hastPlugins: [
        externalLinks,
        internalLinks(base),
        blockExpressiveCode,
        ...satteriSidenotes(),
        headingNamespace,
        headingAnchors,
      ],
    }),
  },
})
