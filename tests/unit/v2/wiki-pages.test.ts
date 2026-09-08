import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { WikiPages } from "../../../src/api/v2/WikiPages";
import { V2Transport } from "../../../src/api/v2/kernel/transport";
import { NoMatchFoundError } from "../../../src/errors/PlaneApiError";

const BASE = "https://api.example.com";
const SLUG = "acme";

const makePages = () =>
  new WikiPages(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })), { slug: SLUG });

afterEach(() => nock.cleanAll());

describe("WikiPages (v2, workspace-scoped)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/pages/`;

  it("lists every page in the workspace", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, { data: [{ id: "p1" }, { id: "p2" }], pagination: { style: "offset" }, next: null });
    const page = await makePages().list();
    expect(page.data).toHaveLength(2);
  });

  it("iterates every page in the workspace across pages", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, { data: [{ id: "p1" }], pagination: { style: "offset" }, next: 1 });
    nock(BASE)
      .get(collection)
      .query({ offset: "1" })
      .reply(200, { data: [{ id: "p2" }], pagination: { style: "offset" }, next: null });

    const ids: string[] = [];
    for await (const p of makePages().iterate()) ids.push(p.id);
    expect(ids).toEqual(["p1", "p2"]);
  });

  it("retrieves one workspace page via a different path template than the project-scoped detail", async () => {
    nock(BASE).get(`${collection}p1/`).reply(200, { id: "p1", is_global: true });
    const fetched = await makePages().retrieve("p1");
    expect(fetched.is_global).toBe(true);
  });

  it("creates, updates, deletes a workspace-level page", async () => {
    nock(BASE).post(collection, { name: "Handbook" }).reply(201, { id: "wp1", name: "Handbook" });
    nock(BASE).patch(`${collection}wp1/`, { name: "Handbook v2" }).reply(200, { id: "wp1", name: "Handbook v2" });
    nock(BASE).delete(`${collection}wp1/`).reply(204);

    const pages = makePages();
    const created = await pages.create({ name: "Handbook" });
    expect(created.id).toBe("wp1");
    const updated = await pages.update("wp1", { name: "Handbook v2" });
    expect(updated.name).toBe("Handbook v2");
    await expect(pages.delete("wp1")).resolves.toBeUndefined();
  });

  it("rejects an unknown field on create before making the request", async () => {
    await expect(makePages().create({ name: "X" }, { fields: ["nope" as never] })).rejects.toThrow(/nope/);
  });

  it("throws a clear error when constructed with no scope", async () => {
    const pages = new WikiPages(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

    await expect(pages.list()).rejects.toThrow(/needs the path id 'slug'/);
  });

  describe("findByName()", () => {
    it("scans client-side for the one exact match, with no ?name= on the request", async () => {
      const scope = nock(BASE)
        .get(collection)
        .query((actual) => !("name" in actual))
        .reply(200, {
          data: [
            { id: "p1", name: "Handbook" },
            { id: "p2", name: "Handbook Draft" },
          ],
          pagination: { style: "offset" },
        });

      const found = await makePages().findByName("Handbook");

      expect(scope.isDone()).toBe(true);
      expect(found.id).toBe("p1");
    });

    it("throws NoMatchFoundError when nothing matches", async () => {
      nock(BASE)
        .get(collection)
        .reply(200, { data: [{ id: "p1", name: "Handbook" }], pagination: { style: "offset" } });

      await expect(makePages().findByName("Nope")).rejects.toBeInstanceOf(NoMatchFoundError);
    });
  });
});
