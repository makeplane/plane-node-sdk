import { PlaneClient } from "../../src/client/plane-client";
import { config } from "./constants";
import { createTestClient } from "../helpers/test-utils";
import { describeIf as describe } from "../helpers/conditional-tests";

describe(!!config.workspaceSlug, "Workspace API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
  });

  it("should get workspace members", async () => {
    const members = await client.workspace.getMembers(workspaceSlug);

    expect(Array.isArray(members)).toBe(true);
    expect(members.length).toBeGreaterThan(0);
  });

  it("should get workspace members as a paginated lite response", async () => {
    const members = await client.workspace.getMembersLite(workspaceSlug, { per_page: 5 });

    expect(members).toBeDefined();
    expect(Array.isArray(members.results)).toBe(true);
    expect(members.results.length).toBeGreaterThan(0);
  });

  it("should get the project role distribution", async () => {
    const distribution = await client.workspace.getProjectRoleDistribution(workspaceSlug);

    expect(distribution).toBeDefined();
    expect(Array.isArray(distribution.roles)).toBe(true);
  });
});
