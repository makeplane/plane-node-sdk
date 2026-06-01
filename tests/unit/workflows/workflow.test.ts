import { PlaneClient } from "../../../src/client/plane-client";
import { Workflow, WorkflowTransition } from "../../../src/models";
import { State } from "../../../src/models/State";
import { config } from "../constants";
import { createTestClient, randomizeName } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.projectId), "Workflow API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;
  let workflow: Workflow;
  let stateA: State;
  let stateB: State;
  let transition: WorkflowTransition;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;

    // Create two states to use for workflow state/transition operations
    stateA = await client.states.create(workspaceSlug, projectId, {
      name: randomizeName("WF State A"),
      group: "started",
      color: "#9AA4BC",
    });

    stateB = await client.states.create(workspaceSlug, projectId, {
      name: randomizeName("WF State B"),
      group: "started",
      color: "#A4BC9A",
    });
  });

  afterAll(async () => {
    if (workflow?.id) {
      // Detach stateA from workflow if it was attached
      if (stateA?.id) {
        try {
          await client.workflows.states.detach(workspaceSlug, projectId, workflow.id, stateA.id);
        } catch {
          // ignore — already detached or never attached
        }
      }
    }

    if (stateA?.id) {
      try {
        await client.states.delete(workspaceSlug, projectId, stateA.id);
      } catch (error) {
        console.warn("Failed to delete stateA:", error);
      }
    }

    if (stateB?.id) {
      try {
        await client.states.delete(workspaceSlug, projectId, stateB.id);
      } catch (error) {
        console.warn("Failed to delete stateB:", error);
      }
    }
  });

  it("should create a workflow", async () => {
    workflow = await client.workflows.create(workspaceSlug, projectId, {
      name: randomizeName("Test Workflow"),
    });

    expect(workflow).toBeDefined();
    expect(workflow.id).toBeDefined();
    expect(workflow.name).toContain("Test Workflow");
    expect(workflow.project).toBe(projectId);
  });

  it("should list workflows", async () => {
    const workflows = await client.workflows.list(workspaceSlug, projectId);

    expect(workflows).toBeDefined();
    expect(Array.isArray(workflows)).toBe(true);
    expect(workflows.length).toBeGreaterThan(0);

    const found = workflows.find((w) => w.id === workflow.id);
    expect(found).toBeDefined();
    expect(found?.name).toBe(workflow.name);
  });

  it("should update a workflow", async () => {
    const updated = await client.workflows.update(workspaceSlug, projectId, workflow.id!, {
      name: randomizeName("Updated Workflow"),
    });

    expect(updated).toBeDefined();
    expect(updated.id).toBe(workflow.id);
    expect(updated.name).toContain("Updated Workflow");

    // Keep local reference current
    workflow = updated;
  });

  it("should attach a state to a workflow", async () => {
    await expect(
      client.workflows.states.attach(workspaceSlug, projectId, workflow.id!, {
        state_ids: [stateA.id!],
      })
    ).resolves.toBeUndefined();
  });

  it("should list transitions (initially empty for the workflow)", async () => {
    const transitions = await client.workflows.transitions.list(workspaceSlug, projectId, workflow.id!);

    expect(transitions).toBeDefined();
    expect(Array.isArray(transitions)).toBe(true);
  });

  it("should create a workflow transition", async () => {
    const result = await client.workflows.transitions.create(workspaceSlug, projectId, workflow.id!, {
      state_id: stateA.id!,
      transition_state_id: stateB.id!,
    });

    // May return null if transition already exists
    if (result !== null) {
      expect(result.id).toBeDefined();
      transition = result;
    } else {
      // Fetch the existing transition
      const transitions = await client.workflows.transitions.list(workspaceSlug, projectId, workflow.id!);
      const found = transitions.find((t) => t.state_id === stateA.id && t.transition_state_id === stateB.id);
      expect(found).toBeDefined();
      transition = found!;
    }
  });

  it("should list transitions (find newly created)", async () => {
    const transitions = await client.workflows.transitions.list(workspaceSlug, projectId, workflow.id!);

    expect(transitions).toBeDefined();
    expect(Array.isArray(transitions)).toBe(true);
    expect(transitions.length).toBeGreaterThan(0);

    const found = transitions.find((t) => t.id === transition.id);
    expect(found).toBeDefined();
  });

  it("should update a workflow transition", async () => {
    const updated = await client.workflows.transitions.update(workspaceSlug, projectId, workflow.id!, transition.id!, {
      pre_rules: [],
      post_rules: [],
    });

    expect(updated).toBeDefined();
    expect(updated.id).toBe(transition.id);
  });

  it("should delete a workflow transition", async () => {
    await expect(
      client.workflows.transitions.del(workspaceSlug, projectId, workflow.id!, transition.id!)
    ).resolves.toBeUndefined();
  });

  it("should detach a state from a workflow", async () => {
    await expect(
      client.workflows.states.detach(workspaceSlug, projectId, workflow.id!, stateA.id!)
    ).resolves.toBeUndefined();
  });
});
