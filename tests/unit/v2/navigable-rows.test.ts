import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Cycles } from "../../../src/api/v2/Cycles";
import { Estimates } from "../../../src/api/v2/Estimates";
import { Milestones } from "../../../src/api/v2/Milestones";
import { Modules } from "../../../src/api/v2/Modules";
import { Projects } from "../../../src/api/v2/Projects";
import { WorkItems } from "../../../src/api/v2/WorkItems";
import { State } from "../../../src/models/v2/State";
import { Page } from "../../../src/models/v2/common";
import { V2Transport } from "../../../src/api/v2/kernel/transport";
import { LoadedProject } from "../../../src/api/v2/loaded/Project";

const BASE = "https://api.example.com";
const makeProjects = () => new Projects(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));
const makeWorkItems = () => new WorkItems(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

/** Assignable in both directions — a real type, not `any` and not a widened supertype. */
type Exact<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
function expectType<T extends true>(_ok: T): void {}

describe("navigable rows (v2)", () => {
  it("reaches a child from a fetched project without repeating either id", async () => {
    nock(BASE).get("/api/v2/workspaces/acme/projects/ENG/").reply(200, { id: "p-1", identifier: "ENG" });
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/states/")
      .reply(200, { data: [{ id: "s-1", name: "Todo" }], pagination: { style: "offset" } });

    const project = await makeProjects().retrieve("acme", "ENG");
    const states = await project.states.list();

    expect(scope.isDone()).toBe(true);
    expect(states.data[0].name).toBe("Todo");
  });

  it("addresses children by the readable identifier, not the uuid, when the server sent one", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/11111111-1111-1111-1111-111111111111/")
      .reply(200, { id: "11111111-1111-1111-1111-111111111111", identifier: "ENG" });
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/labels/")
      .reply(200, { data: [], pagination: { style: "offset" } });

    const project = await makeProjects().retrieve("acme", "11111111-1111-1111-1111-111111111111");
    await project.labels.list();

    expect(scope.isDone()).toBe(true);
  });

  it("falls back to the uuid when the row carries no identifier", async () => {
    nock(BASE).get("/api/v2/workspaces/acme/projects/p-1/").reply(200, { id: "p-1" });
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/p-1/states/")
      .reply(200, { data: [], pagination: { style: "offset" } });

    await (await makeProjects().retrieve("acme", "p-1")).states.list();

    expect(scope.isDone()).toBe(true);
  });

  it("navigates three levels down: project -> work item -> comments", async () => {
    nock(BASE).get("/api/v2/workspaces/acme/projects/ENG/").reply(200, { id: "p-1", identifier: "ENG" });
    nock(BASE).get("/api/v2/workspaces/acme/projects/ENG/work-items/wi-1/").reply(200, { id: "wi-1", name: "Fix bug" });
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/work-items/wi-1/comments/")
      .reply(200, { data: [{ id: "c-1" }], pagination: { style: "offset" } });

    const project = await makeProjects().retrieve("acme", "ENG");
    const workItem = await project.workItems.retrieve("wi-1");
    const comments = await workItem.comments.list();

    expect(scope.isDone()).toBe(true);
    expect(comments.data[0].id).toBe("c-1");
  });

  it("reaches every one of a fetched work item's own children, not just comments", async () => {
    nock(BASE).get("/api/v2/workspaces/acme/projects/ENG/work-items/wi-1/").reply(200, { id: "wi-1" });
    const dependencies = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/work-items/wi-1/dependencies/")
      .reply(200, { blocked_by: ["wi-2"] });
    const worklogs = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/work-items/wi-1/worklogs/")
      .reply(200, { data: [{ id: "w-1" }], pagination: { style: "offset" } });

    const workItem = await makeWorkItems().retrieve("acme", "ENG", "wi-1");

    // Every child is a typed property, not just the one the exemplar wired first.
    expect(Object.keys(Object.getOwnPropertyDescriptors(workItem)).sort()).toEqual(
      expect.arrayContaining([
        "activities",
        "attachments",
        "comments",
        "dependencies",
        "links",
        "relations",
        "worklogs",
      ])
    );
    expect((await workItem.dependencies.list()).blocked_by).toEqual(["wi-2"]);
    expect((await workItem.worklogs.list()).data[0].id).toBe("w-1");
    expect(dependencies.isDone()).toBe(true);
    expect(worklogs.isDone()).toBe(true);
  });

  it("routes every row-returning method through the loader, list and iterate included", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/")
      .reply(200, { data: [{ id: "p-1", identifier: "ENG" }], pagination: { style: "offset" }, next: null });
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/")
      .reply(200, { data: [{ id: "p-2", identifier: "OPS" }], pagination: { style: "offset" }, next: null });
    nock(BASE)
      .post("/api/v2/workspaces/acme/projects/", { identifier: "NEW", name: "New" })
      .reply(201, { id: "p-3", identifier: "NEW" });

    const projects = makeProjects();

    const page = await projects.list("acme");
    expect(typeof page.data[0].states.list).toBe("function");

    // `iterate` is the one that gets forgotten — paging must not lose navigation.
    for await (const row of projects.iterate("acme")) {
      expect(typeof row.workItems.retrieve).toBe("function");
    }

    const created = await projects.create("acme", { identifier: "NEW", name: "New" });
    expect(typeof created.labels.create).toBe("function");
  });

  it("keeps the row serializable: navigation and metadata are non-enumerable", async () => {
    nock(BASE).get("/api/v2/workspaces/acme/projects/ENG/").reply(200, { id: "p-1", identifier: "ENG", name: "Eng" });

    const project = await makeProjects().retrieve("acme", "ENG");

    expect(Object.keys(project).sort()).toEqual(["id", "identifier", "name"]);
    expect(JSON.parse(JSON.stringify(project))).toEqual({ id: "p-1", identifier: "ENG", name: "Eng" });
  });

  it("records what the server returned, narrowed by the caller's fields", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/")
      .query({ fields: "name" })
      .reply(200, { id: "p-1", identifier: "ENG", name: "Eng" });

    const project = await makeProjects().retrieve("acme", "ENG", { fields: ["name"] });

    // `identifier` came back because the server sent it, but the caller did not ask
    // for it — presence reflects the projection, so it never over-reports.
    expect([...project.$loaded.present].sort()).toEqual(["id", "name"]);
    expect(project.$loaded.ids).toEqual(["acme", "ENG"]);
    expect(project.$loaded.idNames).toEqual(["slug", "project"]);
  });

  it("refuses to prepend ids into leading parameters that are ordered differently", async () => {
    nock(BASE).get("/api/v2/workspaces/acme/projects/ENG/").reply(200, { id: "p-1", identifier: "ENG" });

    const projects = makeProjects();
    const project = await projects.retrieve("acme", "ENG");
    // A resource whose leading parameters are the wrong way round would still satisfy
    // the type (every path id is a `string`), and would build a well-formed wrong URL.
    (projects.states as unknown as Record<string, unknown>).list = (project_: string, slug: string) => {
      void project_;
      void slug;
      return Promise.resolve(null);
    };

    expect(() => project.states.list()).toThrow(/does not take its leading parameters in the order \[slug, project\]/);
  });

  it("stands down instead of throwing when a bundler has mangled the parameter names away", async () => {
    nock(BASE).get("/api/v2/workspaces/acme/projects/ENG/").reply(200, { id: "p-1", identifier: "ENG" });

    const projects = makeProjects();
    const project = await projects.retrieve("acme", "ENG");
    (projects.states as unknown as Record<string, unknown>).list = (project_: string, slug: string) => {
      void project_;
      void slug;
      return Promise.resolve(null);
    };

    // esbuild and terser both mangle function parameters, so in a minified consumer bundle
    // every method reports `(a, b)` where the source said `(slug, project)`. The check read
    // that as a definite mismatch and threw a TypeError on every navigated call — breaking
    // correct downstream code, hardest of all. The canary in `kernel/loaded.ts` is mangled
    // by the same pass, so the check can tell "wrong order" from "names are gone" and stands
    // down for the latter; `loaded-navigation.test.ts` enforces the rule against the
    // TypeScript source, where names cannot be mangled, and is the authoritative check.
    const spy = jest.spyOn(Function.prototype, "toString").mockImplementation(() => "function(a,b){}");
    try {
      expect(() => project.states.list()).not.toThrow();
    } finally {
      spy.mockRestore();
    }
  });
});

