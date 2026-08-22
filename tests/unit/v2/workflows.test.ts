import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { WorkflowField } from "../../../src/api/v2/Workflows";
import { Workflows } from "../../../src/api/v2/Workflows";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";

const makeWorkflows = () =>
  new Workflows(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })), {
    slug: "acme",
    project_id: "ENG",
  });

afterEach(() => nock.cleanAll());

describe("Workflows (v2)", () => {
  it("lists workflows", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/workflows/")
      .reply(200, {
        data: [{ id: "wf1", name: "Default", is_default: true }],
        pagination: { style: "offset" },
        total_count: 1,
      });

    const page = await makeWorkflows().list();

    expect(page.data[0].name).toBe("Default");
  });

  it("leaves absent fields undefined on a sparse response", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/workflows/")
      .query({ fields: "id" })
      .reply(200, { data: [{ id: "wf1" }], pagination: { style: "offset" } });

    // Dynamic field list is typed as the widened `WorkflowField[]`, so it falls
    // back to the full `Workflow` return type (see states.test.ts).
    const dynamicFields: WorkflowField[] = ["id"];
    const page = await makeWorkflows().list({ fields: dynamicFields });

    expect(page.data[0].id).toBe("wf1");
    expect(page.data[0].name).toBeUndefined();
  });

  it("creates then patches a workflow", async () => {
    nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/workflows/", { name: "Support" })
      .reply(201, { id: "wf1", name: "Support", is_active: false });
    nock(BASE)
      .patch("/api/v2/workspaces/acme/projects/ENG/workflows/wf1/", { is_active: true })
      .reply(200, { id: "wf1", name: "Support", is_active: true });

    const workflows = makeWorkflows();
    const created = await workflows.create({ name: "Support" });
    const updated = await workflows.update(created.id, { is_active: true });

    expect(updated.is_active).toBe(true);
  });

  it("deletes a workflow", async () => {
    const scope = nock(BASE).delete("/api/v2/workspaces/acme/projects/ENG/workflows/wf1/").reply(204);

    await makeWorkflows().delete("wf1");

    expect(scope.isDone()).toBe(true);
  });

  it("rejects an unknown order_by before making the request", async () => {
    // "description" is a valid `fields` value for workflows_list but not a
    // cursor-safe/allowed `order_by` — see generated/constants.ts's ORDER_BY entry.
    await expect(makeWorkflows().list({ order_by: "description" as never })).rejects.toThrow(
      /Unknown order_by 'description' for workflows_list/
    );
  });

  describe("states", () => {
    it("attaches project states in bulk and returns an array", async () => {
      nock(BASE)
        .post("/api/v2/workspaces/acme/projects/ENG/workflows/wf1/states/", { state_ids: ["s1", "s2"] })
        .reply(201, [
          { id: "ws1", state_id: "s1", workflow_id: "wf1" },
          { id: "ws2", state_id: "s2", workflow_id: "wf1" },
        ]);

      const attached = await makeWorkflows().states.attach("wf1", { state_ids: ["s1", "s2"] });

      expect(attached).toHaveLength(2);
      expect(attached[1].state_id).toBe("s2");
    });

    it("lists, patches and deletes a workflow state", async () => {
      nock(BASE)
        .get("/api/v2/workspaces/acme/projects/ENG/workflows/wf1/states/")
        .reply(200, { data: [{ id: "ws1", type: "backlog" }], pagination: { style: "offset" } });
      nock(BASE)
        .patch("/api/v2/workspaces/acme/projects/ENG/workflows/wf1/states/ws1/", { allow_issue_creation: true })
        .reply(200, { id: "ws1", type: "backlog", allow_issue_creation: true });
      nock(BASE).delete("/api/v2/workspaces/acme/projects/ENG/workflows/wf1/states/ws1/").reply(204);

      const states = makeWorkflows().states;
      const page = await states.list("wf1");
      expect(page.data[0].type).toBe("backlog");

      const updated = await states.update("wf1", "ws1", { allow_issue_creation: true });
      expect(updated.allow_issue_creation).toBe(true);

      await states.delete("wf1", "ws1");
    });
  });

  describe("transitions", () => {
    it("creates, retrieves and updates a transition", async () => {
      nock(BASE)
        .post("/api/v2/workspaces/acme/projects/ENG/workflows/wf1/state-transitions/", {
          state_id: "s1",
          transition_state_id: "s2",
        })
        .reply(201, { id: "wt1", workflow_state_id: "ws1", transition_state_id: "s2" });
      nock(BASE)
        .get("/api/v2/workspaces/acme/projects/ENG/workflows/wf1/state-transitions/wt1/")
        .reply(200, { id: "wt1", workflow_state_id: "ws1", transition_state_id: "s2", member_ids: [] });
      nock(BASE)
        .patch("/api/v2/workspaces/acme/projects/ENG/workflows/wf1/state-transitions/wt1/", {
          required_approvals: 2,
        })
        .reply(200, { id: "wt1", required_approvals: 2 });

      const transitions = makeWorkflows().transitions;
      const created = await transitions.create("wf1", {
        state_id: "s1",
        transition_state_id: "s2",
      });
      expect(created.id).toBe("wt1");

      const fetched = await transitions.retrieve("wf1", created.id);
      expect(fetched.member_ids).toEqual([]);

      const updated = await transitions.update("wf1", created.id, { required_approvals: 2 });
      expect(updated.required_approvals).toBe(2);
    });

    it("deletes a transition", async () => {
      const scope = nock(BASE)
        .delete("/api/v2/workspaces/acme/projects/ENG/workflows/wf1/state-transitions/wt1/")
        .reply(204);

      await makeWorkflows().transitions.delete("wf1", "wt1");

      expect(scope.isDone()).toBe(true);
    });
  });
});
