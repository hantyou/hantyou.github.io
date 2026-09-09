import { getCollection, type CollectionEntry } from "astro:content"

import { PUBLICATION_LINK_TYPES } from "@icon-config"

export type Talk = CollectionEntry<"talks">

/**
 * Viewer parameters for an embedded PDF. A single slide fills the frame better
 * without the browser's toolbar and page sidebar competing for the same box.
 */
export const PDF_VIEWER_PARAMS = "#toolbar=0&navpanes=0&view=FitH"

/**
 * Convert a YouTube watch, share, or embed URL into its nocookie embed form.
 * Returns null for anything that isn't recognizably YouTube, so callers can
 * fall back to a plain link rather than embedding a broken frame.
 */
export function getYouTubeEmbedUrl(url: string): string | null {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }

  const host = parsed.hostname.replace(/^www\./, "")
  const id =
    host === "youtu.be"
      ? parsed.pathname.slice(1)
      : host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")
        ? (parsed.searchParams.get("v") ??
          parsed.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1])
        : undefined

  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
}

type TalkLinkType = "video" | "slides" | "poster"

/**
 * Links for a talk.
 *
 * `documents` chooses where slides and posters point. On the talk page the
 * viewer is already embedded below, so the link opens the PDF itself; on a
 * card there is nothing to see in place, so it sends people to that embedded
 * viewer instead. The video always points at the platform hosting it.
 */
export function getTalkLinks(talk: Talk, documents: "file" | "page" = "file") {
  const { data } = talk
  const anchor = (type: TalkLinkType) => `/talks/${talk.id}#${type}`

  const linkData = [
    { type: "video" as const, href: data.video },
    {
      type: "slides" as const,
      href:
        data.slides && (documents === "page" ? anchor("slides") : data.slides),
    },
    {
      type: "poster" as const,
      href:
        data.poster && (documents === "page" ? anchor("poster") : data.poster),
    },
  ]

  return linkData
    .filter((link): link is { type: TalkLinkType; href: string } => !!link.href)
    .map(({ type, href }) => ({
      type,
      href,
      icon: PUBLICATION_LINK_TYPES[type].iconName,
      label: PUBLICATION_LINK_TYPES[type].label,
    }))
}

/** Most recent talk first; equal dates fall back to title for a stable order. */
function sortTalks(talks: Talk[]): Talk[] {
  return talks.sort(
    (a, b) =>
      b.data.date.getTime() - a.data.date.getTime() ||
      a.data.title.localeCompare(b.data.title),
  )
}

export async function getTalks(
  filter?: (talk: Talk) => boolean,
): Promise<Talk[]> {
  const talks = filter
    ? await getCollection("talks", filter)
    : await getCollection("talks")

  return sortTalks(talks)
}
