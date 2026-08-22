/**
 * Work item comments: CRUD plus their own upsert/bulk actions (separate operation ids from CRUD).
 */
import { PlaneApiError } from "../../../src/errors/PlaneApiError";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 work item comments (live)", () => {
  const suite = useV2Project("wic", env);
  let workItemId: string;

  beforeAll(async () => {
    const created = await suite.client.v2
      .workspace(suite.workspaceSlug)
      .project(suite.projectId)
      .workItems.create({ name: uniqueName("wic-parent") });
    workItemId = created.id;
  });

  afterAll(async () => {
    if (workItemId) {
      await suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId).workItems.delete(workItemId);
    }
  });

  it("creates, retrieves, updates, deletes", async () => {
    const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
    const created = await proj.workItems.comments.create(workItemId, { comment_html: "<p>hello</p>" });
    expect(created.comment_html).toBe("<p>hello</p>");
    expect(created.comment_stripped).toBe("hello");

    const fetched = await proj.workItems.comments.retrieve(workItemId, created.id);
    expect(fetched.id).toBe(created.id);

    const updated = await proj.workItems.comments.update(workItemId, created.id, { comment_html: "<p>edited</p>" });
    expect(updated.comment_html).toBe("<p>edited</p>");

    await proj.workItems.comments.delete(workItemId, created.id);
    await expect(proj.workItems.comments.retrieve(workItemId, created.id)).rejects.toMatchObject<
      Partial<PlaneApiError>
    >({ status: 404 });
  });

  it("lists, with sparse fields", async () => {
    const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
    const created = await proj.workItems.comments.create(workItemId, { comment_html: "<p>list me</p>" });
    try {
      const page = await proj.workItems.comments.list(workItemId, { fields: ["id", "comment_html"] as const });
      const found = page.data.find((row) => row.id === created.id);
      expect(found).toBeDefined();
      expect(found!.comment_html).toBe("<p>list me</p>");
    } finally {
      await proj.workItems.comments.delete(workItemId, created.id);
    }
  });

  it("upserts via the comment-specific operation", async () => {
    const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
    const externalId = uniqueName("wic-upsert");
    const first = await proj.workItems.comments.upsert(workItemId, {
      comment_html: "<p>v1</p>",
      external_id: externalId,
      external_source: "sdk-e2e",
    });
    try {
      const second = await proj.workItems.comments.upsert(workItemId, {
        comment_html: "<p>v2</p>",
        external_id: externalId,
        external_source: "sdk-e2e",
      });
      expect(second.id).toBe(first.id);
      expect(second.comment_html).toBe("<p>v2</p>");
    } finally {
      await proj.workItems.comments.delete(workItemId, first.id);
    }
  });

  it("bulkCreate, bulkUpdate, bulkDelete via the comment-specific operations", async () => {
    const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
    const created = await proj.workItems.comments.bulkCreate(
      workItemId,
      [0, 1].map(() => ({ comment_html: "<p>bulk</p>" }))
    );
    expect(created.succeeded).toBe(2);
    const ids = created.results.map((row) => row.id!);

    const updated = await proj.workItems.comments.bulkUpdate(
      workItemId,
      ids.map((id) => ({ id, comment_html: "<p>bulk edited</p>" }))
    );
    expect(updated.succeeded).toBe(2);

    const deleted = await proj.workItems.comments.bulkDelete(workItemId, ids);
    expect(deleted.succeeded).toBe(2);
  });
});
