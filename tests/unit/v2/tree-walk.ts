/**
 * Derive the set of v2 resources the rule sweeps run over — by enumeration, not by
 * opportunity.
 *
 * Not a test file (the name matches neither jest pattern), so nothing here is collected;
 * it is the helper the four rule sweeps import.
 *
 * **The set is every resource class declared under `src/api/v2/`, minus an explicit
 * opt-out list.** That inversion is the point. Selecting the set by some property a
 * migration might not have got to yet — "classes with a `list`", "classes wired onto the
 * tree" — misses by construction: the Python port did exactly that and silently left 18
 * of its 90 classes outside every sweep, which is how the path-id rule came to be broken
 * across 16 of them with nothing failing. Enumerating instead makes inclusion the default
 * and exclusion a thing somebody has to write down.
 *
 * TypeScript has no `pkgutil`, so the enumeration is triangulated from three independent
 * derivations that must agree:
 *
 * 1. **Source** — every `class X extends V2Resource<…>` (or `extends LoadsNavigableRows<…>`)
 *    the TypeScript AST finds under `src/api/v2/`. This is the anchor: a class exists the
 *    moment it is written, whether or not it is exported, wired, or has a `list`.
 * 2. **Modules** — requiring each of those files and reading the class object back, which
 *    is what lets the sweeps instantiate a class and read its `path`/`operations`.
 * 3. **The public barrel** — the classes `src/api/v2/index.ts` actually exports.
 *
 * `resourceEntries()` asserts (1) and (2) line up; `path-id-naming.test.ts` asserts (3), and
 * asserts the constructed tree reaches every entry that is not opted out. A class
 * exported but unreachable, or reachable but unexported, fails.
 *
 * Classes are keyed by `<module path>#<ClassName>`, not by bare name: `Comments` and
 * `Links` each name two different resources (a work item's and a release's), and a
 * name-keyed set would silently hold one of each pair.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as ts from "typescript";
import { Configuration } from "../../../src/Configuration";
import * as v2Barrel from "../../../src/api/v2";
import { V2Namespace } from "../../../src/api/v2";
import { LoadsNavigableRows } from "../../../src/api/v2/kernel/loaded";
import { AnyOperationId, V2Resource } from "../../../src/api/v2/kernel/resource";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type AnyResource = V2Resource<any, any, any>;
export type ResourceClass = new (transport: V2Transport) => AnyResource;
/* eslint-enable @typescript-eslint/no-explicit-any */

export const V2_ROOT = path.join(__dirname, "../../../src/api/v2");

/** Constructing the tree makes no request, so any config works. */
export const WALK_CONFIG = new Configuration({ baseUrl: "https://api.example.com", apiKey: "secret" });

/** The abstract kernel bases: they extend/are `V2Resource` but are not resources themselves. */
const KERNEL_BASES: ReadonlySet<unknown> = new Set([V2Resource, LoadsNavigableRows]);
const KERNEL_BASE_NAMES: ReadonlySet<string> = new Set(["V2Resource", "LoadsNavigableRows"]);

/**
 * Resource classes still on the retired pre-flat shape, excluded from every rule sweep.
 *
 * **This list may only shrink.** `path-id-naming.test.ts` enforces that from both ends: it
 * fails if a name in here turns out to be flat-shaped after all (so a migrated class
 * cannot stay opted out), and its size is ratcheted so the list cannot grow back. Tasks 2
 * and 3 of the variant-F plan empty it; a name comes out as its class is migrated, and if
 * a sweep then fails, the resource is fixed — the name never goes back in.
 */
