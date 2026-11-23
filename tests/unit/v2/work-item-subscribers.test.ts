/**
 * Subscribers is a singleton list on a work item: GET reads it, PATCH `{add, remove}` answers the new list.
 */
import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Subscribers } from "../../../src/api/v2/WorkItems";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const SLUG = "acme";
const PROJECT = "ENG";
const WORK_ITEM = "wi-1";

const makeTransport = () => new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" }));

afterEach(() => nock.cleanAll());

describe("WorkItems.subscribers (v2)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/projects/${PROJECT}/work-items/${WORK_ITEM}/subscribers/`;
  const make = () => new Subscribers(makeTransport());

  it("retrieves the list, with no pk segment", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, { subscriber_ids: ["u1", "u2"] });

    expect(await make().retrieve(SLUG, PROJECT, WORK_ITEM)).toEqual({ subscriber_ids: ["u1", "u2"] });
  });

  it("updates with add/remove and answers the resulting list", async () => {
    const body = { add: ["u3"], remove: ["u1"] };
    const scope = nock(BASE)
      .patch(collection, body)
      .reply(200, { subscriber_ids: ["u2", "u3"] });

    const result = await make().update(SLUG, PROJECT, WORK_ITEM, body);

    expect(result.subscriber_ids).toEqual(["u2", "u3"]);
    expect(scope.isDone()).toBe(true);
  });
});
