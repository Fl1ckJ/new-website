#!/usr/bin/env node
/* SteelTrace blog build — pure Node, zero dependencies.
 *
 * Scans /posts for Markdown files and regenerates
 * steeltrace/posts.generated.js (window.STEELTRACE_POSTS).
 *
 *   Publish a post:  drop a .md file in /posts, then run:  node build-blog.mjs
 *   Watch mode:      node build-blog.mjs --watch
 *
 * Each .md file is one post. Two authoring styles are accepted:
 *
 *   1) Frontmatter (recommended, hand-written):
 *        ---
 *        title: My headline
 *        category: Quality Management
 *        author: Jane Doe
 *        role: Founder            # optional byline subtitle
 *        date: 2026-07-01         # YYYY-MM-DD or "July 1, 2026"
 *        cover: 0                 # 0-6 gradient (ignored if image is set)
 *        glyph: MRB               # short label shown on the cover
 *        image: https://…         # optional cover image URL
 *        excerpt: One-line card summary.
 *        ---
 *        Body in Markdown…
 *
 *   2) Notion export (paste/drop the file Notion gives you — no editing):
 *        # My headline
 *        Category: Quality Management
 *        Author: Jane Doe
 *        Date: July 1, 2026
 *
 *        Body in Markdown…
 *
 * The build never edits your .md files. It only (re)writes the generated JS.
 */
import { readFileSync, writeFileSync, readdirSync, watch } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = join(ROOT, "posts");
const OUT = join(ROOT, "steeltrace", "posts.generated.js");

const MONTHS = ["january","february","march","april","may","june","july",
  "august","september","october","november","december"];

// Property aliases → canonical field (Notion property names vary).
const ALIASES = {
  title: "title", headline: "title", name: "title",
  category: "cat", categories: "cat", tag: "cat", tags: "cat",
  author: "author", by: "author", writer: "author",
  role: "role", subtitle: "role",
  date: "date", published: "date", "publish date": "date",
  cover: "cover", glyph: "glyph", label: "glyph",
  image: "image", "cover image": "image", banner: "image",
  excerpt: "excerpt", summary: "excerpt", description: "excerpt"
};

function slugify(t) {
  return String(t || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function normalizeDate(raw) {
  const s = String(raw || "").trim();
  let m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  // "July 1, 2026" / "1 July 2026" / "July 1 2026"
  m = /([a-z]+)\s+(\d{1,2}),?\s+(\d{4})/i.exec(s) || /(\d{1,2})\s+([a-z]+)\s+(\d{4})/i.exec(s);
  if (m) {
    let mon, day, year;
    if (/^\d/.test(m[1])) { day = +m[1]; mon = MONTHS.indexOf(m[2].toLowerCase()); year = m[3]; }
    else { mon = MONTHS.indexOf(m[1].toLowerCase()); day = +m[2]; year = m[3]; }
    if (mon >= 0) return `${year}-${String(mon + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
  return s; // leave as-is; browser still sorts lexically
}

function stripQuotes(v) {
  v = v.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'");
  }
  return v;
}

function assign(post, rawKey, value) {
  const key = ALIASES[rawKey.toLowerCase().trim()] || rawKey.toLowerCase().trim();
  value = stripQuotes(value);
  if (!value) return;
  if (key === "cover") post.cover = parseInt(value, 10) || 0;
  else if (["cat", "author", "role", "date", "glyph", "image", "excerpt", "title"].includes(key)) post[key] = value;
}

function parse(raw, index) {
  const text = raw.replace(/\r/g, "").replace(/^﻿/, "");
  const post = { title: "", cat: "", author: "", role: "", date: "", cover: index, image: "", glyph: "", excerpt: "", body: "" };

  const fm = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (fm) {
    // Style 1: YAML-ish frontmatter block.
    fm[1].split("\n").forEach((ln) => {
      const m = /^([A-Za-z][\w .-]*?)\s*:\s*(.*)$/.exec(ln);
      if (m) assign(post, m[1], m[2]);
    });
    post.body = text.slice(fm[0].length).trim();
  } else {
    // Style 2: Notion export — "# Title", (blank line), "Key: value" props, (blank), body.
    const lines = text.split("\n");
    let i = 0;
    // 1) title = first heading, else first non-empty line
    for (; i < lines.length; i++) {
      const t = lines[i].trim();
      if (!t) continue;
      const h = /^#{1,6}\s+(.*)/.exec(t);
      post.title = (h ? h[1] : t).trim();
      i++;
      break;
    }
    // 2) skip blank lines Notion leaves between the title and the property block
    while (i < lines.length && !lines[i].trim()) i++;
    // 3) read the property block — only lines whose key is a known property, plus a leading "> excerpt"
    for (; i < lines.length; i++) {
      const t = lines[i].trim();
      if (!t) { i++; break; }                     // blank line ends the property block
      const bq = /^>\s?(.*)$/.exec(t);
      if (bq) { post.excerpt = post.excerpt || bq[1]; continue; }
      const kv = /^([A-Za-z][\w .-]*?)\s*:\s*(.*)$/.exec(t);
      if (kv && ALIASES[kv[1].toLowerCase().trim()]) { assign(post, kv[1], kv[2]); continue; }
      break;                                      // first real body line
    }
    post.body = lines.slice(i).join("\n").trim();
  }

  // Excerpt fallbacks: leading "> …" quote in body, else first paragraph.
  if (!post.excerpt) {
    const bq = /^>\s?(.*)$/m.exec(post.body);
    if (bq && post.body.trimStart().startsWith(">")) {
      post.excerpt = bq[1].trim();
      post.body = post.body.replace(/^>.*(\n>.*)*\n?/, "").trim();
    }
  }
  if (!post.excerpt) {
    post.excerpt = (post.body.split(/\n\s*\n/)[0] || "").replace(/[#>*`_]/g, "").replace(/\n/g, " ").trim();
  }

  post.date = normalizeDate(post.date);
  post.summary = post.excerpt;
  post.slug = slugify(post.title);
  post.id = post.slug;
  delete post.excerpt;
  return post;
}

function build() {
  let files;
  try {
    files = readdirSync(POSTS_DIR).filter((f) => /\.md$/i.test(f) && !/^[._]/.test(f) && f.toLowerCase() !== "readme.md");
  } catch {
    console.error(`✗ No /posts folder found at ${POSTS_DIR}`);
    process.exit(1);
  }

  const posts = files
    .map((f, i) => {
      try { return parse(readFileSync(join(POSTS_DIR, f), "utf8"), i); }
      catch (e) { console.warn(`  ! skipped ${f}: ${e.message}`); return null; }
    })
    .filter((p) => p && p.title)
    // newest first — keeps category chips and "most recent" stable
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const banner =
    "/* AUTO-GENERATED by build-blog.mjs — do not edit by hand.\n" +
    "   Add or edit Markdown files in /posts, then run:  node build-blog.mjs */\n";
  writeFileSync(OUT, banner + "window.STEELTRACE_POSTS = " + JSON.stringify(posts, null, 2) + ";\n");

  console.log(`✓ ${posts.length} post${posts.length === 1 ? "" : "s"} bundled → steeltrace/posts.generated.js`);
  posts.forEach((p) => console.log(`    · ${p.date}  ${p.title}`));
}

build();

if (process.argv.includes("--watch")) {
  console.log("… watching /posts for changes (Ctrl-C to stop)");
  let t = null;
  watch(POSTS_DIR, () => { clearTimeout(t); t = setTimeout(build, 120); });
}
