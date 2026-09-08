/**
 * Covers project-scoped `WorkItemProperties`/`options` and workspace-scoped `WorkspaceWorkItemProperties`; all plain CRUD.
 */
import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { WorkItemProperties } from "../../../src/api/v2/WorkItemProperties";
import { WorkItemPropertyContexts, WorkspaceWorkItemProperties } from "../../../src/api/v2/WorkspaceWorkItemProperties";
import { V2Transport } from "../../../src/api/v2/kernel/transport";
import { MultipleMatchesFoundError, NoMatchFoundError } from "../../../src/errors/PlaneApiError";

const BASE = "https://api.example.com";
const SLUG = "acme";
const PROJECT = "ENG";

const makeTransport = () => new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" }));

afterEach(() => nock.cleanAll());

describe("WorkItemProperties (project-scoped, v2)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/projects/${PROJECT}/work-item-properties/`;
  const make = () => new WorkItemProperties(makeTransport(), { slug: SLUG, project_id: PROJECT });

  it("lists, creates, retrieves, updates, deletes", async () => {
    const write = { display_name: "Priority Tier", property_type: "OPTION" as const };
    nock(BASE)
      .get(collection)
      .reply(200, { data: [{ id: "p1", display_name: "Priority Tier" }], pagination: { style: "offset" } });
    nock(BASE)
      .post(collection, write)
      .reply(201, { id: "p1", ...write });
    nock(BASE)
      .get(`${collection}p1/`)
      .reply(200, { id: "p1", ...write });
    nock(BASE)
      .patch(`${collection}p1/`, { display_name: "Priority Level" })
      .reply(200, { id: "p1", display_name: "Priority Level" });
    nock(BASE).delete(`${collection}p1/`).reply(204);

    const properties = make();
    const page = await properties.list();
    expect(page.data[0].display_name).toBe("Priority Tier");

    const created = await properties.create(write);
    expect(created.id).toBe("p1");

    const fetched = await properties.retrieve("p1");
    expect(fetched.property_type).toBe("OPTION");

    const updated = await properties.update("p1", { display_name: "Priority Level" });
    expect(updated.display_name).toBe("Priority Level");

    await expect(properties.delete("p1")).resolves.toBeUndefined();
  });

  it("narrows the row type to the requested fields", async () => {
    nock(BASE)
      .get(collection)
      .query({ fields: "id,display_name" })
      .reply(200, { data: [{ id: "p1", display_name: "Priority Tier" }], pagination: { style: "offset" } });

    const page = await make().list({ fields: ["id", "display_name"] as const });
    expect(page.data[0].display_name).toBe("Priority Tier");
    // @ts-expect-error `property_type` was not requested, so it is not on the narrowed type
    expect(page.data[0].property_type).toBeUndefined();
  });

  it("passes through a valid order_by and rejects an unknown one", async () => {
    const scope = nock(BASE)
      .get(collection)
      .query({ order_by: "-sort_order" })
      .reply(200, {
        data: [],
        pagination: { style: "offset" },
      });
    await make().list({ order_by: "-sort_order" });
    expect(scope.isDone()).toBe(true);

    // Proof this check can actually fail: an order_by the golden genuinely rejects
    // (a `fields`-only value, not an `order_by` one) must throw, not silently pass.
    await expect(make().list({ order_by: "display_name" as never })).rejects.toThrow(
      /Unknown order_by 'display_name' for work_item_properties_list/
    );
  });

  it("rejects an unknown fields value", async () => {
    await expect(make().list({ fields: ["nope" as never] })).rejects.toThrow(
      /Unknown field\(s\) for work_item_properties_list: nope/
    );
  });

  describe("findByName()", () => {
    it("resolves the one project property with this name (the property key) via the server-side ?name= filter", async () => {
      const scope = nock(BASE)
        .get(collection)
        .query({ name: "story-points", per_page: "2", count: "false" })
        .reply(200, { data: [{ id: "p1", name: "story-points" }], pagination: { style: "offset" } });

      const found = await make().findByName("story-points");

      expect(scope.isDone()).toBe(true);
      expect(found.id).toBe("p1");
    });

    it("throws NoMatchFoundError on 0 matches and MultipleMatchesFoundError on 2", async () => {
      nock(BASE)
        .get(collection)
        .query({ name: "nope", per_page: "2", count: "false" })
        .reply(200, { data: [], pagination: { style: "offset" } });
      await expect(make().findByName("nope")).rejects.toBeInstanceOf(NoMatchFoundError);

      nock(BASE)
        .get(collection)
        .query({ name: "dup", per_page: "2", count: "false" })
        .reply(200, { data: [{ id: "p1" }, { id: "p2" }], pagination: { style: "offset" } });
      await expect(make().findByName("dup")).rejects.toBeInstanceOf(MultipleMatchesFoundError);
    });
  });

  describe("findByDisplayName()", () => {
    it("resolves the one project property with this UI label via the server-side ?display_name= filter", async () => {
      // The filter the query-filter sweep forced into existence. `display_name` reached the
      // golden only when it was refreshed off `origin/preview`, and until that sweep nothing
      // compared a params type against the filters its operation offers — so the lookup a
      // caller actually wants (the label they can see on screen, not the slugified key) was
      // unreachable from the SDK.
      const scope = nock(BASE)
        .get(collection)
        .query({ display_name: "Story Points", per_page: "2", count: "false" })
        .reply(200, {
          data: [{ id: "p1", display_name: "Story Points", name: "story-points" }],
          pagination: { style: "offset" },
        });

      const found = await make().findByDisplayName("Story Points");

      expect(scope.isDone()).toBe(true);
      expect(found.id).toBe("p1");
    });

    it("passes `display_name` straight through on list()", async () => {
      const scope = nock(BASE)
        .get(collection)
        .query({ display_name: "Story Points" })
        .reply(200, { data: [], pagination: { style: "offset" } });

      await make().list({ display_name: "Story Points" });

      expect(scope.isDone()).toBe(true);
    });
  });
});

