import { PlaneClient } from "../../../src/client/plane-client";
import { WorkItem } from "../../../src/models";
import { config } from "../constants";
import { createTestClient, randomizeName } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.projectId && config.workItemId), "Work Item Dependencies API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;
  let workItemId: string;
  let targetWorkItem: WorkItem;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;
    workItemId = config.workItemId;

    targetWorkItem = await client.workItems.create(workspaceSlug, projectId, {
      name: randomizeName("Dependency Target"),
    });
  });

  afterAll(async () => {
    if (targetWorkItem?.id) {
      try {
        await client.workItems.delete(workspaceSlug, projectId, targetWorkItem.id);
      } catch (error) {
        console.warn("Failed to delete target work item:", error);
      }
    }
  });

  it("should create a dependency relation", async () => {
    const created = await client.workItems.dependencies.create(workspaceSlug, projectId, workItemId, {
      relation_type: "blocking",
      work_item_ids: [targetWorkItem.id],
    });

    expect(Array.isArray(created)).toBe(true);
    expect(created.find((w) => w.id === targetWorkItem.id)).toBeDefined();
  });

  it("should list dependencies grouped by direction", async () => {
    const dependencies = await client.workItems.dependencies.list(workspaceSlug, projectId, workItemId);

    expect(dependencies).toBeDefined();
    expect(Array.isArray(dependencies.blocking)).toBe(true);
    expect(dependencies.blocking.find((w) => w.id === targetWorkItem.id)).toBeDefined();
  });

  it("should remove a dependency relation", async () => {
    await expect(
      client.workItems.dependencies.remove(workspaceSlug, projectId, workItemId, targetWorkItem.id)
    ).resolves.toBeUndefined();

    const dependencies = await client.workItems.dependencies.list(workspaceSlug, projectId, workItemId);
    expect(dependencies.blocking.find((w) => w.id === targetWorkItem.id)).toBeUndefined();
  });
});
