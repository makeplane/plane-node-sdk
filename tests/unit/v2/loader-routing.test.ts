/**
 * Every row-returning method on a navigable resource must route through the loader.
 *
 * **This rule shipped broken once on this very branch.** `Webhooks.create` returned the
 * created webhook straight from `doCreate`, so a caller who created a webhook got a plain
 * object where every other method of the class hands back a navigable row, and
 * `webhook.logs.list()` was `undefined is not a function`. Nothing failed. The navigation
 * sweep (`loaded-navigation.test.ts`) asks its question *per class*, and `Webhooks` was
 * navigable through its other five methods; the only test of this rule was — and until
 * this file existed, still was — `navigable-rows.test.ts`'s "routes every row-returning
 * method through the loader", scoped to `Projects` and nothing else. A selection of one.
 *
 * The fix commit for `Webhooks.create` said it had verified the class was the only
 * instance, by running exactly the sweep below. It ran it and did not commit it, which is
 * the distinction this file exists to make: **proving a sweep bites is not the same as
 * committing the sweep.** A proof is a fact about one moment; a sweep is a fact about
 * every commit after it.
 *
 * ## Two halves, derived from two different declarations
 *
 * The halves are checked independently and a copy-paste cannot make them agree, which is
 * the property the rest of this suite is built on.
 *
 * **Half A — the body.** A method whose implementation calls a kernel helper that answers
 * a *row of this resource* must also call `load`/`loadPage`/`loadIterate`. Which helpers
 * those are is not a list written here: it is read off `kernel/resource.ts`'s own
 * declarations (see {@link rowReturningHelpers}). A helper whose return type is
 * `Promise<void>` (`doDelete`, `doVoidAction`), `Promise<BulkWriteResponse>` (`doBulk*`)
 * or `Promise<string[]>` (`doBridge*`) hands back no row and is exempt **by the rule**,
 * not by name — so a new no-row helper is exempt the day it is written, and a new
 * row-returning one is in scope the day it is written.
 *
 * **Half B — the signature.** A method whose declared return type names this resource's
 * own read model (`Promise<Webhook>`, `Promise<Page<Webhook>>`) must also name a `Loaded`
 * type. The read model comes from the class's own heritage clause —
 * `class Webhooks extends LoadsNavigableRows<Webhook, …>` — so this half never consults
 * the body, and `tsc` never checks it either: a method may simply declare
 * `Promise<Webhook>` and be perfectly well typed while being exactly wrong.
 *
 * Half A catches "forgot to load". Half B catches "loaded but declared the unloaded type",
 * and any route that hands back a raw row by a mechanism Half A does not model.
 *
 * ## What is *not* in scope, and why that needs no list either
 *
 * A custom action whose response envelope is not a row of this resource — `Projects.summary`,
 * `Cycles.transfer`, `*Automations.setStatus`, `WorkItemTypes.schema`/`import` — reaches
 * the transport through `doCustomAction<TResult>`, which has no `= TRead` default and so
 * can never be row-returning under Half A; and its return type names its own envelope, not
 * the read model, so Half B does not ask about it either. Both halves decline for the same
 * structural reason rather than because somebody remembered to write the method down.
 */

import * as path from "node:path";
import * as ts from "typescript";
import { ResourceEntry, V2_ROOT, navigableEntries, program } from "./tree-walk";

/** The loader entry points a row-returning method must reach. */
const LOADERS: ReadonlySet<string> = new Set(["load", "loadPage", "loadIterate"]);

/** Type names that mark a return type as carrying navigation. */
const LOADED_PREFIX = /^Loaded[A-Z]?/;

interface HelperInfo {
  readonly name: string;
  /** True when the helper's declared result is the resource's own read row. */
  readonly returnsRow: boolean;
  /**
   * True when the helper answers `TRead` only *by default* — `doAction<TResult = TRead>`.
   * Such a call is row-returning only where the call site supplies no type argument.
   */
  readonly rowByDefaultOnly: boolean;
}

function classDeclarationsIn(fileName: string): ts.ClassDeclaration[] {
  const source = program()
    .getSourceFiles()
    .find((candidate) => candidate.fileName.endsWith(fileName));
  if (source === undefined) throw new Error(`kernel source ${fileName} not found in the program`);
  return source.statements.filter((statement): statement is ts.ClassDeclaration => ts.isClassDeclaration(statement));
}

/** Every identifier named anywhere inside a type node, at any depth. */
function identifiersIn(node: ts.Node): Set<string> {
  const names = new Set<string>();
  const visit = (candidate: ts.Node): void => {
    if (ts.isIdentifier(candidate)) names.add(candidate.text);
    candidate.forEachChild(visit);
  };
  visit(node);
  return names;
}