describe("WorkItemProperties.options (project-scoped, v2)", () => {
  const propertyId = "p1";
  const collection = `/api/v2/workspaces/${SLUG}/projects/${PROJECT}/work-item-properties/${propertyId}/options/`;
  const make = () => new WorkItemProperties(makeTransport(), { slug: SLUG, project_id: PROJECT }).options;

  it("creates, retrieves, updates, deletes an option", async () => {
    const write = { name: "High" };
    nock(BASE)
      .post(collection, write)
      .reply(201, { id: "o1", ...write });
    nock(BASE)
      .get(`${collection}o1/`)
      .reply(200, { id: "o1", ...write });
    nock(BASE).patch(`${collection}o1/`, { name: "Highest" }).reply(200, { id: "o1", name: "Highest" });
    nock(BASE).delete(`${collection}o1/`).reply(204);

    const options = make();
    const created = await options.create(propertyId, write);
    expect(created.id).toBe("o1");
    const fetched = await options.retrieve(propertyId, "o1");
    expect(fetched.name).toBe("High");
    const updated = await options.update(propertyId, "o1", { name: "Highest" });
    expect(updated.name).toBe("Highest");
    await expect(options.delete(propertyId, "o1")).resolves.toBeUndefined();
  });

  it("lists with a name filter, following pages via iterate", async () => {
    nock(BASE)
      .get(collection)
      .query({ name: "High" })
      .reply(200, { data: [{ id: "o1", name: "High" }], pagination: { style: "offset" }, next: null });
    const page = await make().list(propertyId, { name: "High" });
    expect(page.data[0].name).toBe("High");

    nock(BASE)
      .get(collection)
      .reply(200, { data: [{ id: "o1" }], pagination: { style: "offset" }, next: null });
    const seen: string[] = [];
    for await (const row of make().iterate(propertyId)) seen.push(row.id);
    expect(seen).toEqual(["o1"]);
  });

  it("passes through a valid order_by despite the operation id being absent from FIELDS", async () => {
    const scope = nock(BASE)
      .get(collection)
      .query({ order_by: "sort_order" })
      .reply(200, {
        data: [],
        pagination: { style: "offset" },
      });
    await make().list(propertyId, { order_by: "sort_order" });
    expect(scope.isDone()).toBe(true);
  });

  it("still rejects an order_by the golden does not offer for this operation", async () => {
    // Proof the ORDER_BY-only cast (see Options.ts's `operations` comment) didn't
    // quietly disable validation: "name" is a real filter param but not a valid
    // order_by for this operation.
    await expect(make().list(propertyId, { order_by: "name" as never })).rejects.toThrow(
      /Unknown order_by 'name' for work_item_property_options_list/
    );
  });

  describe("findByName()", () => {
    it("resolves the one option with this name via the server-side ?name= filter", async () => {
      const scope = nock(BASE)
        .get(collection)
        .query({ name: "High", per_page: "2", count: "false" })
        .reply(200, { data: [{ id: "o1", name: "High" }], pagination: { style: "offset" } });

      const found = await make().findByName(propertyId, "High");

      expect(scope.isDone()).toBe(true);
      expect(found.id).toBe("o1");
    });

    it("throws NoMatchFoundError when no option matches the name", async () => {
      nock(BASE)
        .get(collection)
        .query({ name: "Nope", per_page: "2", count: "false" })
        .reply(200, { data: [], pagination: { style: "offset" } });

      await expect(make().findByName(propertyId, "Nope")).rejects.toThrow(/No WorkItemPropertyOptions matched/);
    });
  });
});

