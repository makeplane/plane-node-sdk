import { PlaneClient } from "../../src/client/plane-client";
import { State } from "../../src/models/State";
import { config } from "./constants";
import { createTestClient, randomizeName } from "../helpers/test-utils";
import { describeIf as describe } from "../helpers/conditional-tests";

describe(!!config.workspaceSlug, "WorkspaceStates API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let governed: boolean;
  let state: State | undefined;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;

    const features = await client.workspace.retrieveFeatures(workspaceSlug);
    governed = !!features.states_owned_by_workspace;
  });

  afterAll(async () => {
    if (state?.id) {
      try {
        await client.workspaceStates.delete(workspaceSlug, state.id);
      } catch (error) {
        console.warn("Failed to delete workspace state:", error);
      }
    }
  });

  it("should list workspace states (dual-mode, always runs)", async () => {
    const response = await client.workspaceStates.list(workspaceSlug);
    expect(Array.isArray(response.results)).toBe(true);
  });

  it("should report the governance flag on workspace features", async () => {
    const features = await client.workspace.retrieveFeatures(workspaceSlug);
    expect(
      typeof features.states_owned_by_workspace === "boolean" || features.states_owned_by_workspace === undefined
    ).toBe(true);
  });

  it("should reject creating a catalog state when ungoverned", async () => {
    if (governed) return;
    await expect(
      client.workspaceStates.create(workspaceSlug, {
        name: randomizeName("WS Catalog State"),
        color: "#FF0000",
        group: "unstarted",
      })
    ).rejects.toBeDefined();
  });

  it("should create, retrieve, update, and delete a workspace (catalog) state", async () => {
    if (!governed) return;

    const name = randomizeName("WS Catalog State");
    state = await client.workspaceStates.create(workspaceSlug, {
      name,
      color: "#FF0000",
      group: "unstarted",
      description: "SDK test state",
    });

    expect(state.id).toBeDefined();
    expect(state.name).toContain(name);
    expect(state.project).toBeFalsy();

    const retrieved = await client.workspaceStates.retrieve(workspaceSlug, state.id);
    expect(retrieved.id).toBe(state.id);

    const updated = await client.workspaceStates.update(workspaceSlug, state.id, {
      description: "Updated description",
    });
    expect(updated.id).toBe(state.id);
    expect(updated.description).toBe("Updated description");

    await expect(client.workspaceStates.delete(workspaceSlug, state.id)).resolves.toBeUndefined();
    state = undefined;
  });
});
