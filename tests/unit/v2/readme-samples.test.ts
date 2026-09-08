/**
 * Every fenced `ts` sample in `README.md` is type-checked against the real SDK.
 *
 * **Why this is a test and not a one-off.** The Python port shipped a documented call
 * that threw — and it was outside a code fence, in prose, where nothing could have caught
 * it. Fences at least *can* be checked, so they are: this compiles the README's samples
 * against `src/`, which catches a renamed method, a changed parameter order, a dropped
 * option and an id that moved position, on the day it happens rather than in an issue.
 *
 * The samples are wrapped, not rewritten: `import` lines are dropped (one import serves
 * the whole harness), each block becomes its own function so blocks can reuse names, and
 * ids the prose leaves as `cycleId`/`itemId` are declared. Nothing else is edited, so a
 * sample that only compiles after a fix-up here would fail — which is the point.
 *
 * What this cannot check is a claim in prose. Those are checked by hand, and the negative
 * claims — "this line would not compile" — are pinned below as `@ts-expect-error`, which
 * fails in *both* directions: the line must not compile, and if it ever starts compiling
 * the unused directive fails the build.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as ts from "typescript";
import * as v2Namespace from "../../../src/api/v2";

const REPO_ROOT = path.join(__dirname, "../../..");
const README = path.join(REPO_ROOT, "README.md");

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

function fencedSamples(): string[] {
  const markdown = fs.readFileSync(README, "utf8");
  return [...markdown.matchAll(/```ts\n([\s\S]*?)```/g)].map((match) => match[1]);
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

  it("finds the samples at all", () => {
    // A floor, not a pin: a renamed fence marker would make the check below vacuous.
    expect(samples.length).toBeGreaterThanOrEqual(10);
  });

  it("type-checks every fenced `ts` block against the SDK", () => {
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
