import { PlaneClient } from "../../../src/client/plane-client";
import { WorkItemRelationCreateRequest, WorkItemRelationRemoveRequest } from "../../../src/models/WorkItemRelation";
import { config } from "../constants";
import { createTestClient } from "../../helpers/test-utils";

export async function testRelations() {
  const client = createTestClient();

  const workspaceSlug = config.workspaceSlug;
  const projectId = config.projectId;
  const workItemId = config.workItemId;
  const workItemId2 = config.workItemId2;

  if (!workspaceSlug || !projectId || !workItemId || !workItemId2) {
    console.error("workspaceSlug, projectId, workItemId and workItemId2 are required");
    return;
  }

  const workItem2 = await client.workItems.retrieveByIdentifier(workspaceSlug, workItemId2);

  const relationData = await createRelation(client, workspaceSlug, projectId, workItemId, {
    relation_type: "blocking",
    issues: [workItem2.id],
  });
  console.log("Created relation: ", relationData);

  const relations = await listRelations(client, workspaceSlug, projectId, workItemId);
  console.log("Listed relations: ", relations);

  await deleteRelation(client, workspaceSlug, projectId, workItemId, {
    related_issue: workItem2.id,
  });
  console.log("Deleted relation: ", workItem2.id);
}

async function createRelation(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string,
  relationData: WorkItemRelationCreateRequest
) {
  return client.workItems.relations.create(workspaceSlug, projectId, workItemId, relationData);
}

async function listRelations(client: PlaneClient, workspaceSlug: string, projectId: string, workItemId: string) {
  return client.workItems.relations.list(workspaceSlug, projectId, workItemId);
}

async function deleteRelation(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string,
  relationData: WorkItemRelationRemoveRequest
) {
  return client.workItems.relations.delete(workspaceSlug, projectId, workItemId, relationData);
}

if (require.main === module) {
  testRelations().catch(console.error);
}
