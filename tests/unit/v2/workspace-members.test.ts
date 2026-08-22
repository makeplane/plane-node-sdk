import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { WorkspaceMembers } from "../../../src/api/v2/WorkspaceMembers";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const SLUG = "acme";

const makeMembers = () =>
  new WorkspaceMembers(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })), { slug: SLUG });

afterEach(() => nock.cleanAll());

describe("WorkspaceMembers (v2, workspace-scoped)", () => {
  const workspaceCollection = `/api/v2/workspaces/${SLUG}/members/`;

  it("lists every member of the workspace", async () => {
    nock(BASE)
      .get(workspaceCollection)
      .reply(200, { data: [{ id: "m1", member_id: "u1", role: "member" }], pagination: { style: "offset" } });

    const page = await makeMembers().list();

    expect(page.data[0].member_id).toBe("u1");
  });

  it("iterates every member of the workspace across pages", async () => {
    nock(BASE)
      .get(workspaceCollection)
      .reply(200, { data: [{ id: "m1" }], pagination: { style: "offset" }, next: 1 });
    nock(BASE)
      .get(workspaceCollection)
      .query({ offset: "1" })
      .reply(200, { data: [{ id: "m2" }], pagination: { style: "offset" }, next: null });

    const ids: string[] = [];
    for await (const m of makeMembers().iterate()) ids.push(m.id);
    expect(ids).toEqual(["m1", "m2"]);
  });

  it("removes a member from the workspace by email, hitting the collection-level remove/ endpoint", async () => {
    const scope = nock(BASE).post(`${workspaceCollection}remove/`, { email: "gone@acme.test" }).reply(204);

    await expect(makeMembers().remove({ email: "gone@acme.test" })).resolves.toBeUndefined();
    expect(scope.isDone()).toBe(true);
  });
});
