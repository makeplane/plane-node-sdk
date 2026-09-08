/**
 * Cycles/Modules/Milestones share `V2Resource` behavior, driven once here via a shared `SPECS` table (see support/specs.ts).
 */
import { PlaneClient } from "../../../src/client/plane-client";
import { LoadedProject } from "../../../src/api/v2/loaded/Project";
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
  /** The flat form: `v2.projects.<key>`, both path ids passed on every call. */
  flat: (client: PlaneClient, workspaceSlug: string, project: string) => ResourceOps<TRead, TWrite, TPatch>;
  /** The navigated form: the same methods off a fetched project row, with the ids bound. */
  navigated: (project: LoadedProject) => ResourceOps<TRead, TWrite, TPatch>;
}

/**
 * Everything below is driven navigated — these three families are the project row's own
 * children, so that is the shape a caller who has already fetched a project reaches for.
 * The one test that cannot be navigated (uuid vs. project key) says so at its own site,
 * and `crud.e2e.test.ts` runs both shapes over states and labels.
 */
function ops<TRead extends { id: string }, TWrite, TPatch>(
  spec: ResourceSpec<TRead, TWrite, TPatch>,
  suite: { projectRow: LoadedProject }
): ResourceOps<TRead, TWrite, TPatch> {
  return spec.navigated(suite.projectRow);
}

/**
 * The flat resource with its two leading path ids closed over — the same call shape the
 * navigated view has, built by hand rather than by `owned()` so the two are genuinely
 * different code paths.
 */
function bindProject<TRead, TWrite, TPatch>(
  resource: FlatProjectResource<TRead, TWrite, TPatch>,
  slug: string,
  project: string
): ResourceOps<TRead, TWrite, TPatch> {
  return {
    list: (params) => resource.list(slug, project, params),
    iterate: (params) => resource.iterate(slug, project, params),
    retrieve: (id, params) => resource.retrieve(slug, project, id, params),
    findByName: (name) => resource.findByName(slug, project, name),
    create: (data) => resource.create(slug, project, data),
    update: (id, data) => resource.update(slug, project, id, data),
    delete: (id) => resource.delete(slug, project, id),
    upsert: (data) => resource.upsert(slug, project, data),
    bulkCreate: (items, allOrNone) => resource.bulkCreate(slug, project, items, allOrNone),
    bulkUpdate: (items, allOrNone) => resource.bulkUpdate(slug, project, items, allOrNone),
    bulkDelete: (ids, allOrNone) => resource.bulkDelete(slug, project, ids, allOrNone),
  };
}

/** {@link ResourceOps} with the two project path ids still in front of every method. */
interface FlatProjectResource<TRead, TWrite, TPatch> {
  list(slug: string, project: string, params?: Record<string, unknown>): Promise<Page<TRead>>;
  iterate(slug: string, project: string, params?: Record<string, unknown>): AsyncGenerator<TRead>;
  retrieve(slug: string, project: string, id: string, params?: Record<string, unknown>): Promise<TRead>;
  findByName(slug: string, project: string, name: string): Promise<TRead>;
  create(slug: string, project: string, data: TWrite): Promise<TRead>;
  update(slug: string, project: string, id: string, data: TPatch): Promise<TRead>;
  delete(slug: string, project: string, id: string): Promise<void>;
  upsert(slug: string, project: string, data: TWrite): Promise<TRead>;
  bulkCreate(slug: string, project: string, items: TWrite[], allOrNone?: boolean): Promise<BulkWriteResponse>;
  bulkUpdate(
    slug: string,
    project: string,
    items: BulkUpdateItem<TPatch>[],
    allOrNone?: boolean
  ): Promise<BulkWriteResponse>;
  bulkDelete(slug: string, project: string, ids: string[], allOrNone?: boolean): Promise<BulkWriteResponse>;
}

