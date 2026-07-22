#!/usr/bin/env node
/* SteelTrace careers build — pure Node, zero dependencies.
 *
 * Scans /jobs and regenerates steeltrace/jobs.generated.js
 * (window.STEELTRACE_JOBS), the file careers.html reads to render the
 * open-roles board.  Mirrors build-blog.mjs exactly — one job = one FOLDER:
 *
 *   jobs/product-owner/
 *     index.md        ← the role (any *.md name works, e.g. a Notion export)
 *     cover.jpg       ← frontmatter:  image: cover.jpg   (optional)
 *
 * Inside the markdown, reference images by bare filename (or ./filename) —
 * the build rewrites them to jobs/<folder>/… . Absolute URLs (https://…) and
 * root paths (uploads/…, /…) pass through untouched. Loose *.md files directly
 * in /jobs also work (for image-less roles).
 *
 *   Publish a role:  drop a folder in /jobs, then run:  node build-jobs.mjs
 *   Watch mode:      node build-jobs.mjs --watch
 *
 * Two authoring styles are accepted (same as the blog):
 *
 *   1) Frontmatter (recommended, hand-written):
 *        ---
 *        title: Product Owner
 *        team: Product
 *        location: Heerlen, NL · On-site
 *        type: Full-time
 *        cover: 2                 # 0-5 gradient (ignored if image is set)
 *        date: 2026-07-04         # optional — newest roles sort first
 *        image: cover.jpg         # optional cover image
 *        summary: One-line card summary.
 *        ---
 *        > One-line card summary (alternative to the summary: field)
 *        Body in Markdown…
 *
 *   2) Notion export ("## Title", "Team: …" props, blank line, body).
 *
 * The build never edits your .md files. It only (re)writes the generated JS.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, watch } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const MONTHS = ["january","february","march","april","may","june","july",
  "august","september","october","november","december"];

// Property aliases → canonical field (Notion / hand-written names vary).
const ALIASES = {
  title: "title", headline: "title", name: "title", role: "title", position: "title",
  team: "team", department: "team",
  location: "loc", loc: "loc", place: "loc",
  type: "type", employment: "type", "employment type": "type",
  cover: "cover",
  image: "img", "cover image": "img", banner: "img", photo: "img", preview: "img", thumbnail: "img",
  apply: "link", "apply link": "link", "apply url": "link", link: "link", url: "link",
  date: "date", posted: "date", "posted date": "date", published: "date",
  summary: "summary", excerpt: "summary", description: "summary", subtitle: "summary"
};

const ROOT = dirname(fileURLToPath(import.meta.url));
const JOBS_DIR = join(ROOT, "jobs");
const OUT = join(ROOT, "steeltrace", "jobs.generated.js");

function slugify(t) {
  return String(t || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function normalizeDate(raw) {
  const s = String(raw || "").trim();
  let m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = /([a-z]+)\s+(\d{1,2}),?\s+(\d{4})/i.exec(s) || /(\d{1,2})\s+([a-z]+)\s+(\d{4})/i.exec(s);
  if (m) {
    let mon, day, year;
    if (/^\d/.test(m[1])) { day = +m[1]; mon = MONTHS.indexOf(m[2].toLowerCase()); year = m[3]; }
    else { mon = MONTHS.indexOf(m[1].toLowerCase()); day = +m[2]; year = m[3]; }
    if (mon >= 0) return `${year}-${String(mon + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
  return s;
}

function stripQuotes(v) {
  v = v.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'");
  }
  return v;
}

function assign(job, rawKey, value) {
  const key = ALIASES[rawKey.toLowerCase().trim()] || rawKey.toLowerCase().trim();
  value = stripQuotes(value);
  if (!value) return;
  if (key === "cover") job.cover = parseInt(value, 10) || 0;
  else if (["title", "team", "loc", "type", "img", "link", "date", "summary"].includes(key)) job[key] = value;
}

/* ---- asset-path rewriting (same rules as the blog) ---------------------- */
const PASS_THROUGH = /^(?:[a-z][a-z0-9+.-]*:|\/\/|\/|#)/i;
const ROOT_DIRS = /^(?:jobs|posts|uploads|graphics|screenshots|steeltrace)\//;

function rewritePath(p, base) {
  if (!base || !p) return p;
  p = p.replace(/^\.\//, "");
  if (PASS_THROUGH.test(p) || ROOT_DIRS.test(p)) return p;
  return base + p;
}

function rewriteBody(body, base) {
  if (!base) return body;
  body = body.replace(/(!\[[^\]]*\]\()([^)\s]+)((?:\s+"[^"]*")?\))/g,
    (m, pre, src, post) => pre + rewritePath(src, base) + post);
  body = body.replace(/(<img\b[^>]*?\bsrc=")([^"]+)(")/gi,
    (m, pre, src, post) => pre + rewritePath(src, base) + post);
  return body;
}

function parse(raw, index, base) {
  const text = raw.replace(/\r/g, "").replace(/^﻿/, "");
  const job = { title: "", team: "", loc: "", type: "Full-time", cover: index, img: "", link: "", date: "", summary: "", body: "" };

  const fm = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (fm) {
    fm[1].split("\n").forEach((ln) => {
      const m = /^([A-Za-z][\w .-]*?)\s*:\s*(.*)$/.exec(ln);
      if (m) assign(job, m[1], m[2]);
    });
    job.body = text.slice(fm[0].length).trim();
  } else {
    // Notion export: "## Title", props, blank, body.
    const lines = text.split("\n");
    let i = 0;
    for (; i < lines.length; i++) {
      const t = lines[i].trim();
      if (!t) continue;
      const h = /^#{1,6}\s+(.*)/.exec(t);
      job.title = (h ? h[1] : t).trim();
      i++;
      break;
    }
    while (i < lines.length && !lines[i].trim()) i++;
    for (; i < lines.length; i++) {
      const t = lines[i].trim();
      if (!t) { i++; break; }
      const bq = /^>\s?(.*)$/.exec(t);
      if (bq) { job.summary = job.summary || bq[1]; continue; }
      const kv = /^([A-Za-z][\w .-]*?)\s*:\s*(.*)$/.exec(t);
      if (kv && ALIASES[kv[1].toLowerCase().trim()]) { assign(job, kv[1], kv[2]); continue; }
      break;
    }
    job.body = lines.slice(i).join("\n").trim();
  }

  // Summary fallbacks: leading "> …" quote in body, else first paragraph.
  if (!job.summary) {
    if (job.body.trimStart().startsWith(">")) {
      const bq = /^>\s?(.*)$/m.exec(job.body);
      if (bq) {
        job.summary = bq[1].trim();
        job.body = job.body.replace(/^>.*(\n>.*)*\n?/, "").trim();
      }
    }
  } else if (job.body.trimStart().startsWith(">")) {
    // summary came from frontmatter AND body opens with the same quote → drop the quote from the body
    job.body = job.body.replace(/^>.*(\n>.*)*\n?/, "").trim();
  }
  if (!job.summary) {
    job.summary = (job.body.split(/\n\s*\n/)[0] || "").replace(/[#>*`_]/g, "").replace(/\n/g, " ").trim();
  }

  job.date = normalizeDate(job.date);
  job.slug = slugify(job.title);
  job.id = job.slug || ("r" + index);
  job.img = rewritePath(job.img, base);
  job.body = rewriteBody(job.body, base);
  return job;
}

function collectSources() {
  const keep = (n) => !/^[._]/.test(n) && n.toLowerCase() !== "readme.md";
  const sources = [];
  for (const name of readdirSync(JOBS_DIR).filter(keep).sort()) {
    const full = join(JOBS_DIR, name);
    if (statSync(full).isDirectory()) {
      const mds = readdirSync(full).filter((f) => /\.md$/i.test(f) && keep(f)).sort();
      if (!mds.length) { console.warn(`  ! ${name}/ has no .md file — skipped`); continue; }
      if (mds.length > 1) console.warn(`  ! ${name}/ has ${mds.length} .md files — using ${mds[0]}`);
      sources.push({ file: join(full, mds[0]), base: `jobs/${encodeURIComponent(name)}/`, label: `${name}/${mds[0]}` });
    } else if (/\.md$/i.test(name)) {
      sources.push({ file: full, base: "", label: name });
    }
  }
  return sources;
}

function build() {
  let sources;
  try {
    sources = collectSources();
  } catch (e) {
    console.error(`✗ Could not read /jobs at ${JOBS_DIR}: ${e.message}`);
    process.exit(1);
  }

  const jobs = sources
    .map((s, i) => {
      try { return parse(readFileSync(s.file, "utf8"), i, s.base); }
      catch (e) { console.warn(`  ! skipped ${s.label}: ${e.message}`); return null; }
    })
    .filter((j) => j && j.title)
    // newest first (roles with a date); undated roles keep folder order after
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const banner =
    "/* AUTO-GENERATED by build-jobs.mjs — do not edit by hand.\n" +
    "   Add or edit role folders in /jobs, then run:  node build-jobs.mjs */\n";
  writeFileSync(OUT, banner + "window.STEELTRACE_JOBS = " + JSON.stringify(jobs, null, 2) + ";\n");

  console.log(`✓ ${jobs.length} role${jobs.length === 1 ? "" : "s"} bundled → steeltrace/jobs.generated.js`);
  jobs.forEach((j) => console.log(`    · ${j.title}  (${j.team || "team"})`));
}

build();

if (process.argv.includes("--watch")) {
  console.log("… watching /jobs for changes (Ctrl-C to stop)");
  let t = null;
  watch(JOBS_DIR, { recursive: true }, () => { clearTimeout(t); t = setTimeout(build, 120); });
}
