/**
 * The workspace band must arrive at `v2.workspaces` as it migrates — a ratchet, not a hole.
 *
 * `Workspaces` is the root of the flat tree, and a family only becomes reachable from a
 * fetched workspace once it is attached there. The retiring `Workspace` locator
 * (`src/api/v2/Workspace.ts`) is the complete list of what the band contains — it is what
 * holds the families that have not moved yet, and the last task of the variant-F plan
 * deletes it — so it is the enumeration this sweep derives from. Nothing here is
 * tabulated: there is no list of "families still to come" to keep in step, only the
 * locator's own attributes and each class's migration status.
 *
 * The rule has two halves, and both matter:
 *
 * 1. **Migrated means attached.** A class that has left `UNMIGRATED_RESOURCES` and still
 *    hangs only off the locator is unreachable from `v2.workspaces` and from every fetched
 *    workspace row. This is the ratchet: `UNMIGRATED_RESOURCES` may only shrink, and every
 *    name that leaves it lands here as a failure until the family is attached — at which
 *    point `loaded-navigation.test.ts` demands the navigation property in the same change.
 *    Task 3 cannot migrate a workspace family and quietly skip the root.
 * 2. **Attached means migrated.** A pre-flat class attached to `Workspaces` would read its
 *    `{slug}` from the retired locator scope, which the flat root does not supply — so
 *    `v2.workspaces.customers.list()` would raise `MissingPathIdError` rather than work.
 *    Attaching the band early to make the tree "look done" is refused.
 *
 * The count of families still pending is ratcheted too, so the sweep says out loud how much
 * of the band is left rather than only failing once somebody moves one.
 */

import { V2Namespace } from "../../../src/api/v2";
import { Workspaces } from "../../../src/api/v2/Workspaces";
import { V2Resource } from "../../../src/api/v2/kernel/resource";
import { V2Transport } from "../../../src/api/v2/kernel/transport";
import { AnyResource, UNMIGRATED_RESOURCES, WALK_CONFIG, resourceEntries } from "./tree-walk";

/**
 * Workspace families not yet on `v2.workspaces`, because their classes are still pre-flat.
 *
 * A ratchet on the *count*, derived — the names come from the locator and the opt-out list,
 * never from a list written here, so this cannot drift. Task 3 lowers it to 0 as it
 * migrates the band; it is never raised.
 */
export const WORKSPACE_BAND_PENDING_CEILING = 8;

/**
 * The pre-flat resources reachable under `v2.workspaces`, keyed by the attribute path they
 * are reached at, each with why it cannot be excluded.
 *
 * There is exactly one, and it exists because `wiki` is a grouping node whose two children
 * are at different stages: `WikiPages` is migrated, so rule 1 requires `wiki` on the flat
 * root, and `Collections` is not, so it comes along. Leaving `wiki` off the root instead
 * would make a migrated resource unreachable from a fetched workspace — the silent hole
 * this file exists to refuse — so the reachable-but-not-yet-callable child is recorded
 * rather than hidden, and ratcheted so nothing joins it.
 *
 * Calling one is not a silent failure: `formatPath` raises `MissingPathIdError` naming the
 * resource, the method, the template and the missing `slug`, and
 * `v2.workspace(slug).wiki.collections` works today. Task 3 migrates `Collections` and this
 * empties.
 */
export const PREFLAT_UNDER_ROOT: Readonly<Record<string, string>> = {
  "wiki.collections":
    "`wiki` must be on the flat root because its sibling `wiki.pages` (WikiPages) is migrated, " +
    "and a grouping node moves whole; `Collections` migrates in task 3",
};

/** How large {@link PREFLAT_UNDER_ROOT} is allowed to be. A ratchet: lower it, never raise it. */
export const PREFLAT_UNDER_ROOT_CEILING = 1;

const namespace = new V2Namespace(WALK_CONFIG);
const locator = namespace.workspace("acme");
const root = namespace.workspaces;

/** `Customers#Customers` for a resource instance, or `undefined` if the scan never saw it. */
function keyOf(resource: AnyResource): string | undefined {
  return resourceEntries().find((entry) => entry.cls === resource.constructor)?.key;
}

function isMigrated(resource: AnyResource): boolean {
  const key = keyOf(resource);
  return key !== undefined && !UNMIGRATED_RESOURCES.has(key);
}

/**
 * Every `V2Resource` the locator holds, directly or inside a grouping node, by the
 * attribute path it is reached at.
 *
 * Grouping nodes (`wiki`, `groupSync`) are descended into rather than skipped: they hold no
 * `V2Resource` base of their own, so a name-level comparison would miss `wiki.pages`
 * entirely — which is exactly the resource whose migration status decides whether `wiki`
 * can move to the flat root at all.
 */
