/**
 * Every TypeScript sample in `README.md` and `CLAUDE.md` is type-checked against the real
 * SDK, and the prose claims that can be checked mechanically are.
 *
 * **Why this is a test and not a one-off.** The Python port shipped a documented call
 * that threw — and it was outside a code fence, in prose, where nothing could have caught
 * it. Fences at least *can* be checked, so they are: this compiles the samples against
 * `src/`, which catches a renamed method, a changed parameter order, a dropped option and
 * an id that moved position, on the day it happens rather than in an issue.
 *
 * **The fence marker used to be part of the gate, which is how the first sample in the
 * README got through it.** The extractor matched ` ```ts ` exactly, the Quick Start block
 * was fenced ` ```typescript `, and the floor assertion passed on the twelve blocks it
 * did see. That one unchecked block named a package that does not exist
 * (`@plane/node-sdk`), declared `const client` twice, and called `projects.list()`
 * without its required workspace slug — three compile errors in the first code a new user
 * reads. {@link TS_FENCE} now matches every spelling of a TypeScript fence, and
 * {@link DOCUMENTS} names both files the same commit rewrites.
 *
 * The samples are wrapped, not rewritten: `import` lines are dropped (one import serves
 * the whole harness), each block becomes its own function so blocks can reuse names, and
 * ids the prose leaves as `cycleId`/`itemId` are declared. Nothing else is edited, so a
 * sample that only compiles after a fix-up here would fail — which is the point.
 *
 * **Prose is checked too, as far as prose can be.** Three claims in the docs are facts
 * about this repository, so they are compared against it rather than re-read: a `pnpm`
 * script the docs tell you to run must exist in `package.json`, a repo file the docs point
 * at must exist on disk, and a batch-size cap stated in prose must be one of the two the
 * kernel actually enforces. The last of those is not hypothetical either — both documents
 * stated the bridge cap of 100 as if it were the bulk cap of 50, ninety-five lines from a
 * paragraph that gave the right number.
 *
 * The README's *negative* claims — "this line would not compile" — are pinned at the
 * bottom as `@ts-expect-error`, which fails in both directions: the line must not compile,
 * and if it ever starts compiling the unused directive fails the build.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as ts from "typescript";
import * as v2Namespace from "../../../src/api/v2";
import { BULK_MAX_ITEMS } from "../../../src/api/v2/generated/constants";
import { BRIDGE_MAX_IDS } from "../../../src/api/v2/kernel/resource";

const REPO_ROOT = path.join(__dirname, "../../..");

/**
 * Every spelling of a TypeScript code fence.
 *
 * Not `ts` alone — see this file's own doc comment. Markdown fence *info strings* are free
 * text, so the set has to be the set of things people write, not the one this repo happens
 * to use today.
 */
const TS_FENCE = /```(?:ts|typescript|tsx|typescriptreact)\r?\n([\s\S]*?)```/g;

/** Every fence language that is a shell command rather than TypeScript. */
const SHELL_FENCE = /```(?:bash|sh|shell|console|zsh)\r?\n([\s\S]*?)```/g;

/**
 * The documents this gate covers.
 *
 * `README.md` is what a user reads and `CLAUDE.md` is what an agent reads, and the two are
 * rewritten by the same commits. Leaving the second out is how it came to state a cap that
 * the first one contradicted.
 */
const DOCUMENTS = ["README.md", "CLAUDE.md"] as const;

