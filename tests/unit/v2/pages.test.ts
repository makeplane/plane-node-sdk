import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { ProjectPages } from "../../../src/api/v2/Pages";
import { V2Transport } from "../../../src/api/v2/kernel/transport";
import { NoMatchFoundError } from "../../../src/errors/PlaneApiError";

const BASE = "https://api.example.com";
const SLUG = "acme";
const PROJECT = "ENG";

const makePages = () => new ProjectPages(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("ProjectPages (v2, project-scoped)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/projects/${PROJECT}/pages/`;

  it("lists, creates, retrieves, updates, deletes a wiki page", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, { data: [{ id: "p1", name: "Runbook" }], pagination: { style: "offset" } });
    nock(BASE).post(collection, { name: "Runbook" }).reply(201, { id: "p1", name: "Runbook", access: 0 });
    nock(BASE).get(`${collection}p1/`).reply(200, { id: "p1", name: "Runbook" });
    nock(BASE).patch(`${collection}p1/`, { is_locked: true }).reply(200, { id: "p1", is_locked: true });
    nock(BASE).delete(`${collection}p1/`).reply(204);

    const pages = makePages();
    const page = await pages.list(SLUG, PROJECT);
    expect(page.data[0].name).toBe("Runbook");
    const created = await pages.create(SLUG, PROJECT, { name: "Runbook" });
    expect(created.access).toBe(0);
    const fetched = await pages.retrieve(SLUG, PROJECT, "p1");
    expect(fetched.name).toBe("Runbook");
    const updated = await pages.update(SLUG, PROJECT, "p1", { is_locked: true });
    expect(updated.is_locked).toBe(true);
    await expect(pages.delete(SLUG, PROJECT, "p1")).resolves.toBeUndefined();
  });

  it("encodes the owned_by/parent expand", async () => {
    const scope = nock(BASE)
      .get(collection)
      .query({ expand: "owned_by,parent" })
      .reply(200, { data: [], pagination: { style: "offset" } });
    await makePages().list(SLUG, PROJECT, { expand: ["owned_by", "parent"] });
    expect(scope.isDone()).toBe(true);
  });

  it("rejects an expand value the operation doesn't offer", async () => {
    await expect(makePages().list(SLUG, PROJECT, { expand: ["assignees" as never] })).rejects.toThrow(
      /Unknown expand value\(s\) for project_pages_list: assignees/
    );
  });

  it("filters by type", async () => {
    const scope = nock(BASE)
      .get(collection)
      .query({ type: "shared" })
      .reply(200, { data: [], pagination: { style: "offset" } });
    await makePages().list(SLUG, PROJECT, { type: "shared" });
    expect(scope.isDone()).toBe(true);
  });

  it("throws a clear error when the workspace slug is empty", async () => {
    await expect(makePages().list("", PROJECT)).rejects.toThrow(/needs the path id 'slug'/);
  });

  describe("findByName()", () => {
    it("scans client-side for the one exact match, with no ?name= on the request", async () => {
      // The query matcher asserts there is no `name` key at all — if `findByName`
      // regressed to a server-side `?name=` filter, this interceptor would not
      // match the request and the call would reject instead of resolving.
      const scope = nock(BASE)
        .get(collection)
        .query((actual) => !("name" in actual))
        .reply(200, {
          data: [
            { id: "p1", name: "Runbook" },
            { id: "p2", name: "Runbook Draft" },
          ],
          pagination: { style: "offset" },
        });

      const found = await makePages().findByName(SLUG, PROJECT, "Runbook");

      expect(scope.isDone()).toBe(true);
      expect(found.id).toBe("p1");
    });

    it("throws NoMatchFoundError when nothing matches", async () => {
      nock(BASE)
        .get(collection)
        .reply(200, { data: [{ id: "p1", name: "Runbook" }], pagination: { style: "offset" } });

      await expect(makePages().findByName(SLUG, PROJECT, "Nope")).rejects.toBeInstanceOf(NoMatchFoundError);
    });
  });
});
