import nock from "nock";
import { PlaneClient } from "../../src/client/plane-client";
import { HttpError } from "../../src/errors";

const BASE = "https://plane.test";
const SLUG = "acme";
const ASSET_ID = "0b1f6d1e-6f0e-4f0a-9d63-2f3c1f6f2a11";
const ROUTE = `/api/v1/workspaces/${SLUG}/assets/${ASSET_ID}/`;

describe("Workspace.getAsset (offline)", () => {
  const client = new PlaneClient({ baseUrl: BASE, apiKey: "test-key" });

  afterEach(() => nock.cleanAll());

  it("returns the download details", async () => {
    const body = {
      asset_id: ASSET_ID,
      asset_url: "https://bucket.s3.example/signed?X-Amz-Signature=abc",
      asset_name: "screenshot.png",
      asset_type: "image/png",
    };
    nock(BASE).get(ROUTE).reply(200, body);

    const asset = await client.workspace.getAsset(SLUG, ASSET_ID);

    expect(asset).toEqual(body);
  });

  it("hits the workspace asset detail route with the API key header", async () => {
    const scope = nock(BASE, { reqheaders: { "x-api-key": "test-key" } })
      .get(ROUTE)
      .reply(200, { asset_id: ASSET_ID, asset_url: "https://signed.example/x" });

    await client.workspace.getAsset(SLUG, ASSET_ID);

    expect(scope.isDone()).toBe(true);
  });

  it("tolerates a null url", async () => {
    nock(BASE).get(ROUTE).reply(200, { asset_id: ASSET_ID, asset_url: null });

    const asset = await client.workspace.getAsset(SLUG, ASSET_ID);

    expect(asset.asset_url).toBeNull();
  });

  it("leaves optional fields undefined when the server omits them", async () => {
    nock(BASE).get(ROUTE).reply(200, { asset_id: ASSET_ID, asset_url: "https://signed.example/x" });

    const asset = await client.workspace.getAsset(SLUG, ASSET_ID);

    expect(asset.asset_name).toBeUndefined();
    expect(asset.asset_type).toBeUndefined();
  });

  it.each([
    [400, "Asset not yet uploaded"],
    [404, "Asset not found"],
  ])("raises HttpError for a %i response", async (status, error) => {
    nock(BASE).get(ROUTE).reply(status, { error });

    const failure = await client.workspace.getAsset(SLUG, ASSET_ID).catch((e: unknown) => e);

    expect(failure).toBeInstanceOf(HttpError);
    expect((failure as HttpError).statusCode).toBe(status);
  });
});
