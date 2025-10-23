import { PlaneClient } from "../../src/client/plane-client";
import { Link } from "../../src/models/Link";
import { config } from "../constants";
import { createTestClient } from "../test-utils";

export async function testLinks() {
  const client = createTestClient();

  const workspaceSlug = config.workspaceSlug;
  const projectId = config.projectId;
  const workItemId = config.workItemId;

  const link = await createLink(client, workspaceSlug, projectId, workItemId);
  console.log("Created link: ", link);

  const retrievedLink = await retrieveLink(
    client,
    workspaceSlug,
    projectId,
    workItemId,
    link.id
  );
  console.log("Retrieved link: ", retrievedLink);

  const updatedLink = await updateLink(
    client,
    workspaceSlug,
    projectId,
    workItemId,
    link.id
  );
  console.log("Updated link: ", updatedLink);

  const links = await listLinks(client, workspaceSlug, projectId, workItemId);
  console.log("Listed links: ", links);

  await deleteLink(client, workspaceSlug, projectId, workItemId, link.id);
  console.log("Deleted link: ", link.id);
}

async function createLink(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string
) {
  const link = await client.workItems.links.create(
    workspaceSlug,
    projectId,
    workItemId,
    {
      title: "Test Link",
      url: "https://test.com",
    }
  );
  return link;
}

async function retrieveLink(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string,
  linkId: string
) {
  const link = await client.workItems.links.retrieve(
    workspaceSlug,
    projectId,
    workItemId,
    linkId
  );
  return link;
}

async function updateLink(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string,
  linkId: string
) {
  return await client.workItems.links.update(
    workspaceSlug,
    projectId,
    workItemId,
    linkId,
    {
      title: "Updated Test Link",
      url: "https://updated.com",
    }
  );
}

async function listLinks(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string
) {
  const links = await client.workItems.links.list(
    workspaceSlug,
    projectId,
    workItemId
  );
  return links;
}

async function deleteLink(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string,
  linkId: string
) {
  await client.workItems.links.del(
    workspaceSlug,
    projectId,
    workItemId,
    linkId
  );
}

if (require.main === module) {
  testLinks().catch(console.error);
}
