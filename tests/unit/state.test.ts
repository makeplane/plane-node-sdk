import { PlaneClient } from "../../src/client/plane-client";
import { State } from "../../src/models/State";
import { config } from "./constants";
import { createTestClient, randomizeName } from "../helpers/test-utils";
import { describeIf as describe } from "../helpers/conditional-tests";
import { workspaceManagedReason } from "../helpers/governance";

describe(!!(config.workspaceSlug && config.projectId), "State API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;
  let state: State;
  // Governed workspaces manage states at the workspace level and reject
  // project-scoped state creation with a 400 — skip gracefully in that case.
  let serverManagesProjectStates = false;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;
  });

  afterAll(async () => {
    // Clean up created state
    if (state?.id) {
      try {
        await client.states.delete(workspaceSlug, projectId, state.id);
      } catch (error) {
        console.warn("Failed to delete state:", error);
      }
    }
  });

  it("should create a state", async () => {
    try {
      state = await client.states.create(workspaceSlug, projectId, {
        name: randomizeName("Test State"),
        description: "Test State Description",
        group: "started",
        color: "#9AA4BC",
      });
    } catch (error) {
      const reason = workspaceManagedReason(error);
      if (reason !== null) {
        serverManagesProjectStates = true;
        console.warn("Skipped: project-level states are managed at the workspace level —", reason);
        return;
      }
      throw error;
    }

    expect(state).toBeDefined();
    expect(state.id).toBeDefined();
    expect(state.name).toContain("Test State");
    expect(state.description).toBe("Test State Description");
    expect(state.group).toBe("started");
  });

  it("should retrieve a state", async () => {
    if (serverManagesProjectStates) return;
    const retrievedState = await client.states.retrieve(workspaceSlug, projectId, state.id!);

    expect(retrievedState).toBeDefined();
    expect(retrievedState.id).toBe(state.id);
    expect(retrievedState.name).toBe(state.name);
    expect(retrievedState.description).toBe(state.description);
  });

  it("should update a state", async () => {
    if (serverManagesProjectStates) return;
    const updatedState = await client.states.update(workspaceSlug, projectId, state.id!, {
      description: "Updated Test State Description",
    });

    expect(updatedState).toBeDefined();
    expect(updatedState.id).toBe(state.id);
    expect(updatedState.description).toBe("Updated Test State Description");
  });

  it("should list states", async () => {
    if (serverManagesProjectStates) return;
    const states = await client.states.list(workspaceSlug, projectId);

    expect(states).toBeDefined();
    expect(Array.isArray(states.results)).toBe(true);
    expect(states.results.length).toBeGreaterThan(0);

    const foundState = states.results.find((s) => s.id === state.id);
    expect(foundState).toBeDefined();
    expect(foundState?.description).toBe("Updated Test State Description");
  });
});
