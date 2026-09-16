/**
 * The pagination envelope must be reachable, both halves of it.
 *
 * The seventh rule sweep, and the last query axis to get one. `FIELDS`, `EXPAND`,
 * `ORDER_BY` and `FILTERS` each had a sweep; the five pagination parameters had only an
 * *exclusion* — `NON_FILTER_QUERY_PARAMETERS` in the generator kept them out of `FILTERS`
 * and handed them to nothing. That is a hole rather than a decision, and it is one the
 * Python SDK fell all the way through: the same five names were reserved by its generator,
 * implemented on none of its 68 list methods, and the workspace audit-log resource shipped
 * uncallable because the server refuses the offset envelope there and no caller could ask
 * for the other one. The generator now emits `PAGINATION`, so the question can be asked.
 *
 * Two rules, and the second is the one a golden alone cannot state:
 *
 * 1. **Every declared parameter is reachable.** A method whose operation declares
 *    `offset`/`per_page`/`paginate`/`count` must offer it. Missing `paginate` means the
 *    keyset envelope — and every route that only supports it — is unreachable; missing
 *    `count` means a caller cannot turn off the count query the way `doFindOne` does
 *    internally.
 * 2. **`paginate` obliges `cursor`.** The golden declares `cursor` nowhere: it documents
 *    the four parameters the server validates and leaves the cursor opaque. But a method
 *    that lets a caller opt into `paginate: "cursor"` hands back a `next_cursor` in the
 *    envelope, and without a `cursor` parameter to send it back that value is a dead end —
 *    the only consumer of a cursor would be the SDK's own `iterate` loop. So the
 *    requirement is *derived* from `paginate` rather than read off the golden, which is
 *    why it is stated here rather than in `generated/constants.ts`.
 *
 * **Enumerated over every resource class**, like the `filters` and `order_by` sweeps and
 * for the same reason: a pagination parameter is a property of a params object, so nothing
 * about the rule depends on the call shape.
 *
 * `iterate` is deliberately *not* held to rule 1 for `offset`/`count`. It owns the paging
 * loop — it sets `offset`/`cursor` itself as it walks, and `count` shapes an envelope the
 * caller never sees — so those two are removed from its params type rather than accepted
 * and ignored. {@link ITERATOR_OWNED} names them, and the sweep checks that removal from
 * both ends: an iterator that still accepts one fails, and so does a `list` that has lost
 * one.
 */

import { PAGINATION } from "../../../src/api/v2/generated/constants";
import { ACTION_ALIASES, CapableMethod, methodsOffering, resourceEntries } from "./tree-walk";

/**
 * Pagination parameters the iterator sets for itself, so its params type must not accept
 * them from a caller.
 *
 * `offset` is what the loop advances; `count` asks for a `total_count` on an envelope
 * `iterate` unwraps and throws away. Both were reachable and dead — the caller could pass
 * either and neither did anything, which is worse than not offering it: it reads as a
 * knob. Python's `iterate` omits the same two.
 *
 * `per_page` stays: it is the caller's page size, and a bigger page is fewer round trips.
 * `paginate` stays: it chooses which envelope the loop follows, and on a route that only
 * serves keyset it is the difference between working and a 400. `cursor` stays: it is a
 * resume point, so `iterate(…, { cursor })` continues from where a previous walk stopped.
 */
export const ITERATOR_OWNED: ReadonlySet<string> = new Set(["offset", "count"]);

/**
 * Methods that deliberately do not offer a pagination parameter their operation declares,
 * keyed `<module>#<Class>.method.parameter`, each with why.
 *
 * **Empty, and ratcheted at zero.** Every entry would make half an envelope unreachable,
 * and the reason has to come from the server — a route that rejects the parameter — never
 * "the type is awkward" or "nobody pages this". Keys are qualified by module because
 * `Comments` and `Links` each name two different resources.
 */
export const UNPAGINATED: Readonly<Record<string, string>> = {};

/** How large {@link UNPAGINATED} is allowed to be. A ratchet: lower it, never raise it. */
export const UNPAGINATED_CEILING = 0;

const PAGEABLE = methodsOffering(PAGINATION as unknown as Record<string, readonly string[]>, resourceEntries());

/** `<module>#<Class>.method` — qualified, because two modules each declare a `Comments`. */
function qualify({ entry, method }: CapableMethod): string {
  return `${entry.key}.${method.name}`;
}

