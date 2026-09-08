import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Roles } from "../../../src/api/v2/Roles";
import { V2Transport } from "../../../src/api/v2/kernel/transport";
import { NoMatchFoundError } from "../../../src/errors/PlaneApiError";

const BASE = "https://api.example.com";
const makeResource = () => new Roles(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("Roles (v2)", () => {
  it("lists roles, filterable by namespace", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/roles/")
      .query({ namespace: "workspace" })
      .reply(200, {
        data: [{ id: "1", name: "Admin", slug: "admin", namespace: "workspace", level: 20 }],
        pagination: { style: "offset" },
      });

    const page = await makeResource().list("acme", { namespace: "workspace" });

    expect(scope.isDone()).toBe(true);
    expect(page.data[0].slug).toBe("admin");
  });

  it("retrieves one role", async () => {
    nock(BASE).get("/api/v2/workspaces/acme/roles/1/").reply(200, { id: "1", name: "Admin" });

    const role = await makeResource().retrieve("acme", "1");

    expect(role.name).toBe("Admin");
  });

  it("carries the role `slug` filter through as ?slug=, under the name roleSlug", async () => {
    // The workspace is the leading path id `slug`; the golden's own role filter is also
    // called `slug`. Suppressing it would make a real filter unreachable, so it is
    // exposed as `roleSlug` and mapped back onto the query key here.
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/roles/")
      .query({ slug: "admin" })
      .reply(200, { data: [{ id: "1", name: "Admin", slug: "admin" }], pagination: { style: "offset" } });

    const page = await makeResource().list("acme", { roleSlug: "admin" });

    expect(scope.isDone()).toBe(true);
    expect(page.data[0].id).toBe("1");
  });

  it("has no create/update/delete/upsert — this resource is read-only", () => {
    const roles = makeResource() as unknown as Record<string, unknown>;
    expect(roles.create).toBeUndefined();
    expect(roles.update).toBeUndefined();
    expect(roles.delete).toBeUndefined();
    expect(roles.upsert).toBeUndefined();
  });

  it("rejects an unknown order_by before making the request", async () => {
    // Proof this can actually fail: "description" is a valid `fields` value but not
    // a listed `order_by` value for roles_list.
    await expect(makeResource().list("acme", { order_by: "description" as never })).rejects.toThrow(
      /Unknown order_by 'description' for roles_list/
    );
  });

  describe("findByName()", () => {
    it("scans client-side for the one exact match, with no ?name= on the request", async () => {
      const scope = nock(BASE)
        .get("/api/v2/workspaces/acme/roles/")
        .query((actual) => !("name" in actual))
        .reply(200, {
          data: [
            { id: "1", name: "Admin", slug: "admin", namespace: "workspace" },
            { id: "2", name: "Admin Lite", slug: "admin-lite", namespace: "workspace" },
          ],
          pagination: { style: "offset" },
        });

      const found = await makeResource().findByName("acme", "Admin");

      expect(scope.isDone()).toBe(true);
      expect(found.id).toBe("1");
    });

    it("throws NoMatchFoundError when nothing matches", async () => {
      nock(BASE)
        .get("/api/v2/workspaces/acme/roles/")
        .reply(200, { data: [{ id: "1", name: "Admin" }], pagination: { style: "offset" } });

      await expect(makeResource().findByName("acme", "Nope")).rejects.toBeInstanceOf(NoMatchFoundError);
    });

    it("forwards namespace as a server-side filter", async () => {
      const scope = nock(BASE)
        .get("/api/v2/workspaces/acme/roles/")
        .query({ namespace: "project" })
        .reply(200, {
          data: [{ id: "3", name: "Admin", slug: "admin", namespace: "project" }],
          pagination: { style: "offset" },
        });

      const found = await makeResource().findByName("acme", "Admin", { namespace: "project" });

      expect(scope.isDone()).toBe(true);
      expect(found.id).toBe("3");
    });
  });

  describe("findBySlug()", () => {
    it("resolves the one role with this slug via the server-side ?slug= filter", async () => {
      const scope = nock(BASE)
        .get("/api/v2/workspaces/acme/roles/")
        .query({ slug: "admin", per_page: "2", count: "false" })
        .reply(200, {
          data: [{ id: "1", name: "Admin", slug: "admin", namespace: "workspace" }],
          pagination: { style: "offset" },
        });

      const found = await makeResource().findBySlug("acme", "admin");

      expect(scope.isDone()).toBe(true);
      expect(found.id).toBe("1");
    });

    it("forwards namespace alongside slug to disambiguate a slug reused across namespaces", async () => {
      const scope = nock(BASE)
        .get("/api/v2/workspaces/acme/roles/")
        .query({ slug: "admin", namespace: "project", per_page: "2", count: "false" })
        .reply(200, {
          data: [{ id: "3", name: "Admin", slug: "admin", namespace: "project" }],
          pagination: { style: "offset" },
        });

      const found = await makeResource().findBySlug("acme", "admin", { namespace: "project" });

      expect(scope.isDone()).toBe(true);
      expect(found.id).toBe("3");
    });

    it("throws NoMatchFoundError when no role matches the slug", async () => {
      nock(BASE)
        .get("/api/v2/workspaces/acme/roles/")
        .query({ slug: "nope", per_page: "2", count: "false" })
        .reply(200, { data: [], pagination: { style: "offset" } });

      await expect(makeResource().findBySlug("acme", "nope")).rejects.toBeInstanceOf(NoMatchFoundError);
    });
  });
});
