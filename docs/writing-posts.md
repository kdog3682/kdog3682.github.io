# Writing blog posts

Posts are Markdown files in `src/content/posts/<slug>.md`. The filename is the slug and the URL (`/blog/<slug>` for public posts; unlisted posts are served at `/<slug>`).

## Frontmatter

Defined in `src/content.config.ts`:

```yaml
---
title: Required
date: 2026-11-22          # YYYY-MM-DD
description: Optional one-liner (index/SEO)
visibility: public        # public | unlisted | private (default public)
---
```

- `public`: listed on the blog index.
- `unlisted`: reachable by URL only. Slug must not collide with reserved routes (`blog`, `worksheets`, `404`, `index`, ...; see `src/lib/posts.ts`).
- `private`: not served.

Default to `public` unless told otherwise.

## Body

- Don't repeat the title as an `h1`; the layout renders it. Start sections at `##`.
- Rendered with Tailwind typography (`prose`), so plain Markdown is enough.
- Poetry: Markdown joins consecutive lines, so end each line of a stanza with two trailing spaces and separate stanzas with a blank line.
- When transcribing from OCR/scans, fix obvious recognition errors and normalise to one script (simplified unless the source is traditional), and tell the user which characters were guesses.

## Checking

`bun run build` must pass. Don't typecheck.
