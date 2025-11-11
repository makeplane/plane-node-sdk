import { PlaneClient } from "../../src/client/plane-client";
import { Sticky, UpdateSticky } from "../../src/models/Sticky";
import { config } from "./constants";
import { createTestClient, randomizeName } from "../helpers/test-utils";
import { describeIf } from "../helpers/conditional-tests";

describeIf(!!config.workspaceSlug, "Sticky API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let sticky: Sticky;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
  });

  afterAll(async () => {
    // Clean up created sticky
    if (sticky?.id) {
      try {
        await client.stickies.delete(workspaceSlug, sticky.id);
      } catch (error) {
        console.warn("Failed to delete sticky:", error);
      }
    }
  });

  it("should create a sticky", async () => {
    sticky = await client.stickies.create(workspaceSlug, {
      name: randomizeName("Test Sticky"),
      description_html: "<p>Test Sticky Description</p>",
      color: "#FF5733",
    });

    expect(sticky).toBeDefined();
    expect(sticky.id).toBeDefined();
    expect(sticky.name).toContain("Test Sticky");
    expect(sticky.description_html).toBe("<p>Test Sticky Description</p>");
    expect(sticky.color).toBe("#FF5733");
  });

  it("should retrieve a sticky", async () => {
    const retrievedSticky = await client.stickies.retrieve(workspaceSlug, sticky.id);

    expect(retrievedSticky).toBeDefined();
    expect(retrievedSticky.id).toBe(sticky.id);
    expect(retrievedSticky.name).toBe(sticky.name);
    expect(retrievedSticky.description_html).toBe(sticky.description_html);
  });

  it("should update a sticky", async () => {
    const updateData: UpdateSticky = {
      name: randomizeName("Updated Test Sticky"),
      description_html: "<p>Updated Test Sticky Description</p>",
      color: "#33FF57",
    };

    const updatedSticky = await client.stickies.update(workspaceSlug, sticky.id, updateData);

    expect(updatedSticky).toBeDefined();
    expect(updatedSticky.id).toBe(sticky.id);
    expect(updatedSticky.name).toContain("Updated Test Sticky");
    expect(updatedSticky.description_html).toBe("<p>Updated Test Sticky Description</p>");
    expect(updatedSticky.color).toBe("#33FF57");
  });

  it("should list stickies", async () => {
    const stickies = await client.stickies.list(workspaceSlug);

    expect(stickies).toBeDefined();
    expect(Array.isArray(stickies.results)).toBe(true);
    expect(stickies.results.length).toBeGreaterThan(0);

    const foundSticky = stickies.results.find((s) => s.id === sticky.id);
    expect(foundSticky).toBeDefined();
    expect(foundSticky?.name).toContain("Updated Test Sticky");
  });
});

