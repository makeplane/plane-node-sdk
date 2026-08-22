import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Changelog, Comments, Links, ReleaseLabels, ReleaseTags, Releases } from "../../../src/api/v2/Releases";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const SLUG = "acme";
const RELEASE = "rel-1";

const scope = { slug: SLUG };
const makeTransport = () => new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" }));

afterEach(() => nock.cleanAll());

describe("Releases (v2)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/releases/`;
  const make = () => new Releases(makeTransport(), scope);

  it("lists releases", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, { data: [{ id: "1", name: "v1.0", status: "unreleased" }], pagination: { style: "offset" } });

    const page = await make().list();
    expect(page.data[0].status).toBe("unreleased");
  });

  it("narrows fields and rejects an unknown one", async () => {
    nock(BASE)
      .get(collection)
      .query({ fields: "name" })
      .reply(200, { data: [{ id: "1", name: "v1.0" }], pagination: { style: "offset" } });

    const page = await make().list({ fields: ["name"] });
    expect(page.data[0].name).toBe("v1.0");

    await expect(make().list({ fields: ["nope" as never] })).rejects.toThrow(/nope/);
  });

  it("encodes the lead/tag expand and rejects an unknown expand value", async () => {
    const scoped = nock(BASE).get(`${collection}rel-1/`).query({ expand: "lead,tag" }).reply(200, { id: "rel-1" });
    await make().retrieve(RELEASE, { expand: ["lead", "tag"] });
    expect(scoped.isDone()).toBe(true);

    await expect(make().retrieve(RELEASE, { expand: ["assignee" as never] })).rejects.toThrow(
      /Unknown expand value\(s\) for releases_retrieve: assignee/
    );
  });

  it("creates, retrieves, updates, deletes a release", async () => {
    const write = { name: "v1.0" };
    nock(BASE)
      .post(collection, write)
      .reply(201, { id: "rel-1", ...write });
    nock(BASE)
      .get(`${collection}rel-1/`)
      .reply(200, { id: "rel-1", ...write });
    nock(BASE)
      .patch(`${collection}rel-1/`, { status: "released" })
      .reply(200, { id: "rel-1", name: "v1.0", status: "released" });
    nock(BASE).delete(`${collection}rel-1/`).reply(204);

    const releases = make();
    const created = await releases.create(write);
    expect(created.id).toBe("rel-1");
    const fetched = await releases.retrieve("rel-1");
    expect(fetched.name).toBe("v1.0");
    const updated = await releases.update("rel-1", { status: "released" });
    expect(updated.status).toBe("released");
    await expect(releases.delete("rel-1")).resolves.toBeUndefined();
  });

  it("manages release labels (add/remove) and posts the body to .../labels/", async () => {
    const body = { add: ["lbl-1"], remove: ["lbl-2"] };
    nock(BASE)
      .post(`${collection}rel-1/labels/`, body)
      .reply(200, { added: ["lbl-1"], removed: ["lbl-2"] });

    const result = await make().manageLabels("rel-1", body);
    expect(result).toEqual({ added: ["lbl-1"], removed: ["lbl-2"] });
  });

  it("manages release work items (add/remove) and posts the body to .../work-items/", async () => {
    const body = { add: ["wi-1"] };
    nock(BASE)
      .post(`${collection}rel-1/work-items/`, body)
      .reply(200, { added: ["wi-1"], removed: [] });

    const result = await make().manageWorkItems("rel-1", body);
    expect(result.added).toEqual(["wi-1"]);
  });

  it("finds by name", async () => {
    const scoped = nock(BASE)
      .get(collection)
      .query({ name: "v1.0", per_page: "2", count: "false" })
      .reply(200, { data: [{ id: "rel-1", name: "v1.0" }], pagination: { style: "offset" } });

    expect((await make().findByName("v1.0")).id).toBe("rel-1");
    expect(scoped.isDone()).toBe(true);
  });

  it("exposes labels/tags/comments/links/changelog as sub-resource instances", () => {
    const releases = make();
    expect(releases.labels).toBeInstanceOf(ReleaseLabels);
    expect(releases.tags).toBeInstanceOf(ReleaseTags);
    expect(releases.comments).toBeInstanceOf(Comments);
    expect(releases.links).toBeInstanceOf(Links);
    expect(releases.changelog).toBeInstanceOf(Changelog);
  });
});

