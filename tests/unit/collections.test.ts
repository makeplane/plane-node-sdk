import { PlaneClient } from "../../src/client/plane-client";
import { Collection, CollectionAccess, CollectionMemberAccess, Page } from "../../src/models";
import { config } from "./constants";
import { createTestClient, randomizeName } from "../helpers/test-utils";
import { describeIf as describe } from "../helpers/conditional-tests";

/**
 * Requires the target workspace to have the WORKSPACE_PAGES (and, for the
 * private-collection cases, PRIVATE_COLLECTIONS) feature flags enabled.
 */
describe(!!config.workspaceSlug, "Collections API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let collection: Collection;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
  });

  afterAll(async () => {
    if (collection?.id) {
      try {
        await client.collections.delete(workspaceSlug, collection.id, false);
      } catch (error) {
        console.warn("Failed to delete collection:", error);
      }
    }
  });

  it("should create a collection", async () => {
    collection = await client.collections.create(workspaceSlug, {
      name: randomizeName("SDK Collection "),
    });

    expect(collection).toBeDefined();
    expect(collection.id).toBeDefined();
    expect(collection.name).toContain("SDK Collection");
  });

  it("should list collections", async () => {
    const collections = await client.collections.list(workspaceSlug);

    expect(Array.isArray(collections)).toBe(true);
    expect(collections.find((c) => c.id === collection.id)).toBeDefined();
  });

  it("should retrieve a collection", async () => {
    const retrieved = await client.collections.retrieve(workspaceSlug, collection.id);

    expect(retrieved).toBeDefined();
    expect(retrieved.id).toBe(collection.id);
  });

  it("should update a collection", async () => {
    const updated = await client.collections.update(workspaceSlug, collection.id, {
      name: `${collection.name} (updated)`,
      sort_order: 25000,
    });

    expect(updated.id).toBe(collection.id);
    expect(updated.name).toBe(`${collection.name} (updated)`);
  });

  it("should delete a collection", async () => {
    await expect(client.collections.delete(workspaceSlug, collection.id, false)).resolves.toBeUndefined();

    const collections = await client.collections.list(workspaceSlug);
    expect(collections.find((c) => c.id === collection.id)).toBeUndefined();
    collection = undefined as unknown as Collection;
  });
});

describe(!!config.workspaceSlug, "Collection Pages API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let source: Collection;
  let target: Collection;
  let page: Page;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;

    source = await client.collections.create(workspaceSlug, {
      name: randomizeName("Source Collection "),
    });
    target = await client.collections.create(workspaceSlug, {
      name: randomizeName("Target Collection "),
    });
    page = await client.pages.createWorkspacePage(workspaceSlug, {
      name: randomizeName("Collection Page "),
      description_html: "<p>collection sdk test</p>",
    });
  });

  afterAll(async () => {
    if (page?.id) {
      try {
        await client.pages.deleteWorkspacePage(workspaceSlug, page.id);
      } catch (error) {
        console.warn("Failed to delete page:", error);
      }
    }
    for (const c of [source, target]) {
      if (c?.id) {
        try {
          await client.collections.delete(workspaceSlug, c.id, false);
        } catch (error) {
          console.warn("Failed to delete collection:", error);
        }
      }
    }
  });

  it("should search pages eligible to be added", async () => {
    const results = await client.collections.pages.search(workspaceSlug, source.id, page.name);

    expect(Array.isArray(results)).toBe(true);
    expect(results.find((r) => r.id === page.id)).toBeDefined();
  });

  it("should add a page, list it, move it, and remove it", async () => {
    const added = await client.collections.pages.add(workspaceSlug, source.id, {
      page_ids: [page.id],
    });
    expect(added.find((pc) => pc.page === page.id)).toBeDefined();

    const listed = await client.collections.pages.list(workspaceSlug, source.id);
    expect(Array.isArray(listed.results)).toBe(true);
    const matching = listed.results.filter((row) => row.page && row.page.id === page.id);
    expect(matching.length).toBe(1);
    const pageCollectionId = matching[0].page_collection_id!;
    expect(pageCollectionId).toBeDefined();

    const moved = await client.collections.pages.update(workspaceSlug, source.id, pageCollectionId, {
      collection: target.id,
    });
    expect(moved.collection).toBe(target.id);

    await client.collections.pages.remove(workspaceSlug, target.id, pageCollectionId);
    const listedAfter = await client.collections.pages.list(workspaceSlug, target.id);
    expect(listedAfter.results.find((row) => row.page && row.page.id === page.id)).toBeUndefined();
  });

  it("should create a page directly in a collection", async () => {
    const inlinePage = await client.pages.createWorkspacePage(workspaceSlug, {
      name: randomizeName("Inline Collection Page "),
      description_html: "<p>page in collection</p>",
      collection_id: source.id,
    });

    try {
      const listed = await client.collections.pages.list(workspaceSlug, source.id);
      const pageIds = listed.results.filter((row) => row.page).map((row) => row.page!.id);
      expect(pageIds).toContain(inlinePage.id);
    } finally {
      try {
        await client.pages.deleteWorkspacePage(workspaceSlug, inlinePage.id!);
      } catch (error) {
        console.warn("Failed to delete inline page:", error);
      }
    }
  });
});

describe(!!config.workspaceSlug, "Collection Members API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let privateCollection: Collection;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;

    privateCollection = await client.collections.create(workspaceSlug, {
      name: randomizeName("Private Collection "),
      access: CollectionAccess.PRIVATE,
    });
  });

  afterAll(async () => {
    if (privateCollection?.id) {
      try {
        await client.collections.delete(workspaceSlug, privateCollection.id, false);
      } catch (error) {
        console.warn("Failed to delete private collection:", error);
      }
    }
  });

  it("should list the auto-created owner membership and update its access", async () => {
    // Creating a private collection auto-adds its creator as an EDIT member.
    const members = await client.collections.members.list(workspaceSlug, privateCollection.id);

    expect(Array.isArray(members)).toBe(true);
    expect(members.length).toBe(1);
    const ownerMember = members[0];
    expect(ownerMember.access).toBe(CollectionMemberAccess.EDIT);

    const updated = await client.collections.members.update(workspaceSlug, privateCollection.id, ownerMember.id, {
      access: CollectionMemberAccess.VIEW,
    });
    expect(updated.access).toBe(CollectionMemberAccess.VIEW);
  });
});
