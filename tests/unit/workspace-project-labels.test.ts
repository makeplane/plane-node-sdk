import { PlaneClient } from "../../src/client/plane-client";
import { WorkspaceProjectLabel } from "../../src/models";
import { config } from "./constants";
import { createTestClient, randomizeName } from "../helpers/test-utils";
import { describeIf as describe } from "../helpers/conditional-tests";

describe(!!config.workspaceSlug, "WorkspaceProjectLabels API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let label: WorkspaceProjectLabel;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
  });

  afterAll(async () => {
    if (label?.id) {
      try {
        await client.workspaceProjectLabels.del(workspaceSlug, label.id);
      } catch (error) {
        console.warn("Failed to delete workspace project label:", error);
      }
    }
  });

  it("should create a workspace project label", async () => {
    label = await client.workspaceProjectLabels.create(workspaceSlug, {
      name: randomizeName("WS Label"),
      color: "#FF5733",
    });
    expect(label).toBeDefined();
    expect(label.id).toBeDefined();
    expect(label.name).toContain("WS Label");
    expect(label.color).toBe("#FF5733");
  });

  it("should list workspace project labels", async () => {
    const labels = await client.workspaceProjectLabels.list(workspaceSlug);
    expect(Array.isArray(labels)).toBe(true);
    expect(labels.find((l) => l.id === label.id)).toBeDefined();
  });

  it("should update a workspace project label", async () => {
    const updated = await client.workspaceProjectLabels.update(workspaceSlug, label.id!, {
      name: randomizeName("Updated WS Label"),
    });
    expect(updated.id).toBe(label.id);
    expect(updated.name).toContain("Updated WS Label");
    label = updated;
  });

  it("should delete a workspace project label", async () => {
    await expect(client.workspaceProjectLabels.del(workspaceSlug, label.id!)).resolves.toBeUndefined();
    label = { ...label, id: undefined } as unknown as WorkspaceProjectLabel;
  });
});