describe("Releases.comments (v2)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/releases/${RELEASE}/comments/`;
  const make = () => new Comments(makeTransport(), scope);

  it("lists, creates, retrieves, updates, deletes a comment", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, { data: [{ id: "c1", comment_html: "<p>hi</p>" }], pagination: { style: "offset" } });
    const page = await make().list(RELEASE);
    expect(page.data[0].comment_html).toBe("<p>hi</p>");

    const write = { comment_html: "<p>new</p>" };
    nock(BASE)
      .post(collection, write)
      .reply(201, { id: "c1", ...write });
    const created = await make().create(RELEASE, write);
    expect(created.id).toBe("c1");

    nock(BASE)
      .get(`${collection}c1/`)
      .reply(200, { id: "c1", ...write });
    const fetched = await make().retrieve(RELEASE, "c1");
    expect(fetched.comment_html).toBe("<p>new</p>");

    nock(BASE).patch(`${collection}c1/`, { is_resolved: true }).reply(200, { id: "c1", is_resolved: true });
    const updated = await make().update(RELEASE, "c1", { is_resolved: true });
    expect(updated.is_resolved).toBe(true);

    nock(BASE).delete(`${collection}c1/`).reply(204);
    await expect(make().delete(RELEASE, "c1")).resolves.toBeUndefined();
  });

  it("has no upsert/bulk methods (not in the golden for this operation)", () => {
    const comments = make() as unknown as Record<string, unknown>;
    expect(comments.upsert).toBeUndefined();
    expect(comments.bulkCreate).toBeUndefined();
  });

  it("filters by is_resolved/parent_id", async () => {
    const scoped = nock(BASE)
      .get(collection)
      .query({ is_resolved: "true", parent_id: "p1" })
      .reply(200, { data: [], pagination: { style: "offset" } });
    await make().list(RELEASE, { is_resolved: true, parent_id: "p1" });
    expect(scoped.isDone()).toBe(true);
  });
});

describe("Releases.links (v2)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/releases/${RELEASE}/links/`;
  const make = () => new Links(makeTransport(), scope);

  it("creates, retrieves, updates, deletes a link", async () => {
    const write = { url: "https://example.com/notes", title: "Notes" };
    nock(BASE)
      .post(collection, write)
      .reply(201, { id: "l1", ...write });
    nock(BASE)
      .get(`${collection}l1/`)
      .reply(200, { id: "l1", ...write });
    nock(BASE)
      .patch(`${collection}l1/`, { title: "Renamed" })
      .reply(200, { id: "l1", url: write.url, title: "Renamed" });
    nock(BASE).delete(`${collection}l1/`).reply(204);

    const links = make();
    const created = await links.create(RELEASE, write);
    expect(created.id).toBe("l1");
    const fetched = await links.retrieve(RELEASE, "l1");
    expect(fetched.url).toBe(write.url);
    const updated = await links.update(RELEASE, "l1", { title: "Renamed" });
    expect(updated.title).toBe("Renamed");
    await expect(links.delete(RELEASE, "l1")).resolves.toBeUndefined();
  });

  it("rejects an unknown order_by", async () => {
    await expect(make().list(RELEASE, { order_by: "bogus" as never })).rejects.toThrow(
      /Unknown order_by 'bogus' for release_links_list/
    );
  });
});

describe("Releases.changelog (v2, singleton)", () => {
  const url = `/api/v2/workspaces/${SLUG}/releases/${RELEASE}/changelog/`;
  const make = () => new Changelog(makeTransport(), scope);

  it("retrieves (auto-created empty) and updates the changelog", async () => {
    nock(BASE).get(url).reply(200, { id: "chg-1", release_id: RELEASE, description_html: null });
    const fetched = await make().retrieve(RELEASE);
    expect(fetched.id).toBe("chg-1");

    nock(BASE)
      .patch(url, { description_html: "<p>Fixed things.</p>" })
      .reply(200, { id: "chg-1", description_html: "<p>Fixed things.</p>" });
    const updated = await make().update(RELEASE, { description_html: "<p>Fixed things.</p>" });
    expect(updated.description_html).toBe("<p>Fixed things.</p>");
  });

  it("has no list/create/delete (singleton, not a collection)", () => {
    const changelog = make() as unknown as Record<string, unknown>;
    expect(changelog.list).toBeUndefined();
    expect(changelog.create).toBeUndefined();
    expect(changelog.delete).toBeUndefined();
  });
});

