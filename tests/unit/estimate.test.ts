import { PlaneClient } from "../../src/client/plane-client";
import { Estimate, EstimatePoint } from "../../src/models";
import { config } from "./constants";
import { createTestClient, randomizeName } from "../helpers/test-utils";
import { describeIf as describe } from "../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.projectId), "Estimates API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;
  let estimate: Estimate;
  let points: EstimatePoint[];

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;
  });

  afterAll(async () => {
    // Clean up: delete the estimate configured for the project
    try {
      await client.estimates.delete(workspaceSlug, projectId);
    } catch (error) {
      console.warn("Failed to delete estimate:", error);
    }
  });

  it("should create an estimate", async () => {
    estimate = await client.estimates.create(workspaceSlug, projectId, {
      name: randomizeName("Test Estimate"),
      type: "points",
    });

    expect(estimate).toBeDefined();
    expect(estimate.id).toBeDefined();
    expect(estimate.name).toContain("Test Estimate");
  });

  it("should retrieve the project estimate", async () => {
    const retrieved = await client.estimates.retrieve(workspaceSlug, projectId);
    expect(retrieved).toBeDefined();
    expect(retrieved.id).toBe(estimate.id);
  });

  it("should update the project estimate", async () => {
    const updated = await client.estimates.update(workspaceSlug, projectId, {
      description: "Updated estimate description",
    });
    expect(updated).toBeDefined();
    expect(updated.description).toBe("Updated estimate description");
  });

  it("should link the estimate to the project", async () => {
    const project = await client.estimates.linkToProject(workspaceSlug, projectId, estimate.id);
    expect(project).toBeDefined();
  });

  it("should create estimate points", async () => {
    points = await client.estimates.createPoints(workspaceSlug, projectId, estimate.id, [
      { key: 0, value: "1" },
      { key: 1, value: "2" },
      { key: 2, value: "3" },
    ]);

    expect(Array.isArray(points)).toBe(true);
    expect(points.length).toBe(3);
    expect(points[0].id).toBeDefined();
  });

  it("should list estimate points", async () => {
    const listed = await client.estimates.listPoints(workspaceSlug, projectId, estimate.id);
    expect(Array.isArray(listed)).toBe(true);
    expect(listed.length).toBeGreaterThanOrEqual(3);
  });

  it("should update an estimate point", async () => {
    const updated = await client.estimates.updatePoint(workspaceSlug, projectId, estimate.id, points[0].id, {
      value: "5",
    });
    expect(updated).toBeDefined();
    expect(updated.value).toBe("5");
  });

  it("should delete an estimate point", async () => {
    await expect(
      client.estimates.deletePoint(workspaceSlug, projectId, estimate.id, points[2].id)
    ).resolves.toBeUndefined();

    const remaining = await client.estimates.listPoints(workspaceSlug, projectId, estimate.id);
    expect(remaining.find((p) => p.id === points[2].id)).toBeUndefined();
  });
});
