/**
 * A method that declares an `extraPaths` override must actually build its URL from it.
 *
 * Only some of the kernel's helpers honour an override. `doRetrieveSingleton`,
 * `doUpdateSingleton`, `doBridge` and `doCustomAction` (in its no-`pk`, no-`onCollection`
 * shape) route through `urlFor`, which prefers `extraPaths[action]`. `doList`,
 * `doRetrieve`, `doCreate`, `doUpdate`, `doDelete`, `doUpsert`, `doAction`,
 * `doVoidAction`, `doBulk*` and `doCustomAction`-with-a-`pk` build from `this.path` and
 * **ignore `extraPaths` entirely**.
 *
 * Meanwhile `tree-walk.ts`'s `templateFor` — which the path-id and filters sweeps use to
 * decide what a method's leading parameters ought to be — *always* prefers the override.
 * So a method that declares an `extraPaths` entry and then calls `doList` satisfies both
 * of those sweeps while sending its request to a URL built from the wrong template. The
 * sweeps would be checking the declared template and the code would be using another one,
 * and nothing anywhere compares the two.
 *
 * All 13 `extraPaths` declarations are correct today. This is the assertion that keeps
 * them so, and it needs no list of its own: which helpers honour an override is read off
 * `kernel/resource.ts` by asking which of them reach `urlFor` — so a helper that gains or
 * loses that behaviour changes this sweep's answer in the same commit.
 */

import * as ts from "typescript";
import { extraPathsOf, instantiate, migratedEntries, program } from "./tree-walk";

/** `this.<name>(...)` calls in a body, with the options-object keys any of them passed. */
interface SelfCall {
  readonly name: string;
  readonly optionKeys: ReadonlySet<string>;
}

function kernelClass(): ts.ClassDeclaration {
  const source = program()
    .getSourceFiles()
    .find((candidate) => candidate.fileName.endsWith("api/v2/kernel/resource.ts"));
  if (source === undefined) throw new Error("kernel/resource.ts not found in the program");
  const declaration = source.statements.find(
    (statement): statement is ts.ClassDeclaration =>
      ts.isClassDeclaration(statement) && statement.name?.text === "V2Resource"
  );
  if (declaration === undefined) throw new Error("V2Resource not found in kernel/resource.ts");
  return declaration;
}

/**
 * The kernel helpers whose own bodies reach `urlFor`, i.e. the ones that honour an
 * `extraPaths` override — derived, never listed.
 */
function overrideHonouringHelpers(): Set<string> {
  const honouring = new Set<string>();
  for (const member of kernelClass().members) {
    if (!ts.isMethodDeclaration(member) || !ts.isIdentifier(member.name) || member.body === undefined) continue;
    const name = member.name.text;
    if (!name.startsWith("do")) continue;
    let reaches = false;
    const visit = (node: ts.Node): void => {
      if (
        ts.isPropertyAccessExpression(node) &&
        node.expression.kind === ts.SyntaxKind.ThisKeyword &&
        node.name.text === "urlFor"
      ) {
        reaches = true;
      }
      node.forEachChild(visit);
    };
    visit(member.body);
    if (reaches) honouring.add(name);
  }
  return honouring;
}

const HONOURING = overrideHonouringHelpers();

/**
 * `doCustomAction` builds three different URLs. Only the third honours the override, and
 * which one a call site gets is decided by the options object it passes.
 */
const CUSTOM_ACTION_ESCAPES: ReadonlySet<string> = new Set(["pk", "onCollection"]);

function selfCalls(body: ts.Node): SelfCall[] {
  const calls: SelfCall[] = [];
  const visit = (node: ts.Node): void => {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.expression.kind === ts.SyntaxKind.ThisKeyword
    ) {
      const optionKeys = new Set<string>();
      for (const argument of node.arguments) {
        if (!ts.isObjectLiteralExpression(argument)) continue;
        for (const property of argument.properties) {
          if (property.name !== undefined && ts.isIdentifier(property.name)) optionKeys.add(property.name.text);
        }
      }
      calls.push({ name: node.expression.name.text, optionKeys });
    }
    node.forEachChild(visit);
  };
  visit(body);
  return calls;
}

