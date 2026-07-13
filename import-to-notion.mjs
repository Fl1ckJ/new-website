#!/usr/bin/env node
/* One-time importer: push existing /posts into the Notion database.
 *
 * Post layout (folder-per-post):
 *   posts/<date-slug>/index.md   ← frontmatter + body
 *   posts/<date-slug>/hero.jpg   ← image: hero.jpg
 *   posts/<date-slug>/preview.*  ← preview: preview.png
 *   posts/<date-slug>/image-1.*  ← ![](image-1.png) inline
 * (flat  posts/<name>.md  files are also supported as a fallback.)
 *
 * Creates one Notion page (row) per post with:
 *   - properties from frontmatter (title, category, author, subtitle/role,
 *     date, excerpt, cover, glyph) + Status = Published
 *   - hero/preview images uploaded into their Files columns
 *   - body as real Notion blocks, in-body images uploaded and placed inline
 *
 * Reads the DATABASE SCHEMA first and only writes columns that exist (matched
 * by name, case-insensitive), so it adapts to your exact column names.
 *
 * Usage:
 *   NOTION_TOKEN=ntn_... NOTION_DATABASE_ID=... node import-to-notion.mjs [opts]
 * Options:
 *   --limit N    import only the first N posts (use for a test run)
 *   --dry-run    parse + log what WOULD happen, no Notion calls
 *   --force      create even if a page with the same title already exists
 *
 * Recommended first run:  ... node import-to-notion.mjs --limit 1
 */
import { Client } from "@notionhq/client";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, basename } from "node:path";
import * as martianNS from "@tryfabric/martian";

const markdownToBlocks =
  martianNS.markdownToBlocks || (martianNS.default && martianNS.default.markdownToBlocks);

const TOKEN = process.env.NOTION_TOKEN;
const DB = process.env.NOTION_DATABASE_ID;
const NOTION_VERSION = "2022-06-28";
const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const FORCE = args.includes("--force");
const LIMIT = (() => { const i = args.indexOf("--limit"); return i >= 0 ? parseInt(args[i + 1], 10) : Infinity; })();

if ((!TOKEN || !DB) && !DRY) {
  console.error("✗ Set NOTION_TOKEN and NOTION_DATABASE_ID (or use --dry-run).");
  process.exit(1);
}

const ROOT = process.cwd();
const POSTS_DIR = join(ROOT, "posts");
const notion = TOKEN ? new Client({ auth: TOKEN }) : null;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const keep = (f) => f.toLowerCase() !== "readme.md" && !/^[._]/.test(f);

// ---------- frontmatter ----------
function parse(raw) {
  const text = raw.replace(/\r/g, "");
  const meta = {};
  let body = text;
  const fm = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (fm) {
    body = text.slice(fm[0].length);
    for (const ln of fm[1].split("\n")) {
      const m = /^([A-Za-z_][\w]*)\s*:\s*(.*)$/.exec(ln);
      if (!m) continue;
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      if (v) meta[m[1].toLowerCase()] = v;
    }
  }
  return { meta, body: body.trim() };
}

// ---------- schema-aware properties ----------
let SCHEMA = {};
let TITLE_KEY = "Name";
function resolveCol(...cands) {
  for (const c of cands) { const h = SCHEMA[c.toLowerCase()]; if (h) return h; }
  return null;
}
function textProp(type, value) {
  const content = String(value).slice(0, 2000);
  if (type === "title") return { title: [{ text: { content } }] };
  if (type === "rich_text") return { rich_text: [{ text: { content } }] };
  if (type === "select") return { select: { name: String(value).slice(0, 100) } };
  if (type === "status") return { status: { name: String(value).slice(0, 100) } };
  if (type === "number") { const n = parseFloat(value); return { number: isNaN(n) ? null : n }; }
  if (type === "date") return { date: { start: String(value) } };
  return null;
}

// ---------- resolve an image ref to an absolute local path (or null if remote) ----------
function localPath(src, postDir) {
  if (/^https?:\/\//i.test(src)) return null;         // remote → keep as external
  const rel = src.replace(/^\.?\//, "");
  return rel.startsWith("uploads/") ? join(ROOT, rel) : join(postDir, rel);
}

// ---------- Notion file upload (3-step) ----------
async function uploadFile(absPath) {
  if (!existsSync(absPath)) throw new Error(`file not found: ${absPath}`);
  const createRes = await fetch("https://api.notion.com/v1/file_uploads", {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Notion-Version": NOTION_VERSION, "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!createRes.ok) throw new Error(`file_uploads create ${createRes.status}: ${await createRes.text()}`);
  const created = await createRes.json();
  const buf = readFileSync(absPath);
  const form = new FormData();
  form.append("file", new Blob([buf]), basename(absPath));
  const sendRes = await fetch(created.upload_url, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Notion-Version": NOTION_VERSION },
    body: form,
  });
  if (!sendRes.ok) throw new Error(`file send ${sendRes.status}: ${await sendRes.text()}`);
  await sleep(120);
  return created.id;
}

// file reference for a Files&media property or an image block
async function fileRef(src, postDir) {
  const abs = localPath(src, postDir);
  if (!abs) return { type: "external", name: basename(src.split("?")[0]), external: { url: src } };
  const id = await uploadFile(abs);
  return { type: "file_upload", name: basename(abs), file_upload: { id } };
}

// ---------- body → blocks (images inline where they belong) ----------
async function bodyToBlocks(body, postDir) {
  const lines = body.split("\n");
  const children = [];
  let buf = [];
  const flush = () => {
    const md = buf.join("\n").trim(); buf = [];
    if (md) for (const b of markdownToBlocks(md)) children.push(b);
  };
  for (const ln of lines) {
    const img = /^!\[([^\]]*)\]\(([^)\s]+)\)\s*$/.exec(ln.trim());
    if (img) {
      flush();
      const [, alt, src] = img;
      try {
        const ref = await fileRef(src, postDir);
        const image = { ...ref };
        if (alt) image.caption = [{ type: "text", text: { content: alt.slice(0, 2000) } }];
        children.push({ object: "block", type: "image", image });
      } catch (e) { console.warn(`    ! image skipped (${src}): ${e.message}`); }
    } else buf.push(ln);
  }
  flush();
  return children;
}

