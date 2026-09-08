/** Guards against a v2/v1 type-name collision swapping which shape a public export resolves to. Usage: node scripts/check-types-bundle.mjs [--write] */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(scriptDir, "..");
const bundlePath = join(repoRoot, "dist/types.bundle.d.ts");
const snapshotPath = join(scriptDir, "__fixtures__/types-bundle-exports.snapshot.txt");

/** A single `export { local as external, ... }` (or bare `export { name, ... }`) block's content. */
function parseExportBlockContent(content) {
  return content
    .split(",")
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter((item) => item.length > 0)
    .map((item) => {
      const asMatch = /^(\S+)\s+as\s+(\S+)$/.exec(item);
      if (asMatch) return { local: asMatch[1], external: asMatch[2] };
      return { local: item, external: item };
    });
}

/** Splits the bundle into `{ scope, text }` regions per top-level `declare namespace` block, plus a "root" region. */
function splitIntoScopes(source) {
  const namespaceRe = /^declare namespace (\w+) \{\n([\s\S]*?)\n\}\n/gm;
  const regions = [];
  let cursor = 0;
  let match;
  while ((match = namespaceRe.exec(source))) {
    if (match.index > cursor) regions.push({ scope: "root", text: source.slice(cursor, match.index) });
    regions.push({ scope: match[1], text: match[2] });
    cursor = match.index + match[0].length;
  }
  if (cursor < source.length) regions.push({ scope: "root", text: source.slice(cursor) });
  return regions;
}

/** Splits root-scope text into top-level chunks: a non-indented line starts a new chunk (dts-bundle-generator indents continuations). */
function splitIntoTopLevelChunks(text) {
  const chunks = [];
  let current = null;
  for (const line of text.split("\n")) {
    const isTopLevel = line.length > 0 && !/^\s/.test(line);
    if (isTopLevel) {
      if (current) chunks.push(current);
      current = [line];
    } else if (current) {
      current.push(line);
    }
  }
  if (current) chunks.push(current);
  return chunks.map((lines) => lines.join("\n"));
}

const DECLARATION_START_RE =
  /^(?:export )?(?:declare )?(?:abstract )?(interface|type|class|function|const|enum) ([A-Za-z0-9_$]+)/;

/** Strips comments and collapses whitespace so the hash reflects shape, not formatting or doc comments. */
function normalizeBody(text) {
  const withoutComments = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "$1");
  return withoutComments
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 0)
    .join("\n");
}

function hashBody(text) {
  return createHash("sha256").update(normalizeBody(text)).digest("hex").slice(0, 16);
}

/** local declaration name -> normalized-body hash, built once from the root scope's text. */
function buildDeclarationHashes(rootText) {
  const hashes = new Map();
  for (const chunk of splitIntoTopLevelChunks(rootText)) {
    const firstLine = chunk.split("\n")[0];
    const match = DECLARATION_START_RE.exec(firstLine);
    if (!match) continue; // comment chunks, the trailing `export {}` block, `export {};`, blank chunks
    const name = match[2];
    hashes.set(name, hashBody(chunk));
  }
  return hashes;
}

