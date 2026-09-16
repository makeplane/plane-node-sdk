/**
 * Every query filter the API declares must be reachable from the SDK.
 *
 * The fifth rule sweep, and the one whose absence has cost real capability twice. The
 * generator emitted `FIELDS`/`ORDER_BY`/`EXPAND` and dropped every other query parameter
 * on the floor, so nothing anywhere compared a resource's params type against the filters
 * its operation offers:
 *
 * - the Node SDK shipped 37 classes without `findByDisplayName` on the property lists,
 *   because the stale golden lacked `display_name` and no sweep could notice a filter was
 *   missing;
 * - the Python SDK made the `roles` `?slug=` filter unreachable behind a `# type: ignore`,
 *   because the filter's name collided with the workspace `slug` path parameter. A human
 *   found that in late review.
 *
 * Both are one defect: a filter the API declares that the SDK does not expose. The rule is
 * therefore derived from the golden, never tabulated — `FILTERS` in `generated/constants.ts`
 * is the question, and a migrated method's own parameters are the answer.
 *
 * **Enumerated, not selected.** The swept set is {@link methodsOffering} over `FILTERS`,
 * which runs `migratedEntries()` × every public method × that method's own `operations`
 * key. A class cannot fall outside it by lacking a shape somebody looked for; it falls
 * outside only by being written down in `UNMIGRATED_RESOURCES`. Selecting instead of
 * enumerating is the single defect this migration has had to fix four separate times.
 *
 * Two ways a filter counts as exposed, because the SDK really does both:
 *
 * 1. a property of the method's params object (`ListStatesParams.group__in`) — the usual
 *    shape; or
 * 2. a positional parameter past the leading path ids (`Projects.summary(slug, project,
 *    counts)`), where the filter *is* the argument and a params object would be ceremony.
 *
 * Leading path ids are excluded from (2) on purpose. `Roles.list(slug, …)` opens with the
 * *workspace* slug while `roles_list` declares a `?slug=` filter meaning the *role's* slug;
 * counting the positional parameter would let that collision satisfy the rule while the
 * filter stayed unreachable — which is exactly the shape of the Python defect. The
 * collision is resolved by renaming (see {@link FILTER_ALIASES}), never by suppressing.
 */

import * as fs from "node:fs";
import { FILTERS } from "../../../src/api/v2/generated/constants";
import {
  CapableMethod,
  instantiate,
  leadingPathIdCount,
  methodsOffering,
  resourceEntries,
  templateFor,
} from "./tree-walk";

/**
 * A filter the SDK exposes under a different name from the golden's, with why.
 *
 * Keyed `<module>#<Class>.method`, then by the golden's own filter name. This is not an
 * opt-out —
 * the filter is still reachable, just spelled differently — so the assertions below are
 * strict in both directions: the alias must name a filter the operation really declares,
 * the new name must really be there, and the old name must really have been unusable.
 * Renaming a filter for taste is refused.
 */
interface FilterAlias {
  /** The property name the SDK actually offers. */
  readonly exposedAs: string;
  /** Why the golden's own name could not be used here. Must name {@link exposedAs}. */
  readonly why: string;
}

/**
 * The only place a filter may be spelled differently from the golden.
 *
 * Keyed `<module>#<Class>.method`, not by bare class name: `Comments` and `Links` each
 * name two different resources, so a name-keyed entry would silently apply to both. The
 * `byQualified` lookup below is built on the same key for the same reason — as a `Map` on
 * the ambiguous key, it kept only whichever of a colliding pair came last.
 *
 * - `Roles.list` / `Roles.iterate` — `roles_list` declares `?slug=`, the *role's* slug,
 *   while every method of the class opens with `slug`, the *workspace*. Two different
 *   things called `slug` in one call is a trap; dropping the filter is what the Python SDK
 *   did, and the filter stayed unreachable for a whole port.
 */
