import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { States } from "../../../src/api/v2/States";
import { V2Transport } from "../../../src/api/v2/kernel/transport";
import { classMethods, migratedEntries, narrowsToRequestedFields } from "./tree-walk";

const BASE = "https://api.example.com";

const makeStates = () => new States(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("typed field projection", () => {
  it("narrows the row type to the requested fields", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/states/")
      .query({ fields: "id,name" })
      .reply(200, { data: [{ id: "1", name: "Todo" }], pagination: { style: "offset" } });

    const page = await makeStates().list("acme", "ENG", { fields: ["id", "name"] as const });
    const row = page.data[0];

    expect(row.name).toBe("Todo");
    // @ts-expect-error `group` was not requested, so it is not on the narrowed type
    expect(row.group).toBeUndefined();
  });

  it("returns the full row when fields is omitted", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/states/")
      .reply(200, { data: [{ id: "1", group: "unstarted" }], pagination: { style: "offset" } });

    const page = await makeStates().list("acme", "ENG");

    expect(page.data[0].group).toBe("unstarted");
  });

  it("narrows an iterated row wherever the listed row narrows", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/states/")
      .query({ fields: "id,name" })
      .reply(200, { data: [{ id: "1", name: "Todo" }], pagination: { style: "offset" }, next: null });

    for await (const row of makeStates().iterate("acme", "ENG", { fields: ["id", "name"] as const })) {
      expect(row.name).toBe("Todo");
      // @ts-expect-error `group` was not requested, so it is not on the narrowed type either
      expect(row.group).toBeUndefined();
    }
  });
});

/**
 * `list` and `iterate` are the same operation — `ACTION_ALIASES` maps one onto the other,
 * and `iterate` is `list` with the paging done for you. So they must make the same promise
 * about the row.
 *
 * They did not. `list` declared a narrowing overload and `iterate` took the very same
 * `ListXParams`, `fields` and all, while declaring `AsyncGenerator<FullRow>` — claiming
 * presence for every field the server had just been asked to drop. That is the same
 * unsoundness that was used to reject matching the overload set in `Owned<…>` (see
 * `kernel/loaded.ts`), sitting unexamined in the exemplars and copied into every class that
 * followed them.
 *
 * Asserting the correspondence beats fixing the copies one by one: the rule holds for the
 * classes task 3 has yet to migrate without anybody having to remember it, and it needs no
 * exception list, because it never asks a class to narrow — only to be consistent with
 * itself.
 */
describe("projection soundness", () => {
  const WITH_BOTH = migratedEntries().filter((entry) => {
    const methods = classMethods(entry);
    return methods.has("list") && methods.has("iterate");
  });

  it("finds classes declaring both `list` and `iterate` at all", () => {
    // A floor, not a pin: a broken enumeration would make the assertion below vacuous.
    expect(WITH_BOTH.length).toBeGreaterThanOrEqual(25);
  });

  it("makes `iterate` narrow exactly where `list` narrows", () => {
    const offenders = WITH_BOTH.map((entry) => {
      const methods = classMethods(entry);
      const list = narrowsToRequestedFields(methods.get("list")!);
      const iterate = narrowsToRequestedFields(methods.get("iterate")!);
      if (list === iterate) return undefined;
      return list
        ? `${entry.key}: list() narrows to the requested fields but iterate() answers the full row`
        : `${entry.key}: iterate() narrows to the requested fields but list() answers the full row`;
    }).filter((offender): offender is string => offender !== undefined);

    expect(offenders.sort()).toEqual([]);
  });
});
