import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Comments } from "../../../src/api/v2/WorkItems";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const SLUG = "acme";
const PROJECT = "ENG";
const WORK_ITEM = "wi-1";

const makeComments = () => new Comments(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));
const collection = `/api/v2/workspaces/${SLUG}/projects/${PROJECT}/work-items/${WORK_ITEM}/comments/`;

afterEach(() => nock.cleanAll());

describe("WorkItems.comments (v2)", () => {
  it("lists comments for a work item", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, { data: [{ id: "c1", comment_html: "<p>hi</p>" }], pagination: { style: "offset" } });

    const page = await makeComments().list(SLUG, PROJECT, WORK_ITEM);

    expect(page.data[0].comment_html).toBe("<p>hi</p>");
  });

  it("narrows fields on list", async () => {
    nock(BASE)
      .get(collection)
      .query({ fields: "id" })
      .reply(200, { data: [{ id: "c1" }], pagination: { style: "offset" } });

    const page = await makeComments().list(SLUG, PROJECT, WORK_ITEM, { fields: ["id"] as const });

    expect(page.data[0].id).toBe("c1");
    // @ts-expect-error `comment_html` was not requested
    expect(page.data[0].comment_html).toBeUndefined();
  });

  it("encodes the actor expand", async () => {
    const scope = nock(BASE)
      .get(collection)
      .query({ expand: "actor" })
      .reply(200, {
        data: [],
        pagination: { style: "offset" },
      });

    await makeComments().list(SLUG, PROJECT, WORK_ITEM, { expand: ["actor"] });

    expect(scope.isDone()).toBe(true);
  });

  it("filters by agent_run_id and expands agent_run beside agent_run_id", async () => {
    const scope = nock(BASE)
      .get(collection)
      .query({ agent_run_id: "run-1", expand: "actor,agent_run" })
      .reply(200, {
        data: [
          {
            id: "c1",
            agent_run_id: "run-1",
            agent_run: { id: "run-1", status: "in_progress", agent_user_id: "bot-1", native_agent_id: null },
          },
        ],
        pagination: { style: "offset" },
      });

    const page = await makeComments().list(SLUG, PROJECT, WORK_ITEM, {
      agent_run_id: "run-1",
      expand: ["actor", "agent_run"],
    });

    expect(scope.isDone()).toBe(true);
    expect(page.data[0].agent_run_id).toBe("run-1");
  });

  it("projects agent_run_id through fields on a single-row read", async () => {
    const scope = nock(BASE)
      .get(`${collection}c1/`)
      .query({ fields: "agent_run_id", expand: "agent_run" })
      .reply(200, { id: "c1", agent_run_id: null });

    const row = await makeComments().retrieve(SLUG, PROJECT, WORK_ITEM, "c1", {
      fields: ["agent_run_id"] as const,
      expand: ["agent_run"],
    });

    expect(scope.isDone()).toBe(true);
    expect(row.agent_run_id).toBeNull();
  });

  it("rejects an expand the golden does not offer on comments", async () => {
    await expect(makeComments().list(SLUG, PROJECT, WORK_ITEM, { expand: ["agent_runs" as never] })).rejects.toThrow(
      /Unknown expand value\(s\) for comments_list: agent_runs/
    );
  });

  it("creates, retrieves, updates, and deletes a comment", async () => {
    const write = { comment_html: "<p>hello</p>" };
    nock(BASE)
      .post(collection, write)
      .reply(201, { id: "c1", ...write });
    nock(BASE)
      .get(`${collection}c1/`)
      .reply(200, { id: "c1", ...write });
    nock(BASE)
      .patch(`${collection}c1/`, { comment_html: "<p>edited</p>" })
      .reply(200, { id: "c1", comment_html: "<p>edited</p>" });
    nock(BASE).delete(`${collection}c1/`).reply(204);

    const comments = makeComments();
    const created = await comments.create(SLUG, PROJECT, WORK_ITEM, write);
    expect(created.id).toBe("c1");

    const fetched = await comments.retrieve(SLUG, PROJECT, WORK_ITEM, "c1");
    expect(fetched.comment_html).toBe("<p>hello</p>");

    const updated = await comments.update(SLUG, PROJECT, WORK_ITEM, "c1", { comment_html: "<p>edited</p>" });
    expect(updated.comment_html).toBe("<p>edited</p>");

    await expect(comments.delete(SLUG, PROJECT, WORK_ITEM, "c1")).resolves.toBeUndefined();
  });

  it("upserts via the comment-specific operation id", async () => {
    const write = { comment_html: "<p>x</p>", external_id: "e1", external_source: "jira" };
    const scope = nock(BASE)
      .post(`${collection}upsert/`, write)
      .reply(200, { id: "c1", ...write });

    await makeComments().upsert(SLUG, PROJECT, WORK_ITEM, write);

    expect(scope.isDone()).toBe(true);
  });

  it("bulk-creates, bulk-updates, and bulk-deletes via the comment-specific operation ids", async () => {
    const createScope = nock(BASE)
      .post(`${collection}bulk-create/`, { items: [{ comment_html: "<p>a</p>" }], all_or_none: false })
      .reply(200, { results: [{ index: 0, result: "created", id: "c1" }], succeeded: 1, failed: 0 });
    const updateScope = nock(BASE)
      .post(`${collection}bulk-update/`, { items: [{ id: "c1", comment_html: "<p>b</p>" }], all_or_none: false })
      .reply(200, { results: [{ index: 0, result: "updated", id: "c1" }], succeeded: 1, failed: 0 });
    const deleteScope = nock(BASE)
      .post(`${collection}bulk-delete/`, { ids: ["c1"], all_or_none: false })
      .reply(200, { results: [{ index: 0, result: "deleted", id: "c1" }], succeeded: 1, failed: 0 });

    const comments = makeComments();
    await comments.bulkCreate(SLUG, PROJECT, WORK_ITEM, [{ comment_html: "<p>a</p>" }]);
    await comments.bulkUpdate(SLUG, PROJECT, WORK_ITEM, [{ id: "c1", comment_html: "<p>b</p>" }]);
    await comments.bulkDelete(SLUG, PROJECT, WORK_ITEM, ["c1"]);

    expect(createScope.isDone()).toBe(true);
    expect(updateScope.isDone()).toBe(true);
    expect(deleteScope.isDone()).toBe(true);
  });

  it("rejects an unknown field before making the request", async () => {
    await expect(makeComments().list(SLUG, PROJECT, WORK_ITEM, { fields: ["nope" as never] })).rejects.toThrow(/nope/);
  });
});
