/**
 * Work item comments: CRUD plus their own upsert/bulk actions (separate operation ids from CRUD).
 *
 * Driven off a fetched work item row — comments are a grandchild of the project, so they
 * need the work item's own id, which only its row can supply.
 */
import { PlaneApiError } from "../../../src/errors/PlaneApiError";
import { LoadedWorkItem } from "../../../src/api/v2/loaded/WorkItem";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 work item comments (live)", () => {
  const suite = useV2Project("wic", env);
  let workItem: LoadedWorkItem;

  beforeAll(async () => {
    workItem = await suite.projectRow.workItems.create({ name: uniqueName("wic-parent") });
  });

  afterAll(async () => {
    if (workItem) {
      await suite.projectRow.workItems.delete(workItem.id);
    }
  });

  it("creates, retrieves, updates, deletes", async () => {
    const created = await workItem.comments.create({ comment_html: "<p>hello</p>" });
    expect(created.comment_html).toBe("<p>hello</p>");
    expect(created.comment_stripped).toBe("hello");

    const fetched = await workItem.comments.retrieve(created.id);
    expect(fetched.id).toBe(created.id);

    const updated = await workItem.comments.update(created.id, { comment_html: "<p>edited</p>" });
    expect(updated.comment_html).toBe("<p>edited</p>");

    await workItem.comments.delete(created.id);
    await expect(workItem.comments.retrieve(created.id)).rejects.toMatchObject<Partial<PlaneApiError>>({ status: 404 });
  });

  it("lists, with sparse fields", async () => {
    const created = await workItem.comments.create({ comment_html: "<p>list me</p>" });
    try {
      const page = await workItem.comments.list({ fields: ["id", "comment_html"] as const });
      const found = page.data.find((row) => row.id === created.id);
      expect(found).toBeDefined();
      expect(found!.comment_html).toBe("<p>list me</p>");
    } finally {
      await workItem.comments.delete(created.id);
    }
  });

  it("upserts via the comment-specific operation", async () => {
    const externalId = uniqueName("wic-upsert");
    const first = await workItem.comments.upsert({
      comment_html: "<p>v1</p>",
      external_id: externalId,
      external_source: "sdk-e2e",
    });
    try {
      const second = await workItem.comments.upsert({
        comment_html: "<p>v2</p>",
        external_id: externalId,
        external_source: "sdk-e2e",
      });
      expect(second.id).toBe(first.id);
      expect(second.comment_html).toBe("<p>v2</p>");
    } finally {
      await workItem.comments.delete(first.id);
    }
  });

  it("bulkCreate, bulkUpdate, bulkDelete via the comment-specific operations", async () => {
    const created = await workItem.comments.bulkCreate([0, 1].map(() => ({ comment_html: "<p>bulk</p>" })));
    expect(created.succeeded).toBe(2);
    const ids = created.results.map((row) => row.id!);

    const updated = await workItem.comments.bulkUpdate(ids.map((id) => ({ id, comment_html: "<p>bulk edited</p>" })));
    expect(updated.succeeded).toBe(2);

    const deleted = await workItem.comments.bulkDelete(ids);
    expect(deleted.succeeded).toBe(2);
  });
});
