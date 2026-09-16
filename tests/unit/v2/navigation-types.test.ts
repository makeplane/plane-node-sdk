/**
 * What the types actually resolve to, three navigations deep — asserted at compile time.
 *
 * Every other sweep in this suite reads the source or walks the runtime tree. Neither can
 * answer the question a consumer cares about most: *when I chain
 * `workspace.projects.retrieve(...)` then `.workItems.retrieve(...)` then
 * `.comments.list()`, what does my editor say I am holding?* `Owned<TResource, TIds>` is a
 * mapped conditional type, and a conditional that fails to match resolves to `never` or —
 * far worse — the whole chain degrades to `any` and every call site type-checks, including
 * the wrong ones.
 *
 * So this file asserts three things that no runtime test can:
 *
 * 1. **The resolved types are real.** `IsAny` catches the silent-`any` collapse; exact
 *    `Equals` comparisons pin each level to the model it should be, not merely to
 *    "something assignable".
 * 2. **The ids really are consumed.** At each level the bound ids are gone from the
 *    signature and the remaining parameters are unchanged — `comments.list()` takes the
 *    params object alone, three ids having been supplied by the three fetches above it.
 * 3. **A misspelling is a compile error**, not a runtime `undefined is not a function`.
 *    That is the whole claim behind the `Owned` mapping, and `@ts-expect-error` is the
 *    only way to state it: if the property ever *did* exist, the directive goes unused and
 *    `tsc` fails.
 *
 * The runtime test at the bottom walks the same chain through `nock`, so the URL the types
 * describe and the URL the SDK builds are checked against each other rather than
 * separately.
 */

