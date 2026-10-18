// the rendered markdown body arrives as children (astro slot content)
import type { ReactNode } from "react"
import { formatDate } from "../lib/date"
import type { PostSummary } from "../lib/posts"

type Props = {
  post: PostSummary
  backHref?: string
  children: ReactNode
}

export function PostView({ post, backHref, children }: Props) {
  return (
    <>
      {backHref && (
        <a href={backHref} className="text-sm text-muted-foreground hover:text-foreground">
          ← all posts
        </a>
      )}
      <article className="mt-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
          <time dateTime={post.date.toISOString()} className="mt-2 block text-sm text-muted-foreground">
            {formatDate(post.date)}
          </time>
        </header>
        <div className="prose prose-neutral dark:prose-invert max-w-none">{children}</div>
      </article>
    </>
  )
}
