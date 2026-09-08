/**
 * Automations (api_v2): project/workspace-scoped variants plus nodes/edges/activities sub-resources.
 */
import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import {
  ProjectAutomationActivities,
  ProjectAutomationEdges,
  ProjectAutomationNodes,
  ProjectAutomations,
  WorkspaceAutomationActivities,
  WorkspaceAutomationEdges,
  WorkspaceAutomationNodes,
  WorkspaceAutomations,
} from "../../../src/api/v2/Automations";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const SLUG = "acme";
const PROJECT = "ENG";
const AUTOMATION = "auto-1";

const makeTransport = () => new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" }));

afterEach(() => nock.cleanAll());

describe("ProjectAutomations (v2)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/projects/${PROJECT}/automations/`;
  const make = () => new ProjectAutomations(makeTransport());

  it("lists, narrows fields, and rejects an unknown field", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, {
        data: [{ id: AUTOMATION, name: "On work item created", scope: "WorkItem" }],
        pagination: { style: "offset" },
      });
    const page = await make().list(SLUG, PROJECT);
    expect(page.data[0].scope).toBe("WorkItem");

    // Proven capable of failing: with "nope" replaced by a real field ("name") the
    // client stops throwing and attempts a network call instead, so the rejection
    // below is real client-side validation, not a vacuous assertion.
    await expect(make().list(SLUG, PROJECT, { fields: ["nope" as never] })).rejects.toThrow(
      /Unknown field\(s\) for project_automations_list: nope/
    );
  });

  it("creates, retrieves, patches, deletes", async () => {
    const write = { name: "On work item created", scope: "WorkItem" };
    nock(BASE)
      .post(collection, write)
      .reply(201, { id: AUTOMATION, ...write, is_enabled: false, status: "draft" });
    nock(BASE)
      .get(`${collection}${AUTOMATION}/`)
      .reply(200, { id: AUTOMATION, ...write, status: "draft" });
    nock(BASE)
      .patch(`${collection}${AUTOMATION}/`, { description: "Notifies the channel" })
      .reply(200, { id: AUTOMATION, ...write, description: "Notifies the channel" });
    nock(BASE).delete(`${collection}${AUTOMATION}/`).reply(204);

    const automations = make();
    const created = await automations.create(SLUG, PROJECT, write);
    expect(created.status).toBe("draft");

    const fetched = await automations.retrieve(SLUG, PROJECT, AUTOMATION);
    expect(fetched.name).toBe(write.name);

    const updated = await automations.update(SLUG, PROJECT, AUTOMATION, { description: "Notifies the channel" });
    expect(updated.description).toBe("Notifies the channel");

    await expect(automations.delete(SLUG, PROJECT, AUTOMATION)).resolves.toBeUndefined();
  });

  it("flips is_enabled through the status action, posting the body to .../status/", async () => {
    const scope = nock(BASE).post(`${collection}${AUTOMATION}/status/`, { is_enabled: true }).reply(204);

    await expect(make().setStatus(SLUG, PROJECT, AUTOMATION, { is_enabled: true })).resolves.toBeUndefined();
    expect(scope.isDone()).toBe(true);
  });

  it("finds by name", async () => {
    const scope = nock(BASE)
      .get(collection)
      .query({ name: "On work item created", per_page: "2", count: "false" })
      .reply(200, { data: [{ id: AUTOMATION, name: "On work item created" }], pagination: { style: "offset" } });

    expect((await make().findByName(SLUG, PROJECT, "On work item created")).id).toBe(AUTOMATION);
    expect(scope.isDone()).toBe(true);
  });

  it("exposes nodes/edges/activities scoped to the given automation", async () => {
    const automations = make();
    expect(automations.nodes).toBeInstanceOf(ProjectAutomationNodes);
    expect(automations.edges).toBeInstanceOf(ProjectAutomationEdges);
    expect(automations.activities).toBeInstanceOf(ProjectAutomationActivities);
  });
});