/** Ids and flags the prose introduces without ceremony, so a sample can read naturally. */
const PREAMBLE = [
  `import { PlaneClient, v2 } from "./src";`,
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

function read(document: string): string {
  return fs.readFileSync(path.join(REPO_ROOT, document), "utf8");
}

function fencedSamples(): string[] {
  return DOCUMENTS.flatMap((document) => {
    TS_FENCE.lastIndex = 0;
    return [...read(document).matchAll(TS_FENCE)].map((match) => match[1]);
  });
}

/** The samples, wrapped one function each so two blocks may both declare `client`. */
function harness(samples: string[]): string {
  const body = samples.map((sample, index) => {
    const withoutImports = sample
      .split("\n")
      .filter((line) => !line.startsWith("import "))
      .map((line) => (line.trim() === "" ? line : `  ${line}`))
      .join("\n");
    return `export async function readmeSample${index}(): Promise<void> {\n${withoutImports}\n}`;
  });
  return [...PREAMBLE, "", ...body].join("\n");
}

describe("README samples", () => {
  const samples = fencedSamples();

  it("finds the samples at all, and leaves no TypeScript fence unmatched", () => {
    // A floor, not a pin: a renamed fence marker would make the check below vacuous.
    expect(samples.length).toBeGreaterThanOrEqual(13);

    // And the stronger version of the same question, which the old floor could not ask:
    // *every* fence in these documents is either TypeScript (checked above) or shell
    // (checked below). A fence in some third language is a sample nothing compiles, and
    // that is exactly the state the Quick Start was in.
    const unmatched: string[] = [];
    for (const document of DOCUMENTS) {
      const text = read(document);
      TS_FENCE.lastIndex = 0;
      SHELL_FENCE.lastIndex = 0;
      const accounted = [...text.matchAll(TS_FENCE)].length + [...text.matchAll(SHELL_FENCE)].length;
      // Not anchored to the line start: the README nests fences inside numbered list
      // items, indented by three spaces, and an anchored count silently ignored them.
      const opening = [...text.matchAll(/```(\w+)/g)];
      if (opening.length !== accounted) {
        unmatched.push(
          `${document}: ${opening.length} opening fences carry a language but only ${accounted} were ` +
            `matched as TypeScript or shell — languages seen: ${[...new Set(opening.map((m) => m[1]))].join(", ")}`
        );
      }
    }

    expect(unmatched).toEqual([]);
  });

  it("type-checks every fenced TypeScript block against the SDK", () => {
    const virtualPath = path.join(REPO_ROOT, "__readme-samples__.ts");
    const source = harness(samples);

    const parsed = ts.parseJsonConfigFileContent(
      ts.readConfigFile(path.join(REPO_ROOT, "tsconfig.json"), ts.sys.readFile).config,
      ts.sys,
      REPO_ROOT
    );
    const options: ts.CompilerOptions = { ...parsed.options, noEmit: true, declaration: false, declarationMap: false };
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
        if (diagnostic.start === undefined) return `README sample: ${message}`;
        const { line } = file.getLineAndCharacterOfPosition(diagnostic.start);
        return `README sample, at \`${source.split("\n")[line].trim()}\`: ${message}`;
      });

    expect(failures).toEqual([]);
  }, 60000);
});

/**
 * Claims in prose that are facts about this repository, checked against it.
 *
 * Prose cannot be compiled, but three kinds of claim in these documents are not really
 * prose at all — they are assertions about files, scripts and constants that exist. Each
 * one below has been wrong in a shipped document at least once.
 */
describe("what the docs claim about this repository", () => {
  const documents = DOCUMENTS.map((document) => [document, read(document)] as const);

  it("imports the package under the name it is actually published as", () => {
    // `harness()` strips `import` lines before compiling — one import serves every block —
    // so the type-check above cannot see the module specifier at all. That is how the
    // Quick Start came to say `@plane/node-sdk`, which is not this package and 404s from
    // npm, nineteen lines below an install command with the right name.
    const manifest = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "package.json"), "utf8")) as {
      name: string;
      dependencies: Record<string, string>;
    };
    const allowed = new Set([manifest.name, ...Object.keys(manifest.dependencies)]);
    const offenders: string[] = [];

    for (const [document, text] of documents) {
      TS_FENCE.lastIndex = 0;
      for (const fence of text.matchAll(TS_FENCE)) {
        for (const match of fence[1].matchAll(/\bfrom\s+["']([^"']+)["']/g)) {
          const specifier = match[1];
          if (specifier.startsWith(".") || specifier.startsWith("node:")) continue;
          if (allowed.has(specifier)) continue;
          offenders.push(
            `${document} imports from "${specifier}", which is neither ${manifest.name} nor one of its ` +
              `dependencies — a reader copying that line gets a 404 from npm`
          );
        }
      }
    }

    expect([...new Set(offenders)].sort()).toEqual([]);
  });

  it("tells the reader to run only scripts that exist", () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const offenders: string[] = [];

    for (const [document, text] of documents) {
      // `pnpm <script>` and `npm run <script>`, wherever they appear — fenced or in prose.
      for (const match of text.matchAll(/\b(?:pnpm run|pnpm|npm run|yarn)\s+([a-z][a-z0-9:-]*)/g)) {
        const script = match[1];
        // Package-manager verbs are not scripts.
        if (["install", "add", "remove", "exec", "dlx", "why", "run", "test", "build"].includes(script)) {
          if (script in manifest.scripts) continue;
          if (["install", "add", "remove", "exec", "dlx", "why", "run"].includes(script)) continue;
        }
        if (script in manifest.scripts) continue;
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
    const referencesIn = (text: string): string[] => {
      const found = [...text.matchAll(/`((?:src|tests|scripts|examples)\/[\w./*-]+)`/g)].map((match) => match[1]);
      SHELL_FENCE.lastIndex = 0;
      for (const fence of text.matchAll(SHELL_FENCE)) {
        for (const match of fence[1].matchAll(/(?:^|\s)((?:src|tests|scripts|examples)\/[\w./*-]+)/g)) {
          found.push(match[1]);
        }
      }
      return found;
    };

    for (const [document, text] of documents) {
      for (const referenced of referencesIn(text)) {
        // A glob names a shape, not a file.
        if (referenced.includes("*")) continue;
        const target = referenced.endsWith("/") ? referenced.slice(0, -1) : referenced;
        if (fs.existsSync(path.join(REPO_ROOT, target))) continue;
        offenders.push(`${document} points at \`${referenced}\`, which does not exist`);
      }
    }

    expect([...new Set(offenders)].sort()).toEqual([]);
  });

  it("states only batch caps the kernel actually enforces, and states both of them", () => {
    // The claim that was wrong in both documents at once: a bridge takes 100 ids and a
    // bulk write takes 50 items, and the docs conflated them into one "1..100". Reading
    // the wrong number gets you a client-side throw at 51.
    const caps = new Set([String(BULK_MAX_ITEMS), String(BRIDGE_MAX_IDS)]);
    const wrong: string[] = [];
    const missing: string[] = [];

    for (const [document, text] of documents) {
      // "1..N ids", "N items per call", "at most N ids" — the shapes a cap is stated in.
      for (const match of text.matchAll(/(?:1\.\.(\d+)|(\d+) items per call|at most (\d+) ids)/g)) {
        const stated = match[1] ?? match[2] ?? match[3];
        if (caps.has(stated)) continue;
        wrong.push(`${document} states a batch cap of ${stated}, which is neither ${[...caps].join(" nor ")}`);
      }
      for (const cap of caps) {
        if (!text.includes(cap)) missing.push(`${document} never states the cap of ${cap}`);
      }
    }

    expect({ wrong: [...new Set(wrong)].sort(), missing: [...new Set(missing)].sort() }).toEqual({
      wrong: [],
      missing: [],
    });
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
