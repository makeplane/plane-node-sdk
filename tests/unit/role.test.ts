import { PlaneClient } from "../../src/client/plane-client";
import { config } from "./constants";
import { createTestClient } from "../helpers/test-utils";
import { describeIf as describe } from "../helpers/conditional-tests";

describe(!!config.workspaceSlug, "Roles API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
  });

  it("should list role definitions", async () => {
    const roles = await client.roles.list(workspaceSlug);

    expect(roles).toBeDefined();
    expect(Array.isArray(roles.results)).toBe(true);
    expect(roles.results.length).toBeGreaterThan(0);
  });

  it("should filter roles by namespace", async () => {
    const workspaceRoles = await client.roles.list(workspaceSlug, { namespace: "workspace" });
    expect(workspaceRoles.results.every((r) => r.namespace === "workspace")).toBe(true);

    const projectRoles = await client.roles.list(workspaceSlug, { namespace: "project" });
    expect(projectRoles.results.every((r) => r.namespace === "project")).toBe(true);
  });

  it("should retrieve a single role", async () => {
    const roles = await client.roles.list(workspaceSlug);
    const first = roles.results[0];

    const retrieved = await client.roles.retrieve(workspaceSlug, first.id!);
    expect(retrieved).toBeDefined();
    expect(retrieved.slug).toBe(first.slug);
    expect(retrieved.namespace).toBe(first.namespace);
  });
});
