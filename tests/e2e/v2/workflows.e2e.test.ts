/**
 * EE-gated (`FeatureFlag.WORKFLOWS`) on top of `is_workflow_enabled`; `is_default` is read-only end to end and never seeded on a fresh project.
 */
import { Workflows } from "../../../src/api/v2/Workflows";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 workflows (live)", () => {
  const suite = useV2Project("wf", env);
  let workflows: Workflows;
  let stateId: string;

  beforeAll(async () => {
    const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
    workflows = proj.workflows;

    await suite.client.v2.transport.request(
      "PATCH",
      `/workspaces/${suite.workspaceSlug}/projects/${suite.projectId}/features/`,
      { data: { is_workflow_enabled: true } }
    );

    const state = await proj.states.create({ name: uniqueName("wf-state"), color: "#4287f5" });
    stateId = state.id;
  });

  it("has no pre-seeded default workflow on a freshly enabled project", async () => {
    // See this file's own top-of-file note: `is_default` is server-only and
    // nothing seeds one automatically — this locks in that (currently accurate)
    // absence rather than assuming a default exists.
    const page = await workflows.list();
    expect(page.data.some((w) => w.is_default)).toBe(false);
  });

  it("creates a workflow, attaches a state, creates a transition, then tears down", async () => {
    const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
    const created = await workflows.create({ name: uniqueName("wf-graph") });
    expect(created.name).toBeDefined();

    const updated = await workflows.update(created.id, { description: "e2e-managed workflow" });
    expect(updated.description).toBe("e2e-managed workflow");

    const attached = await workflows.states.attach(created.id, { state_ids: [stateId] });
    expect(attached.some((s) => s.state_id === stateId)).toBe(true);
    const workflowState = attached.find((s) => s.state_id === stateId)!;

    const patchedState = await workflows.states.update(created.id, workflowState.id, {
      allow_issue_creation: true,
    });
    expect(patchedState.allow_issue_creation).toBe(true);

    const secondState = await proj.states.create({ name: uniqueName("wf-state-2"), color: "#f54242" });
    const secondAttached = await workflows.states.attach(created.id, { state_ids: [secondState.id] });
    const secondWorkflowState = secondAttached.find((s) => s.state_id === secondState.id)!;

    const transition = await workflows.transitions.create(created.id, {
      state_id: stateId,
      transition_state_id: secondState.id,
    });
    expect(transition.workflow_state_id).toBe(workflowState.id);

    await workflows.transitions.delete(created.id, transition.id);
    await workflows.states.delete(created.id, secondWorkflowState.id);
    await workflows.states.delete(created.id, workflowState.id);
    await workflows.delete(created.id);
  });

  it("rejects an unknown order_by", async () => {
    await expect(workflows.list({ order_by: "description" as never })).rejects.toThrow(/Unknown order_by/);
  });
});
