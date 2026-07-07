# Blog posts

**One `.md` file in this folder = one blog post.** The site is fully static —
no backend, no Hugo. A tiny build step turns these files into the data the
blog pages read.

## Publish a post (2 steps)

1. Add a Markdown file to this folder (write it by hand, or export it from Notion).
2. From the project root, run:

   ```bash
   node build-blog.mjs
   ```

That regenerates `steeltrace/posts.generated.js`. Refresh the browser (or deploy).
While drafting, use `node build-blog.mjs --watch` to rebuild automatically on every save.

> Wire `node build-blog.mjs` in as your host's **build command** (Netlify / Vercel /
> GitHub Pages / Cloudflare) and publishing becomes: drop the file → commit → push.

The filename can be anything ending in `.md`. Prefixing with the date
(`2026-07-01-my-headline.md`) keeps the folder sorted, but ordering on the site
is driven by the `date` field, not the filename. Files named `README.md` or
starting with `.`/`_` are ignored (drafts: prefix with `_`).

## Format 1 — Frontmatter (recommended for hand-written)

```markdown
---
title: My headline
category: Quality Management
author: Jane Doe
role: Founder & CEO        # optional byline subtitle
date: 2026-07-01           # YYYY-MM-DD  (or "July 1, 2026")
cover: 0                   # 0–6 gradient, ignored when image is set
glyph: MRB                 # short label shown on the cover tile
image: https://…           # optional cover image URL
excerpt: One line shown on the blog card and meta description.
---

Body in **Markdown**. Use `##` / `###` headings, - bullets, 1. numbered lists,
> quotes, `code`, ```fenced blocks```, [links](https://example.com) and
![images](https://example.com/pic.png).
```

Only `title` is required. Everything else has sensible fallbacks (e.g. the
excerpt falls back to the first paragraph; `cover` cycles a gradient).

## Format 2 — Notion export (drop it in, no editing)

Export a Notion page as **Markdown & CSV**, then drop the `.md` file here. Notion
writes the page title as `# Title` and page properties as `Key: value` lines at
the top — the build reads both. Common property names map automatically:
`Category`/`Tags` → category, `Published`/`Date` → date, `Summary`/`Description`
→ excerpt, `Author`, `Cover`, `Glyph`, `Image`.

If Notion exported images as a local subfolder, move them somewhere the site
serves (e.g. `uploads/`) and update the image paths, or set a single `image:`
cover URL.

---

*Never edit `steeltrace/posts.generated.js` by hand — it is overwritten on every build.*