import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Page } from "../../../src/models/v2/common";
import { Project } from "../../../src/models/v2/Project";
import { WorkItem } from "../../../src/models/v2/WorkItem";
import { WorkItemComment } from "../../../src/models/v2/WorkItemComment";
import { Workspace } from "../../../src/models/v2/Workspace";
import { Workspaces } from "../../../src/api/v2/Workspaces";
import { ListWorkItemCommentsParams } from "../../../src/api/v2/WorkItems";
import { Loaded } from "../../../src/api/v2/kernel/loaded";
import { CollectionNavigation } from "../../../src/api/v2/loaded/Collection";
import { ProjectNavigation } from "../../../src/api/v2/loaded/Project";
import { WorkItemNavigation } from "../../../src/api/v2/loaded/WorkItem";
import { WorkspaceNavigation } from "../../../src/api/v2/loaded/Workspace";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const makeWorkspaces = () => new Workspaces(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

// -- Type-level assertion helpers ----------------------------------------------------

/** `0 extends 1 & T` is only ever true when `T` is `any` — the standard `any` detector. */
type IsAny<T> = 0 extends 1 & T ? true : false;

/** Mutual assignability is too weak (`any` passes it both ways); this is exact identity. */
type Equals<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

/** Fails to compile unless the argument is exactly `true`. */
type Expect<T extends true> = T;

// The three levels, as the types the chain resolves to. Nothing is called here: `declare`
// gives a value of exactly the type the expression would have, so the assertions below are
// about the types alone.
declare const workspaceRow: Awaited<ReturnType<Workspaces["retrieve"]>>;
declare const projectRow: Awaited<ReturnType<typeof workspaceRow.projects.retrieve>>;
declare const workItemRow: Awaited<ReturnType<typeof projectRow.workItems.retrieve>>;
declare const commentPage: Awaited<ReturnType<typeof workItemRow.comments.list>>;

// Level 0-3: each row is the model it should be, plus its navigation and `$loaded` — not
// `any`, not `never`, not a widened `object`.
type _WorkspaceIsReal = Expect<Equals<IsAny<typeof workspaceRow>, false>>;
type _ProjectIsReal = Expect<Equals<IsAny<typeof projectRow>, false>>;
type _WorkItemIsReal = Expect<Equals<IsAny<typeof workItemRow>, false>>;
type _CommentPageIsReal = Expect<Equals<IsAny<typeof commentPage>, false>>;

type _WorkspaceRow = Expect<Equals<typeof workspaceRow, Loaded<Workspace, WorkspaceNavigation>>>;
type _ProjectRow = Expect<Equals<typeof projectRow, Loaded<Project, ProjectNavigation>>>;
type _WorkItemRow = Expect<Equals<typeof workItemRow, Loaded<WorkItem, WorkItemNavigation>>>;
type _CommentPage = Expect<Equals<typeof commentPage, Page<WorkItemComment>>>;

// A field of the deepest row is the model's own type, so the chain has not lost the model.
type _CommentField = Expect<Equals<(typeof commentPage.data)[number]["comment_html"], string | undefined>>;

// The bound ids are gone at every level, and nothing else is: `Comments.list` is
// `(slug, project, workItem, params?)` flat, and three fetches have supplied three ids.
type _CommentsListParameters = Expect<
  Equals<Parameters<typeof workItemRow.comments.list>, [params?: ListWorkItemCommentsParams | undefined]>
>;
// One level up, `WorkItems.retrieve(slug, project, workItem, params?)` keeps its own leaf id.
type _WorkItemsRetrieveOpensWithItsLeafId = Expect<Equals<Parameters<typeof projectRow.workItems.retrieve>[0], string>>;

// `$loaded` survives the chain, so a caller can still ask what the server returned.
type _LoadedMetaPresent = Expect<Equals<typeof workItemRow.$loaded.present, ReadonlySet<string>>>;

// A navigation property is not a method: `Owned` keeps only callables, so a *grandchild*
// resource is unreachable from a view and must come from its own fetched row.
type _NoGrandchildOnAView = Expect<Equals<keyof typeof projectRow.workItems & "comments", never>>;

// A resource with no navigable children still resolves: `Collections`' own navigation is a
// real interface, so an empty-looking level is not silently `any` either.
type _CollectionNavigationIsReal = Expect<Equals<IsAny<CollectionNavigation>, false>>;

/**
 * Never called — every statement in here is an assertion `tsc` makes when ts-jest compiles
 * this file. The `declare const` rows above have no runtime existence, which is the point:
 * these are claims about types, and running them would prove nothing about types.
 *
 * A `@ts-expect-error` is a real assertion in both directions: the line must fail to
 * compile, and if the property ever *does* exist the directive goes unused and `tsc` fails.
 */
function typeProbes(): void {
  // @ts-expect-error `Owned` maps only the resource's own methods, so a typo does not exist
  void workspaceRow.projects.lst;
  // @ts-expect-error … at the second level too
  void projectRow.workItems.retreive;
  // @ts-expect-error … and at the third, where a runtime-only design would answer `undefined`
  void workItemRow.comments.lst;
  // @ts-expect-error a navigation property is not a method, so it is not on the view above it
  void projectRow.workItems.comments;
  // @ts-expect-error the ids are consumed: `list` no longer takes the slug it was fetched by
  void workItemRow.comments.list("acme");

  // The `Owned` limitation, stated as a compiling assignment rather than only in prose: a
  // navigated call resolves against the *general* overload, so `fields` is still accepted
  // and the row still comes back full. Reaching for the narrowed row means calling flat —
  // `v2.workspaces.projects.workItems.comments.list(slug, project, workItem, { fields })`. See
  // `Owned<…>`'s own doc comment, the README's "Field projection" section, and
  // `field-projection.test.ts`.
  const stillTheFullRow: Promise<Page<WorkItemComment>> = workItemRow.comments.list({
    fields: ["id", "comment_html"] as const,
  });
  void stillTheFullRow;
}

describe("three levels of navigation, at the type level", () => {
  it("states its assertions to the compiler", () => {
    // The substance of this file is checked by `tsc` when ts-jest compiles it; this keeps
    // the probes referenced so no linter drops them, and the block a real test.
    expect(typeof typeProbes).toBe("function");
  });

  it("walks the same three levels at runtime, to the URL the types describe", async () => {
    nock(BASE).get("/api/v2/workspaces/acme/").reply(200, { id: "ws-1", slug: "acme" });
    nock(BASE).get("/api/v2/workspaces/acme/projects/ENG/").reply(200, { id: "p-1", identifier: "ENG" });
    nock(BASE).get("/api/v2/workspaces/acme/projects/ENG/work-items/wi-1/").reply(200, { id: "wi-1" });
    const comments = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/work-items/wi-1/comments/")
      .reply(200, { data: [{ id: "c-1", comment_html: "<p>hi</p>" }], pagination: { style: "offset" } });

    const workspace = await makeWorkspaces().retrieve("acme");
    const project = await workspace.projects.retrieve("ENG");
    const workItem = await project.workItems.retrieve("wi-1");
    const page = await workItem.comments.list();

    expect(page.data[0].comment_html).toBe("<p>hi</p>");
    expect(comments.isDone()).toBe(true);
  });
});

afterEach(() => nock.cleanAll());
