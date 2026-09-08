/**
 * `?fields=` must be reachable wherever the API offers it.
 *
 * The twin of `expand-coverage.test.ts`, and the reason it exists: the naming rule and the
 * `expand` rule are both enumerated sweeps over every migrated class, while the `fields`
 * rule was carried by prose alone. A rule nobody sweeps holds only as long as somebody
 * re-reads it, and tasks 2 and 3 copy this pattern 84 more times.
 *
 * The golden declares, per operation, which field names that operation will project
 * (`FIELDS` in `generated/constants.ts`). A method that omits the option makes the
 * capability unreachable from the SDK.
 *
 * **The one class of exception is a response that cannot be re-fetched.** Where the body
 * is one-time — a secret shown once, or a presigned-upload envelope whose data exists only
 * in that reply — a projection could silently and irrecoverably drop data the caller has
 * no second chance at, so the option is deliberately not offered. Those go in
 * {@link ONE_TIME_RESPONSES} with their reason, and each must also carry the reason in its
 * own doc comment, or the next reader "fixes" the omission back. Everything else is a bug.
 */

import { FIELDS } from "../../../src/api/v2/generated/constants";
import { methodsOffering } from "./tree-walk";

/**
 * The only methods allowed to omit a `fields` their operation offers, keyed
 * `ClassName.method`, each with why.
 *
 * Two of the four are here; the other two belong to resources still on the opt-out list
 * (an entry for a method outside the swept set is refused below as stale), and are named
 * so the task that migrates them copies the reasoning rather than re-deciding it:
 *
 * - `Webhooks.regenerate` — the response's `secret_key` is minted once and never returned
 *   again, so a projection that dropped it would destroy the only copy.
 * - `Attachments.create` (work item) — the live envelope is richer than the golden
 *   documents and its `upload_data` presigned fields exist only in this reply, so a
 *   projection could strand the caller mid-upload with no way to re-fetch them.
 *
 * A new entry needs a response that genuinely cannot be re-fetched; "large response" or
 * "nobody asked for it" is not one.
 */
export const ONE_TIME_RESPONSES: Readonly<Record<string, string>> = {
  "Assets.create":
    "the presigned `upload_data` in the reply exists only there and cannot be re-fetched, " +
    "so a projection could drop it beyond recovery and strand the caller mid-upload",
  "UserAssets.create": "the user-scoped twin of `Assets.create`, with the same one-time presigned upload data",
};

const PROJECTABLE = methodsOffering(FIELDS as unknown as Record<string, readonly string[]>);

describe("fields coverage", () => {
  it("finds methods to check at all", () => {
    // A floor, not a pin: if the enumeration or the `operations` lookup breaks, the sweep
    // below passes by checking nothing. Raise this as tasks 2 and 3 migrate families.
    expect(PROJECTABLE.length).toBeGreaterThanOrEqual(25);
  });

  it("exposes `fields` on every method whose operation offers it", () => {
    const missing = PROJECTABLE.filter(
      ({ entry, method }) =>
        !method.optionProperties.has("fields") && !(`${entry.name}.${method.name}` in ONE_TIME_RESPONSES)
    ).map(
      ({ entry, method, operationId, values }) =>
        `${entry.name}.${method.name}() — ${operationId} projects ${values.join(", ")}`
    );

    expect(missing).toEqual([]);
  });

  it("keeps every named exception real and still needed", () => {
    // A stale exception is an omission nobody can see is dead, and an exception for a
    // method that does expose `fields` reads as a rule that was never met.
    const projectable = new Set(PROJECTABLE.map(({ entry, method }) => `${entry.name}.${method.name}`));
    const unknown = Object.keys(ONE_TIME_RESPONSES)
      .filter((qualified) => !projectable.has(qualified))
      .sort();
    const exposed = PROJECTABLE.filter(
      ({ entry, method }) =>
        `${entry.name}.${method.name}` in ONE_TIME_RESPONSES && method.optionProperties.has("fields")
    )
      .map(({ entry, method }) => `${entry.name}.${method.name}`)
      .sort();

    expect({ unknown, exposed }).toEqual({ unknown: [], exposed: [] });
  });

  it("makes every named exception state its reason where a reader of the method will see it", () => {
    const undocumented = PROJECTABLE.filter(
      ({ entry, method }) =>
        `${entry.name}.${method.name}` in ONE_TIME_RESPONSES && !method.documentation.includes("fields")
    )
      .map(({ entry, method }) => `${entry.name}.${method.name}`)
      .sort();

    expect(undocumented).toEqual([]);
  });
});
