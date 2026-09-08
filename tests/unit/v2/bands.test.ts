/**
 * Each band must arrive at its flat root as it migrates — a ratchet, not a hole.
 *
 * There are two bands, and they have the same shape. `Workspaces` is the root of the
 * workspace band (`v2.workspaces`); `Projects` is the root of the project band
 * (`v2.projects`). A family only becomes reachable from a fetched row once it is attached
 * to its root. The retiring locators (`src/api/v2/Workspace.ts`, `src/api/v2/Project.ts`)
 * are the complete list of what each band contains — they are what holds the families that
 * have not moved yet, and the last task of the variant-F plan deletes them — so they are
 * the enumeration this sweep derives from. Nothing here is tabulated: there is no list of
 * "families still to come" to keep in step, only each locator's own attributes and each
 * class's migration status.
 *
 * The rule has two halves, and both matter:
 *
 * 1. **Migrated means attached.** A class that has left `UNMIGRATED_RESOURCES` and still
 *    hangs only off its locator is unreachable from the flat root and from every fetched
 *    row of it. This is the ratchet: `UNMIGRATED_RESOURCES` may only shrink, and every name
 *    that leaves it lands here as a failure until the family is attached — at which point
 *    `loaded-navigation.test.ts` demands the navigation property in the same change. A
 *    family cannot be migrated and quietly skipped on the root.
 * 2. **Attached means migrated.** A pre-flat class attached to a root would read its path
 *    ids from the retired locator scope, which the flat root does not supply — so
 *    `v2.workspaces.customers.list()` would raise `MissingPathIdError` rather than work.
 *    Attaching a band early to make the tree "look done" is refused.
 *
 * The count of families still pending is ratcheted per band, so the sweep says out loud how
 * much of each band is left rather than only failing once somebody moves one.
 *
 * **Why both bands, and why the project band was added before task 3 rather than after.**
 * This file began as `workspace-band.test.ts` and covered one root. The project band had
 * the identical shape and no sweep, and `Projects` was attaching 3 of the 16 families its
 * locator held — which is, precisely, the defect the Python port shipped and the
 * navigation sweep's own doc comment cites (a fetched project reaching 3 of its 15
 * children). Generalising afterwards would have flagged eight families at once instead of
 * obliging each to attach as it migrated.
 */

import { V2Namespace } from "../../../src/api/v2";
import { Projects } from "../../../src/api/v2/Projects";
import { Workspaces } from "../../../src/api/v2/Workspaces";
import { LoadsNavigableRows } from "../../../src/api/v2/kernel/loaded";
import { V2Resource } from "../../../src/api/v2/kernel/resource";
import { V2Transport } from "../../../src/api/v2/kernel/transport";
import { AnyResource, UNMIGRATED_RESOURCES, WALK_CONFIG, resourceEntries } from "./tree-walk";

/**
 * The pre-flat resources reachable under a flat root, keyed `<band>.<attribute path>`,
 * each with why it cannot be excluded.
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
  "workspace.wiki.collections":
    "`wiki` must be on the flat root because its sibling `wiki.pages` (WikiPages) is migrated, " +
    "and a grouping node moves whole; `Collections` migrates in task 3",
};

/** How large {@link PREFLAT_UNDER_ROOT} is allowed to be. A ratchet: lower it, never raise it. */
export const PREFLAT_UNDER_ROOT_CEILING = 1;

/**
 * Families not yet on their flat root, because their classes are still pre-flat.
 *
 * A ratchet on the *count*, derived — the names come from the locators and the opt-out
 * list, never from a list written here, so this cannot drift. Task 3 lowers both to 0 as it
 * migrates the two bands; they are never raised.
 */
export const BAND_PENDING_CEILING: Readonly<Record<string, number>> = { workspace: 8, project: 8 };

const namespace = new V2Namespace(WALK_CONFIG);
const workspaceLocator = namespace.workspace("acme");

interface Band {
  /** The band's own name, and the key into {@link BAND_PENDING_CEILING}. */
  readonly name: string;
  /** The retiring locator: the complete list of what the band contains. */
  readonly locator: object;
  /** The flat root the band must arrive at. */
  readonly root: AnyResource;
  /** How the root is spelled in a failure message. */
  readonly rootPath: string;
  /** The URL prefix every member of the band shares — one id per level above it. */
  readonly prefix: string;
  /** A floor on how many resources the root must reach, raised as the band arrives. */
  readonly rootFloor: number;
}

const BANDS: readonly Band[] = [
  {
    name: "workspace",
    locator: workspaceLocator,
    root: namespace.workspaces,
    rootPath: "v2.workspaces",
    prefix: "/workspaces/{slug}/",
    rootFloor: 15,
  },
  {
    name: "project",
    locator: workspaceLocator.project("ENG"),
    root: namespace.projects,
    rootPath: "v2.projects",
    prefix: "/workspaces/{slug}/projects/{project_id}/",
    rootFloor: 10,
  },
];

