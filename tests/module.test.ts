import { PlaneClient } from "../src/client/plane-client";
import { UpdateModuleRequest } from "../src/models/Module";
import { config } from "./constants";
import { createTestClient } from "./test-utils";

export async function testModules() {
  const client = createTestClient();

  const workspaceSlug = config.workspaceSlug;
  const projectId = config.projectId;
  const workItemId = config.workItemId;

  const module = await createModule(client, workspaceSlug, projectId);
  console.log("Created module: ", module);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const retrievedModule = await retrieveModule(
    client,
    workspaceSlug,
    projectId,
    module.id
  );
  console.log("Retrieved module: ", retrievedModule);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const updatedModule = await updateModule(
    client,
    workspaceSlug,
    projectId,
    module.id,
    module
  );
  console.log("Updated module: ", updatedModule);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const modules = await listModules(client, workspaceSlug, projectId);
  console.log("Listed modules: ", modules);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  await addWorkItemToModule(
    client,
    workspaceSlug,
    projectId,
    module.id,
    workItemId
  );
  console.log("Added work item to module: ", workItemId);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const itemsInModule = await listWorkItemsInModule(
    client,
    workspaceSlug,
    projectId,
    module.id
  );
  console.log("Listed work items in module: ", itemsInModule);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const removedItem = await removeWorkItemFromModule(
    client,
    workspaceSlug,
    projectId,
    module.id,
    workItemId
  );
  console.log("Removed work item from module: ", removedItem);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  await deleteModule(client, workspaceSlug, projectId, module.id);
  console.log("Deleted module: ", module.id);
}

async function createModule(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string
) {
  return await client.modules.create(workspaceSlug, projectId, {
    name: "Test Module",
    description: "Test Description",
  });
}

async function retrieveModule(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  moduleId: string
) {
  return await client.modules.retrieve(workspaceSlug, projectId, moduleId);
}

async function updateModule(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  moduleId: string,
  module: UpdateModuleRequest
) {
  return await client.modules.update(
    workspaceSlug,
    projectId,
    moduleId,
    module
  );
}

async function listModules(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string
) {
  return await client.modules.list(workspaceSlug, projectId);
}

async function deleteModule(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  moduleId: string
) {
  return await client.modules.del(workspaceSlug, projectId, moduleId);
}

async function addWorkItemToModule(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  moduleId: string,
  workItemId: string
) {
  return await client.modules.addWorkItemToModule(
    workspaceSlug,
    projectId,
    moduleId,
    [workItemId]
  );
}
async function listWorkItemsInModule(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  moduleId: string
) {
  return await client.modules.listWorkItemsInModule(
    workspaceSlug,
    projectId,
    moduleId
  );
}

async function removeWorkItemFromModule(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  moduleId: string,
  workItemId: string
) {
  return await client.modules.removeWorkItemFromModule(
    workspaceSlug,
    projectId,
    moduleId,
    workItemId
  );
}

if (require.main === module) {
  testModules();
}
