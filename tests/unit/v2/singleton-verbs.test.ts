/**
 * A singleton read is spelled `retrieve`, and the method's name is the action it sends.
 *
 * A singleton has no collection and no `pk`: `Features`, `GroupSyncConfig`,
 * `ReleaseChangelogResource`, `Permissions`, `UsersMe`. The kernel reads one with
 * `doRetrieveSingleton` and writes one with `doUpdateSingleton`, and each takes an
 * `action` — the `operations` key whose URL and query encoding the call uses.
 *
 * `GroupSyncConfig` spelled its read `get` while the Python SDK spelled the same endpoint
 * `retrieve`, and the two SDKs disagreed about the name of a method that does the same
 * thing on the same URL. It was corrected at the point, and Python grew
 * `test_singleton_verbs.py` to keep it corrected; Node grew a one-line edit to an
 * existing test and nothing that would notice the next one.
 * `operations-coverage.test.ts` is not a substitute — it only asks that a method name
 * match *some* declared `operations` key, so `operations = { get: … }` plus `get()`
 * satisfies it in perfect self-consistency.
 *
 * This is the sweep, and it needs no list of singletons and no list of allowed verbs:
 *
 * - **Which helpers are singleton helpers** is read off `kernel/resource.ts`, along with
 *   the default `action` each one declares. A helper renamed, added or given a different
 *   default changes this sweep's answer in the same commit that changes the kernel.
 * - **What each method must be called** is the action its own call passes — `"me"` for
 *   `Permissions.me`, `"list"` for the dict-shaped `WorkItemDependencies.list`,
 *   `"retrieve"` by default everywhere else. So the deliberate exceptions are not
 *   exceptions at all: they are methods whose name already agrees with what they send,
 *   and the rule catches a disagreement rather than an unfamiliar word.
 *
 * The last assertion is the narrower, blunter form of the same rule, and it is the one
 * that would have caught the original defect on the day it landed: `get` is not a verb
 * this surface uses anywhere, for anything.
 */

import * as ts from "typescript";
import { migratedEntries, program, publicMethods } from "./tree-walk";

interface SingletonHelper {
  /** Zero-based index of the `action` parameter in the helper's signature. */
  readonly actionIndex: number;
  /** The action used when the call site passes none. */
  readonly fallback: string;
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
 * The kernel's singleton helpers and the default action each declares — derived, never
 * listed. A helper qualifies by shape: a `do*Singleton` method with an `action` parameter
 * that has a string-literal default.
 */
function singletonHelpers(): Map<string, SingletonHelper> {
  const helpers = new Map<string, SingletonHelper>();
  for (const member of kernelClass().members) {
    if (!ts.isMethodDeclaration(member) || !ts.isIdentifier(member.name)) continue;
    const name = member.name.text;
    if (!name.startsWith("do") || !name.endsWith("Singleton")) continue;
    const index = member.parameters.findIndex(
      (parameter) => ts.isIdentifier(parameter.name) && parameter.name.text === "action"
    );
    if (index < 0) continue;
    const initializer = member.parameters[index].initializer;
    if (initializer === undefined || !ts.isStringLiteral(initializer)) continue;
    helpers.set(name, { actionIndex: index, fallback: initializer.text });
  }
  return helpers;
}

const HELPERS = singletonHelpers();

interface SingletonCall {
  readonly key: string;
  readonly method: string;
  readonly helper: string;
  /** The action the call sends: its literal argument, or the helper's default. */
  readonly action: string;
  /** True when the argument is present but is not a string literal, so it cannot be read. */
  readonly opaque: boolean;
}

/** Bodies of a class's own methods, keyed by method name (overloads share one body). */
function bodiesOf(declaration: ts.ClassDeclaration): Map<string, ts.Node> {
  const bodies = new Map<string, ts.Node>();
  for (const member of declaration.members) {
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

function singletonCalls(): SingletonCall[] {
  const found: SingletonCall[] = [];
  for (const entry of migratedEntries()) {
    for (const [method, body] of bodiesOf(entry.declaration)) {
      const visit = (node: ts.Node): void => {
        if (
          ts.isCallExpression(node) &&
          ts.isPropertyAccessExpression(node.expression) &&
          node.expression.expression.kind === ts.SyntaxKind.ThisKeyword &&
          HELPERS.has(node.expression.name.text)
        ) {
          const helper = node.expression.name.text;
          const { actionIndex, fallback } = HELPERS.get(helper)!;
          const argument = node.arguments[actionIndex];
          const literal = argument !== undefined && ts.isStringLiteral(argument) ? argument.text : undefined;
          found.push({
            key: entry.key,
            method,
            helper,
            action: literal ?? fallback,
            opaque: argument !== undefined && literal === undefined,
          });
        }
        node.forEachChild(visit);
      };
      visit(body);
    }
  }
  return found;
}

const CALLS = singletonCalls();

describe("singleton verbs", () => {
  it("reads the singleton helpers, and their default actions, off the kernel itself", () => {
    // These are the derivation's answer, not its input: a helper that stopped taking an
    // `action`, or gained a different default, changes what every assertion below means.
    expect([...HELPERS].map(([name, helper]) => `${name}:${helper.fallback}`).sort()).toEqual([
      "doRetrieveSingleton:retrieve",
      "doUpdateSingleton:update",
    ]);
  });

  it("finds singleton calls to check at all", () => {
    // A floor well under the population. Zero calls would make the rule below vacuous,
    // which is precisely the shape of the hole this file was written to fill.
    expect(CALLS.length).toBeGreaterThanOrEqual(8);
    expect(new Set(CALLS.map((call) => call.key)).size).toBeGreaterThanOrEqual(5);
  });

  it("names every singleton method after the action it sends", () => {
    // The rule, and the reason it needs no exception list: `Permissions.me` and
    // `UsersMe.me` send `"me"`, and `WorkItemDependencies.list` sends `"list"` for its
    // dict-shaped read. Each already agrees with itself. What cannot agree is a method
    // called `get` sending `"retrieve"` — the divergence from Python that started this.
    const offenders = CALLS.filter((call) => !call.opaque && call.method !== call.action).map(
      (call) =>
        `${call.key}.${call.method} calls ${call.helper} with action "${call.action}", so the endpoint it ` +
        `reads is "${call.action}" while the method is called "${call.method}" — the two SDKs then disagree ` +
        `about the name of the same operation on the same URL`
    );

    expect(offenders.sort()).toEqual([]);
  });

  it("sends an action it can read at every call site", () => {
    // A computed action would make the rule above silently skip that call, which is the
    // way a sweep rots without ever going red.
    const offenders = CALLS.filter((call) => call.opaque).map(
      (call) => `${call.key}.${call.method} passes a non-literal action to ${call.helper}, so it cannot be checked`
    );

    expect(offenders.sort()).toEqual([]);
  });

  it("never spells a read `get` anywhere on the v2 surface", () => {
    // The blunt form of the same rule, over every public method rather than only the
    // singleton ones: `retrieve` is the verb, and `get` was the one place it was not.
    const offenders = migratedEntries().flatMap((entry) =>
      publicMethods(entry)
        .filter((method) => method.name === "get" || method.name === "fetch")
        .map(
          (method) =>
            `${entry.key}.${method.name} — v2 spells a read \`retrieve\`; \`get\`/\`fetch\` is the v1 idiom ` +
            `and the spelling the Python SDK does not use`
        )
    );

    expect(offenders.sort()).toEqual([]);
  });
});
