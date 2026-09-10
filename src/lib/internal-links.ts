import { defineHastPlugin } from "satteri"
import { joinBase } from "./links.ts"

/**
 * Rewrite site-root-relative URLs in Markdown content against the configured
 * base, so content is written base-free (`/assets/pdf/slides.pdf`) and works at
 * any deploy base. Mirrors `withBase()`, which does the same for `.astro` code.
 */
const URL_ATTRIBUTES = ["href", "src", "data", "poster"]

/** Elements whose URL attributes point at site content. */
const URL_ELEMENTS = [
  "a",
  "img",
  "object",
  "embed",
  "iframe",
  "source",
  "video",
  "audio",
]

/** The same attributes inside raw HTML blocks, which reach hast unparsed. */
const RAW_URL_ATTRIBUTE = new RegExp(
  `\\b(${URL_ATTRIBUTES.join("|")})=("|')(/[^"']*)\\2`,
  "g",
)

export function internalLinks(base: string) {
  return defineHastPlugin({
    name: "internal-links",
    element: {
      filter: URL_ELEMENTS,
      visit(node, ctx) {
        for (const attribute of URL_ATTRIBUTES) {
          const value = node.properties[attribute]
          if (typeof value !== "string") continue

          const resolved = joinBase(base, value)
          if (resolved !== value) ctx.setProperty(node, attribute, resolved)
        }
      },
    },
    raw(node, ctx) {
      const value = node.value.replace(
        RAW_URL_ATTRIBUTE,
        (match, attribute, quote, href) => {
          const resolved = joinBase(base, href)
          return resolved === href
            ? match
            : `${attribute}=${quote}${resolved}${quote}`
        },
      )
      if (value !== node.value) ctx.replaceNode(node, { type: "raw", value })
    },
  })
}
