import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"

// public   -> listed on /blog, served at /blog/<slug>
// unlisted -> never linked, served at /<slug>
// private  -> not built at all
const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    visibility: z.enum(["public", "unlisted", "private"]).default("public"),
  }),
})

export const collections = { posts }
