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
 * **Which resources are checked is itself enumerated, not selected.** Every assertion below
 * the first `describe` runs over the classes that extend `LoadsNavigableRows` — so a
 * migrated family that attaches migrated children and stays on plain `V2Resource` would be
 * checked by none of them. The first `describe` closes that by making a migrated child the
 * thing that *obliges* a resource to be navigable, so the selected set and the set the
 * rules apply to cannot drift apart.
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

import { EXPAND, FIELDS } from "../../../src/api/v2/generated/constants";
import { LoadedMeta, ownedBinding } from "../../../src/api/v2/kernel/loaded";
import {
  AnyResource,
  ResourceEntry,
  UNMIGRATED_RESOURCES,
  childResources,
  instantiate,
  migratedEntries,
  navigableEntries,
  operationsOf,
  publicMethods,
  resourceEntries,
} from "./tree-walk";

/**
 * Child attribute name -> navigation property name, where the two must differ.
 *
 * A row goes in here only for one reason: the child's attribute name is already a key the
 * API itself puts on the row, so a navigation property of that name would define over real
 * data. `loadRow` refuses that outright and {@link fullRowOf} makes the refusal fire in CI,
 * so an entry here is never a suppression — it is the record of which spelling was chosen
 * instead. Any other divergence between the two names is a bug.
 *
 * `Estimates.points` is the inline point scale `?expand=points` returns, and
 * `options` on both work-item-property classes is the inlined choice list of an
 * OPTION-typed property. The Python SDK needed the identical three renames on the
 * identical three resources.
 */
export const NAVIGATION_ALIASES: Readonly<Record<string, Record<string, string>>> = {
  Estimates: { points: "estimatePoints" },
  WorkItemProperties: { options: "propertyOptions" },
  WorkspaceWorkItemProperties: { options: "propertyOptions" },
};

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

/**
 * The same row, but carrying **every key the golden says this resource can return** rather
 * than `id` alone.
 *
 * {@link rowOf} builds `{ id }`, and no navigation property can collide with `id` — so a
 * navigation property named after a real API field is invisible to every assertion built
 * on it, which is precisely how a collision would reach a consumer. `loadRow` refuses to
 * define a navigation property over a field the row already carries, so building the real
 * shape here turns that refusal into a sweep: the collision fails in CI instead of silently
 * hiding the field behind a child resource at runtime.
 *
 * **Two sources, not one.** `FIELDS` is what the row carries by default, and `EXPAND` is
 * what `?expand=` adds to it under the relation's own name — and the expand names are where
 * the collisions actually are. `Estimate.points` is not in `FIELDS.estimates_list` at all;
 * it exists only as `EXPAND.estimates_list`, the inline point scale the server returns when
 * asked. A `FIELDS`-only version of this row passes while `estimates.retrieve(…, { expand:
 * ["points"] })` throws in the consumer's hands, which is the exact failure mode the
 * `defineOver` guard was written for. Python needed an alias for that very property, and
 * this is what makes the need mechanical here rather than remembered.
 *
 * Every key gets the row's own id as its value so `rowId` — which some resources override
 * to prefer a readable key like `identifier` — still yields the id the caller expects.
 */
function fullRowOf(resource: AnyResource): Record<string, unknown> {
  const tables = [FIELDS, EXPAND].map((table) => table as unknown as Record<string, readonly string[]>);
  const operations = operationsOf(resource);
  const idNames = idNamesOf(resource);
  const ids = idNames.map((name) => `id-${name}`);
  const own = ids[ids.length - 1];

  const row: Record<string, unknown> = {};
  for (const action of ["retrieve", "list"]) {
    const operationId = operations[action];
    if (operationId === undefined) continue;
    for (const table of tables) {
      for (const key of table[operationId] ?? []) {
        // `all` is the golden's "no projection" sentinel, not a field name.
        if (key !== "all") row[key] = own;
      }
    }
  }
  row.id = own;
  return (resource as any).load(row, ids.slice(0, -1)) as Record<string, unknown>;
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

  it("makes every migrated resource that attaches a migrated child navigable in the first place", () => {
    // The assertion that turns the sweep below from a *selection* into an *enumeration*.
    //
    // Everything else in this file lives inside `describe.each(NAVIGABLE)`, and `NAVIGABLE`
    // is chosen by `prototype instanceof LoadsNavigableRows`. A family that migrates its
    // classes, attaches its migrated children, and simply stays `extends V2Resource` is
    // therefore checked by *zero* navigation assertions: its URL tests all pass, and its
    // grandchildren are unreachable from any fetched row. That is not a hypothetical — the
    // Python SDK shipped exactly this hole and carried it across four plans, surfacing only
    // in final review, where `workspaces.retrieve()` answered a bare row whose 24 children
    // could not be reached.
    //
    // So attaching a migrated child is what *obliges* a resource to be navigable. A class
    // cannot opt out of the navigation rules by declining to extend the base that carries
    // them.
    const navigable = new Set(NAVIGABLE.map((candidate) => candidate.key));
    const offenders = migratedEntries()
      .filter((entry) => !navigable.has(entry.key))
      .map((entry) => ({ entry, children: [...migratedChildren(instantiate(entry)).keys()].sort() }))
      .filter(({ children }) => children.length > 0)
      .map(
        ({ entry, children }) =>
          `${entry.key} attaches migrated child resource(s) ${children.join(", ")} but does not extend ` +
          `LoadsNavigableRows, so a fetched row of it reaches none of them`
      )
      .sort();

    expect(offenders).toEqual([]);
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

  it("gives no navigation property a name one of the row's own fields already uses", () => {
    // The collision `NAVIGATION_ALIASES` exists to prevent, made visible. Python needed
    // aliases for `Estimate.points` and `WorkItemProperty.options` — both real API fields a
    // navigation property wanted to define over, and both belonging to families still on
    // the opt-out list here, so this will start biting as task 3 migrates them.
    const resource = instantiate(entry);

    expect(() => fullRowOf(resource)).not.toThrow();
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
