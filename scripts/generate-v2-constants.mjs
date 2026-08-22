/** Regenerates src/api/v2/generated/constants.ts. Usage: pnpm codegen:v2 ../plane-ee/apps/api/plane/api_v2/core/schema/openapi */
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(scriptDir, "..");

const openapiDirArg = process.argv[2];
if (!openapiDirArg) {
  console.error("usage: node scripts/generate-v2-constants.mjs <path-to>/api_v2/core/schema/openapi");
  process.exit(1);
}
// Normalized once so every invocation of the same golden checkout produces a
// byte-identical header, regardless of how the path was typed.
const openapiDir = resolve(openapiDirArg);
const normalizedOpenapiDir = relative(repoRoot, openapiDir) || ".";

/** Reads and JSON-parses a golden file, failing loudly (with the file path) if it's missing or malformed. */
function readJson(path, label) {
  if (!existsSync(path)) {
    console.error(`golden shape drift: expected ${label} at ${path}, but the file does not exist`);
    process.exit(1);
  }
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    console.error(`golden shape drift: ${label} at ${path} is not valid JSON (${error.message})`);
    process.exit(1);
  }
}

/** Looks up a dotted key path, failing loudly with the exact missing segment. */
function requireKeyPath(root, rootLabel, keyPath) {
  let cursor = root;
  const segments = keyPath.split(".");
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (cursor == null || typeof cursor !== "object" || !(segment in cursor)) {
      const seen = segments.slice(0, i).join(".");
      console.error(
        `golden shape drift: ${rootLabel}${seen ? `.${seen}` : ""}.${segment} is missing (expected ${rootLabel}.${keyPath})`
      );
      process.exit(1);
    }
    cursor = cursor[segment];
  }
  return cursor;
}

const root = readJson(join(openapiDir, "root.json"), "root.json");
const openapiVersion = requireKeyPath(root, "root.json", "info.version");

const pathsDir = join(openapiDir, "paths");
if (!existsSync(pathsDir)) {
  console.error(`golden shape drift: expected a paths/ directory at ${pathsDir}, but it does not exist`);
  process.exit(1);
}

const shardFiles = readdirSync(pathsDir)
  .filter((name) => name.endsWith(".json"))
  .sort();
if (shardFiles.length === 0) {
  console.error(`golden shape drift: ${pathsDir} contains no *.json shards`);
  process.exit(1);
}

const paths = {};
for (const shard of shardFiles) {
  const document = readJson(join(pathsDir, shard), `paths/${shard}`);
  Object.assign(paths, document.paths ?? document);
}

const operationIds = new Set();
const fields = {};
const orderBy = {};
const expand = {};
const METHODS = new Set(["get", "post", "patch", "delete", "put"]);

for (const operations of Object.values(paths)) {
  for (const [method, operation] of Object.entries(operations)) {
    if (!METHODS.has(method) || !operation.operationId) continue;
    operationIds.add(operation.operationId);
    for (const parameter of operation.parameters ?? []) {
      const values = parameter.schema?.enum;
      if (!values) continue;
      if (parameter.name === "fields") fields[operation.operationId] = [...values].sort();
      if (parameter.name === "order_by") orderBy[operation.operationId] = [...values].sort();
      if (parameter.name === "expand") expand[operation.operationId] = [...values].sort();
    }
  }
}

if (operationIds.size === 0) {
  console.error("golden shape drift: extracted zero operationIds across all path shards — expected roughly 406");
  process.exit(1);
}

if (Object.keys(fields).length === 0) {
  console.error("golden shape drift: extracted zero `fields` enums across all path shards — expected roughly 316");
  process.exit(1);
}
if (Object.keys(orderBy).length === 0) {
  console.error("golden shape drift: extracted zero `order_by` enums across all path shards — expected roughly 67");
  process.exit(1);
}
if (Object.keys(expand).length === 0) {
  console.error("golden shape drift: extracted zero `expand` enums across all path shards — expected roughly 95");
  process.exit(1);
}

const components = readJson(join(openapiDir, "components.json"), "components.json");
const schemas = requireKeyPath(components, "components.json", "schemas");
const schemaCount = Object.keys(schemas).length;
const bulkMax = requireKeyPath(components, "components.json", "schemas.BulkDeleteRequest.properties.ids.maxItems");
if (typeof bulkMax !== "number") {
  console.error(
    `golden shape drift: components.json.schemas.BulkDeleteRequest.properties.ids.maxItems is ${JSON.stringify(bulkMax)}, expected a number`
  );
  process.exit(1);
}

for (const [convenienceName, operationId] of [
  ["STATE_FIELDS", "states_list"],
  ["LABEL_FIELDS", "labels_list"],
  ["WORK_ITEM_FIELDS", "work_items_list"],
  ["CYCLE_FIELDS", "cycles_list"],
  ["MODULE_FIELDS", "modules_list"],
  ["MILESTONE_FIELDS", "milestones_list"],
]) {
  if (!(operationId in fields)) {
    console.error(
      `golden shape drift: ${convenienceName} needs FIELDS["${operationId}"], but operation "${operationId}" carries no \`fields\` enum in the golden`
    );
    process.exit(1);
  }
}

for (const [convenienceName, operationId] of [
  ["STATE_ORDER_BY", "states_list"],
  ["LABEL_ORDER_BY", "labels_list"],
  ["WORK_ITEM_ORDER_BY", "work_items_list"],
  ["CYCLE_ORDER_BY", "cycles_list"],
  ["MODULE_ORDER_BY", "modules_list"],
  ["MILESTONE_ORDER_BY", "milestones_list"],
]) {
  if (!(operationId in orderBy)) {
    console.error(
      `golden shape drift: ${convenienceName} needs ORDER_BY["${operationId}"], but operation "${operationId}" carries no \`order_by\` enum in the golden`
    );
    process.exit(1);
  }
}