export const FILTER_ALIASES: Readonly<Record<string, Readonly<Record<string, FilterAlias>>>> = {
  "Roles#Roles.list": {
    slug: {
      exposedAs: "roleSlug",
      why: "the leading path id is already called `slug` and means the workspace, so the role's own slug filter is offered as `roleSlug`",
    },
  },
  "Roles#Roles.iterate": {
    slug: {
      exposedAs: "roleSlug",
      why: "the leading path id is already called `slug` and means the workspace, so the role's own slug filter is offered as `roleSlug`",
    },
  },
};

/**
 * Filters the SDK deliberately does not offer, keyed `<module>#<Class>.method.filter`,
 * each with why.
 *
 * **Empty, and meant to stay that way.** A filter is a capability the server already has;
 * not exposing one makes it unreachable from the SDK entirely, so an entry here needs a
 * reason the *server* supplies — not "nobody asked for it", not "the type is awkward". The
 * list is ratcheted below so it cannot quietly grow as task 3 writes ~47 more classes,
 * which is precisely the condition under which filters get dropped silently.
 */
export const UNEXPOSED_FILTERS: Readonly<Record<string, string>> = {};

/** How large {@link UNEXPOSED_FILTERS} is allowed to be. A ratchet: lower it, never raise it. */
export const UNEXPOSED_CEILING = 0;

/**
 * The swept set: **every** resource class, not just the migrated ones.
 *
 * The other sweeps run over `migratedEntries()` because they check where an option is
 * declared relative to the leading path ids, and a pre-flat class has none. A query filter
 * is a property of a params object either way, so nothing about this rule depends on the
 * call shape — and running it over the migrated set alone would have hidden `display_name`
 * on both work-item-property lists behind an opt-out list that is about shape, not
 * capability. Those two are exactly the classes the stale golden lost the filter on.
 */
const FILTERABLE = methodsOffering(FILTERS as unknown as Record<string, readonly string[]>, resourceEntries());

/** `display_name` -> `displayName`, the spelling a positional parameter would use. */
function camelCase(name: string): string {
  return name
    .split("_")
    .filter((part) => part.length > 0)
    .map((part, index) => (index === 0 ? part : part[0].toUpperCase() + part.slice(1)))
    .join("");
}

/**
 * The parameter names a method offers that are *not* one of its leading path ids.
 *
 * The exclusion is the point — see this file's own doc comment on `Roles.list`.
 */
function positionalOptions({ entry, method }: CapableMethod): Set<string> {
  const template = templateFor(instantiate(entry), method.name);
  const names = new Set<string>();
  for (const signature of method.signatures) {
    for (const name of signature.slice(leadingPathIdCount(template, signature))) names.add(name);
  }
  return names;
}

/** How `capable` offers `filter`, or `undefined` if it does not offer it at all. */
function exposureOf(capable: CapableMethod, filter: string): "params" | "positional" | undefined {
  const alias = FILTER_ALIASES[`${capable.entry.key}.${capable.method.name}`]?.[filter];
  const wanted = alias?.exposedAs ?? filter;
  if (capable.method.optionProperties.has(wanted)) return "params";
  const positional = positionalOptions(capable);
  if (positional.has(wanted) || positional.has(camelCase(wanted))) return "positional";
  return undefined;
}

