import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Collections } from "../../../src/api/v2/Collections";
import { V2Transport } from "../../../src/api/v2/kernel/transport";
import { NoMatchFoundError } from "../../../src/errors/PlaneApiError";

const BASE = "https://api.example.com";
const SLUG = "acme";
const COLLECTION = "col-1";

const makeCollections = () =>
  new Collections(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })), { slug: SLUG });

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
    const page = await collections.list();
    expect(page.data[0].name).toBe("Engineering");
    const created = await collections.create({ name: "Engineering" });
    expect(created.is_default).toBe(false);
    const fetched = await collections.retrieve(COLLECTION);
    expect(fetched.name).toBe("Engineering");
    const updated = await collections.update(COLLECTION, { name: "Eng" });
    expect(updated.name).toBe("Eng");
    await expect(collections.delete(COLLECTION)).resolves.toBeUndefined();
  });

  it("rejects an unknown field before making the request", async () => {
    await expect(makeCollections().list({ fields: ["nope" as never] })).rejects.toThrow(/nope/);
  });

  describe("default()", () => {
    it("resolves the one collection with is_default: true via the golden's own filter", async () => {
      const scope = nock(BASE)
        .get(collection)
        .query({ is_default: "true", per_page: "2", count: "false" })
        .reply(200, { data: [{ id: "general", name: "General", is_default: true }], pagination: { style: "offset" } });

      const found = await makeCollections().default();

      expect(scope.isDone()).toBe(true);
      expect(found.id).toBe("general");
    });

    it("throws NoMatchFoundError when no default collection exists", async () => {
      nock(BASE)
        .get(collection)
        .query(true)
        .reply(200, { data: [], pagination: { style: "offset" } });

      await expect(makeCollections().default()).rejects.toThrow(/No Collections matched/);
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

      const found = await makeCollections().findByName("Engineering");

      expect(scope.isDone()).toBe(true);
      expect(found.id).toBe("col-1");
    });

    it("throws NoMatchFoundError when nothing matches", async () => {
      nock(BASE)
        .get(collection)
        .reply(200, { data: [{ id: "col-1", name: "Engineering" }], pagination: { style: "offset" } });

      await expect(makeCollections().findByName("Nope")).rejects.toBeInstanceOf(NoMatchFoundError);
    });
  });
});

describe("Collections.members (v2)", () => {
  const membersUrl = `/api/v2/workspaces/${SLUG}/collections/${COLLECTION}/members/`;
  const makeCollections = () =>
    new Collections(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })), { slug: SLUG });

  it("lists members as a raw array (no pagination envelope)", async () => {
    nock(BASE)
      .get(membersUrl)
      .reply(200, [
        { id: "m1", member_id: "u1", access: 0 },
        { id: "m2", member_id: "u2", access: 2 },
      ]);

    const members = await makeCollections().members.list(COLLECTION);

    expect(Array.isArray(members)).toBe(true);
    expect(members).toHaveLength(2);
    expect(members[1].access).toBe(2);
  });

  it("manages members: add + remove in one call", async () => {
    const body = { add: [{ member_id: "u3", access: 1 as const }], remove: ["u4"] };
    nock(BASE)
      .post(membersUrl, body)
      .reply(200, { added: ["u3"], removed: ["u4"] });

    const result = await makeCollections().members.manage(COLLECTION, body);

    expect(result.added).toEqual(["u3"]);
    expect(result.removed).toEqual(["u4"]);
  });

  it("rejects an unknown field on list before making the request", async () => {
    await expect(makeCollections().members.list(COLLECTION, { fields: ["nope" as never] })).rejects.toThrow(/nope/);
  });
});

describe("Collections.pages (v2, bulk page membership)", () => {
  const pagesUrl = `/api/v2/workspaces/${SLUG}/collections/${COLLECTION}/pages/`;
  const makeCollections = () =>
    new Collections(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })), { slug: SLUG });

  it("manages page membership: add + remove in one call", async () => {
    const body = { add: ["p1"], remove: ["p2"] };
    nock(BASE)
      .post(pagesUrl, body)
      .reply(200, { added: ["p1"], removed: ["p2"] });

    const result = await makeCollections().pages.manage(COLLECTION, body);

    expect(result.added).toEqual(["p1"]);
    expect(result.removed).toEqual(["p2"]);
  });

  it("search returns a raw array, not a Page envelope, and forwards the undocumented search param", async () => {
    const scope = nock(BASE)
      .get(`/api/v2/workspaces/${SLUG}/collections/${COLLECTION}/pages-search/`)
      .query({ search: "runbook" })
      .reply(200, [{ id: "p1", name: "Runbook" }]);

    const results = await makeCollections().pages.search(COLLECTION, { search: "runbook" });

    expect(scope.isDone()).toBe(true);
    expect(Array.isArray(results)).toBe(true);
    expect(results[0].name).toBe("Runbook");
  });
});
