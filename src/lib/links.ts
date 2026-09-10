/**
 * Join an internal URL to a base path.
 *
 * Callers can keep using site-root-relative paths (for example `/people`).
 * External URLs, fragments, and URLs that already contain the base are left
 * untouched.
 */
export const joinBase = (base: string, href: string): string => {
  const normalized = base.replace(/^\/+|\/+$/g, "")
  if (!normalized || !href.startsWith("/") || href.startsWith("//")) return href

  const basePath = `/${normalized}`
  if (
    href === basePath ||
    href.startsWith(`${basePath}/`) ||
    href.startsWith(`${basePath}?`) ||
    href.startsWith(`${basePath}#`)
  ) {
    return href
  }

  // The site root is the base itself. Returning `${basePath}/` here would
  // contradict `trailingSlash: "never"`, which the dev server enforces with a
  // 404 even though static hosts serve the directory index either way.
  if (href === "/") return basePath

  return `${basePath}${href}`.replace(/\/+/g, "/")
}

/** Resolve an internal URL against Astro's configured base path. */
export const withBase = (href: string): string =>
  joinBase(import.meta.env.BASE_URL, href)
