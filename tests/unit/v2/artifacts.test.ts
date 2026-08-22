import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Artifacts } from "../../../src/api/v2/Artifacts";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const SLUG = "acme";

const makeResource = () =>
  new Artifacts(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })), { slug: SLUG });

afterEach(() => nock.cleanAll());

describe("Artifacts (v2)", () => {
  it("creates, returning the summary row (not the full detail)", async () => {
    nock(BASE).post("/api/v2/workspaces/acme/artifacts/", { name: "Report", html: "<p>hi</p>" }).reply(200, {
      id: "1",
      name: "Report",
      anchor: null,
      current_version: 1,
      data_mode: "snapshot",
      is_published: false,
    });

    const created = await makeResource().create({ name: "Report", html: "<p>hi</p>" });

    expect(created.is_published).toBe(false);
    expect((created as unknown as Record<string, unknown>).html).toBeUndefined();
  });

  it("retrieves the full detail, including html", async () => {
    nock(BASE).get("/api/v2/workspaces/acme/artifacts/1/").reply(200, {
      id: "1",
      name: "Report",
      description: "",
      html: "<p>hi</p>",
      current_version: 1,
      data_mode: "snapshot",
    });

    const detail = await makeResource().retrieve("1");

    expect(detail.html).toBe("<p>hi</p>");
  });

  it("publishes with no request body", async () => {
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/artifacts/1/publish/", (body) => Object.keys(body ?? {}).length === 0)
      .reply(200, { anchor: "abc123", is_active: true });

    const published = await makeResource().publish("1");

    expect(scope.isDone()).toBe(true);
    expect(published.anchor).toBe("abc123");
  });

  it("updates via the verb-suffixed PATCH route with a body — not a plain doAction", async () => {
    const scope = nock(BASE)
      .patch("/api/v2/workspaces/acme/artifacts/1/update/", { html: "<p>bye</p>" })
      .reply(200, { id: "1", current_version: 2, data_mode: "snapshot" });

    const updated = await makeResource().update("1", { html: "<p>bye</p>" });

    expect(scope.isDone()).toBe(true);
    expect(updated.current_version).toBe(2);
  });
});
