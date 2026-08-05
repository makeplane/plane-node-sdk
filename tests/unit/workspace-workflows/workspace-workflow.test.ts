import { PlaneClient } from "../../../src/client/plane-client";
import { State } from "../../../src/models/State";
import { WorkspaceWorkflow } from "../../../src/models/WorkspaceWorkflow";
import { config } from "../constants";
import { createTestClient, randomizeName } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(!!config.workspaceSlug, "WorkspaceWorkflows API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let governed: boolean;
  let stateA: State | undefined;
  let stateB: State | undefined;
  let workflow: WorkspaceWorkflow | undefined;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;

    const features = await client.workspace.retrieveFeatures(workspaceSlug);
    governed = !!features.states_owned_by_workspace;
  });

  afterAll(async () => {
    if (workflow?.id) {
      try {
        await client.workspaceWorkflows.delete(workspaceSlug, workflow.id);
      } catch (error) {
        console.warn("Failed to delete workspace workflow:", error);
      }
    }
    for (const state of [stateA, stateB]) {
      if (state?.id) {
        try {
          await client.workspaceStates.delete(workspaceSlug, state.id);
        } catch (error) {
          console.warn("Failed to delete workspace state:", error);
        }
      }
    }
  });

  it("should list workspace workflows (dual-mode, always runs)", async () => {
    const response = await client.workspaceWorkflows.list(workspaceSlug);
    expect(Array.isArray(response.results)).toBe(true);
  });

  it("should create a workflow, configure a chain, and clean up", async () => {
    if (!governed) return;

    stateA = await client.workspaceStates.create(workspaceSlug, {
      name: randomizeName("WS WF State A"),
      color: "#FF0000",
      group: "unstarted",
    });
    stateB = await client.workspaceStates.create(workspaceSlug, {
      name: randomizeName("WS WF State B"),
      color: "#00FF00",
      group: "started",
    });

    workflow = await client.workspaceWorkflows.create(workspaceSlug, {
      name: randomizeName("WS Workflow"),
    });
    expect(workflow.id).toBeDefined();

    const chain = await client.workspaceWorkflows.states.add(workspaceSlug, workflow.id!, {
      state_ids: [stateA.id, stateB.id],
    });
    expect(Array.isArray(chain)).toBe(true);

    await client.workspaceWorkflows.states.markDefault(workspaceSlug, workflow.id!, stateA.id);

    const detail = await client.workspaceWorkflows.retrieve(workspaceSlug, workflow.id!);
    expect(detail.id).toBe(workflow.id);
    expect(detail.states?.length).toBeGreaterThanOrEqual(2);

    const updated = await client.workspaceWorkflows.update(workspaceSlug, workflow.id!, {
      description: "SDK test workflow",
    });
    expect(updated.id).toBe(workflow.id);

    const usage = await client.workspaceWorkflows.usage(workspaceSlug, workflow.id!);
    expect(Array.isArray(usage.projects)).toBe(true);

    const transitions = await client.workspaceWorkflows.transitions.list(workspaceSlug, workflow.id!);
    expect(Array.isArray(transitions)).toBe(true);
  });
});
