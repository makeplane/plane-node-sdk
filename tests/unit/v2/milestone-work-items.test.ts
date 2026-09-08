/**
 * Work-item membership of a milestone lives on `Milestones.workItems`, a
 * `MilestoneWorkItems` bridge sub-resource — not a `manageWorkItems` method folded
 * onto `Milestones` itself.
 */
import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Milestones } from "../../../src/api/v2/Milestones";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";

const makeMilestones = () => new Milestones(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("Milestones.workItems (v2)", () => {
  it("posts { add } to the work-items/ route and resolves to the added ids", async () => {
    let capturedBody: unknown;
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/milestones/ms-1/work-items/", (body: unknown) => {
        capturedBody = body;
        return true;
      })
      .reply(200, { added: ["wi-1", "wi-2"] });

    const result = await makeMilestones().workItems.add("acme", "ENG", "ms-1", ["wi-1", "wi-2"]);

    expect(scope.isDone()).toBe(true);
    // Assert the fully parsed body, not a substring — see bulk.test.ts's own rationale
    // for why a leaked extra key or a dropped field must fail this, not silently pass.
    expect(capturedBody).toEqual({ add: ["wi-1", "wi-2"] });
    expect(result).toEqual(["wi-1", "wi-2"]);
  });

  it("posts { remove } (no add key) and resolves to the removed ids", async () => {
    let capturedBody: unknown;
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/milestones/ms-1/work-items/", (body: unknown) => {
        capturedBody = body;
        return true;
      })
      .reply(200, { removed: ["wi-3"] });

    const result = await makeMilestones().workItems.remove("acme", "ENG", "ms-1", ["wi-3"]);

    expect(scope.isDone()).toBe(true);
    expect(capturedBody).toEqual({ remove: ["wi-3"] });
    expect(result).toEqual(["wi-3"]);
  });

  it("percent-encodes the milestone id in the URL", async () => {
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/milestones/ms%2Fslash/work-items/")
      .reply(200, { added: ["wi-1"] });

    await makeMilestones().workItems.add("acme", "ENG", "ms/slash", ["wi-1"]);

    expect(scope.isDone()).toBe(true);
  });

  it("omits idempotent no-ops from the response rather than echoing every requested id back", async () => {
    nock(BASE).post("/api/v2/workspaces/acme/projects/ENG/milestones/ms-1/work-items/").reply(200, { added: [] });

    const result = await makeMilestones().workItems.add("acme", "ENG", "ms-1", ["already-there"]);

    expect(result).toEqual([]);
  });
});
