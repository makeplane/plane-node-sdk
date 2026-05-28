import { PlaneClient } from "../../src/client/plane-client";
import { WorkItemRelationDefinition } from "../../src/models";
import { config } from "./constants";
import { createTestClient, randomizeName } from "../helpers/test-utils";
import { describeIf as describe } from "../helpers/conditional-tests";

describe(!!config.workspaceSlug, "WorkItemRelationDefinitions API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let definition: WorkItemRelationDefinition;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
  });

  afterAll(async () => {
    if (definition?.id) {
      try {
        await client.workItemRelationDefinitions.del(workspaceSlug, definition.id);
      } catch (error) {
        console.warn("Failed to delete work item relation definition:", error);
      }
    }
  });

  it("should list work item relation definitions", async () => {
    const definitions = await client.workItemRelationDefinitions.list(workspaceSlug);
    expect(definitions).toBeDefined();
    expect(Array.isArray(definitions)).toBe(true);
  });

  it("should filter by is_default", async () => {
    const defaults = await client.workItemRelationDefinitions.list(workspaceSlug, { is_default: true });
    expect(Array.isArray(defaults)).toBe(true);
    defaults.forEach((d) => expect(d.is_default).toBe(true));
  });

  it("should create a work item relation definition", async () => {
    definition = await client.workItemRelationDefinitions.create(workspaceSlug, {
      name: randomizeName("WI Relation"),
      outward: "blocks",
      inward: "blocked by",
      is_active: true,
    });
    expect(definition).toBeDefined();
    expect(definition.id).toBeDefined();
    expect(definition.name).toContain("WI Relation");
  });

  it("should update a work item relation definition", async () => {
    const updated = await client.workItemRelationDefinitions.update(workspaceSlug, definition.id!, {
      name: randomizeName("Updated WI Relation"),
    });
    expect(updated.id).toBe(definition.id);
    expect(updated.name).toContain("Updated WI Relation");
    definition = updated;
  });

  it("should delete a work item relation definition", async () => {
    await expect(client.workItemRelationDefinitions.del(workspaceSlug, definition.id!)).resolves.toBeUndefined();
    definition = { ...definition, id: undefined } as unknown as WorkItemRelationDefinition;
  });
});
