/**
 * `?order_by=` must be reachable wherever the API offers it, and must admit exactly the
 * values the API offers there.
 *
 * The sixth rule sweep, and the last of the four query axes to get one. `FIELDS`,
 * `EXPAND` and `FILTERS` were all swept before this file existed; `ORDER_BY` sat in
 * `generated/constants.ts` with a kernel validator (`encodeOrderBy`) that fails closed at
 * *runtime* and nothing at all comparing a params type against it. That is the identical
 * gap shape the other three had: an operation declares a capability, no method offers it,
 * and every test stays green because nothing anywhere asks the question.
 *
 * Added before task 3's families rather than after, deliberately. The `fields` sweep found
 * three missing options in the 37 classes written before it existed, the `filters` sweep
 * found three more; a sweep written after a batch flags dozens at once instead of
 * preventing them, and this migration has relearned that four separate times.
 *
 * **Enumerated over every resource class, not just the migrated ones** — the same scoping
 * `filters-coverage.test.ts` uses, for the same reason and with the same justification.
 * `order_by` is a property of a params object whether or not the class has moved to the
 * flat call shape: it is never a positional parameter, it is never compared against the
 * leading path ids, and nothing about the rule depends on where the ids live. The
 * migrated-only version of the filters sweep passed while two property lists were broken,
 * because the opt-out list is about *shape* and a missing option is about *capability*.
 * Scoping this one the same way costs nothing and closes the same hole. (Contrast
 * `fields`/`expand`, which are checked partly by *where* they are declared relative to the
 * path ids, and genuinely cannot run over a pre-flat class.)
 *
 * Two rules, because presence alone is not enough here:
 *
 * 1. **Reachable** — a method whose operation declares `order_by` must offer an `order_by`
 *    option. Without it the caller cannot sort at all.
 * 2. **Correctly typed** — the option's type must admit exactly the values the golden
 *    declares *for that method's own operation*. `order_by` is the one axis whose values
 *    are a closed union in the type system (`fields` and `expand` are arrays validated in
 *    the kernel), so a params type pointed at a *sibling* operation's enum compiles, reads
 *    plausibly, and is wrong in both directions at once: sort orders the server offers are
 *    rejected by the compiler, and sort orders it does not are accepted by the compiler
 *    and then rejected by `encodeOrderBy` at runtime. Nothing else would catch it — the
 *    sibling enum is a real type with real values, so the only way to know it is the wrong
 *    one is to compare against the golden, which is what this does.
 *
 * Rule 2 is why the type must be written as `(typeof ORDER_BY)["<this op>_list"][number]`
 * and never hand-spelled: a hand-spelled union is a copy of the golden that stops being
 * one the next time the API adds a sort order.
 */

import { ORDER_BY } from "../../../src/api/v2/generated/constants";
import { CapableMethod, methodsOffering, resourceEntries } from "./tree-walk";

/**
 * Methods that deliberately do not offer an `order_by` their operation declares, keyed
 * `ClassName.method`, each with why.
 *
 * **Empty, and meant to stay that way.** A sort order is a capability the server already
 * has; not exposing it makes it unreachable from the SDK entirely. An entry here needs a
 * reason the *server* supplies — a route whose ordering is fixed by the server whatever
 * the client asks — never "nobody asked for it" and never "the union is long". Ratcheted
 * below so task 3's ~47 classes cannot quietly grow it, which is exactly the condition
 * under which options get dropped.
 */
export const UNORDERED_METHODS: Readonly<Record<string, string>> = {};

/** How large {@link UNORDERED_METHODS} is allowed to be. A ratchet: lower it, never raise it. */
export const UNORDERED_CEILING = 0;

const ORDERABLE = methodsOffering(ORDER_BY as unknown as Record<string, readonly string[]>, resourceEntries());

/** The values a method's `order_by` option actually admits. */
function admitted(capable: CapableMethod): string[] {
  return [...(capable.method.optionLiterals.get("order_by") ?? [])].sort();
}

describe("order_by coverage", () => {
  it("finds methods to check at all", () => {
    // A floor, not a pin: if the enumeration or the `operations` lookup breaks, the sweeps
    // below pass by checking nothing — the failure mode every sweep here exists to refuse.
    expect(ORDERABLE.length).toBeGreaterThanOrEqual(130);
  });

  it("exposes `order_by` on every method whose operation offers it", () => {
    const missing = ORDERABLE.filter(
      ({ entry, method }) =>
        !method.optionProperties.has("order_by") && !(`${entry.name}.${method.name}` in UNORDERED_METHODS)
    )
      .map(
        ({ entry, method, operationId, values }) =>
          `${entry.name}.${method.name}() — ${operationId} sorts by ${values.join(", ")}, unreachable from the SDK`
      )
      .sort();

    expect(missing).toEqual([]);
  });

  it("types `order_by` against its own operation's enum, not a sibling's", () => {
    const wrong = ORDERABLE.filter(
      ({ entry, method }) =>
        method.optionProperties.has("order_by") && !(`${entry.name}.${method.name}` in UNORDERED_METHODS)
    )
      .map((capable) => ({ capable, offered: admitted(capable) }))
      .filter(({ capable, offered }) => offered.join(",") !== [...capable.values].sort().join(","))
      .map(({ capable, offered }) => {
        const expected = [...capable.values].sort();
        const surplus = offered.filter((value) => !expected.includes(value));
        const absent = expected.filter((value) => !offered.includes(value));
        return (
          `${capable.entry.name}.${capable.method.name}() — ${capable.operationId} sorts by ` +
          `${expected.join(", ")}; the type ` +
          (offered.length === 0
            ? `pins no values at all`
            : `is missing [${absent.join(", ")}] and admits [${surplus.join(", ")}] the server rejects`)
        );
      })
      .sort();

    expect(wrong).toEqual([]);
  });

  it("keeps every recorded omission real, still unexposed, and shrinking", () => {
    const reachable = new Set(ORDERABLE.map(({ entry, method }) => `${entry.name}.${method.name}`));
    const named = Object.keys(UNORDERED_METHODS).sort();

    expect({
      // An entry naming a method whose operation declares no `order_by` describes nothing.
      unknown: named.filter((qualified) => !reachable.has(qualified)),
      // An entry for a method that *does* offer it reads as a gap that was never closed.
      exposed: named.filter((qualified) =>
        ORDERABLE.some(
          ({ entry, method }) => `${entry.name}.${method.name}` === qualified && method.optionProperties.has("order_by")
        )
      ),
      // Every entry states why. A blank reason is not a reason.
      unreasoned: named.filter((qualified) => UNORDERED_METHODS[qualified].trim().length === 0),
    }).toEqual({ unknown: [], exposed: [], unreasoned: [] });

    // The ratchet. Lower `UNORDERED_CEILING` if one is ever closed; never raise it.
    expect(named.length).toBeLessThanOrEqual(UNORDERED_CEILING);
  });
});
