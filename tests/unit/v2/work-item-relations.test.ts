/**
 * Relations/Dependencies don't shape like the rest of v2: `list` returns one grouped object, no retrieve/update.
 */
import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Dependencies, Relations } from "../../../src/api/v2/WorkItems";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const SLUG = "acme";
const PROJECT = "ENG";
const WORK_ITEM = "wi-1";

const makeTransport = () => new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" }));

afterEach(() => nock.cleanAll());

describe("WorkItems.relations (v2)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/projects/${PROJECT}/work-items/${WORK_ITEM}/relations/`;
  const make = () => new Relations(makeTransport());

  it("list returns one grouped object, not a page", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, { blocks: ["wi-2"], "blocked by": [] });

    const result = await make().list(SLUG, PROJECT, WORK_ITEM);

    // No `.data`/`.pagination` envelope — this IS the grouped object.
    expect(result).toEqual({ blocks: ["wi-2"], "blocked by": [] });
    expect((result as Record<string, unknown>).data).toBeUndefined();
  });

  it("creates a relation via direction + relation_definition_id", async () => {
    const body = { direction: "blocks", relation_definition_id: "def-1", work_item_ids: ["wi-2"] };
    const scope = nock(BASE)
      .post(collection, body)
      .reply(200, { blocks: ["wi-2"] });

    const result = await make().create(SLUG, PROJECT, WORK_ITEM, body);

    expect(scope.isDone()).toBe(true);
    expect(result).toEqual({ blocks: ["wi-2"] });
  });

  it("deletes by related_work_item_id, not a relation-row id", async () => {
    const scope = nock(BASE).delete(`${collection}wi-2/`).reply(204);

    await expect(make().delete(SLUG, PROJECT, WORK_ITEM, "wi-2")).resolves.toBeUndefined();

    expect(scope.isDone()).toBe(true);
  });

  it("has no retrieve/update methods", () => {
    const relations = make() as unknown as Record<string, unknown>;
    expect(relations.retrieve).toBeUndefined();
    expect(relations.update).toBeUndefined();
  });
});

describe("WorkItems.dependencies (v2)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/projects/${PROJECT}/work-items/${WORK_ITEM}/dependencies/`;
  const make = () => new Dependencies(makeTransport());

  it("list returns one grouped object with the six fixed keys, not a page", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, {
        blocked_by: [],
        blocking: ["wi-2"],
        finish_after: [],
        finish_before: [],
        start_after: [],
        start_before: [],
      });

    const result = await make().list(SLUG, PROJECT, WORK_ITEM);

    expect(result.blocking).toEqual(["wi-2"]);
    expect(result.blocked_by).toEqual([]);
  });

  it("creates a typed dependency", async () => {
    const body = { relation_type: "blocking" as const, work_item_ids: ["wi-2"] };
    const scope = nock(BASE)
      .post(collection, body)
      .reply(200, {
        blocked_by: [],
        blocking: ["wi-2"],
        finish_after: [],
        finish_before: [],
        start_after: [],
        start_before: [],
      });

    await make().create(SLUG, PROJECT, WORK_ITEM, body);

    expect(scope.isDone()).toBe(true);
  });

  it("deletes by related_work_item_id, not a dependency-row id", async () => {
    const scope = nock(BASE).delete(`${collection}wi-2/`).reply(204);

    await expect(make().delete(SLUG, PROJECT, WORK_ITEM, "wi-2")).resolves.toBeUndefined();

    expect(scope.isDone()).toBe(true);
  });
});
