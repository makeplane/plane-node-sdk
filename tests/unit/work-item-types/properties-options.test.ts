import { PlaneClient } from "../../../src/client/plane-client";
import { WorkItemProperty } from "../../../src/models/WorkItemProperty";
import { config } from "../constants";
import { createTestClient, randomizeName } from "../../helpers/test-utils";
import { describeIf } from "../../helpers/conditional-tests";

describeIf(
  !!(config.workspaceSlug && config.projectId && config.workItemTypeId),
  "Work Item Type Properties and Options API Tests",
  () => {
    let client: PlaneClient;
    let workspaceSlug: string;
    let projectId: string;
    let workItemTypeId: string;
    // Servers with workspace-level work item types enabled reject
    // project/type-scoped property creation with a 400 — skip gracefully.
    let serverBlocksTypeScoped = false;

    beforeAll(async () => {
      client = createTestClient();
      workspaceSlug = config.workspaceSlug;
      projectId = config.projectId;
      workItemTypeId = config.workItemTypeId;

      // Enable work item types if not already enabled
      await client.projects.update(workspaceSlug, projectId, {
        is_issue_type_enabled: true,
      });

      // Probe: attempt a throwaway property create to detect server support
      try {
        const probeName = randomizeName("probe_prop_");
        const probe = await client.workItemProperties.create(workspaceSlug, projectId, workItemTypeId, {
          name: probeName,
          display_name: probeName,
          property_type: "TEXT",
          is_required: false,
        });
        await client.workItemProperties.delete(workspaceSlug, projectId, workItemTypeId, probe.id!);
      } catch (error: any) {
        const msg = String(error?.response?.error ?? error?.response?.detail ?? "");
        if (error?.statusCode === 400 && msg.includes("work item propert")) {
          serverBlocksTypeScoped = true;
          console.warn("Server blocks type-scoped work item properties by policy — skipping:", msg);
          return;
        }
        throw error;
      }
    });

    describe("TEXT Property Tests", () => {
      it("should create, retrieve, update, list, and delete a TEXT property", async () => {
        if (serverBlocksTypeScoped) return;
        // Create a TEXT property
        const textPropertyName = randomizeName("Test WI Type Property");
        const textProperty = await client.workItemProperties.create(workspaceSlug, projectId, workItemTypeId, {
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
      });
    });

    describe("OPTION Property Tests", () => {
      let optionProperty: WorkItemProperty;

      const defaultOptions = [
        {
          name: "Backlog",
          description: "Item is in the backlog",
          is_default: true,
          is_active: true,
        },
        {
          name: "In Progress",
          description: "Item is in progress",
          is_active: true,
        },
        {
          name: "Done",
          description: "Item is done",
          is_active: true,
        },
      ];

      beforeEach(async () => {
        if (serverBlocksTypeScoped) return;
        // Create an OPTION property for testing
        const optionPropertyName = randomizeName("Test Option Property");
        optionProperty = await client.workItemProperties.create(workspaceSlug, projectId, workItemTypeId, {
          name: optionPropertyName,
          display_name: optionPropertyName,
          property_type: "OPTION",
          is_required: false,
          options: defaultOptions,
        });
      });

      afterEach(async () => {
        // Clean up the OPTION property
        if (optionProperty?.id) {
          await client.workItemProperties.delete(workspaceSlug, projectId, workItemTypeId, optionProperty.id);
        }
      });

      it("should create an OPTION property with options", async () => {
        if (serverBlocksTypeScoped) return;
        expect(optionProperty).toBeDefined();
        expect(optionProperty.id).toBeDefined();
        expect(optionProperty.property_type).toBe("OPTION");
        expect(optionProperty.options?.length).toBe(3);
        expect(optionProperty.options?.[0].name).toBe("Backlog");
        expect(optionProperty.options?.[0].is_default).toBe(true);
        expect(optionProperty.options?.[0].is_active).toBe(true);
        expect(optionProperty.options?.[1].name).toBe("In Progress");
        expect(optionProperty.options?.[1].description).toBe("Item is in progress");
        expect(optionProperty.options?.[1].is_active).toBe(true);
      });

      it("should retrieve an OPTION property", async () => {
        if (serverBlocksTypeScoped) return;
        const retrievedOptionProperty = await client.workItemProperties.retrieve(
          workspaceSlug,
          projectId,
          workItemTypeId,
          optionProperty.id!
        );

        expect(retrievedOptionProperty).toBeDefined();
        expect(retrievedOptionProperty.id).toBe(optionProperty.id);
        expect(retrievedOptionProperty.property_type).toBe("OPTION");
      });

      it("should update an OPTION property", async () => {
        if (serverBlocksTypeScoped) return;
        const updatedOptionPropertyName = randomizeName("Updated Option Property");
        const updatedOptionProperty = await client.workItemProperties.update(
          workspaceSlug,
          projectId,
          workItemTypeId,
          optionProperty.id!,
          {
            name: updatedOptionPropertyName,
          }
        );

        expect(updatedOptionProperty).toBeDefined();
        expect(updatedOptionProperty.id).toBe(optionProperty.id);
      });

      it("should list OPTION properties", async () => {
        if (serverBlocksTypeScoped) return;
        const properties = await client.workItemProperties.list(workspaceSlug, projectId, workItemTypeId, {
          limit: 10,
          offset: 0,
        });

        expect(properties).toBeDefined();
        expect(Array.isArray(properties)).toBe(true);
        const foundProperty = properties.find((p) => p.id === optionProperty.id);
        expect(foundProperty).toBeDefined();
      });
    });

    describe("Property Options Tests", () => {
      let optionProperty: WorkItemProperty;

      beforeEach(async () => {
        if (serverBlocksTypeScoped) return;
        // Create an OPTION property for testing options
        const optionPropertyName = randomizeName("Test Option Property for Options");
        optionProperty = await client.workItemProperties.create(workspaceSlug, projectId, workItemTypeId, {
          name: optionPropertyName,
          display_name: optionPropertyName,
          property_type: "OPTION",
          is_required: false,
        });
      });

      afterEach(async () => {
        // Clean up the OPTION property
        if (optionProperty?.id) {
          await client.workItemProperties.delete(workspaceSlug, projectId, workItemTypeId, optionProperty.id);
        }
      });

      it("should create, retrieve, update, and delete a property option", async () => {
        if (serverBlocksTypeScoped) return;
        // Create a property option
        const optionName = randomizeName("Test Property Option");
        const propertyOption = await client.workItemProperties.options.create(
          workspaceSlug,
          projectId,
          optionProperty.id!,
          {
            name: optionName,
          }
        );

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
        await client.workItemProperties.options.delete(
          workspaceSlug,
          projectId,
          optionProperty.id!,
          propertyOption.id!
        );
      });
    });
  }
);