/** The full public export surface: one `{ scope, external, local, hash }` entry per exported name, deduped and sorted. */
function extractExportSurface(source) {
  const regions = splitIntoScopes(source);
  const rootText = regions
    .filter((r) => r.scope === "root")
    .map((r) => r.text)
    .join("\n");
  const declarationHashes = buildDeclarationHashes(rootText);
  const namespaceNames = new Set(regions.map((r) => r.scope).filter((s) => s !== "root"));

  const entries = [];
  const exportBlockRe = /export\s*\{([^}]*)\}/g;
  const directExportRe =
    /^export (?:declare )?(?:abstract )?(?:interface|type|class|function|const|enum) ([A-Za-z0-9_$]+)/;

  for (const { scope, text } of regions) {
    let match;
    exportBlockRe.lastIndex = 0;
    while ((match = exportBlockRe.exec(text))) {
      for (const { local, external } of parseExportBlockContent(match[1])) {
        entries.push({ scope, external, local });
      }
    }
    if (scope === "root") {
      for (const line of text.split("\n")) {
        const directMatch = directExportRe.exec(line);
        if (directMatch) entries.push({ scope, external: directMatch[1], local: directMatch[1] });
      }
    }
  }

  const seen = new Set();
  const deduped = [];
  for (const entry of entries) {
    const key = `${entry.scope}\t${entry.external}\t${entry.local}`;
    if (seen.has(key)) continue;
    seen.add(key);
    // Bare namespace re-exports have no declaration body of their own to hash;
    // everything else must resolve to a real declaration.
    const hash = namespaceNames.has(entry.local) ? "namespace" : (declarationHashes.get(entry.local) ?? "UNRESOLVED");
    deduped.push({ ...entry, hash });
  }

  deduped.sort((a, b) => `${a.scope}\t${a.external}`.localeCompare(`${b.scope}\t${b.external}`));
  return deduped;
}

function formatSurface(entries) {
  return entries.map((entry) => `${entry.scope}\t${entry.external}\t${entry.local}\t${entry.hash}`).join("\n") + "\n";
}

if (!existsSync(bundlePath)) {
  console.error(`check-types-bundle: expected ${bundlePath} to exist. Run \`pnpm run build:types-bundle\` first.`);
  process.exit(1);
}

const bundleSource = readFileSync(bundlePath, "utf8");
const surface = extractExportSurface(bundleSource);
const formatted = formatSurface(surface);

if (process.argv.includes("--write")) {
  writeFileSync(snapshotPath, formatted);
  console.log(`check-types-bundle: wrote ${surface.length} export entries to ${snapshotPath}.`);
  process.exit(0);
}

if (!existsSync(snapshotPath)) {
  console.error(`check-types-bundle: no snapshot at ${snapshotPath}. Run with --write to create one.`);
  process.exit(1);
}

const expectedLines = readFileSync(snapshotPath, "utf8")
  .split("\n")
  .filter((l) => l.length > 0);
const actualLines = formatted.split("\n").filter((l) => l.length > 0);

const parseLine = (line) => {
  const [scope, external, local, hash] = line.split("\t");
  return { scope, external, local, hash };
};
const keyOf = (e) => `${e.scope}\t${e.external}`;

/**
 * Group by `scope\texternal` into a *list* of backing declarations, not a single one.
 *
 * This used to be `new Map(entries.map((e) => [keyOf(e), e]))`, which keeps only the last
 * entry per key — so where the same external name was backed by two different locals, the
 * guard silently discarded one of them. That is exactly the defect it exists to catch: the
 * shipped `dist/types.bundle.d.ts` carried fourteen names exported twice
 * (`error TS2484`), and both the old and the new snapshot contained the same fourteen
 * duplicate keys, invisible on both sides of every comparison because the duplicate half
 * was dropped before anything was compared.
 */
const groupByKey = (lines) => {
  const grouped = new Map();
  for (const entry of lines.map(parseLine)) {
    const key = keyOf(entry);
    const existing = grouped.get(key);
    if (existing) existing.push(entry);
    else grouped.set(key, [entry]);
  }
  // Deterministic order, so a reordering in the bundle is not read as a change.
  for (const entries of grouped.values())
    entries.sort((a, b) => `${a.local}@${a.hash}`.localeCompare(`${b.local}@${b.hash}`));
  return grouped;
};

const describeGroup = (entries) => entries.map((e) => `${e.local}@${e.hash}`).join(" + ");

const expectedByKey = groupByKey(expectedLines);
const actualByKey = groupByKey(actualLines);