/** `Customers#Customers` for a resource instance, or `undefined` if the scan never saw it. */
function keyOf(resource: AnyResource): string | undefined {
  return resourceEntries().find((entry) => entry.cls === resource.constructor)?.key;
}

function isMigrated(resource: AnyResource): boolean {
  const key = keyOf(resource);
  return key !== undefined && !UNMIGRATED_RESOURCES.has(key);
}

/**
 * Every `V2Resource` a node holds, directly or inside a grouping node, by the attribute
 * path it is reached at.
 *
 * Grouping nodes (`wiki`, `groupSync`) are descended into rather than skipped: they hold no
 * `V2Resource` base of their own, so a name-level comparison would miss `wiki.pages`
 * entirely — which is exactly the resource whose migration status decided whether `wiki`
 * could move to the flat root at all.
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

describe("the roots of the two bands", () => {
  it("are navigable, so a fetched row reaches its children", () => {
    // Stated here as well as derived in `loaded-navigation.test.ts`, because `Workspaces`
    // is the exact resource the Python SDK shipped non-navigable: `workspaces.retrieve()`
    // answered a bare row whose two dozen children were unreachable, and that port's
    // navigation sweep could not see it because it *selected* on `loaded_model`.
    for (const cls of [Workspaces, Projects]) {
      expect([cls.name, Object.getPrototypeOf(cls.prototype).constructor]).toEqual([cls.name, LoadsNavigableRows]);
    }
  });

  it("keeps the one recorded pre-flat exception real, still needed, and shrinking", () => {
    const reachable = new Map(
      BANDS.flatMap((band) => [...bandOf(band.root)].map(([dotted, resource]) => [`${band.name}.${dotted}`, resource]))
    );
    const named = Object.keys(PREFLAT_UNDER_ROOT).sort();

    expect({
      // An entry for something no root reaches describes nothing.
      unreachable: named.filter((dotted) => !reachable.has(dotted)),
      // An entry for a class that *has* migrated reads as a gap that was never closed.
      migrated: named.filter((dotted) => {
        const resource = reachable.get(dotted);
        return resource !== undefined && isMigrated(resource);
      }),
      // Every entry states why. A blank reason is not a reason.
      unreasoned: named.filter((dotted) => PREFLAT_UNDER_ROOT[dotted].trim().length === 0),
    }).toEqual({ unreachable: [], migrated: [], unreasoned: [] });

    // The ratchet. Lower `PREFLAT_UNDER_ROOT_CEILING` as these migrate; never raise it.
    expect(named.length).toBeLessThanOrEqual(PREFLAT_UNDER_ROOT_CEILING);
  });
});

describe.each(BANDS.map((band) => [band.name, band] as const))("the %s band", (_name, band) => {
  const locatorBand = bandOf(band.locator);
  const rootBand = bandOf(band.root);

  it("finds a band to check at all", () => {
    // A floor, not a pin. If the walk breaks, the assertions below pass by comparing two
    // empty sets — the failure mode every sweep in this suite exists to refuse.
    expect(locatorBand.size).toBeGreaterThanOrEqual(15);
    expect(rootBand.size).toBeGreaterThanOrEqual(band.rootFloor);
  });

  it("attaches every family whose class has been migrated", () => {
    const attached = new Set([...rootBand.values()].map((resource) => resource.constructor));
    const orphans = [...locatorBand.entries()]
      .filter(([, resource]) => isMigrated(resource) && !attached.has(resource.constructor))
      .map(
        ([dotted, resource]) =>
          `the ${band.name} locator's .${dotted} is ${resource.constructor.name}, which is migrated but is not ` +
          `attached to ${band.root.constructor.name} — so it is unreachable from ${band.rootPath} and from every ` +
          `fetched ${band.name} row`
      )
      .sort();

    expect(orphans).toEqual([]);
  });

  it("attaches nothing that is still pre-flat", () => {
    const premature = [...rootBand.entries()]
      .filter(([dotted, resource]) => !isMigrated(resource) && !(`${band.name}.${dotted}` in PREFLAT_UNDER_ROOT))
      .map(
        ([dotted, resource]) =>
          `${band.rootPath}.${dotted} is ${resource.constructor.name}, which still reads its path ids from the ` +
          `retired locator scope — attached to the flat root it can only raise MissingPathIdError`
      )
      .sort();

    expect(premature).toEqual([]);
  });

  it("counts what is left against a ratchet", () => {
    const pending = [...locatorBand.values()].filter((resource) => !isMigrated(resource));
    const distinct = new Set(pending.map((resource) => resource.constructor.name));

    expect([...distinct].sort().length).toBeLessThanOrEqual(BAND_PENDING_CEILING[band.name]);
  });

  it("routes the whole flat root through the band's own path ids, and only those", () => {
    // Every child of a root binds exactly the ids the root's rows carry. If one needed
    // more, `owned()` would prepend a slug where a project id belongs and build a
    // well-formed wrong URL.
    for (const [dotted, resource] of rootBand) {
      const template = (resource as unknown as { path: string }).path;
      expect([dotted, template.startsWith(band.prefix)]).toEqual([dotted, true]);
    }
  });
});