/** Whether this method is the paging loop rather than a single page. */
function isIterator(capable: CapableMethod): boolean {
  return ACTION_ALIASES[capable.method.name] === "list";
}

describe("pagination coverage", () => {
  it("finds methods to check at all", () => {
    // A floor, not a pin: if the enumeration or the `operations` lookup breaks, every
    // sweep below passes by checking nothing. 68 operations page, reached by a `list` and
    // an `iterate` each on most classes.
    expect(PAGEABLE.length).toBeGreaterThanOrEqual(120);
  });

  it("finds both a list and an iterate among them", () => {
    // The second floor: rule 1 and the `ITERATOR_OWNED` rule check different method kinds,
    // and either would pass vacuously if its kind vanished from the swept set.
    expect(PAGEABLE.filter((capable) => !isIterator(capable)).length).toBeGreaterThanOrEqual(60);
    expect(PAGEABLE.filter(isIterator).length).toBeGreaterThanOrEqual(55);
  });

  it("exposes every pagination parameter the golden declares for the method's own operation", () => {
    const missing: string[] = [];
    for (const capable of PAGEABLE) {
      for (const parameter of capable.values) {
        if (isIterator(capable) && ITERATOR_OWNED.has(parameter)) continue;
        if (`${qualify(capable)}.${parameter}` in UNPAGINATED) continue;
        if (capable.method.optionProperties.has(parameter)) continue;
        missing.push(
          `${qualify(capable)}() — ${capable.operationId} declares ?${parameter}=, unreachable from the SDK`
        );
      }
    }

    expect(missing.sort()).toEqual([]);
  });

  it("offers a `cursor` wherever it offers `paginate`", () => {
    // The rule the golden cannot state — see this file's own doc comment. A caller who can
    // ask for the keyset envelope and cannot spend the `next_cursor` it answers with has
    // been handed a dead end.
    const stranded = PAGEABLE.filter(
      (capable) => capable.method.optionProperties.has("paginate") && !capable.method.optionProperties.has("cursor")
    )
      .map(
        (capable) =>
          `${qualify(capable)}() offers ?paginate=cursor but no ?cursor=, so the next_cursor it ` +
          `answers with cannot be sent back`
      )
      .sort();

    expect(stranded).toEqual([]);
  });

  it("keeps the iterator's own knobs off the iterator and on the single-page read", () => {
    // Both directions. An `iterate` that still accepts `offset`/`count` advertises a knob
    // the paging loop overrides; a `list` that has lost one has lost a real capability.
    const acceptedByIterator: string[] = [];
    const missingFromList: string[] = [];

    for (const capable of PAGEABLE) {
      for (const parameter of ITERATOR_OWNED) {
        if (!capable.values.includes(parameter)) continue;
        const offered = capable.method.optionProperties.has(parameter);
        if (isIterator(capable) && offered) acceptedByIterator.push(`${qualify(capable)}.${parameter}`);
        if (!isIterator(capable) && !offered && !(`${qualify(capable)}.${parameter}` in UNPAGINATED)) {
          missingFromList.push(`${qualify(capable)}.${parameter}`);
        }
      }
    }

    expect({ acceptedByIterator: acceptedByIterator.sort(), missingFromList: missingFromList.sort() }).toEqual({
      acceptedByIterator: [],
      missingFromList: [],
    });
  });

  it("keeps every recorded omission real, still unexposed, and shrinking", () => {
    const declared = new Set(
      PAGEABLE.flatMap((capable) => capable.values.map((parameter) => `${qualify(capable)}.${parameter}`))
    );
    const named = Object.keys(UNPAGINATED).sort();

    expect({
      // An entry naming something the golden never declared here describes nothing.
      unknown: named.filter((key) => !declared.has(key)),
      // An entry for a parameter that *is* offered reads as a gap that was never closed.
      exposed: named.filter((key) => {
        const capable = PAGEABLE.find((candidate) => key.startsWith(`${qualify(candidate)}.`));
        if (capable === undefined) return false;
        return capable.method.optionProperties.has(key.slice(`${qualify(capable)}.`.length));
      }),
      // Every entry states why. A blank reason is not a reason.
      unreasoned: named.filter((key) => UNPAGINATED[key].trim().length === 0),
    }).toEqual({ unknown: [], exposed: [], unreasoned: [] });

    expect(named.length).toBeLessThanOrEqual(UNPAGINATED_CEILING);
  });
});
