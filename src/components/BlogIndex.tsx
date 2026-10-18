import { formatDate } from "../lib/date"
import type { PostSummary } from "../lib/posts"

type Props = {
  posts: PostSummary[]
}

export function BlogIndex({ posts }: Props) {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">lu <span className="text-muted-foreground">路</span></h1>

      {posts.length === 0 ? (
        <p className="mt-8 text-muted-foreground">No posts yet.</p>
      ) : (
        <ol className="mt-8 space-y-4">
          {posts.map((post) => (
            <li key={post.slug} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
              <time
                dateTime={post.date.toISOString()}
                className="shrink-0 text-sm tabular-nums text-muted-foreground sm:w-40"
              >
                {formatDate(post.date)}
              </time>
              <a href={`/blog/${post.slug}`} className="font-medium hover:underline underline-offset-4">
                {post.title}
              </a>
            </li>
          ))}
        </ol>
      )}
    </>
  )
}
