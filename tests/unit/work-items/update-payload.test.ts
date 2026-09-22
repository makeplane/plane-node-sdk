import nock from "nock";
import { PlaneClient } from "../../../src/client/plane-client";
import { UpdateWorkItem } from "../../../src/models/WorkItem";

/**
 * What `workItems.update` puts on the wire. Offline, so it runs without a Plane instance.
 *
 * Plane patches partially, so the payload is the whole contract: a field that is present
 * is written, and a field that is absent is left alone. `null` is how a nullable field is
 * cleared; `undefined` never reaches the wire.
 */
const BASE = "https://plane.example.com";
const URL = "/api/v1/workspaces/ws/projects/p/work-items/w/";

const client = new PlaneClient({ apiKey: "k", baseUrl: BASE });

afterEach(() => nock.cleanAll());

async function sent(data: UpdateWorkItem): Promise<unknown> {
  let body: unknown;
  const scope = nock(BASE)
    .patch(URL, (requestBody) => {
      body = requestBody;
      return true;
    })
    .reply(200, { id: "w" });

  await client.workItems.update("ws", "p", "w", data);

  expect(scope.isDone()).toBe(true);
  return body;
}

describe("Work item update payload", () => {
  it("sends a field set to null as null", async () => {
    expect(await sent({ target_date: null })).toStrictEqual({ target_date: null });
  });

  it("does not send a field left out", async () => {
    expect(await sent({ name: "Renamed" })).toStrictEqual({ name: "Renamed" });
  });

  it("does not send a field set to undefined", async () => {
    expect(await sent({ name: "Renamed", target_date: undefined })).toStrictEqual({ name: "Renamed" });
  });

  it("clears one date and leaves the other alone", async () => {
    expect(await sent({ start_date: "2026-01-01", target_date: null })).toStrictEqual({
      start_date: "2026-01-01",
      target_date: null,
    });
  });

  it("clears parent and estimate_point with null", async () => {
    expect(await sent({ parent: null, estimate_point: null })).toStrictEqual({
      parent: null,
      estimate_point: null,
    });
  });
});
