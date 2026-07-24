import { PlaneClient } from "../../src/client/plane-client";
import { config } from "./constants";
import { createTestClient } from "../helpers/test-utils";
import { describeIf as describe } from "../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.projectId), "Lite Listing API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;
  });

  it("should list projects lite", async () => {
    const projects = await client.projects.listLite(workspaceSlug);

    expect(projects).toBeDefined();
    expect(Array.isArray(projects.results)).toBe(true);
    expect(projects.results.length).toBeGreaterThan(0);
    expect(projects.results[0].identifier).toBeDefined();
  });

  it("should list project members", async () => {
    const members = await client.projects.getMembers(workspaceSlug, projectId);

    expect(Array.isArray(members)).toBe(true);
    expect(members.length).toBeGreaterThan(0);
  });

  it("should list project members lite", async () => {
    const members = await client.projects.getMembersLite(workspaceSlug, projectId, { per_page: 5 });

    expect(members).toBeDefined();
    expect(Array.isArray(members.results)).toBe(true);
  });

  it("should get project total work logs", async () => {
    const totals = await client.projects.getTotalWorkLogs(workspaceSlug, projectId);

    expect(totals).toBeDefined();
  });

  it("should list cycles lite", async () => {
    const cycles = await client.cycles.listLite(workspaceSlug, projectId);

    expect(cycles).toBeDefined();
    expect(Array.isArray(cycles.results)).toBe(true);
  });

  it("should list modules lite", async () => {
    const modules = await client.modules.listLite(workspaceSlug, projectId);

    expect(modules).toBeDefined();
    expect(Array.isArray(modules.results)).toBe(true);
  });
});
