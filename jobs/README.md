# /jobs — open roles for the Careers page

Same idea as `/posts` for the blog. **One role = one folder** holding a Markdown
file (and any images it needs, side by side):

```
jobs/
  product-owner/
    index.md          ← the role (frontmatter + body)
    cover.jpg         ← optional, referenced as  image: cover.jpg
  ai-engineer/
    index.md
  README.md           ← this file (ignored by the build)
```

After adding or editing a folder, run:

```bash
node build-jobs.mjs        # → steeltrace/jobs.generated.js  (what the site reads)
```

Folders/files starting with `.` or `_`, and `README.md`, are ignored (drafts).

---

## Fields (frontmatter)

Copy this template into a new `index.md`:

```markdown
---
title: Product Owner                     # required — role name
team: Product                            # team / department chip
location: Heerlen, NL · On-site          # location chip
type: Full-time                          # employment-type badge
cover: 2                                 # 0–5 gradient, used when no image is set
date: 2026-07-04                         # newest roles sort to the top
apply:                                   # optional external URL (e.g. LinkedIn).
                                         #   set → Apply button opens it
                                         #   empty → Apply scrolls to the on-page form
image:                                   # optional image (shown on both the card and the modal header)
---
> One-line summary shown on the card and at the top of the role.

Intro paragraph about the role.

### What you'll do
- …
- …

### Must-haves
- …
- …
```

| Field | Required | Notes |
|---|---|---|
| `title` | ✅ | Role name. The slug/id is derived from it. |
| `team` | – | Chip on the card + modal. |
| `location` | – | Chip on the card + modal. Defaults to “Remote”. |
| `type` | – | Badge on the cover. Defaults to “Full-time”. |
| `cover` | – | Gradient 0–5 (0 teal, 1 green, 2 blue, 3 purple, 4 slate, 5 amber). Ignored if an image is set. |
| `date` | – | `YYYY-MM-DD`. Controls order (newest first). |
| `apply` | – | External application URL. Empty → the Apply button uses the form on the careers page. |
| `image` | – | One image used for both the card thumbnail and the modal header. Omit it to get the `cover` gradient + role initials. |

Image paths are relative to the role’s folder (e.g. `image: cover.jpg` →
`jobs/product-owner/cover.jpg`). Absolute URLs (`https://…`) and root paths
(`uploads/…`, `graphics/…`) are left as-is.

The summary line is the `> blockquote` at the top of the body (or a `summary:`
frontmatter field). If neither is present, the first paragraph is used.

---

## Publishing via Notion instead

This same `steeltrace/jobs.generated.js` can also be produced from a Notion
**Job offers** database — see `NOTION-JOBS-SETUP.md`. Use whichever you prefer;
both write the same file.
