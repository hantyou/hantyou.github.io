import { defineCollection, reference } from "astro:content"
import { file, glob } from "astro/loaders"
import { z } from "astro/zod"

import { ProfileLinkConfigSchema, ProjectTypeSchema } from "@/schemas"

import { createLocalDate } from "@/lib/date-utils"
import {
  dedupLowerCase,
  dedupPreserveCase,
  slugify,
} from "@/lib/string-manipulation"

const yearMonthDateSchema = z
  .union([z.date(), z.string().transform(createLocalDate)])
  .describe("Should be valid YYYY-MM format.")

const dateSchema = z
  .union([z.date(), z.string().transform(createLocalDate)])
  .refine((date) => !Number.isNaN(date.getTime()), {
    error: "Invalid date format. Must be YYYY-MM-DD or ISO datetime format.",
  })

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string().max(200).optional(),
        createdAt: dateSchema,
        updatedAt: dateSchema.optional(),
        order: z.number().optional(),
        image: image().optional(),
        tags: z
          .array(z.string())
          .default([])
          .transform((arr) => dedupLowerCase(arr).map((tag) => slugify(tag))),
        authors: z.array(reference("people")).default([]),
        draft: z.boolean().default(false),
        stage: z.enum(["seedling", "budding", "evergreen"]).optional(),
        audience: z.string().max(300).optional(),
      })
      .refine(
        (data) =>
          !data.createdAt || !data.updatedAt || data.updatedAt > data.createdAt,
        {
          error: "Modified date must be after published date",
        },
      ),
})

const people = defineCollection({
  loader: file("./src/content/people.toml"),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      name: z.string(),
      pronouns: z.string().optional(),
      avatar: z
        .union([z.url(), z.string().startsWith("/"), image()])
        .optional()
        .describe(
          "Avatar URL, /public path, or path to a local image relative to src/content/ (optimized at build).",
        ),
      bio: z.string().max(200).optional(),
      affiliation: z.string().max(100).optional(),
      links: ProfileLinkConfigSchema,
    }),
})

const projectActionVariantSchema = z.enum([
  "default",
  "primary",
  "accent",
  "destructive",
  "outline",
  "primary-outline",
  "accent-outline",
  "destructive-outline",
  "ghost",
])

const programActionSchema = z.object({
  href: z.string().trim().min(1),
  label: z.string().trim().min(1).max(60),
  variant: projectActionVariantSchema.optional(),
})

const programSchema = z.object({
  eyebrow: z.string().trim().min(1).max(160).optional(),
  heading: z.string().trim().min(1).max(80).optional(),
  description: z.string().trim().min(1).max(320).optional(),
  order: z.number().int().min(0).optional(),
  actions: z.array(programActionSchema).max(6).default([]),
  strands: z
    .object({
      label: z.string().trim().min(1).max(80).optional(),
      title: z.string().trim().min(1).max(120).optional(),
      description: z.string().trim().min(1).max(320).optional(),
    })
    .optional(),
})

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/!(*README).md" }),
  schema: z
    .object({
      title: z.string().max(75),
      selected: z.boolean().default(false),
      fromDate: yearMonthDateSchema.optional(),
      toDate: yearMonthDateSchema.optional(),
      code: z.url().optional(),
      doc: z.url().optional(),
      paper: z.url().optional(),
      url: z.url().optional(),
      release: z.url().optional(),
      types: z.array(ProjectTypeSchema).default([]),
      parentProject: z.string().trim().min(1).optional(),
      timelineLabel: z.string().trim().min(1).max(80).optional(),
      timelineOrder: z.number().int().min(0).optional(),
      researchQuestion: z.string().trim().min(1).max(260).optional(),
      contribution: z.string().trim().min(1).max(260).optional(),
      relatedPublications: z.array(z.string().trim().min(1)).default([]),
      skills: z
        .array(z.string().trim().min(1))
        .default([])
        .transform((arr) => dedupPreserveCase(arr)),
      description: z.string().max(200).optional(),
      program: programSchema.optional(),
    })
    .refine(
      (data) => !data.fromDate || !data.toDate || data.toDate >= data.fromDate,
      {
        error: "End date must be on or after start date",
      },
    ),
})

const talks = defineCollection({
  loader: glob({ base: "./src/content/talks", pattern: "**/!(*README).md" }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(120),
      event: z.string().trim().min(1).max(120),
      location: z.string().trim().min(1).max(80).optional(),
      date: yearMonthDateSchema,
      description: z.string().max(200).optional(),
      video: z.url().optional(),
      slides: z
        .string()
        .startsWith("/")
        .optional()
        .describe("Site-root-relative path to a PDF in public/."),
      poster: z
        .string()
        .startsWith("/")
        .optional()
        .describe("Site-root-relative path to a PDF in public/."),
      thumbnail: image()
        .optional()
        .describe("Cover image, relative to this file. Optimized at build."),
      thumbnailOrientation: z
        .enum(["landscape", "portrait"])
        .default("landscape"),
      selected: z.boolean().default(false),
    }),
})

const updates = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/updates" }),
  schema: z.object({}),
})

const experience = defineCollection({
  loader: file("./src/content/experience.json"),
  schema: z.object({
    category: z.enum(["research", "education", "teaching"]),
    title: z.string(),
    org: z.string(),
    orgUrl: z.url().optional(),
    startDate: yearMonthDateSchema,
    endDate: yearMonthDateSchema.optional(),
    location: z.string().optional(),
    description: z.string().optional(),
  }),
})

export const collections = {
  blog,
  experience,
  people,
  projects,
  talks,
  updates,
}