describe("ReleaseLabels (v2, workspace-level definitions)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/releases/labels/`;
  const make = () => new ReleaseLabels(makeTransport(), scope);

  it("lists, creates, retrieves, updates, deletes a label definition", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, { data: [{ id: "lbl-1", name: "hotfix" }], pagination: { style: "offset" } });
    const page = await make().list();
    expect(page.data[0].name).toBe("hotfix");

    const write = { name: "hotfix", color: "#f00" };
    nock(BASE)
      .post(collection, write)
      .reply(201, { id: "lbl-1", ...write });
    const created = await make().create(write);
    expect(created.id).toBe("lbl-1");

    nock(BASE)
      .get(`${collection}lbl-1/`)
      .reply(200, { id: "lbl-1", ...write });
    const fetched = await make().retrieve("lbl-1");
    expect(fetched.color).toBe("#f00");

    nock(BASE).patch(`${collection}lbl-1/`, { sort_order: 2 }).reply(200, { id: "lbl-1", sort_order: 2 });
    const updated = await make().update("lbl-1", { sort_order: 2 });
    expect(updated.sort_order).toBe(2);

    nock(BASE).delete(`${collection}lbl-1/`).reply(204);
    await expect(make().delete("lbl-1")).resolves.toBeUndefined();
  });

  it("filters by name", async () => {
    const scoped = nock(BASE)
      .get(collection)
      .query({ name: "hotfix" })
      .reply(200, { data: [], pagination: { style: "offset" } });
    await make().list({ name: "hotfix" });
    expect(scoped.isDone()).toBe(true);
  });

  it("finds by name", async () => {
    const scoped = nock(BASE)
      .get(collection)
      .query({ name: "hotfix", per_page: "2", count: "false" })
      .reply(200, { data: [{ id: "lbl-1", name: "hotfix" }], pagination: { style: "offset" } });

    expect((await make().findByName("hotfix")).id).toBe("lbl-1");
    expect(scoped.isDone()).toBe(true);
  });
});

describe("ReleaseTags (v2, workspace-level definitions)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/releases/tags/`;
  const make = () => new ReleaseTags(makeTransport(), scope);

  it("lists, creates, retrieves, updates, deletes a tag definition", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, { data: [{ id: "tag-1", version: "1.0.0" }], pagination: { style: "offset" } });
    const page = await make().list();
    expect(page.data[0].version).toBe("1.0.0");

    const write = { version: "1.0.0", git_tag: "v1.0.0" };
    nock(BASE)
      .post(collection, write)
      .reply(201, { id: "tag-1", ...write });
    const created = await make().create(write);
    expect(created.id).toBe("tag-1");

    nock(BASE)
      .get(`${collection}tag-1/`)
      .reply(200, { id: "tag-1", ...write });
    const fetched = await make().retrieve("tag-1");
    expect(fetched.git_tag).toBe("v1.0.0");

    nock(BASE)
      .patch(`${collection}tag-1/`, { description: "First stable." })
      .reply(200, { id: "tag-1", description: "First stable." });
    const updated = await make().update("tag-1", { description: "First stable." });
    expect(updated.description).toBe("First stable.");

    nock(BASE).delete(`${collection}tag-1/`).reply(204);
    await expect(make().delete("tag-1")).resolves.toBeUndefined();
  });

  it("rejects an unknown field", async () => {
    await expect(make().list({ fields: ["bogus" as never] })).rejects.toThrow(
      /Unknown field\(s\) for release_tags_list: bogus/
    );
  });

  it("finds by version", async () => {
    const scoped = nock(BASE)
      .get(collection)
      .query({ version: "1.0.0", per_page: "2", count: "false" })
      .reply(200, { data: [{ id: "tag-1", version: "1.0.0" }], pagination: { style: "offset" } });

    expect((await make().findByVersion("1.0.0")).id).toBe("tag-1");
    expect(scoped.isDone()).toBe(true);
  });
});
