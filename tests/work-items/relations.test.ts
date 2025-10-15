import { PlaneClient } from "../../src/client/plane-client";
import {
  WorkItemRelationCreateRequest,
  WorkItemRelationRemoveRequest,
} from "../../src/models/WorkItemRelation";
import { config } from "../constants";

export async function testRelations() {
  const client = new PlaneClient({
    apiKey: process.env.PLANE_API_KEY!,
    baseUrl: process.env.PLANE_BASE_URL!,
    enableLogging: true,
  });

  const workspaceSlug = config.workspaceSlug;
  const projectId = config.projectId;
  const workItemId = config.workItemId;

  const workItem2 = await client.workItems.retrieveByIdentifier(
    workspaceSlug,
    projectId,
    config.workItemId2
  );

  const relationData = await createRelation(
    client,
    workspaceSlug,
    projectId,
    workItemId,
    {
      relation_type: "blocking",
      issues: [workItem2.id],
    }
  );
  console.log("Created relation: ", relationData);

  const relations = await listRelations(
    client,
    workspaceSlug,
    projectId,
    workItemId
  );
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
  return client.workItems.relations.create(
    workspaceSlug,
    projectId,
    workItemId,
    relationData
  );
}

async function listRelations(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string
) {
  return client.workItems.relations.list(workspaceSlug, projectId, workItemId);
}

async function deleteRelation(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string,
  relationData: WorkItemRelationRemoveRequest
) {
  return client.workItems.relations.del(
    workspaceSlug,
    projectId,
    workItemId,
    relationData
  );
}

if (require.main === module) {
  testRelations().catch(console.error);
}
