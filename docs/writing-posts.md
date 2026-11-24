# Writing blog posts

Posts are Markdown (`.md`) or MDX (`.mdx`, when a post needs components) files in `src/content/posts/<slug>`. The filename is the slug and the URL (`/posts/<slug>` for public posts; unlisted posts are served at `/<slug>`).

## Frontmatter

Defined in `src/content.config.ts`:

```yaml
---
title: Required
date: 2026-11-22          # YYYY-MM-DD
description: Optional one-liner (index/SEO)
visibility: public        # public | preview | unlisted | private (default public)
---
```

- `public`: listed on the blog index.
- `preview`: not on `/posts`; listed on `/preview` and served at `/preview/<slug>` (noindex).
- `unlisted`: reachable by URL only. Slug must not collide with reserved routes (`posts`, `worksheets`, `404`, `index`, ...; see `src/lib/posts.ts`).
- `private`: not served.

Default to `public` unless told otherwise.

## Body

- Don't repeat the title as an `h1`; the layout renders it. Start sections at `##`.
- Rendered with Tailwind typography (`prose`), so plain Markdown is enough.
- Poetry: Markdown joins consecutive lines, so end each line of a stanza with two trailing spaces and separate stanzas with a blank line.
- When transcribing from OCR/scans, fix obvious recognition errors and normalise to one script (simplified unless the source is traditional), and tell the user which characters were guesses.

## Checking

`bun run build` must pass. Don't typecheck.

## Title and slug

The title should match the slug: `My Grandfather's Poem` → `my-grandfathers-poem`.

## Poems

Use an `.mdx` post and the `Poem` component (`src/components/poem/Poem.tsx`):

```mdx
import { Poem } from "../../components/poem/Poem"

<Poem client:load title="..." author="..." zh={`line\nline\n\nline\nline`} en={`...same shape...`} />
```

- `zh` / `en`: stanzas separated by a blank line, one verse line per line; `en` must match `zh` line for line.
- `titleEn` / `authorEn` (optional): English title and author, shown under the Chinese only with `showHeaderEn` (default false; not a reader toggle).
- `pinyin` and `english` are reader toggles (default off). The post needs `client:load` on `<Poem>` for them to work.
