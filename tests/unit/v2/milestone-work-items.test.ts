/**
 * `manageWorkItems` is folded directly onto `Milestones`, not a standalone resource.
 */
import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Milestones } from "../../../src/api/v2/Milestones";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";

const makeManager = () =>
  new Milestones(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })), {
    slug: "acme",
    project_id: "ENG",
  });

afterEach(() => nock.cleanAll());

describe("Milestones.manageWorkItems (v2)", () => {
  it("posts the add/remove body to the work-items/ action route and returns what actually changed", async () => {
    let capturedBody: unknown;
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/milestones/ms-1/work-items/", (body: unknown) => {
        capturedBody = body;
        return true;
      })
      .reply(200, { added: ["wi-1", "wi-2"], removed: ["wi-3"] });

    const result = await makeManager().manageWorkItems("ms-1", { add: ["wi-1", "wi-2"], remove: ["wi-3"] });

    expect(scope.isDone()).toBe(true);
    // Assert the fully parsed body, not a substring — see bulk.test.ts's own rationale
    // for why a leaked extra key or a dropped field must fail this, not silently pass.
    expect(capturedBody).toEqual({ add: ["wi-1", "wi-2"], remove: ["wi-3"] });
    expect(result).toEqual({ added: ["wi-1", "wi-2"], removed: ["wi-3"] });
  });

  it("percent-encodes the milestone id in the URL", async () => {
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/milestones/ms%2Fslash/work-items/")
      .reply(200, { added: [], removed: [] });

    await makeManager().manageWorkItems("ms/slash", { add: [] });

    expect(scope.isDone()).toBe(true);
  });

  it("omits idempotent no-ops from the response rather than echoing every requested id back", async () => {
    nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/milestones/ms-1/work-items/")
      .reply(200, { added: [], removed: [] });

    const result = await makeManager().manageWorkItems("ms-1", { add: ["already-there"] });

    expect(result.added).toEqual([]);
  });
});
