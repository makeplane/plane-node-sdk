/**
 * EE-gated (`FeatureFlag.WORKFLOWS`) on top of `is_workflow_enabled`; `is_default` is read-only end to end and never seeded on a fresh project.
 *
 * Workflows themselves come off the fetched project row; their states and transitions
 * come off each fetched workflow row, since both carry the workflow's own id in the URL.
 */
import { Owned } from "../../../src/api/v2/kernel/loaded";
import { Workflows } from "../../../src/api/v2/Workflows";
import { ProjectIds } from "../../../src/api/v2/loaded/Project";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 workflows (live)", () => {
  const suite = useV2Project("wf", env);
  let workflows: Owned<Workflows, ProjectIds>;
  let stateId: string;

  beforeAll(async () => {
    workflows = suite.projectRow.workflows;

    await suite.client.v2.workspaces.projects.features.update(suite.workspaceSlug, suite.projectId, {
      is_workflow_enabled: true,
    });

    const state = await suite.projectRow.states.create({ name: uniqueName("wf-state"), color: "#4287f5" });
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
    const created = await workflows.create({ name: uniqueName("wf-graph") });
    expect(created.name).toBeDefined();

    const updated = await workflows.update(created.id, { description: "e2e-managed workflow" });
    expect(updated.description).toBe("e2e-managed workflow");

    const attached = await created.states.attach({ state_ids: [stateId] });
    expect(attached.some((s) => s.state_id === stateId)).toBe(true);
    const attachedState = attached.find((s) => s.state_id === stateId)!;

    const patchedState = await created.states.update(attachedState.id, {
      allow_issue_creation: true,
    });
    expect(patchedState.allow_issue_creation).toBe(true);

    const secondState = await suite.projectRow.states.create({ name: uniqueName("wf-state-2"), color: "#f54242" });
    const secondAttached = await created.states.attach({ state_ids: [secondState.id] });
    const secondAttachedState = secondAttached.find((s) => s.state_id === secondState.id)!;

    const transition = await created.transitions.create({
      state_id: stateId,
      transition_state_id: secondState.id,
    });
    expect(transition.workflow_state_id).toBe(attachedState.id);

    await created.transitions.delete(transition.id);
    await created.states.delete(secondAttachedState.id);
    await created.states.delete(attachedState.id);
    await workflows.delete(created.id);
  });

  it("rejects an unknown order_by", async () => {
    await expect(workflows.list({ order_by: "description" as never })).rejects.toThrow(/Unknown order_by/);
  });
});
