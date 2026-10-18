import { getCollection, type CollectionEntry } from "astro:content"

export type Post = CollectionEntry<"posts">
export type Visibility = Post["data"]["visibility"]

// plain data handed to react components
export type PostSummary = {
  slug: string
  title: string
  date: Date
  description?: string
}

// root-level routes that unlisted slugs must not shadow
const RESERVED_SLUGS = new Set(["blog", "worksheets", "404", "index", "sitemap-index", "sitemap-0"])

export async function getPostsByVisibility(visibility: Visibility) {
  const posts = await getCollection("posts", (p) => p.data.visibility === visibility)
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

export function getPublicPosts() {
  return getPostsByVisibility("public")
}

export async function getUnlistedPosts() {
  const posts = await getPostsByVisibility("unlisted")
  const clashes = posts.filter((p) => RESERVED_SLUGS.has(p.id))
  if (clashes.length) {
    const names = clashes.map((p) => p.id).join(", ")
    throw new Error(`unlisted post slug collides with a reserved route: ${names}`)
  }
  return posts
}

export function toSummary(post: Post): PostSummary {
  const { title, date, description } = post.data
  return { slug: post.id, title, date, description }
}
