#!/usr/bin/env node
/* Regenerate sitemap.xml from the static pages + the blog posts in
 * steeltrace/posts.generated.js. Run after build-blog.mjs / sync-notion.mjs:
 *   node build-seo.mjs
 * (build-blog.mjs and sync-notion.mjs call this automatically.)
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = dirname(fileURLToPath(import.meta.url));
const BASE = "https://steeltrace.ai";

// Static pages -> priority. (Fragments/utility pages are intentionally excluded.)
const PAGES = [
  ["SteelTrace Home.html", "1.0", "weekly"],
  ["Product.html", "0.9", "monthly"],
  ["How It Works.html", "0.8", "monthly"],
  ["blog.html", "0.9", "daily"],
  ["about.html", "0.7", "monthly"],
  ["careers.html", "0.7", "weekly"],
  ["contact.html", "0.7", "monthly"],
  ["demo.html", "0.8", "monthly"],
  ["solution.html", "0.8", "monthly"],
  ["Trust.html", "0.6", "monthly"],
  ["privacy-policy.html", "0.3", "yearly"],
  ["disclaimer.html", "0.3", "yearly"],
  ...["op","epc","wld","mfg","ndt","exec","qaqc","pm","ops","dig"].map((k) => ["solution-" + k + ".html", "0.6", "monthly"]),
  ...["rigid","reeled","flex","fittings","onshore","bundle"].map((k) => ["product-" + k + ".html", "0.6", "monthly"]),
];

function loc(fn) {
  return fn === "SteelTrace Home.html" ? BASE + "/" : BASE + "/" + fn.replace(/ /g, "%20");
}
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

function readPosts() {
  const f = join(ROOT, "steeltrace", "posts.generated.js");
  if (!existsSync(f)) return [];
  const g = readFileSync(f, "utf8");
  try { return JSON.parse(g.slice(g.indexOf("["), g.lastIndexOf("]") + 1)); }
  catch { return []; }
}

const rows = [];
for (const [fn, prio, freq] of PAGES) {
  if (!existsSync(join(ROOT, fn))) continue;
  rows.push(`  <url>\n    <loc>${esc(loc(fn))}</loc>\n    <changefreq>${freq}</changefreq>\n    <priority>${prio}</priority>\n  </url>`);
}
const posts = readPosts();
for (const p of posts) {
  if (!p.slug) continue;
  const lm = /^\d{4}-\d{2}-\d{2}/.test(p.date || "") ? `\n    <lastmod>${p.date.slice(0, 10)}</lastmod>` : "";
  rows.push(`  <url>\n    <loc>${esc(BASE + "/post.html?slug=" + p.slug)}</loc>${lm}\n    <changefreq>yearly</changefreq>\n    <priority>0.6</priority>\n  </url>`);
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join("\n")}\n</urlset>\n`;
writeFileSync(join(ROOT, "sitemap.xml"), xml);
console.log(`✓ sitemap.xml — ${rows.length} URLs (${posts.length} blog posts)`);
