import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Estimates } from "../../../src/api/v2/Estimates";
import { EstimatePoints } from "../../../src/api/v2/Estimates/Points";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const SLUG = "acme";
const PROJECT = "ENG";
const SCOPE = { slug: SLUG, project_id: PROJECT };

const makeTransport = () => new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" }));
const makeEstimates = () => new Estimates(makeTransport(), SCOPE);

afterEach(() => nock.cleanAll());

describe("Estimates (v2)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/projects/${PROJECT}/estimates/`;

  it("lists, creates, patches, and deletes", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, { data: [{ id: "e1", name: "Sizing", type: "points" }], pagination: { style: "offset" } });
    const page = await makeEstimates().list();
    expect(page.data[0].type).toBe("points");

    nock(BASE)
      .post(collection, { name: "T-shirt sizes", type: "categories" })
      .reply(201, { id: "e2", name: "T-shirt sizes", type: "categories" });
    const created = await makeEstimates().create({ name: "T-shirt sizes", type: "categories" });
    expect(created.id).toBe("e2");

    nock(BASE)
      .patch(`${collection}e2/`, { description: "Small/Medium/Large" })
      .reply(200, { id: "e2", description: "Small/Medium/Large" });
    const updated = await makeEstimates().update("e2", { description: "Small/Medium/Large" });
    expect(updated.description).toBe("Small/Medium/Large");

    nock(BASE).delete(`${collection}e2/`).reply(204);
    await expect(makeEstimates().delete("e2")).resolves.toBeUndefined();
  });

  it("finds by name", async () => {
    nock(BASE)
      .get(collection)
      .query(true)
      .reply(200, { data: [{ id: "e1", name: "Sizing" }], pagination: { style: "offset" } });
    expect((await makeEstimates().findByName("Sizing")).id).toBe("e1");
  });

  it("reconciles on upsert", async () => {
    nock(BASE)
      .post(`${collection}upsert/`, { name: "Sizing", external_id: "ext-1", external_source: "jira" })
      .reply(200, { id: "e1", name: "Sizing", external_id: "ext-1", external_source: "jira" });
    const result = await makeEstimates().upsert({
      name: "Sizing",
      external_id: "ext-1",
      external_source: "jira",
    });
    expect(result.id).toBe("e1");
  });

  it("passes a valid expand value through, and rejects one estimates_list doesn't offer", async () => {
    const scope = nock(BASE)
      .get(`${collection}e1/`)
      .query({ expand: "points" })
      .reply(200, { id: "e1", name: "Sizing" });
    await makeEstimates().retrieve("e1", { expand: ["points"] });
    expect(scope.isDone()).toBe(true);

    await expect(makeEstimates().retrieve("e1", { expand: ["assignees"] as never })).rejects.toThrow(
      /Unknown expand value\(s\) for estimates_retrieve: assignees/
    );
  });

  it("performs all three bulk actions", async () => {
    const createScope = nock(BASE)
      .post(`${collection}bulk-create/`, { items: [{ name: "Sizing" }], all_or_none: false })
      .reply(200, { results: [{ index: 0, result: "created", id: "e1" }], succeeded: 1, failed: 0 });
    const updateScope = nock(BASE)
      .post(`${collection}bulk-update/`, { items: [{ id: "e1", name: "Renamed" }], all_or_none: false })
      .reply(200, { results: [{ index: 0, result: "updated", id: "e1" }], succeeded: 1, failed: 0 });
    const deleteScope = nock(BASE)
      .post(`${collection}bulk-delete/`, { ids: ["e1"], all_or_none: false })
      .reply(200, { results: [{ index: 0, result: "deleted", id: "e1" }], succeeded: 1, failed: 0 });

    const estimates = makeEstimates();
    await estimates.bulkCreate([{ name: "Sizing" }]);
    await estimates.bulkUpdate([{ id: "e1", name: "Renamed" }]);
    await estimates.bulkDelete(["e1"]);

    expect(createScope.isDone()).toBe(true);
    expect(updateScope.isDone()).toBe(true);
    expect(deleteScope.isDone()).toBe(true);
  });

  it("rejects an empty bulk-create batch before making a request", async () => {
    await expect(makeEstimates().bulkCreate([])).rejects.toThrow(/non-empty/);
  });
});

describe("Estimates.points (v2)", () => {
  const ESTIMATE = "e1";
  const collection = `/api/v2/workspaces/${SLUG}/projects/${PROJECT}/estimates/${ESTIMATE}/points/`;
  const make = () => new EstimatePoints(makeTransport(), SCOPE);

  it("lists, creates, retrieves, patches, and deletes", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, { data: [{ id: "p1", key: 0, value: "XS" }], pagination: { style: "offset" } });
    const page = await make().list(ESTIMATE);
    expect(page.data[0].value).toBe("XS");

    nock(BASE).post(collection, { value: "S", key: 1 }).reply(201, { id: "p2", value: "S", key: 1 });
    const created = await make().create(ESTIMATE, { value: "S", key: 1 });
    expect(created.id).toBe("p2");

    nock(BASE).get(`${collection}p2/`).reply(200, { id: "p2", value: "S" });
    expect((await make().retrieve(ESTIMATE, "p2")).value).toBe("S");

    nock(BASE).patch(`${collection}p2/`, { value: "M" }).reply(200, { id: "p2", value: "M" });
    const updated = await make().update(ESTIMATE, "p2", { value: "M" });
    expect(updated.value).toBe("M");

    nock(BASE).delete(`${collection}p2/`).reply(204);
    await expect(make().delete(ESTIMATE, "p2")).resolves.toBeUndefined();
  });

  it("reconciles on upsert", async () => {
    nock(BASE)
      .post(`${collection}upsert/`, { value: "XS", external_id: "ext-1", external_source: "jira" })
      .reply(200, { id: "p1", value: "XS", external_id: "ext-1", external_source: "jira" });
    const result = await make().upsert(ESTIMATE, {
      value: "XS",
      external_id: "ext-1",
      external_source: "jira",
    });
    expect(result.id).toBe("p1");
  });

  it("performs all three bulk actions scoped to the estimate", async () => {
    const createScope = nock(BASE)
      .post(`${collection}bulk-create/`, { items: [{ value: "XS" }], all_or_none: false })
      .reply(200, { results: [{ index: 0, result: "created", id: "p1" }], succeeded: 1, failed: 0 });
    const updateScope = nock(BASE)
      .post(`${collection}bulk-update/`, { items: [{ id: "p1", value: "XXS" }], all_or_none: false })
      .reply(200, { results: [{ index: 0, result: "updated", id: "p1" }], succeeded: 1, failed: 0 });
    const deleteScope = nock(BASE)
      .post(`${collection}bulk-delete/`, { ids: ["p1"], all_or_none: false })
      .reply(200, { results: [{ index: 0, result: "deleted", id: "p1" }], succeeded: 1, failed: 0 });

    const points = make();
    await points.bulkCreate(ESTIMATE, [{ value: "XS" }]);
    await points.bulkUpdate(ESTIMATE, [{ id: "p1", value: "XXS" }]);
    await points.bulkDelete(ESTIMATE, ["p1"]);

    expect(createScope.isDone()).toBe(true);
    expect(updateScope.isDone()).toBe(true);
    expect(deleteScope.isDone()).toBe(true);
  });

  it("rejects an unknown order_by before making the request", async () => {
    await expect(make().list(ESTIMATE, { order_by: "value" as never })).rejects.toThrow(
      /Unknown order_by 'value' for estimate_points_list/
    );
  });
});
