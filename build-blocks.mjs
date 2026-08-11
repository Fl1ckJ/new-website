#!/usr/bin/env node
/* SteelTrace shared blocks build — pure Node, zero dependencies.
 *
 * Several sections were copy-pasted across pages and had already drifted apart.
 * Each one now lives once, as a plain .html file in blocks/, and this script
 * writes it into the pages between markers:
 *
 *   <!-- st:block get-started kicker -->
 *     …generated markup — do not hand-edit, it is overwritten…
 *   <!-- /st:block -->
 *
 * Because expansion happens at build time the .html pages stay complete and
 * directly servable: the nginx config is untouched and the copy stays visible
 * to crawlers. Rerunning is idempotent.
 *
 *   Rebuild:   node build-blocks.mjs           (npm run build:blocks)
 *   Verify:    node build-blocks.mjs --check    → exit 1 if a page is stale
 *   Watch:     node build-blocks.mjs --watch
 *
 * ---------------------------------------------------------------------------
 * Writing a block: blocks/<name>.html is ordinary HTML plus three directives.
 *
 *   {{name}}                     — substitute a value passed by the caller
 *   {{#flag}} … {{/flag}}        — keep only when the caller passed the flag
 *   {{^flag}} … {{/flag}}        — keep only when it did not
 *   <!-- st:include other k="v" -->   — call another block (nestable)
 *
 * A {{#flag}} / {{/flag}} tag sitting alone on a line takes the whole line with
 * it, so the surrounding markup keeps its indentation either way. An included
 * block is re-indented to match the line its call sits on; called inline (mid
 * line) it is inserted as is.
 *
 * That is the whole language — no expressions, no loops. Repeat a call to
 * repeat an element (see how blocks/get-started.html calls blocks/pillar.html
 * three times).
 * ---------------------------------------------------------------------------
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, watch } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = dirname(fileURLToPath(import.meta.url));
const BLOCKS = join(ROOT, "blocks");

/* ---------- directives ---------- */

/* Page-level: an open/close pair wrapping the generated markup. */
const BLOCK =
  /([ \t]*)<!--[ \t]*st:block[ \t]+([\w/.-]+)([^>]*?)-->[\s\S]*?<!--[ \t]*\/st:block[ \t]*-->/g;

/* Inside a block file: a bare call, optionally spanning several lines. */
const INCLUDE = /(^[ \t]*)?<!--[ \t]*st:include[ \t]+([\w/.-]+)([\s\S]*?)-->/gm;

const SECTION = /\{\{([#^])([\w-]+)\}\}([\s\S]*?)\{\{\/\2\}\}/g;
const VAR = /\{\{([\w-]+)\}\}/g;
/* A lone {{#x}} / {{^x}} / {{/x}} on its own line: drop the line, keep the tag. */
const LONE_TAG = /^[ \t]*(\{\{[#^/][\w-]+\}\})[ \t]*\r?\n/gm;

const PROP = /([\w-]+)[ \t]*=[ \t]*"([^"]*)"|([\w-]+)[ \t]*=[ \t]*(\S+)|([\w-]+)/g;

function parseProps(raw) {
  const out = {};
  if (!raw) return out;
  for (const m of raw.matchAll(PROP)) {
    if (m[1] !== undefined) out[m[1]] = m[2];
    else if (m[3] !== undefined) out[m[3]] = m[4];
    else out[m[5]] = "yes";
  }
  return out;
}

const truthy = (v) =>
  v !== undefined && v !== "" && v !== "no" && v !== "false" && v !== "0";

function reindent(text, pad) {
  if (!pad) return text;
  return text
    .split("\n")
    .map((l, i) => (i === 0 || !l.trim() ? l : pad + l))
    .join("\n");
}

/* Render blocks/<name>.html with `props`. `trail` is the include chain, used
   for cycle detection and for readable error messages. */
function render(name, props, trail, errors) {
  if (trail.includes(name)) {
    errors.push(`circular include: ${[...trail, name].join(" -> ")}`);
    return "";
  }
  const path = join(BLOCKS, name + ".html");
  if (!existsSync(path)) {
    errors.push(`no such block: blocks/${name}.html` +
      (trail.length ? ` (included from ${trail[trail.length - 1]})` : ""));
    return "";
  }

  let src = readFileSync(path, "utf8").replace(/\r?\n$/, "");

  // conditionals, innermost-last so nesting still resolves
  src = src.replace(LONE_TAG, "$1");
  let pass = 0;
  while (SECTION.test(src) && pass++ < 10) {
    SECTION.lastIndex = 0;
    src = src.replace(SECTION, (_all, kind, flag, body) => {
      const on = truthy(props[flag]);
      return (kind === "#") === on ? body : "";
    });
  }

  // values
  src = src.replace(VAR, (all, key) =>
    props[key] !== undefined ? props[key] : all
  );

  // nested calls
  src = src.replace(INCLUDE, (_all, pad, child, rawProps) => {
    const body = render(child, parseProps(rawProps), [...trail, name], errors);
    // Called inline, insert as is; called on its own line, the regex ate that
    // line's indentation, so put it back on every line including the first.
    return pad === undefined ? body : reindent(pad + body, pad);
  });

  return src;
}

/* ---------- pages ---------- */

function expand(src, file, errors) {
  let count = 0;
  const out = src.replace(BLOCK, (_all, pad, name, rawProps) => {
    count++;
    const props = parseProps(rawProps);
    const body = render(name, props, [], errors).replace(/\r?\n$/, "");
    const open = `${pad}<!-- st:block ${name}${
      rawProps.trim() ? " " + rawProps.trim() : ""
    } -->`;
    return `${open}\n${reindent(pad + body, pad)}\n${pad}<!-- /st:block -->`;
  });
  if (errors.length) errors.forEach((e, i) => (errors[i] = `${file}: ${e}`));
  return { out, count };
}

function run({ check }) {
  const stale = [];
  const allErrors = [];
  let expanded = 0;
  let changed = 0;

  for (const file of readdirSync(ROOT).filter((f) => f.endsWith(".html"))) {
    const path = join(ROOT, file);
    const src = readFileSync(path, "utf8");
    if (!src.includes("st:block")) continue;
    const errors = [];
    const { out, count } = expand(src, file, errors);
    allErrors.push(...errors);
    expanded += count;

    if (out === src) {
      console.log(`  ok      ${file} — ${count} block(s)`);
    } else if (check) {
      stale.push(file);
      console.log(`  STALE   ${file} — differs from blocks/`);
    } else {
      writeFileSync(path, out);
      changed++;
      console.log(`  wrote   ${file} — ${count} block(s)`);
    }
  }

  for (const e of allErrors) console.error(`  ERROR   ${e}`);

  if (check && stale.length) {
    console.error(
      `\n${stale.length} page(s) out of date: ${stale.join(", ")}\n` +
        `Run: node build-blocks.mjs`
    );
    process.exit(1);
  }
  if (allErrors.length) process.exit(1);
  console.log(
    check
      ? `\nAll pages up to date — ${expanded} block(s) checked.`
      : `\n${expanded} block(s) expanded, ${changed} file(s) updated.`
  );
}

const args = process.argv.slice(2);
if (args.includes("--watch")) {
  run({ check: false });
  console.log("\nwatching blocks/ …");
  let timer = null;
  watch(BLOCKS, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => run({ check: false }), 80);
  });
} else {
  run({ check: args.includes("--check") });
}
