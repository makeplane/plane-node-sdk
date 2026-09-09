/**
 * Every TypeScript sample in the repository's documents is type-checked against the real
 * SDK, and the prose claims that can be checked mechanically are.
 *
 * **Why this is a test and not a one-off.** The Python port shipped a documented call
 * that threw — and it was outside a code fence, in prose, where nothing could have caught
 * it. Fences at least *can* be checked, so they are: this compiles the samples against
 * `src/`, which catches a renamed method, a changed parameter order, a dropped option and
 * an id that moved position, on the day it happens rather than in a work item.
 *
 * **This gate has now been weaker than the code three times, and each hole is pinned
 * below by the check that closes it.** Every one of them was the same shape — the gate was
 * easier to pass than the code was to get right — so the rule for changing this file is
 * the rule for changing a sweep: introduce the defect, watch the check name it, revert.
 *
 * 1. *The fence marker was part of the gate.* The extractor matched ` ```ts ` exactly, the
 *    Quick Start block was fenced ` ```typescript `, and the floor assertion passed on the
 *    twelve blocks it did see. That one unchecked block named a package that does not
 *    exist (`@plane/node-sdk`), declared `const client` twice, and called `projects.list()`
 *    without its required workspace slug. Closed by {@link classify}, which now refuses a
 *    fence in *any* language it does not know what to do with — **including an untagged
 *    one**, which the previous census could not see at all because it counted
 *    ` ```(\w+) ` and a bare ``` carries no word.
 * 2. *Imports were stripped before compiling*, so a sample could import a name the package
 *    does not export and still pass; only the module *specifier* was string-compared.
 *    Closed by {@link harness}, which now keeps every import, rewrites the published
 *    package name to `./src`, and lets the compiler resolve the named bindings.
 * 3. *The caps check was context-blind.* It held a set `{50, 100}` and skipped any stated
 *    number in it, so writing the bridge cap where the bulk cap belongs — the exact defect
 *    it was built for — passed. Closed by {@link capsIn}, which binds each stated number
 *    to the *nearest* cap constant named beside it and compares against that constant's
 *    real value: 100 is correct next to `BRIDGE_MAX_IDS` and wrong next to
 *    `BULK_MAX_ITEMS`.
 *
 * A fourth hole was found by the same review and is closed by
 * {@link documentedV2Names}: `v2.BRIDGE_MAX_IDS` was documented in two places and never
 * exported, so a reader sizing a batch off it got `undefined`. Nothing compiled that name,
 * because it appears in prose rather than in a fence.
 *
 * The samples are wrapped, not rewritten: imports are hoisted and merged (one import list
 * serves the whole harness), each block becomes its own function so blocks can reuse
 * names, and ids the prose leaves as `cycleId`/`itemId` are declared. Nothing else is
 * edited, so a sample that only compiles after a fix-up here would fail — which is the
 * point.
 *
 * **Prose is checked too, as far as prose can be.** Four claims in the docs are not really
 * prose at all — they are assertions about files, scripts, exports and constants that
 * exist. Each one below has been wrong in a shipped document at least once.
 *
 * The README's *negative* claims — "this line would not compile" — are pinned at the
 * bottom as `@ts-expect-error`, which fails in both directions: the line must not compile,
 * and if it ever starts compiling the unused directive fails the build.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as ts from "typescript";
import * as v2Namespace from "../../../src/api/v2";
import { PlaneClient } from "../../../src/client/plane-client";

const REPO_ROOT = path.join(__dirname, "../../..");

/**
 * The documents this gate covers.
 *
 * `README.md` is what a user reads, `CLAUDE.md` and `AGENTS.MD` are what an agent reads,
 * and the same commits rewrite all three. Leaving `CLAUDE.md` out is how it came to state
 * a cap that `README.md` contradicted; leaving `AGENTS.MD` out is how eight TypeScript
 * fences went uncompiled.
 */
const DOCUMENTS = ["README.md", "CLAUDE.md", "AGENTS.MD"] as const;

/**
 * The documents that describe the v2 batch caps, and so must state both of them.
 *
 * `AGENTS.MD` is deliberately not here: it describes conventions, not the v2 kernel, and a
 * document is not obliged to mention a cap. Stating a *wrong* one is checked everywhere.
 */
