import { PlaneClient } from "../src/client/plane-client";
import { config } from "./constants";
import { createTestClient } from "./test-utils";

export async function testEpics() {
  const client = createTestClient();

  const project = await client.projects.retrieve(
    config.workspaceSlug,
    config.projectId
  );

  const epics = await client.epics.list(config.workspaceSlug, config.projectId);

  console.log("Listed epics: ", epics);

  const epic = await client.epics.retrieve(
    config.workspaceSlug,
    config.projectId,
    epics.results[0]!.id!
  );

  console.log("Retrieved epic: ", epic);
}

if (require.main === module) {
  testEpics().catch(console.error);
}
