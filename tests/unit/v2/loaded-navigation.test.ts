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

import * as fs from "node:fs";
import * as path from "node:path";
import * as ts from "typescript";
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
 *
 * Keyed `<module>#<Class>`, not by bare class name — `Comments` and `Links` each name two
 * different resources, and a name-keyed entry would apply to both of a pair.
 */
export const NAVIGATION_ALIASES: Readonly<Record<string, Record<string, string>>> = {
  "Estimates/index#Estimates": { points: "estimatePoints" },
  "WorkItemProperties/index#WorkItemProperties": { options: "propertyOptions" },
  "WorkspaceWorkItemProperties/index#WorkspaceWorkItemProperties": { options: "propertyOptions" },
};

/**
 * Children whose method set is only *partly* bindable into the parent's ids, with why.
 *
 * Keyed `ParentClass.attribute`. One shape needs this and only one: a **catalog sibling**
 * — a resource whose CRUD is workspace-scoped (`/workspaces/{slug}/releases/labels/`, one
 * id) while its membership bridge hangs off the parent row
 * (`/workspaces/{slug}/releases/{release_id}/labels/`, two). Both belong to the same class
 * because they are the same catalog; the parent row can bind the bridge and cannot bind the
 * CRUD.
 *
 * **This is not a hole.** The unbindable methods are unreachable from the owned view *in
 * the type system already*: `Owned<TResource, TIds>` maps a method whose parameters do not
 * open with the bound tuple to `never`, so `release.labels.list()` does not type-check, and
 * at runtime `assertLeadingParameters` throws naming the method rather than building a URL
 * with the release id where the slug belongs. Reach the catalog flat —
 * `v2.workspaces.releases.labels.list(slug)`.
 *
 * The guards below refuse the two ways this could rot. An entry whose child is *fully*
 * bindable is unnecessary. An entry whose child has *no* bindable method at all is worse
 * than unnecessary: the attachment is not a per-row child in the first place, and the fix
 * is to move it to the scope it belongs to, not to exempt it. That is exactly what
 * `ReleaseTags` turned out to be — a workspace-level catalog a release merely points at
 * through its own `tag_id` — so it hangs off `Workspaces` as `releaseTags` rather than off
 * `Releases`. The Python SDK shipped it the other way first and had a `release.tags`
 * property whose every call raised, kept alive only to satisfy its own navigation sweep;
 * that is the mistake this ratchet exists to make impossible.
 */
export const CATALOG_SIBLINGS: Readonly<Record<string, string>> = {
  "Releases/index#Releases.labels":
    "`ReleaseLabels` is one class holding two routes: the workspace-level label catalog " +
    "(`/releases/labels/`, binds `slug` alone) and the per-release bridge " +
    "(`/releases/{release_id}/labels/`, binds both). A fetched release binds the bridge; " +
    "the catalog is reached flat as `v2.workspaces.releases.labels.list(slug)`",
  "Initiatives/index#Initiatives.labels":
    "`InitiativeLabels` has the identical two-route shape as `Releases.labels` — a " +
    "workspace-level catalog at `/initiatives/labels/` plus a per-initiative bridge at " +
    "`/initiatives/{initiative_id}/labels/` — and the same split applies",
};

const NAVIGABLE = navigableEntries();

/**
 * Every (parent, child, grandchild) triple the grandchild-refusal assertion visited.
 *
 * A module-level accumulator, checked in the last block: the assertion runs inside
 * `describe.each`, so without this a tree that suddenly had no two-level nesting at all
 * would pass every per-entry run by finding nothing to check.
 */
