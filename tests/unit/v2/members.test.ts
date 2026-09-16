import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { ProjectMembers } from "../../../src/api/v2/Members";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const SLUG = "acme";
const PROJECT = "ENG";

const makeMembers = () => new ProjectMembers(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("ProjectMembers (v2, project-scoped)", () => {
  const collection = `/api/v2/workspaces/${SLUG}/projects/${PROJECT}/members/`;

  it("lists, creates, retrieves, updates, deletes a project member", async () => {
    nock(BASE)
      .get(collection)
      .reply(200, { data: [{ id: "m1", member_id: "u1", role: "contributor" }], pagination: { style: "offset" } });
    nock(BASE).post(collection, { member_id: "u2" }).reply(201, { id: "m2", member_id: "u2", role: "member" });
    nock(BASE).get(`${collection}m2/`).reply(200, { id: "m2", member_id: "u2", role: "member" });
    nock(BASE).patch(`${collection}m2/`, { role: "admin" }).reply(200, { id: "m2", member_id: "u2", role: "admin" });
    nock(BASE).delete(`${collection}m2/`).reply(204);

    const members = makeMembers();
    const page = await members.list(SLUG, PROJECT);
    expect(page.data[0].role).toBe("contributor");
    const created = await members.create(SLUG, PROJECT, { member_id: "u2" });
    expect(created.role).toBe("member");
    const fetched = await members.retrieve(SLUG, PROJECT, "m2");
    expect(fetched.member_id).toBe("u2");
    const updated = await members.update(SLUG, PROJECT, "m2", { role: "admin" });
    expect(updated.role).toBe("admin");
    await expect(members.delete(SLUG, PROJECT, "m2")).resolves.toBeUndefined();
  });

  it("filters by role__in", async () => {
    const scope = nock(BASE)
      .get(collection)
      .query({ role__in: "admin,member" })
      .reply(200, { data: [], pagination: { style: "offset" } });
    await makeMembers().list(SLUG, PROJECT, { role__in: ["admin", "member"] });
    expect(scope.isDone()).toBe(true);
  });

  it("rejects an expand value the operation doesn't offer", async () => {
    await expect(makeMembers().list(SLUG, PROJECT, { expand: ["role" as never] })).rejects.toThrow(
      /Unknown expand value\(s\) for project_members_list: role/
    );
  });
});