describe("navigation typing (compile-time)", () => {
  it("resolves a navigated call to the child's real return type", async () => {
    nock(BASE).get("/api/v2/workspaces/acme/projects/ENG/").reply(200, { id: "p-1", identifier: "ENG" });
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/states/")
      .reply(200, { data: [{ id: "s-1" }], pagination: { style: "offset" } });
    nock(BASE).get("/api/v2/workspaces/acme/projects/ENG/states/s-1/").reply(200, { id: "s-1", name: "Todo" });

    const project: LoadedProject = await makeProjects().retrieve("acme", "ENG");

    const page = await project.states.list();
    const one = await project.states.retrieve("s-1");

    // Exact, not merely assignable: `any` would satisfy an `extends` check in both
    // directions against anything, so these pin the real types.
    expectType<Exact<typeof page, Page<State>>>(true);
    expectType<Exact<typeof one, State>>(true);

    // @ts-expect-error a misspelled method does not exist on the owned view
    void project.states.lst;

    // @ts-expect-error the bound ids are gone from the signature — this is one too many
    void (() => project.states.retrieve("acme", "ENG", "s-1"));

    // @ts-expect-error a child that needs its own row's id is not reachable from the parent's view
    void project.workItems.comments;

    expect(page.data[0].id).toBe("s-1");
    expect(one.name).toBe("Todo");
  });

  it("keeps a projection navigable and still narrowed", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/")
      .query({ fields: "id,name" })
      .reply(200, { data: [{ id: "p-1", identifier: "ENG", name: "Eng" }], pagination: { style: "offset" } });

    const page = await makeProjects().list("acme", { fields: ["id", "name"] as const });
    const row = page.data[0];

    expect(row.name).toBe("Eng");
    expect(typeof row.states.list).toBe("function");
    // @ts-expect-error `priority` was not requested, so it is not on the narrowed row
    void row.priority;
  });
});

