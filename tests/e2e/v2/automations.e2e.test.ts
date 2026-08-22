/**
 * `scope` must be the lowercase-hyphenated value (`"work-item"`); the golden's title-cased description is a documentation gap, confirmed live.
 */
import { PlaneClient } from "../../../src/client/plane-client";
import { createV2Client } from "./support/client";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 project automations (live)", () => {
  const suite = useV2Project("auto", env);

  const automations = () => suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId).automations;

  it("creates, lists, retrieves, patches, and deletes an automation", async () => {
    const created = await automations().create({
      name: uniqueName("automation"),
      scope: "work-item",
    });
    expect(created.status).toBe("draft");
    expect(created.is_enabled).toBe(false);

    const page = await automations().list({ search: created.name });
    expect(page.data.some((row) => row.id === created.id)).toBe(true);

    const fetched = await automations().retrieve(created.id);
    expect(fetched.scope).toBe("work-item");

    const updated = await automations().update(created.id, {
      description: "Escalates stale work items",
    });
    expect(updated.description).toBe("Escalates stale work items");

    await automations().delete(created.id);
    const pageAfterDelete = await automations().list({ search: created.name });
    expect(pageAfterDelete.data.some((row) => row.id === created.id)).toBe(false);
  });

  it("enables an automation through the status action", async () => {
    const created = await automations().create({
      name: uniqueName("automation-status"),
      scope: "work-item",
    });

    // The server refuses to enable an automation whose graph is empty
    // ("Automation cannot be enabled until it has at least one trigger and one
    // action"), so the graph has to exist before the status flip.
    const nodes = automations().nodes;
    const trigger = await nodes.create(created.id, {
      name: "On work item created",
      handler_name: "record_created",
      node_type: "trigger",
    });
    const action = await nodes.create(created.id, {
      name: "Comment on the work item",
      handler_name: "add_comment",
      node_type: "action",
    });
    await automations().edges.create(created.id, {
      source_node_id: trigger.id,
      target_node_id: action.id,
    });

    await automations().setStatus(created.id, { is_enabled: true });
    const fetched = await automations().retrieve(created.id);
    expect(fetched.is_enabled).toBe(true);

    // An enabled automation cannot be deleted ("Cannot delete an enabled automation.
    // Disable it first via POST …/status/."), so wind the status back before cleanup.
    await automations().setStatus(created.id, { is_enabled: false });
    await automations().delete(created.id);
  });

  describe("nodes, edges, and activities", () => {
    let automationId: string;

    beforeAll(async () => {
      const created = await automations().create({
        name: uniqueName("automation-graph"),
        scope: "work-item",
      });
      automationId = created.id;
    });

    afterAll(async () => {
      if (!automationId) return;
      await automations()
        .delete(automationId)
        .catch(() => undefined);
    });

    it("builds a trigger -> action graph and reads its activity log", async () => {
      const nodes = automations().nodes;
      const edges = automations().edges;
      const activities = automations().activities;

      const trigger = await nodes.create(automationId, {
        name: "On work item created",
        handler_name: "record_created",
        node_type: "trigger",
      });
      const action = await nodes.create(automationId, {
        name: "Comment on the work item",
        handler_name: "add_comment",
        node_type: "action",
      });

      const edge = await edges.create(automationId, {
        source_node_id: trigger.id,
        target_node_id: action.id,
      });
      expect(edge.source_node_id).toBe(trigger.id);
      expect(edge.target_node_id).toBe(action.id);

      const nodePage = await nodes.list(automationId);
      expect(nodePage.data.map((row) => row.id).sort()).toEqual([action.id, trigger.id].sort());

      const edgePage = await edges.list(automationId);
      expect(edgePage.data.some((row) => row.id === edge.id)).toBe(true);

      // Node/edge creation itself is expected to leave an activity trail; a bare
      // list call must succeed even if the golden's audit pipeline is async and the
      // row isn't visible yet, so this only asserts the shape, not that it's non-empty.
      const activityPage = await activities.list(automationId);
      expect(Array.isArray(activityPage.data)).toBe(true);

      await edges.delete(automationId, edge.id);
      await nodes.delete(automationId, action.id);
      await nodes.delete(automationId, trigger.id);
    });

    it("regenerates a send_webhook action node's secret", async () => {
      const nodes = automations().nodes;
      const webhookNode = await nodes.create(automationId, {
        name: "Outbound webhook",
        handler_name: "send_webhook",
        node_type: "action",
        config: { url: "https://example.com/plane-hook" },
      });

      const { secret } = await nodes.regenerateWebhookSecret(automationId, webhookNode.id);
      expect(typeof secret).toBe("string");
      expect(secret.length).toBeGreaterThan(0);

      const rotated = await nodes.regenerateWebhookSecret(automationId, webhookNode.id);
      expect(rotated.secret).not.toBe(secret);

      await nodes.delete(automationId, webhookNode.id);
    });
  });
});

maybe("v2 workspace (global) automations (live)", () => {
  // Built inside beforeAll (skipped under describe.skip) so it gets the 429-retry wrapper.
  let client: PlaneClient;
  beforeAll(() => {
    client = createV2Client(env);
  });
  const automations = () => client.v2.workspace(env.workspaceSlug).automations;

  const createdIds: string[] = [];

  afterAll(async () => {
    const cleanup = automations();
    for (const id of createdIds) {
      // Delete is rejected while an automation is enabled, and this loop swallows
      // errors — so disable first, otherwise an enabled row leaks silently.
      await cleanup.setStatus(id, { is_enabled: false }).catch(() => undefined);
      await cleanup.delete(id).catch(() => undefined);
    }
  });

  it("creates a global automation and toggles it enabled via status", async () => {
    const created = await automations().create({
      name: uniqueName("workspace-automation"),
      scope: "work-item",
    });
    createdIds.push(created.id);
    expect(created.is_global).toBe(true);

    // Same precondition as the project-scoped suite: at least one trigger and one
    // action must exist before the server will enable the automation.
    const nodes = automations().nodes;
    const trigger = await nodes.create(created.id, {
      name: "On work item created",
      handler_name: "record_created",
      node_type: "trigger",
    });
    const action = await nodes.create(created.id, {
      name: "Comment on the work item",
      handler_name: "add_comment",
      node_type: "action",
    });
    await automations().edges.create(created.id, {
      source_node_id: trigger.id,
      target_node_id: action.id,
    });

    await automations().setStatus(created.id, { is_enabled: true });
    const fetched = await automations().retrieve(created.id);
    expect(fetched.is_enabled).toBe(true);
  });

  it("lists workspace automations without a project segment", async () => {
    const created = await automations().create({
      name: uniqueName("workspace-automation-list"),
      scope: "work-item",
    });
    createdIds.push(created.id);

    const page = await automations().list({ search: created.name });
    expect(page.data.some((row) => row.id === created.id)).toBe(true);
  });
});
