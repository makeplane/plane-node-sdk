import { PlaneClient } from "../../src/client/plane-client";
import { WorkspaceProjectState } from "../../src/models";
import { config } from "./constants";
import { createTestClient, randomizeName } from "../helpers/test-utils";
import { describeIf as describe } from "../helpers/conditional-tests";

describe(!!config.workspaceSlug, "WorkspaceProjectStates API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let state: WorkspaceProjectState;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
  });

  afterAll(async () => {
    if (state?.id) {
      try {
        await client.workspaceProjectStates.del(workspaceSlug, state.id);
      } catch (error) {
        console.warn("Failed to delete workspace project state:", error);
      }
    }
  });

  it("should create a workspace project state", async () => {
    state = await client.workspaceProjectStates.create(workspaceSlug, {
      name: randomizeName("WS State"),
      color: "#3A3A3A",
      group: "started",
    });
    expect(state).toBeDefined();
    expect(state.id).toBeDefined();
    expect(state.name).toContain("WS State");
  });

  it("should list workspace project states", async () => {
    const states = await client.workspaceProjectStates.list(workspaceSlug);
    expect(Array.isArray(states)).toBe(true);
    expect(states.find((s) => s.id === state.id)).toBeDefined();
  });

  it("should update a workspace project state", async () => {
    const updated = await client.workspaceProjectStates.update(workspaceSlug, state.id!, {
      name: randomizeName("Updated WS State"),
    });
    expect(updated.id).toBe(state.id);
    expect(updated.name).toContain("Updated WS State");
    state = updated;
  });

  it("should delete a workspace project state", async () => {
    await expect(client.workspaceProjectStates.del(workspaceSlug, state.id!)).resolves.toBeUndefined();
    state = { ...state, id: undefined } as unknown as WorkspaceProjectState;
  });
});
