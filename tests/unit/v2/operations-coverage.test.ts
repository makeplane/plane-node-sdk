import * as fs from "node:fs";
import * as path from "node:path";
import { Configuration } from "../../../src/Configuration";
import { AnyOperationId, V2Resource } from "../../../src/api/v2/kernel/resource";
import { V2Transport } from "../../../src/api/v2/kernel/transport";
import { OPERATION_IDS } from "../../../src/api/v2/generated/constants";

/**
 * Coverage net: every operationId under `src/api/v2/**` must be declared in some resource's `operations` map.
 */

const V2_ROOT = path.join(__dirname, "../../../src/api/v2");

// The top-level `src/api/v2/index.ts` barrel only re-exports classes defined
// elsewhere, so including it would just rediscover the same classes again.
const EXCLUDED_FILES = new Set([path.join(V2_ROOT, "index.ts")]);

function walk(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "kernel" || entry.name === "generated") continue;
      files.push(...walk(full));
    } else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts") && !entry.name.endsWith(".d.ts")) {
      files.push(full);
    }
  }
  return files;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type V2ResourceClass = new (transport: V2Transport) => V2Resource<any, any, any>;

function discoverResourceClasses(): Map<string, V2ResourceClass> {
  const files = walk(V2_ROOT).filter((f) => !EXCLUDED_FILES.has(f));
  const found = new Map<string, V2ResourceClass>();

  for (const file of files) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod: Record<string, unknown> = require(file);
    for (const [exportName, value] of Object.entries(mod)) {
      if (typeof value !== "function") continue;
      if (!(value.prototype instanceof V2Resource) && value !== V2Resource) continue;
      if (value === V2Resource) continue;
      const className = (value as { name: string }).name;
      // The same class can be re-exported from more than one module (e.g. a parent
      // resource file re-exporting its own sub-resource's class for convenience) —
      // dedupe by the class object itself, not by file, so it is only instantiated once.
      if (![...found.values()].includes(value as V2ResourceClass)) {
        found.set(`${className} (${path.relative(V2_ROOT, file)}::${exportName})`, value as V2ResourceClass);
      }
    }
  }
  return found;
}

const transport = new V2Transport(new Configuration({ baseUrl: "https://api.example.com", apiKey: "secret" }));

describe("api_v2 operations coverage", () => {
  const classes = discoverResourceClasses();

  it("discovers a healthy number of V2Resource subclasses (guards against a broken glob matching nothing)", () => {
    expect(classes.size).toBeGreaterThanOrEqual(70);
  });

  it("declares every implemented operationId exactly once, across the whole v2 surface", () => {
    const goldenIds = new Set<string>(OPERATION_IDS);
    const declaredBy = new Map<string, string[]>();
    const notInGolden: { owner: string; id: string }[] = [];

    for (const [owner, Cls] of classes.entries()) {
      const instance = new Cls(transport);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const operations = (instance as any).operations as Record<string, AnyOperationId> | undefined;
      if (!operations) continue;

      for (const id of Object.values(operations)) {
        if (!goldenIds.has(id)) {
          notInGolden.push({ owner, id });
          continue;
        }
        const owners = declaredBy.get(id) ?? [];
        owners.push(owner);
        declaredBy.set(id, owners);
      }
    }

    // (a) every declared value is a real golden operationId.
    if (notInGolden.length > 0) {
      const detail = notInGolden.map((x) => `  ${x.id} — declared by ${x.owner}`).join("\n");
      throw new Error(`Declared operationId(s) not present in OPERATION_IDS:\n${detail}`);
    }

    // (c) no operationId is declared by two different classes.
    const duplicates = [...declaredBy.entries()].filter(([, owners]) => new Set(owners).size > 1);
    if (duplicates.length > 0) {
      const detail = duplicates
        .map(([id, owners]) => `  ${id} — declared by: ${[...new Set(owners)].join(", ")}`)
        .join("\n");
      throw new Error(`operationId(s) declared by more than one class:\n${detail}`);
    }

    // (b) the union of all declared values equals the full OPERATION_IDS set.
    const declaredIds = new Set(declaredBy.keys());
    const missing = OPERATION_IDS.filter((id) => !declaredIds.has(id));
    const extra = [...declaredIds].filter((id) => !goldenIds.has(id));

    if (missing.length > 0 || extra.length > 0) {
      const lines: string[] = [];
      if (missing.length > 0) {
        lines.push(`Missing (implemented operations with no 'operations' entry anywhere) — ${missing.length}:`);
        lines.push(...missing.map((id) => `  ${id}`));
      }
      if (extra.length > 0) {
        lines.push(`Extra (declared but not in OPERATION_IDS) — ${extra.length}:`);
        lines.push(...extra.map((id) => `  ${id}`));
      }
      throw new Error(lines.join("\n"));
    }

    expect(missing).toEqual([]);
    expect(extra).toEqual([]);
  });
});
