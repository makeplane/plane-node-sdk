/**
 * A name the SDK says out loud must be a name the reader can import.
 *
 * Eleven v2 resource classes keep an unqualified file-local name and are exported from the
 * barrel under a qualified one — `Comments as WorkItemComments`, `Assets as
 * WorkspaceAssets`, `Changelog as ReleaseChangelogResource` — deliberately, because the
 * unqualified spelling says nothing about which resource it belongs to and two of those
 * spellings are claimed twice over. The cost of that decision is that `constructor.name`
 * and the public name diverge, and nothing noticed: the grandchild refusal in
 * `kernel/loaded.ts` built its remedy from `constructor.name` and told the reader to
 * "call Comments flat with every id" — naming a symbol that is not in the export surface,
 * so the one instruction the message exists to give sent them nowhere. A doc comment in
 * `UserAssets.ts` pointed at `Assets.create` and a `{@link Relations}` in
 * `WorkItems/Dependencies.ts` pointed at a symbol that is neither exported nor in scope.
 *
 * This is the class, not the line. Two sweeps, both enumerating:
 *
 * - **The names the code says.** `exportedName()` reads a `publicName` static, because the
 *   barrel cannot be read from inside the kernel (`../index` imports it). A static is a
 *   second copy of a fact, so it is pinned to the barrel in *both* directions here: an
 *   alias with no static fails, and a static naming something the barrel does not export
 *   fails. And every resource in the tree must resolve to a real export name, which is
 *   what makes any message built from `exportedName` importable by construction.
 * - **The names the comments say.** No file under `src/api/v2` may name an aliased class
 *   by its unqualified spelling in a symbol position — `` `Comments` ``, `` `Comments.x` ``
 *   or `{@link Comments}` — with two exemptions that are derived rather than listed: the
 *   barrel itself, where the unqualified name is the real local symbol being aliased, and
 *   the file that declares the class, where it is the declaration's own name.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as v2Barrel from "../../../src/api/v2";
import { V2Resource } from "../../../src/api/v2/kernel/resource";
import { instantiate, migratedEntries, resourceEntries, V2_ROOT, walkFiles } from "./tree-walk";

interface AliasedClass {
  /** The name the class declares. */
  readonly declared: string;
  /** The name the barrel exports it under. */
  readonly exported: string;
  /** Module file the class is declared in, relative to `src/api/v2`. */
  readonly module: string;
  /** The `publicName` static the class declares, if any. */
  readonly publicName: string | undefined;
}

type ResourceConstructor = { name: string; publicName?: string; prototype: unknown };

/** Every resource class the barrel exports, mapped to the name it is exported under. */
function barrelNames(): Map<ResourceConstructor, string> {
  const found = new Map<ResourceConstructor, string>();
  for (const [name, value] of Object.entries(v2Barrel as Record<string, unknown>)) {
    if (typeof value !== "function") continue;
    if (!((value as ResourceConstructor).prototype instanceof V2Resource)) continue;
    found.set(value as unknown as ResourceConstructor, name);
  }
  return found;
}

/**
 * The public name for an instance, computed exactly as `kernel/loaded.ts` computes it.
 *
 * Deliberately a copy of that one expression rather than a call into it: the kernel's is
 * not exported, and a sweep that asked the code under test to grade itself would agree
 * with a wrong answer.
 */
function publicNameOf(instance: object): string {
  const constructor = instance.constructor as ResourceConstructor;
  return constructor.publicName ?? constructor.name;
}

const BARREL = barrelNames();

/** Every class whose barrel name differs from the name it declares. */
const ALIASED: AliasedClass[] = resourceEntries()
  .filter((entry) => {
    const exported = BARREL.get(entry.cls as unknown as ResourceConstructor);
    return exported !== undefined && exported !== entry.name;
  })
  .map((entry) => ({
    declared: entry.name,
    exported: BARREL.get(entry.cls as unknown as ResourceConstructor)!,
    module: entry.module,
    publicName: (entry.cls as unknown as ResourceConstructor).publicName,
  }));

