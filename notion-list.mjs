#!/usr/bin/env node
/* Diagnostic: list every database this token can actually see.
 * Run:  NOTION_TOKEN='ntn_...' node notion-list.mjs
 */
import { Client } from "@notionhq/client";

const token = process.env.NOTION_TOKEN;
if (!token) { console.error("Set NOTION_TOKEN"); process.exit(1); }
const notion = new Client({ auth: token });

const res = await notion.search({
  filter: { property: "object", value: "database" },
  page_size: 100,
});

if (!res.results.length) {
  console.log("\n⚠ This token can see NO databases.");
  console.log("  → In the DATABASE, ••• → Connections must point to the SAME");
  console.log("    integration whose token you are using here.\n");
  process.exit(0);
}

console.log(`\nDatabases this token can see (${res.results.length}):\n`);
for (const db of res.results) {
  const title = (db.title || []).map((t) => t.plain_text).join("") || "(untitled)";
  console.log(`  ${db.id}   ${title}`);
}
console.log("\nUse the id next to your Blog Posts database as NOTION_DATABASE_ID.\n");
