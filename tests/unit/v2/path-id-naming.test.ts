/**
 * The flat path shape and the path-id naming rule, enforced rather than left to be
 * inferred — plus the guards that keep the enumeration behind every sweep honest.
 *
 * Two rules:
 *
 * 1. **Shape** — a method opens with exactly the ids its own URL template names, in path
 *    order (its `extraPaths` override where it has one, else the class `path` — the same
 *    choice `urlFor` makes at call time).
 * 2. **Naming** — each of those ids is named after the resource it identifies, singular,
 *    with no `Id` suffix, the method's own primary key included: `retrieve(slug, project,
 *    state)`, never `stateId`. The URL *templates* keep the golden's own keys
 *    (`{project_id}`, `{work_item_id}`), and so do model fields and query filters; this
 *    is about parameters only.
 *
 * The naming rule is mechanical, not cosmetic: `owned()` matches a child method's leading
 * parameter names against the parent row's `idNames` before prepending anything, so a
 * resource that suffixes its own pk breaks navigation from its parent the day it gains
 * one.
 *
 * **The check is scoped to path ids, not to every `Id`-suffixed parameter.** A request
 * *body* field that happens to end in `Id` — `Cycles.transfer`'s destination, which the
 * golden sends as `new_cycle_id` — is not a path id, is never compared by `owned()`, and
 * is outside the rule. Python's first version flagged those too and forced renames the
 * rule does not ask for.
 */

import {
  ResourceEntry,
  UNMIGRATED_CEILING,
  UNMIGRATED_RESOURCES,
  expectedLeadingPathIds,
  exportedResourceClasses,
  extraPathsOf,
  instantiate,
  migratedEntries,
  pathOf,
  publicMethods,
  reachableResources,
  resourceEntries,
  templateFor,
  templateKeys,
} from "./tree-walk";

const MIGRATED = migratedEntries();

/** `cycles` -> `cycle`, `properties` -> `property`, `me` -> `me`. Crude on purpose: it only has to cover the collection segments api_v2 actually uses. */
function singular(segment: string): string {
  if (segment.endsWith("ies")) return `${segment.slice(0, -3)}y`;
  if (/(sses|shes|ches)$/.test(segment)) return segment.slice(0, -2);
  return segment.endsWith("s") ? segment.slice(0, -1) : segment;
}

/** `work_item_id` / `work-item` -> `workItem`. */
function camel(snakeOrKebab: string): string {
  return snakeOrKebab
    .split(/[-_]/)
    .filter((part) => part.length > 0)
    .map((part, index) => (index === 0 ? part : part[0].toUpperCase() + part.slice(1)))
    .join("");
}

/**
 * The parameter names that would carry a path id for a resource on these templates.
 *
 * Two sources, both read off the URL templates the class declares (`path` plus every
 * `extraPaths` override):
 *
 * - every `{...}` placeholder — the ancestors' ids, `{slug}`, `{project_id}`;
 * - the resource's own primary key, which never appears as a placeholder in its own
 *   template (the kernel appends it to the collection URL), derived instead from the
 *   trailing literal segment: `.../cycles/` -> `cycle`. Both the whole segment and its
 *   last hyphenated word count, so `.../work-item-types/` admits `workItemType` and
 *   `type`.
 */
export function pathIdNamesFor(templates: readonly string[]): Set<string> {
  const names = new Set<string>();
  for (const template of templates) {
    for (const key of templateKeys(template)) {
      names.add(key);
      names.add(camel(key));
      names.add(camel(key.endsWith("_id") ? key.slice(0, -"_id".length) : key));
    }
    const literals = template.split("/").filter((part) => part.length > 0 && !part.includes("{"));
    if (literals.length > 0) {
      const words = literals[literals.length - 1].split("-");
      names.add(singular(camel(words.join("-"))));
      names.add(singular(words[words.length - 1]));
    }
  }
  return names;
}

function templatesOf(entry: ResourceEntry): string[] {
  const resource = instantiate(entry);
  return [pathOf(resource), ...Object.values(extraPathsOf(resource))];
}

/** Every parameter on the class that carries a path id under an `Id`-suffixed name. */
export function pathIdOffenders(entry: ResourceEntry): string[] {
  const known = pathIdNamesFor(templatesOf(entry));
  const offenders: string[] = [];
  for (const method of publicMethods(entry)) {
    for (const parameter of method.parameterNames) {
      const stem = /Id$/.test(parameter)
        ? parameter.slice(0, -2)
        : parameter.endsWith("_id")
          ? parameter.slice(0, -3)
          : undefined;
      if (stem === undefined) continue;
      if (known.has(parameter) || known.has(stem)) offenders.push(`${entry.name}.${method.name}(${parameter})`);
    }
  }
  return offenders;
}

