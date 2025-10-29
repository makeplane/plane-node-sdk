import { PlaneClient } from "../../src/client/plane-client";
import { State } from "../../src/models/State";
import { config } from "./constants";
import { createTestClient, randomizeName } from "../helpers/test-utils";
import { describeIf as describe } from "../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.projectId), "State API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;
  let state: State;

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
    state = await client.states.create(workspaceSlug, projectId, {
      name: randomizeName("Test State"),
      description: "Test State Description",
      group: "started",
      color: "#9AA4BC",
    });

    expect(state).toBeDefined();
    expect(state.id).toBeDefined();
    expect(state.name).toContain("Test State");
    expect(state.description).toBe("Test State Description");
    expect(state.group).toBe("started");
  });

  it("should retrieve a state", async () => {
    const retrievedState = await client.states.retrieve(workspaceSlug, projectId, state.id!);

    expect(retrievedState).toBeDefined();
    expect(retrievedState.id).toBe(state.id);
    expect(retrievedState.name).toBe(state.name);
    expect(retrievedState.description).toBe(state.description);
  });

  it("should update a state", async () => {
    const updatedState = await client.states.update(workspaceSlug, projectId, state.id!, {
      description: "Updated Test State Description",
    });

    expect(updatedState).toBeDefined();
    expect(updatedState.id).toBe(state.id);
    expect(updatedState.description).toBe("Updated Test State Description");
  });

  it("should list states", async () => {
    const states = await client.states.list(workspaceSlug, projectId);

    expect(states).toBeDefined();
    expect(Array.isArray(states.results)).toBe(true);
    expect(states.results.length).toBeGreaterThan(0);

    const foundState = states.results.find((s) => s.id === state.id);
    expect(foundState).toBeDefined();
    expect(foundState?.description).toBe("Updated Test State Description");
  });
});
