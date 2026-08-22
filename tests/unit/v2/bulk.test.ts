import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { bulkFailures, isBulkFailure, raiseForFailures } from "../../../src/api/v2/kernel/bulk";
import { OperationId, V2Resource } from "../../../src/api/v2/kernel/resource";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";

interface Row {
  id: string;
}

class Rows extends V2Resource<Row, { name: string }, { name?: string }> {
  protected path = "/workspaces/{slug}/projects/{project_id}/states/";
  protected operations: Record<string, OperationId> = {
    list: "states_list",
    retrieve: "states_retrieve",
    create: "states_create",
    update: "states_partial_update",
    upsert: "states_upsert",
  };

  upsert = (slug: string, projectId: string, data: { name: string }) =>
    this.doUpsert(data, { slug, project_id: projectId });
  bulkCreate = (slug: string, projectId: string, items: { name: string }[], allOrNone = false) =>
    this.doBulkCreate(items, { slug, project_id: projectId }, allOrNone);
  bulkUpdate = (slug: string, projectId: string, items: { id: string; name?: string }[], allOrNone = false) =>
    this.doBulkUpdate(items, { slug, project_id: projectId }, allOrNone);
  bulkDelete = (slug: string, projectId: string, ids: string[], allOrNone = false) =>
    this.doBulkDelete(ids, { slug, project_id: projectId }, allOrNone);
}

const makeRows = () => new Rows(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("bulk actions", () => {
  it("upserts against the upsert/ route", async () => {
    nock(BASE).post("/api/v2/workspaces/acme/projects/ENG/states/upsert/").reply(200, { id: "1" });

    expect((await makeRows().upsert("acme", "ENG", { name: "Todo" })).id).toBe("1");
  });

  it("posts an items envelope to bulk-create/", async () => {
    let capturedBody: unknown;
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/states/bulk-create/", (body: unknown) => {
        capturedBody = body;
        return true;
      })
      .reply(200, { results: [{ index: 0, result: "created", id: "1" }], succeeded: 1, failed: 0 });

    const result = await makeRows().bulkCreate("acme", "ENG", [{ name: "Todo" }]);

    expect(scope.isDone()).toBe(true);
    // Assert the fully parsed request body, not a substring: a leaked extra key, a
    // missing all_or_none default, or a serialization regression would slip past a
    // substring check.
    expect(capturedBody).toEqual({ items: [{ name: "Todo" }], all_or_none: false });
    expect(result.succeeded).toBe(1);
  });

  it("posts an ids envelope to bulk-delete/", async () => {
    let capturedBody: unknown;
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/states/bulk-delete/", (body: unknown) => {
        capturedBody = body;
        return true;
      })
      .reply(200, { results: [{ index: 0, result: "deleted", id: "1" }], succeeded: 1, failed: 0 });

    await makeRows().bulkDelete("acme", "ENG", ["1"], true);

    expect(scope.isDone()).toBe(true);
    expect(capturedBody).toEqual({ ids: ["1"], all_or_none: true });
  });

  it("posts an id-carrying items envelope to bulk-update/", async () => {
    let capturedBody: unknown;
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/states/bulk-update/", (body: unknown) => {
        capturedBody = body;
        return true;
      })
      .reply(200, { results: [{ index: 0, result: "updated", id: "1" }], succeeded: 1, failed: 0 });

    const result = await makeRows().bulkUpdate("acme", "ENG", [{ id: "1", name: "Done" }], true);

    expect(scope.isDone()).toBe(true);
    expect(capturedBody).toEqual({ items: [{ id: "1", name: "Done" }], all_or_none: true });
    expect(result.succeeded).toBe(1);
  });

  it("separates failed rows and can raise on them", async () => {
    nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/states/bulk-create/")
      .reply(200, {
        results: [
          { index: 0, result: "created", id: "1" },
          {
            index: 1,
            result: "failed",
            type: "invalid_request",
            code: "invalid_request",
            detail: "One or more fields failed validation.",
            errors: [{ field: "name", message: "This field is required." }],
          },
        ],
        succeeded: 1,
        failed: 1,
      });

    const result = await makeRows().bulkCreate("acme", "ENG", [{ name: "Todo" }, { name: "x" }]);

    expect(isBulkFailure(result.results[1])).toBe(true);
    expect(bulkFailures(result)[0].errors?.[0].field).toBe("name");
    expect(() => raiseForFailures(result)).toThrow(/1 of 2 rows failed/);
  });

  it("enforces the batch cap client side", async () => {
    const ids = Array.from({ length: 51 }, (_value, index) => String(index));

    await expect(makeRows().bulkDelete("acme", "ENG", ids)).rejects.toThrow(/At most 50/);
  });

  // Empty batch is rejected client-side (the API's BulkWriteMixin rejects it too),
  // so messages below are asserted verbatim against the live API's exact wording.
  it("rejects an empty bulk-create batch before making any request", async () => {
    // No nock interceptor is registered for bulk-create/: if the implementation
    // posted anyway, nock would throw its own "No match for request" error, which
    // would also fail this test — the absence of a mock is itself a guard.
    await expect(makeRows().bulkCreate("acme", "ENG", [])).rejects.toThrow("Provide a non-empty list of write bodies.");
  });

  it("rejects an empty bulk-update batch before making any request", async () => {
    await expect(makeRows().bulkUpdate("acme", "ENG", [])).rejects.toThrow(
      "Provide a non-empty list of write bodies, each with an id."
    );
  });

  it("rejects an empty bulk-delete batch before making any request", async () => {
    await expect(makeRows().bulkDelete("acme", "ENG", [])).rejects.toThrow("Provide a non-empty list of ids.");
  });

  it("gives the empty-batch and over-cap errors distinct messages", async () => {
    const over = Array.from({ length: 51 }, (_value, index) => String(index));

    await expect(makeRows().bulkDelete("acme", "ENG", [])).rejects.not.toThrow(/At most/);
    await expect(makeRows().bulkDelete("acme", "ENG", over)).rejects.not.toThrow(/non-empty/);
  });
});