describe("ProjectAutomationNodes (v2)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/projects/${PROJECT}/automations/${AUTOMATION}/nodes/`;
  const make = () => new ProjectAutomationNodes(makeTransport());

  it("creates, retrieves, patches, deletes", async () => {
    const write = { handler_name: "send_email", name: "Notify assignee", node_type: "action" as const };
    nock(BASE)
      .post(collection, write)
      .reply(201, { id: "node-1", ...write, is_enabled: true });
    nock(BASE)
      .get(`${collection}node-1/`)
      .reply(200, { id: "node-1", ...write });
    nock(BASE).patch(`${collection}node-1/`, { is_enabled: false }).reply(200, { id: "node-1", is_enabled: false });
    nock(BASE).delete(`${collection}node-1/`).reply(204);

    const nodes = make();
    const created = await nodes.create(SLUG, PROJECT, AUTOMATION, write);
    expect(created.node_type).toBe("action");

    const fetched = await nodes.retrieve(SLUG, PROJECT, AUTOMATION, "node-1");
    expect(fetched.handler_name).toBe("send_email");

    const updated = await nodes.update(SLUG, PROJECT, AUTOMATION, "node-1", { is_enabled: false });
    expect(updated.is_enabled).toBe(false);

    await expect(nodes.delete(SLUG, PROJECT, AUTOMATION, "node-1")).resolves.toBeUndefined();
  });

  it("lists with a handler_name/node_type filter", async () => {
    const scope = nock(BASE)
      .get(collection)
      .query({ node_type: "trigger" })
      .reply(200, { data: [], pagination: { style: "offset" } });
    await make().list(SLUG, PROJECT, AUTOMATION, { node_type: "trigger" });
    expect(scope.isDone()).toBe(true);
  });

  it("regenerates the webhook secret via a bare POST", async () => {
    const scope = nock(BASE).post(`${collection}node-1/regenerate-webhook-secret/`).reply(200, { secret: "whsec_new" });

    const result = await make().regenerateWebhookSecret(SLUG, PROJECT, AUTOMATION, "node-1");
    expect(result.secret).toBe("whsec_new");
    expect(scope.isDone()).toBe(true);
  });

  it("finds by name", async () => {
    const scope = nock(BASE)
      .get(collection)
      .query({ name: "Notify assignee", per_page: "2", count: "false" })
      .reply(200, { data: [{ id: "node-1", name: "Notify assignee" }], pagination: { style: "offset" } });

    expect((await make().findByName(SLUG, PROJECT, AUTOMATION, "Notify assignee")).id).toBe("node-1");
    expect(scope.isDone()).toBe(true);
  });
});

describe("ProjectAutomationEdges (v2)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/projects/${PROJECT}/automations/${AUTOMATION}/edges/`;
  const make = () => new ProjectAutomationEdges(makeTransport());

  it("creates, retrieves, patches, deletes", async () => {
    const write = { source_node_id: "node-1", target_node_id: "node-2" };
    nock(BASE)
      .post(collection, write)
      .reply(201, { id: "edge-1", ...write, execution_order: 0 });
    nock(BASE)
      .get(`${collection}edge-1/`)
      .reply(200, { id: "edge-1", ...write });
    nock(BASE).patch(`${collection}edge-1/`, { execution_order: 5 }).reply(200, { id: "edge-1", execution_order: 5 });
    nock(BASE).delete(`${collection}edge-1/`).reply(204);

    const edges = make();
    const created = await edges.create(SLUG, PROJECT, AUTOMATION, write);
    expect(created.target_node_id).toBe("node-2");

    const fetched = await edges.retrieve(SLUG, PROJECT, AUTOMATION, "edge-1");
    expect(fetched.source_node_id).toBe("node-1");

    const updated = await edges.update(SLUG, PROJECT, AUTOMATION, "edge-1", { execution_order: 5 });
    expect(updated.execution_order).toBe(5);

    await expect(edges.delete(SLUG, PROJECT, AUTOMATION, "edge-1")).resolves.toBeUndefined();
  });

  it("rejects an unknown order_by before making the request", async () => {
    // "name" isn't a valid order_by field here; the golden's ORDER_BY set is
    // {id, created_at, execution_order}.
    await expect(make().list(SLUG, PROJECT, AUTOMATION, { order_by: "name" as never })).rejects.toThrow(
      /Unknown order_by 'name' for project_automation_edges_list/
    );
  });
});

