/**
 * `transfer` needs a JSON body, so it goes through `doCustomAction`, not a bodiless
 * `doAction` call. Work-item membership lives on `Cycles.workItems`, a `CycleWorkItems`
 * bridge sub-resource; both take their path ids per call.
 */
import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Cycles } from "../../../src/api/v2/Cycles";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const makeResource = () => new Cycles(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("Cycles.transfer/workItems (v2)", () => {
  it("transfers a completed cycle's incomplete work items into another cycle", async () => {
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/cycles/cyc-1/transfer/", { new_cycle_id: "cyc-2" })
      .reply(200, { new_cycle_id: "cyc-2" });

    const result = await makeResource().transfer("acme", "ENG", "cyc-1", { new_cycle_id: "cyc-2" });

    expect(scope.isDone()).toBe(true);
    expect(result.new_cycle_id).toBe("cyc-2");
  });

  it("adds cycle work items via workItems.add", async () => {
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/cycles/cyc-1/work-items/", { add: ["wi-1", "wi-2"] })
      .reply(200, { added: ["wi-1", "wi-2"] });

    const result = await makeResource().workItems.add("acme", "ENG", "cyc-1", ["wi-1", "wi-2"]);

    expect(scope.isDone()).toBe(true);
    expect(result).toEqual(["wi-1", "wi-2"]);
  });

  it("removes cycle work items via workItems.remove", async () => {
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/cycles/cyc-1/work-items/", { remove: ["wi-3"] })
      .reply(200, { removed: ["wi-3"] });

    const result = await makeResource().workItems.remove("acme", "ENG", "cyc-1", ["wi-3"]);

    expect(scope.isDone()).toBe(true);
    expect(result).toEqual(["wi-3"]);
  });

  it("actually sends the body — proof the request isn't a bodiless doAction call", async () => {
    // If `transfer` silently dropped its body (e.g. reverted to a bare `doAction`
    // call), nock would see a request with no `new_cycle_id` and this scope would
    // never match, failing the test on `scope.isDone()`.
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/cycles/cyc-1/transfer/", (body) => body.new_cycle_id === "cyc-2")
      .reply(200, { new_cycle_id: "cyc-2" });

    await makeResource().transfer("acme", "ENG", "cyc-1", { new_cycle_id: "cyc-2" });

    expect(scope.isDone()).toBe(true);
  });
});
