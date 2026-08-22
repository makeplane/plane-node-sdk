/**
 * Cycles/Modules/Milestones share `V2Resource` behavior, driven once here via a shared `SPECS` table (see support/specs.ts).
 */
import { PlaneClient } from "../../../src/client/plane-client";
import { PlaneApiError } from "../../../src/errors/PlaneApiError";
import { isBulkFailure } from "../../../src/api/v2";
import { Cycle, UpdateCycle, CreateCycle } from "../../../src/models/v2/Cycle";
import { BulkUpdateItem, BulkWriteResponse, Page } from "../../../src/models/v2/common";
import { Milestone, UpdateMilestone, CreateMilestone } from "../../../src/models/v2/Milestone";
import { Module, UpdateModule, CreateModule } from "../../../src/models/v2/Module";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

interface ResourceOps<TRead, TWrite, TPatch> {
  list: (params?: Record<string, unknown>) => Promise<Page<TRead>>;
  iterate: (params?: Record<string, unknown>) => AsyncGenerator<TRead>;
  retrieve: (id: string, params?: Record<string, unknown>) => Promise<TRead>;
  findByName: (name: string) => Promise<TRead>;
  create: (data: TWrite) => Promise<TRead>;
  update: (id: string, data: TPatch) => Promise<TRead>;
  delete: (id: string) => Promise<void>;
  upsert: (data: TWrite) => Promise<TRead>;
  bulkCreate: (items: TWrite[], allOrNone?: boolean) => Promise<BulkWriteResponse>;
  bulkUpdate: (items: BulkUpdateItem<TPatch>[], allOrNone?: boolean) => Promise<BulkWriteResponse>;
  bulkDelete: (ids: string[], allOrNone?: boolean) => Promise<BulkWriteResponse>;
}

interface ResourceSpec<TRead extends { id: string }, TWrite, TPatch> {
  key: "cycles" | "modules" | "milestones";
  identityField: "name" | "title";
  makeWrite(label: string, overrides?: Partial<TWrite>): TWrite;
  makePatch(fields: Partial<TWrite>): TPatch;
  chained: (client: PlaneClient, workspaceSlug: string, project: string) => ResourceOps<TRead, TWrite, TPatch>;
}

const cyclesSpec: ResourceSpec<Cycle, CreateCycle, UpdateCycle> = {
  key: "cycles",
  identityField: "name",
  makeWrite: (name, overrides = {}) => ({ name, ...overrides }),
  makePatch: (fields) => ({ ...fields }),
  chained: (client, slug, project) => client.v2.workspace(slug).project(project).cycles,
};

const modulesSpec: ResourceSpec<Module, CreateModule, UpdateModule> = {
  key: "modules",
  identityField: "name",
  makeWrite: (name, overrides = {}) => ({ name, ...overrides }),
  makePatch: (fields) => ({ ...fields }),
  chained: (client, slug, project) => client.v2.workspace(slug).project(project).modules,
};

const milestonesSpec: ResourceSpec<Milestone, CreateMilestone, UpdateMilestone> = {
  key: "milestones",
  identityField: "title",
  // `label` is the shared display-name key; `makePatch` translates `name` to
  // `title` for milestones.
  makeWrite: (label, overrides = {}) => ({ title: label, ...overrides }) as CreateMilestone,
  makePatch: (fields) => {
    const { name, ...rest } = fields as Record<string, unknown>;
    return (name === undefined ? rest : { ...rest, title: name }) as UpdateMilestone;
  },
  chained: (client, slug, project) => client.v2.workspace(slug).project(project).milestones,
};

type AnyRead = Cycle | Module | Milestone;
type AnyWrite = CreateCycle | CreateModule | CreateMilestone;
type AnyPatch = UpdateCycle | UpdateModule | UpdateMilestone;

