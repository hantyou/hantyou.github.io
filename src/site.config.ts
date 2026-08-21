import type {
  FooterConfig,
  LinkConfig,
  ProfileConfig,
  PublicationConfig,
  SiteConfig,
} from "@/types"

export const SITE: SiteConfig = {
  title: "Peiyuan Zhai",
  description:
    "PhD researcher at TU Delft studying autonomous perception, sensor fusion, and Bayesian learning.",
  href: "https://slipzhai.cc/zhai",
  author: "Peiyuan Zhai",
  dir: "ltr",
  defaultPageImage: "/img/social-preview.png",
  defaultPostImage: "/img/social-preview.png",

  locale: {
    lang: "en-US",
    options: {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    },
  },

  blog: {
    featuredPostCount: 3,
    postsPerPage: 8,
    tocMaxDepth: 3,
    shareActions: ["x"],
  },

  home: {
    careerHighlightCount: 3,
    updateCount: 0,
    publicationCount: 2,
  },

  favicon: "/favicon.ico",
  prerender: true,
  npmCDN: "https://cdn.jsdelivr.net/npm",

  license: {
    label: "CC-BY-4.0",
    href: "https://creativecommons.org/licenses/by/4.0/",
  },
}

export const PROFILE: ProfileConfig = {
  name: SITE.title,
  tagline: "PhD Researcher, Signal Processing",
  email: "p.zhai@tudelft.nl",
  location: "Delft, The Netherlands",
  researchInterests: [
    {
      label: "Autonomous perception",
      href: "/projects/dynamic-occupancy-grid-mapping",
    },
    { label: "Sensor fusion", href: "/projects/radar-lidar-fusion" },
    {
      label: "Occupancy-grid mapping",
      href: "/projects/camera-aided-occupancy-mapping",
    },
    {
      label: "Sparse Bayesian learning",
      href: "/projects/camera-aided-occupancy-mapping",
    },
  ],
  links: {
    github: "https://github.com/hantyou",
    linkedin: "https://www.linkedin.com/in/peiyuan-zhai",
    cv: "/assets/pdf/peiyuan_zhai_cv.pdf",
    school: "https://sps.ewi.tudelft.nl/People/bio.php?id=905",
  },
  // where the links above show up. true = that section's default set, false or
  // [] = none, or list keys in the order you want them. The header renders its
  // set as bare icons, so it defaults to a handful rather than everything.
  linksPlacement: {
    header: ["email", "github", "linkedin"],
    // Remove "school" to hide the school-profile button; add it back to show it.
    about: ["email", "github", "linkedin", "school"],
    footer: ["email", "github", "linkedin"],
  },
}

export const NAV_LINKS: LinkConfig[] = [
  { href: "/blog", label: "Blog" },
  { href: "/now", label: "Now & About" },
  { href: "/publications", label: "Publications" },
  { href: "/projects", label: "Research" },
  { href: "/cv", label: "CV" },
  { href: "/teaching", label: "Teaching" },
]

export const NAVIGATION: LinkConfig[] = NAV_LINKS.map(({ href, label }) => ({
  href,
  label,
}))

export const PUB_CONFIG: PublicationConfig = {
  maxFirstAuthors: 6,
  maxLastAuthors: 1,
  highlightAuthor: {
    firstName: "Peiyuan",
    lastName: "Zhai",
    aliases: ["P. Zhai"],
  },
  equalSymbols: {
    first: "*",
    second: "†",
    third: "‡",
    last: "§",
  },
}

export const FOOTER: FooterConfig = {
  credits: true,
  footerLinks: [],
}

if (import.meta.env.DEV && typeof window === "undefined") {
  const {
    FooterConfigSchema,
    ProfileConfigSchema,
    PublicationConfigSchema,
    SiteConfigSchema,
  } = await import("@/schemas")
  SiteConfigSchema.parse(SITE)
  ProfileConfigSchema.parse(PROFILE)
  FooterConfigSchema.parse(FOOTER)
  PublicationConfigSchema.parse(PUB_CONFIG)
}