describe("ProjectAutomationActivities (v2)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/projects/${PROJECT}/automations/${AUTOMATION}/activities/`;
  const make = () => new ProjectAutomationActivities(makeTransport());

  it("lists and retrieves, read-only", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, { data: [{ id: "act-1", verb: "created" }], pagination: { style: "offset" } });
    const page = await make().list(SLUG, PROJECT, AUTOMATION);
    expect(page.data[0].verb).toBe("created");

    nock(BASE).get(`${collection}act-1/`).reply(200, { id: "act-1", verb: "created", field: "is_enabled" });
    const fetched = await make().retrieve(SLUG, PROJECT, AUTOMATION, "act-1");
    expect(fetched.field).toBe("is_enabled");
  });

  it("filters by verb and created_at__gt", async () => {
    const scope = nock(BASE)
      .get(collection)
      .query({ verb: "updated", created_at__gt: "2026-01-01T00:00:00Z" })
      .reply(200, { data: [], pagination: { style: "offset" } });
    await make().list(SLUG, PROJECT, AUTOMATION, { verb: "updated", created_at__gt: "2026-01-01T00:00:00Z" });
    expect(scope.isDone()).toBe(true);
  });
});

describe("WorkspaceAutomations (v2)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/automations/`;
  const make = () => new WorkspaceAutomations(makeTransport());

  it("has no /projects/{project_id}/ segment, unlike ProjectAutomations", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, { data: [{ id: AUTOMATION, is_global: true }], pagination: { style: "offset" } });
    const page = await make().list(SLUG);
    expect(page.data[0].is_global).toBe(true);
  });

  it("creates, retrieves, patches, deletes", async () => {
    const write = { name: "Escalate stale work items", scope: "WorkItem" };
    nock(BASE)
      .post(collection, write)
      .reply(201, { id: AUTOMATION, ...write, is_global: true });
    nock(BASE)
      .get(`${collection}${AUTOMATION}/`)
      .reply(200, { id: AUTOMATION, ...write });
    nock(BASE)
      .patch(`${collection}${AUTOMATION}/`, { description: "Runs nightly" })
      .reply(200, { id: AUTOMATION, description: "Runs nightly" });
    nock(BASE).delete(`${collection}${AUTOMATION}/`).reply(204);

    const automations = make();
    const created = await automations.create(SLUG, write);
    expect(created.is_global).toBe(true);

    const fetched = await automations.retrieve(SLUG, AUTOMATION);
    expect(fetched.name).toBe(write.name);

    const updated = await automations.update(SLUG, AUTOMATION, { description: "Runs nightly" });
    expect(updated.description).toBe("Runs nightly");

    await expect(automations.delete(SLUG, AUTOMATION)).resolves.toBeUndefined();
  });

  it("flips is_enabled through the status action", async () => {
    const scope = nock(BASE).post(`${collection}${AUTOMATION}/status/`, { is_enabled: false }).reply(204);

    await expect(make().setStatus(SLUG, AUTOMATION, { is_enabled: false })).resolves.toBeUndefined();
    expect(scope.isDone()).toBe(true);
  });

  it("finds by name", async () => {
    const scope = nock(BASE)
      .get(collection)
      .query({ name: "Escalate stale work items", per_page: "2", count: "false" })
      .reply(200, { data: [{ id: AUTOMATION, name: "Escalate stale work items" }], pagination: { style: "offset" } });

    expect((await make().findByName(SLUG, "Escalate stale work items")).id).toBe(AUTOMATION);
    expect(scope.isDone()).toBe(true);
  });

  it("exposes nodes/edges/activities scoped to the given automation", () => {
    const automations = make();
    expect(automations.nodes).toBeInstanceOf(WorkspaceAutomationNodes);
    expect(automations.edges).toBeInstanceOf(WorkspaceAutomationEdges);
    expect(automations.activities).toBeInstanceOf(WorkspaceAutomationActivities);
  });
});

describe("WorkspaceAutomationNodes (v2)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/automations/${AUTOMATION}/nodes/`;
  const make = () => new WorkspaceAutomationNodes(makeTransport());

  it("creates a node and regenerates its webhook secret", async () => {
    const write = { handler_name: "webhook_trigger", name: "Inbound webhook", node_type: "trigger" as const };
    nock(BASE)
      .post(collection, write)
      .reply(201, { id: "node-1", ...write });
    const created = await make().create(SLUG, AUTOMATION, write);
    expect(created.id).toBe("node-1");

    nock(BASE).post(`${collection}node-1/regenerate-webhook-secret/`).reply(200, { secret: "whsec_ws" });
    const result = await make().regenerateWebhookSecret(SLUG, AUTOMATION, "node-1");
    expect(result.secret).toBe("whsec_ws");
  });

  it("finds by name", async () => {
    const scope = nock(BASE)
      .get(collection)
      .query({ name: "Inbound webhook", per_page: "2", count: "false" })
      .reply(200, { data: [{ id: "node-1", name: "Inbound webhook" }], pagination: { style: "offset" } });

    expect((await make().findByName(SLUG, AUTOMATION, "Inbound webhook")).id).toBe("node-1");
    expect(scope.isDone()).toBe(true);
  });
});