export const UNMIGRATED_RESOURCES: ReadonlySet<string> = new Set([
  "Assets#Assets",
  "Automations/ProjectAutomationActivities#ProjectAutomationActivities",
  "Automations/ProjectAutomationEdges#ProjectAutomationEdges",
  "Automations/ProjectAutomationNodes#ProjectAutomationNodes",
  "Automations/ProjectAutomations#ProjectAutomations",
  "Automations/WorkspaceAutomationActivities#WorkspaceAutomationActivities",
  "Automations/WorkspaceAutomationEdges#WorkspaceAutomationEdges",
  "Automations/WorkspaceAutomationNodes#WorkspaceAutomationNodes",
  "Automations/WorkspaceAutomations#WorkspaceAutomations",
  "Collections/Members#CollectionMembers",
  "Collections/Pages#CollectionPages",
  "Collections/index#Collections",
  "Customers/PropertyValues#CustomerPropertyValues",
  "Customers/Requests#CustomerRequests",
  "Customers/WorkItems#CustomerWorkItems",
  "Customers/index#Customers",
  "Cycles/WorkItems#CycleWorkItems",
  "Cycles/index#Cycles",
  "Estimates/Points#EstimatePoints",
  "Estimates/index#Estimates",
  "Features#ProjectFeatures",
  "Features#WorkspaceFeatures",
  "GroupSync/Config#GroupSyncConfigResource",
  "GroupSync/ProjectMappings#GroupSyncProjectMappings",
  "GroupSync/WorkspaceMappings#GroupSyncWorkspaceMappings",
  "Initiatives/Labels#InitiativeLabels",
  "Initiatives/Projects#InitiativeProjects",
  "Initiatives/WorkItems#InitiativeWorkItems",
  "Initiatives/index#Initiatives",
  "Intakes#Intakes",
  "Invitations#Invitations",
  "Members#ProjectMembers",
  "Milestones/WorkItems#MilestoneWorkItems",
  "Milestones/index#Milestones",
  "Modules/WorkItems#ModuleWorkItems",
  "Modules/index#Modules",
  "Pages#ProjectPages",
  "ProjectWorklogs#ProjectWorklogs",
  "Releases/Changelog#Changelog",
  "Releases/Comments#Comments",
  "Releases/Labels#ReleaseLabels",
  "Releases/Links#Links",
  "Releases/Tags#ReleaseTags",
  "Releases/WorkItems#ReleaseWorkItems",
  "Releases/index#Releases",
  "UserAssets#UserAssets",
  "UsersMe#Users",
  "WebhookLogs#WebhookLogs",
  "Webhooks#Webhooks",
  "WikiPages#WikiPages",
  "WorkItemProperties/Options#WorkItemPropertyOptions",
  "WorkItemProperties/index#WorkItemProperties",
  "WorkItemTypes/Properties#WorkItemTypeProperties",
  "WorkItemTypes/index#WorkItemTypes",
  "WorkItems/Activities#Activities",
  "WorkItems/Attachments#Attachments",
  "WorkItems/Dependencies#Dependencies",
  "WorkItems/Links#Links",
  "WorkItems/Relations#Relations",
  "WorkItems/WorkLogs#WorkLogs",
  "Workflows/States#WorkflowStates",
  "Workflows/Transitions#WorkflowTransitions",
  "Workflows/index#Workflows",
  "WorkspaceMembers#WorkspaceMembers",
  "WorkspaceWorkItemProperties/Contexts#WorkItemPropertyContexts",
  "WorkspaceWorkItemProperties/Options#WorkspaceWorkItemPropertyOptions",
  "WorkspaceWorkItemProperties/index#WorkspaceWorkItemProperties",
  "WorkspaceWorkItemTypes/Properties#WorkspaceWorkItemTypeProperties",
  "WorkspaceWorkItemTypes/index#WorkspaceWorkItemTypes",
  "WorkspaceWorkItems#WorkspaceWorkItems",
]);

/** How large `UNMIGRATED_RESOURCES` is allowed to be. A ratchet: lower it, never raise it. */
export const UNMIGRATED_CEILING = 70;

// -- Source scan ---------------------------------------------------------------------

let sourceProgram: ts.Program | undefined;

/** One TypeScript program over `src/`, built once and shared by every sweep (~0.4s). */
export function program(): ts.Program {
  if (sourceProgram === undefined) {
    const repoRoot = path.join(__dirname, "../../..");
    const configPath = path.join(repoRoot, "tsconfig.json");
    const parsed = ts.parseJsonConfigFileContent(
      ts.readConfigFile(configPath, ts.sys.readFile).config,
      ts.sys,
      repoRoot
    );
    sourceProgram = ts.createProgram(parsed.fileNames, parsed.options);
  }
  return sourceProgram;
}

/** `/abs/src/api/v2/WorkItems/Comments.ts` -> `WorkItems/Comments`. */
function moduleNameOf(file: string): string {
  return path.relative(V2_ROOT, file).replace(/\.ts$/, "");
}

function isResourceHeritage(node: ts.ClassDeclaration): boolean {
  for (const clause of node.heritageClauses ?? []) {
    if (clause.token !== ts.SyntaxKind.ExtendsKeyword) continue;
    for (const type of clause.types) {
      // `.text`, not `.getText()`: the latter re-reads the source file, which is not
      // available for every node the program hands back.
      if (!ts.isIdentifier(type.expression)) continue;
      if (KERNEL_BASE_NAMES.has(type.expression.text)) return true;
    }
  }
  return false;
}

