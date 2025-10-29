import { PlaneClient } from "../../../src/client/plane-client";
import { WorkItemProperty, WorkItemPropertyOption } from "../../../src/models/WorkItemProperty";
import { config } from "../constants";
import { createTestClient, randomizeName } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(
  !!(config.workspaceSlug && config.projectId && config.workItemTypeId),
  "Work Item Type Properties and Options API Tests",
  () => {
    let client: PlaneClient;
    let workspaceSlug: string;
    let projectId: string;
    let workItemTypeId: string;
    let textProperty: WorkItemProperty;
    let optionProperty: WorkItemProperty;
    let propertyOption: WorkItemPropertyOption;

    beforeAll(async () => {
      client = createTestClient();
      workspaceSlug = config.workspaceSlug;
      projectId = config.projectId;
      workItemTypeId = config.workItemTypeId;

      // Enable work item types if not already enabled
      await client.projects.update(workspaceSlug, projectId, {
        is_issue_type_enabled: true,
      });
    });

    it("should test complete work item type properties and options workflow", async () => {
      // ===== TEST TEXT PROPERTY =====
      // Create a TEXT property
      const textPropertyName = randomizeName("Test WI Type Property");
      textProperty = await client.workItemProperties.create(workspaceSlug, projectId, workItemTypeId, {
        name: textPropertyName,
        display_name: textPropertyName,
        property_type: "TEXT",
        settings: {
          display_format: "single-line",
        },
        is_required: false,
      });

      expect(textProperty).toBeDefined();
      expect(textProperty.id).toBeDefined();
      expect(textProperty.property_type).toBe("TEXT");

      // Retrieve the property
      const retrievedTextProperty = await client.workItemProperties.retrieve(
        workspaceSlug,
        projectId,
        workItemTypeId,
        textProperty.id!
      );

      expect(retrievedTextProperty).toBeDefined();
      expect(retrievedTextProperty.id).toBe(textProperty.id);

      // Update the property
      const updatedTextPropertyName = randomizeName("Updated Test WI Type Property");
      const updatedTextProperty = await client.workItemProperties.update(
        workspaceSlug,
        projectId,
        workItemTypeId,
        textProperty.id!,
        {
          name: updatedTextPropertyName,
        }
      );

      expect(updatedTextProperty).toBeDefined();
      expect(updatedTextProperty.id).toBe(textProperty.id);

      // List properties
      const properties = await client.workItemProperties.list(workspaceSlug, projectId, workItemTypeId, {
        limit: 10,
        offset: 0,
      });

      expect(properties).toBeDefined();
      expect(Array.isArray(properties)).toBe(true);
      const foundProperty = properties.find((p) => p.id === textProperty.id);
      expect(foundProperty).toBeDefined();

      // Delete the TEXT property
      await client.workItemProperties.delete(workspaceSlug, projectId, workItemTypeId, textProperty.id!);

      // ===== TEST OPTION PROPERTY AND OPTIONS =====
      // Create an OPTION property
      const optionPropertyName = randomizeName("Test Option Property");
      optionProperty = await client.workItemProperties.create(workspaceSlug, projectId, workItemTypeId, {
        name: optionPropertyName,
        display_name: optionPropertyName,
        property_type: "OPTION",
        is_required: false,
      });

      expect(optionProperty).toBeDefined();
      expect(optionProperty.id).toBeDefined();
      expect(optionProperty.property_type).toBe("OPTION");

      // Create a property option
      const optionName = randomizeName("Test Property Option");
      propertyOption = await client.workItemProperties.options.create(workspaceSlug, projectId, optionProperty.id!, {
        name: optionName,
      });

      expect(propertyOption).toBeDefined();
      expect(propertyOption.id).toBeDefined();

      // Retrieve the property option
      const retrievedOption = await client.workItemProperties.options.retrieve(
        workspaceSlug,
        projectId,
        optionProperty.id!,
        propertyOption.id!
      );

      expect(retrievedOption).toBeDefined();
      expect(retrievedOption.id).toBe(propertyOption.id);

      // Update the property option
      const updatedOptionName = randomizeName("Updated Property Option");
      const updatedOption = await client.workItemProperties.options.update(
        workspaceSlug,
        projectId,
        optionProperty.id!,
        propertyOption.id!,
        {
          name: updatedOptionName,
        }
      );

      expect(updatedOption).toBeDefined();
      expect(updatedOption.id).toBe(propertyOption.id);

      // Delete the property option
      await client.workItemProperties.options.delete(workspaceSlug, projectId, optionProperty.id!, propertyOption.id!);

      // Delete the OPTION property
      await client.workItemProperties.delete(workspaceSlug, projectId, workItemTypeId, optionProperty.id!);
    });
  }
);
