/**
 * `transfer`/`manageWorkItems` need a JSON body, so both are hand-rolled on `Cycles`, not bodiless `doAction` calls.
 */
import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Cycles } from "../../../src/api/v2/Cycles";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const makeResource = () =>
  new Cycles(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })), {
    slug: "acme",
    project_id: "ENG",
  });

afterEach(() => nock.cleanAll());

describe("Cycles.transfer/manageWorkItems (v2)", () => {
  it("transfers a completed cycle's incomplete work items into another cycle", async () => {
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/cycles/cyc-1/transfer/", { new_cycle_id: "cyc-2" })
      .reply(200, { new_cycle_id: "cyc-2" });

    const result = await makeResource().transfer("cyc-1", { new_cycle_id: "cyc-2" });

    expect(scope.isDone()).toBe(true);
    expect(result.new_cycle_id).toBe("cyc-2");
  });

  it("manages cycle work-item membership with add/remove", async () => {
    const body = { add: ["wi-1", "wi-2"], remove: ["wi-3"] };
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/cycles/cyc-1/work-items/", body)
      .reply(200, { added: ["wi-1", "wi-2"], removed: ["wi-3"] });

    const result = await makeResource().manageWorkItems("cyc-1", body);

    expect(scope.isDone()).toBe(true);
    expect(result.added).toEqual(["wi-1", "wi-2"]);
    expect(result.removed).toEqual(["wi-3"]);
  });

  it("actually sends the body — proof the request isn't a bodiless doAction call", async () => {
    // If `transfer` silently dropped its body (e.g. reverted to a bare `doAction`
    // call), nock would see a request with no `new_cycle_id` and this scope would
    // never match, failing the test on `scope.isDone()`.
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/cycles/cyc-1/transfer/", (body) => body.new_cycle_id === "cyc-2")
      .reply(200, { new_cycle_id: "cyc-2" });

    await makeResource().transfer("cyc-1", { new_cycle_id: "cyc-2" });

    expect(scope.isDone()).toBe(true);
  });
});
