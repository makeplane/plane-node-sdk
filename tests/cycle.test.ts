import { PlaneClient } from "../src/client/plane-client";
import { UpdateCycleRequest } from "../src/models/Cycle";
import { config } from "./constants";

export async function testCycles() {
  const client = new PlaneClient({
    apiKey: process.env.PLANE_API_KEY!,
    baseUrl: process.env.PLANE_BASE_URL!,
    enableLogging: true,
  });

  const workspaceSlug = config.workspaceSlug;
  const projectId = config.projectId;
  const workItemId = config.workItemId;

  const project = await client.projects.retrieve(workspaceSlug, projectId);
  if (!project.cycle_view) {
    await client.projects.update(workspaceSlug, projectId, {
      cycle_view: true,
    });
  }

  const cycle = await createCycle(client, workspaceSlug, projectId);
  console.log("Created cycle: ", cycle);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const retrievedCycle = await retrieveCycle(
    client,
    workspaceSlug,
    projectId,
    cycle.id
  );
  console.log("Retrieved cycle: ", retrievedCycle);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const updatedCycle = await updateCycle(
    client,
    workspaceSlug,
    projectId,
    cycle.id,
    {
      name: "Updated Test Cycle",
      description: "Updated Test Cycle Description",
    }
  );
  console.log("Updated cycle: ", updatedCycle);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const cycles = await listCycles(client, workspaceSlug, projectId);
  console.log("Listed cycles: ", cycles);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  await addWorkItemsToCycle(
    client,
    workspaceSlug,
    projectId,
    cycle.id,
    workItemId
  );
  console.log("Added work item to cycle: ", workItemId);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const itemsInCycle = await listWorkItemsInCycle(
    client,
    workspaceSlug,
    projectId,
    cycle.id
  );
  console.log("Listed work items in cycle: ", itemsInCycle);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const removedItem = await removeWorkItemFromCycle(
    client,
    workspaceSlug,
    projectId,
    cycle.id,
    workItemId
  );
  console.log("Removed work item from cycle: ", removedItem);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Create a second cycle for transfer testing
  const cycle2 = await createCycle(client, workspaceSlug, projectId);
  console.log("Created second cycle for transfer: ", cycle2);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // create a new work item for transfer testing
  const workItem2 = await client.workItems.create(workspaceSlug, projectId, {
    name: "Test Work Item 2",
  });
  console.log("Created new work item for transfer: ", workItem2);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Add work item back to first cycle for transfer test
  await addWorkItemsToCycle(
    client,
    workspaceSlug,
    projectId,
    cycle.id,
    workItemId
  );
  console.log("Re-added work item to first cycle: ", workItemId);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  await transferWorkItemsToAnotherCycle(
    client,
    workspaceSlug,
    projectId,
    cycle.id,
    cycle2.id
  );
  console.log("Transferred work items to another cycle");
  await new Promise((resolve) => setTimeout(resolve, 1000));

  //   await archiveCycle(client, workspaceSlug, projectId, cycle.id);
  //   console.log("Archived cycle: ", cycle.id);
  //   await new Promise((resolve) => setTimeout(resolve, 1000));

  //   const archivedCycles = await listArchivedCycles(
  //     client,
  //     workspaceSlug,
  //     projectId
  //   );
  //   console.log("Listed archived cycles: ", archivedCycles);
  //   await new Promise((resolve) => setTimeout(resolve, 1000));

  //   await unArchiveCycle(client, workspaceSlug, projectId, cycle.id);
  //   console.log("Unarchived cycle: ", cycle.id);
  //   await new Promise((resolve) => setTimeout(resolve, 1000));

  await deleteCycle(client, workspaceSlug, projectId, cycle.id);
  console.log("Deleted cycle: ", cycle.id);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  await deleteCycle(client, workspaceSlug, projectId, cycle2.id);
  console.log("Deleted second cycle: ", cycle2.id);
}

async function createCycle(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string
) {
  return await client.cycles.create(workspaceSlug, projectId, {
    name: "Test Cycle",
    description: "Test Cycle Description",
    owned_by: config.userId,
  });
}

async function retrieveCycle(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  cycleId: string
) {
  return await client.cycles.retrieve(workspaceSlug, projectId, cycleId);
}

async function updateCycle(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  cycleId: string,
  cycle: UpdateCycleRequest
) {
  return await client.cycles.update(workspaceSlug, projectId, cycleId, cycle);
}

async function listCycles(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string
) {
  return await client.cycles.list(workspaceSlug, projectId);
}

async function deleteCycle(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  cycleId: string
) {
  return await client.cycles.del(workspaceSlug, projectId, cycleId);
}

async function addWorkItemsToCycle(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  cycleId: string,
  workItemId: string
) {
  return await client.cycles.addWorkItemsToCycle(
    workspaceSlug,
    projectId,
    cycleId,
    [workItemId]
  );
}

async function listWorkItemsInCycle(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  cycleId: string
) {
  return await client.cycles.listWorkItemsInCycle(
    workspaceSlug,
    projectId,
    cycleId
  );
}

async function removeWorkItemFromCycle(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  cycleId: string,
  workItemId: string
) {
  return await client.cycles.removeWorkItemFromCycle(
    workspaceSlug,
    projectId,
    cycleId,
    workItemId
  );
}

async function transferWorkItemsToAnotherCycle(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  cycleId: string,
  newCycleId: string
) {
  return await client.cycles.transferWorkItemsToAnotherCycle(
    workspaceSlug,
    projectId,
    cycleId,
    { new_cycle_id: newCycleId }
  );
}

async function archiveCycle(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  cycleId: string
) {
  return await client.cycles.archive(workspaceSlug, projectId, cycleId);
}

async function listArchivedCycles(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string
) {
  return await client.cycles.listArchived(workspaceSlug, projectId);
}

async function unArchiveCycle(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  cycleId: string
) {
  return await client.cycles.unArchive(workspaceSlug, projectId, cycleId);
}

async function justArchiveCycle() {
  const client = new PlaneClient({
    apiKey: process.env.PLANE_API_KEY!,
    baseUrl: process.env.PLANE_BASE_URL!,
    enableLogging: true,
  });
  const workspaceSlug = config.workspaceSlug;
  const projectId = config.projectId;

  const project = await client.projects.retrieve(workspaceSlug, projectId);
  if (!project.cycle_view) {
    await client.projects.update(workspaceSlug, projectId, {
      cycle_view: true,
    });
  }

  return await client.cycles.archive(
    workspaceSlug,
    projectId,
    "e1ca5ee2-c968-4be5-80fa-f6dff66bea98"
  );
}

if (require.main === module) {
  testCycles().catch(console.error);
}