/**
 * The kernel's `do*` helpers, classified by whether their declared result is a row of the
 * resource — read off `kernel/resource.ts` and `kernel/loaded.ts`, never listed here.
 *
 * The classification is textual and deliberately so: the question is what the helper
 * *declares*, and `Promise<Page<TRead>>` says so on its face. `TRead` is the base class's
 * own type parameter, so a helper mentioning it hands back this resource's row whatever
 * the subclass is; a helper that mentions `void`, `BulkWriteResponse` or `string[]`
 * instead does not, and needs no exemption because it was never in scope.
 */
function rowReturningHelpers(): Map<string, HelperInfo> {
  const helpers = new Map<string, HelperInfo>();
  for (const fileName of ["kernel/resource.ts", "kernel/loaded.ts"]) {
    for (const declaration of classDeclarationsIn(fileName)) {
      for (const member of declaration.members) {
        if (!ts.isMethodDeclaration(member) || !ts.isIdentifier(member.name)) continue;
        const name = member.name.text;
        if (!name.startsWith("do")) continue;
        if (member.type === undefined) continue;
        const named = identifiersIn(member.type);
        const returnsRow = named.has("TRead");
        // `doAction<TResult = TRead>` answers a row only when the caller lets the default
        // stand. `doCustomAction<TResult>` has no default, so it never does.
        const defaultsToRead = (member.typeParameters ?? []).some(
          (parameter) =>
            parameter.default !== undefined &&
            ts.isTypeReferenceNode(parameter.default) &&
            ts.isIdentifier(parameter.default.typeName) &&
            parameter.default.typeName.text === "TRead"
        );
        if (!returnsRow && !defaultsToRead) continue;
        helpers.set(name, { name, returnsRow, rowByDefaultOnly: !returnsRow && defaultsToRead });
      }
    }
  }
  return helpers;
}

const HELPERS = rowReturningHelpers();

/**
 * The source text of a type node.
 *
 * Sliced out of the file rather than asked of the node: the shared program is built
 * without parent pointers, so `Node.getText()` throws on the type nodes this file reads.
 */
function sourceTextOf(entry: ResourceEntry, node: ts.Node): string {
  const source = program()
    .getSourceFiles()
    .find((candidate) => path.normalize(candidate.fileName) === entry.file);
  if (source === undefined) return "<unreadable type>";
  return source.text.slice(node.pos, node.end).trim();
}

/** The read-model type name from `class X extends LoadsNavigableRows<Row, …>`. */
function readModelOf(entry: ResourceEntry): string | undefined {
  for (const clause of entry.declaration.heritageClauses ?? []) {
    if (clause.token !== ts.SyntaxKind.ExtendsKeyword) continue;
    for (const type of clause.types) {
      const argument = type.typeArguments?.[0];
      if (argument === undefined) continue;
      if (ts.isTypeReferenceNode(argument) && ts.isIdentifier(argument.typeName)) return argument.typeName.text;
    }
  }
  return undefined;
}

interface MethodBody {
  readonly name: string;
  readonly body: ts.Node;
  /** Every declaration's return type node — overloads and the implementation alike. */
  readonly returnTypes: ts.TypeNode[];
}

/** Public methods of a resource class, paired with their implementation body. */
function methodBodies(entry: ResourceEntry): MethodBody[] {
  const byName = new Map<string, { body?: ts.Node; returnTypes: ts.TypeNode[] }>();
  for (const member of entry.declaration.members) {
    if (!ts.isMethodDeclaration(member) && !ts.isPropertyDeclaration(member)) continue;
    if (!ts.isIdentifier(member.name)) continue;
    const name = member.name.text;
    if (name.startsWith("_")) continue;
    const modifiers = ts.getCombinedModifierFlags(member);
    if (modifiers & (ts.ModifierFlags.Private | ts.ModifierFlags.Protected | ts.ModifierFlags.Static)) continue;

    const record = byName.get(name) ?? { returnTypes: [] };
    if (ts.isMethodDeclaration(member)) {
      if (member.type !== undefined) record.returnTypes.push(member.type);
      if (member.body !== undefined) record.body = member.body;
    } else if (member.initializer !== undefined && ts.isArrowFunction(member.initializer)) {
      if (member.initializer.type !== undefined) record.returnTypes.push(member.initializer.type);
      record.body = member.initializer.body;
    } else {
      continue;
    }
    byName.set(name, record);
  }
  return [...byName.entries()]
    .filter((pair): pair is [string, { body: ts.Node; returnTypes: ts.TypeNode[] }] => pair[1].body !== undefined)
    .map(([name, record]) => ({ name, body: record.body, returnTypes: record.returnTypes }));
}

