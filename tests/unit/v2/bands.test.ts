/**
 * Each band must be complete at its flat root — in both directions, and derived from
 * something other than the tree it is checking.
 *
 * There are two bands, and they have the same shape. `Workspaces` is the root of the
 * workspace band (`v2.workspaces`); `Projects` is the root of the project band
 * (`v2.projects`). A family is only reachable from a fetched row once it is attached to
 * its root.
 *
 * **Where the expected membership comes from, and why it changed.** This sweep used to
 * enumerate each band from the retiring `Workspace`/`Project` locators: they held the
 * families, so they were the list. That worked while they were being emptied, but it
 * makes the sweep derive its expectations *from* the very wiring the last task deletes —
 * delete the locators and the assertions would have compared two shrinking sets and
 * passed by agreeing with themselves, which is the one failure mode every sweep in this
 * suite exists to refuse.
 *
 * So membership is now derived from each resource's **URL template**, which is generated
 * from the api_v2 golden and knows nothing about how the SDK is wired:
 *
 * - a resource whose path is `/workspaces/{slug}/` + one collection segment and **no
 *   further `{...}` placeholder** consumes exactly the workspace's own id, so a fetched
 *   workspace row can supply everything it needs: it belongs on `v2.workspaces`;
 * - the same test one level down (`/workspaces/{slug}/projects/{project_id}/` + no
 *   further placeholder) is the project band;
 * - anything with a further placeholder needs an id only its own parent row carries, so
 *   it is a child of a band member rather than a member — `loaded-navigation.test.ts`
 *   owns that rule.
 *
 * That derivation is independent of the constructors: the templates would still name all
 * 51 band members — 32 workspace-level, 19 project-level — if `Workspaces` and `Projects`
 * attached nothing at all.
 *
 * The rule then has three halves, and all three matter:
 *
 * 1. **Every band member is attached.** A migrated class that is not on its root is
 *    unreachable from the flat root and from every fetched row of it. This is the
 *    direction that caught eight orphaned project families when the project band first
 *    got a sweep — the same defect the Python port shipped, where a fetched project
 *    reached 3 of its 15 children.
 * 2. **Everything attached is a band member.** A resource whose path takes ids the root's
 *    rows do not carry would have `owned()` prepend a slug where a project id belongs and
 *    build a well-formed, wrong URL.
 * 3. **Nothing attached is still pre-flat.** A pre-flat class on a flat root reads its
 *    path ids from the retired locator scope, which the root does not supply, so
 *    `v2.workspaces.customers.list()` would raise `MissingPathIdError` rather than work.
 */

import { V2Namespace } from "../../../src/api/v2";
import { Projects } from "../../../src/api/v2/Projects";
import { Workspaces } from "../../../src/api/v2/Workspaces";
import { LoadsNavigableRows } from "../../../src/api/v2/kernel/loaded";
import { V2Resource } from "../../../src/api/v2/kernel/resource";
import { V2Transport } from "../../../src/api/v2/kernel/transport";
import {
  AnyResource,
  ResourceEntry,
  UNMIGRATED_RESOURCES,
  WALK_CONFIG,
  instantiate,
  pathOf,
  resourceEntries,
} from "./tree-walk";

/**
 * The pre-flat resources reachable under a flat root, keyed `<band>.<attribute path>`,
 * each with why it cannot be excluded.
 *
 * **Empty.** It held one entry while `wiki.collections` was pre-flat: `wiki` is a grouping
 * node whose sibling `wiki.pages` was already migrated, so rule 1 required `wiki` on the
 * flat root and `Collections` came along — reachable, but raising `MissingPathIdError` on
 * every call. That was recorded rather than hidden precisely so it could not be forgotten;
 * task 3 migrated `Collections` and it emptied.
 *
 * The mechanism stays, ratcheted at 0, for the next grouping node that straddles a
 * migration.
 */
export const PREFLAT_UNDER_ROOT: Readonly<Record<string, string>> = {};

/** How large {@link PREFLAT_UNDER_ROOT} is allowed to be. A ratchet: lower it, never raise it. */
export const PREFLAT_UNDER_ROOT_CEILING = 0;

/**
 * Band members that hang off a sibling resource instead of directly off the band root,
 * keyed by resource entry, each with why.
 *
 * Both entries are the same thing: **one class holding two routes.** `ReleaseLabels` and
 * `InitiativeLabels` each own a workspace-level catalog (`/workspaces/{slug}/releases/
 * labels/`, which is why the path derivation calls them workspace-band members) *and* the
 * per-parent bridge that adds and removes labels on one release or initiative. The bridge
 * is what a fetched row binds, so the class lives with the noun it belongs to and is
 * reached flat as `v2.workspaces.releases.labels.list(slug)`.
 *
 * `loaded-navigation.test.ts` records the same two under `CATALOG_SIBLINGS` and asserts
 * the consequence from the other end: `Owned<…>` maps a method that does not open with
 * the bound tuple to `never`, so `release.labels.list()` does not type-check, and at
 * runtime `assertLeadingParameters` throws naming the method rather than building a URL
 * with the release id where the slug belongs.
 *
 * The counter-example is deliberately *not* in here: `ReleaseTags` has no per-release
 * route at all — a release points at a tag through its own `tag_id` — so it was fixed at
 * the attachment (`v2.workspaces.releaseTags`) rather than exempted. Python shipped a
 * `release.tags` property whose every call raised, kept alive only to satisfy its own
 * navigation sweep.
 */
