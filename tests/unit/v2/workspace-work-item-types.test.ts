import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { WorkspaceWorkItemTypes } from "../../../src/api/v2/WorkspaceWorkItemTypes";
import { WorkspaceWorkItemTypeProperties } from "../../../src/api/v2/WorkspaceWorkItemTypes/Properties";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const SLUG = "acme";

const makeTransport = () => new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" }));
const makeTypes = () => new WorkspaceWorkItemTypes(makeTransport(), { slug: SLUG });

afterEach(() => nock.cleanAll());

describe("WorkspaceWorkItemTypes (v2, workspace-scoped — second path template)", () => {
  const workspaceCollection = `/api/v2/workspaces/${SLUG}/work-item-types/`;

  it("lists at the workspace path, not the project-scoped one", async () => {
    // nock has no interceptor for the project-scoped path in this block: if
    // `list` mistakenly built that URL instead, the request would find no
    // match and reject, failing this test rather than silently passing.
    const scope = nock(BASE)
      .get(workspaceCollection)
      .reply(200, { data: [{ id: "t1", name: "Bug" }], pagination: { style: "offset" } });

    const page = await makeTypes().list();

    expect(scope.isDone()).toBe(true);
    expect(page.data[0].id).toBe("t1");
  });

  it("retrieves, creates, updates, and deletes at the workspace path", async () => {
    nock(BASE).get(`${workspaceCollection}t1/`).reply(200, { id: "t1", name: "Bug" });
    expect((await makeTypes().retrieve("t1")).name).toBe("Bug");

    nock(BASE).post(workspaceCollection, { name: "Task" }).reply(201, { id: "t2", name: "Task" });
    const created = await makeTypes().create({ name: "Task" });
    expect(created.id).toBe("t2");

    nock(BASE).patch(`${workspaceCollection}t2/`, { name: "Renamed" }).reply(200, { id: "t2", name: "Renamed" });
    const updated = await makeTypes().update("t2", { name: "Renamed" });
    expect(updated.name).toBe("Renamed");

    nock(BASE).delete(`${workspaceCollection}t2/`).reply(204);
    await expect(makeTypes().delete("t2")).resolves.toBeUndefined();
  });

  it("marks a type as the workspace default via the workspace mark-default/ action", async () => {
    nock(BASE).post(`${workspaceCollection}t1/mark-default/`).reply(200, { id: "t1", is_default: true });
    const result = await makeTypes().markDefault("t1");
    expect(result.is_default).toBe(true);
  });

  it("finds a type by name via the golden's own server-side ?name= filter", async () => {
    const scope = nock(BASE)
      .get(workspaceCollection)
      .query({ name: "Bug", per_page: "2", count: "false" })
      .reply(200, { data: [{ id: "t1", name: "Bug" }], pagination: { style: "offset" } });

    const found = await makeTypes().findByName("Bug");

    expect(scope.isDone()).toBe(true);
    expect(found.id).toBe("t1");
  });
});

describe("WorkspaceWorkItemTypes.properties (v2)", () => {
  const TYPE = "t1";
  const workspaceCollection = `/api/v2/workspaces/${SLUG}/work-item-types/${TYPE}/properties/`;
  const make = () => new WorkspaceWorkItemTypeProperties(makeTransport(), { slug: SLUG });

  it("lists, retrieves, attaches, and detaches at the workspace path", async () => {
    nock(BASE)
      .get(workspaceCollection)
      .reply(200, { data: [{ id: "p1" }], pagination: { style: "offset" } });
    const page = await make().list(TYPE);
    expect(page.data[0].id).toBe("p1");

    nock(BASE).get(`${workspaceCollection}p1/`).reply(200, { id: "p1", display_name: "Severity" });
    expect((await make().retrieve(TYPE, "p1")).display_name).toBe("Severity");

    const attachScope = nock(BASE)
      .post(workspaceCollection, { properties: ["p1"] })
      .reply(200, { properties: ["p1"] });
    await make().attach(TYPE, ["p1"]);
    expect(attachScope.isDone()).toBe(true);

    nock(BASE).delete(`${workspaceCollection}p1/`).reply(204);
    await expect(make().detach(TYPE, "p1")).resolves.toBeUndefined();
  });
});
