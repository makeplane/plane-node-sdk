import { config } from "./constants";
import { PlaneClient } from "../../src/client/plane-client";
import { createTestClient } from "../helpers/test-utils";
import { describeIf as describe } from "../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.projectId), "Epic API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;
  });

  it("should list epics", async () => {
    const epics = await client.epics.list(workspaceSlug, projectId);
    expect(epics).toBeDefined();
    expect(Array.isArray(epics.results)).toBe(true);
  });

  it("should retrieve an epic", async () => {
    const epics = await client.epics.list(workspaceSlug, projectId);
    // Epics are read-only in this SDK, so we can't seed one — only assert
    // retrieve when the project already has an epic.
    if (epics.results.length === 0) return;
    const epic = await client.epics.retrieve(workspaceSlug, projectId, epics.results[0]!.id!);
    expect(epic).toBeDefined();
    expect(epic.id).toBe(epics.results[0]!.id);
    expect(epic.name).toBe(epics.results[0]!.name);
  });
});
