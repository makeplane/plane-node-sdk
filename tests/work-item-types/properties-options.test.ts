import { PlaneClient } from "../../src/client/plane-client";
import { PropertyType } from "../../src/models/common";
import {
  WorkItemProperty,
  WorkItemPropertyOption,
  WorkItemPropertySettings,
} from "../../src/models/WorkItemProperty";
import { config } from "../constants";
import { createTestClient } from "../test-utils";

export async function testWorkItemTypesPropertiesAndOptions() {
  const client = createTestClient();

  const workspaceSlug = config.workspaceSlug;
  const projectId = config.projectId;
  const workItemTypeId = config.workItemTypeId;

  if (!workItemTypeId) {
    throw new Error(
      "workItemTypeId is required to test work item properties and options"
    );
  }

  // enable work item types if didn't already
  await client.projects.update(workspaceSlug, projectId, {
    is_issue_type_enabled: true,
  });

  // test the work item type properties
  const workItemTypeProperty = await createWorkItemTypeProperty(
    client,
    workspaceSlug,
    projectId,
    workItemTypeId,
    "TEXT",
    {
      display_format: "single-line",
    }
  );
  console.log("Created work item type property: ", workItemTypeProperty);

  const retrievedWorkItemTypeProperty = await retrieveWorkItemTypeProperty(
    client,
    workspaceSlug,
    projectId,
    workItemTypeId,
    workItemTypeProperty.id
  );
  console.log(
    "Retrieved work item type property: ",
    retrievedWorkItemTypeProperty
  );

  const updatedWorkItemTypeProperty = await updateWorkItemTypeProperty(
    client,
    workspaceSlug,
    projectId,
    workItemTypeId,
    workItemTypeProperty.id
  );
  console.log("Updated work item type property: ", updatedWorkItemTypeProperty);

  const workItemTypeProperties = await listWorkItemTypeProperties(
    client,
    workspaceSlug,
    projectId,
    workItemTypeId
  );
  console.log("Listed work item type properties: ", workItemTypeProperties);

  await deleteWorkItemTypeProperty(
    client,
    workspaceSlug,
    projectId,
    workItemTypeId,
    workItemTypeProperty.id
  );
  console.log("Work item type property deleted: ", workItemTypeProperty.id);

  // test the work item type property options
  // create a work item type property with property type OPTION
  // use the work item type property id to create a work item property option

  const optionWorkItemTypeProperty = await createWorkItemTypeProperty(
    client,
    workspaceSlug,
    projectId,
    workItemTypeId,
    "OPTION"
  );
  console.log(
    "Created option work item type property: ",
    optionWorkItemTypeProperty
  );

  if (!optionWorkItemTypeProperty.id) {
    throw new Error(
      "optionWorkItemTypeProperty ID is required to test work item property options"
    );
  }

  const createdWorkItemPropertyOption = await createWorkItemPropertyOption(
    client,
    workspaceSlug,
    projectId,
    optionWorkItemTypeProperty.id
  );
  console.log(
    "Created work item property option: ",
    createdWorkItemPropertyOption
  );

  const retrievedWorkItemPropertyOption = await retrieveWorkItemPropertyOption(
    client,
    workspaceSlug,
    projectId,
    optionWorkItemTypeProperty.id,
    createdWorkItemPropertyOption.id
  );
  console.log(
    "Retrieved work item property option: ",
    retrievedWorkItemPropertyOption
  );

  const updatedWorkItemPropertyOption = await updateWorkItemPropertyOption(
    client,
    workspaceSlug,
    projectId,
    optionWorkItemTypeProperty.id,
    createdWorkItemPropertyOption.id
  );
  console.log(
    "Updated work item property option: ",
    updatedWorkItemPropertyOption
  );

  await deleteWorkItemPropertyOption(
    client,
    workspaceSlug,
    projectId,
    optionWorkItemTypeProperty.id,
    createdWorkItemPropertyOption.id
  );
  console.log(
    "Work item property option deleted: ",
    createdWorkItemPropertyOption.id
  );

  await deleteWorkItemTypeProperty(
    client,
    workspaceSlug,
    projectId,
    workItemTypeId,
    optionWorkItemTypeProperty.id
  );
  console.log(
    "Option work item type property deleted: ",
    optionWorkItemTypeProperty.id
  );
}

