/**
 * A loaded row must reach every migrated child its resource attaches.
 *
 * The resource side and the row side are two independent declarations —
 * `Projects`' constructor attaches `states`/`labels`/`workItems`, and `ProjectNavigation`
 * declares one typed property each — and nothing but this sweep compares them. The gap
 * that leaves is not theoretical: in the Python port `Projects` attached fifteen children
 * while its loaded row exposed three, so the flat call worked and `project.cycles.list()`
 * raised, with every other test green.
 *
 * So the correspondence is derived, never tabulated: for every resource that extends
 * `LoadsNavigableRows`, the navigation properties on a row it builds must be exactly the
 * child resources it attaches — minus the children still on the opt-out list, which have
 * no flat signature to bind ids into yet. A child leaving that list therefore *demands* a
 * navigation property in the same change; it can never quietly acquire one later.
 *
 * Three things a name-only comparison would miss, and this checks:
 *
 * - each property must wrap **its own** child, so a copy-pasted `owned(this.states, …)`
 *   under `workItems` is caught;
 * - each property must hand back an owned view rather than the bare resource — a bare
 *   resource still needs every id repeated, which is the whole thing loaded rows exist to
 *   avoid;
 * - each child's leading parameters must be exactly the parent's `loadedIdNames`, in
 *   order. `owned()` prepends positionally and every path id is a `string`, so neither
 *   the type system nor the URL builder can tell a transposed child from a correct one.
 */

import { LoadedMeta, ownedBinding } from "../../../src/api/v2/kernel/loaded";
import {
  AnyResource,
  ResourceEntry,
  UNMIGRATED_RESOURCES,
  childResources,
  instantiate,
  navigableEntries,
  publicMethods,
  resourceEntries,
} from "./tree-walk";

/**
 * Child attribute name -> navigation property name, where the two must differ.
 *
 * **Empty today.** The collisions Python needed entries for (`Estimate.points`,
 * `WorkItemProperty.options` — real API fields a navigation property of the same name
 * would shadow) belong to families tasks 2 and 3 still have to migrate. Add a row only for
 * that kind of reason: a child whose attribute name is already taken by a field on the
 * row. Any other divergence is a bug.
 */
export const NAVIGATION_ALIASES: Readonly<Record<string, Record<string, string>>> = {};

const NAVIGABLE = navigableEntries();

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * An empty loaded row wired to `resource`, so its navigation properties can be read
 * without a fetch — the point is to know what exists before anything is requested.
 */
function rowOf(resource: AnyResource): Record<string, unknown> {
  const idNames = (resource as any).loadedIdNames as readonly string[];
  const ids = idNames.map((name) => `id-${name}`);
  return (resource as any).load({ id: ids[ids.length - 1] }, ids.slice(0, -1)) as Record<string, unknown>;
}

function idNamesOf(resource: AnyResource): readonly string[] {
  return (resource as any).loadedIdNames as readonly string[];
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** The navigation properties a loaded row carries: its own accessor properties. */
function navigationProperties(row: object): string[] {
  return Object.entries(Object.getOwnPropertyDescriptors(row))
    .filter(([, descriptor]) => typeof descriptor.get === "function")
    .map(([name]) => name)
    .sort();
}

function entryOf(resource: AnyResource): ResourceEntry | undefined {
  return resourceEntries().find((candidate) => candidate.cls === resource.constructor);
}

/** The children a navigable resource attaches whose own migration is done. */
function migratedChildren(resource: AnyResource): Map<string, AnyResource> {
  const migrated = new Map<string, AnyResource>();
  for (const [attribute, child] of childResources(resource)) {
    const entry = entryOf(child);
    if (entry === undefined || UNMIGRATED_RESOURCES.has(entry.key)) continue;
    migrated.set(attribute, child);
  }
  return migrated;
}

describe("loaded navigation", () => {
  it("finds navigable resources at all", () => {
    // A floor, not a pin: if `LoadsNavigableRows` discovery breaks, every assertion below
    // passes by checking nothing. Raise this as tasks 2 and 3 make families navigable.
    expect(NAVIGABLE.length).toBeGreaterThanOrEqual(2);
  });
});

describe.each(NAVIGABLE.map((entry) => [entry.key, entry] as const))("%s", (_key, entry) => {
  it("exposes exactly one navigation property per migrated child it attaches", () => {
    const resource = instantiate(entry);
    const aliases = NAVIGATION_ALIASES[entry.name] ?? {};
    const expected = [...migratedChildren(resource).keys()].map((name) => aliases[name] ?? name).sort();

    expect(navigationProperties(rowOf(resource))).toEqual(expected);
  });

  it("wraps its own child behind each property, as an owned view rather than the bare resource", () => {
    const resource = instantiate(entry);
    const aliases = NAVIGATION_ALIASES[entry.name] ?? {};
    const row = rowOf(resource);

    for (const [attribute, child] of migratedChildren(resource)) {
      const view = row[aliases[attribute] ?? attribute] as Record<string, unknown>;

      expect(view).toBeDefined();
      // An owned view is a plain object of bound functions; the bare resource would be an
      // instance of the child class and would still demand every id.
      expect(view instanceof (child.constructor as new () => unknown)).toBe(false);

      // Identity, not method names: sibling resources routinely share a method set, so
      // `owned(this.states, …)` under `labels` is invisible to any name comparison.
      const binding = ownedBinding(view);
      expect(binding?.resource).toBe(child);
      expect(binding?.idNames).toEqual([...idNamesOf(resource)]);

      const childEntry = entryOf(child);
      const childMethods = childEntry === undefined ? [] : publicMethods(childEntry).map((method) => method.name);
      expect(Object.keys(view).sort()).toEqual([...childMethods].sort());
    }
  });

  it("binds its ids into child parameters that actually carry them, in order", () => {
    const resource = instantiate(entry);
    const idNames = idNamesOf(resource);
    const offenders: string[] = [];

    for (const [attribute, child] of migratedChildren(resource)) {
      const childEntry = entryOf(child);
      if (childEntry === undefined) continue;
      for (const method of publicMethods(childEntry)) {
        for (const signature of method.signatures) {
          const leading = signature.slice(0, idNames.length);
          if (leading.join(",") !== idNames.join(",")) {
            offenders.push(
              `${entry.name}.${attribute}: ${childEntry.name}.${method.name} opens [${leading.join(", ")}], ` +
                `not [${idNames.join(", ")}]`
            );
          }
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  it("carries the ids that produced the row, ending with the row's own", () => {
    const resource = instantiate(entry);
    const idNames = idNamesOf(resource);
    const meta = (rowOf(resource) as { $loaded: LoadedMeta }).$loaded;

    expect(meta.idNames).toEqual([...idNames]);
    expect(meta.ids).toHaveLength(idNames.length);
    expect(meta.ids[meta.ids.length - 1]).toBe(`id-${idNames[idNames.length - 1]}`);
  });
});
