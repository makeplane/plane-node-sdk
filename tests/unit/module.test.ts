import { PlaneClient } from "../../src/client/plane-client";
import { Module } from "../../src/models/Module";
import { config } from "./constants";
import { createTestClient, randomizeName } from "../helpers/test-utils";
import { describeIf as describe } from "../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.projectId && config.workItemId), "Module API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;
  let workItemId: string;
  let module: Module;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;
    workItemId = config.workItemId;
    const project = await client.projects.retrieve(workspaceSlug, projectId);
    if (!project.module_view) {
      await client.projects.update(workspaceSlug, projectId, {
        module_view: true,
      });
    }
  });

  afterAll(async () => {
    // Clean up created module
    if (module?.id) {
      try {
        await client.modules.delete(workspaceSlug, projectId, module.id);
      } catch (error) {
        console.warn("Failed to delete module:", error);
      }
    }
  });

  it("should create a module", async () => {
    module = await client.modules.create(workspaceSlug, projectId, {
      name: randomizeName("Test Module"),
      description: "Test Description",
    });

    expect(module).toBeDefined();
    expect(module.id).toBeDefined();
    expect(module.name).toContain("Test Module");
    expect(module.description).toBe("Test Description");
  });

  it("should retrieve a module", async () => {
    const retrievedModule = await client.modules.retrieve(workspaceSlug, projectId, module.id!);

    expect(retrievedModule).toBeDefined();
    expect(retrievedModule.id).toBe(module.id);
    expect(retrievedModule.name).toBe(module.name);
    expect(retrievedModule.description).toBe(module.description);
  });

  it("should update a module", async () => {
    const updatedModule = await client.modules.update(workspaceSlug, projectId, module.id!, {
      description: "Updated Test Description",
    });

    expect(updatedModule).toBeDefined();
    expect(updatedModule.id).toBe(module.id);
    expect(updatedModule.description).toBe("Updated Test Description");
  });

  it("should list modules", async () => {
    const modules = await client.modules.list(workspaceSlug, projectId);

    expect(modules).toBeDefined();
    expect(Array.isArray(modules.results)).toBe(true);
    expect(modules.results.length).toBeGreaterThan(0);

    const foundModule = modules.results.find((m) => m.id === module.id);
    expect(foundModule).toBeDefined();
    expect(foundModule?.description).toBe("Updated Test Description");
  });

  it("should add work items to module", async () => {
    await client.modules.addWorkItemsToModule(workspaceSlug, projectId, module.id!, [workItemId]);

    const itemsInModule = await client.modules.listWorkItemsInModule(workspaceSlug, projectId, module.id!);

    expect(itemsInModule).toBeDefined();
    expect(Array.isArray(itemsInModule.results)).toBe(true);
    expect(itemsInModule.results.length).toBeGreaterThan(0);

    const foundWorkItem = itemsInModule.results.find((item) => item.id === workItemId);
    expect(foundWorkItem).toBeDefined();
  });

  it("should remove work item from module", async () => {
    await client.modules.removeWorkItemFromModule(workspaceSlug, projectId, module.id!, workItemId);

    const itemsInModule = await client.modules.listWorkItemsInModule(workspaceSlug, projectId, module.id!);

    expect(itemsInModule).toBeDefined();
    expect(Array.isArray(itemsInModule.results)).toBe(true);

    const foundWorkItem = itemsInModule.results.find((item) => item.id === workItemId);
    expect(foundWorkItem).toBeUndefined();
  });
});
