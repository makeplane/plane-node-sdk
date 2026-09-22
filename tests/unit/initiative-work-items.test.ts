import nock from "nock";
import { PlaneClient } from "../../src/client/plane-client";

/**
 * What `initiatives.workItems` sends. Offline, so it runs without a Plane instance.
 * The live round trip is in initiative.test.ts ("Initiative Work Items").
 */
const BASE = "https://plane.example.com";
const URL = "/api/v1/workspaces/ws/initiatives/i/work-items/";

const client = new PlaneClient({ apiKey: "k", baseUrl: BASE });

afterEach(() => nock.cleanAll());

describe("Initiative work items", () => {
  it("lists the initiative's work items, passing paging params through", async () => {
    const scope = nock(BASE)
      .get(URL)
      .query({ per_page: "5", cursor: "5:1:0" })
      .reply(200, { results: [{ id: "w1" }], next_cursor: "5:2:0", count: 1 });

    const page = await client.initiatives.workItems.list("ws", "i", { per_page: 5, cursor: "5:1:0" });

    expect(scope.isDone()).toBe(true);
    expect(page.results.map((item) => item.id)).toEqual(["w1"]);
    expect(page.next_cursor).toBe("5:2:0");
  });

  it("adds work items with work_item_ids and answers the work items", async () => {
    const scope = nock(BASE)
      .post(URL, { work_item_ids: ["w1", "w2"] })
      .reply(200, [{ id: "w1" }, { id: "w2" }]);

    const added = await client.initiatives.workItems.add("ws", "i", { work_item_ids: ["w1", "w2"] });

    expect(scope.isDone()).toBe(true);
    expect(added.map((item) => item.id)).toEqual(["w1", "w2"]);
  });

  it("removes work items with a DELETE carrying work_item_ids", async () => {
    const scope = nock(BASE)
      .delete(URL, { work_item_ids: ["w1"] })
      .reply(204);

    await expect(client.initiatives.workItems.remove("ws", "i", { work_item_ids: ["w1"] })).resolves.toBeUndefined();

    expect(scope.isDone()).toBe(true);
  });

  it("keeps the deprecated epics surface on /epics/ with epic_ids", async () => {
    const scope = nock(BASE)
      .post("/api/v1/workspaces/ws/initiatives/i/epics/", { epic_ids: ["e1"] })
      .reply(200, [{ id: "e1" }]);

    await client.initiatives.epics.add("ws", "i", { epic_ids: ["e1"] });

    expect(scope.isDone()).toBe(true);
  });
});
