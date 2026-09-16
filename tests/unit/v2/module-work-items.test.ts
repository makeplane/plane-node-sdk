/**
 * Work-item membership of a module lives on `Modules.workItems`, a `ModuleWorkItems`
 * bridge sub-resource — not a `manageWorkItems` method folded onto `Modules` itself.
 */
import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Modules } from "../../../src/api/v2/Modules";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";

const makeModules = () => new Modules(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("Modules.workItems (v2)", () => {
  it("posts { add } to the work-items/ route and resolves to the added ids", async () => {
    let capturedBody: unknown;
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/modules/mod-1/work-items/", (body: unknown) => {
        capturedBody = body;
        return true;
      })
      .reply(200, { added: ["wi-1"] });

    const result = await makeModules().workItems.add("acme", "ENG", "mod-1", ["wi-1"]);

    expect(scope.isDone()).toBe(true);
    expect(capturedBody).toEqual({ add: ["wi-1"] });
    expect(result).toEqual(["wi-1"]);
  });

  it("percent-encodes the module id in the URL", async () => {
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/modules/mod%2Fslash/work-items/")
      .reply(200, { added: ["wi-1"] });

    await makeModules().workItems.add("acme", "ENG", "mod/slash", ["wi-1"]);

    expect(scope.isDone()).toBe(true);
  });

  it("posts { remove } (no add key) and resolves to the removed ids", async () => {
    let capturedBody: unknown;
    nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/modules/mod-1/work-items/", (body: unknown) => {
        capturedBody = body;
        return true;
      })
      .reply(200, { removed: ["wi-9"] });

    const result = await makeModules().workItems.remove("acme", "ENG", "mod-1", ["wi-9"]);

    expect(capturedBody).toEqual({ remove: ["wi-9"] });
    expect(result).toEqual(["wi-9"]);
  });

  it("resolves to [] when the response omits added/removed", async () => {
    nock(BASE).post("/api/v2/workspaces/acme/projects/ENG/modules/mod-1/work-items/").reply(200, {});

    const result = await makeModules().workItems.add("acme", "ENG", "mod-1", ["wi-1"]);

    expect(result).toEqual([]);
  });
});
