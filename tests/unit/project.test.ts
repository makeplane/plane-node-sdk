import { PlaneClient } from "../../src/client/plane-client";
import { UpdateProject, Project } from "../../src/models/Project";
import { config } from "./constants";
import { createTestClient, randomizeName } from "../helpers/test-utils";
import { describeIf as describe } from "../helpers/conditional-tests";

describe(!!config.workspaceSlug, "Project API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let project: Project;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
  });

  afterAll(async () => {
    // Clean up created project
    if (project?.id) {
      try {
        await client.projects.delete(workspaceSlug, project.id);
      } catch (error) {
        console.warn("Failed to delete project:", error);
      }
    }
  });

  it("should create a project", async () => {
    const name = randomizeName();
    project = await client.projects.create(workspaceSlug, {
      name: name,
      identifier: name.slice(0, 5).toUpperCase(),
      description: "Test Project Description",
    });

    expect(project).toBeDefined();
    expect(project.id).toBeDefined();
    expect(project.name).toBe(name);
    expect(project.description).toBe("Test Project Description");
  });

  it("should retrieve a project", async () => {
    const retrievedProject = await client.projects.retrieve(workspaceSlug, project.id);

    expect(retrievedProject).toBeDefined();
    expect(retrievedProject.id).toBe(project.id);
    expect(retrievedProject.name).toBe(project.name);
    expect(retrievedProject.description).toBe(project.description);
  });

  it("should update a project", async () => {
    const updateData: UpdateProject = {
      name: "Updated Test Project",
      description: "Updated Test Project Description",
    };

    const updatedProject = await client.projects.update(workspaceSlug, project.id, updateData);

    expect(updatedProject).toBeDefined();
    expect(updatedProject.id).toBe(project.id);
    expect(updatedProject.name).toBe("Updated Test Project");
    expect(updatedProject.description).toBe("Updated Test Project Description");
  });

  it("should list projects", async () => {
    const projects = await client.projects.list(workspaceSlug);

    expect(projects).toBeDefined();
    expect(Array.isArray(projects.results)).toBe(true);
    expect(projects.results.length).toBeGreaterThan(0);

    const foundProject = projects.results.find((p) => p.id === project.id);
    expect(foundProject).toBeDefined();
    expect(foundProject?.name).toBe("Updated Test Project");
  });

  it("should get project members", async () => {
    const members = await client.projects.getMembers(workspaceSlug, project.id);

    expect(members).toBeDefined();
    expect(Array.isArray(members)).toBe(true);
  });

  describe(!!config.workspaceSlug, "Project Features", () => {
    it("should retrieve project features", async () => {
      const features = await client.projects.retrieveFeatures(workspaceSlug, project.id);

      expect(features).toBeDefined();
      expect(typeof features.epics).toBe("boolean");
      expect(typeof features.modules).toBe("boolean");
      expect(typeof features.cycles).toBe("boolean");
      expect(typeof features.views).toBe("boolean");
      expect(typeof features.pages).toBe("boolean");
      expect(typeof features.intakes).toBe("boolean");
      expect(typeof features.work_item_types).toBe("boolean");
    });

    it("should update project features", async () => {
      const originalFeatures = await client.projects.retrieveFeatures(workspaceSlug, project.id);

      const updatedFeatures = await client.projects.updateFeatures(workspaceSlug, project.id, {
        epics: !originalFeatures.epics,
        modules: !originalFeatures.modules,
      });

      expect(updatedFeatures).toBeDefined();
      expect(updatedFeatures.epics).toBe(!originalFeatures.epics);
      expect(updatedFeatures.modules).toBe(!originalFeatures.modules);

      // Restore original values
      await client.projects.updateFeatures(workspaceSlug, project.id, {
        epics: originalFeatures.epics,
        modules: originalFeatures.modules,
      });
    });
  });
});
