import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { WorkspaceViews } from "../../../src/api/v2/WorkspaceViews";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const makeViews = () => new WorkspaceViews(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("WorkspaceViews (v2) — workspace-scoped (project IS NULL)", () => {
  it("lists workspace views at the distinct /workspaces/{slug}/views/ template", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/views/")
      .reply(200, { data: [{ id: "1", name: "Company OKRs" }], pagination: { style: "offset" } });

    const page = await makeViews().list("acme");

    expect(scope.isDone()).toBe(true);
    expect(page.data[0].name).toBe("Company OKRs");
  });

  it("iterates workspace views across pages", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/views/")
      .reply(200, { data: [{ id: "1" }], pagination: { style: "offset" }, next: 1 });
    nock(BASE)
      .get("/api/v2/workspaces/acme/views/")
      .query({ offset: "1" })
      .reply(200, { data: [{ id: "2" }], pagination: { style: "offset" }, next: null });

    const ids: string[] = [];
    for await (const view of makeViews().iterate("acme")) ids.push(view.id);

    expect(ids).toEqual(["1", "2"]);
  });

  it("retrieves a workspace view at its own detail template", async () => {
    nock(BASE).get("/api/v2/workspaces/acme/views/1/").reply(200, { id: "1", name: "Company OKRs" });

    const view = await makeViews().retrieve("acme", "1");

    expect(view.name).toBe("Company OKRs");
  });

  it("creates then patches, then deletes a workspace view — none of these share the project-scoped URL", async () => {
    nock(BASE)
      .post("/api/v2/workspaces/acme/views/", { name: "Company OKRs" })
      .reply(201, { id: "1", name: "Company OKRs" });
    nock(BASE)
      .patch("/api/v2/workspaces/acme/views/1/", { is_locked: true })
      .reply(200, { id: "1", name: "Company OKRs", is_locked: true });
    nock(BASE).delete("/api/v2/workspaces/acme/views/1/").reply(204);

    const views = makeViews();
    const created = await views.create("acme", { name: "Company OKRs" });
    const updated = await views.update("acme", created.id, { is_locked: true });
    expect(updated.is_locked).toBe(true);

    await views.delete("acme", "1");
  });

  // No nock interceptor is registered for this URL, so the failure is due to real
  // validation. Pins that `updated_at` is valid for `project_views_list` but not
  // `workspace_views_list`.
  it("rejects updated_at as a workspace order_by, though it is valid for the project list", async () => {
    await expect(makeViews().list("acme", { order_by: "updated_at" as never })).rejects.toThrow(
      /Unknown order_by 'updated_at' for workspace_views_list/
    );
  });
});
