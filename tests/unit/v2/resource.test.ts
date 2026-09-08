import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { OperationId, V2Resource } from "../../../src/api/v2/kernel/resource";
import { V2Transport } from "../../../src/api/v2/kernel/transport";
import { MissingPathIdError } from "../../../src/errors/MissingPathIdError";
import { PlaneError } from "../../../src/errors/PlaneError";

const BASE = "https://api.example.com";

interface Row {
  id: string;
  name?: string;
}

class Rows extends V2Resource<Row, { name: string }, { name?: string }> {
  protected path = "/workspaces/{slug}/projects/{project_id}/states/";
  protected operations: Record<string, OperationId> = {
    list: "states_list",
    retrieve: "states_retrieve",
    create: "states_create",
    update: "states_partial_update",
    upsert: "states_upsert",
  };

  list = (slug: string, projectId: string, params?: Record<string, unknown>) =>
    this.doList({ slug, project_id: projectId }, params);
  retrieve = (slug: string, projectId: string, pk: string) => this.doRetrieve({ slug, project_id: projectId, pk });
  update = (slug: string, projectId: string, pk: string, data: { name?: string }) =>
    this.doUpdate(data, { slug, project_id: projectId, pk });
  remove = (slug: string, projectId: string, pk: string) => this.doDelete({ slug, project_id: projectId, pk });
  iterate = (slug: string, projectId: string, params?: Record<string, unknown>) =>
    this.doIterate({ slug, project_id: projectId }, params);
}