export const NESTED_BAND_MEMBERS: Readonly<Record<string, string>> = {
  "Releases/Labels#ReleaseLabels":
    "one class, two routes: the workspace release-label catalog and the per-release bridge. " +
    "The bridge is what a fetched release binds, so it is attached at v2.workspaces.releases.labels.",
  "Initiatives/Labels#InitiativeLabels":
    "one class, two routes: the workspace initiative-label catalog and the per-initiative bridge, " +
    "attached at v2.workspaces.initiatives.labels for the same reason as ReleaseLabels.",
};

/** How large {@link NESTED_BAND_MEMBERS} is allowed to be. A ratchet: lower it, never raise it. */
export const NESTED_BAND_MEMBERS_CEILING = 2;

/**
 * Families not yet on their flat root, because their classes are still pre-flat.
 *
 * A ratchet on the *count*, derived — the names come from the URL templates and the
 * opt-out list, never from a list written here, so this cannot drift. Both are 0: every
 * band member is migrated.
 */
export const BAND_PENDING_CEILING: Readonly<Record<string, number>> = { workspace: 0, project: 0 };

const namespace = new V2Namespace(WALK_CONFIG);

interface Band {
  /** The band's own name, and the key into {@link BAND_PENDING_CEILING}. */
  readonly name: string;
  /** The flat root the band must arrive at. */
  readonly root: AnyResource;
  /** How the root is spelled in a failure message. */
  readonly rootPath: string;
  /** The URL prefix every member of the band shares — one id per level above it. */
  readonly prefix: string;
  /** A floor on how many members the derivation must find, so it cannot go vacuous. */
  readonly memberFloor: number;
}

const BANDS: readonly Band[] = [
  {
    name: "workspace",
    root: namespace.workspaces,
    rootPath: "v2.workspaces",
    prefix: "/workspaces/{slug}/",
    memberFloor: 30,
  },
  {
    name: "project",
    root: namespace.projects,
    rootPath: "v2.projects",
    prefix: "/workspaces/{slug}/projects/{project_id}/",
    memberFloor: 18,
  },
];

/**
 * The band a resource's URL template puts it in: the prefix, one collection segment, and
 * no further placeholder.
 *
 * Read off `path` — generated from the golden — so the answer owes nothing to what any
 * constructor attached.
 */
function membersByPath(band: Band): ResourceEntry[] {
  return resourceEntries().filter((entry) => {
    const template = pathOf(instantiate(entry));
    if (!template.startsWith(band.prefix)) return false;
    const rest = template.slice(band.prefix.length);
    // The root itself (`/workspaces/{slug}/`) is not a member of its own band, and a
    // resource that names a further id is a child of a member rather than a member.
    return rest.length > 0 && !rest.includes("{");
  });
}

function isMigrated(entry: ResourceEntry): boolean {
  return !UNMIGRATED_RESOURCES.has(entry.key);
}

