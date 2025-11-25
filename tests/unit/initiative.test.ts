import { PlaneClient } from "../../src/client/plane-client";
import { Initiative, InitiativeState, UpdateInitiative } from "../../src/models/Initiative";
import { InitiativeLabel } from "../../src/models/InitiativeLabel";
import { Project } from "../../src/models/Project";
import { Epic } from "../../src/models/Epic";
import { config } from "./constants";
import { createTestClient, randomizeName } from "../helpers/test-utils";
import { describeIf } from "../helpers/conditional-tests";

describeIf(!!(config.workspaceSlug && config.projectId), "Initiative API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;
  let initiative: Initiative;
  let initiativeLabel: InitiativeLabel;
  let testProject: Project;
  let testEpic: Epic;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;

    // Create a test project for initiative operations
    testProject = await client.projects.create(workspaceSlug, {
      name: randomizeName("Test Project for Initiative"),
      identifier: randomizeName("TPI").slice(0, 5).toUpperCase(),
    });

    // Create an initiative label
    initiativeLabel = await client.initiatives.labels.create(workspaceSlug, {
      name: randomizeName("Test Initiative Label"),
      color: "#FF5733",
      sort_order: 100,
    });

    // Create a test epic if epics are available
    try {
      const epics = await client.epics.list(workspaceSlug, projectId);
      if (epics.results.length > 0) {
        testEpic = epics.results[0];
      }
    } catch (error) {
      console.warn("Epics not available for testing:", error);
    }
  });

  afterAll(async () => {
    // Clean up created resources
    if (initiative?.id) {
      try {
        await client.initiatives.delete(workspaceSlug, initiative.id);
      } catch (error) {
        console.warn("Failed to delete initiative:", error);
      }
    }
    if (initiativeLabel?.id) {
      try {
        await client.initiatives.labels.delete(workspaceSlug, initiativeLabel.id);
      } catch (error) {
        console.warn("Failed to delete initiative label:", error);
      }
    }
    if (testProject?.id) {
      try {
        await client.projects.delete(workspaceSlug, testProject.id);
      } catch (error) {
        console.warn("Failed to delete test project:", error);
      }
    }
  });

  it("should create an initiative", async () => {
    initiative = await client.initiatives.create(workspaceSlug, {
      name: randomizeName("Test Initiative"),
      description: "Test Initiative Description",
      state: InitiativeState.ACTIVE,
    });

    expect(initiative).toBeDefined();
    expect(initiative.id).toBeDefined();
    expect(initiative.name).toContain("Test Initiative");
    expect(initiative.description).toBe("Test Initiative Description");
    expect(initiative.state).toBe(InitiativeState.ACTIVE);
  });

  it("should retrieve an initiative", async () => {
    const retrievedInitiative = await client.initiatives.retrieve(workspaceSlug, initiative.id);

    expect(retrievedInitiative).toBeDefined();
    expect(retrievedInitiative.id).toBe(initiative.id);
    expect(retrievedInitiative.name).toBe(initiative.name);
    expect(retrievedInitiative.state).toBe(initiative.state);
  });

  it("should update an initiative", async () => {
    const updateData: UpdateInitiative = {
      name: randomizeName("Updated Test Initiative"),
      description: "Updated Test Initiative Description",
      state: InitiativeState.PLANNED,
    };

    const updatedInitiative = await client.initiatives.update(workspaceSlug, initiative.id, updateData);

    expect(updatedInitiative).toBeDefined();
    expect(updatedInitiative.id).toBe(initiative.id);
    expect(updatedInitiative.name).toContain("Updated Test Initiative");
    expect(updatedInitiative.state).toBe(InitiativeState.PLANNED);
  });

  it("should list initiatives", async () => {
    const initiatives = await client.initiatives.list(workspaceSlug);

    expect(initiatives).toBeDefined();
    expect(Array.isArray(initiatives.results)).toBe(true);
    expect(initiatives.results.length).toBeGreaterThan(0);

    const foundInitiative = initiatives.results.find((i) => i.id === initiative.id);
    expect(foundInitiative).toBeDefined();
  });

  describe("Initiative Labels", () => {
    it("should create an initiative label", async () => {
      expect(initiativeLabel).toBeDefined();
      expect(initiativeLabel.id).toBeDefined();
      expect(initiativeLabel.name).toContain("Test Initiative Label");
    });

    it("should retrieve an initiative label", async () => {
      const retrievedLabel = await client.initiatives.labels.retrieve(workspaceSlug, initiativeLabel.id);

      expect(retrievedLabel).toBeDefined();
      expect(retrievedLabel.id).toBe(initiativeLabel.id);
      expect(retrievedLabel.name).toBe(initiativeLabel.name);
    });

    it("should update an initiative label", async () => {
      const updatedLabel = await client.initiatives.labels.update(workspaceSlug, initiativeLabel.id, {
        name: randomizeName("Updated Test Initiative Label"),
        color: "#33FF57",
      });

      expect(updatedLabel).toBeDefined();
      expect(updatedLabel.id).toBe(initiativeLabel.id);
      expect(updatedLabel.name).toContain("Updated Test Initiative Label");
      expect(updatedLabel.color).toBe("#33FF57");
    });

    it("should list initiative labels", async () => {
      const labels = await client.initiatives.labels.list(workspaceSlug);

      expect(labels).toBeDefined();
      expect(Array.isArray(labels.results)).toBe(true);
      expect(labels.results.length).toBeGreaterThan(0);

      const foundLabel = labels.results.find((l) => l.id === initiativeLabel.id);
      expect(foundLabel).toBeDefined();
    });

    it("should add labels to initiative", async () => {
      const labels = await client.initiatives.labels.addLabels(workspaceSlug, initiative.id, {
        label_ids: [initiativeLabel.id],
      });

      expect(labels).toBeDefined();
      expect(Array.isArray(labels)).toBe(true);
      expect(labels.length).toBeGreaterThan(0);
    });

    it("should list labels in initiative", async () => {
      const labels = await client.initiatives.labels.listLabels(workspaceSlug, initiative.id);

      expect(labels).toBeDefined();
      expect(Array.isArray(labels.results)).toBe(true);
      expect(labels.results.length).toBeGreaterThan(0);

      const foundLabel = labels.results.find((l) => l.id === initiativeLabel.id);
      expect(foundLabel).toBeDefined();
    });

    it("should remove labels from initiative", async () => {
      await client.initiatives.labels.removeLabels(workspaceSlug, initiative.id, {
        label_ids: [initiativeLabel.id],
      });

      const labels = await client.initiatives.labels.listLabels(workspaceSlug, initiative.id);
      const foundLabel = labels.results.find((l) => l.id === initiativeLabel.id);
      expect(foundLabel).toBeUndefined();
    });
  });

  describe("Initiative Projects", () => {
    it("should add projects to initiative", async () => {
      const projects = await client.initiatives.projects.add(workspaceSlug, initiative.id, {
        project_ids: [testProject.id],
      });

      expect(projects).toBeDefined();
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
    });

    it("should list projects in initiative", async () => {
      const projects = await client.initiatives.projects.list(workspaceSlug, initiative.id);

      expect(projects).toBeDefined();
      expect(Array.isArray(projects.results)).toBe(true);
      expect(projects.results.length).toBeGreaterThan(0);

      const foundProject = projects.results.find((p) => p.id === testProject.id);
      expect(foundProject).toBeDefined();
    });

    it("should remove projects from initiative", async () => {
      await client.initiatives.projects.remove(workspaceSlug, initiative.id, {
        project_ids: [testProject.id],
      });

      const projects = await client.initiatives.projects.list(workspaceSlug, initiative.id);
      const foundProject = projects.results.find((p) => p.id === testProject.id);
      expect(foundProject).toBeUndefined();
    });
  });

  describe("Initiative Epics", () => {
    it("should add epics to initiative", async () => {
      if (!testEpic?.id) {
        return;
      }

      const epics = await client.initiatives.epics.add(workspaceSlug, initiative.id, {
        epic_ids: [testEpic.id],
      });

      expect(epics).toBeDefined();
      expect(Array.isArray(epics)).toBe(true);
    });

    it("should list epics in initiative", async () => {
      if (!testEpic?.id) {
        return;
      }

      const epics = await client.initiatives.epics.list(workspaceSlug, initiative.id);

      expect(epics).toBeDefined();
      expect(Array.isArray(epics.results)).toBe(true);
    });

    it("should remove epics from initiative", async () => {
      if (!testEpic?.id) {
        return;
      }

      await client.initiatives.epics.remove(workspaceSlug, initiative.id, {
        epic_ids: [testEpic.id],
      });

      const epics = await client.initiatives.epics.list(workspaceSlug, initiative.id);
      const foundEpic = epics.results.find((e) => e.id === testEpic.id);
      expect(foundEpic).toBeUndefined();
    });
  });
});

