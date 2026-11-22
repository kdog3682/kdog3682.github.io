import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"

// public   -> listed on /posts, served at /posts/<slug>
// unlisted -> never linked, served at /<slug>
// preview  -> listed on /preview (noindex), served at /preview/<slug>
// private  -> not built at all
const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    visibility: z.enum(["public", "preview", "unlisted", "private"]).default("public"),
  }),
})

export const collections = { posts }
