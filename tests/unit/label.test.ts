import { PlaneClient } from "../../src/client/plane-client";
import { Label } from "../../src/models/Label";
import { config } from "./constants";
import { createTestClient, randomizeName } from "../helpers/test-utils";
import { describeIf as describe } from "../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.projectId), "Label API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;
  let label: Label;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;
  });

  afterAll(async () => {
    // Clean up created label
    if (label?.id) {
      try {
        await client.labels.delete(workspaceSlug, projectId, label.id);
      } catch (error) {
        console.warn("Failed to delete label:", error);
      }
    }
  });

  it("should create a label", async () => {
    label = await client.labels.create(workspaceSlug, projectId, {
      name: randomizeName("Test Label"),
      description: "Test Label Description",
    });

    expect(label).toBeDefined();
    expect(label.id).toBeDefined();
    expect(label.name).toContain("Test Label");
    expect(label.description).toBe("Test Label Description");
  });

  it("should retrieve a label", async () => {
    const retrievedLabel = await client.labels.retrieve(workspaceSlug, projectId, label.id!);

    expect(retrievedLabel).toBeDefined();
    expect(retrievedLabel.id).toBe(label.id);
    expect(retrievedLabel.name).toBe(label.name);
    expect(retrievedLabel.description).toBe(label.description);
  });

  it("should update a label", async () => {
    const updatedLabel = await client.labels.update(workspaceSlug, projectId, label.id!, {
      description: "Updated Test Label Description",
    });

    expect(updatedLabel).toBeDefined();
    expect(updatedLabel.id).toBe(label.id);
    expect(updatedLabel.description).toBe("Updated Test Label Description");
  });

  it("should list labels", async () => {
    const labels = await client.labels.list(workspaceSlug, projectId);

    expect(labels).toBeDefined();
    expect(Array.isArray(labels.results)).toBe(true);
    expect(labels.results.length).toBeGreaterThan(0);

    const foundLabel = labels.results.find((l) => l.id === label.id);
    expect(foundLabel).toBeDefined();
    expect(foundLabel?.description).toBe("Updated Test Label Description");
  });
});