const CAP_DOCUMENTS = ["README.md", "CLAUDE.md"] as const;

/** Fence languages compiled as TypeScript. */
const TS_LANGUAGES = new Set(["ts", "typescript", "tsx", "typescriptreact"]);

/** Fence languages that are shell commands: scanned for repo paths, not compiled. */
const SHELL_LANGUAGES = new Set(["bash", "sh", "shell", "console", "zsh"]);

/**
 * Fence languages that are data or plain prose — a directory tree, a `package.json`
 * excerpt — which nothing can type-check and nobody pastes into a `.ts` file.
 *
 * This list is the gate's one escape hatch, so it is spelled out rather than inferred: a
 * fence whose language is not in one of the three sets fails, and the fix is either to tag
 * it correctly or to add the language here deliberately.
 */
const INERT_LANGUAGES = new Set(["json", "jsonc", "text", "txt", "diff", "yaml", "yml", "markdown", "md", "mermaid"]);

/** Ids and flags the prose introduces without ceremony, so a sample can read naturally. */
const PREAMBLE = [
  `declare const client: PlaneClient;`,
  ...[
    "cycleId",
    "itemId",
    "moduleId",
    "releaseId",
    "labelId",
    "initiativeId",
    "projectId",
    "collectionId",
    "userId",
    "typeId",
    "propertyId",
    "estimateId",
  ].map((name) => `declare const ${name}: string;`),
  `declare const includeColor: boolean;`,
  `void client;`,
];

interface Fence {
  document: string;
  /** 1-based line of the opening fence, so a failure points at the source. */
  line: number;
  /** The info string, lowercased and trimmed; `""` for an untagged fence. */
  language: string;
  body: string;
}

function read(document: string): string {
  return fs.readFileSync(path.join(REPO_ROOT, document), "utf8");
}

/**
 * Every fence in a document, paired by scanning lines rather than by matching a regex.
 *
 * A regex over the whole text can only find the fences it already knows the shape of,
 * which is how an untagged fence stayed invisible: ` ```(\w+) ` requires a language word.
 * Pairing openers with closers instead means *every* fence is seen, and the info string —
 * present, absent or nonsense — is data the caller classifies rather than the filter that
 * decides whether the fence exists.
 *
 * Fences nested in list items are indented, so the opener's indent is stripped from the
 * body; the closer is a bare ``` at any indent.
 */