describe("WorkspaceAutomationEdges (v2)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/automations/${AUTOMATION}/edges/`;
  const make = () => new WorkspaceAutomationEdges(makeTransport());

  it("lists with a source_node_id/target_node_id filter", async () => {
    const scope = nock(BASE)
      .get(collection)
      .query({ source_node_id: "node-1" })
      .reply(200, { data: [], pagination: { style: "offset" } });
    await make().list(SLUG, AUTOMATION, { source_node_id: "node-1" });
    expect(scope.isDone()).toBe(true);
  });

  it("deletes an edge", async () => {
    nock(BASE).delete(`${collection}edge-1/`).reply(204);
    await expect(make().delete(SLUG, AUTOMATION, "edge-1")).resolves.toBeUndefined();
  });
});

describe("WorkspaceAutomationActivities (v2)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/automations/${AUTOMATION}/activities/`;
  const make = () => new WorkspaceAutomationActivities(makeTransport());

  it("lists activities for a workspace-scoped automation", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, { data: [{ id: "act-1", verb: "created" }], pagination: { style: "offset" } });
    const page = await make().list(SLUG, AUTOMATION);
    expect(page.data[0].verb).toBe("created");
  });
});

describe("navigable automation rows (v2)", () => {
  it("reaches a project-scoped automation's nodes, edges and activities from a fetched row", async () => {
    const base = `/api/v2/workspaces/${SLUG}/projects/${PROJECT}/automations/${AUTOMATION}`;
    nock(BASE).get(`${base}/`).reply(200, { id: AUTOMATION, name: "Notify" });
    const nodes = nock(BASE)
      .get(`${base}/nodes/`)
      .reply(200, { data: [], pagination: { style: "offset" } });
    const edges = nock(BASE)
      .get(`${base}/edges/`)
      .reply(200, { data: [], pagination: { style: "offset" } });
    const activities = nock(BASE)
      .get(`${base}/activities/`)
      .reply(200, { data: [], pagination: { style: "offset" } });

    const automation = await new ProjectAutomations(makeTransport()).retrieve(SLUG, PROJECT, AUTOMATION);
    await automation.nodes.list();
    await automation.edges.list();
    await automation.activities.list();

    expect([nodes.isDone(), edges.isDone(), activities.isDone()]).toEqual([true, true, true]);
  });

  it("reaches a workspace-scoped automation's graph, binding only the slug", async () => {
    const base = `/api/v2/workspaces/${SLUG}/automations/${AUTOMATION}`;
    nock(BASE).get(`${base}/`).reply(200, { id: AUTOMATION });
    const nodes = nock(BASE)
      .get(`${base}/nodes/`)
      .reply(200, { data: [], pagination: { style: "offset" } });

    const automation = await new WorkspaceAutomations(makeTransport()).retrieve(SLUG, AUTOMATION);
    await automation.nodes.list();

    expect(nodes.isDone()).toBe(true);
  });

  it("posts setStatus to the status/ segment, not a camelCase one", async () => {
    const scope = nock(BASE)
      .post(`/api/v2/workspaces/${SLUG}/projects/${PROJECT}/automations/${AUTOMATION}/status/`, { is_enabled: true })
      .reply(204);

    await new ProjectAutomations(makeTransport()).setStatus(SLUG, PROJECT, AUTOMATION, { is_enabled: true });

    expect(scope.isDone()).toBe(true);
  });

  it("posts regenerateWebhookSecret to the hyphenated segment", async () => {
    const scope = nock(BASE)
      .post(
        `/api/v2/workspaces/${SLUG}/projects/${PROJECT}/automations/${AUTOMATION}/nodes/n1/regenerate-webhook-secret/`
      )
      .reply(200, { secret: "s3cr3t" });

    const secret = await new ProjectAutomationNodes(makeTransport()).regenerateWebhookSecret(
      SLUG,
      PROJECT,
      AUTOMATION,
      "n1"
    );

    expect(scope.isDone()).toBe(true);
    expect(secret.secret).toBe("s3cr3t");
  });
});
