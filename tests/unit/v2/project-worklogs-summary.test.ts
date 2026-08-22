import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { ProjectWorklogs } from "../../../src/api/v2/ProjectWorklogs";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";

const makeSummary = () =>
  new ProjectWorklogs(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })), {
    slug: "acme",
    project_id: "ENG",
  });

afterEach(() => nock.cleanAll());

describe("ProjectWorklogs.summary (v2)", () => {
  it("returns a bare array, not a Page envelope", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/worklogs/summary/")
      .reply(200, [
        { work_item_id: "wi-1", duration: 90 },
        { work_item_id: "wi-2", duration: 15 },
      ]);

    const summary = await makeSummary().summary();

    expect(Array.isArray(summary)).toBe(true);
    expect(summary).toEqual([
      { work_item_id: "wi-1", duration: 90 },
      { work_item_id: "wi-2", duration: 15 },
    ]);
  });

  it("returns an empty array rather than throwing when there's no logged time", async () => {
    nock(BASE).get("/api/v2/workspaces/acme/projects/ENG/worklogs/summary/").reply(200, []);

    const summary = await makeSummary().summary();

    expect(summary).toEqual([]);
  });
});