function fencesIn(document: string): Fence[] {
  const lines = read(document).split("\n");
  const fences: Fence[] = [];
  let open: { line: number; language: string; indent: string; body: string[] } | null = null;

  lines.forEach((text, index) => {
    const match = /^(\s*)```(.*)$/.exec(text);
    if (open === null) {
      if (match) {
        open = { line: index + 1, language: match[2].trim().toLowerCase(), indent: match[1], body: [] };
      }
      return;
    }
    if (match && match[2].trim() === "") {
      fences.push({ document, line: open.line, language: open.language, body: open.body.join("\n") });
      open = null;
      return;
    }
    open.body.push(text.startsWith(open.indent) ? text.slice(open.indent.length) : text);
  });

  // An unterminated fence swallows the rest of the file, so it is reported, not dropped.
  if (open !== null) {
    fences.push({ document, line: (open as { line: number }).line, language: "<unterminated>", body: "" });
  }
  return fences;
}

type FenceKind = "typescript" | "shell" | "inert" | "unknown";

function classify(fence: Fence): FenceKind {
  if (TS_LANGUAGES.has(fence.language)) return "typescript";
  if (SHELL_LANGUAGES.has(fence.language)) return "shell";
  if (INERT_LANGUAGES.has(fence.language)) return "inert";
  return "unknown";
}

const ALL_FENCES = DOCUMENTS.flatMap((document) => fencesIn(document));

function fencesOfKind(kind: FenceKind): Fence[] {
  return ALL_FENCES.filter((fence) => classify(fence) === kind);
}

interface ImportGroup {
  defaults: Set<string>;
  namespaces: Set<string>;
  named: Set<string>;
}

/**
 * The module specifier a sample should be compiled against.
 *
 * A sample importing the published package name is compiled against `src/` — that is the
 * whole point of the rewrite: `{ PlaneClient, ThisExportDoesNotExist }` then fails to
 * resolve, where stripping the line left it unchecked. Anything else (a dependency,
 * `node:*`) is left alone and resolves normally.
 */
function rewriteSpecifier(specifier: string): string {
  return specifier === manifest().name ? "./src" : specifier;
}

let manifestCache: { name: string; scripts: Record<string, string>; dependencies: Record<string, string> } | undefined;
function manifest(): { name: string; scripts: Record<string, string>; dependencies: Record<string, string> } {
  manifestCache ??= JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "package.json"), "utf8"));
  return manifestCache!;
}

/**
 * The samples, wrapped one function each so two blocks may both declare `client`, with
 * every import kept and merged at module scope.
 *
 * Imports cannot stay inside the wrapper functions — an `import` is a module-level
 * statement — so they are hoisted and unioned per specifier. That is what makes the named
 * bindings real: the compiler resolves each one against the module it names.
 */
function harness(samples: string[]): string {
  const groups = new Map<string, ImportGroup>();
  const bodies: string[] = [];

  const groupFor = (specifier: string): ImportGroup => {
    const key = rewriteSpecifier(specifier);
    let group = groups.get(key);
    if (group === undefined) {
      group = { defaults: new Set(), namespaces: new Set(), named: new Set() };
      groups.set(key, group);
    }
    return group;
  };

  // `PlaneClient` is named in the preamble's `declare const client`, so the harness itself
  // needs it whether or not a sample happens to import it.
  groupFor(manifest().name).named.add("PlaneClient");

  samples.forEach((sample, index) => {
    const parsed = ts.createSourceFile(`sample${index}.ts`, sample, ts.ScriptTarget.ES2020, true);
    const drop: ts.TextRange[] = [];

    for (const statement of parsed.statements) {
      if (!ts.isImportDeclaration(statement)) continue;
      drop.push({ pos: statement.getStart(parsed), end: statement.getEnd() });
      if (!ts.isStringLiteral(statement.moduleSpecifier)) continue;
      const group = groupFor(statement.moduleSpecifier.text);
      const clause = statement.importClause;
      if (clause === undefined) continue;
      if (clause.name) group.defaults.add(clause.name.text);
      if (clause.namedBindings && ts.isNamespaceImport(clause.namedBindings)) {
        group.namespaces.add(clause.namedBindings.name.text);
      }
      if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
        for (const element of clause.namedBindings.elements) {
          group.named.add(
            element.propertyName ? `${element.propertyName.text} as ${element.name.text}` : element.name.text
          );
        }
      }
    }

    // Blank the import ranges rather than filtering lines: line numbers stay stable, and a
    // multi-line import clause is removed whole.
    let body = sample;
    for (const range of [...drop].reverse()) {
      body = body.slice(0, range.pos) + " ".repeat(range.end - range.pos) + body.slice(range.end);
    }
    const indented = body
      .split("\n")
      .map((line) => (line.trim() === "" ? "" : `  ${line}`))
      .join("\n");
    bodies.push(`export async function documentSample${index}(): Promise<void> {\n${indented}\n}`);
  });

  const imports = [...groups.entries()].flatMap(([specifier, group]) => {
    const lines: string[] = [];
    for (const name of [...group.namespaces].sort()) lines.push(`import * as ${name} from "${specifier}";`);
    const clause = [...group.defaults].sort().join(", ");
    const named = [...group.named].sort().join(", ");
    if (clause && named) lines.push(`import ${clause}, { ${named} } from "${specifier}";`);
    else if (clause) lines.push(`import ${clause} from "${specifier}";`);
    else if (named) lines.push(`import { ${named} } from "${specifier}";`);
    return lines;
  });

  return [...imports, "", ...PREAMBLE, "", ...bodies].join("\n");
}

/** The compiler options the samples are checked under — the repo's own, without emit. */
function compilerOptions(): ts.CompilerOptions {
  const parsed = ts.parseJsonConfigFileContent(
    ts.readConfigFile(path.join(REPO_ROOT, "tsconfig.json"), ts.sys.readFile).config,
    ts.sys,
    REPO_ROOT
  );
  return { ...parsed.options, noEmit: true, declaration: false, declarationMap: false };
}

/**
 * Every name `src/api/v2` exports, values and types alike.
 *
 * Read through the checker rather than `Object.keys(v2Namespace)`, because half the names
 * the README documents (`v2.StateField`) are type-only and have no runtime presence.
 */
let v2ExportsCache: Set<string> | undefined;
function v2Exports(): Set<string> {
  if (v2ExportsCache) return v2ExportsCache;
  const entry = path.join(REPO_ROOT, "src/api/v2/index.ts");
  const program = ts.createProgram([entry], compilerOptions());
  const checker = program.getTypeChecker();
  const source = program.getSourceFile(entry)!;
  const symbol = checker.getSymbolAtLocation(source)!;
  v2ExportsCache = new Set(checker.getExportsOfModule(symbol).map((exported) => exported.getName()));
  return v2ExportsCache;
}

/** Every `` `v2.name` `` the documents write in prose or in a fence. */
function documentedV2Names(): { document: string; name: string }[] {
  return DOCUMENTS.flatMap((document) =>
    [...read(document).matchAll(/`v2\.([A-Za-z_$][\w$]*)/g)].map((match) => ({ document, name: match[1] }))
  );
}

