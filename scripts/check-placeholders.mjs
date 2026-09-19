#!/usr/bin/env node
/**
 * Placeholder-token guard.
 *
 * Scans src/**\/*.{ts,tsx} for legal/operator placeholder tokens such as
 * {{OPERATOR_NAME}}, {{GOVERNING_LAW}}, {{FOUNDER_PHOTO}} that would otherwise be
 * rendered as user-visible copy. Tokens that appear ONLY inside comments are ignored.
 *
 * Mode: WARN by default (always exits 0). Set STRICT_PLACEHOLDERS=1 (or pass --strict)
 * to exit 1 when any token is found. Flip prebuild to strict once real values are filled in.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../src", import.meta.url));
const TOKEN = /\{\{(?:OPERATOR_|GOVERNING_|FOUNDER_)[A-Z0-9_]*\}\}/g;
const strict = process.argv.includes("--strict") || process.env.STRICT_PLACEHOLDERS === "1";

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) yield* walk(p);
    else if (/\.(ts|tsx)$/.test(name)) yield p;
  }
}

/** Blank out // line comments, /* block comments *\/ and JSX {/* comments *\/}, keeping line structure. */
function stripComments(src) {
  let out = "";
  let i = 0;
  let quote = null; // ', ", or `
  while (i < src.length) {
    const c = src[i];
    const n = src[i + 1];
    if (quote) {
      out += c;
      if (c === "\\") {
        out += n ?? "";
        i += 2;
        continue;
      }
      if (c === quote) quote = null;
      i++;
      continue;
    }
    if (c === "/" && n === "/") {
      while (i < src.length && src[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && n === "*") {
      const end = src.indexOf("*/", i + 2);
      const stop = end === -1 ? src.length : end + 2;
      out += src.slice(i, stop).replace(/[^\n]/g, " ");
      i = stop;
      continue;
    }
    if (c === "'" || c === '"' || c === "`") quote = c;
    out += c;
    i++;
  }
  return out;
}

const hits = [];
for (const file of walk(ROOT)) {
  const src = readFileSync(file, "utf8");
  if (!src.includes("{{")) continue;
  const code = stripComments(src);
  const lines = code.split("\n");
  lines.forEach((line, idx) => {
    for (const m of line.matchAll(TOKEN)) {
      hits.push({ file: relative(join(ROOT, ".."), file).replaceAll("\\", "/"), line: idx + 1, token: m[0] });
    }
  });
}

if (hits.length === 0) {
  console.log("check-placeholders: OK - no {{OPERATOR_}}/{{GOVERNING_}}/{{FOUNDER_}} tokens in src.");
  process.exit(0);
}

const tag = strict ? "ERROR" : "WARN";
console.warn(`check-placeholders: ${tag} - ${hits.length} placeholder token(s) found in rendered code:`);
for (const h of hits) console.warn(`  ${h.file}:${h.line}  ${h.token}`);
if (strict) process.exit(1);
console.warn("check-placeholders: warn-only mode (set STRICT_PLACEHOLDERS=1 to make this blocking).");
process.exit(0);
