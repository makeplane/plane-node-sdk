import { createTestClient, randomizeName, wait } from "../helpers/test-utils";
import { e2eConfig } from "./config";
import { Project, Cycle, Module, WorkItem } from "../../src/models";

describe("End to End Project Test", () => {
  // Shared state across tests
  let client: ReturnType<typeof createTestClient>;
  let userId: string;
  let project: Project;
  let cycle: Cycle;
  let module: Module;
  let workItem1: WorkItem;
  let workItem2: WorkItem;
  let workItem3: WorkItem;

  beforeAll(async () => {
    // Initialize client and create prerequisites for all tests
    client = createTestClient();

    // Get current user - needed for assignees and cycle owners
    const me = await client.users.me();
    userId = me.id!;

    // Create project - all tests depend on this
    const projectName = randomizeName();
    project = await client.projects.create(e2eConfig.workspaceSlug, {
      name: projectName,
      id: projectName.slice(0, 5).toUpperCase(),
    });

    await client.projects.updateFeatures(e2eConfig.workspaceSlug, project.id, {
      cycles: true,
      modules: true,
    });
  });

  it("should create and list cycles", async () => {
    const cycleName = randomizeName("Test Cycle");
    cycle = await client.cycles.create(e2eConfig.workspaceSlug, project.id, {
      name: cycleName,
      description: "Test Cycle Description",
      // YYYY-MM-DD format
      start_date: new Date().toISOString().split("T")[0],
      // YYYY-MM-DD format
      end_date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split("T")[0],
      owned_by: userId,
      project_id: project.id,
    });

    expect(cycle).toBeDefined();
    expect(cycle.id).toBeDefined();
    expect(cycle.name).toBe(cycleName);

    const cycles = await client.cycles.list(e2eConfig.workspaceSlug, project.id);
    expect(cycles.results.length).toBeGreaterThan(0);
    expect(cycles.results.find((c) => c.name === cycle.name)).toBeDefined();
  });

  it("should create and list modules", async () => {
    const moduleName = randomizeName("Test Module");
    module = await client.modules.create(e2eConfig.workspaceSlug, project.id, {
      name: moduleName,
      description: "Test Module Description",
    });

    expect(module).toBeDefined();
    expect(module.id).toBeDefined();
    expect(module.name).toBe(moduleName);

    const modules = await client.modules.list(e2eConfig.workspaceSlug, project.id);
    expect(modules.results.length).toBeGreaterThan(0);
    expect(modules.results.find((m) => m.name === module.name)).toBeDefined();
  });

  it("should create work items with assignees", async () => {
    workItem1 = await client.workItems.create(e2eConfig.workspaceSlug, project.id, {
      name: randomizeName("Test Work Item 1"),
      description_html: "<p>Test Work Item 1 Description</p>",
      assignees: [userId],
    });

    expect(workItem1).toBeDefined();
    expect(workItem1.id).toBeDefined();
    expect(workItem1.assignees).toBeDefined();

    workItem2 = await client.workItems.create(e2eConfig.workspaceSlug, project.id, {
      name: randomizeName("Test Work Item 2"),
      description_html: "<p>Test Work Item 2 Description</p>",
      assignees: [userId],
    });

    expect(workItem2).toBeDefined();
    expect(workItem2.id).toBeDefined();
    expect(workItem2.assignees).toHaveLength(1);

    const workItems = await client.workItems.list(e2eConfig.workspaceSlug, project.id);
    expect(workItems.results.length).toBeGreaterThan(0);
  });

  it("should create work item relations", async () => {
    await client.workItems.relations.create(e2eConfig.workspaceSlug, project.id, workItem1.id, {
      relation_type: "relates_to",
      issues: [workItem2.id],
    });

    const relations = await client.workItems.relations.list(e2eConfig.workspaceSlug, project.id, workItem1.id);
    expect(relations.relates_to).toBeDefined();
    expect(relations.relates_to[0]).toBe(workItem2.id);
  });

  it("should create work item with parent relationship", async () => {
    workItem3 = await client.workItems.create(e2eConfig.workspaceSlug, project.id, {
      name: randomizeName("Test Work Item 3"),
      description_html: "<p>Test Work Item 3 Description</p>",
      assignees: [userId],
      parent: workItem1.id,
    });

    expect(workItem3).toBeDefined();
    expect(workItem3.id).toBeDefined();

    const workItem3Details = await client.workItems.retrieve(e2eConfig.workspaceSlug, project.id, workItem3.id);
    expect(workItem3Details.parent).toBe(workItem1.id);
  });

  it("should add work items to cycle", async () => {
    await client.cycles.addWorkItemsToCycle(e2eConfig.workspaceSlug, project.id, cycle.id, [
      workItem1.id,
      workItem2.id,
    ]);

    const workItemsInCycle = await client.cycles.listWorkItemsInCycle(e2eConfig.workspaceSlug, project.id, cycle.id);
    expect(workItemsInCycle.results.length).toBeGreaterThan(0);
    expect(workItemsInCycle.results.find((w) => w.id === workItem1.id)).toBeDefined();
    expect(workItemsInCycle.results.find((w) => w.id === workItem2.id)).toBeDefined();
  });

  it("should add work items to module", async () => {
    await client.modules.addWorkItemsToModule(e2eConfig.workspaceSlug, project.id, module.id, [
      workItem1.id,
      workItem2.id,
    ]);

    const workItemsInModule = await client.modules.listWorkItemsInModule(
      e2eConfig.workspaceSlug,
      project.id,
      module.id
    );
    expect(workItemsInModule.results.length).toBeGreaterThan(0);
    expect(workItemsInModule.results.find((w) => w.id === workItem1.id)).toBeDefined();
    expect(workItemsInModule.results.find((w) => w.id === workItem2.id)).toBeDefined();
  });

  it("should remove work item from module", async () => {
    await client.modules.removeWorkItemFromModule(e2eConfig.workspaceSlug, project.id, module.id, workItem1.id);

    const workItemsInModuleAfterRemoval = await client.modules.listWorkItemsInModule(
      e2eConfig.workspaceSlug,
      project.id,
      module.id
    );
    expect(workItemsInModuleAfterRemoval.results.length).toBe(1);
    expect(workItemsInModuleAfterRemoval.results.find((w) => w.id === workItem2.id)).toBeDefined();
    expect(workItemsInModuleAfterRemoval.results.find((w) => w.id === workItem1.id)).toBeUndefined();
  });

  it("should remove work item from cycle", async () => {
    await client.cycles.removeWorkItemFromCycle(e2eConfig.workspaceSlug, project.id, cycle.id, workItem1.id);

    const workItemsInCycleAfterRemoval = await client.cycles.listWorkItemsInCycle(
      e2eConfig.workspaceSlug,
      project.id,
      cycle.id
    );
    expect(workItemsInCycleAfterRemoval.results.length).toBe(1);
    expect(workItemsInCycleAfterRemoval.results.find((w) => w.id === workItem2.id)).toBeDefined();
    expect(workItemsInCycleAfterRemoval.results.find((w) => w.id === workItem1.id)).toBeUndefined();
  });

  afterAll(async () => {
    console.log("Deleting project: ", project.name);
    await client.projects.delete(e2eConfig.workspaceSlug, project.id);
  });
});