const makeRows = () => new Rows(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("V2Resource", () => {
  it("lists typed rows", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/states/")
      .reply(200, { data: [{ id: "1", name: "Todo" }], pagination: { style: "offset" } });

    const page = await makeRows().list("acme", "ENG");

    expect(page.data[0].name).toBe("Todo");
  });

  it("encodes fields and filters into the query", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/states/")
      .query({ fields: "id,name", name: "Todo" })
      .reply(200, { data: [], pagination: { style: "offset" } });

    await makeRows().list("acme", "ENG", { fields: ["id", "name"], name: "Todo" });

    expect(scope.isDone()).toBe(true);
  });

  it("rejects an unknown field before making the request", async () => {
    await expect(makeRows().list("acme", "ENG", { fields: ["nope"] })).rejects.toThrow(/nope/);
  });

  it("encodes a valid order_by into the query", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/states/")
      .query({ order_by: "-created_at" })
      .reply(200, { data: [], pagination: { style: "offset" } });

    await makeRows().list("acme", "ENG", { order_by: "-created_at" });

    expect(scope.isDone()).toBe(true);
  });

  it("rejects an unknown order_by before making the request", async () => {
    await expect(makeRows().list("acme", "ENG", { order_by: "nope" })).rejects.toThrow(/Unknown order_by 'nope'/);
  });

  it("appends the pk on detail routes", async () => {
    nock(BASE).get("/api/v2/workspaces/acme/projects/ENG/states/abc/").reply(200, { id: "abc" });

    expect((await makeRows().retrieve("acme", "ENG", "abc")).id).toBe("abc");
  });

  it("updates with PATCH", async () => {
    const scope = nock(BASE)
      .patch("/api/v2/workspaces/acme/projects/ENG/states/abc/", { name: "Doing" })
      .reply(200, { id: "abc", name: "Doing" });

    await makeRows().update("acme", "ENG", "abc", { name: "Doing" });

    expect(scope.isDone()).toBe(true);
  });

  it("deletes without a body", async () => {
    nock(BASE).delete("/api/v2/workspaces/acme/projects/ENG/states/abc/").reply(204);

    await expect(makeRows().remove("acme", "ENG", "abc")).resolves.toBeUndefined();
  });

  it("percent-encodes path parameters", async () => {
    // safe:"" semantics — a slash inside a value must not create a new path segment.
    const scope = nock(BASE)
      .get("/api/v2/workspaces/a%2Fb%20c/projects/ENG/states/")
      .reply(200, { data: [], pagination: { style: "offset" } });

    await makeRows().list("a/b c", "ENG");

    expect(scope.isDone()).toBe(true);
  });

  it("percent-encodes the detail pk", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/states/In%20Progress%2FDone/")
      .reply(200, { id: "1" });

    await makeRows().retrieve("acme", "ENG", "In Progress/Done");

    expect(scope.isDone()).toBe(true);
  });

  it("validates fields against the operation for the action being performed", async () => {
    // The golden's only differing list/retrieve pair: work_items_retrieve carries
    // custom_fields, work_items_list does not. Verify against FIELDS before relying
    // on this pair — if the golden changed, pick the current differing pair.
    class WorkItemRows extends V2Resource<Row, { name: string }, { name?: string }> {
      protected path = "/workspaces/{slug}/projects/{project_id}/work-items/";
      protected operations: Record<string, OperationId> = { list: "work_items_list", retrieve: "work_items_retrieve" };

      list = (slug: string, projectId: string, params?: Record<string, unknown>) =>
        this.doList({ slug, project_id: projectId }, params);
      retrieve = (slug: string, projectId: string, pk: string, params?: Record<string, unknown>) =>
        this.doRetrieve({ slug, project_id: projectId, pk }, params);
    }

    const rows = new WorkItemRows(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));
    nock(BASE).get("/api/v2/workspaces/acme/projects/ENG/work-items/abc/").query(true).reply(200, { id: "abc" });

    await expect(rows.retrieve("acme", "ENG", "abc", { fields: ["custom_fields"] })).resolves.toBeDefined();
    await expect(rows.list("acme", "ENG", { fields: ["custom_fields"] })).rejects.toThrow(/custom_fields/);
  });

  it("encodes expand into the query, joining multiple values", async () => {
    class WorkItemRows extends V2Resource<Row, { name: string }, { name?: string }> {
      protected path = "/workspaces/{slug}/projects/{project_id}/work-items/";
      protected operations: Record<string, OperationId> = { list: "work_items_list", retrieve: "work_items_retrieve" };

      list = (slug: string, projectId: string, params?: Record<string, unknown>) =>
        this.doList({ slug, project_id: projectId }, params);
    }

    const rows = new WorkItemRows(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/work-items/")
      .query({ expand: "state,labels" })
      .reply(200, { data: [], pagination: { style: "offset" } });

    await rows.list("acme", "ENG", { expand: ["state", "labels"] });

    expect(scope.isDone()).toBe(true);
  });

  it("rejects an unknown expand value before making the request", async () => {
    class WorkItemRows extends V2Resource<Row, { name: string }, { name?: string }> {
      protected path = "/workspaces/{slug}/projects/{project_id}/work-items/";
      protected operations: Record<string, OperationId> = { list: "work_items_list" };

      list = (slug: string, projectId: string, params?: Record<string, unknown>) =>
        this.doList({ slug, project_id: projectId }, params);
    }

    const rows = new WorkItemRows(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

    await expect(rows.list("acme", "ENG", { expand: ["nope"] })).rejects.toThrow(
      /Unknown expand value\(s\) for work_items_list: nope/
    );
  });

  it("rejects expand on an operation that carries no `expand` enum in the golden", async () => {
    // `states_list` never gained an `expand` parameter — this is the "operation
    // legitimately doesn't support expand" branch, distinct from a typo'd operation id.
    await expect(makeRows().list("acme", "ENG", { expand: ["anything"] })).rejects.toThrow(
      /states_list does not support the expand parameter/
    );
  });

  it("supports a custom verb action via doAction, validating fields/expand the same as any other action", async () => {
    class WorkItemRows extends V2Resource<Row, { name: string }, { name?: string }> {
      protected path = "/workspaces/{slug}/projects/{project_id}/work-items/";
      protected operations: Record<string, OperationId> = { archive: "work_items_archive" };

      archive = (slug: string, projectId: string, pk: string, params?: Record<string, unknown>) =>
        this.doAction("archive", { slug, project_id: projectId, pk }, params);
    }

    const rows = new WorkItemRows(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/work-items/abc/archive/")
      .query({ fields: "id" })
      .reply(200, { id: "abc" });

    const result = await rows.archive("acme", "ENG", "abc", { fields: ["id"] });

    expect(scope.isDone()).toBe(true);
    expect(result).toEqual({ id: "abc" });

    await expect(rows.archive("acme", "ENG", "abc", { fields: ["nope"] })).rejects.toThrow(/nope/);
  });

  it("supports an alternate path template via urlForTemplate/doListAt/doRetrieveAt/doIterateAt", async () => {
    class WorkItemRows extends V2Resource<Row, { name: string }, { name?: string }> {
      protected path = "/workspaces/{slug}/projects/{project_id}/work-items/";
      protected operations: Record<string, OperationId> = {
        listWorkspace: "workspace_work_items_list",
        retrieveByIdentifier: "work_items_retrieve_by_identifier",
      };

      listWorkspace = (slug: string, params?: Record<string, unknown>) =>
        this.doListAt(
          this.urlForTemplate("/workspaces/{slug}/work-items/", "listWorkspace", { slug }),
          "listWorkspace",
          params
        );
      iterateWorkspace = (slug: string, params?: Record<string, unknown>) =>
        this.doIterateAt(
          this.urlForTemplate("/workspaces/{slug}/work-items/", "listWorkspace", { slug }),
          "listWorkspace",
          params
        );
      retrieveByIdentifier = (slug: string, identifier: string, params?: Record<string, unknown>) =>
        this.doRetrieveAt(
          this.urlForTemplate("/workspaces/{slug}/work-items/{identifier}/", "retrieveByIdentifier", {
            slug,
            identifier,
          }),
          "retrieveByIdentifier",
          params
        );
    }

    const rows = new WorkItemRows(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

    const listScope = nock(BASE)
      .get("/api/v2/workspaces/acme/work-items/")
      .query({ fields: "id" })
      .reply(200, { data: [{ id: "1" }], pagination: { style: "offset" } });
    expect((await rows.listWorkspace("acme", { fields: ["id"] })).data[0].id).toBe("1");
    expect(listScope.isDone()).toBe(true);

    nock(BASE)
      .get("/api/v2/workspaces/acme/work-items/")
      .reply(200, { data: [{ id: "1" }], pagination: { style: "offset" }, next: null });
    const seen: string[] = [];
    for await (const row of rows.iterateWorkspace("acme")) seen.push(row.id);
    expect(seen).toEqual(["1"]);

    const retrieveScope = nock(BASE).get("/api/v2/workspaces/acme/work-items/ENG-12/").reply(200, { id: "ENG-12" });
    expect((await rows.retrieveByIdentifier("acme", "ENG-12")).id).toBe("ENG-12");
    expect(retrieveScope.isDone()).toBe(true);

    // Same fields/expand validation as the collectionUrl-based methods — proves
    // doListAt/doRetrieveAt route through `query()`, not a bypass.
    await expect(rows.listWorkspace("acme", { fields: ["nope"] })).rejects.toThrow(/nope/);
  });

  it("throws when the operations mapping lacks the action", async () => {
    class Bare extends V2Resource<Row, { name: string }, { name?: string }> {
      protected path = "/workspaces/{slug}/projects/{project_id}/states/";
      protected operations: Record<string, OperationId> = { list: "states_list" };

      retrieve = (slug: string, projectId: string, pk: string, params?: Record<string, unknown>) =>
        this.doRetrieve({ slug, project_id: projectId, pk }, params);
    }

    const rows = new Bare(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

    await expect(rows.retrieve("acme", "ENG", "abc", { fields: ["id"] })).rejects.toThrow(
      /operations has no entry for 'retrieve'/
    );
  });

  it("yields values across pages, in order", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/states/")
      .reply(200, { data: [{ id: "1" }, { id: "2" }], pagination: { style: "offset" }, next: 2 });
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/states/")
      .query({ offset: "2" })
      .reply(200, { data: [{ id: "3" }], pagination: { style: "offset" }, next: null });

    const seen: string[] = [];
    for await (const row of makeRows().iterate("acme", "ENG")) seen.push(row.id);

    expect(seen).toEqual(["1", "2", "3"]);
  });

  it("defers an invalid fields error to first iteration, not to the call itself", async () => {
    const rows = makeRows();
    let generator!: AsyncGenerator<Row>;

    // The call itself must not throw — validation only runs once the generator is driven.
    expect(() => {
      generator = rows.iterate("acme", "ENG", { fields: ["nope"] });
    }).not.toThrow();

    const drain = async () => {
      const out: Row[] = [];
      for await (const row of generator) out.push(row);
      return out;
    };

    await expect(drain()).rejects.toThrow(/nope/);
  });

  it("propagates the stall guard's PlaneError through yield*", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/states/")
      .reply(200, { data: [{ id: "1" }], pagination: { style: "offset" }, next: 5 });
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/states/")
      .query({ offset: "5" })
      .reply(200, { data: [{ id: "2" }], pagination: { style: "offset" }, next: 5 });

    const drain = async () => {
      const out: Row[] = [];
      for await (const row of makeRows().iterate("acme", "ENG")) out.push(row);
      return out;
    };

    await expect(drain()).rejects.toThrow(PlaneError);
  });

  it("throws a clear error when a path parameter is missing", async () => {
    class Incomplete extends V2Resource<Row, { name: string }, { name?: string }> {
      protected path = "/workspaces/{slug}/projects/{project_id}/states/";
      protected operations: Record<string, OperationId> = {
        list: "states_list",
        retrieve: "states_retrieve",
        create: "states_create",
        update: "states_partial_update",
        upsert: "states_upsert",
      };

      listMissingSlug = () => this.doList({ project_id: "ENG" });
      retrieveMissingPk = () => this.doRetrieve({ slug: "acme", project_id: "ENG" });
      createMissingProjectId = () => this.doCreate({ name: "x" }, { slug: "acme" });
      updateMissingPk = () => this.doUpdate({}, { slug: "acme", project_id: "ENG" });
      deleteMissingPk = () => this.doDelete({ slug: "acme", project_id: "ENG" });
      upsertMissingSlug = () => this.doUpsert({ name: "x" }, { project_id: "ENG" });
    }

    const rows = new Incomplete(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

    await expect(rows.listMissingSlug()).rejects.toThrow(MissingPathIdError);
    await expect(rows.listMissingSlug()).rejects.toThrow(/needs the path id 'slug'/);
    await expect(rows.retrieveMissingPk()).rejects.toThrow(/needs the path id 'pk'/);

    // Pins that doCreate/doUpdate/doDelete/doUpsert stay `async` (see doList at
    // :77-81) so a synchronous throw from collectionUrl/detailUrl rejects instead
    // of escaping the call synchronously.
    await expect(rows.createMissingProjectId()).rejects.toThrow(/needs the path id 'project_id'/);
    await expect(rows.updateMissingPk()).rejects.toThrow(/needs the path id 'pk'/);
    await expect(rows.deleteMissingPk()).rejects.toThrow(/needs the path id 'pk'/);
    await expect(rows.upsertMissingSlug()).rejects.toThrow(/needs the path id 'slug'/);
  });

  it("names the resource, the method, the template and the ids that were supplied", async () => {
    class Incomplete extends V2Resource<Row, { name: string }, { name?: string }> {
      protected path = "/workspaces/{slug}/projects/{project_id}/states/";
      protected operations: Record<string, OperationId> = { list: "states_list" };

      list = (slug: string) => this.doList({ slug });
    }

    const rows = new Incomplete(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));
    let error!: MissingPathIdError;
    try {
      await rows.list("acme");
    } catch (caught) {
      error = caught as MissingPathIdError;
    }

    expect(error).toBeInstanceOf(MissingPathIdError);
    expect(error.resource).toBe("Incomplete");
    expect(error.action).toBe("list");
    expect(error.template).toBe("/workspaces/{slug}/projects/{project_id}/states/");
    expect(error.missing).toBe("project_id");
    expect(error.supplied).toEqual(["slug"]);
    expect(error.message).toContain("Incomplete.list() needs the path id 'project_id'");
    expect(error.message).toContain("ids supplied: slug");
  });

  it("treats an empty path id as missing rather than building a URL with a hole in it", async () => {
    class Rows2 extends V2Resource<Row, { name: string }, { name?: string }> {
      protected path = "/workspaces/{slug}/projects/{project_id}/states/";
      protected operations: Record<string, OperationId> = { list: "states_list" };

      list = (slug: string, project: string) => this.doList({ slug, project_id: project });
    }

    const rows = new Rows2(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

    await expect(rows.list("acme", "")).rejects.toThrow(/needs the path id 'project_id'/);
  });

  it("routes a method with an `extraPaths` override to its own template", async () => {
    class Reports extends V2Resource<Row, never, never> {
      protected path = "/workspaces/{slug}/projects/";
      protected extraPaths = { distribution: "/workspaces/{slug}/project-role-distribution/" };
      protected operations: Record<string, OperationId> = { list: "projects_list" };

      distribution = (slug: string) =>
        this.doCustomAction<{ ok: boolean }>("distribution", {
          method: "GET",
          pathParams: { slug },
        });
      collection = (slug: string) => this.collectionUrl({ slug }, "list");
      overridden = (slug: string) => this.urlFor("distribution", { slug });
    }

    const reports = new Reports(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));
    const scope = nock(BASE).get("/api/v2/workspaces/acme/project-role-distribution/").reply(200, { ok: true });

    expect(await reports.distribution("acme")).toEqual({ ok: true });
    expect(scope.isDone()).toBe(true);
    // A method with no override still resolves to `path`.
    expect(reports.collection("acme")).toBe("/workspaces/acme/projects/");
    expect(reports.overridden("acme")).toBe("/workspaces/acme/project-role-distribution/");
  });
});
