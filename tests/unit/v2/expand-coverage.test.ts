/**
 * `?expand=` must be reachable wherever the API offers it.
 *
 * The golden declares, per operation, which relations that operation can expand (`EXPAND`
 * in `generated/constants.ts`). A method that simply omits an `expand` option makes that
 * capability unreachable from the SDK — not wrong, just invisible, and invisible in a way
 * no test notices. The Python port shipped eleven such methods across two migrations
 * before this sweep existed.
 *
 * So this sweeps rather than lists: it walks the enumerated set of migrated resources
 * (`tree-walk.ts` — every resource class in the package bar an explicit, shrinking
 * opt-out) and fails naming any method that omits an option its own operation offers. The
 * remaining ~84 classes inherit the check as they migrate, instead of repeating the
 * omission 84 more times.
 *
 * Reachability is read off the *types*: a method offers `expand` when some parameter's
 * object type declares an `expand` property. In Node that is the whole rule — the params
 * object reaches the kernel as one blob, so declaring the property is what makes it
 * reachable and what makes `encodeExpand` validate it. (Python needed a second check that
 * the parameter was actually threaded into `params`; here there is nowhere else for it to
 * go.)
 */

import { EXPAND } from "../../../src/api/v2/generated/constants";
import { methodsOffering } from "./tree-walk";

const EXPANDABLE = methodsOffering(EXPAND as unknown as Record<string, readonly string[]>);

describe("expand coverage", () => {
  it("finds methods to check at all", () => {
    // A floor, not a pin: if the enumeration or the `operations` lookup breaks, the sweep
    // below passes by checking nothing. Raise this as tasks 2 and 3 migrate families.
    expect(EXPANDABLE.length).toBeGreaterThanOrEqual(10);
  });

  it("exposes `expand` on every method whose operation offers it", () => {
    const missing = EXPANDABLE.filter(({ method }) => !method.optionProperties.has("expand")).map(
      ({ entry, method, operationId, values }) =>
        `${entry.name}.${method.name}() — ${operationId} expands ${values.join(", ")}`
    );

    expect(missing).toEqual([]);
  });
});