describe("WorkspaceWorkItemProperties (workspace-scoped, v2)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/work-item-properties/`;
  const make = () => new WorkspaceWorkItemProperties(makeTransport(), { slug: SLUG });

  it("lists, creates, retrieves, updates, deletes", async () => {
    const write = { display_name: "Severity", property_type: "TEXT" as const };
    nock(BASE)
      .get(collection)
      .reply(200, { data: [{ id: "wp1", display_name: "Severity" }], pagination: { style: "offset" } });
    nock(BASE)
      .post(collection, write)
      .reply(201, { id: "wp1", ...write });
    nock(BASE)
      .get(`${collection}wp1/`)
      .reply(200, { id: "wp1", ...write });
    nock(BASE).patch(`${collection}wp1/`, { is_required: true }).reply(200, { id: "wp1", is_required: true });
    nock(BASE).delete(`${collection}wp1/`).reply(204);

    const properties = make();
    const page = await properties.list();
    expect(page.data[0].display_name).toBe("Severity");
    const created = await properties.create(write);
    expect(created.id).toBe("wp1");
    const fetched = await properties.retrieve("wp1");
    expect(fetched.property_type).toBe("TEXT");
    const updated = await properties.update("wp1", { is_required: true });
    expect(updated.is_required).toBe(true);
    await expect(properties.delete("wp1")).resolves.toBeUndefined();
  });

  it("exposes contexts and options as sub-resources", () => {
    const properties = make();
    expect(properties.contexts).toBeInstanceOf(WorkItemPropertyContexts);
    expect(properties.options).toBeDefined();
  });

  describe("findByName()", () => {
    it("resolves the one workspace property with this name (the property key) via the server-side ?name= filter", async () => {
      const scope = nock(BASE)
        .get(collection)
        .query({ name: "story-points", per_page: "2", count: "false" })
        .reply(200, { data: [{ id: "p1", name: "story-points" }], pagination: { style: "offset" } });

      const found = await make().findByName("story-points");

      expect(scope.isDone()).toBe(true);
      expect(found.id).toBe("p1");
    });

    it("throws NoMatchFoundError on 0 matches and MultipleMatchesFoundError on 2", async () => {
      nock(BASE)
        .get(collection)
        .query({ name: "nope", per_page: "2", count: "false" })
        .reply(200, { data: [], pagination: { style: "offset" } });
      await expect(make().findByName("nope")).rejects.toBeInstanceOf(NoMatchFoundError);

      nock(BASE)
        .get(collection)
        .query({ name: "dup", per_page: "2", count: "false" })
        .reply(200, { data: [{ id: "p1" }, { id: "p2" }], pagination: { style: "offset" } });
      await expect(make().findByName("dup")).rejects.toBeInstanceOf(MultipleMatchesFoundError);
    });
  });

  describe("findByDisplayName()", () => {
    it("resolves the one workspace property with this UI label via the server-side ?display_name= filter", async () => {
      // The filter the query-filter sweep forced into existence. `display_name` reached the
      // golden only when it was refreshed off `origin/preview`, and until that sweep nothing
      // compared a params type against the filters its operation offers — so the lookup a
      // caller actually wants (the label they can see on screen, not the slugified key) was
      // unreachable from the SDK.
      const scope = nock(BASE)
        .get(collection)
        .query({ display_name: "Story Points", per_page: "2", count: "false" })
        .reply(200, {
          data: [{ id: "p1", display_name: "Story Points", name: "story-points" }],
          pagination: { style: "offset" },
        });

      const found = await make().findByDisplayName("Story Points");

      expect(scope.isDone()).toBe(true);
      expect(found.id).toBe("p1");
    });

    it("passes `display_name` straight through on list()", async () => {
      const scope = nock(BASE)
        .get(collection)
        .query({ display_name: "Story Points" })
        .reply(200, { data: [], pagination: { style: "offset" } });

      await make().list({ display_name: "Story Points" });

      expect(scope.isDone()).toBe(true);
    });
  });
});