const cyclesSpec: ResourceSpec<Cycle, CreateCycle, UpdateCycle> = {
  key: "cycles",
  identityField: "name",
  makeWrite: (name, overrides = {}) => ({ name, ...overrides }),
  makePatch: (fields) => ({ ...fields }),
  flat: (client, slug, project) => bindProject(client.v2.projects.cycles, slug, project),
  navigated: (project) => project.cycles,
};

const modulesSpec: ResourceSpec<Module, CreateModule, UpdateModule> = {
  key: "modules",
  identityField: "name",
  makeWrite: (name, overrides = {}) => ({ name, ...overrides }),
  makePatch: (fields) => ({ ...fields }),
  flat: (client, slug, project) => bindProject(client.v2.projects.modules, slug, project),
  navigated: (project) => project.modules,
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
  flat: (client, slug, project) => bindProject(client.v2.projects.milestones, slug, project),
  navigated: (project) => project.milestones,
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
        row = await ops(spec, suite).create(spec.makeWrite(uniqueName(`${spec.key}-list`)));
      });

      // Flat on both sides here: a navigated row is already bound to whichever key
      // `rowId` chose, so it cannot be asked to address the project the other way.
      it("lists by project uuid and by project key, and they agree", async () => {
        const byId = await spec.flat(suite.client, suite.workspaceSlug, suite.projectId).list();
        const byKey = await spec.flat(suite.client, suite.workspaceSlug, suite.projectKey).list();
        expect(Array.isArray(byId.data)).toBe(true);
        expect(new Set(byId.data.map((r) => r.id))).toEqual(new Set(byKey.data.map((r) => r.id)));
      });

      it("without fields returns the full row; with fields is sparse", async () => {
        const full = await ops(spec, suite).list();
        const found = full.data.find((r) => r.id === row.id);
        expect(found).toBeDefined();
        expect(identity(found!)).toBe(identity(row));

        const sparse = await ops(spec, suite).list({ fields: ["id"] });
        const sparseFound = sparse.data.find((r) => r.id === row.id);
        expect(sparseFound).toBeDefined();
        expect(identity(sparseFound!)).toBeUndefined();
      });

      it("retrieve returns the created row, sparse with fields", async () => {
        const fetched = await ops(spec, suite).retrieve(row.id);
        expect(fetched.id).toBe(row.id);
        expect(identity(fetched)).toBe(identity(row));

        const sparse = await ops(spec, suite).retrieve(row.id, { fields: ["id"] });
        expect(sparse.id).toBe(row.id);
        expect(identity(sparse)).toBeUndefined();
      });

      afterAll(async () => {
        await ops(spec, suite)
          .delete(row.id)
          .catch(() => undefined);
      });
    });

    it("create returns the written fields", async () => {
      const label = uniqueName(`${spec.key}-create`);
      const created = await ops(spec, suite).create(spec.makeWrite(label));
      try {
        expect(identity(created)).toBe(label);
        expect(created.id).toBeTruthy();
      } finally {
        await ops(spec, suite).delete(created.id);
      }
    });

    it("update (PATCH) changes only the given field", async () => {
      const row = await ops(spec, suite).create(spec.makeWrite(uniqueName(`${spec.key}-update`)));
      try {
        const newLabel = uniqueName(`${spec.key}-renamed`);
        const updated = await ops(spec, suite).update(row.id, spec.makePatch({ name: newLabel } as never));
        expect(updated.id).toBe(row.id);
        expect(identity(updated)).toBe(newLabel);
      } finally {
        await ops(spec, suite).delete(row.id);
      }
    });

    it("delete then retrieve 404s", async () => {
      const row = await ops(spec, suite).create(spec.makeWrite(uniqueName(`${spec.key}-delete`)));
      await ops(spec, suite).delete(row.id);
      await expect(ops(spec, suite).retrieve(row.id)).rejects.toMatchObject<Partial<PlaneApiError>>({
        status: 404,
        code: "not_found",
      });
    });

    it("findByName: single match, and zero match raises NoMatchFoundError", async () => {
      const label = uniqueName(`${spec.key}-single`);
      const created = await ops(spec, suite).create(spec.makeWrite(label));
      try {
        const found = await ops(spec, suite).findByName(label);
        expect(found.id).toBe(created.id);
      } finally {
        await ops(spec, suite).delete(created.id);
      }

      await expect(ops(spec, suite).findByName(uniqueName(`${spec.key}-nope`))).rejects.toMatchObject({
        name: "NoMatchFoundError",
      });
    });

    it("upsert creates then reconciles on (external_source, external_id)", async () => {
      const marker = uniqueName(`${spec.key}-upsert`);
      const first = await ops(spec, suite).upsert(
        spec.makeWrite(marker, { external_source: marker, external_id: "1" } as Partial<AnyWrite>)
      );
      const renamed = `${marker}-renamed`;
      try {
        const second = await ops(spec, suite).upsert(
          spec.makeWrite(renamed, { external_source: marker, external_id: "1" } as Partial<AnyWrite>)
        );
        expect(second.id).toBe(first.id);
        expect(identity(second)).toBe(renamed);

        const page = await ops(spec, suite).list({ external_source: marker, external_id: "1" });
        expect(page.data).toHaveLength(1);
      } finally {
        await ops(spec, suite).delete(first.id);
      }
    });

    it("bulkCreate, bulkUpdate, and bulkDelete all succeed", async () => {
      const created = await ops(spec, suite).bulkCreate([
        spec.makeWrite(uniqueName(`${spec.key}-bulk`)),
        spec.makeWrite(uniqueName(`${spec.key}-bulk`)),
      ]);
      expect(created.succeeded).toBe(2);
      expect(created.failed).toBe(0);
      const ids = created.results.filter((row) => !isBulkFailure(row)).map((row) => row.id!);

      const updated = await ops(spec, suite).bulkUpdate(
        ids.map((id) => ({ ...spec.makePatch({ name: uniqueName(`${spec.key}-bulk-renamed`) } as never), id }))
      );
      expect(updated.succeeded).toBe(2);
      expect(updated.failed).toBe(0);

      const deleted = await ops(spec, suite).bulkDelete(ids);
      expect(deleted.succeeded).toBe(2);
      expect(deleted.failed).toBe(0);
    });

    describe("pagination", () => {
      const ROW_COUNT = 4;
      const PER_PAGE = 2;
      let ids: string[] = [];
      let marker: string;

      beforeAll(async () => {
        marker = uniqueName(`${spec.key}-pg`);
        const items = Array.from({ length: ROW_COUNT }, (_, i) =>
          spec.makeWrite(uniqueName(`${spec.key}-pg-row`), {
            external_source: marker,
            external_id: String(i),
          } as Partial<AnyWrite>)
        );
        const result = await ops(spec, suite).bulkCreate(items);
        ids = result.results.map((row) => row.id!);
      });

      afterAll(async () => {
        if (ids.length === 0) return;
        await ops(spec, suite).bulkDelete(ids);
      });

      it("offset: one page reports next + total_count; iterate() follows every page", async () => {
        const page = await ops(spec, suite).list({ external_source: marker, per_page: PER_PAGE });
        expect(page.data).toHaveLength(PER_PAGE);
        expect("next" in page && page.next).not.toBeNull();
        expect("total_count" in page && page.total_count).toBe(ROW_COUNT);

        const rows = [];
        for await (const row of ops(spec, suite).iterate({ external_source: marker, per_page: PER_PAGE })) {
          rows.push(row);
        }
        expect(new Set(rows.map((r) => r.id))).toEqual(new Set(ids));
      });

      it("cursor: one page uses the cursor envelope (with an explicit cursor-safe order_by)", async () => {
        const page = await ops(spec, suite).list({
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
        let caught: PlaneApiError | undefined;
        try {
          await ops(spec, suite).list({ paginate: "cursor" });
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