// ---------- helpers ----------
async function existingTitles() {
  const set = new Set(); let cursor;
  do {
    const res = await notion.databases.query({ database_id: DB, start_cursor: cursor, page_size: 100 });
    for (const p of res.results) {
      const tp = Object.values(p.properties || {}).find((x) => x.type === "title");
      const t = tp ? (tp.title || []).map((r) => r.plain_text).join("").trim() : "";
      if (t) set.add(t.toLowerCase());
    }
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return set;
}

async function appendChildren(pageId, blocks) {
  for (let i = 0; i < blocks.length; i += 100) {
    await notion.blocks.children.append({ block_id: pageId, children: blocks.slice(i, i + 100) });
    await sleep(350);
  }
}

// discover posts (folder-per-post, with flat .md fallback)
function discover() {
  const out = [];
  for (const name of readdirSync(POSTS_DIR).filter(keep).sort()) {
    const full = join(POSTS_DIR, name);
    let st; try { st = statSync(full); } catch { continue; }
    if (st.isDirectory()) {
      const mds = readdirSync(full).filter((f) => /\.md$/i.test(f) && keep(f)).sort();
      if (mds.length) out.push({ mdPath: join(full, mds[0]), postDir: full });
    } else if (/\.md$/i.test(name)) {
      out.push({ mdPath: full, postDir: POSTS_DIR });
    }
  }
  return out;
}

// ---------- main ----------
async function run() {
  if (!DRY) {
    const db = await notion.databases.retrieve({ database_id: DB });
    for (const [name, def] of Object.entries(db.properties)) {
      SCHEMA[name.toLowerCase()] = { name, type: def.type };
      if (def.type === "title") TITLE_KEY = name;
    }
    console.log("Columns:", Object.values(SCHEMA).map((c) => `${c.name}(${c.type})`).join(", "), "\n");
  }

  const have = (!DRY && !FORCE) ? await existingTitles() : new Set();
  let posts = discover();
  if (LIMIT !== Infinity) posts = posts.slice(0, LIMIT);
  console.log(`Found ${posts.length} post(s) in /posts\n`);

  let created = 0, skipped = 0, failed = 0;
  for (const { mdPath, postDir } of posts) {
    const { meta, body } = parse(readFileSync(mdPath, "utf8"));
    const title = meta.title || "";
    if (!title) { console.warn(`  ! ${mdPath}: no title`); skipped++; continue; }
    if (have.has(title.toLowerCase())) { console.log(`  = already in Notion: ${title}`); skipped++; continue; }
    if (DRY) { console.log(`  + would create: ${title}`); created++; continue; }

    try {
      const props = {};
      props[TITLE_KEY] = textProp("title", title);
      const map = [
        [["category", "categories", "tags"], meta.category],
        [["author", "by", "writer"], meta.author],
        [["subtitle", "role"], meta.role],
        [["date", "published"], meta.date],
        [["excerpt", "summary", "description"], meta.excerpt],
        [["cover"], meta.cover],
        [["glyph", "label"], meta.glyph],
        [["status"], "Published"],
      ];
      for (const [names, val] of map) {
        if (val == null || val === "") continue;
        const col = resolveCol(...names);
        if (!col) continue;
        const pv = textProp(col.type, val);
        if (pv) props[col.name] = pv;
      }
      const heroCol = resolveCol("hero image", "image", "cover image", "banner");
      if (heroCol && heroCol.type === "files" && meta.image) {
        try { props[heroCol.name] = { files: [await fileRef(meta.image, postDir)] }; }
        catch (e) { console.warn(`    ! hero skipped: ${e.message}`); }
      }
      const prevCol = resolveCol("preview image", "preview", "thumbnail");
      if (prevCol && prevCol.type === "files" && meta.preview) {
        try { props[prevCol.name] = { files: [await fileRef(meta.preview, postDir)] }; }
        catch (e) { console.warn(`    ! preview skipped: ${e.message}`); }
      }

      const blocks = await bodyToBlocks(body, postDir);
      const page = await notion.pages.create({
        parent: { database_id: DB },
        properties: props,
        children: blocks.slice(0, 100),
      });
      if (blocks.length > 100) await appendChildren(page.id, blocks.slice(100));

      created++;
      console.log(`  ✓ ${title}`);
      await sleep(400);
    } catch (e) {
      failed++;
      console.error(`  ✗ ${title}: ${e.body ? JSON.stringify(e.body) : e.message}`);
    }
  }
  console.log(`\nDone. created=${created} skipped=${skipped} failed=${failed}` + (DRY ? " (dry run)" : ""));
}

run().catch((e) => { console.error("✗ Import failed:", e.body || e.message || e); process.exit(1); });