describe("the public name of a resource class", () => {
  it("finds aliased classes to check at all", () => {
    // A floor, not a pin. Zero aliases would make every assertion below vacuous, and that
    // is exactly the state a botched barrel edit would leave the tree in.
    expect(ALIASED.length).toBeGreaterThanOrEqual(6);
  });

  it("declares `publicName` on every class the barrel renames", () => {
    const offenders = ALIASED.filter((alias) => alias.publicName !== alias.exported).map(
      (alias) =>
        `${alias.module}#${alias.declared} is exported as \`${alias.exported}\` but declares no ` +
        `\`static readonly publicName\` — every message the kernel builds from it would name ` +
        `\`${alias.declared}\`, which is not in the export surface`
    );

    expect(offenders.sort()).toEqual([]);
  });

  it("never lets `publicName` claim a name the barrel does not export", () => {
    // The other direction: a static is a second copy of a fact, so an edit to one side
    // without the other has to fail. A `publicName` that names nothing importable is worse
    // than none at all — it looks authoritative.
    const exportNames = new Set(BARREL.values());
    const offenders: string[] = [];

    for (const entry of resourceEntries()) {
      const declared = (entry.cls as unknown as ResourceConstructor).publicName;
      if (declared === undefined) continue;
      if (!exportNames.has(declared)) {
        offenders.push(
          `${entry.module}#${entry.name} declares publicName "${declared}", which the v2 barrel does not export`
        );
        continue;
      }
      if (BARREL.get(entry.cls as unknown as ResourceConstructor) !== declared) {
        offenders.push(
          `${entry.module}#${entry.name} declares publicName "${declared}" but the barrel exports this class as ` +
            `"${BARREL.get(entry.cls as unknown as ResourceConstructor)}"`
        );
      }
    }

    expect(offenders.sort()).toEqual([]);
  });

  it("resolves every resource in the tree to a name the barrel exports", () => {
    // The property that makes an error message importable *by construction*: the
    // grandchild refusal is built from `exportedName(parent)` and `exportedName(child)`
    // and nothing else, so if this holds for every resource, no message can name a symbol
    // the reader cannot import. Enumerated over the whole tree, not over the aliases.
    const exportNames = new Set(BARREL.values());
    const offenders = migratedEntries()
      .filter((entry) => BARREL.has(entry.cls as unknown as ResourceConstructor))
      .filter((entry) => !exportNames.has(publicNameOf(instantiate(entry))))
      .map(
        (entry) =>
          `${entry.module}#${entry.name} resolves to the public name "${publicNameOf(instantiate(entry))}", ` +
          `which the v2 barrel does not export`
      );

    expect(offenders.sort()).toEqual([]);
  });
});

describe("what the v2 sources say about an aliased class", () => {
  const files = walkFiles();

  it("reads every source file under src/api/v2", () => {
    // Floor for the scan below, which is otherwise green on an empty file list.
    expect(files.length).toBeGreaterThanOrEqual(80);
  });

  it("never names an aliased class by the spelling the barrel does not export", () => {
    // `UserAssets.ts` said "the user-scoped twin of `Assets.create`" and
    // `WorkItems/Dependencies.ts` said `{@link Relations}` — both naming symbols a reader
    // cannot import, and the second not even resolvable in its own file's scope, so the
    // IDE link was dead too.
    //
    // Symbol positions only: an aliased class's unqualified spelling is `Links`,
    // `Comments`, `Assets` — ordinary English words that appear in prose constantly, and
    // flagging those would make this sweep noise rather than a gate.
    const barrelFile = path.join(V2_ROOT, "index.ts");
    const offenders: string[] = [];

    for (const file of files) {
      // The barrel aliases these names, so it is the one file where the unqualified
      // spelling *is* the local symbol under discussion.
      if (file === barrelFile) continue;
      const text = fs.readFileSync(file, "utf8");
      for (const alias of ALIASED) {
        // The declaring file names its own declaration; that is the class's real name there.
        if (file === path.join(V2_ROOT, `${alias.module}.ts`)) continue;
        const symbol = new RegExp(`(?:\\{@link\\s+${alias.declared}[.}\\s]|\`${alias.declared}[\`.])`);
        if (!symbol.test(text)) continue;
        offenders.push(
          `${path.relative(V2_ROOT, file)} names \`${alias.declared}\` as a symbol, but the barrel exports ` +
            `that class as \`${alias.exported}\` — a reader cannot import the name they were given`
        );
      }
    }

    expect([...new Set(offenders)].sort()).toEqual([]);
  });
});