async function createWorkItemTypeProperty(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemTypeId: string,
  propertyType: PropertyType,
  settings?: WorkItemPropertySettings
): Promise<WorkItemProperty> {
  const workItemTypeProperty = await client.workItemProperties.create(
    workspaceSlug,
    projectId,
    workItemTypeId,
    {
      name: `Test WI Type Property ${new Date().getTime()}`,
      display_name: `Test WI Type Property ${new Date().getTime()}`,
      property_type: propertyType,
      settings,
      is_required: false,
    }
  );
  return workItemTypeProperty;
}

async function retrieveWorkItemTypeProperty(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemTypeId: string,
  workItemPropertyId: string
): Promise<WorkItemProperty> {
  const workItemTypeProperty = await client.workItemProperties.retrieve(
    workspaceSlug,
    projectId,
    workItemTypeId,
    workItemPropertyId
  );
  return workItemTypeProperty;
}

async function listWorkItemTypeProperties(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemTypeId: string
): Promise<WorkItemProperty[]> {
  const workItemTypeProperties = await client.workItemProperties.list(
    workspaceSlug,
    projectId,
    workItemTypeId,
    {
      limit: 10,
      offset: 0,
    }
  );
  return workItemTypeProperties;
}

async function updateWorkItemTypeProperty(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemTypeId: string,
  workItemPropertyId: string
): Promise<WorkItemProperty> {
  const updatedWorkItemTypeProperty = await client.workItemProperties.update(
    workspaceSlug,
    projectId,
    workItemTypeId,
    workItemPropertyId,
    {
      name: `Updated Test WI Type Property ${new Date().getTime()}`,
    }
  );
  return updatedWorkItemTypeProperty;
}

async function deleteWorkItemTypeProperty(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemTypeId: string,
  workItemPropertyId: string
): Promise<void> {
  await client.workItemProperties.del(
    workspaceSlug,
    projectId,
    workItemTypeId,
    workItemPropertyId
  );
}

async function createWorkItemPropertyOption(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemPropertyId: string
): Promise<WorkItemPropertyOption> {
  const workItemTypePropertyOption =
    await client.workItemProperties.options.create(
      workspaceSlug,
      projectId,
      workItemPropertyId,
      {
        name: `Test Property Option ${new Date().getTime()}`,
      }
    );
  return workItemTypePropertyOption;
}

async function retrieveWorkItemPropertyOption(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemPropertyId: string,
  workItemPropertyOptionId: string
): Promise<WorkItemPropertyOption> {
  const workItemTypePropertyOption =
    await client.workItemProperties.options.retrieve(
      workspaceSlug,
      projectId,
      workItemPropertyId,
      workItemPropertyOptionId
    );
  return workItemTypePropertyOption;
}

async function updateWorkItemPropertyOption(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemPropertyId: string,
  workItemPropertyOptionId: string
): Promise<WorkItemPropertyOption> {
  const workItemTypePropertyOption =
    await client.workItemProperties.options.update(
      workspaceSlug,
      projectId,
      workItemPropertyId,
      workItemPropertyOptionId,
      {
        name: `Updated Property Option ${new Date().getTime()}`,
      }
    );
  return workItemTypePropertyOption;
}

async function deleteWorkItemPropertyOption(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemPropertyId: string,
  workItemPropertyOptionId: string
): Promise<void> {
  await client.workItemProperties.options.del(
    workspaceSlug,
    projectId,
    workItemPropertyId,
    workItemPropertyOptionId
  );
}

if (require.main === module) {
  testWorkItemTypesPropertiesAndOptions().catch(console.error);
}
