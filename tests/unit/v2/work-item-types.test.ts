import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { WorkItemTypes } from "../../../src/api/v2/WorkItemTypes";
import { WorkItemTypeProperties } from "../../../src/api/v2/WorkItemTypes/Properties";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const SLUG = "acme";
const PROJECT = "ENG";

const makeTransport = () => new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" }));
const makeTypes = () => new WorkItemTypes(makeTransport());

afterEach(() => nock.cleanAll());

describe("WorkItemTypes (v2, project-scoped)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/projects/${PROJECT}/work-item-types/`;

  it("lists, creates, patches, and deletes", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, { data: [{ id: "t1", name: "Bug" }], pagination: { style: "offset" } });
    const page = await makeTypes().list(SLUG, PROJECT);
    expect(page.data[0].name).toBe("Bug");

    nock(BASE).post(collection, { name: "Feature" }).reply(201, { id: "t2", name: "Feature", is_default: false });
    const created = await makeTypes().create(SLUG, PROJECT, { name: "Feature" });
    expect(created.id).toBe("t2");

    nock(BASE)
      .patch(`${collection}t2/`, { description: "New stuff" })
      .reply(200, { id: "t2", name: "Feature", description: "New stuff" });
    const updated = await makeTypes().update(SLUG, PROJECT, "t2", { description: "New stuff" });
    expect(updated.description).toBe("New stuff");

    nock(BASE).delete(`${collection}t2/`).reply(204);
    await expect(makeTypes().delete(SLUG, PROJECT, "t2")).resolves.toBeUndefined();
  });

  it("finds by name", async () => {
    nock(BASE)
      .get(collection)
      .query(true)
      .reply(200, { data: [{ id: "t1", name: "Bug" }], pagination: { style: "offset" } });
    expect((await makeTypes().findByName(SLUG, PROJECT, "Bug")).id).toBe("t1");
  });

  it("rejects an unknown order_by before making the request — proof the FIELDS binding is live", async () => {
    // "description" is a valid field for this resource but not a listed order_by value.
    await expect(makeTypes().list(SLUG, PROJECT, { order_by: "description" as never })).rejects.toThrow(
      /Unknown order_by 'description' for work_item_types_list/
    );

    // Falsifiability check for the assertion above: an accepted order_by must NOT throw,
    // proving the previous rejection was actually about the bad value, not a broken mock.
    const scope = nock(BASE)
      .get(collection)
      .query({ order_by: "name" })
      .reply(200, { data: [], pagination: { style: "offset" } });
    await makeTypes().list(SLUG, PROJECT, { order_by: "name" });
    expect(scope.isDone()).toBe(true);
  });

  it("marks a type as the project default via the mark-default/ action", async () => {
    nock(BASE).post(`${collection}t1/mark-default/`).reply(200, { id: "t1", name: "Bug", is_default: true });
    const result = await makeTypes().markDefault(SLUG, PROJECT, "t1");
    expect(result.is_default).toBe(true);
  });

  it("fetches the writable-field schema via the schema/ action, passing include through", async () => {
    const scope = nock(BASE).get(`${collection}t1/schema/`).query({ include: "members,labels" }).reply(200, {
      type_id: "t1",
      type_name: "Bug",
      type_description: null,
      type_logo_props: null,
      fields: {},
      custom_fields: {},
    });
    const schema = await makeTypes().schema(SLUG, PROJECT, "t1", { include: "members,labels" });
    expect(scope.isDone()).toBe(true);
    expect(schema.type_name).toBe("Bug");
  });

  it("enables the Epic type via the collection-level enable/ action", async () => {
    nock(BASE).post(`${collection}enable/`).reply(200, { id: "epic-1", name: "Epic", is_epic: true });
    const result = await makeTypes().enable(SLUG, PROJECT);
    expect(result.is_epic).toBe(true);
  });

  it("imports workspace types into the project via the collection-level import/ action, with no response body", async () => {
    const scope = nock(BASE)
      .post(`${collection}import/`, { work_item_types: ["wt-1", "wt-2"] })
      .reply(200);
    await expect(makeTypes().import(SLUG, PROJECT, ["wt-1", "wt-2"])).resolves.toBeUndefined();
    expect(scope.isDone()).toBe(true);
  });
});

describe("WorkItemTypes.properties (v2, project-scoped)", () => {
  const TYPE = "t1";
  const projectCollection = `/api/v2/workspaces/${SLUG}/projects/${PROJECT}/work-item-types/${TYPE}/properties/`;
  const make = () => new WorkItemTypeProperties(makeTransport());

  it("lists and retrieves attached properties", async () => {
    nock(BASE)
      .get(projectCollection)
      .reply(200, {
        data: [{ id: "p1", display_name: "Severity", property_type: "OPTION" }],
        pagination: { style: "offset" },
      });
    const page = await make().list(SLUG, PROJECT, TYPE);
    expect(page.data[0].display_name).toBe("Severity");

    nock(BASE).get(`${projectCollection}p1/`).reply(200, { id: "p1", display_name: "Severity" });
    expect((await make().retrieve(SLUG, PROJECT, TYPE, "p1")).id).toBe("p1");
  });

  it("links then unlinks a property", async () => {
    const scope = nock(BASE)
      .post(projectCollection, { properties: ["p1", "p2"] })
      .reply(200, { properties: ["p1", "p2"] });
    const linked = await make().link(SLUG, PROJECT, TYPE, ["p1", "p2"]);
    expect(scope.isDone()).toBe(true);
    expect(linked.properties).toEqual(["p1", "p2"]);

    nock(BASE).delete(`${projectCollection}p1/`).reply(204);
    await expect(make().unlink(SLUG, PROJECT, TYPE, "p1")).resolves.toBeUndefined();
  });
});

describe("navigable work item type rows (v2)", () => {
  it("reaches a fetched project-scoped type's properties with no id repeated", async () => {
    const collection = `/api/v2/workspaces/${SLUG}/projects/${PROJECT}/work-item-types/`;
    nock(BASE).get(`${collection}t1/`).reply(200, { id: "t1", name: "Bug" });
    const scope = nock(BASE)
      .get(`${collection}t1/properties/`)
      .reply(200, { data: [{ id: "p1" }], pagination: { style: "offset" } });

    const type = await makeTypes().retrieve(SLUG, PROJECT, "t1");
    const properties = await type.properties.list();

    expect(scope.isDone()).toBe(true);
    expect(properties.data[0].id).toBe("p1");
  });

  it("reaches the link bridge from a fetched type", async () => {
    const collection = `/api/v2/workspaces/${SLUG}/projects/${PROJECT}/work-item-types/`;
    nock(BASE).get(`${collection}t1/`).reply(200, { id: "t1" });
    const scope = nock(BASE)
      .post(`${collection}t1/properties/`, { properties: ["p1"] })
      .reply(200, { properties: ["p1"] });

    await (await makeTypes().retrieve(SLUG, PROJECT, "t1")).properties.link(["p1"]);

    expect(scope.isDone()).toBe(true);
  });
});
