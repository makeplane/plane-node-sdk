import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { V2Transport } from "../../../src/api/v2/kernel/transport";
import { PlaneApiError } from "../../../src/errors/PlaneApiError";
import { PlaneNetworkError } from "../../../src/errors/PlaneNetworkError";

const BASE = "https://api.example.com";

const makeTransport = () => new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" }));

afterEach(() => nock.cleanAll());

describe("V2Transport", () => {
  it("builds /api/v2 URLs and sends the api key", async () => {
    const scope = nock(BASE, { reqheaders: { "x-api-key": "secret" } })
      .get("/api/v2/workspaces/acme/projects/ENG/states/")
      .reply(200, { data: [], pagination: { style: "offset" } });

    await makeTransport().request("GET", "/workspaces/acme/projects/ENG/states/");

    expect(scope.isDone()).toBe(true);
  });

  it("turns problem+json into PlaneApiError", async () => {
    nock(BASE).get("/api/v2/workspaces/acme/projects/ENG/states/x/").reply(
      404,
      {
        type: "not_found",
        title: "Not found",
        status: 404,
        code: "not_found",
        detail: "No State matches the given query.",
      },
      { "content-type": "application/problem+json" }
    );

    await expect(makeTransport().request("GET", "/workspaces/acme/projects/ENG/states/x/")).rejects.toMatchObject({
      status: 404,
      code: "not_found",
      type: "not_found",
    });
  });

  it("exposes field errors from a validation problem", async () => {
    nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/states/")
      .reply(400, {
        type: "invalid_request",
        title: "Invalid request",
        status: 400,
        code: "invalid_request",
        detail: "One or more fields failed validation.",
        errors: [{ field: "name", message: "This field is required." }],
      });

    try {
      await makeTransport().request("POST", "/workspaces/acme/projects/ENG/states/", { data: {} });
      throw new Error("expected a rejection");
    } catch (error) {
      expect(error).toBeInstanceOf(PlaneApiError);
      expect((error as PlaneApiError).errors?.[0].field).toBe("name");
    }
  });

  it("returns undefined for 204", async () => {
    nock(BASE).delete("/api/v2/workspaces/acme/projects/ENG/states/x/").reply(204);

    await expect(makeTransport().request("DELETE", "/workspaces/acme/projects/ENG/states/x/")).resolves.toBeUndefined();
  });

  it("wraps a connection failure (no HTTP response at all) as PlaneNetworkError, not a fake 500", async () => {
    // Real (unmocked) connection: nock's mock socket errors on a later tick after
    // the `it` callback settles, crashing the process instead of failing the test.
    // Port 1 is unassigned, so the OS refuses the connection immediately.
    const transport = new V2Transport(new Configuration({ baseUrl: "http://127.0.0.1:1", apiKey: "secret" }));

    try {
      await transport.request("GET", "/workspaces/acme/projects/ENG/states/");
      throw new Error("expected a rejection");
    } catch (error) {
      expect(error).toBeInstanceOf(PlaneNetworkError);
      expect(error).not.toBeInstanceOf(PlaneApiError);
      expect((error as PlaneNetworkError).message).toMatch(/ECONNREFUSED/);
      expect((error as PlaneNetworkError).cause).toBeDefined();
    }
  });
});
