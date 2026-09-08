import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { States } from "../../../src/api/v2/States";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

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
});