export interface ResourceEntry {
  /** `WorkItems/Comments#Comments` — unique even where two resources share a class name. */
  readonly key: string;
  readonly name: string;
  /** Module path relative to `src/api/v2`, no extension. */
  readonly module: string;
  readonly file: string;
  readonly declaration: ts.ClassDeclaration;
  readonly cls: ResourceClass;
}

let entries: ResourceEntry[] | undefined;

/**
 * Every resource class declared under `src/api/v2/`, sorted by key.
 *
 * Membership does not depend on having a `list`, on being exported, on being wired, or on
 * anything else a migration might not have got to yet — which is precisely why it is the
 * base of the swept set.
 */
export function resourceEntries(): ResourceEntry[] {
  if (entries !== undefined) return entries;
  const found: ResourceEntry[] = [];
  for (const source of program().getSourceFiles()) {
    if (source.isDeclarationFile) continue;
    const file = path.normalize(source.fileName);
    if (!file.startsWith(path.normalize(V2_ROOT) + path.sep)) continue;
    if (file.includes(`${path.sep}generated${path.sep}`)) continue;
    for (const statement of source.statements) {
      if (!ts.isClassDeclaration(statement) || statement.name === undefined) continue;
      if (!isResourceHeritage(statement)) continue;
      const name = statement.name.text;
      if (KERNEL_BASE_NAMES.has(name)) continue;
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const module_: Record<string, unknown> = require(file);
      const cls = module_[name];
      if (typeof cls !== "function" || !(cls.prototype instanceof V2Resource)) {
        throw new Error(
          `${moduleNameOf(file)} declares class ${name} extending V2Resource, but requiring the ` +
            `module does not yield it as an exported class. Every resource class must be exported ` +
            `from the file that declares it, or the sweeps cannot instantiate it.`
        );
      }
      found.push({
        key: `${moduleNameOf(file)}#${name}`,
        name,
        module: moduleNameOf(file),
        file,
        declaration: statement,
        cls: cls as ResourceClass,
      });
    }
  }
  entries = found.sort((left, right) => left.key.localeCompare(right.key));
  return entries;
}

/** The swept set: every entry except the ones explicitly opted out as still pre-flat. */
export function migratedEntries(): ResourceEntry[] {
  return resourceEntries().filter((entry) => !UNMIGRATED_RESOURCES.has(entry.key));
}

/** Every resource class the public barrel (`src/api/v2/index.ts`) exports, by class object. */
export function exportedResourceClasses(): Set<unknown> {
  const exported = new Set<unknown>();
  for (const value of Object.values(v2Barrel as Record<string, unknown>)) {
    if (typeof value !== "function") continue;
    if (!(value.prototype instanceof V2Resource)) continue;
    if (KERNEL_BASES.has(value)) continue;
    exported.add(value);
  }
  return exported;
}

// -- Runtime tree --------------------------------------------------------------------