/**
 * The families migrated in task 3 whose rows own children, exercised end to end.
 *
 * Each asserts the exact URL the navigated call reaches: the navigation sweep proves the
 * property exists and wraps the right child, but a well-formed URL pointing at the wrong
 * place is internally consistent and only a request assertion catches it.
 */
describe("navigable rows — cycles, modules, milestones, estimates (v2)", () => {
  const transport = () => new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" }));

  it("reaches a cycle's work-item bridge from a fetched cycle, with no id repeated", async () => {
    nock(BASE).get("/api/v2/workspaces/acme/projects/ENG/cycles/cyc-1/").reply(200, { id: "cyc-1", name: "Sprint 1" });
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/cycles/cyc-1/work-items/", { add: ["wi-1"] })
      .reply(200, { added: ["wi-1"] });

    const cycle = await new Cycles(transport()).retrieve("acme", "ENG", "cyc-1");

    expect(await cycle.workItems.add(["wi-1"])).toEqual(["wi-1"]);
    expect(scope.isDone()).toBe(true);
  });

  it("reaches a module's work-item bridge from a listed module", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/modules/")
      .reply(200, { data: [{ id: "mod-1" }], pagination: { style: "offset" } });
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/modules/mod-1/work-items/", { remove: ["wi-2"] })
      .reply(200, { removed: ["wi-2"] });

    const page = await new Modules(transport()).list("acme", "ENG");
    await page.data[0].workItems.remove(["wi-2"]);

    expect(scope.isDone()).toBe(true);
  });

  it("reaches a milestone's work-item bridge from a fetched milestone", async () => {
    nock(BASE).get("/api/v2/workspaces/acme/projects/ENG/milestones/ms-1/").reply(200, { id: "ms-1", title: "Launch" });
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/milestones/ms-1/work-items/", { add: ["wi-3"] })
      .reply(200, { added: ["wi-3"] });

    const milestone = await new Milestones(transport()).retrieve("acme", "ENG", "ms-1");
    await milestone.workItems.add(["wi-3"]);

    expect(scope.isDone()).toBe(true);
  });

  it("reaches an estimate's scale as `estimatePoints`, the name `?expand=points` is not using", async () => {
    // The row really can carry a `points` key — this fetch asks for it — and the
    // navigation property is deliberately spelled differently so it does not define over
    // it. Both must be readable off the same row.
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/estimates/e1/")
      .query({ expand: "points" })
      .reply(200, { id: "e1", name: "Sizing", points: [{ id: "p1", key: 0, value: "XS" }] });
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/estimates/e1/points/")
      .reply(200, { data: [{ id: "p1" }], pagination: { style: "offset" } });

    const estimate = await new Estimates(transport()).retrieve("acme", "ENG", "e1", { expand: ["points"] });

    expect((estimate as unknown as { points: unknown[] }).points).toHaveLength(1);
    const scale = await estimate.estimatePoints.list();
    expect(scale.data[0].id).toBe("p1");
    expect(scope.isDone()).toBe(true);
  });

  it("reaches a project's cycles two levels down: project -> cycle -> work items", async () => {
    nock(BASE).get("/api/v2/workspaces/acme/projects/ENG/").reply(200, { id: "p-1", identifier: "ENG" });
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/cycles/")
      .reply(200, { data: [{ id: "cyc-1" }], pagination: { style: "offset" } });
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/cycles/cyc-1/work-items/", { add: ["wi-1"] })
      .reply(200, { added: ["wi-1"] });

    const project = await makeProjects().retrieve("acme", "ENG");
    const cycles = await project.cycles.list();
    await cycles.data[0].workItems.add(["wi-1"]);

    expect(scope.isDone()).toBe(true);
  });
});
