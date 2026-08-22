import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { ProjectWorkItemTemplates } from "../../../src/api/v2/WorkItemTemplates/ProjectTemplates";
import { WorkspaceWorkItemTemplates } from "../../../src/api/v2/WorkItemTemplates/WorkspaceTemplates";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const transport = () => new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" }));
const makeProjectTemplates = () => new ProjectWorkItemTemplates(transport(), { slug: "acme", project_id: "ENG" });
const makeWorkspaceTemplates = () => new WorkspaceWorkItemTemplates(transport(), { slug: "acme" });

afterEach(() => nock.cleanAll());

describe("ProjectWorkItemTemplates (v2)", () => {
  it("lists project templates", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/work-item-templates/")
      .reply(200, { data: [{ id: "1", name: "Bug report" }], pagination: { style: "offset" } });

    const page = await makeProjectTemplates().list();

    expect(page.data[0].name).toBe("Bug report");
  });

  it("creates then patches, then deletes a template", async () => {
    nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/work-item-templates/", {
        name: "Bug report",
        template_data: { name: "Untitled bug" },
      })
      .reply(201, { id: "1", name: "Bug report" });
    nock(BASE)
      .patch("/api/v2/workspaces/acme/projects/ENG/work-item-templates/1/", { is_published: true })
      .reply(200, { id: "1", name: "Bug report", is_published: true });
    nock(BASE).delete("/api/v2/workspaces/acme/projects/ENG/work-item-templates/1/").reply(204);

    const templates = makeProjectTemplates();
    const created = await templates.create({
      name: "Bug report",
      template_data: { name: "Untitled bug" },
    });
    const updated = await templates.update(created.id, { is_published: true });
    expect(updated.is_published).toBe(true);

    await templates.delete("1");
  });

  it("instantiates a work item via use/, with no override body", async () => {
    let capturedBody: unknown;
    nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/work-item-templates/1/use/", (body: unknown) => {
        capturedBody = body;
        return true;
      })
      .reply(201, { id: "wi-1", name: "Untitled bug", project_id: "ENG" });

    const workItem = await makeProjectTemplates().use("1");

    expect(workItem.id).toBe("wi-1");
    // axios sends an empty body (not literally `undefined`) when `data` is `undefined`;
    // nock captures that as an empty string rather than as no body at all.
    expect(capturedBody).toBeFalsy();
  });

  it("instantiates a work item via use/, overriding name", async () => {
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/work-item-templates/1/use/", { name: "Login is broken" })
      .reply(201, { id: "wi-2", name: "Login is broken" });

    const workItem = await makeProjectTemplates().use("1", { name: "Login is broken" });

    expect(scope.isDone()).toBe(true);
    expect(workItem.name).toBe("Login is broken");
  });

  // `use()` originally called `this.query(...)` synchronously in a non-async
  // method, letting a throw escape instead of rejecting (NODE_PATTERN.md).
  // Now `async`, and this passes because the rejection is real.
  it("validates use/'s fields against work_items_use's own (narrower) field set, not the template's", async () => {
    await expect(makeProjectTemplates().use("1", undefined, { fields: ["short_id" as never] })).rejects.toThrow(
      /Unknown field\(s\) for work_items_use/
    );
  });
});

describe("WorkspaceWorkItemTemplates (v2)", () => {
  it("lists workspace templates", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/work-item-templates/")
      .reply(200, { data: [{ id: "1", name: "Bug report" }], pagination: { style: "offset" } });

    const page = await makeWorkspaceTemplates().list();

    expect(page.data[0].name).toBe("Bug report");
  });

  it("creates then patches, then deletes a template", async () => {
    nock(BASE)
      .post("/api/v2/workspaces/acme/work-item-templates/", { name: "Bug report", template_data: { name: "Untitled" } })
      .reply(201, { id: "1", name: "Bug report" });
    nock(BASE)
      .patch("/api/v2/workspaces/acme/work-item-templates/1/", { is_published: true })
      .reply(200, { id: "1", is_published: true });
    nock(BASE).delete("/api/v2/workspaces/acme/work-item-templates/1/").reply(204);

    const templates = makeWorkspaceTemplates();
    const created = await templates.create({ name: "Bug report", template_data: { name: "Untitled" } });
    const updated = await templates.update(created.id, { is_published: true });
    expect(updated.is_published).toBe(true);

    await templates.delete("1");
  });

  it("has no use() action — instantiation always happens through the project-scoped resource", () => {
    expect((makeWorkspaceTemplates() as unknown as Record<string, unknown>).use).toBeUndefined();
  });

  // Negative-assertion proof: no nock interceptor is registered for this URL, so an
  // implementation that forgot to validate `order_by` and made the request anyway
  // would also fail this test, but for a different reason and without this message.
  it("rejects an unknown order_by before making the request", async () => {
    await expect(makeWorkspaceTemplates().list({ order_by: "name" as never })).rejects.toThrow(
      /Unknown order_by 'name' for workspace_work_item_templates_list/
    );
  });
});