/** Names of `this.<name>(...)` calls in a body, with whether the call gave type arguments. */
function selfCalls(body: ts.Node): { name: string; hasTypeArguments: boolean }[] {
  const calls: { name: string; hasTypeArguments: boolean }[] = [];
  const visit = (node: ts.Node): void => {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.expression.kind === ts.SyntaxKind.ThisKeyword
    ) {
      calls.push({
        name: node.expression.name.text,
        hasTypeArguments: (node.typeArguments?.length ?? 0) > 0,
      });
    }
    node.forEachChild(visit);
  };
  visit(body);
  return calls;
}

const NAVIGABLE = navigableEntries();

describe("loader routing", () => {
  it("reads the kernel's row-returning helpers off the kernel itself", () => {
    // The non-vacuity floor for Half A, and the check that the derivation still *sees* the
    // kernel: if `rowReturningHelpers()` ever came back empty (a rename, a moved file, a
    // changed return-type spelling) the sweep below would pass by asking nothing.
    //
    // This asserts what the derivation concluded, not what it should conclude — these
    // names are the answer, not the input. `doDelete`/`doBulk*`/`doVoidAction`/`doBridge*`
    // are absent because their declared return types name no row, which is the whole point
    // of deriving rather than listing.
    expect([...HELPERS.keys()].sort()).toEqual([
      "doAction",
      "doCreate",
      "doFindOne",
      "doIterate",
      "doIterateAt",
      "doList",
      "doListAt",
      "doRetrieve",
      "doRetrieveAt",
      "doRetrieveSingleton",
      "doUpdate",
      "doUpdateSingleton",
      "doUpsert",
    ]);
    expect(
      [...HELPERS.values()]
        .filter((helper) => helper.rowByDefaultOnly)
        .map((helper) => helper.name)
        .sort()
    ).toEqual(["doAction", "doRetrieveSingleton", "doUpdateSingleton"]);
  });

  it("finds navigable resources, and row-returning methods on them, to check at all", () => {
    // Floors for both halves. Nineteen families are navigable; each has at least a
    // `retrieve`, so the population of methods that reach a row helper is large.
    expect(NAVIGABLE.length).toBeGreaterThanOrEqual(19);

    const reaching = NAVIGABLE.flatMap((entry) =>
      methodBodies(entry).filter((method) =>
        selfCalls(method.body).some((call) => {
          const helper = HELPERS.get(call.name);
          return helper !== undefined && (helper.returnsRow || !call.hasTypeArguments);
        })
      )
    );
    expect(reaching.length).toBeGreaterThanOrEqual(90);
  });

  it("routes every method that reaches a row helper through load/loadPage/loadIterate", () => {
    const offenders: string[] = [];
    for (const entry of NAVIGABLE) {
      for (const method of methodBodies(entry)) {
        const calls = selfCalls(method.body);
        const rowHelpers = calls
          .filter((call) => {
            const helper = HELPERS.get(call.name);
            if (helper === undefined) return false;
            // An explicit type argument replaces the `= TRead` default, so the call no
            // longer answers this resource's row — that is `doCustomAction`'s whole shape.
            return helper.returnsRow || !call.hasTypeArguments;
          })
          .map((call) => call.name);
        if (rowHelpers.length === 0) continue;
        if (calls.some((call) => LOADERS.has(call.name))) continue;
        offenders.push(
          `${entry.key}.${method.name}() calls ${[...new Set(rowHelpers)].sort().join("/")} and never ` +
            `load/loadPage/loadIterate, so the row it answers carries no navigation`
        );
      }
    }

    expect(offenders.sort()).toEqual([]);
  });

  it("never declares the bare read model as a return type where a loaded row is meant", () => {
    // Half B. Independent of the body: the read model comes from the heritage clause and
    // the return types from the signatures, so a method can only satisfy both by actually
    // being right.
    const offenders: string[] = [];
    for (const entry of NAVIGABLE) {
      const readModel = readModelOf(entry);
      if (readModel === undefined) continue;
      for (const method of methodBodies(entry)) {
        for (const returnType of method.returnTypes) {
          const named = identifiersIn(returnType);
          if (!named.has(readModel)) continue;
          if ([...named].some((name) => LOADED_PREFIX.test(name))) continue;
          offenders.push(
            `${entry.key}.${method.name}() declares \`${sourceTextOf(entry, returnType)}\` — a bare ` +
              `${readModel}, not a Loaded${readModel} — so its caller is typed as holding a row with ` +
              `no navigation`
          );
        }
      }
    }

    expect(offenders.sort()).toEqual([]);
  });

  it("names a read model for every navigable resource", () => {
    // The floor for Half B: a class whose heritage the scan cannot read is silently
    // exempt from it, so the exemption has to be impossible rather than unlikely.
    const unreadable = NAVIGABLE.filter((entry) => readModelOf(entry) === undefined)
      .map((entry) => entry.key)
      .sort();

    expect(unreadable).toEqual([]);
    expect(V2_ROOT.endsWith("v2")).toBe(true);
  });
});
