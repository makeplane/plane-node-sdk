import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { PermissionSchemeField, PermissionSchemes } from "../../../src/api/v2/PermissionSchemes";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";

const makeSchemes = () =>
  new PermissionSchemes(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("PermissionSchemes (v2)", () => {
  it("lists permission schemes", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/permission-schemes/")
      .reply(200, {
        data: [{ id: "1", name: "Admin", namespace: "workspace", is_system: true }],
        pagination: { style: "offset" },
        total_count: 1,
      });

    const page = await makeSchemes().list("acme");

    expect(page.data[0].namespace).toBe("workspace");
  });

  it("retrieves one scheme by id", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/permission-schemes/1/")
      .reply(200, { id: "1", name: "Admin", permissions: ["project:*"] });

    const scheme = await makeSchemes().retrieve("acme", "1");

    expect(scheme.permissions).toEqual(["project:*"]);
  });

  it("leaves absent fields undefined on a sparse response", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/permission-schemes/")
      .query({ fields: "id" })
      .reply(200, { data: [{ id: "1" }], pagination: { style: "offset" } });

    // Dynamic field list is typed as the widened `PermissionSchemeField[]`, so it
    // falls back to the full `PermissionScheme` return type.
    const dynamicFields: PermissionSchemeField[] = ["id"];
    const page = await makeSchemes().list("acme", { fields: dynamicFields });

    expect(page.data[0].id).toBe("1");
    expect(page.data[0].name).toBeUndefined();
  });

  it("passes through a valid order_by", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/permission-schemes/")
      .query({ order_by: "-sort_order" })
      .reply(200, { data: [], pagination: { style: "offset" } });

    await makeSchemes().list("acme", { order_by: "-sort_order" });

    expect(scope.isDone()).toBe(true);
  });

  it("rejects an unknown order_by before making the request", async () => {
    // "created_at" is a plausible-looking order value but not one permission
    // schemes actually offer (see PermissionSchemes.ts's own doc comment about
    // the two bogus values the golden extraction *does* — wrongly — accept).
    await expect(makeSchemes().list("acme", { order_by: "created_at" as never })).rejects.toThrow(
      /Unknown order_by 'created_at' for permission_schemes_list/
    );
  });

  it("iterates across pages", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/permission-schemes/")
      .query({ per_page: 1 })
      .reply(200, { data: [{ id: "1" }], pagination: { style: "offset" }, next: 1 });
    nock(BASE)
      .get("/api/v2/workspaces/acme/permission-schemes/")
      .query({ per_page: 1, offset: 1 })
      .reply(200, { data: [{ id: "2" }], pagination: { style: "offset" }, next: null });

    const ids: string[] = [];
    for await (const row of makeSchemes().iterate("acme", { per_page: 1 })) {
      ids.push(row.id);
    }

    expect(ids).toEqual(["1", "2"]);
  });
});
