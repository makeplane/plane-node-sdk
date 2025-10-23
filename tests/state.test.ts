import { PlaneClient } from "../src/client/plane-client";
import { State } from "../src/models/State";
import { config } from "./constants";
import { createTestClient } from "./test-utils";

export async function testStates() {
  const client = createTestClient();

  const workspaceSlug = config.workspaceSlug;
  const projectId = config.projectId;

  const stateObj = await createState(client, workspaceSlug, projectId);
  console.log("Created state: ", stateObj);

  const retrievedState = await retrieveState(
    client,
    workspaceSlug,
    projectId,
    stateObj.id
  );
  console.log("Retrieved state: ", retrievedState);

  const updatedState = await updateState(
    client,
    workspaceSlug,
    projectId,
    stateObj.id,
    stateObj
  );
  console.log("Updated state: ", updatedState);

  const states = await listStates(client, workspaceSlug, projectId);
  console.log("Listed states: ", states);

  await deleteState(client, workspaceSlug, projectId, stateObj.id);
  console.log("State deleted: ", stateObj.id);
}

async function createState(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string
) {
  const state = await client.states.create(workspaceSlug, projectId, {
    name: "Test State " + new Date().getTime(),
    description: "Test State Description",
    group: "started",
    color: "#9AA4BC",
  });
  return state;
}

async function retrieveState(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  stateId: string
) {
  const state = await client.states.retrieve(workspaceSlug, projectId, stateId);
  return state;
}

async function updateState(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  stateId: string,
  state: State
) {
  const updatedState = await client.states.update(
    workspaceSlug,
    projectId,
    stateId,
    {
      description: "Updated Test State Description",
    }
  );
  return updatedState;
}

async function listStates(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string
) {
  const states = await client.states.list(workspaceSlug, projectId);
  return states;
}

async function deleteState(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  stateId: string
) {
  await client.states.del(workspaceSlug, projectId, stateId);
}

if (require.main === module) {
  testStates().catch(console.error);
}
