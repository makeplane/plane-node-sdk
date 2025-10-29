import { PlaneClient } from "../../../src/client/plane-client";
import { WorkLog } from "../../../src/models/WorkLog";
import { config } from "../constants";
import { createTestClient } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.projectId && config.workItemId), "Work Logs API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;
  let workItemId: string;
  let workLog: WorkLog;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;
    workItemId = config.workItemId;

    // Enable time tracking
    await client.projects.update(workspaceSlug, projectId, {
      is_time_tracking_enabled: true,
    });
  });

  afterAll(async () => {
    // Clean up created work log
    if (workLog?.id) {
      try {
        await client.workItems.workLogs.delete(workspaceSlug, projectId, workItemId, workLog.id);
      } catch (error) {
        console.warn("Failed to delete work log:", error);
      }
    }
  });

  it("should create a work log", async () => {
    workLog = await client.workItems.workLogs.create(workspaceSlug, projectId, workItemId, {
      duration: 30,
      description: "Test work log",
    });

    expect(workLog).toBeDefined();
    expect(workLog.id).toBeDefined();
    expect(workLog.duration).toBe(30);
    expect(workLog.description).toBe("Test work log");
  });

  it("should list work logs", async () => {
    const workLogs = await client.workItems.workLogs.list(workspaceSlug, projectId, workItemId);

    expect(workLogs).toBeDefined();
    expect(Array.isArray(workLogs)).toBe(true);
    expect(workLogs.length).toBeGreaterThan(0);

    const foundWorkLog = workLogs.find((wl) => wl.id === workLog.id);
    expect(foundWorkLog).toBeDefined();
  });

  it("should update a work log", async () => {
    const updatedWorkLog = await client.workItems.workLogs.update(workspaceSlug, projectId, workItemId, workLog.id!, {
      description: "Updated test work log",
    });

    expect(updatedWorkLog).toBeDefined();
    expect(updatedWorkLog.id).toBe(workLog.id);
    expect(updatedWorkLog.description).toBe("Updated test work log");
  });
});
