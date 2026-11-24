import { formatDate } from "../lib/date"
import type { PostSummary } from "../lib/posts"

type Props = {
  posts: PostSummary[]
  title?: string
  basePath?: string
}

export function BlogIndex({ posts, title = "Posts", basePath = "/posts" }: Props) {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>

      {posts.length === 0 ? (
        <p className="mt-8 text-muted-foreground">No posts yet.</p>
      ) : (
        <ol className="mt-8 space-y-4">
          {posts.map((post) => (
            <li key={post.slug} className="flex flex-wrap items-baseline gap-x-3">
              <a href={`${basePath}/${post.slug}`} className="font-medium hover:underline underline-offset-4">
                {post.title}
              </a>
              <time
                dateTime={post.date.toISOString()}
                className="shrink-0 text-sm tabular-nums text-muted-foreground"
              >
                {formatDate(post.date)}
              </time>
            </li>
          ))}
        </ol>
      )}
    </>
  )
}