/**
 * Every `V2Resource` a node holds, directly or inside a grouping node, by the attribute
 * path it is reached at.
 *
 * Grouping nodes (`wiki`, `groupSync`) are descended into rather than skipped: they hold no
 * `V2Resource` base of their own, so a name-level comparison would miss `wiki.pages`
 * entirely — which is exactly the resource whose migration status decided whether `wiki`
 * could move to the flat root at all. A `V2Resource` is *not* descended into: its own
 * children belong to a fetched row of it, not to the band.
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

/** `Customers#Customers` for a resource instance, or `undefined` if the scan never saw it. */
function keyOf(resource: AnyResource): string | undefined {
  return resourceEntries().find((entry) => entry.cls === resource.constructor)?.key;
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
        const key = resource === undefined ? undefined : keyOf(resource);
        return key !== undefined && !UNMIGRATED_RESOURCES.has(key);
      }),
      // Every entry states why. A blank reason is not a reason.
      unreasoned: named.filter((dotted) => PREFLAT_UNDER_ROOT[dotted].trim().length === 0),
    }).toEqual({ unreachable: [], migrated: [], unreasoned: [] });

    // The ratchet. Lower `PREFLAT_UNDER_ROOT_CEILING` as these migrate; never raise it.
    expect(named.length).toBeLessThanOrEqual(PREFLAT_UNDER_ROOT_CEILING);
  });

  it("keeps every nested-band-member exemption real, band-shaped, and reachable", () => {
    const byKey = new Map(resourceEntries().map((entry) => [entry.key, entry]));
    const memberKeys = new Set(BANDS.flatMap((band) => membersByPath(band).map((entry) => entry.key)));
    // Reachable from *somewhere* under a root, at any depth — which is the claim an
    // exemption makes: not on the root, but still reachable flat.
    const reachableAnywhere = new Set<unknown>();
    const walk = (node: object): void => {
      for (const [name, child] of Object.entries(node)) {
        if (name.startsWith("_")) continue;
        if (typeof child !== "object" || child === null) continue;
        if (child instanceof V2Transport) continue;
        if (child instanceof V2Resource) {
          if (reachableAnywhere.has(child.constructor)) continue;
          reachableAnywhere.add(child.constructor);
        }
        if (child.constructor?.name === "Object" || child.constructor?.name === "Array") continue;
        walk(child);
      }
    };
    for (const band of BANDS) walk(band.root);
    const onARoot = new Set(BANDS.flatMap((band) => [...bandOf(band.root).values()].map((r) => r.constructor)));

    const named = Object.keys(NESTED_BAND_MEMBERS).sort();

    expect({
      // An entry naming a class the source scan never saw describes nothing.
      unknown: named.filter((key) => !byKey.has(key)),
      // An entry for a class that is not band-shaped by its own URL is not an exemption
      // from this rule at all — the rule would never have asked about it.
      notABandMember: named.filter((key) => !memberKeys.has(key)),
      // An entry for a class nothing under a root reaches is the Python `release.tags`
      // defect: an exemption keeping an unreachable resource looking accounted for.
      unreachable: named.filter((key) => {
        const entry = byKey.get(key);
        return entry !== undefined && !reachableAnywhere.has(entry.cls);
      }),
      // An entry for a class that *is* on a root is stale: the rule it exempts from is
      // already satisfied, and the exemption only hides the next one.
      alreadyAttached: named.filter((key) => {
        const entry = byKey.get(key);
        return entry !== undefined && onARoot.has(entry.cls);
      }),
      // Every entry states why. A blank reason is not a reason.
      unreasoned: named.filter((key) => NESTED_BAND_MEMBERS[key].trim().length === 0),
    }).toEqual({ unknown: [], notABandMember: [], unreachable: [], alreadyAttached: [], unreasoned: [] });

    expect(named.length).toBeLessThanOrEqual(NESTED_BAND_MEMBERS_CEILING);
  });
});

describe.each(BANDS.map((band) => [band.name, band] as const))("the %s band", (_name, band) => {
  const members = membersByPath(band);
  const rootBand = bandOf(band.root);
  const attachedClasses = new Set([...rootBand.values()].map((resource) => resource.constructor));

  it("derives a band to check at all", () => {
    // A floor, not a pin. If the derivation breaks, the assertions below pass by comparing
    // two empty sets — the failure mode every sweep in this suite exists to refuse.
    expect(members.length).toBeGreaterThanOrEqual(band.memberFloor);
    expect(rootBand.size).toBeGreaterThanOrEqual(band.memberFloor - Object.keys(NESTED_BAND_MEMBERS).length);
  });

  it("attaches every resource whose own URL puts it in this band", () => {
    const missing = members
      .filter((entry) => !attachedClasses.has(entry.cls) && !(entry.key in NESTED_BAND_MEMBERS))
      .map(
        (entry) =>
          `${entry.key} takes ${band.prefix} and nothing further, so it is a ${band.name}-band resource — ` +
          `but it is not attached to ${band.root.constructor.name}, so it is unreachable from ${band.rootPath} ` +
          `and from every fetched ${band.name} row`
      )
      .sort();

    expect(missing).toEqual([]);
  });

  it("attaches nothing that belongs to another band", () => {
    const memberClasses = new Set(members.map((entry) => entry.cls));
    const foreign = [...rootBand.entries()]
      .filter(([, resource]) => !memberClasses.has(resource.constructor as never))
      .map(([dotted, resource]) => {
        const template = (resource as unknown as { path: string }).path;
        return (
          `${band.rootPath}.${dotted} is ${resource.constructor.name}, whose path is ${template} — it does not ` +
          `take ${band.prefix} and nothing further, so binding this root's ids into it builds a well-formed ` +
          `wrong URL`
        );
      })
      .sort();

    expect(foreign).toEqual([]);
  });

  it("attaches nothing that is still pre-flat", () => {
    const premature = [...rootBand.entries()]
      .filter(([dotted, resource]) => {
        const key = keyOf(resource);
        return key !== undefined && UNMIGRATED_RESOURCES.has(key) && !(`${band.name}.${dotted}` in PREFLAT_UNDER_ROOT);
      })
      .map(
        ([dotted, resource]) =>
          `${band.rootPath}.${dotted} is ${resource.constructor.name}, which still reads its path ids from the ` +
          `retired locator scope — attached to the flat root it can only raise MissingPathIdError`
      )
      .sort();

    expect(premature).toEqual([]);
  });

  it("counts what is left against a ratchet", () => {
    const pending = members.filter((entry) => !isMigrated(entry));

    expect(pending.map((entry) => entry.key).sort().length).toBeLessThanOrEqual(BAND_PENDING_CEILING[band.name]);
  });
});
