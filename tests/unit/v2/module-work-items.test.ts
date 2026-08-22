/**
 * `manageWorkItems` is folded directly onto `Modules`, not a standalone resource.
 */
import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Modules } from "../../../src/api/v2/Modules";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";

const makeManager = () =>
  new Modules(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })), {
    slug: "acme",
    project_id: "ENG",
  });

afterEach(() => nock.cleanAll());

describe("Modules.manageWorkItems (v2)", () => {
  it("posts the add/remove body to the work-items/ action route and returns what actually changed", async () => {
    let capturedBody: unknown;
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/modules/mod-1/work-items/", (body: unknown) => {
        capturedBody = body;
        return true;
      })
      .reply(200, { added: ["wi-1"], removed: [] });

    const result = await makeManager().manageWorkItems("mod-1", { add: ["wi-1"] });

    expect(scope.isDone()).toBe(true);
    expect(capturedBody).toEqual({ add: ["wi-1"] });
    expect(result).toEqual({ added: ["wi-1"], removed: [] });
  });

  it("percent-encodes the module id in the URL", async () => {
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/modules/mod%2Fslash/work-items/")
      .reply(200, { added: [], removed: [] });

    await makeManager().manageWorkItems("mod/slash", { remove: [] });

    expect(scope.isDone()).toBe(true);
  });

  it("removes work items independently of add, in the same call", async () => {
    let capturedBody: unknown;
    nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/modules/mod-1/work-items/", (body: unknown) => {
        capturedBody = body;
        return true;
      })
      .reply(200, { added: [], removed: ["wi-9"] });

    const result = await makeManager().manageWorkItems("mod-1", { remove: ["wi-9"] });

    expect(capturedBody).toEqual({ remove: ["wi-9"] });
    expect(result.removed).toEqual(["wi-9"]);
  });
});
