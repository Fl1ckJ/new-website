#!/usr/bin/env node
/* Export all /posts into a self-contained folder for review / manual import:
 *
 *   notion-export/
 *     posts.csv                 ← one row per post (all field values + body)
 *     <date-slug>/              ← one folder per post, its images copied in
 *       hero.jpg
 *       preview.png
 *       image-1.png ...
 *
 * The "Folder" column in the CSV tells you which image folder belongs to which
 * post. Run:  node export-notion-csv.mjs
 */
import { readFileSync, readdirSync, statSync, mkdirSync, copyFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const POSTS_DIR = join(ROOT, "posts");
const OUT_DIR = join(ROOT, "notion-export");
const keep = (f) => f.toLowerCase() !== "readme.md" && !/^[._]/.test(f);

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

const csvCell = (v) => {
  const s = String(v == null ? "" : v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};

// fresh output dir
if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const headers = ["Name", "Category", "Author", "Subtitle", "Date", "Excerpt",
  "Cover", "Glyph", "Status", "Folder", "Hero", "Preview", "InlineImages"];
const rows = [headers.join(",")];

let count = 0, imgCount = 0;
for (const name of readdirSync(POSTS_DIR).filter(keep).sort()) {
  const full = join(POSTS_DIR, name);
  if (!statSync(full).isDirectory()) continue;
  const mds = readdirSync(full).filter((f) => /\.md$/i.test(f) && keep(f)).sort();
  if (!mds.length) continue;

  const { meta, body } = parse(readFileSync(join(full, mds[0]), "utf8"));
  if (!meta.title) continue;

  // copy every non-markdown file (images) into notion-export/<name>/
  const destDir = join(OUT_DIR, name);
  mkdirSync(destDir, { recursive: true });
  const inline = [];
  for (const f of readdirSync(full)) {
    if (/\.md$/i.test(f) || !keep(f)) continue;
    copyFileSync(join(full, f), join(destDir, f));
    imgCount++;
    if (!/^hero\.|^preview\./i.test(f)) inline.push(f);
  }

  // body as importable CONTENT (a markdown file), not a CSV field.
  // Notion import turns "# Title" into the page title and the rest into page content.
  writeFileSync(join(destDir, "content.md"), `# ${meta.title}\n\n${body}\n`);

  rows.push([
    meta.title, meta.category || "", meta.author || "", meta.role || "",
    meta.date || "", meta.excerpt || "", meta.cover || "", meta.glyph || "",
    "Published", name, meta.image || "", meta.preview || "",
    inline.join(" | "),
  ].map(csvCell).join(","));
  count++;
}

writeFileSync(join(OUT_DIR, "posts.csv"), rows.join("\n") + "\n");
console.log(`✓ ${count} posts → notion-export/posts.csv`);
console.log(`✓ ${imgCount} images copied into per-post folders under notion-export/`);