/** A fresh instance, built with the transport alone — the flat constructor contract. */
export function instantiate(entry: ResourceEntry): AnyResource {
  return new entry.cls(new V2Transport(WALK_CONFIG));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function readProtected<T>(resource: AnyResource, key: string): T {
  return (resource as any)[key] as T;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function pathOf(resource: AnyResource): string {
  return readProtected<string>(resource, "path");
}

export function extraPathsOf(resource: AnyResource): Record<string, string> {
  return readProtected<Record<string, string>>(resource, "extraPaths") ?? {};
}

export function operationsOf(resource: AnyResource): Record<string, AnyOperationId> {
  return readProtected<Record<string, AnyOperationId>>(resource, "operations") ?? {};
}

/** The child resources an instance attaches in its own constructor, by attribute name. */
export function childResources(resource: AnyResource): Map<string, AnyResource> {
  const children = new Map<string, AnyResource>();
  for (const [name, value] of Object.entries(resource)) {
    if (name.startsWith("_")) continue;
    if (value instanceof V2Resource) children.set(name, value);
  }
  return children;
}

/**
 * Every resource class reachable by attribute access from a constructed `V2Namespace`,
 * mapped to the dotted path it was first reached by (`v2.projects.states`).
 *
 * The locator chain is seeded explicitly because `workspace(slug)`/`project(key)` are
 * *methods*, not attributes: an unmigrated family is still only reachable through them.
 * The seeds go away with the locators in the last task of the plan, and this becomes a
 * plain attribute walk from the root.
 */
export function reachableResources(): Map<unknown, string> {
  const namespace = new V2Namespace(WALK_CONFIG);
  const found = new Map<unknown, string>();

  const walk = (node: object, prefix: string): void => {
    for (const [name, child] of Object.entries(node)) {
      if (name.startsWith("_")) continue;
      if (typeof child !== "object" || child === null) continue;
      // Skip the plumbing by *type*, never by attribute name: `GroupSync`'s config
      // singleton is a resource attached under the attribute `config`, and a name-based
      // skip list quietly left it outside every sweep until this walk was proved.
      if (child instanceof V2Transport || child instanceof Configuration) continue;
      const dotted = `${prefix}.${name}`;
      if (child instanceof V2Resource) {
        if (found.has(child.constructor)) continue;
        found.set(child.constructor, dotted);
        walk(child, dotted);
      } else if (child.constructor?.name !== "Object" && child.constructor?.name !== "Array") {
        // A grouping node (`Wiki`, `GroupSync`) holds no `V2Resource` base of its own but
        // does hold children, so descend rather than skip.
        walk(child, dotted);
      }
    }
  };

  walk(namespace, "v2");
  const workspace = namespace.workspace("acme");
  walk(workspace, 'v2.workspace("acme")');
  walk(workspace.project("ENG"), 'v2.workspace("acme").project("ENG")');
  return found;
}

// -- URL templates -------------------------------------------------------------------

const TEMPLATE_KEY = /\{(\w+)\}/g;

/** The `{...}` placeholders a URL template names, in path order. */
export function templateKeys(template: string): string[] {
  return [...template.matchAll(TEMPLATE_KEY)].map((match) => match[1]);
}

/**
 * The parameter names a flat-shaped method on `template` must open with: every `{...}`
 * placeholder, in path order, with the golden's `_id` suffix dropped
 * (`.../projects/{project_id}/cycles/` -> `["slug", "project"]`).
 */
export function expectedLeadingPathIds(template: string): string[] {
  const names: string[] = [];
  for (const key of templateKeys(template)) {
    // The golden's `{work_item_id}` is the parameter `workItem`: the `_id` suffix is
    // dropped and the rest is camel-cased, because that is how a Node parameter is
    // spelled. The template keeps the golden's own spelling.
    const stem = key.endsWith("_id") ? key.slice(0, -"_id".length) : key;
    const name = stem
      .split("_")
      .filter((part) => part.length > 0)
      .map((part, index) => (index === 0 ? part : part[0].toUpperCase() + part.slice(1)))
      .join("");
    if (!names.includes(name)) names.push(name);
  }
  return names;
}

/** The template a method builds its URL from: its `extraPaths` override, else `path`. */
export function templateFor(resource: AnyResource, method: string): string {
  return extraPathsOf(resource)[method] ?? pathOf(resource);
}

// -- Method signatures, read off the TypeScript source -------------------------------

export interface MethodInfo {
  readonly name: string;
  /** Parameter names of the first declared signature — what a caller sees in hover. */
  readonly parameterNames: string[];
  /**
   * Parameter names of *every* declaration: each overload plus the implementation.
   *
   * The rules are checked against all of them, not just the first. An overload set can
   * disagree with itself — renaming only the implementation leaves the hover text intact
   * and the rule quietly half-broken, which is exactly what happened when this sweep was
   * first proved.
   */
  readonly signatures: string[][];
  /** Property names reachable on any object-typed parameter, across every overload. */
  readonly optionProperties: Set<string>;
  /** The method's own doc comment text, lowercased. */
  readonly documentation: string;
}

const methodCache = new Map<string, Map<string, MethodInfo>>();

function optionPropertiesOf(parameter: ts.ParameterDeclaration, checker: ts.TypeChecker): string[] {
  if (parameter.type === undefined) return [];
  // Arrays and primitives carry no caller-facing options; a write DTO is an object but
  // never declares `fields`/`expand`, which is all the sweeps look for here.
  if (ts.isArrayTypeNode(parameter.type)) return [];
  const type = checker.getNonNullableType(checker.getTypeAtLocation(parameter));
  return checker.getPropertiesOfType(type).map((symbol) => symbol.getName());
}

/**
 * Every public method a resource class declares, read off the TypeScript AST.
 *
 * The source, not the runtime, because parameter *names* are the rule being enforced and
 * type erasure destroys everything else: a compiled method has no parameter types, no
 * overloads and no doc comments.
 */
export function classMethods(entry: ResourceEntry): Map<string, MethodInfo> {
  const cached = methodCache.get(entry.key);
  if (cached !== undefined) return cached;

  const checker = program().getTypeChecker();
  const methods = new Map<string, MethodInfo>();
  for (const member of entry.declaration.members) {
    if (!ts.isMethodDeclaration(member) && !ts.isPropertyDeclaration(member)) continue;
    if (!ts.isIdentifier(member.name)) continue;
    const name = member.name.text;
    if (name.startsWith("_")) continue;
    const modifiers = ts.getCombinedModifierFlags(member);
    if (modifiers & (ts.ModifierFlags.Private | ts.ModifierFlags.Protected | ts.ModifierFlags.Static)) continue;

    let signature: ts.SignatureDeclaration | undefined;
    if (ts.isMethodDeclaration(member)) {
      signature = member;
    } else if (member.initializer !== undefined && ts.isArrowFunction(member.initializer)) {
      // A class field assigned an arrow function is a public method too.
      signature = member.initializer;
    } else {
      continue;
    }

    const parameterNames = signature.parameters.map((parameter) =>
      ts.isIdentifier(parameter.name) ? parameter.name.text : "<destructured>"
    );
    const optionProperties = new Set<string>();
    for (const parameter of signature.parameters) {
      for (const property of optionPropertiesOf(parameter, checker)) optionProperties.add(property);
    }
    const symbol = checker.getSymbolAtLocation(member.name);
    const documentation = ts.displayPartsToString(symbol?.getDocumentationComment(checker) ?? []).toLowerCase();

    const existing = methods.get(name);
    if (existing === undefined) {
      methods.set(name, { name, parameterNames, signatures: [parameterNames], optionProperties, documentation });
    } else {
      existing.signatures.push(parameterNames);
      // An overload set: the first declaration supplies the parameter names a caller
      // sees; every declaration contributes its reachable options, so a `fields` that
      // only the narrowing overload declares still counts as offered.
      for (const property of optionProperties) existing.optionProperties.add(property);
    }
  }
  methodCache.set(entry.key, methods);
  return methods;
}

/** A resource's own public methods that are not the kernel's, keyed by name. */
export function publicMethods(entry: ResourceEntry): MethodInfo[] {
  return [...classMethods(entry).values()];
}

// -- Option coverage (the `fields`/`expand` sweeps share this derivation) -------------

/** Methods that answer with another action's operation: `iterate` pages `list`. */
export const ACTION_ALIASES: Readonly<Record<string, string>> = { iterate: "list" };

/**
 * `delete` answers 204 with no body, so a query parameter that shapes the response has
 * nothing to shape — even though the golden happily declares `fields` and `expand` on
 * every `*_destroy` operation. Excluded deliberately, not overlooked.
 */
export const NO_RESPONSE_BODY: ReadonlySet<string> = new Set(["delete"]);

export interface CapableMethod {
  readonly entry: ResourceEntry;
  readonly method: MethodInfo;
  readonly operationId: AnyOperationId;
  readonly values: readonly string[];
}

/**
 * Every migrated method whose own operation declares the option `table` describes, and
 * that returns a body at all.
 *
 * `table` is the golden's own `FIELDS` or `EXPAND` map, so the question asked is always
 * "does the API offer this here", never "did somebody remember to list this method".
 */
export function methodsOffering(table: Record<string, readonly string[]>): CapableMethod[] {
  const found: CapableMethod[] = [];
  for (const entry of migratedEntries()) {
    const operations = operationsOf(instantiate(entry));
    for (const method of publicMethods(entry)) {
      const action = ACTION_ALIASES[method.name] ?? method.name;
      if (NO_RESPONSE_BODY.has(action)) continue;
      const operationId = operations[action];
      if (operationId === undefined) continue;
      const values = table[operationId];
      if (values !== undefined && values.length > 0) found.push({ entry, method, operationId, values });
    }
  }
  return found;
}

/** Every resource whose fetches answer with navigable rows — i.e. that extends `LoadsNavigableRows`. */
export function navigableEntries(): ResourceEntry[] {
  return resourceEntries().filter((entry) => entry.cls.prototype instanceof LoadsNavigableRows);
}

/** Reachable-from-source, for the "did the walk break?" floors the sweeps assert. */
export function walkFiles(): string[] {
  const files: string[] = [];
  const walk = (dir: string): void => {
    for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, dirent.name);
      if (dirent.isDirectory()) {
        if (dirent.name === "generated") continue;
        walk(full);
      } else if (dirent.name.endsWith(".ts")) {
        files.push(full);
      }
    }
  };
  walk(V2_ROOT);
  return files.sort();
}