/** Bodies of a class's own methods, keyed by method name (overloads share one body). */
function bodiesOf(declaration: ts.ClassDeclaration): Map<string, ts.Node> {
  const bodies = new Map<string, ts.Node>();
  for (const member of declaration.members) {
    if (!ts.isIdentifier(member.name ?? ts.factory.createIdentifier("_"))) continue;
    if (ts.isMethodDeclaration(member) && ts.isIdentifier(member.name) && member.body !== undefined) {
      bodies.set(member.name.text, member.body);
    } else if (
      ts.isPropertyDeclaration(member) &&
      ts.isIdentifier(member.name) &&
      member.initializer !== undefined &&
      ts.isArrowFunction(member.initializer)
    ) {
      bodies.set(member.name.text, member.initializer.body);
    }
  }
  return bodies;
}

interface Override {
  readonly key: string;
  readonly method: string;
  readonly template: string;
  readonly body: ts.Node | undefined;
}

function declaredOverrides(): Override[] {
  const found: Override[] = [];
  for (const entry of migratedEntries()) {
    const overrides = extraPathsOf(instantiate(entry));
    if (Object.keys(overrides).length === 0) continue;
    const bodies = bodiesOf(entry.declaration);
    for (const [method, template] of Object.entries(overrides)) {
      found.push({ key: entry.key, method, template, body: bodies.get(method) });
    }
  }
  return found;
}

const OVERRIDES = declaredOverrides();

describe("extraPaths", () => {
  it("reads the override-honouring helpers off the kernel itself", () => {
    // The floor: if this derivation came back empty every assertion below would pass by
    // finding every call unacceptable — or, worse, by finding nothing to check. These
    // four are the answer the derivation produced, not its input.
    expect([...HONOURING].sort()).toEqual(["doBridge", "doCustomAction", "doRetrieveSingleton", "doUpdateSingleton"]);
  });

  it("finds overrides to check at all", () => {
    // 13 declarations across 13 classes today. A floor, not a pin.
    expect(OVERRIDES.length).toBeGreaterThanOrEqual(13);
  });

  it("names a real method in every declaration", () => {
    // An `extraPaths` key naming no method is dead: it overrides nothing, and it makes
    // `templateFor` answer a template for a method that does not exist.
    const orphans = OVERRIDES.filter((override) => override.body === undefined)
      .map((override) => `${override.key}.extraPaths.${override.method} names no method on the class`)
      .sort();

    expect(orphans).toEqual([]);
  });

  it("routes every overriding method through a helper that honours the override", () => {
    const offenders: string[] = [];
    for (const override of OVERRIDES) {
      if (override.body === undefined) continue;
      const calls = selfCalls(override.body);
      const honours = calls.some((call) => {
        if (!HONOURING.has(call.name)) return false;
        // `doCustomAction` only reaches `urlFor` when the call passes neither `pk` nor
        // `onCollection`; either one selects a URL built from `this.path` instead.
        if (call.name !== "doCustomAction") return true;
        return ![...call.optionKeys].some((key) => CUSTOM_ACTION_ESCAPES.has(key));
      });
      // `urlFor` called directly and handed to a `*At` helper is the other correct shape,
      // and the one `WorkspaceWorkItems.retrieveByIdentifier` uses.
      const buildsUrlItself = calls.some((call) => call.name === "urlFor");
      if (honours || buildsUrlItself) continue;
      offenders.push(
        `${override.key}.${override.method}() declares extraPaths ${JSON.stringify(override.template)} but ` +
          `reaches the transport through ${
            calls.length === 0 ? "no helper at all" : [...new Set(calls.map((call) => call.name))].sort().join("/")
          }, which builds from \`path\` and ignores the override — so the sweeps check one ` +
          `template and the request uses another`
      );
    }

    expect(offenders.sort()).toEqual([]);
  });
});
