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
    expect(epics.results.length).toBeGreaterThan(0);
  });

  it("should retrieve an epic", async () => {
    const epics = await client.epics.list(workspaceSlug, projectId);
    const epic = await client.epics.retrieve(workspaceSlug, projectId, epics.results[0]!.id!);
    expect(epic).toBeDefined();
    expect(epic.id).toBe(epics.results[0]!.id);
    expect(epic.name).toBe(epics.results[0]!.name);
  });
});
