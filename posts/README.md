# Blog posts

**One folder in here = one blog post.** Each folder holds the Markdown file
*and every image that belongs to the post*, side by side. The site is fully
static — no backend, no Hugo. A tiny build step turns these folders into the
data the blog pages read.

```
posts/
  2026-07-01-my-headline/
    index.md        ← the post itself (any *.md name works)
    hero.jpg        ← big cover image        (frontmatter:  image: hero.jpg)
    preview.jpg     ← small card thumbnail   (frontmatter:  preview: preview.jpg)
    image-1.png     ← inline body image      (body:  ![caption](image-1.png))
```

Inside the Markdown, reference images by **bare filename** — the build rewrites
them to full URLs. Full URLs (`https://…`) also work and pass through untouched.

## Publish a post (2 steps)

1. Add a folder with a Markdown file (and its images) to `posts/`.
2. From the project root, run:

   ```bash
   node build-blog.mjs
   ```

That regenerates `steeltrace/posts.generated.js`. Refresh the browser (or deploy).
While drafting, use `node build-blog.mjs --watch` to rebuild automatically on every save.

> Wire `node build-blog.mjs` in as your host's **build command** (Netlify / Vercel /
> GitHub Pages / Cloudflare) and publishing becomes: drop the folder → commit → push.

The folder name can be anything. Prefixing with the date
(`2026-07-01-my-headline/`) keeps the folder sorted, but ordering on the site
is driven by the `date` field, not the folder name. Folders and files starting
with `.`/`_` are ignored (drafts: prefix with `_`), as are `README.md` files.
A loose `.md` file directly in `posts/` still works for a post without images.

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
image: hero.jpg            # cover image — bare filename from this folder (or https://…)
preview: preview.jpg       # card thumbnail — falls back to image, then gradient
excerpt: One line shown on the blog card and meta description.
---

Body in **Markdown**. Use `##` / `###` headings, - bullets, 1. numbered lists,
> quotes, `code`, ```fenced blocks```, [links](https://example.com) and
![images](image-1.png).
```

Only `title` is required. Everything else has sensible fallbacks (e.g. the
excerpt falls back to the first paragraph; `cover` cycles a gradient).

## Format 2 — Notion export (drop it in, no editing)

Export a Notion page as **Markdown & CSV**. Notion gives you a `.md` file and a
subfolder of images — put both inside one new folder under `posts/`, and move
the images out of the subfolder so they sit next to the `.md` (update the image
paths in the `.md` to bare filenames). Notion writes the page title as `# Title`
and page properties as `Key: value` lines at the top — the build reads both.
Common property names map automatically: `Category`/`Tags` → category,
`Published`/`Date` → date, `Summary`/`Description` → excerpt, `Author`,
`Cover`, `Glyph`, `Image`.

---

*Never edit `steeltrace/posts.generated.js` by hand — it is overwritten on every build.*