const SPECS: ResourceSpec<AnyRead, AnyWrite, AnyPatch>[] = [
  cyclesSpec as unknown as ResourceSpec<AnyRead, AnyWrite, AnyPatch>,
  modulesSpec as unknown as ResourceSpec<AnyRead, AnyWrite, AnyPatch>,
  milestonesSpec as unknown as ResourceSpec<AnyRead, AnyWrite, AnyPatch>,
];

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 cycles/modules/milestones (live)", () => {
  const suite = useV2Project("cmm", env);

  describe.each(SPECS)("$key", (spec) => {
    const identity = (row: AnyRead): string | undefined =>
      (row as unknown as Record<string, string>)[spec.identityField];

    describe("list / retrieve", () => {
      let row: AnyRead;

      beforeAll(async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        row = await ops.create(spec.makeWrite(uniqueName(`${spec.key}-list`)));
      });

      it("lists by project uuid and by project key, and they agree", async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        const byId = await ops.list();
        const byKey = await spec.chained(suite.client, suite.workspaceSlug, suite.projectKey).list();
        expect(Array.isArray(byId.data)).toBe(true);
        expect(new Set(byId.data.map((r) => r.id))).toEqual(new Set(byKey.data.map((r) => r.id)));
      });

      it("without fields returns the full row; with fields is sparse", async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        const full = await ops.list();
        const found = full.data.find((r) => r.id === row.id);
        expect(found).toBeDefined();
        expect(identity(found!)).toBe(identity(row));

        const sparse = await ops.list({ fields: ["id"] });
        const sparseFound = sparse.data.find((r) => r.id === row.id);
        expect(sparseFound).toBeDefined();
        expect(identity(sparseFound!)).toBeUndefined();
      });

      it("retrieve returns the created row, sparse with fields", async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        const fetched = await ops.retrieve(row.id);
        expect(fetched.id).toBe(row.id);
        expect(identity(fetched)).toBe(identity(row));

        const sparse = await ops.retrieve(row.id, { fields: ["id"] });
        expect(sparse.id).toBe(row.id);
        expect(identity(sparse)).toBeUndefined();
      });

      afterAll(async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        await ops.delete(row.id).catch(() => undefined);
      });
    });

    it("create returns the written fields", async () => {
      const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
      const label = uniqueName(`${spec.key}-create`);
      const created = await ops.create(spec.makeWrite(label));
      try {
        expect(identity(created)).toBe(label);
        expect(created.id).toBeTruthy();
      } finally {
        await ops.delete(created.id);
      }
    });

    it("update (PATCH) changes only the given field", async () => {
      const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
      const row = await ops.create(spec.makeWrite(uniqueName(`${spec.key}-update`)));
      try {
        const newLabel = uniqueName(`${spec.key}-renamed`);
        const updated = await ops.update(row.id, spec.makePatch({ name: newLabel } as never));
        expect(updated.id).toBe(row.id);
        expect(identity(updated)).toBe(newLabel);
      } finally {
        await ops.delete(row.id);
      }
    });

    it("delete then retrieve 404s", async () => {
      const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
      const row = await ops.create(spec.makeWrite(uniqueName(`${spec.key}-delete`)));
      await ops.delete(row.id);
      await expect(ops.retrieve(row.id)).rejects.toMatchObject<Partial<PlaneApiError>>({
        status: 404,
        code: "not_found",
      });
    });

    it("findByName: single match, and zero match raises NoMatchFoundError", async () => {
      const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);

      const label = uniqueName(`${spec.key}-single`);
      const created = await ops.create(spec.makeWrite(label));
      try {
        const found = await ops.findByName(label);
        expect(found.id).toBe(created.id);
      } finally {
        await ops.delete(created.id);
      }

      await expect(ops.findByName(uniqueName(`${spec.key}-nope`))).rejects.toMatchObject({
        name: "NoMatchFoundError",
      });
    });

    it("upsert creates then reconciles on (external_source, external_id)", async () => {
      const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
      const marker = uniqueName(`${spec.key}-upsert`);
      const first = await ops.upsert(
        spec.makeWrite(marker, { external_source: marker, external_id: "1" } as Partial<AnyWrite>)
      );
      const renamed = `${marker}-renamed`;
      try {
        const second = await ops.upsert(
          spec.makeWrite(renamed, { external_source: marker, external_id: "1" } as Partial<AnyWrite>)
        );
        expect(second.id).toBe(first.id);
        expect(identity(second)).toBe(renamed);

        const page = await ops.list({ external_source: marker, external_id: "1" });
        expect(page.data).toHaveLength(1);
      } finally {
        await ops.delete(first.id);
      }
    });

    it("bulkCreate, bulkUpdate, and bulkDelete all succeed", async () => {
      const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);

      const created = await ops.bulkCreate([
        spec.makeWrite(uniqueName(`${spec.key}-bulk`)),
        spec.makeWrite(uniqueName(`${spec.key}-bulk`)),
      ]);
      expect(created.succeeded).toBe(2);
      expect(created.failed).toBe(0);
      const ids = created.results.filter((row) => !isBulkFailure(row)).map((row) => row.id!);

      const updated = await ops.bulkUpdate(
        ids.map((id) => ({ ...spec.makePatch({ name: uniqueName(`${spec.key}-bulk-renamed`) } as never), id }))
      );
      expect(updated.succeeded).toBe(2);
      expect(updated.failed).toBe(0);

      const deleted = await ops.bulkDelete(ids);
      expect(deleted.succeeded).toBe(2);
      expect(deleted.failed).toBe(0);
    });

    describe("pagination", () => {
      const ROW_COUNT = 4;
      const PER_PAGE = 2;
      let ids: string[] = [];
      let marker: string;

      beforeAll(async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        marker = uniqueName(`${spec.key}-pg`);
        const items = Array.from({ length: ROW_COUNT }, (_, i) =>
          spec.makeWrite(uniqueName(`${spec.key}-pg-row`), {
            external_source: marker,
            external_id: String(i),
          } as Partial<AnyWrite>)
        );
        const result = await ops.bulkCreate(items);
        ids = result.results.map((row) => row.id!);
      });

      afterAll(async () => {
        if (ids.length === 0) return;
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        await ops.bulkDelete(ids);
      });

      it("offset: one page reports next + total_count; iterate() follows every page", async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        const page = await ops.list({ external_source: marker, per_page: PER_PAGE });
        expect(page.data).toHaveLength(PER_PAGE);
        expect("next" in page && page.next).not.toBeNull();
        expect("total_count" in page && page.total_count).toBe(ROW_COUNT);

        const rows = [];
        for await (const row of ops.iterate({ external_source: marker, per_page: PER_PAGE })) {
          rows.push(row);
        }
        expect(new Set(rows.map((r) => r.id))).toEqual(new Set(ids));
      });

      it("cursor: one page uses the cursor envelope (with an explicit cursor-safe order_by)", async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        const page = await ops.list({
          external_source: marker,
          per_page: PER_PAGE,
          paginate: "cursor",
          order_by: "created_at",
        });
        expect(page.data).toHaveLength(PER_PAGE);
        expect("has_more" in page && page.has_more).toBe(true);
        expect("next_cursor" in page && page.next_cursor).toBeTruthy();
      });

      it("cursor pagination with no explicit order_by 400s (default ordering is not cursor-safe)", async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        let caught: PlaneApiError | undefined;
        try {
          await ops.list({ paginate: "cursor" });
        } catch (error) {
          caught = error as PlaneApiError;
        }
        expect(caught).toBeInstanceOf(PlaneApiError);
        expect(caught!.status).toBe(400);
        expect(caught!.code).toBe("ordering_not_cursor_eligible");
      });
    });
  });
});