const CAPS: Record<string, number> = {
  BULK_MAX_ITEMS: v2Namespace.BULK_MAX_ITEMS,
  BRIDGE_MAX_IDS: v2Namespace.BRIDGE_MAX_IDS,
};

/** `` `BRIDGE_MAX_IDS` (100) `` — a constant that states its own value. */
const CAP_BINDING = /`(?:v2\.)?(BULK_MAX_ITEMS|BRIDGE_MAX_IDS)`\s*\((\d+)\)/g;

/** The shapes a cap is stated in as a bare number: "1..100", "50 items per call", … */
const CAP_STATEMENT =
  /(?:1\.\.\*{0,2}(\d+)|\*{0,2}(\d+)\*{0,2} (?:ids|items) per call|at most \*{0,2}(\d+)\*{0,2} (?:ids|items)|caps? (?:is|at|of) \*{0,2}(\d+))/g;

interface CapClaim {
  document: string;
  /** The constant the sentence is about, or `undefined` when it names none. */
  constant: string | undefined;
  stated: number;
  quote: string;
}

/**
 * Every batch cap a document states, bound to the constant it is stated *about*.
 *
 * The binding is the whole check. A set of allowed numbers cannot tell "a bridge takes 100
 * ids" from "a bulk write takes 100 items", and the second is the defect this was built
 * for. So each bare number is attached to the nearest cap constant named beside it — the
 * docs always name one, because a number without a name is not a documented cap — and the
 * comparison is against *that* constant's value.
 */
function capsIn(document: string): CapClaim[] {
  const text = read(document);
  const claims: CapClaim[] = [];

  for (const match of text.matchAll(CAP_BINDING)) {
    claims.push({ document, constant: match[1], stated: Number(match[2]), quote: match[0] });
  }

  const mentions = [...text.matchAll(/\b(BULK_MAX_ITEMS|BRIDGE_MAX_IDS)\b/g)].map((match) => ({
    index: match.index!,
    constant: match[1],
  }));

  for (const match of text.matchAll(CAP_STATEMENT)) {
    const stated = Number(match[1] ?? match[2] ?? match[3] ?? match[4]);
    const at = match.index!;
    // Nearest by character distance, within one sentence's reach. Both constants appear in
    // the same paragraph of the README, so a "does either name appear nearby" test would
    // be exactly as blind as the set it replaces.
    let nearest: { constant: string; distance: number } | undefined;
    for (const mention of mentions) {
      const distance = mention.index < at ? at - mention.index : mention.index - at - match[0].length;
      if (distance > 160) continue;
      if (nearest === undefined || distance < nearest.distance) nearest = { constant: mention.constant, distance };
    }
    claims.push({ document, constant: nearest?.constant, stated, quote: match[0] });
  }

  return claims;
}