function bandOf(node: object, prefix = ""): Map<string, AnyResource> {
  const found = new Map<string, AnyResource>();
  for (const [name, child] of Object.entries(node)) {
    if (name.startsWith("_")) continue;
    if (typeof child !== "object" || child === null) continue;
    if (child instanceof V2Transport) continue;
    const dotted = prefix === "" ? name : `${prefix}.${name}`;
    if (child instanceof V2Resource) {
      found.set(dotted, child as AnyResource);
    } else if (child.constructor?.name !== "Object" && child.constructor?.name !== "Array") {
      for (const [deeper, resource] of bandOf(child, dotted)) found.set(deeper, resource);
    }
  }
  return found;
}

const LOCATOR_BAND = bandOf(locator);
const ROOT_BAND = bandOf(root);

describe("the workspace band on v2.workspaces", () => {
  it("finds a band to check at all", () => {
    // A floor, not a pin. If the walk breaks, both assertions below pass by comparing two
    // empty sets — the failure mode every sweep in this suite exists to refuse.
    expect(LOCATOR_BAND.size).toBeGreaterThanOrEqual(20);
    expect(ROOT_BAND.size).toBeGreaterThanOrEqual(15);
  });

  it("is the root of the tree — navigable, so a fetched workspace reaches its children", () => {
    // Stated here as well as derived in `loaded-navigation.test.ts`, because this is the
    // exact resource the Python SDK shipped non-navigable: `workspaces.retrieve()` answered
    // a bare row whose two dozen children were unreachable, and that port's navigation
    // sweep could not see it because it *selected* on `loaded_model`.
    expect(Object.getPrototypeOf(Workspaces.prototype).constructor.name).toBe("LoadsNavigableRows");
  });

  it("attaches every workspace family whose class has been migrated", () => {
    const attached = new Set([...ROOT_BAND.values()].map((resource) => resource.constructor));
    const orphans = [...LOCATOR_BAND.entries()]
      .filter(([, resource]) => isMigrated(resource) && !attached.has(resource.constructor))
      .map(
        ([dotted, resource]) =>
          `v2.workspace(slug).${dotted} is ${resource.constructor.name}, which is migrated but is not ` +
          `attached to Workspaces — so it is unreachable from v2.workspaces and from every fetched workspace row`
      )
      .sort();

    expect(orphans).toEqual([]);
  });

  it("attaches nothing that is still pre-flat, bar the one recorded exception", () => {
    const premature = [...ROOT_BAND.entries()]
      .filter(([dotted, resource]) => !isMigrated(resource) && !(dotted in PREFLAT_UNDER_ROOT))
      .map(
        ([dotted, resource]) =>
          `v2.workspaces.${dotted} is ${resource.constructor.name}, which still reads its {slug} from the ` +
          `retired locator scope — attached to the flat root it can only raise MissingPathIdError`
      )
      .sort();

    expect(premature).toEqual([]);
  });

  it("keeps that exception real, still needed, and shrinking", () => {
    const named = Object.keys(PREFLAT_UNDER_ROOT).sort();

    expect({
      // An entry for something the root does not reach describes nothing.
      unreachable: named.filter((dotted) => !ROOT_BAND.has(dotted)),
      // An entry for a class that *has* migrated reads as a gap that was never closed.
      migrated: named.filter((dotted) => {
        const resource = ROOT_BAND.get(dotted);
        return resource !== undefined && isMigrated(resource);
      }),
      // Every entry states why. A blank reason is not a reason.
      unreasoned: named.filter((dotted) => PREFLAT_UNDER_ROOT[dotted].trim().length === 0),
    }).toEqual({ unreachable: [], migrated: [], unreasoned: [] });

    // The ratchet. Lower `PREFLAT_UNDER_ROOT_CEILING` as these migrate; never raise it.
    expect(named.length).toBeLessThanOrEqual(PREFLAT_UNDER_ROOT_CEILING);
  });

  it("counts what is left against a ratchet task 3 has to lower", () => {
    const pending = [...LOCATOR_BAND.values()].filter((resource) => !isMigrated(resource));
    const distinct = new Set(pending.map((resource) => resource.constructor.name));

    expect(distinct.size).toBeLessThanOrEqual(WORKSPACE_BAND_PENDING_CEILING);
  });

  it("routes the whole flat root through the slug, and only the slug", () => {
    // Every child of the root binds exactly one id. If one needed two, `owned()` would
    // prepend a slug where a project id belongs and build a well-formed wrong URL.
    for (const [dotted, resource] of ROOT_BAND) {
      const template = (resource as unknown as { path: string }).path;
      expect([dotted, template.startsWith("/workspaces/{slug}/")]).toEqual([dotted, true]);
    }
  });
});