const removed = [];
const added = [];
const changed = [];
for (const [key, before] of expectedByKey) {
  const after = actualByKey.get(key);
  if (!after) {
    removed.push(before[0]);
  } else if (describeGroup(after) !== describeGroup(before)) {
    changed.push({
      before: { ...before[0], local: describeGroup(before), hash: "" },
      after: { ...after[0], local: describeGroup(after), hash: "" },
    });
  }
}
for (const [key, after] of actualByKey) {
  if (!expectedByKey.has(key)) added.push(after[0]);
}

// A name exported twice from one scope is `error TS2484` in the emitted bundle, whether or
// not the snapshot agrees with itself about it. Reported separately from the diff above,
// because a snapshot regenerated while the duplicates existed would otherwise bless them.
const duplicated = [...actualByKey.entries()].filter(([, entries]) => entries.length > 1);
if (duplicated.length > 0) {
  console.error(
    `check-types-bundle: ${duplicated.length} export name(s) in dist/types.bundle.d.ts are backed by more than ` +
      "one declaration. TypeScript reports each as `error TS2484: Export declaration conflicts with exported " +
      "declaration of '<name>'`, and a consumer's import resolves to whichever one the bundler happened to " +
      "give the bare identifier to.\n" +
      "Fix it in src/index.ts by exporting each side explicitly — the v2 type under a `V2`-prefixed alias and " +
      "the v1 type under its bare name — following the pattern already there.\n" +
      duplicated.map(([key, entries]) => `  ! ${key}\t${describeGroup(entries)}`).join("\n")
  );
  process.exit(1);
}

if (removed.length > 0 || added.length > 0 || changed.length > 0) {
  console.error(
    `check-types-bundle: dist/types.bundle.d.ts's public export surface no longer matches ${snapshotPath}.`
  );
  console.error(
    "This usually means a new v2 type collides with a v1 type's bare name -- a public export name now " +
      "resolves through a different (or differently-shaped) local declaration than before, or vice versa."
  );
  if (changed.length > 0) {
    console.error("\nExport names whose backing declaration changed shape or identity:");
    for (const { before, after } of changed) {
      console.error(`  ~ ${keyOf(before)}\t${before.local}@${before.hash} -> ${after.local}@${after.hash}`);
    }
  }
  if (removed.length > 0) {
    console.error("\nEntries the snapshot expected but the bundle no longer has:");
    console.error(removed.map((e) => `  - ${keyOf(e)}\t${e.local}@${e.hash}`).join("\n"));
  }
  if (added.length > 0) {
    console.error("\nEntries the bundle now has that the snapshot didn't expect:");
    console.error(added.map((e) => `  + ${keyOf(e)}\t${e.local}@${e.hash}`).join("\n"));
  }
  console.error(
    "\nIf this change is intentional (a deliberate new export, or a deliberate alias for a new v2 type per " +
      "the pattern in src/index.ts), review the diff above and regenerate with:\n" +
      "  node scripts/check-types-bundle.mjs --write"
  );
  process.exit(1);
}

// The emitted bundle must be valid TypeScript on its own terms. `pnpm build` runs
// `dts-bundle-generator --no-check` and `tsconfig.json` sets `skipLibCheck: true`, so
// nothing in the build ever type-checked the artifact it ships — which is how fourteen
// TS2484 conflicts survived in it, in a file `plane-ee`'s web app deep-imports and feeds
// to an in-app editor.
const typeCheck = spawnSync(
  process.execPath,
  [
    join(repoRoot, "node_modules", "typescript", "lib", "tsc.js"),
    "--noEmit",
    "--skipLibCheck",
    "false",
    "--target",
    "ES2020",
    "--moduleResolution",
    "node",
    bundlePath,
  ],
  { encoding: "utf8" }
);
if (typeCheck.status !== 0) {
  console.error("check-types-bundle: dist/types.bundle.d.ts is not valid TypeScript.");
  console.error(`${typeCheck.stdout ?? ""}${typeCheck.stderr ?? ""}`.trim());
  process.exit(1);
}

console.log(
  `check-types-bundle: dist/types.bundle.d.ts's public export surface matches the snapshot (${surface.length} ` +
    "entries), and the bundle type-checks."
);
