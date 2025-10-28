import { PlaneClient } from "../../src/client/plane-client";
import { config } from "./constants";
import { createTestClient } from "./test-utils";

export async function testEpics() {
  const client = createTestClient();

  const workspaceSlug = config.workspaceSlug;
  const projectId = config.projectId;

  if (!workspaceSlug || !projectId) {
    console.error("workspaceSlug and projectId are required");
    return;
  }

  const project = await client.projects.retrieve(workspaceSlug, projectId);

  const epics = await client.epics.list(workspaceSlug, projectId);

  console.log("Listed epics: ", epics);

  const epic = await client.epics.retrieve(workspaceSlug, projectId, epics.results[0]!.id!);

  console.log("Retrieved epic: ", epic);
}

if (require.main === module) {
  testEpics().catch(console.error);
}
