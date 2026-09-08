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

  it("narrows a written row too — `create` honours the `fields` it accepts", async () => {
    nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/states/")
      .query({ fields: "id,name" })
      .reply(201, { id: "1", name: "Todo" });

    const row = await makeStates().create(
      "acme",
      "ENG",
      { name: "Todo", color: "#000000" },
      { fields: ["id", "name"] as const }
    );

    expect(row.name).toBe("Todo");
    // @ts-expect-error `group` was not requested, so the created row does not claim it either.
    // Before the write-projection codemod this directive was *unused*: `create` answered the
    // full `State` while asking the server to drop everything but two fields.
    expect(row.group).toBeUndefined();
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

/**
 * The same question, asked of every method that takes `fields` rather than only of the
 * `list`/`iterate` pair.
 *
 * `create`, `update` and `upsert` accepted `fields`, passed it to the server, and declared
 * the **full** row as their return type — so the compiler claimed presence for exactly the
 * fields the caller had just asked the server to drop. It is the identical unsoundness the
 * rule above closed for `iterate`, and the identical unsoundness the long comment on
 * `Owned<…>` cites as the reason not to match the overload set. It sat in the write
 * direction on ~90 classes because the `fields` sweep obliges a method to *offer* the
 * option and nothing obliged it to *honour* it.
 *
 * Stated as one rule over every public method, not as three method names: a method that
 * accepts `fields` promises the caller a projection, and the type has to keep that promise.
 * Written that way it also covers the next method somebody adds — `retrieve`-shaped or
 * not — without anybody remembering this file exists.
 *
 * There is no exception list, and there is deliberately no way to spell one: a method that
 * cannot narrow should not be advertising `fields`. `Webhooks.regenerate` is the precedent
 * — the option came off the method rather than an exemption going in.
 */
describe("projection soundness across every method that takes `fields`", () => {
  const PROJECTING = migratedEntries().flatMap((entry) =>
    [...classMethods(entry).values()]
      .filter((method) => method.optionProperties.has("fields"))
      .map((method) => ({ entry, method }))
  );

  it("finds methods offering `fields` at all", () => {
    // A floor, not a pin: a broken enumeration would make the assertion below vacuous.
    expect(PROJECTING.length).toBeGreaterThanOrEqual(280);
  });

  it("narrows the row type wherever `fields` is accepted", () => {
    const offenders = PROJECTING.filter(({ method }) => !narrowsToRequestedFields(method))
      .map(
        ({ entry, method }) =>
          `${entry.key}.${method.name}() accepts \`fields\` and answers the full row — it claims ` +
          `presence for every field the server was just told to drop`
      )
      .sort();

    expect(offenders).toEqual([]);
  });
});
