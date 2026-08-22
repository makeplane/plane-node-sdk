import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Assets } from "../../../src/api/v2/Assets";
import { UserAssets } from "../../../src/api/v2/UserAssets";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const SLUG = "acme";

const makeTransport = () => new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" }));
const makeAssets = () => new Assets(makeTransport(), { slug: SLUG });
const makeUserAssets = () => new UserAssets(makeTransport());

afterEach(() => nock.cleanAll());

describe("Assets (v2, workspace-scoped)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/assets/`;

  it("lists assets and rejects an unknown field before making the request", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, { data: [{ id: "a1", name: "logo.png", is_uploaded: true }], pagination: { style: "offset" } });
    const page = await makeAssets().list();
    expect(page.data[0].name).toBe("logo.png");

    await expect(makeAssets().list({ fields: ["nope" as never] })).rejects.toThrow(/nope/);
  });

  it("is a two-step upload: create returns credentials, update (empty body) confirms", async () => {
    const createBody = { name: "logo.png", size: 2048 };
    nock(BASE)
      .post(collection, createBody)
      .reply(201, { id: "a1", name: "logo.png", is_uploaded: false, asset_url: "https://upload.example.com/a1" });
    // The confirm PATCH sends no body at all — assert the exact empty object, not `.query(true)`-style laxity,
    // so a regression that starts sending `{ is_uploaded: true }` (copying the WorkItemAttachment shape) would fail here.
    nock(BASE).patch(`${collection}a1/`, {}).reply(200, { id: "a1", is_uploaded: true });
    nock(BASE).delete(`${collection}a1/`).reply(204);

    const assets = makeAssets();
    const created = await assets.create(createBody);
    expect(created.is_uploaded).toBe(false);
    expect(created.asset_url).toBeTruthy();

    const confirmed = await assets.update("a1");
    expect(confirmed.is_uploaded).toBe(true);

    await expect(assets.delete("a1")).resolves.toBeUndefined();
  });

  it("retrieves one asset", async () => {
    nock(BASE).get(`${collection}a1/`).reply(200, { id: "a1", name: "logo.png" });
    expect((await makeAssets().retrieve("a1")).name).toBe("logo.png");
  });

  it("rejects an unknown order_by before making the request", async () => {
    await expect(makeAssets().list({ order_by: "name" as never })).rejects.toThrow(
      /Unknown order_by 'name' for assets_list/
    );
  });
});

describe("UserAssets (v2, not workspace-scoped)", () => {
  const collection = "/api/v2/users/me/assets/";

  it("lists user assets with no workspace slug in the path", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, { data: [{ id: "u1", name: "avatar.png" }], pagination: { style: "offset" } });
    const page = await makeUserAssets().list();
    expect(page.data[0].name).toBe("avatar.png");
  });

  it("is a two-step upload: create returns credentials, update (empty body) confirms", async () => {
    const createBody = { entity_type: "USER_AVATAR" as const, name: "avatar.png", size: 512 };
    nock(BASE).post(collection, createBody).reply(201, { id: "u1", name: "avatar.png", is_uploaded: false });
    nock(BASE).patch(`${collection}u1/`, {}).reply(200, { id: "u1", is_uploaded: true });
    nock(BASE).delete(`${collection}u1/`).reply(204);

    const userAssets = makeUserAssets();
    const created = await userAssets.create(createBody);
    expect(created.is_uploaded).toBe(false);

    const confirmed = await userAssets.update("u1");
    expect(confirmed.is_uploaded).toBe(true);

    await expect(userAssets.delete("u1")).resolves.toBeUndefined();
  });

  it("retrieves one user asset", async () => {
    nock(BASE).get(`${collection}u1/`).reply(200, { id: "u1" });
    expect((await makeUserAssets().retrieve("u1")).id).toBe("u1");
  });

  it("rejects an unknown field on retrieve before making the request", async () => {
    await expect(makeUserAssets().retrieve("u1", { fields: ["nope" as never] })).rejects.toThrow(/nope/);
  });
});