/** Every JSDoc block in a file, as text — where an alias has to explain itself to a reader. */
function docComments(file: string): string[] {
  return [...fs.readFileSync(file, "utf8").matchAll(/\/\*\*[\s\S]*?\*\//g)].map((match) => match[0]);
}

describe("filters coverage", () => {
  it("finds methods to check at all", () => {
    // A floor, not a pin: if the enumeration or the `operations` lookup breaks, the sweeps
    // below pass by checking nothing. Every class is migrated now, so it moves only when
    // the golden itself grows.
    expect(FILTERABLE.length).toBeGreaterThanOrEqual(120);
  });

  it("exposes every filter the golden declares for the method's own operation", () => {
    const missing: string[] = [];
    for (const capable of FILTERABLE) {
      const { entry, method, operationId, values } = capable;
      for (const filter of values) {
        if (`${entry.key}.${method.name}.${filter}` in UNEXPOSED_FILTERS) continue;
        if (exposureOf(capable, filter) !== undefined) continue;
        missing.push(`${entry.name}.${method.name}() — ${operationId} declares ?${filter}=, unreachable from the SDK`);
      }
    }

    expect(missing.sort()).toEqual([]);
  });

  it("keeps every rename real, necessary, and explained where a reader will see it", () => {
    // Four ways a `FILTER_ALIASES` entry can be wrong, all of them failures:
    //
    //   unknownMethod   — names a method no operation-declared filter reaches, so it
    //                     describes nothing;
    //   unknownFilter   — names a filter that operation does not declare;
    //   gratuitous      — the golden's own name was usable here, so the rename is taste,
    //                     not necessity, and the SDK should just spell it the golden's way;
    //   absent          — the name it claims to expose is not actually on the params type,
    //                     which is the entry silently *becoming* a suppression.
    //
    // `absent` is why removing the `roleSlug` property fails even with the entry left in
    // place, and the sweep above is why removing the entry fails even with `roleSlug` left
    // in place. Neither half stands on its own.
    const byQualified = new Map(FILTERABLE.map((capable) => [`${capable.entry.key}.${capable.method.name}`, capable]));
    const unknownMethod: string[] = [];
    const unknownFilter: string[] = [];
    const gratuitous: string[] = [];
    const absent: string[] = [];
    const unexplained: string[] = [];

    for (const [qualified, aliases] of Object.entries(FILTER_ALIASES)) {
      const capable = byQualified.get(qualified);
      if (capable === undefined) {
        unknownMethod.push(qualified);
        continue;
      }
      for (const [filter, alias] of Object.entries(aliases)) {
        if (!capable.values.includes(filter)) {
          unknownFilter.push(`${qualified}.${filter}`);
          continue;
        }
        // The rename is only allowed where the golden's own name is already taken by a
        // leading path id of this very method — `Roles.list(slug, …)` against `?slug=`.
        const template = templateFor(instantiate(capable.entry), capable.method.name);
        const collides = capable.method.signatures.some((signature) =>
          signature.slice(0, leadingPathIdCount(template, signature)).includes(filter)
        );
        if (!collides) gratuitous.push(`${qualified}.${filter}`);
        if (!capable.method.optionProperties.has(alias.exposedAs)) absent.push(`${qualified}.${alias.exposedAs}`);
        // Self-documenting, in both places a reader looks: the reason names the new
        // spelling, and the class's own source explains it in a doc comment.
        const documented =
          alias.why.includes(alias.exposedAs) &&
          docComments(capable.entry.file).some((comment) => comment.includes(alias.exposedAs));
        if (!documented) unexplained.push(`${qualified}.${alias.exposedAs}`);
      }
    }

    expect({ unknownMethod, unknownFilter, gratuitous, absent, unexplained }).toEqual({
      unknownMethod: [],
      unknownFilter: [],
      gratuitous: [],
      absent: [],
      unexplained: [],
    });
  });

  it("keeps every recorded omission real, still unexposed, and shrinking", () => {
    const declared = new Set(
      FILTERABLE.flatMap(({ entry, method, values }) => values.map((filter) => `${entry.key}.${method.name}.${filter}`))
    );
    const named = Object.keys(UNEXPOSED_FILTERS).sort();

    expect({
      // An entry naming something the golden never declared here describes nothing.
      unknown: named.filter((qualified) => !declared.has(qualified)),
      // An entry for a filter that *is* exposed reads as a gap that was never closed.
      exposed: named.filter((qualified) => {
        const capable = FILTERABLE.find(({ entry, method }) => qualified.startsWith(`${entry.key}.${method.name}.`));
        if (capable === undefined) return false;
        return (
          exposureOf(capable, qualified.slice(`${capable.entry.key}.${capable.method.name}.`.length)) !== undefined
        );
      }),
      // Every entry states why. A blank reason is not a reason.
      unreasoned: named.filter((qualified) => UNEXPOSED_FILTERS[qualified].trim().length === 0),
    }).toEqual({ unknown: [], exposed: [], unreasoned: [] });

    // The ratchet. Lower `UNEXPOSED_CEILING` as these are closed; never raise it.
    expect(named.length).toBeLessThanOrEqual(UNEXPOSED_CEILING);
  });
});
