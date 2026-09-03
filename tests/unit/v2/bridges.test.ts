/**
 * The `add`/`remove` guard shared by every membership bridge lives once in
 * `V2Resource.doBridgeAt` (`src/api/v2/kernel/resource.ts`) — exercised here through
 * `Cycles.workItems`, a representative bridge, rather than repeated per bridge class.
 *
 * Per-bridge URL+body coverage for Initiatives.projects, Releases.labels,
 * Initiatives.labels, and Collections.members (add with `{ member_id, access }` /
 * remove with user ids) already lives in initiatives.test.ts, releases.test.ts, and
 * collections.test.ts alongside those resources' other tests — not duplicated here.
 */
import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Cycles } from "../../../src/api/v2/Cycles";
import { BRIDGE_MAX_IDS } from "../../../src/api/v2/kernel/resource";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";

const makeCycles = () =>
  new Cycles(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })), {
    slug: "acme",
    project_id: "ENG",
  });

afterEach(() => nock.cleanAll());

describe("membership bridge guard (v2, via Cycles.workItems)", () => {
  it("rejects 0 ids with a RangeError before making any request", async () => {
    await expect(makeCycles().workItems.add("cyc-1", [])).rejects.toBeInstanceOf(RangeError);
    // No interceptor was registered at all — if a request had gone out, nock would
    // throw "No match for request" and this would fail as an unhandled rejection.
  });

  it(`rejects more than ${BRIDGE_MAX_IDS} ids with a RangeError before making any request`, async () => {
    const tooMany = Array.from({ length: BRIDGE_MAX_IDS + 1 }, (_, i) => `wi-${i}`);
    await expect(makeCycles().workItems.add("cyc-1", tooMany)).rejects.toBeInstanceOf(RangeError);
  });

  it(`allows exactly ${BRIDGE_MAX_IDS} ids`, async () => {
    const exactlyMax = Array.from({ length: BRIDGE_MAX_IDS }, (_, i) => `wi-${i}`);
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/cycles/cyc-1/work-items/", { add: exactlyMax })
      .reply(200, { added: exactlyMax });

    const result = await makeCycles().workItems.add("cyc-1", exactlyMax);

    expect(scope.isDone()).toBe(true);
    expect(result).toHaveLength(BRIDGE_MAX_IDS);
  });

  it("rejects a non-array with a TypeError before making any request", async () => {
    await expect(makeCycles().workItems.add("cyc-1", "x" as never)).rejects.toBeInstanceOf(TypeError);
  });

  it("resolves to [] when the response omits added/removed", async () => {
    nock(BASE).post("/api/v2/workspaces/acme/projects/ENG/cycles/cyc-1/work-items/").reply(200, {});

    const added = await makeCycles().workItems.add("cyc-1", ["wi-1"]);
    expect(added).toEqual([]);

    nock(BASE).post("/api/v2/workspaces/acme/projects/ENG/cycles/cyc-1/work-items/").reply(200, {});
    const removed = await makeCycles().workItems.remove("cyc-1", ["wi-1"]);
    expect(removed).toEqual([]);
  });
});
