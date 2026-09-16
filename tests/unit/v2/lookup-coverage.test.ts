/**
 * A `findBy*` lookup must send a filter the server actually filters on — and must exist
 * wherever the server does filter on a human key.
 *
 * `doFindOne` is `list` with a filter and `per_page=2`, so a lookup keyed on a query
 * parameter the operation does not declare is *silently* wrong: the server ignores the
 * unknown parameter, returns the first two rows of the unfiltered collection, and the SDK
 * either hands back an arbitrary row or raises `MultipleMatchesFoundError` for a name that
 * matched exactly once. Nothing about that failure names the cause.
 *
 * It is not hypothetical. The Python SDK ships `Workflows.find_by_name` as a `_find_one`,
 * and `workflows_list` declares exactly one filter — `search` — with no `name` among them,
 * so that call resolves against the unfiltered collection.
 *
 * The SDK has **two** lookup mechanisms, and which one is correct is decided entirely by
 * the golden:
 *
 * - **server-side** — `doFindOne({ name })`, one request, when the operation declares the
 *   filter;
 * - **client-side** — walk `iterate` and compare in the SDK, raising the same
 *   `NoMatchFoundError`/`MultipleMatchesFoundError`, when it does not. `Roles`,
 *   `ProjectPages`, `WikiPages`, `Collections` and `WorkItemRelationDefinitions` already
 *   do this, and it is what `Workflows.findByName` now does too.
 *
 * Four rules, all enumerated:
 *
 * 1. **Every lookup uses one of the two mechanisms.** A lookup built some third way would
 *    otherwise be skipped by the rules below rather than checked by them.
 * 2. **A server-side lookup's filters are declared.** Read off its own
 *    `doFindOne({ … })` call, checked against `FILTERS` for the operation it spends —
 *    `list`'s, because that is the request it makes.
 * 3. **A client-side lookup's key is *not* declared.** If the server can filter on it, a
 *    full walk is a slower way to get the same answer, and one the first large collection
 *    turns into a performance bug.
 * 4. **Every declared human key has a lookup.** A class whose list filters on `name` and
 *    offers no `findByName` makes the readable-key lookup — the whole reason these methods
 *    exist — unreachable. This direction found `ProjectViews` and `WorkspaceViews`, both
 *    of which the API filters by name and neither of which had one.
 */

import * as ts from "typescript";
import { FILTERS } from "../../../src/api/v2/generated/constants";
import {
  ResourceEntry,
  instantiate,
  operationActionFor,
  operationsOf,
  publicMethods,
  resourceEntries,
} from "./tree-walk";

const FILTER_TABLE = FILTERS as unknown as Record<string, readonly string[]>;

/**
 * Human keys that oblige a `findBy*` when the golden declares them as filters, mapped to
 * the method name the SDK spells the lookup under.
 *
 * `name` is the only one that is universal. `slug`, `key`, `version` and `display_name`
 * are per-family spellings — `roles.findBySlug`, `estimates.points.findByKey`,
 * `releases.tags.findByVersion`, `findByDisplayName` on the three property lists — and
 * each of those classes already has one; requiring them everywhere the golden declares the
 * filter would demand `Roles.findByIsSystem`, which is not a lookup by human key.
 */
const OBLIGING_FILTERS: Readonly<Record<string, string>> = { name: "findByName" };

/**
 * Classes whose list filters on an obliging key and that deliberately offer no lookup.
 *
 * **Empty, and ratcheted at zero.** An entry needs a reason the *data* supplies — a key
 * the server filters on but that is not unique enough to resolve one row — never "nobody
 * asked for it". Keyed `<module>#<Class>`, like every other exemption list here.
 */
export const UNLOOKED_UP: Readonly<Record<string, string>> = {};

/** How large {@link UNLOOKED_UP} is allowed to be. A ratchet: lower it, never raise it. */
export const UNLOOKED_UP_CEILING = 0;

interface Lookup {
  readonly key: string;
  readonly method: string;
  readonly operationId: string | undefined;
  /** The filter keys the method's own `doFindOne` call sends; empty when client-side. */
  readonly filters: string[];
  /** True when the body walks `iterate` and compares in the SDK instead. */
  readonly clientSide: boolean;
  /** The golden's spelling of the key this lookup resolves on — `findByDisplayName` -> `display_name`. */
  readonly resolvesOn: string;
}

/** `findByDisplayName` -> `display_name`; `default` resolves on nothing nameable. */
function keyOf(method: string): string {
  const stem = method.replace(/^findBy/, "");
  return stem.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

/** Whether a body resolves by walking `iterate` and comparing rows itself. */
function walksIterate(body: ts.Node): boolean {
  let walks = false;
  const visit = (node: ts.Node): void => {
    if (
      ts.isPropertyAccessExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ThisKeyword &&
      node.name.text === "iterate"
    ) {
      walks = true;
    }
    node.forEachChild(visit);
  };
  visit(body);
  return walks;
}

/** The keys of the first object literal argument of each `this.doFindOne(...)` call. */
function findOneFilters(body: ts.Node): string[] {
  const filters: string[] = [];
  const visit = (node: ts.Node): void => {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.expression.kind === ts.SyntaxKind.ThisKeyword &&
      node.expression.name.text === "doFindOne"
    ) {
      const first = node.arguments[0];
      // Every object literal *within* the first argument, not just a literal in that
      // position: `Roles.findBySlug` passes a conditional that picks between two shapes,
      // and reading only a bare literal would have silently found no filters at all —
      // which the "one of the two mechanisms" rule above is what caught.
      if (first !== undefined) {
        const collect = (candidate: ts.Node): void => {
          if (ts.isObjectLiteralExpression(candidate)) {
            for (const property of candidate.properties) {
              if (property.name === undefined) continue;
              if (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) {
                filters.push(property.name.text);
              }
            }
          }
          candidate.forEachChild(collect);
        };
        collect(first);
      }
    }
    node.forEachChild(visit);
  };
  visit(body);
  return filters;
}

