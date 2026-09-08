/**
 * `?fields=` must be reachable wherever the API offers it.
 *
 * The twin of `expand-coverage.test.ts`, and the reason it exists: the naming rule and the
 * `expand` rule were both enumerated sweeps while the `fields` rule was carried by prose
 * alone. A rule nobody sweeps holds only as long as somebody re-reads it, and this pattern
 * was copied across all 90 classes. It found nineteen live omissions as the families
 * migrated — every one a capability the server had and the SDK could not reach.
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
 * `<module>#<Class>.method`, each with a reason and the phrase that reason must appear
 * under in the method's own doc comment.
 *
 * **Keyed by module, not by bare class name.** `tree-walk.ts` states the rule and follows
 * it: `Comments` and `Links` each name two different resources, so an exemption written
 * for one would silently also exempt the other. No entry here names a duplicated class
 * today, which is exactly why the key had to be fixed before one did.
 *
 * All four are here. `Webhooks.regenerate` was predicted by an earlier pass while the class
 * was still on the opt-out list, and landed unchanged when it migrated — it is the one
 * operation whose projectable field list actually contains `secret_key`, which is what
 * makes the hazard real rather than theoretical. `Webhooks.create` returns the same secret
 * and is *not* here, because the golden does not let that operation project `secret_key`
 * away.
 *
 * A new entry needs a response that genuinely cannot be re-fetched; "large response" or
 * "nobody asked for it" is not one.
 */
interface OneTimeResponse {
  /** Why a projection here could destroy data the caller cannot get back. */
  readonly why: string;
  /**
   * The phrase the method's own doc comment must contain, verbatim.
   *
   * The guard this replaces asked only that the doc comment contain the string
   * `"fields"` — which most *correct* doc comments in this SDK contain naturally ("The
   * row shape returned when `fields` is a literal tuple"), so it was satisfied by a method
   * that said nothing at all about why the option is missing. A named phrase is checked
   * three ways below: it must be long enough to be a sentence rather than a word, it must
   * appear in the method's own documentation, and it must appear in *no other* swept
   * method's documentation — so it cannot be a generic sentence copied around, and it
   * cannot be satisfied by boilerplate.
   */
  readonly docPhrase: string;
}

export const ONE_TIME_RESPONSES: Readonly<Record<string, OneTimeResponse>> = {
  "Assets#Assets.create": {
    why:
      "the presigned `upload_data` in the reply exists only there and cannot be re-fetched, " +
      "so a projection could drop it beyond recovery and strand the caller mid-upload",
    docPhrase: "offers no `fields`, though `assets_create` declares it: the presigned",
  },
  "UserAssets#UserAssets.create": {
    why: "the user-scoped twin of `Assets.create`, with the same one-time presigned upload data",
    docPhrase: "the user-scoped twin of `Assets.create`, and offers no `fields` for the same reason",
  },
  "WorkItems/Attachments#Attachments.create": {
    why:
      "the live envelope is richer than the golden documents and its presigned upload data " +
      "exists only in this reply, so a projection could strand the caller mid-upload",
    docPhrase: "offers no `fields`, though `attachments_create` declares it: the live",
  },
  "Webhooks#Webhooks.regenerate": {
    why:
      "`webhooks_regenerate` is the only operation that lists `secret_key` among its " +
      "projectable fields, and the secret is minted once and never shown again, so a " +
      "`fields` omitting it would destroy the only copy",
    docPhrase: "no `fields` option, deliberately.** `webhooks_regenerate` is the one operation whose",
  },
};

/**
 * How large {@link ONE_TIME_RESPONSES} is allowed to be. A ratchet: lower it, never raise it.
 *
 * This was the one exemption list in the suite with no ceiling, which made a human reading
 * the diff the only thing standing between a batch of dropped `fields` and a green build —
 * on the sweep that found nineteen live omissions.
 */
export const ONE_TIME_CEILING = 4;

/** The shortest a {@link OneTimeResponse.docPhrase} may be — a sentence, not a word. */
const MIN_DOC_PHRASE = 40;

const PROJECTABLE = methodsOffering(FIELDS as unknown as Record<string, readonly string[]>);

describe("fields coverage", () => {
  it("finds methods to check at all", () => {
    // A floor, not a pin: if the enumeration or the `operations` lookup breaks, the sweep
    // below passes by checking nothing. Raised as each task migrated families; every class
    // is migrated now, so it moves only when the golden itself grows.
    expect(PROJECTABLE.length).toBeGreaterThanOrEqual(320);
  });

  it("exposes `fields` on every method whose operation offers it", () => {
    const missing = PROJECTABLE.filter(
      ({ entry, method }) =>
        !method.optionProperties.has("fields") && !(`${entry.key}.${method.name}` in ONE_TIME_RESPONSES)
    ).map(
      ({ entry, method, operationId, values }) =>
        `${entry.name}.${method.name}() — ${operationId} projects ${values.join(", ")}`
    );

    expect(missing).toEqual([]);
  });

  it("keeps every named exception real and still needed", () => {
    // A stale exception is an omission nobody can see is dead, and an exception for a
    // method that does expose `fields` reads as a rule that was never met.
    const projectable = new Set(PROJECTABLE.map(({ entry, method }) => `${entry.key}.${method.name}`));
    const unknown = Object.keys(ONE_TIME_RESPONSES)
      .filter((qualified) => !projectable.has(qualified))
      .sort();
    const exposed = PROJECTABLE.filter(
      ({ entry, method }) =>
        `${entry.key}.${method.name}` in ONE_TIME_RESPONSES && method.optionProperties.has("fields")
    )
      .map(({ entry, method }) => `${entry.key}.${method.name}`)
      .sort();

    expect({ unknown, exposed }).toEqual({ unknown: [], exposed: [] });

    // The ratchet. Lower it if one is ever closed; never raise it.
    expect(Object.keys(ONE_TIME_RESPONSES).length).toBeLessThanOrEqual(ONE_TIME_CEILING);
  });

  it("makes every named exception state its reason where a reader of the method will see it", () => {
    // Three guards on the phrase, because the previous one — "the doc comment mentions
    // `fields`" — was satisfied by almost every correct doc comment in the SDK.
    const tooShort: string[] = [];
    const absent: string[] = [];
    const notDistinctive: string[] = [];

    for (const [qualified, exemption] of Object.entries(ONE_TIME_RESPONSES)) {
      const phrase = exemption.docPhrase.toLowerCase();
      if (exemption.docPhrase.trim().length < MIN_DOC_PHRASE) tooShort.push(qualified);

      const owner = PROJECTABLE.find((capable) => `${capable.entry.key}.${capable.method.name}` === qualified);
      if (owner === undefined) continue;
      if (!owner.method.documentation.includes(phrase)) absent.push(qualified);

      // The phrase must be this method's own. A sentence that also appears on some other
      // swept method is boilerplate, and boilerplate is what the old guard accepted.
      const elsewhere = PROJECTABLE.filter(
        (capable) =>
          `${capable.entry.key}.${capable.method.name}` !== qualified && capable.method.documentation.includes(phrase)
      );
      if (elsewhere.length > 0) notDistinctive.push(qualified);
    }

    expect({ tooShort, absent, notDistinctive }).toEqual({ tooShort: [], absent: [], notDistinctive: [] });
  });
});
