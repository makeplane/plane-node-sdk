import * as fs from "node:fs";
import * as path from "node:path";
import { Configuration } from "../../../src/Configuration";
import { AnyOperationId, V2Resource } from "../../../src/api/v2/kernel/resource";
import { V2Transport } from "../../../src/api/v2/kernel/transport";
import { OPERATION_IDS } from "../../../src/api/v2/generated/constants";
import { instantiate, migratedEntries, operationActionFor, operationsOf, publicMethods } from "./tree-walk";

/**
 * Coverage net, in two directions.
 *
 * **golden -> declared**: every operationId under `src/api/v2/**` must be declared in some
 * resource's `operations` map, exactly once.
 *
 * **method -> declared**: every public method of a migrated resource must resolve to a key
 * in its own class's `operations` map. This is the direction that was missing, and its
 * absence quietly exempted methods from the two option sweeps: `methodsOffering` in
 * `tree-walk.ts` looks the method's action up in `operations` and `continue`s when it finds
 * nothing, so a method with no entry is checked for neither `fields` nor `expand` and
 * nothing anywhere says so. The first direction cannot see it either — it only asks whether
 * each golden id is declared *somewhere*, never whether a given method name has a key.
 *
 * The gap is worst exactly where the migration is least regular. A CRUD five-pack is spelt
 * the same way in every class, so its keys are hard to forget; the odd-shaped methods —
 * `retrieveByIdentifier`, `summary`, `roleDistribution`, the membership bridges — are
 * one-offs whose key has to be written by hand, and those are the ones that would have
 * escaped both sweeps.
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

/**
 * Golden operations the SDK does not implement yet, each with why and where it lands.
 *
 * **This list may only shrink** — the assertions below enforce that from both ends: an
 * entry naming an operation that *is* implemented fails as stale, an entry naming an
 * operation the golden does not have fails as bogus, and the size is ratcheted so nothing
 * can quietly join. Like `UNMIGRATED_RESOURCES`, it exists so that "not built yet" is
 * something somebody wrote down rather than something the suite failed to notice.
 *
 * - `workspaces_retrieve` — `GET /workspaces/{slug}/`. It appeared when the golden was
 *   refreshed from the stale 406-operation copy to `origin/preview`'s 407, which is the
 *   whole reason the refresh mattered. Implementing it means introducing a `Workspaces`
 *   resource and the `v2.workspaces` attachment point, and the variant-F plan schedules
 *   that root for the tree-wiring task (see `Workspace.ts`'s own doc comment) — inventing
 *   its shape here would pre-empt that design, so it is recorded instead of guessed at.
 *   Note that when it lands it must be navigable: it is precisely the resource whose
 *   Python twin answered a bare row with 24 unreachable children.
 */
export const UNIMPLEMENTED_OPERATIONS: Readonly<Record<string, string>> = {
  workspaces_retrieve: "needs the `v2.workspaces` root, which the variant-F plan schedules for the tree-wiring task",
};

/** How large {@link UNIMPLEMENTED_OPERATIONS} is allowed to be. A ratchet: lower it, never raise it. */
export const UNIMPLEMENTED_CEILING = 1;

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

    // (b) the union of all declared values equals the full OPERATION_IDS set, bar the
    // operations explicitly recorded as not built yet.
    const declaredIds = new Set(declaredBy.keys());
    const missing = OPERATION_IDS.filter((id) => !declaredIds.has(id) && !(id in UNIMPLEMENTED_OPERATIONS));
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

  it("keeps every operation recorded as unimplemented real, still unimplemented, and shrinking", () => {
    const goldenIds = new Set<string>(OPERATION_IDS);
    const declared = new Set<string>();
    for (const Cls of classes.values()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const operations = (new Cls(transport) as any).operations as Record<string, AnyOperationId> | undefined;
      for (const id of Object.values(operations ?? {})) declared.add(id);
    }

    const named = Object.keys(UNIMPLEMENTED_OPERATIONS).sort();

    expect({
      // An entry the golden has never heard of describes nothing.
      notInGolden: named.filter((id) => !goldenIds.has(id)),
      // An entry for an operation that *is* implemented reads as a gap that was never closed.
      actuallyImplemented: named.filter((id) => declared.has(id)),
    }).toEqual({ notInGolden: [], actuallyImplemented: [] });

    // The ratchet. Lower `UNIMPLEMENTED_CEILING` as these are built; never raise it.
    expect(named.length).toBeLessThanOrEqual(UNIMPLEMENTED_CEILING);
  });

  it("gives every public method of a migrated resource an `operations` key of its own", () => {
    // A floor first: if the enumeration breaks, the assertion below passes by checking
    // nothing — the same failure mode the sweep exists to prevent.
    const swept = migratedEntries();
    expect(swept.length).toBeGreaterThanOrEqual(30);

    const orphans: string[] = [];
    for (const entry of swept) {
      const operations = operationsOf(instantiate(entry));
      for (const method of publicMethods(entry)) {
        const action = operationActionFor(method.name);
        if (operations[action] === undefined) {
          orphans.push(
            `${entry.key}.${method.name}() has no \`operations\` entry (looked for "${action}"), so it is ` +
              `silently exempt from the \`fields\` and \`expand\` sweeps`
          );
        }
      }
    }

    expect(orphans.sort()).toEqual([]);
  });
});