function bodyOf(entry: ResourceEntry, name: string): ts.Node | undefined {
  for (const member of entry.declaration.members) {
    if (!ts.isMethodDeclaration(member) || !ts.isIdentifier(member.name)) continue;
    if (member.name.text !== name || member.body === undefined) continue;
    return member.body;
  }
  return undefined;
}

function lookups(): Lookup[] {
  const found: Lookup[] = [];
  for (const entry of resourceEntries()) {
    const operations = operationsOf(instantiate(entry));
    for (const method of publicMethods(entry)) {
      if (!/^findBy[A-Z]/.test(method.name) && method.name !== "default") continue;
      const body = bodyOf(entry, method.name);
      const filters = body === undefined ? [] : findOneFilters(body);
      found.push({
        key: entry.key,
        method: method.name,
        operationId: operations[operationActionFor(method.name)],
        filters,
        clientSide: body !== undefined && filters.length === 0 && walksIterate(body),
        resolvesOn: keyOf(method.name),
      });
    }
  }
  return found;
}

const LOOKUPS = lookups();

describe("lookup coverage", () => {
  it("finds lookups to check at all", () => {
    // A floor, not a pin: 37 `findBy*`/`default` methods exist today.
    expect(LOOKUPS.length).toBeGreaterThanOrEqual(35);
  });

  it("resolves every lookup through one of the two mechanisms, and only those", () => {
    // Rule 1, and the sweep's own blind spot if it were missing: a lookup built some third
    // way would be skipped by the rules below rather than checked by them.
    const unreadable = LOOKUPS.filter((lookup) => lookup.filters.length === 0 && !lookup.clientSide)
      .map(
        (lookup) =>
          `${lookup.key}.${lookup.method}() neither calls \`doFindOne({ … })\` nor walks \`iterate\`, so ` +
          `nothing here can tell whether it resolves against the right thing`
      )
      .sort();

    expect(unreadable).toEqual([]);
    // Both mechanisms must still be represented, or one set of rules goes vacuous.
    expect(LOOKUPS.filter((lookup) => lookup.clientSide).length).toBeGreaterThanOrEqual(6);
    expect(LOOKUPS.filter((lookup) => !lookup.clientSide).length).toBeGreaterThanOrEqual(28);
  });

  it("sends only filters the lookup's own operation declares", () => {
    const offenders: string[] = [];
    for (const lookup of LOOKUPS) {
      if (lookup.clientSide) continue;
      if (lookup.operationId === undefined) {
        offenders.push(`${lookup.key}.${lookup.method}() resolves to no operation id, so nothing validates it`);
        continue;
      }
      const declared = FILTER_TABLE[lookup.operationId] ?? [];
      for (const filter of lookup.filters) {
        if (declared.includes(filter)) continue;
        offenders.push(
          `${lookup.key}.${lookup.method}() filters on ?${filter}=, which ${lookup.operationId} does not ` +
            `declare (it declares ${declared.length === 0 ? "nothing" : declared.join(", ")}) — the server ` +
            `would ignore it and the lookup would resolve against the unfiltered collection`
        );
      }
    }

    expect(offenders.sort()).toEqual([]);
  });

  it("walks the collection only where the server cannot filter", () => {
    // Rule 3. A client-side walk is the right answer exactly when the golden declares no
    // such filter — and the wrong one when it does, because it fetches every page to do
    // what one request would.
    const wasteful = LOOKUPS.filter((lookup) => {
      if (!lookup.clientSide || lookup.operationId === undefined) return false;
      return (FILTER_TABLE[lookup.operationId] ?? []).includes(lookup.resolvesOn);
    })
      .map(
        (lookup) =>
          `${lookup.key}.${lookup.method}() walks every page comparing rows, but ${lookup.operationId} ` +
          `declares ?${lookup.resolvesOn}= — one filtered request would do the same work`
      )
      .sort();

    expect(wasteful).toEqual([]);
  });

  it("offers a lookup wherever the API filters on a human key", () => {
    const missing: string[] = [];
    for (const entry of resourceEntries()) {
      const operationId = operationsOf(instantiate(entry))["list"];
      if (operationId === undefined) continue;
      const declared = FILTER_TABLE[operationId] ?? [];
      const methods = new Set(publicMethods(entry).map((method) => method.name));
      for (const [filter, lookup] of Object.entries(OBLIGING_FILTERS)) {
        if (!declared.includes(filter)) continue;
        if (methods.has(lookup)) continue;
        if (entry.key in UNLOOKED_UP) continue;
        missing.push(
          `${entry.key} — ${operationId} declares ?${filter}=, but the class offers no ${lookup}(), so ` +
            `resolving a row by its readable key is unreachable`
        );
      }
    }

    expect(missing.sort()).toEqual([]);
  });

  it("keeps every recorded omission real, still missing, and shrinking", () => {
    const known = new Set(resourceEntries().map((entry) => entry.key));
    const named = Object.keys(UNLOOKED_UP).sort();

    expect({
      unknown: named.filter((key) => !known.has(key)),
      unreasoned: named.filter((key) => UNLOOKED_UP[key].trim().length === 0),
    }).toEqual({ unknown: [], unreasoned: [] });

    expect(named.length).toBeLessThanOrEqual(UNLOOKED_UP_CEILING);
  });
});