describe("documented samples", () => {
  it("leaves no fence in a language this gate cannot account for", () => {
    // The stronger version of the old census, which counted ` ```(\w+) ` and therefore
    // could not see an untagged fence at all — a broken sample inside one was invisible.
    const offenders = ALL_FENCES.filter((fence) => classify(fence) === "unknown").map(
      (fence) =>
        `${fence.document}:${fence.line} opens a fence tagged ${fence.language === "" ? "(nothing)" : `\`${fence.language}\``}` +
        `, which is neither TypeScript (compiled), shell (path-checked) nor a declared inert language` +
        ` — an unaccounted fence is a sample nothing checks`
    );

    expect(offenders).toEqual([]);
  });

  it("finds the samples at all", () => {
    // A floor well under the real 15, not a pin: its only job is to make a broken
    // extractor red rather than vacuously green. The census above is what refuses a fence
    // the gate is not accounting for, so this does not need to track the count.
    expect(fencesOfKind("typescript").length).toBeGreaterThanOrEqual(12);
  });

  it("type-checks every fenced TypeScript block against the SDK", () => {
    const fences = fencesOfKind("typescript");
    const virtualPath = path.join(REPO_ROOT, "__document-samples__.ts");
    const source = harness(fences.map((fence) => fence.body));

    const options = compilerOptions();
    const host = ts.createCompilerHost(options, true);
    const readFile = host.readFile.bind(host);
    const getSourceFile = host.getSourceFile.bind(host);
    host.readFile = (name) => (path.normalize(name) === virtualPath ? source : readFile(name));
    host.fileExists = (name) => path.normalize(name) === virtualPath || ts.sys.fileExists(name);
    host.getSourceFile = (name, languageVersion, onError, shouldCreate) =>
      path.normalize(name) === virtualPath
        ? ts.createSourceFile(name, source, languageVersion, true)
        : getSourceFile(name, languageVersion, onError, shouldCreate);

    const program = ts.createProgram([virtualPath], options, host);
    const file = program.getSourceFile(virtualPath)!;
    const failures = ts
      .getPreEmitDiagnostics(program, file)
      .filter((diagnostic) => diagnostic.file?.fileName === file.fileName)
      .map((diagnostic) => {
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, " ");
        if (diagnostic.start === undefined) return `document sample: ${message}`;
        const { line } = file.getLineAndCharacterOfPosition(diagnostic.start);
        return `document sample, at \`${source.split("\n")[line].trim()}\`: ${message}`;
      });

    expect(failures).toEqual([]);
  }, 120000);
});

/**
 * Claims in prose that are facts about this repository, checked against it.
 *
 * Prose cannot be compiled, but four kinds of claim in these documents are not really
 * prose at all — they are assertions about files, scripts, exports and constants that
 * exist. Each one below has been wrong in a shipped document at least once.
 */
