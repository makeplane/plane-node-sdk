import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Collections } from "../../../src/api/v2/Collections";
import { V2Transport } from "../../../src/api/v2/kernel/transport";
import { NoMatchFoundError } from "../../../src/errors/PlaneApiError";

const BASE = "https://api.example.com";
const SLUG = "acme";
const COLLECTION = "col-1";

const makeCollections = () => new Collections(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("Collections (v2)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/collections/`;

  it("lists, creates, retrieves, updates, deletes a collection", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, { data: [{ id: COLLECTION, name: "Engineering" }], pagination: { style: "offset" } });
    nock(BASE)
      .post(collection, { name: "Engineering" })
      .reply(201, { id: COLLECTION, name: "Engineering", is_default: false });
    nock(BASE).get(`${collection}${COLLECTION}/`).reply(200, { id: COLLECTION, name: "Engineering" });
    nock(BASE).patch(`${collection}${COLLECTION}/`, { name: "Eng" }).reply(200, { id: COLLECTION, name: "Eng" });
    nock(BASE).delete(`${collection}${COLLECTION}/`).reply(204);

    const collections = makeCollections();
    const page = await collections.list(SLUG);
    expect(page.data[0].name).toBe("Engineering");
    const created = await collections.create(SLUG, { name: "Engineering" });
    expect(created.is_default).toBe(false);
    const fetched = await collections.retrieve(SLUG, COLLECTION);
    expect(fetched.name).toBe("Engineering");
    const updated = await collections.update(SLUG, COLLECTION, { name: "Eng" });
    expect(updated.name).toBe("Eng");
    await expect(collections.delete(SLUG, COLLECTION)).resolves.toBeUndefined();
  });

  it("rejects an unknown field before making the request", async () => {
    await expect(makeCollections().list(SLUG, { fields: ["nope" as never] })).rejects.toThrow(/nope/);
  });

  describe("default()", () => {
    it("resolves the one collection with is_default: true via the golden's own filter", async () => {
      const scope = nock(BASE)
        .get(collection)
        .query({ is_default: "true", per_page: "2", count: "false" })
        .reply(200, { data: [{ id: "general", name: "General", is_default: true }], pagination: { style: "offset" } });

      const found = await makeCollections().default(SLUG);

      expect(scope.isDone()).toBe(true);
      expect(found.id).toBe("general");
    });

    it("throws NoMatchFoundError when no default collection exists", async () => {
      nock(BASE)
        .get(collection)
        .query(true)
        .reply(200, { data: [], pagination: { style: "offset" } });

      await expect(makeCollections().default(SLUG)).rejects.toThrow(/No Collections matched/);
    });
  });

  describe("findByName()", () => {
    it("scans client-side for the one exact match, with no ?name= on the request", async () => {
      const scope = nock(BASE)
        .get(collection)
        .query((actual) => !("name" in actual))
        .reply(200, {
          data: [
            { id: "col-1", name: "Engineering" },
            { id: "col-2", name: "Engineering Archive" },
          ],
          pagination: { style: "offset" },
        });

      const found = await makeCollections().findByName(SLUG, "Engineering");

      expect(scope.isDone()).toBe(true);
      expect(found.id).toBe("col-1");
    });

    it("throws NoMatchFoundError when nothing matches", async () => {
      nock(BASE)
        .get(collection)
        .reply(200, { data: [{ id: "col-1", name: "Engineering" }], pagination: { style: "offset" } });

      await expect(makeCollections().findByName(SLUG, "Nope")).rejects.toBeInstanceOf(NoMatchFoundError);
    });
  });
});

describe("Collections.members (v2)", () => {
  const membersUrl = `/api/v2/workspaces/${SLUG}/collections/${COLLECTION}/members/`;
  const makeCollections = () =>
    new Collections(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

  it("lists members as a raw array (no pagination envelope)", async () => {
    nock(BASE)
      .get(membersUrl)
      .reply(200, [
        { id: "m1", member_id: "u1", access: 0 },
        { id: "m2", member_id: "u2", access: 2 },
      ]);

    const members = await makeCollections().members.list(SLUG, COLLECTION);

    expect(Array.isArray(members)).toBe(true);
    expect(members).toHaveLength(2);
    expect(members[1].access).toBe(2);
  });

  it("adds members with an access level", async () => {
    const scope = nock(BASE)
      .post(membersUrl, { add: [{ member_id: "u3", access: 1 }] })
      .reply(200, { added: ["u3"] });

    const result = await makeCollections().members.add(SLUG, COLLECTION, [{ member_id: "u3", access: 1 }]);

    expect(scope.isDone()).toBe(true);
    expect(result).toEqual(["u3"]);
  });

  it("removes members by user id", async () => {
    const scope = nock(BASE)
      .post(membersUrl, { remove: ["u4"] })
      .reply(200, { removed: ["u4"] });

    const result = await makeCollections().members.remove(SLUG, COLLECTION, ["u4"]);

    expect(scope.isDone()).toBe(true);
    expect(result).toEqual(["u4"]);
  });

  it("rejects an unknown field on list before making the request", async () => {
    await expect(makeCollections().members.list(SLUG, COLLECTION, { fields: ["nope" as never] })).rejects.toThrow(
      /nope/
    );
  });
});

describe("Collections.pages (v2, bulk page membership)", () => {
  const pagesUrl = `/api/v2/workspaces/${SLUG}/collections/${COLLECTION}/pages/`;
  const makeCollections = () =>
    new Collections(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

  it("adds pages to the collection", async () => {
    const scope = nock(BASE)
      .post(pagesUrl, { add: ["p1"] })
      .reply(200, { added: ["p1"] });

    const result = await makeCollections().pages.add(SLUG, COLLECTION, ["p1"]);

    expect(scope.isDone()).toBe(true);
    expect(result).toEqual(["p1"]);
  });

  it("removes pages from the collection", async () => {
    const scope = nock(BASE)
      .post(pagesUrl, { remove: ["p2"] })
      .reply(200, { removed: ["p2"] });

    const result = await makeCollections().pages.remove(SLUG, COLLECTION, ["p2"]);

    expect(scope.isDone()).toBe(true);
    expect(result).toEqual(["p2"]);
  });

  it("search returns a raw array, not a Page envelope, and forwards the undocumented search param", async () => {
    const scope = nock(BASE)
      .get(`/api/v2/workspaces/${SLUG}/collections/${COLLECTION}/pages-search/`)
      .query({ search: "runbook" })
      .reply(200, [{ id: "p1", name: "Runbook" }]);

    const results = await makeCollections().pages.search(SLUG, COLLECTION, { search: "runbook" });

    expect(scope.isDone()).toBe(true);
    expect(Array.isArray(results)).toBe(true);
    expect(results[0].name).toBe("Runbook");
  });
});

describe("navigable collection rows (v2)", () => {
  it("reaches members and pages from a fetched collection", async () => {
    const base = `/api/v2/workspaces/${SLUG}/collections/col1`;
    nock(BASE).get(`${base}/`).reply(200, { id: "col1", name: "Handbook" });
    const members = nock(BASE).get(`${base}/members/`).reply(200, []);
    const pages = nock(BASE)
      .post(`${base}/pages/`, { add: ["pg1"] })
      .reply(200, { added: ["pg1"] });

    const collection = await makeCollections().retrieve(SLUG, "col1");
    await collection.members.list();
    await collection.pages.add(["pg1"]);

    expect([members.isDone(), pages.isDone()]).toEqual([true, true]);
  });
});
