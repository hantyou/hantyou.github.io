/**
 * Resolve an internal URL against Astro's configured base path.
 *
 * Callers can keep using site-root-relative paths (for example `/people`).
 * External URLs, fragments, and URLs that already contain the base are left
 * untouched.
 */
export const withBase = (href: string): string => {
  const base = import.meta.env.BASE_URL.replace(/^\/+|\/+$/g, "")
  if (!base || !href.startsWith("/") || href.startsWith("//")) return href

  const basePath = `/${base}`
  if (
    href === basePath ||
    href.startsWith(`${basePath}/`) ||
    href.startsWith(`${basePath}?`) ||
    href.startsWith(`${basePath}#`)
  ) {
    return href
  }

  return `${basePath}${href}`.replace(/\/+/g, "/")
}
