import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { OperationId, V2Resource } from "../../../src/api/v2/kernel/resource";
import { V2Transport } from "../../../src/api/v2/kernel/transport";
import { MultipleMatchesFoundError, NoMatchFoundError } from "../../../src/errors/PlaneApiError";

const BASE = "https://api.example.com";

interface Row {
  id: string;
  name?: string;
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

  findByName = (slug: string, projectId: string, name: string) =>
    this.doFindOne({ name }, { slug, project_id: projectId });
}

const makeRows = () => new Rows(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("doFindOne", () => {
  it("returns the single match, asking for exactly two rows", async () => {
    // The per_page=2 / count=false pair IS the mechanism: it distinguishes "the one"
    // from "ambiguous" in a single request. Match on it so a change to per_page fails.
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/states/")
      .query({ name: "Todo", per_page: "2", count: "false" })
      .reply(200, { data: [{ id: "1", name: "Todo" }], pagination: { style: "offset" } });

    expect((await makeRows().findByName("acme", "ENG", "Todo")).id).toBe("1");
    expect(scope.isDone()).toBe(true);
  });

  it("throws when nothing matches", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/states/")
      .query(true)
      .reply(200, { data: [], pagination: { style: "offset" } });

    await expect(makeRows().findByName("acme", "ENG", "Nope")).rejects.toBeInstanceOf(NoMatchFoundError);
  });

  it("throws when several match", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/states/")
      .query(true)
      .reply(200, {
        data: [
          { id: "1", name: "Todo" },
          { id: "2", name: "todo" },
        ],
        pagination: { style: "offset" },
      });

    const promise = makeRows().findByName("acme", "ENG", "Todo");
    await expect(promise).rejects.toBeInstanceOf(MultipleMatchesFoundError);
    await expect(promise).rejects.toThrow(/Multiple rows matched/);
  });
});
