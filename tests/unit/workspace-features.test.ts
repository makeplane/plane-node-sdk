import { PlaneClient } from "../../src/client/plane-client";
import { config } from "./constants";
import { createTestClient } from "../helpers/test-utils";
import { describeIf } from "../helpers/conditional-tests";

describeIf(!!config.workspaceSlug, "Workspace Features API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
  });

  it("should retrieve workspace features", async () => {
    const features = await client.workspace.retrieveFeatures(workspaceSlug);

    expect(features).toBeDefined();
    expect(typeof features.project_grouping).toBe("boolean");
    expect(typeof features.initiatives).toBe("boolean");
    expect(typeof features.teams).toBe("boolean");
    expect(typeof features.customers).toBe("boolean");
    expect(typeof features.wiki).toBe("boolean");
    expect(typeof features.pi).toBe("boolean");
  });

  it("should update workspace features", async () => {
    const originalFeatures = await client.workspace.retrieveFeatures(workspaceSlug);

    const updatedFeatures = await client.workspace.updateFeatures(workspaceSlug, {
      project_grouping: !originalFeatures.project_grouping,
      initiatives: !originalFeatures.initiatives,
    });

    expect(updatedFeatures).toBeDefined();
    expect(updatedFeatures.project_grouping).toBe(!originalFeatures.project_grouping);
    expect(updatedFeatures.initiatives).toBe(!originalFeatures.initiatives);

    // Restore original values
    await client.workspace.updateFeatures(workspaceSlug, {
      project_grouping: originalFeatures.project_grouping,
      initiatives: originalFeatures.initiatives,
    });
  });
});

