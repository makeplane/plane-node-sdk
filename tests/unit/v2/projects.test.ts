import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Projects } from "../../../src/api/v2/Projects";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";
const makeProjects = () => new Projects(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("Projects (v2)", () => {
  it("lists projects", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/")
      .reply(200, { data: [{ id: "1", identifier: "ENG", name: "Engineering" }], pagination: { style: "offset" } });

    const page = await makeProjects().list("acme");

    expect(page.data[0].identifier).toBe("ENG");
  });

  // The readable-identifiers flagship: the same detail route accepts a UUID or the
  // bare project identifier interchangeably (golden `pk` schema is `^[^/]+$`, not a
  // uuid format) — both must reach the exact same URL segment, unencoded further.
  it("retrieves by project uuid", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/11111111-1111-1111-1111-111111111111/")
      .reply(200, { id: "11111111-1111-1111-1111-111111111111", identifier: "ENG" });

    const project = await makeProjects().retrieve("acme", "11111111-1111-1111-1111-111111111111");

    expect(project.identifier).toBe("ENG");
  });

  it("retrieves by bare project identifier — no UUID required", async () => {
    nock(BASE).get("/api/v2/workspaces/acme/projects/ENG/").reply(200, { id: "1", identifier: "ENG" });

    const project = await makeProjects().retrieve("acme", "ENG");

    expect(project.id).toBe("1");
  });

  it("creates then patches, then deletes by identifier", async () => {
    nock(BASE)
      .post("/api/v2/workspaces/acme/projects/", { identifier: "ENG", name: "Engineering" })
      .reply(201, { id: "1", identifier: "ENG", name: "Engineering" });
    nock(BASE)
      .patch("/api/v2/workspaces/acme/projects/ENG/", { name: "Eng Platform" })
      .reply(200, { id: "1", identifier: "ENG", name: "Eng Platform" });
    nock(BASE).delete("/api/v2/workspaces/acme/projects/ENG/").reply(204);

    const projects = makeProjects();
    const created = await projects.create("acme", { identifier: "ENG", name: "Engineering" });
    const updated = await projects.update("acme", created.identifier!, { name: "Eng Platform" });
    expect(updated.name).toBe("Eng Platform");

    await projects.delete("acme", "ENG");
  });

  it("archives, returning void on a 204", async () => {
    const scope = nock(BASE).post("/api/v2/workspaces/acme/projects/ENG/archive/").reply(204);

    const result = await makeProjects().archive("acme", "ENG");

    expect(scope.isDone()).toBe(true);
    expect(result).toBeUndefined();
  });

  it("unarchives, returning void on a 204", async () => {
    const scope = nock(BASE).post("/api/v2/workspaces/acme/projects/ENG/unarchive/").reply(204);

    const result = await makeProjects().unarchive("acme", "ENG");

    expect(scope.isDone()).toBe(true);
    expect(result).toBeUndefined();
  });

  it("fetches summary counts, narrowed by ?counts=", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/summary/")
      .query({ counts: "members,states" })
      .reply(200, { id: "1", identifier: "ENG", name: "Engineering", counts: { members: 3, states: 5 } });

    const summary = await makeProjects().summary("acme", "ENG", ["members", "states"]);

    expect(scope.isDone()).toBe(true);
    expect(summary.counts.members).toBe(3);
  });

  it("fetches summary counts with no ?counts= when omitted", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/summary/")
      .reply(200, { id: "1", identifier: "ENG", name: "Engineering", counts: { members: 3 } });

    await makeProjects().summary("acme", "ENG");

    expect(scope.isDone()).toBe(true);
  });

  it("upserts against the upsert/ route", async () => {
    nock(BASE)
      .post("/api/v2/workspaces/acme/projects/upsert/", { identifier: "ENG", name: "Engineering" })
      .reply(200, { id: "1", identifier: "ENG" });

    expect((await makeProjects().upsert("acme", { identifier: "ENG", name: "Engineering" })).id).toBe("1");
  });

  it("posts an items envelope to bulk-create/ (no bulk-delete exists for projects)", async () => {
    let capturedBody: unknown;
    nock(BASE)
      .post("/api/v2/workspaces/acme/projects/bulk-create/", (body: unknown) => {
        capturedBody = body;
        return true;
      })
      .reply(200, { results: [{ index: 0, result: "created", id: "1" }], succeeded: 1, failed: 0 });

    const result = await makeProjects().bulkCreate("acme", [{ identifier: "ENG", name: "Engineering" }]);

    expect(capturedBody).toEqual({
      items: [{ identifier: "ENG", name: "Engineering" }],
      all_or_none: false,
    });
    expect(result.succeeded).toBe(1);
    // `Projects` has no `bulkDelete` method — deleting a project cascades work
    // items/cycles/modules/pages/members, deliberately kept off the batch surface.
    expect((makeProjects() as unknown as Record<string, unknown>).bulkDelete).toBeUndefined();
  });

  it("posts an id-carrying items envelope to bulk-update/", async () => {
    let capturedBody: unknown;
    nock(BASE)
      .post("/api/v2/workspaces/acme/projects/bulk-update/", (body: unknown) => {
        capturedBody = body;
        return true;
      })
      .reply(200, { results: [{ index: 0, result: "updated", id: "1" }], succeeded: 1, failed: 0 });

    await makeProjects().bulkUpdate("acme", [{ id: "1", name: "Renamed" }]);

    expect(capturedBody).toEqual({ items: [{ id: "1", name: "Renamed" }], all_or_none: false });
  });

  // No nock interceptor is registered for this URL, so the message-specific regex
  // pins the real validator, not just "any throw".
  it("rejects an unknown fields value before making the request", async () => {
    await expect(makeProjects().list("acme", { fields: ["nope" as never] })).rejects.toThrow(
      /Unknown field\(s\) for projects_list/
    );
  });
});

describe("Projects.roleDistribution (v2)", () => {
  // Folded in from the standalone `ProjectRoleDistribution` resource: a single
  // aggregate object at `/project-role-distribution/`, not nested under `/projects/`.
  it("retrieves the workspace-wide role distribution as a single aggregate object", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/project-role-distribution/")
      .reply(200, {
        roles: [
          {
            role_id: "role-1",
            name: "Admin",
            slug: "admin",
            level: 20,
            is_system: true,
            membership_count: 3,
            distinct_member_count: 3,
          },
        ],
        total_memberships: 3,
        total_distinct_members: 3,
      });

    const distribution = await makeProjects().roleDistribution("acme");

    expect(distribution.total_memberships).toBe(3);
    expect(distribution.roles[0].slug).toBe("admin");
  });

  it("scopes the URL by workspace slug, not project", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/other-workspace/project-role-distribution/")
      .reply(200, { roles: [], total_memberships: 0, total_distinct_members: 0 });

    await makeProjects().roleDistribution("other-workspace");

    expect(scope.isDone()).toBe(true);
  });
});