describe("what the docs claim about this repository", () => {
  it("imports the package under the name it is actually published as", () => {
    // The compile above now resolves named bindings, so a wrong package name already fails
    // there — but with a "cannot find module" that does not say *which* name is right, and
    // only for `import`. This keeps the explanation, and catches `require()` too.
    const allowed = new Set([manifest().name, ...Object.keys(manifest().dependencies)]);
    const offenders: string[] = [];

    for (const fence of fencesOfKind("typescript")) {
      const specifiers = [
        ...[...fence.body.matchAll(/\bfrom\s+["']([^"']+)["']/g)].map((match) => match[1]),
        ...[...fence.body.matchAll(/\brequire\(\s*["']([^"']+)["']\s*\)/g)].map((match) => match[1]),
        ...[...fence.body.matchAll(/^\s*import\s+["']([^"']+)["']/gm)].map((match) => match[1]),
      ];
      for (const specifier of specifiers) {
        if (specifier.startsWith(".") || specifier.startsWith("node:")) continue;
        if (allowed.has(specifier)) continue;
        offenders.push(
          `${fence.document}:${fence.line} imports from "${specifier}", which is neither ${manifest().name} nor ` +
            `one of its dependencies — a reader copying that line gets a 404 from npm`
        );
      }
    }

    expect([...new Set(offenders)].sort()).toEqual([]);
  });

  it("documents only `v2.` names that are reachable under that prefix", () => {
    // `v2.BRIDGE_MAX_IDS` was documented in three places and exported from none, so a
    // caller sizing a batch off it read `undefined`. It appears in prose, not in a fence,
    // so nothing compiled it — and the same commit that widened this gate introduced it.
    // `v2` is written two ways in the docs and both are legitimate: the imported namespace
    // (`v2.FIELDS`) and the client's own namespace (`v2.workspaces`), so both surfaces
    // count as reachable.
    const client = new PlaneClient({ baseUrl: "https://plane.example.com", apiKey: "not-a-real-key" });
    const namespaceProperties = new Set<string>([
      ...Object.keys(client.v2),
      ...Object.getOwnPropertyNames(Object.getPrototypeOf(client.v2) as object),
    ]);
    const exported = v2Exports();

    const offenders = documentedV2Names()
      .filter(({ name }) => !exported.has(name) && !namespaceProperties.has(name))
      .map(
        ({ document, name }) =>
          `${document} documents \`v2.${name}\`, which \`src/api/v2\` does not export and the client's ` +
          `\`v2\` namespace does not carry — a reader reaching for it gets undefined`
      );

    expect([...new Set(offenders)].sort()).toEqual([]);
  }, 120000);

  it("tells the reader to run only scripts that exist", () => {
    const scripts = manifest().scripts;
    const offenders: string[] = [];

    for (const document of DOCUMENTS) {
      // `pnpm <script>` and `npm run <script>`, wherever they appear — fenced or in prose.
      for (const match of read(document).matchAll(/\b(?:pnpm run|pnpm|npm run|yarn)\s+([a-z][a-z0-9:-]*)/g)) {
        const script = match[1];
        // Package-manager verbs are not scripts.
        if (["install", "add", "remove", "exec", "dlx", "why", "run", "test", "build"].includes(script)) {
          if (script in scripts) continue;
          if (["install", "add", "remove", "exec", "dlx", "why", "run"].includes(script)) continue;
        }
        if (script in scripts) continue;
        offenders.push(`${document} says to run \`${script}\`, which package.json does not define`);
      }
    }

    expect([...new Set(offenders)].sort()).toEqual([]);
  });

  it("points only at repository paths that exist", () => {
    const offenders: string[] = [];
    // Two places a path appears: backticked in prose, and bare inside a shell fence — the
    // second is where `pnpx ts-node tests/page.test.ts` lived, a command naming a file
    // that has never existed at that path.
    for (const document of DOCUMENTS) {
      const found = [...read(document).matchAll(/`((?:src|tests|scripts|examples)\/[\w./*-]+)`/g)].map(
        (match) => match[1]
      );
      for (const fence of fencesIn(document)) {
        if (classify(fence) !== "shell") continue;
        for (const match of fence.body.matchAll(/(?:^|\s)((?:src|tests|scripts|examples)\/[\w./*-]+)/g)) {
          found.push(match[1]);
        }
      }
      for (const referenced of found) {
        // A glob names a shape, not a file.
        if (referenced.includes("*")) continue;
        const target = referenced.endsWith("/") ? referenced.slice(0, -1) : referenced;
        if (fs.existsSync(path.join(REPO_ROOT, target))) continue;
        offenders.push(`${document} points at \`${referenced}\`, which does not exist`);
      }
    }

    expect([...new Set(offenders)].sort()).toEqual([]);
  });

  it("states each batch cap next to the constant it belongs to, and states both", () => {
    // The claim that was wrong in both documents at once: a bridge takes 100 ids and a
    // bulk write takes 50 items, and the docs conflated them into one "1..100". Reading
    // the wrong number gets you a client-side throw at 51 — so the number alone is not the
    // check; the number *beside the right constant* is.
    const wrong: string[] = [];
    const unattributed: string[] = [];
    const stated = new Map<string, Set<string>>();

    for (const document of DOCUMENTS) {
      for (const claim of capsIn(document)) {
        if (claim.constant === undefined) {
          unattributed.push(
            `${document} states a batch cap of ${claim.stated} in "${claim.quote}" without naming which cap ` +
              `it is — a bare number cannot be checked against BULK_MAX_ITEMS or BRIDGE_MAX_IDS`
          );
          continue;
        }
        if (CAPS[claim.constant] !== claim.stated) {
          wrong.push(
            `${document} states ${claim.stated} in "${claim.quote}" next to ${claim.constant}, which is ` +
              `${CAPS[claim.constant]}`
          );
          continue;
        }
        if (!stated.has(document)) stated.set(document, new Set());
        stated.get(document)!.add(claim.constant);
      }
    }

    const missing = CAP_DOCUMENTS.flatMap((document) =>
      Object.keys(CAPS)
        .filter((constant) => !stated.get(document)?.has(constant))
        .map((constant) => `${document} never states ${constant} (${CAPS[constant]}) with its value`)
    );

    expect({
      wrong: [...new Set(wrong)].sort(),
      unattributed: [...new Set(unattributed)].sort(),
      missing: missing.sort(),
    }).toEqual({ wrong: [], unattributed: [], missing: [] });
  });
});

/**
 * The README's *negative* claims — the lines it says will not compile.
 *
 * A sample cannot contain these (they would fail the check above), so the README states
 * them in comments and they are pinned here instead. `@ts-expect-error` is the right tool:
 * it asserts the line does not compile *and* fails as an unused directive the moment it
 * starts to, so a claim cannot quietly become false.
 */
describe("what the README says will not compile", () => {
  it("states each claim to the compiler", async () => {
    const probe = async (client: import("../../../src").PlaneClient): Promise<void> => {
      const page = await client.v2.workspaces.projects.states.list("acme", "ENG", { fields: ["id", "name"] });
      // @ts-expect-error "reading anything else is a compile error" — `color` was not requested
      void page.data[0].color;

      const created = await client.v2.workspaces.projects.states.create(
        "acme",
        "ENG",
        { name: "In Review", color: "#4ECDC4" },
        { fields: ["id", "name"] }
      );
      // @ts-expect-error "`created.color` would not compile" — writes narrow too
      void created.color;

      const dynamic: string[] = ["id", "name"];
      // @ts-expect-error "plain `string[]` is **not** assignable to `readonly StateField[]`"
      await client.v2.workspaces.projects.states.list("acme", "ENG", { fields: dynamic });

      // "The row is narrowed to the list's **element type**": a runtime-built list typed
      // as two names narrows to those two…
      const wanted: ("id" | "name")[] = ["id", "name"];
      const narrowed = await client.v2.workspaces.projects.states.list("acme", "ENG", { fields: wanted });
      // @ts-expect-error … so `color` is not on the row
      void narrowed.data[0].color;

      // … while one typed as the whole union narrows to every field, i.e. the full row.
      const anything: v2Namespace.StateField[] = ["id", "name"];
      const wide = await client.v2.workspaces.projects.states.list("acme", "ENG", { fields: anything });
      void wide.data[0].color;

      // @ts-expect-error "a literal outside that union is a compile error"
      await client.v2.workspaces.projects.states.list("acme", "ENG", { order_by: "not_a_sort_order" });

      const unnarrowed = await client.v2.workspaces.projects.states.list("acme", "ENG");
      // @ts-expect-error "reading one without narrowing is a compile error"
      void unnarrowed.total_count;

      const eng = await client.v2.workspaces.projects.retrieve("acme", "ENG");
      // "a navigated call … accepts `fields` but does **not** narrow": assigning to the
      // full row type is what proves it, and it compiles.
      const listed: import("../../../src/models/v2/common").Page<import("../../../src/models/v2/State").State> =
        await eng.states.list({ fields: ["id", "name"] });
      void listed;

      const item = await eng.workItems.retrieve("wi-1");
      // @ts-expect-error "`project.workItems.comments` does not exist"
      void eng.workItems.comments;
      void item.comments;

      const release = await client.v2.workspaces.releases.retrieve("acme", releaseId);
      await release.labels.add([labelId]);
      // @ts-expect-error "`release.labels.list()` does not type-check" — the catalog is flat only
      await release.labels.list();

      // "`all` … correctly yields the full row type"
      const everything = await client.v2.workspaces.projects.states.list("acme", "ENG", { fields: ["all"] });
      void everything.data[0].color;
    };

    const releaseId = "r-1";
    const labelId = "l-1";
    void releaseId;
    void labelId;
    expect(typeof probe).toBe("function");
  });
});