// `expand` is opt-in per operation (95 of ~316); WORK_ITEM_EXPAND gets the same
// named-convenience treatment as WORK_ITEM_FIELDS. Others stay reachable via EXPAND["operationId"].
for (const [convenienceName, operationId] of [["WORK_ITEM_EXPAND", "work_items_list"]]) {
  if (!(operationId in expand)) {
    console.error(
      `golden shape drift: ${convenienceName} needs EXPAND["${operationId}"], but operation "${operationId}" carries no \`expand\` enum in the golden`
    );
    process.exit(1);
  }
}

const tuple = (values) => `[${values.map((value) => JSON.stringify(value)).join(", ")}] as const`;
// A plain comparator, not String#localeCompare — the keys are ASCII snake_case operation
// ids, and localeCompare's ordering can vary across ICU builds. Determinism over locale-awareness.
const compareAscii = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const record = (entries) =>
  Object.entries(entries)
    .sort(([a], [b]) => compareAscii(a, b))
    .map(([key, values]) => `  ${JSON.stringify(key)}: ${tuple(values)},`)
    .join("\n");

const sourceGoldenLine = `// Source golden: ${normalizedOpenapiDir}`;
const versionHeaderLine = `// api_v2 OpenAPI version: ${openapiVersion}`;
const versionExportLine = `export const OPENAPI_VERSION = ${JSON.stringify(openapiVersion)};`;

const output = `// Generated from the api_v2 OpenAPI golden. Do not edit by hand.
${sourceGoldenLine}
${versionHeaderLine}
// Regenerate with: pnpm codegen:v2 <path-to>/api_v2/core/schema/openapi

${versionExportLine}

export const BULK_MAX_ITEMS = ${bulkMax};

export const OPERATION_IDS = ${tuple([...operationIds].sort(compareAscii))};

export type OperationId = (typeof OPERATION_IDS)[number];

export const FIELDS = {
${record(fields)}
} as const;

export const ORDER_BY = {
${record(orderBy)}
} as const;

export const EXPAND = {
${record(expand)}
} as const;

export const STATE_FIELDS = FIELDS["states_list"];
export const LABEL_FIELDS = FIELDS["labels_list"];
export const WORK_ITEM_FIELDS = FIELDS["work_items_list"];
export const CYCLE_FIELDS = FIELDS["cycles_list"];
export const MODULE_FIELDS = FIELDS["modules_list"];
export const MILESTONE_FIELDS = FIELDS["milestones_list"];

export type StateField = (typeof STATE_FIELDS)[number];
export type LabelField = (typeof LABEL_FIELDS)[number];
export type WorkItemField = (typeof WORK_ITEM_FIELDS)[number];
export type CycleField = (typeof CYCLE_FIELDS)[number];
export type ModuleField = (typeof MODULE_FIELDS)[number];
export type MilestoneField = (typeof MILESTONE_FIELDS)[number];

export const STATE_ORDER_BY = ORDER_BY["states_list"];
export const LABEL_ORDER_BY = ORDER_BY["labels_list"];
export const WORK_ITEM_ORDER_BY = ORDER_BY["work_items_list"];
export const CYCLE_ORDER_BY = ORDER_BY["cycles_list"];
export const MODULE_ORDER_BY = ORDER_BY["modules_list"];
export const MILESTONE_ORDER_BY = ORDER_BY["milestones_list"];

export type StateOrderBy = (typeof STATE_ORDER_BY)[number];
export type LabelOrderBy = (typeof LABEL_ORDER_BY)[number];
export type WorkItemOrderBy = (typeof WORK_ITEM_ORDER_BY)[number];
export type CycleOrderBy = (typeof CYCLE_ORDER_BY)[number];
export type ModuleOrderBy = (typeof MODULE_ORDER_BY)[number];
export type MilestoneOrderBy = (typeof MILESTONE_ORDER_BY)[number];

export const WORK_ITEM_EXPAND = EXPAND["work_items_list"];

export type WorkItemExpand = (typeof WORK_ITEM_EXPAND)[number];
`;

const target = join(repoRoot, "src", "api", "v2", "generated");
mkdirSync(target, { recursive: true });
const targetFile = join(target, "constants.ts");
writeFileSync(targetFile, output);

// Format the file ourselves so the documented single command reproduces the
// committed file exactly — no separate "now run the formatter" step to forget.
const oxfmtBin = join(repoRoot, "node_modules", ".bin", "oxfmt");
execFileSync(oxfmtBin, [targetFile], { cwd: repoRoot, stdio: "inherit" });

// Confirm formatting didn't mangle or drop the header/export naming which golden
// version this file describes.
const written = readFileSync(targetFile, "utf8");
for (const [label, line] of [
  ["source golden header", sourceGoldenLine],
  ["version header", versionHeaderLine],
  ["OPENAPI_VERSION export", versionExportLine],
]) {
  if (!written.includes(line)) {
    console.error(`golden shape drift: generated ${targetFile} is missing its ${label} ("${line}")`);
    process.exit(1);
  }
}

console.log(
  `wrote ${operationIds.size} operation ids, ${Object.keys(fields).length} field enums, ` +
    `${Object.keys(orderBy).length} order_by enums, and ${Object.keys(expand).length} expand enums ` +
    `(from ${schemaCount} schemas, ${shardFiles.length} path shards, api_v2 ${openapiVersion}) to ${targetFile}`
);
