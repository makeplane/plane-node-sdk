import { PlaneClient } from "../../src/client/plane-client";
import { Teamspace, UpdateTeamspace } from "../../src/models/Teamspace";
import { Project } from "../../src/models/Project";
import { User } from "../../src/models/User";
import { config } from "./constants";
import { createTestClient, randomizeName } from "../helpers/test-utils";
import { describeIf } from "../helpers/conditional-tests";

describeIf(!!(config.workspaceSlug), "Teamspace API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let teamspace: Teamspace;
  let testProject: Project;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;

    // Create a test project for teamspace operations
    testProject = await client.projects.create(workspaceSlug, {
      name: randomizeName("Test Project for Teamspace"),
      identifier: randomizeName("TPT").slice(0, 5).toUpperCase(),
    });
  });

  afterAll(async () => {
    // Clean up created resources
    if (teamspace?.id) {
      try {
        await client.teamspaces.delete(workspaceSlug, teamspace.id);
      } catch (error) {
        console.warn("Failed to delete teamspace:", error);
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

  it("should create a teamspace", async () => {
    teamspace = await client.teamspaces.create(workspaceSlug, {
      name: randomizeName("Test Teamspace"),
      description_html: "<p>Test Teamspace Description</p>",
    });

    expect(teamspace).toBeDefined();
    expect(teamspace.id).toBeDefined();
    expect(teamspace.name).toContain("Test Teamspace");
    expect(teamspace.description_html).toBe("<p>Test Teamspace Description</p>");
  });

  it("should retrieve a teamspace", async () => {
    const retrievedTeamspace = await client.teamspaces.retrieve(workspaceSlug, teamspace.id);

    expect(retrievedTeamspace).toBeDefined();
    expect(retrievedTeamspace.id).toBe(teamspace.id);
    expect(retrievedTeamspace.name).toBe(teamspace.name);
  });

  it("should update a teamspace", async () => {
    const updateData: UpdateTeamspace = {
      name: randomizeName("Updated Test Teamspace"),
      description_html: "<p>Updated Test Teamspace Description</p>",
    };

    const updatedTeamspace = await client.teamspaces.update(workspaceSlug, teamspace.id, updateData);

    expect(updatedTeamspace).toBeDefined();
    expect(updatedTeamspace.id).toBe(teamspace.id);
    expect(updatedTeamspace.name).toContain("Updated Test Teamspace");
  });

  it("should list teamspaces", async () => {
    const teamspaces = await client.teamspaces.list(workspaceSlug);

    expect(teamspaces).toBeDefined();
    expect(Array.isArray(teamspaces.results)).toBe(true);
    expect(teamspaces.results.length).toBeGreaterThan(0);

    const foundTeamspace = teamspaces.results.find((t) => t.id === teamspace.id);
    expect(foundTeamspace).toBeDefined();
  });

  describe("Teamspace Projects", () => {
    it("should add projects to teamspace", async () => {
      const projects = await client.teamspaces.projects.add(workspaceSlug, teamspace.id, {
        project_ids: [testProject.id],
      });

      expect(projects).toBeDefined();
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
    });

    it("should list projects in teamspace", async () => {
      const projects = await client.teamspaces.projects.list(workspaceSlug, teamspace.id);

      expect(projects).toBeDefined();
      expect(Array.isArray(projects.results)).toBe(true);
      expect(projects.results.length).toBeGreaterThan(0);

      const foundProject = projects.results.find((p) => p.id === testProject.id);
      expect(foundProject).toBeDefined();
    });

    it("should remove projects from teamspace", async () => {
      await client.teamspaces.projects.remove(workspaceSlug, teamspace.id, {
        project_ids: [testProject.id],
      });

      const projects = await client.teamspaces.projects.list(workspaceSlug, teamspace.id);
      const foundProject = projects.results.find((p) => p.id === testProject.id);
      expect(foundProject).toBeUndefined();
    });
  });

  describe("Teamspace Members", () => {
    let testUser: User;

    beforeAll(async () => {
      // Get current user for member operations
      testUser = await client.users.me();
    });

    it("should add members to teamspace", async () => {
      const members = await client.teamspaces.members.add(workspaceSlug, teamspace.id, {
        member_ids: [testUser.id!],
      });

      expect(members).toBeDefined();
      expect(Array.isArray(members)).toBe(true);
      expect(members.length).toBeGreaterThan(0);
    });

    it("should list members in teamspace", async () => {
      const members = await client.teamspaces.members.list(workspaceSlug, teamspace.id);

      expect(members).toBeDefined();
      expect(Array.isArray(members.results)).toBe(true);
      expect(members.results.length).toBeGreaterThan(0);

      const foundMember = members.results.find((m) => m.id === testUser.id);
      expect(foundMember).toBeDefined();
    });

    it("should remove members from teamspace", async () => {
      await client.teamspaces.members.remove(workspaceSlug, teamspace.id, {
        member_ids: [testUser.id!],
      });

      const members = await client.teamspaces.members.list(workspaceSlug, teamspace.id);
      const foundMember = members.results.find((m) => m.id === testUser.id);
      expect(foundMember).toBeUndefined();
    });
  });
});

