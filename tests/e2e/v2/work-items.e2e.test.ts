/**
 * CRUD/sparse-fields/expand/upsert/bulk/archive/pagination against `proj.workItems` directly — doesn't fit the SPECS harness's shape.
 */
import { PlaneClient } from "../../../src/client/plane-client";
import { WorkItemField } from "../../../src/api/v2/generated/constants";
import { PlaneApiError } from "../../../src/errors/PlaneApiError";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 work items (live)", () => {
  // Short label: support/project.ts's identifier truncates a long label's
  // timestamp entirely, risking collision with a prior leftover project.
  const suite = useV2Project("wi", env);
  let client: PlaneClient;

  beforeAll(() => {
    client = suite.client;
  });

  describe("CRUD", () => {
    it("creates, retrieves, updates, and deletes", async () => {
      const proj = client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      const name = uniqueName("wi-crud");
      const created = await proj.workItems.create({ name });
      expect(created.name).toBe(name);
      expect(created.id).toBeTruthy();
      expect(created.sequence_id).toBeGreaterThan(0);
      expect(created.identifier).toMatch(/-\d+$/);

      const fetched = await proj.workItems.retrieve(created.id);
      expect(fetched.id).toBe(created.id);
      expect(fetched.name).toBe(name);

      const newName = uniqueName("wi-crud-renamed");
      const updated = await proj.workItems.update(created.id, { name: newName });
      expect(updated.name).toBe(newName);

      await proj.workItems.delete(created.id);
      await expect(proj.workItems.retrieve(created.id)).rejects.toMatchObject<Partial<PlaneApiError>>({
        status: 404,
      });
    });

    it("lists by project uuid and by project key, and they agree", async () => {
      const proj = client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      const created = await proj.workItems.create({ name: uniqueName("wi-list") });
      try {
        const byId = await proj.workItems.list();
        const byKey = await client.v2.workspace(suite.workspaceSlug).project(suite.projectKey).workItems.list();
        expect(byId.data.some((row) => row.id === created.id)).toBe(true);
        expect(new Set(byId.data.map((r) => r.id))).toEqual(new Set(byKey.data.map((r) => r.id)));
      } finally {
        await proj.workItems.delete(created.id);
      }
    });

    it("with fields is sparse: an unrequested field is undefined, not an error", async () => {
      const proj = client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      const created = await proj.workItems.create({ name: uniqueName("wi-fields") });
      try {
        // Not `as const`: a `WorkItemField[]` falls back to the full `WorkItem`
        // type, letting this test check the runtime absence of unrequested fields.
        const dynamicFields: WorkItemField[] = ["id", "name"];
        const page = await proj.workItems.list({ fields: dynamicFields });
        const found = page.data.find((r) => r.id === created.id);
        expect(found).toBeDefined();
        expect(found!.name).toBeDefined();
        expect(found!.priority).toBeUndefined();
        expect(found!.sequence_id).toBeUndefined();

        const idOnly: WorkItemField[] = ["id"];
        const fetched = await proj.workItems.retrieve(created.id, { fields: idOnly });
        expect(fetched.id).toBe(created.id);
        expect(fetched.name).toBeUndefined();
      } finally {
        await proj.workItems.delete(created.id);
      }
    });
  });

  describe("readable write fields", () => {
    it("accepts a state name instead of state_id", async () => {
      const proj = client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      const states = await proj.states.list({ per_page: 1 });
      const targetState = states.data[0];
      expect(targetState?.name).toBeTruthy();

      const created = await proj.workItems.create({
        name: uniqueName("wi-readable-state"),
        state: targetState.name,
      });
      try {
        expect(created.state_id).toBe(targetState.id);
      } finally {
        await proj.workItems.delete(created.id);
      }
    });

    it("sending both the readable and id form for the same field is a 400", async () => {
      const proj = client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      await expect(
        proj.workItems.create({
          name: uniqueName("wi-both-forms"),
          state: "Todo",
          state_id: "00000000-0000-0000-0000-000000000000",
        })
      ).rejects.toMatchObject<Partial<PlaneApiError>>({ status: 400 });
    });
  });

  describe("expand", () => {
    it("state expands to the full nested object instead of just state_id", async () => {
      const proj = client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      const created = await proj.workItems.create({ name: uniqueName("wi-expand") });
      try {
        const expanded = await proj.workItems.retrieve(created.id, { expand: ["state"] });
        // WorkItem's static type does not describe expand's shape (see WorkItems'
        // own doc comment) -- reach in as unknown, same as any SDK consumer would.
        const rawState = (expanded as unknown as { state?: { id?: string; name?: string } }).state;
        expect(rawState).toBeDefined();
        expect(rawState!.id).toBe(created.state_id);
        expect(rawState!.name).toBeTruthy();
      } finally {
        await proj.workItems.delete(created.id);
      }
    });

    it("rejects an expand value work_items_list doesn't offer, before hitting the network", async () => {
      const proj = client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      await expect(proj.workItems.list({ expand: ["not_a_real_expand" as never] })).rejects.toThrow(
        /Unknown expand value/
      );
    });
  });

  describe("upsert", () => {
    it("reconciles on (external_source, external_id)", async () => {
      const proj = client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      const externalId = uniqueName("wi-upsert-ext");
      const first = await proj.workItems.upsert({
        name: uniqueName("wi-upsert-1"),
        external_id: externalId,
        external_source: "sdk-e2e",
      });
      try {
        const second = await proj.workItems.upsert({
          name: uniqueName("wi-upsert-2"),
          external_id: externalId,
          external_source: "sdk-e2e",
        });
        expect(second.id).toBe(first.id); // reconciled, not a second row
      } finally {
        await proj.workItems.delete(first.id);
      }
    });
  });

  describe("bulk actions", () => {
    it("bulkCreate, bulkUpdate, bulkDelete", async () => {
      const proj = client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      const items = [0, 1, 2].map(() => ({ name: uniqueName("wi-bulk") }));
      const created = await proj.workItems.bulkCreate(items);
      expect(created.succeeded).toBe(3);
      const ids = created.results.map((row) => row.id!);

      const updated = await proj.workItems.bulkUpdate(ids.map((id) => ({ id, name: uniqueName("wi-bulk-renamed") })));
      expect(updated.succeeded).toBe(3);

      const deleted = await proj.workItems.bulkDelete(ids);
      expect(deleted.succeeded).toBe(3);
    });
  });

  describe("archive/unarchive", () => {
    it("archives then unarchives, round-tripping archived_at", async () => {
      const proj = client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      const created = await proj.workItems.create({ name: uniqueName("wi-archive") });
      try {
        const archived = await proj.workItems.archive(created.id);
        expect(archived.archived_at).toBeTruthy();

        const unarchived = await proj.workItems.unarchive(created.id);
        expect(unarchived.archived_at).toBeNull();
      } finally {
        await proj.workItems.delete(created.id);
      }
    });
  });

  describe("workspace-level (ws.workItems.list / iterate)", () => {
    it("lists at a different path than the project-scoped list, and finds the created row", async () => {
      const proj = client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      const created = await proj.workItems.create({ name: uniqueName("wi-workspace-list") });
      try {
        const page = await client.v2.workspace(suite.workspaceSlug).workItems.list({ project_id: suite.projectId });
        expect(page.data.some((row) => row.id === created.id)).toBe(true);
      } finally {
        await proj.workItems.delete(created.id);
      }
    });

    it("iterate follows pages", async () => {
      // `external_id` must be unique per row within a shared `external_source` (see
      // CreateWorkItem) -- one marker per item, not shared across the batch,
      // matching pagination.e2e.test.ts's own convention for states/labels.
      const proj = client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      const marker = uniqueName("wi-workspace-iter");
      const created = await proj.workItems.bulkCreate(
        [0, 1, 2].map((i) => ({
          name: uniqueName("wi-ws-iter-row"),
          external_source: marker,
          external_id: String(i),
        }))
      );
      const ids = created.results.map((row) => row.id!);
      try {
        const seen: string[] = [];
        for await (const row of client.v2.workspace(suite.workspaceSlug).workItems.iterate({
          project_id: suite.projectId,
          external_source: marker,
          per_page: 1,
        })) {
          seen.push(row.id);
        }
        expect(new Set(seen)).toEqual(new Set(ids));
      } finally {
        await proj.workItems.bulkDelete(ids);
      }
    });
  });

  describe("retrieveByIdentifier (readable-identifiers flagship)", () => {
    it("looks a work item up by PROJ-N, not its id", async () => {
      const proj = client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      const created = await proj.workItems.create({ name: uniqueName("wi-identifier") });
      try {
        expect(created.identifier).toBeTruthy();
        const found = await client.v2
          .workspace(suite.workspaceSlug)
          .workItems.retrieveByIdentifier(created.identifier!);
        expect(found.id).toBe(created.id);
        expect(found.identifier).toBe(created.identifier);
      } finally {
        await proj.workItems.delete(created.id);
      }
    });

    it("an unknown identifier 404s", async () => {
      await expect(
        client.v2.workspace(suite.workspaceSlug).workItems.retrieveByIdentifier(`${suite.projectKey}-999999`)
      ).rejects.toMatchObject<Partial<PlaneApiError>>({ status: 404 });
    });
  });

  describe("pagination", () => {
    it("offset: iterate() follows every page", async () => {
      const proj = client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      const marker = uniqueName("wi-page");
      const created = await proj.workItems.bulkCreate(
        [0, 1, 2, 3].map((i) => ({
          name: uniqueName("wi-page-row"),
          external_source: marker,
          external_id: String(i),
        }))
      );
      const ids = created.results.map((row) => row.id!);
      try {
        const rows = [];
        for await (const row of proj.workItems.iterate({ external_source: marker, per_page: 2 })) {
          rows.push(row);
        }
        expect(new Set(rows.map((r) => r.id))).toEqual(new Set(ids));
      } finally {
        await proj.workItems.bulkDelete(ids);
      }
    });
  });

  describe("error contract", () => {
    it("an over-length name surfaces field-level .errors", async () => {
      const proj = client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      let caught: PlaneApiError | undefined;
      try {
        await proj.workItems.create({ name: "x".repeat(300) });
      } catch (error) {
        caught = error as PlaneApiError;
      }
      expect(caught).toBeInstanceOf(PlaneApiError);
      expect(caught!.status).toBe(400);
      expect(caught!.errors).toBeDefined();
      expect(caught!.errors!.some((fieldError) => fieldError.field === "name")).toBe(true);
    });
  });
});
