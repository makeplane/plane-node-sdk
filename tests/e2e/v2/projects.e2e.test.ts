/**
 * CRUD/archive/summary/upsert/bulk, reached as `ws.projects`; each test creates and tears down its own disposable project.
 */
import { PlaneClient } from "../../../src/client/plane-client";
import { PlaneApiError } from "../../../src/errors/PlaneApiError";
import { BulkRowSuccess } from "../../../src/models/v2/common";
import { createV2Client } from "./support/client";
import { v2Env } from "./support/env";
import { makeProjectIdentifier, sweepLeftoverProjects, TEST_PROJECT_NAME_PREFIX } from "./support/project";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("Projects (v2, live)", () => {
  let client: PlaneClient;
  const projects = () => client.v2.workspace(env.workspaceSlug).projects;

  beforeAll(async () => {
    client = createV2Client(env);
    await sweepLeftoverProjects(client, env.workspaceSlug);
  });

  it("creates, retrieves by uuid and by identifier, updates, archives, unarchives, summarizes, then deletes", async () => {
    const identifier = makeProjectIdentifier("proj-crud");
    const created = await projects().create({
      identifier,
      name: `SDK v2 Node IT proj-crud ${Date.now()}`,
    });

    try {
      expect(created.identifier).toBe(identifier);

      const byId = await projects().retrieve(created.id);
      const byIdentifier = await projects().retrieve(identifier);
      expect(byId.id).toBe(byIdentifier.id);

      // Keep the suite's name prefix so a leftover from an interrupted run is still swept.
      const renamed = `${TEST_PROJECT_NAME_PREFIX}proj-crud renamed`;
      const updated = await projects().update(identifier, { name: renamed });
      expect(updated.name).toBe(renamed);

      await projects().archive(identifier);
      const archived = await projects().retrieve(identifier);
      expect(archived.archived_at).toBeTruthy();

      await projects().unarchive(identifier);
      const unarchived = await projects().retrieve(identifier);
      expect(unarchived.archived_at).toBeFalsy();

      const summary = await projects().summary(identifier);
      expect(summary.identifier).toBe(identifier);
      expect(typeof summary.counts.states).toBe("number");
    } finally {
      await projects()
        .delete(identifier)
        .catch(() => undefined);
    }
  });

  it("lists projects and finds the created one by name", async () => {
    const identifier = makeProjectIdentifier("proj-list");
    const name = `SDK v2 Node IT proj-list ${Date.now()}`;
    const created = await projects().create({ identifier, name });

    try {
      const page = await projects().list({ search: identifier });
      expect(page.data.some((project) => project.id === created.id)).toBe(true);

      const found = await projects().findByName(name);
      expect(found.id).toBe(created.id);
    } finally {
      await projects()
        .delete(identifier)
        .catch(() => undefined);
    }
  });

  it("upserts on (external_source, external_id)", async () => {
    const identifier = makeProjectIdentifier("proj-up");
    const externalId = `ext-${Date.now()}`;

    const first = await projects().upsert({
      identifier,
      name: `${TEST_PROJECT_NAME_PREFIX}Upsert v1`,
      external_id: externalId,
      external_source: "sdk-e2e",
    });
    try {
      const second = await projects().upsert({
        identifier,
        name: `${TEST_PROJECT_NAME_PREFIX}Upsert v2`,
        external_id: externalId,
        external_source: "sdk-e2e",
      });

      expect(second.id).toBe(first.id);
      expect(second.name).toBe(`${TEST_PROJECT_NAME_PREFIX}Upsert v2`);
    } finally {
      await projects()
        .delete(identifier)
        .catch(() => undefined);
    }
  });

  it("bulk-creates then bulk-updates, with no bulk-delete available", async () => {
    const identifiers = [makeProjectIdentifier("proj-b1"), makeProjectIdentifier("proj-b2")];

    const created = await projects().bulkCreate(
      identifiers.map((identifier) => ({ identifier, name: `SDK v2 Node IT ${identifier} ${Date.now()}` }))
    );
    expect(created.succeeded).toBe(2);

    try {
      const ids = created.results.filter((row): row is BulkRowSuccess => row.result === "created").map((row) => row.id);
      const updated = await projects().bulkUpdate(ids.map((id) => ({ id, description: "bulk-updated" })));
      expect(updated.succeeded).toBe(2);
    } finally {
      for (const identifier of identifiers) {
        await projects()
          .delete(identifier)
          .catch(() => undefined);
      }
    }
  });

  it("404s retrieving a deleted project by its old identifier", async () => {
    const identifier = makeProjectIdentifier("proj-del");
    await projects().create({ identifier, name: `${TEST_PROJECT_NAME_PREFIX}To delete` });
    try {
      await projects().delete(identifier);

      await expect(projects().retrieve(identifier)).rejects.toBeInstanceOf(PlaneApiError);
    } finally {
      // Best-effort: if `delete` itself threw (the assertion above never ran),
      // this is the only thing standing between a transient failure here and a
      // leaked project the sweep can't find by name alone.
      await projects()
        .delete(identifier)
        .catch(() => undefined);
    }
  });
});

maybe("Projects.roleDistribution (v2, live)", () => {
  // Folded in from the standalone `ProjectRoleDistribution` resource — a single
  // workspace-wide aggregate object, not a per-project one. Read-only and
  // workspace-scoped — nothing created and nothing to clean up.
  let client: PlaneClient;

  beforeAll(() => {
    client = createV2Client(env);
  });

  it("retrieves the workspace-wide distribution as a single aggregate object", async () => {
    const result = await client.v2.workspace(env.workspaceSlug).projects.roleDistribution();
    expect(typeof result.total_memberships).toBe("number");
    expect(typeof result.total_distinct_members).toBe("number");
    expect(Array.isArray(result.roles)).toBe(true);
  });
});