describe("WorkspaceWorkItemProperties.contexts (v2)", () => {
  const propertyId = "wp1";
  const collection = `/api/v2/workspaces/${SLUG}/work-item-properties/${propertyId}/contexts/`;
  const make = () => new WorkspaceWorkItemProperties(makeTransport(), { slug: SLUG }).contexts;

  it("creates, retrieves, updates, deletes a context", async () => {
    const write = { name: "Engineering rollout", project_ids: ["proj-1"] };
    nock(BASE).post(collection, write).reply(201, { id: "c1", name: "Engineering rollout" });
    nock(BASE).get(`${collection}c1/`).reply(200, { id: "c1", name: "Engineering rollout" });
    nock(BASE).patch(`${collection}c1/`, { is_required: true }).reply(200, { id: "c1", is_required: true });
    nock(BASE).delete(`${collection}c1/`).reply(204);

    const contexts = make();
    const created = await contexts.create(propertyId, write);
    expect(created.id).toBe("c1");
    const fetched = await contexts.retrieve(propertyId, "c1");
    expect(fetched.name).toBe("Engineering rollout");
    const updated = await contexts.update(propertyId, "c1", { is_required: true });
    expect(updated.is_required).toBe(true);
    await expect(contexts.delete(propertyId, "c1")).resolves.toBeUndefined();
  });

  it("narrows the row type to the requested fields", async () => {
    nock(BASE)
      .get(collection)
      .query({ fields: "id,name" })
      .reply(200, { data: [{ id: "c1", name: "Engineering rollout" }], pagination: { style: "offset" } });

    const page = await make().list(propertyId, { fields: ["id", "name"] as const });
    expect(page.data[0].name).toBe("Engineering rollout");
    // @ts-expect-error `is_default` was not requested, so it is not on the narrowed type
    expect(page.data[0].is_default).toBeUndefined();
  });

  it("rejects an unknown fields value", async () => {
    await expect(make().list(propertyId, { fields: ["nope" as never] })).rejects.toThrow(
      /Unknown field\(s\) for work_item_property_contexts_list: nope/
    );
  });

  describe("findByName()", () => {
    it("resolves the one context with this name via the server-side ?name= filter", async () => {
      const scope = nock(BASE)
        .get(collection)
        .query({ name: "Engineering rollout", per_page: "2", count: "false" })
        .reply(200, { data: [{ id: "c1", name: "Engineering rollout" }], pagination: { style: "offset" } });

      const found = await make().findByName(propertyId, "Engineering rollout");

      expect(scope.isDone()).toBe(true);
      expect(found.id).toBe("c1");
    });

    it("throws NoMatchFoundError when no context matches the name", async () => {
      nock(BASE)
        .get(collection)
        .query({ name: "Nope", per_page: "2", count: "false" })
        .reply(200, { data: [], pagination: { style: "offset" } });

      await expect(make().findByName(propertyId, "Nope")).rejects.toThrow(/No WorkItemPropertyContexts matched/);
    });
  });
});

describe("WorkspaceWorkItemProperties.options (v2)", () => {
  const propertyId = "wp1";
  const collection = `/api/v2/workspaces/${SLUG}/work-item-properties/${propertyId}/options/`;
  const make = () => new WorkspaceWorkItemProperties(makeTransport(), { slug: SLUG }).options;

  it("findByName resolves the one option with this name via the server-side ?name= filter", async () => {
    const scope = nock(BASE)
      .get(collection)
      .query({ name: "P0", per_page: "2", count: "false" })
      .reply(200, { data: [{ id: "o1", name: "P0" }], pagination: { style: "offset" } });

    const found = await make().findByName(propertyId, "P0");

    expect(scope.isDone()).toBe(true);
    expect(found.id).toBe("o1");
  });

  it("creates, retrieves, updates, deletes an option", async () => {
    const write = { name: "P0" };
    nock(BASE)
      .post(collection, write)
      .reply(201, { id: "o1", ...write });
    nock(BASE)
      .get(`${collection}o1/`)
      .reply(200, { id: "o1", ...write });
    nock(BASE).patch(`${collection}o1/`, { name: "P0-critical" }).reply(200, { id: "o1", name: "P0-critical" });
    nock(BASE).delete(`${collection}o1/`).reply(204);

    const options = make();
    const created = await options.create(propertyId, write);
    expect(created.id).toBe("o1");
    const fetched = await options.retrieve(propertyId, "o1");
    expect(fetched.name).toBe("P0");
    const updated = await options.update(propertyId, "o1", { name: "P0-critical" });
    expect(updated.name).toBe("P0-critical");
    await expect(options.delete(propertyId, "o1")).resolves.toBeUndefined();
  });

  it("passes through a valid order_by and rejects an invalid one", async () => {
    const scope = nock(BASE)
      .get(collection)
      .query({ order_by: "-created_at" })
      .reply(200, {
        data: [],
        pagination: { style: "offset" },
      });
    await make().list(propertyId, { order_by: "-created_at" });
    expect(scope.isDone()).toBe(true);

    await expect(make().list(propertyId, { order_by: "external_id" as never })).rejects.toThrow(
      /Unknown order_by 'external_id' for workspace_work_item_property_options_list/
    );
  });
});