const grandchildTriples: string[] = [];

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
 * **Two sources and every operation.** `FIELDS` is what the row carries by default, and
 * `EXPAND` is what `?expand=` adds to it under the relation's own name — and the expand names are where
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
  // **Every** operation, not `retrieve`/`list`. A field that only a `create`, `upsert` or
  // custom-action response carries is still a field a navigation property can define over,
  // and it is exactly the kind that gets missed: `Webhooks.create`'s `secret_key` is in
  // `FIELDS.webhooks_create` and in no list or retrieve operation at all. A two-operation
  // version of this row passes CI while the first call to the third operation throws in
  // the consumer's hands. Enumerating the `operations` map costs nothing and cannot be
  // narrower than the class itself is.
  for (const operationId of Object.values(operations)) {
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
    // passes by checking nothing. Nineteen families own children and are navigable; the
    // number moves only when a family gains or loses one.
    expect(NAVIGABLE.length).toBeGreaterThanOrEqual(19);
  });

  it("names a real attachment in every catalog-sibling exemption", () => {
    // The fourth guard, and the one that has to live outside the per-entry block: an entry
    // for `Parent.attribute` where no such attachment exists describes nothing.
    const attachments = new Set(
      migratedEntries().flatMap((candidate) =>
        [...childResources(instantiate(candidate)).keys()].map((attribute) => `${candidate.key}.${attribute}`)
      )
    );

    expect(
      Object.keys(CATALOG_SIBLINGS)
        .filter((qualified) => !attachments.has(qualified))
        .sort()
    ).toEqual([]);
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
    const aliases = NAVIGATION_ALIASES[entry.key] ?? {};
    const expected = [...migratedChildren(resource).keys()].map((name) => aliases[name] ?? name).sort();

    expect(navigationProperties(rowOf(resource))).toEqual(expected);
  });

  it("wraps its own child behind each property, as an owned view rather than the bare resource", () => {
    const resource = instantiate(entry);
    const aliases = NAVIGATION_ALIASES[entry.key] ?? {};
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
      if (`${entry.key}.${attribute}` in CATALOG_SIBLINGS) continue;
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

  it("keeps every catalog-sibling exemption real, necessary, and still a per-row child", () => {
    // Three ways a `CATALOG_SIBLINGS` entry can be wrong — see that map's own doc comment.
    const resource = instantiate(entry);
    const idNames = idNamesOf(resource);
    const children = migratedChildren(resource);
    const fullyBindable: string[] = [];
    const notAChildAtAll: string[] = [];
    const unreasoned: string[] = [];

    for (const [attribute, child] of children) {
      const qualified = `${entry.key}.${attribute}`;
      if (!(qualified in CATALOG_SIBLINGS)) continue;
      const childEntry = entryOf(child);
      if (childEntry === undefined) continue;
      const methods = publicMethods(childEntry);
      const bindable = methods.filter((method) =>
        method.signatures.every((signature) => signature.slice(0, idNames.length).join(",") === idNames.join(","))
      );
      if (bindable.length === methods.length) fullyBindable.push(qualified);
      if (bindable.length === 0) notAChildAtAll.push(qualified);
      if (CATALOG_SIBLINGS[qualified].trim().length === 0) unreasoned.push(qualified);
    }

    expect({ fullyBindable, notAChildAtAll, unreasoned }).toEqual({
      fullyBindable: [],
      notAChildAtAll: [],
      unreasoned: [],
    });
  });

  it("gives no navigation property a name one of the row's own fields already uses", () => {
    // The collision `NAVIGATION_ALIASES` exists to prevent, made visible. Python needed
    // aliases for `Estimate.points` and `WorkItemProperty.options` — both real API fields a
    // navigation property wanted to define over, and both belonging to families still on
    // the opt-out list here, so this will start biting as task 3 migrates them.
    const resource = instantiate(entry);

    expect(() => fullRowOf(resource)).not.toThrow();
  });

  it("refuses a grandchild reached through the view, naming both routes it could take", () => {
    // The Python SDK's `Owned.__getattr__` answered a *sub-resource* here — unbound, with
    // the ids the row already held silently dropped — so `project.estimates.points` meant
    // one thing at three arguments and another at one. Node's `Owned` is a mapped type
    // that drops every non-callable member, so the expression does not type-check and the
    // view has no such property; what it used to hand a JavaScript consumer was
    // `undefined`, and then `Cannot read properties of undefined (reading 'list')` one
    // frame away from the cause.
    //
    // Enumerated, not sampled: every (parent, child, grandchild) triple the tree actually
    // has. The floor below is what stops this passing by finding no triples at all.
    const resource = instantiate(entry);
    const aliases = NAVIGATION_ALIASES[entry.key] ?? {};
    const row = rowOf(resource);
    const triples: string[] = [];
    const offenders: string[] = [];

    for (const [attribute, child] of migratedChildren(resource)) {
      const view = row[aliases[attribute] ?? attribute] as Record<string, unknown>;
      for (const [grandchild] of childResources(child)) {
        triples.push(`${entry.name}.${attribute}.${grandchild}`);
        // Still absent from the view's own keys, so `Object.keys`/spread are unchanged.
        if (Object.keys(view).includes(grandchild)) {
          offenders.push(`${entry.name}.${attribute}.${grandchild} is an enumerable key of the owned view`);
          continue;
        }
        let thrown: unknown;
        let returned: unknown;
        try {
          returned = view[grandchild];
        } catch (error) {
          thrown = error;
        }
        if (!(thrown instanceof TypeError)) {
          // Naming *what* came back is the difference between the two ways this rots:
          // `undefined` is the refusal simply missing, and a `V2Resource` is the Python
          // defect — a sub-resource handed back unbound, working at one arity by accident.
          const answered =
            thrown !== undefined
              ? `threw ${String(thrown)}`
              : `answered ${returned === undefined ? "undefined" : (returned as object).constructor.name}`;
          offenders.push(
            `${entry.name}.${attribute}.${grandchild} ${answered} instead of refusing: an owned view ` +
              `cannot bind a grandchild, which needs an id only its own parent row carries`
          );
          continue;
        }
        // The message has to name the way *out*, not just the way in.
        const message = thrown.message;
        if (!message.includes(child.constructor.name) || !message.includes(grandchild)) {
          offenders.push(`${entry.name}.${attribute}.${grandchild} refused without naming itself: ${message}`);
        }
      }
    }

    expect(offenders).toEqual([]);
    // Recorded so the floor below can see how many triples this entry contributed.
    grandchildTriples.push(...triples);
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

describe("grandchildren, in aggregate", () => {
  it("found two-level nesting to refuse at all", () => {
    // The floor for the per-entry assertion above. `Projects` alone contributes
    // `workItems.comments`, `estimates.points`, `cycles.workItems` and more.
    expect(grandchildTriples.length).toBeGreaterThanOrEqual(20);
  });
});

/**
 * The narrowing limitation has to be readable where a caller meets it.
 *
 * `Owned` is a mapped type, so every navigated method is a *synthesized* symbol with no
 * declaration for a doc comment to attach to: hovering `project.states.list` shows a bare
 * signature, and the limitation documented on `Owned` itself and in the README is invisible
 * there. TypeScript offers no way to change that short of restating all 520 signatures by
 * hand. The nearest declaration it *does* carry documentation for is the navigation
 * property — `readonly states: Owned<States, ProjectIds>` — which a reader passes through
 * one hop before the call, so the note goes there, on every one of them.
 */
describe("navigation property documentation", () => {
  const NAVIGATION_DIR = path.join(__dirname, "../../../src/api/v2/loaded");

  interface NavigationProperty {
    readonly file: string;
    readonly interfaceName: string;
    readonly property: string;
    readonly documentation: string;
  }

  const PROPERTIES: NavigationProperty[] = fs
    .readdirSync(NAVIGATION_DIR)
    .filter((name) => name.endsWith(".ts"))
    .flatMap((name) => {
      const file = path.join(NAVIGATION_DIR, name);
      const text = fs.readFileSync(file, "utf8");
      const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
      const found: NavigationProperty[] = [];
      for (const statement of source.statements) {
        if (!ts.isInterfaceDeclaration(statement) || !statement.name.text.endsWith("Navigation")) continue;
        for (const member of statement.members) {
          if (!ts.isPropertySignature(member) || !ts.isIdentifier(member.name)) continue;
          if (member.type === undefined || !ts.isTypeReferenceNode(member.type)) continue;
          if (!ts.isIdentifier(member.type.typeName) || member.type.typeName.text !== "Owned") continue;
          found.push({
            file: name,
            interfaceName: statement.name.text,
            property: member.name.text,
            documentation: text.slice(member.pos, member.getStart(source)),
          });
        }
      }
      return found;
    });

  it("finds navigation properties to check at all", () => {
    // A floor, not a pin: 82 across 19 navigable families today.
    expect(PROPERTIES.length).toBeGreaterThanOrEqual(80);
  });

  it("says on every one of them that a navigated call does not narrow", () => {
    const silent = PROPERTIES.filter(
      (property) => !property.documentation.includes("does **not** narrow the return type")
    )
      .map(
        (property) =>
          `${property.file}#${property.interfaceName}.${property.property} carries no note that a navigated ` +
          `call accepts \`fields\` without narrowing — and the hover on the call itself cannot carry one, ` +
          `because \`Owned\` is a mapped type`
      )
      .sort();

    expect(silent).toEqual([]);
  });
});
