#!/usr/bin/env node
/* SteelTrace blog — Notion → site sync.
 *
 * Reads a Notion database of blog posts and regenerates
 * steeltrace/posts.generated.js (the same file build-blog.mjs produces),
 * downloading every image (hero, preview, and in-body) into uploads/blog/<slug>/
 * so the links are permanent (Notion image URLs expire).
 *
 * Requires two environment variables:
 *   NOTION_TOKEN        - internal integration secret (starts with ntn_ / secret_)
 *   NOTION_DATABASE_ID  - the 32-char id of the Blog Posts database
 *
 * Run:  npm install   then   node sync-notion.mjs
 *
 * Expected database columns (case-insensitive, extras ignored):
 *   Name (title) · Category (select) · Author (text) · Subtitle (text)
 *   Date (date) · Excerpt (text) · Cover (number) · Glyph (text)
 *   Hero image (files) · Preview image (files) · Status (select: Draft/Published)
 * The post body is the Notion page content.
 */
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";

const TOKEN = process.env.NOTION_TOKEN;
const DB = process.env.NOTION_DATABASE_ID;
if (!TOKEN || !DB) {
  console.error("✗ Missing NOTION_TOKEN and/or NOTION_DATABASE_ID environment variables.");
  console.error("  Example:  NOTION_TOKEN=ntn_xxx NOTION_DATABASE_ID=abc123 node sync-notion.mjs");
  process.exit(1);
}

const ROOT = process.cwd();
const OUT = join(ROOT, "steeltrace", "posts.generated.js");
const UPLOADS = join(ROOT, "uploads", "blog");

const notion = new Client({ auth: TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

// ---------- helpers ----------
const slugify = (t) =>
  String(t || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function normDate(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s || ""));
  return m ? `${m[1]}-${m[2]}-${m[3]}` : String(s || "");
}

// Find a property by any of several names, case-insensitively.
function prop(props, ...names) {
  const keys = Object.keys(props);
  for (const n of names) {
    const k = keys.find((x) => x.toLowerCase() === n.toLowerCase());
    if (k) return props[k];
  }
  return null;
}

function readText(p) {
  if (!p) return "";
  if (p.type === "title") return (p.title || []).map((t) => t.plain_text).join("").trim();
  if (p.type === "rich_text") return (p.rich_text || []).map((t) => t.plain_text).join("").trim();
  if (p.type === "select") return p.select ? p.select.name : "";
  if (p.type === "multi_select") return (p.multi_select || []).map((s) => s.name).join(", ");
  if (p.type === "date") return p.date ? p.date.start : "";
  if (p.type === "number") return p.number == null ? "" : String(p.number);
  if (p.type === "people") return (p.people || []).map((u) => u.name).filter(Boolean).join(", ");
  if (p.type === "url") return p.url || "";
  return "";
}

function firstFileUrl(p) {
  if (!p || p.type !== "files" || !p.files || !p.files.length) return "";
  const f = p.files[0];
  return f.type === "external" ? (f.external && f.external.url) : (f.file && f.file.url);
}

async function download(url, destDir, baseName) {
  const clean = url.split("?")[0];
  let ext = extname(clean).toLowerCase();
  if (!/^\.(png|jpe?g|gif|webp|svg|avif)$/.test(ext)) ext = ".png";
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${clean}`);
  const buf = Buffer.from(await res.arrayBuffer());
  mkdirSync(destDir, { recursive: true });
  const rel = `${baseName}${ext}`;
  writeFileSync(join(destDir, rel), buf);
  return rel;
}

// ---------- fetch all published pages ----------
async function queryAll() {
  const pages = [];
  let cursor;
  do {
    const res = await notion.databases.query({
      database_id: DB,
      start_cursor: cursor,
      page_size: 100,
    });
    pages.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return pages;
}

async function build() {
  const pages = await queryAll();
  const posts = [];

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const props = page.properties || {};

    const status = readText(prop(props, "Status")).toLowerCase();
    if (status && status !== "published") continue; // skip drafts

    const title = readText(prop(props, "Name", "Title", "Headline"));
    if (!title) continue;
    const slug = slugify(title);
    const destDir = join(UPLOADS, slug);
    const relBase = `uploads/blog/${slug}`;

    // properties → fields
    const cat = readText(prop(props, "Category", "Categories", "Tags"));
    const author = readText(prop(props, "Author", "By", "Writer")) || "SteelTrace Team";
    const role = readText(prop(props, "Subtitle", "Role"));
    const date = normDate(readText(prop(props, "Date", "Published", "Publish date")));
    const excerpt = readText(prop(props, "Excerpt", "Summary", "Description"));
    const coverRaw = readText(prop(props, "Cover"));
    const cover = coverRaw ? (parseInt(coverRaw, 10) || 0) : i % 7;
    const glyph = readText(prop(props, "Glyph", "Label"));

    // hero + preview images (Files & media props)
    let image = "";
    const heroUrl = firstFileUrl(prop(props, "Hero image", "Image", "Cover image", "Banner"));
    if (heroUrl) {
      try { image = `${relBase}/${await download(heroUrl, destDir, "hero")}`; }
      catch (e) { console.warn(`  ! hero image failed for "${title}": ${e.message}`); }
    }
    let preview = "";
    const prevUrl = firstFileUrl(prop(props, "Preview image", "Preview", "Thumbnail"));
    if (prevUrl) {
      try { preview = `${relBase}/${await download(prevUrl, destDir, "preview")}`; }
      catch (e) { console.warn(`  ! preview image failed for "${title}": ${e.message}`); }
    }

    // body: Notion blocks → markdown
    const mdblocks = await n2m.pageToMarkdown(page.id);
    let body = (n2m.toMarkdownString(mdblocks).parent || "").trim();

    // download in-body images and rewrite their URLs to permanent local paths
    const imgRe = /!\[([^\]]*)\]\(([^)\s]+)\)/g;
    const jobs = [];
    let m, n = 0;
    while ((m = imgRe.exec(body))) {
      const url = m[2];
      if (/^https?:\/\//i.test(url)) jobs.push({ full: m[0], alt: m[1], url, idx: ++n });
    }
    for (const j of jobs) {
      try {
        const rel = await download(j.url, destDir, `img-${j.idx}`);
        body = body.split(j.full).join(`![${j.alt}](${relBase}/${rel})`);
      } catch (e) {
        console.warn(`  ! body image ${j.idx} failed for "${title}": ${e.message}`);
      }
    }

    const summary = excerpt ||
      (body.split(/\n\s*\n/)[0] || "").replace(/[#>*`_!\[\]()]/g, "").replace(/\n/g, " ").trim();

    posts.push({
      id: slug, title, cat, author, role, date, cover, image, preview, glyph,
      body, summary, slug,
    });
    console.log(`  · ${date || "????-??-??"}  ${title}`);
  }

  posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const banner =
    "/* AUTO-GENERATED by sync-notion.mjs — do not edit by hand.\n" +
    "   Source of truth is the Notion 'Blog Posts' database. Run:  node sync-notion.mjs */\n";
  writeFileSync(OUT, banner + "window.STEELTRACE_POSTS = " + JSON.stringify(posts, null, 2) + ";\n");

  console.log(`\n✓ ${posts.length} published post${posts.length === 1 ? "" : "s"} synced → steeltrace/posts.generated.js`);
}

build().catch((e) => {
  console.error("✗ Sync failed:", e.body || e.message || e);
  process.exit(1);
});