/** Methods whose leading parameters are not the ids their own template names, in order. */
export function shapeOffenders(entry: ResourceEntry): string[] {
  const resource = instantiate(entry);
  const offenders: string[] = [];
  for (const method of publicMethods(entry)) {
    const expected = expectedLeadingPathIds(templateFor(resource, method.name));
    const leading = method.parameterNames.slice(0, expected.length);
    if (leading.join(",") !== expected.join(",")) {
      offenders.push(
        `${entry.name}.${method.name}(${method.parameterNames.join(", ")}) — expected to open [${expected.join(", ")}]`
      );
    }
  }
  return offenders;
}

/** True when every public method already opens with the ids its own template names. */
function isFlatShaped(entry: ResourceEntry): boolean {
  // A template with no placeholders makes the shape rule vacuous, so it is no evidence of
  // migration either way — `/users/me/` would otherwise look migrated the day it was written.
  if (templateKeys(pathOf(instantiate(entry))).length === 0) return false;
  return publicMethods(entry).length > 0 && shapeOffenders(entry).length === 0;
}

describe("the enumeration every sweep runs over", () => {
  it("is not empty or tiny", () => {
    // A floor, not a pin: if the enumeration breaks, every sweep built on it passes
    // vacuously, which is the failure mode this derivation exists to prevent.
    expect(resourceEntries().length).toBeGreaterThanOrEqual(80);
  });

  it("covers every class that is not explicitly opted out", () => {
    // The inversion, asserted: inclusion is the default. Anything outside the sweep is
    // outside it because somebody wrote its name down, not because it happens to lack a
    // `list` or happens not to be wired yet.
    const unswept = new Set(resourceEntries().map((entry) => entry.key));
    for (const entry of MIGRATED) unswept.delete(entry.key);

    expect([...unswept].sort()).toEqual([...UNMIGRATED_RESOURCES].sort());
  });

  it("names only real classes in the opt-out list", () => {
    const known = new Set(resourceEntries().map((entry) => entry.key));

    expect([...UNMIGRATED_RESOURCES].filter((key) => !known.has(key)).sort()).toEqual([]);
  });

  it("keeps the opt-out list shrinking", () => {
    // The ratchet. Lower `UNMIGRATED_CEILING` as tasks 2 and 3 migrate families; never
    // raise it. At 0 the list is gone and every class is swept by every rule.
    expect(UNMIGRATED_RESOURCES.size).toBeLessThanOrEqual(UNMIGRATED_CEILING);
  });

  it("does not let an already-migrated class stay opted out", () => {
    // The guard that makes the list shrink on its own: a class whose public methods
    // already open with every path id its template names has been migrated, and leaving
    // it opted out would hide it from every rule.
    const stale = [...UNMIGRATED_RESOURCES]
      .map((key) => resourceEntries().find((entry) => entry.key === key))
      .filter((entry): entry is ResourceEntry => entry !== undefined && isFlatShaped(entry))
      .map((entry) => entry.key)
      .sort();

    expect(stale).toEqual([]);
  });

  it("agrees with what the public barrel exports", () => {
    // Source/module derivation against the barrel: a class declared but not exported is
    // unreachable to a consumer, and an export that is not a declared class cannot exist.
    // The comparison is symmetric, so either direction fails.
    const declared = new Set(resourceEntries().map((entry) => entry.cls as unknown));
    const exported = exportedResourceClasses();
    const nameOf = (cls: unknown): string => (cls as { name: string }).name;

    expect({
      unexported: [...declared]
        .filter((cls) => !exported.has(cls))
        .map(nameOf)
        .sort(),
      undeclared: [...exported]
        .filter((cls) => !declared.has(cls))
        .map(nameOf)
        .sort(),
    }).toEqual({ unexported: [], undeclared: [] });
  });

  it("agrees with what the constructed tree reaches", () => {
    // And against the live tree: a resource nobody can reach from `client.v2` is dead
    // code, whichever half of the migration it currently sits in.
    const reachable = reachableResources();
    const unreachable = resourceEntries()
      .filter((entry) => !reachable.has(entry.cls))
      .map((entry) => entry.key)
      .sort();

    expect(unreachable).toEqual([]);
  });
});

describe.each(MIGRATED.map((entry) => [entry.key, entry] as const))("%s", (_key, entry) => {
  it("opens every method with the path ids its own template names, in path order", () => {
    expect(shapeOffenders(entry)).toEqual([]);
  });

  it("names no path id with an `Id` suffix", () => {
    expect(pathIdOffenders(entry)).toEqual([]);
  });
});

describe("the rule's own edge", () => {
  it("recognises a resource's own primary key and ignores a body field that merely ends in Id", () => {
    const known = pathIdNamesFor(["/workspaces/{slug}/projects/{project_id}/cycles/"]);

    // The ancestors' ids and the resource's own pk are path ids...
    expect(known.has("slug")).toBe(true);
    expect(known.has("project")).toBe(true);
    expect(known.has("cycle")).toBe(true);
    // ...and `destinationCycleId`'s stem is not, so the rule never asks for its rename.
    expect(known.has("destinationCycle")).toBe(false);
  });
});
