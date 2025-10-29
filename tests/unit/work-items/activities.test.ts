import { PlaneClient } from "../../../src/client/plane-client";
import { config } from "../constants";
import { createTestClient } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.projectId && config.workItemId), "Work Item Activities API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;
  let workItemId: string;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;
    workItemId = config.workItemId;
  });

  it("should list activities", async () => {
    const activityResponse = await client.workItems.activities.list(workspaceSlug, projectId, workItemId);

    expect(activityResponse).toBeDefined();
    expect(Array.isArray(activityResponse.results)).toBe(true);
  });

  it("should retrieve an activity", async () => {
    const activityResponse = await client.workItems.activities.list(workspaceSlug, projectId, workItemId);

    if (activityResponse.results.length > 0) {
      const activity = await client.workItems.activities.retrieve(
        workspaceSlug,
        projectId,
        workItemId,
        activityResponse.results[0]!.id!
      );

      expect(activity).toBeDefined();
      expect(activity.id).toBe(activityResponse.results[0]!.id);
    }
  });
});
