/**
 * Cycles/Modules/Milestones share `V2Resource` behavior, tested once here via the shared `SPECS` table.
 */
import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Cycles } from "../../../src/api/v2/Cycles";
import { CycleField } from "../../../src/api/v2/generated/constants";
import { Milestones } from "../../../src/api/v2/Milestones";
import { Modules } from "../../../src/api/v2/Modules";
import { Cycle, UpdateCycle, CreateCycle } from "../../../src/models/v2/Cycle";
import { BulkUpdateItem, BulkWriteResponse, Page } from "../../../src/models/v2/common";
import { Milestone, UpdateMilestone, CreateMilestone } from "../../../src/models/v2/Milestone";
import { Module, UpdateModule, CreateModule } from "../../../src/models/v2/Module";
import { V2Transport } from "../../../src/api/v2/kernel/transport";
import { PlaneApiError } from "../../../src/errors/PlaneApiError";

const BASE = "https://api.example.com";
const makeTransport = () => new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" }));
const SLUG = "acme";
const PROJECT = "ENG";

/** Widens a plain-object write/read value to a nock-friendly matcher/index shape. */
const asRecord = (value: unknown): Record<string, unknown> => value as Record<string, unknown>;

/**
 * The shape all three resources share, **with the two leading path ids already supplied**.
 *
 * All three are flat now — `list(slug, project, params)` — so the table below binds the ids
 * once through {@link bind} and goes on asking one question per row. The ids are still
 * really passed per call; nothing here holds a scope.
 */
interface ResourceOps<TRead, TWrite, TPatch> {
  list: (params?: Record<string, unknown>) => Promise<Page<TRead>>;
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

interface ResourceSpec<TRead, TWrite, TPatch> {
  key: "cycles" | "modules" | "milestones";
  /** The url path segment, and the field the golden's `?name=` filter actually matches. */
  segment: string;
  identityField: "name" | "title";
  make: () => ResourceOps<TRead, TWrite, TPatch>;
  makeWrite: (label: string) => TWrite;
}

/** The flat resource with `(slug, project)` prepended to every method — see {@link ResourceOps}. */
function bind<TRead, TWrite, TPatch>(resource: {
  list(slug: string, project: string, params?: never): Promise<Page<TRead>>;
  retrieve(slug: string, project: string, id: string, params?: never): Promise<TRead>;
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
}): ResourceOps<TRead, TWrite, TPatch> {
  return {
    list: (params) => resource.list(SLUG, PROJECT, params as never),
    retrieve: (id, params) => resource.retrieve(SLUG, PROJECT, id, params as never),
    findByName: (name) => resource.findByName(SLUG, PROJECT, name),
    create: (data) => resource.create(SLUG, PROJECT, data),
    update: (id, data) => resource.update(SLUG, PROJECT, id, data),
    delete: (id) => resource.delete(SLUG, PROJECT, id),
    upsert: (data) => resource.upsert(SLUG, PROJECT, data),
    bulkCreate: (items, allOrNone) => resource.bulkCreate(SLUG, PROJECT, items, allOrNone),
    bulkUpdate: (items, allOrNone) => resource.bulkUpdate(SLUG, PROJECT, items, allOrNone),
    bulkDelete: (ids, allOrNone) => resource.bulkDelete(SLUG, PROJECT, ids, allOrNone),
  };
}

const cyclesSpec: ResourceSpec<Cycle, CreateCycle, UpdateCycle> = {
  key: "cycles",
  segment: "cycles",
  identityField: "name",
  make: () => bind(new Cycles(makeTransport())),
  makeWrite: (label) => ({ name: label }),
};

const modulesSpec: ResourceSpec<Module, CreateModule, UpdateModule> = {
  key: "modules",
  segment: "modules",
  identityField: "name",
  make: () => bind(new Modules(makeTransport())),
  makeWrite: (label) => ({ name: label }),
};

const milestonesSpec: ResourceSpec<Milestone, CreateMilestone, UpdateMilestone> = {
  key: "milestones",
  segment: "milestones",
  identityField: "title",
  make: () => bind(new Milestones(makeTransport())),
  makeWrite: (label) => ({ title: label }),
};

type AnyRead = Cycle | Module | Milestone;
type AnyWrite = CreateCycle | CreateModule | CreateMilestone;
type AnyPatch = UpdateCycle | UpdateModule | UpdateMilestone;

const SPECS: ResourceSpec<AnyRead, AnyWrite, AnyPatch>[] = [
  cyclesSpec as unknown as ResourceSpec<AnyRead, AnyWrite, AnyPatch>,
  modulesSpec as unknown as ResourceSpec<AnyRead, AnyWrite, AnyPatch>,
  milestonesSpec as unknown as ResourceSpec<AnyRead, AnyWrite, AnyPatch>,
];

afterEach(() => nock.cleanAll());

describe.each(SPECS)("$key (v2, offline)", (spec) => {
  const collectionPath = `/api/v2/workspaces/acme/projects/ENG/${spec.segment}/`;

  it("lists at the resource's own collection url", async () => {
    nock(BASE)
      .get(collectionPath)
      .reply(200, { data: [{ id: "1" }], pagination: { style: "offset" } });

    const page = await spec.make().list();

    expect(page.data[0].id).toBe("1");
  });

  it("sparse `fields` leaves unrequested fields undefined", async () => {
    nock(BASE)
      .get(collectionPath)
      .query({ fields: "id" })
      .reply(200, { data: [{ id: "1" }], pagination: { style: "offset" } });

    const page = await spec.make().list({ fields: ["id"] });

    expect(page.data[0].id).toBe("1");
    expect(asRecord(page.data[0])[spec.identityField]).toBeUndefined();
  });

  it("rejects an unknown field before making the request", async () => {
    await expect(spec.make().list({ fields: ["nope"] })).rejects.toThrow(/nope/);
  });

  it("retrieves by id, percent-encoded", async () => {
    nock(BASE).get(`${collectionPath}In%20Progress%2FDone/`).reply(200, { id: "In Progress/Done" });

    const row = await spec.make().retrieve("In Progress/Done");

    expect(row.id).toBe("In Progress/Done");
  });

  it("creates then PATCHes", async () => {
    const writeBody = spec.makeWrite("Alpha");
    let capturedCreateBody: unknown;
    nock(BASE)
      .post(collectionPath, (body: unknown) => {
        capturedCreateBody = body;
        return true;
      })
      .reply(201, { id: "1", ...writeBody });
    nock(BASE)
      .patch(`${collectionPath}1/`, { [spec.identityField]: "Beta" })
      .reply(200, { id: "1", [spec.identityField]: "Beta" });

    const resource = spec.make();
    const created = await resource.create(writeBody);
    expect(capturedCreateBody).toEqual(writeBody);
    const updated = asRecord(await resource.update(created.id, { [spec.identityField]: "Beta" } as AnyPatch));

    expect(updated[spec.identityField]).toBe("Beta");
  });

  it("deletes without a body, then a retrieve 404s as PlaneApiError", async () => {
    nock(BASE).delete(`${collectionPath}1/`).reply(204);
    nock(BASE)
      .get(`${collectionPath}1/`)
      .reply(404, { type: "not_found_error", title: "Not Found", status: 404, code: "not_found", detail: "gone" });

    const resource = spec.make();
    await expect(resource.delete("1")).resolves.toBeUndefined();
    await expect(resource.retrieve("1")).rejects.toMatchObject<Partial<PlaneApiError>>({
      status: 404,
      code: "not_found",
    });
  });

  it("findByName filters on `?name=`, matching a single row", async () => {
    nock(BASE)
      .get(collectionPath)
      .query({ name: "Todo", per_page: "2", count: "false" })
      .reply(200, { data: [{ id: "1", [spec.identityField]: "Todo" }], pagination: { style: "offset" } });

    const found = asRecord(await spec.make().findByName("Todo"));

    expect(found.id).toBe("1");
  });

  it("upserts against the upsert/ route", async () => {
    nock(BASE).post(`${collectionPath}upsert/`).reply(200, { id: "1" });

    const row = await spec.make().upsert(spec.makeWrite("Todo"));

    expect(row.id).toBe("1");
  });

  it("posts items/all_or_none envelopes to the three bulk routes", async () => {
    const resource = spec.make();

    let bulkCreateBody: unknown;
    nock(BASE)
      .post(`${collectionPath}bulk-create/`, (body: unknown) => {
        bulkCreateBody = body;
        return true;
      })
      .reply(200, { results: [{ index: 0, result: "created", id: "1" }], succeeded: 1, failed: 0 });
    const created = await resource.bulkCreate([spec.makeWrite("A")]);
    expect(bulkCreateBody).toEqual({ items: [spec.makeWrite("A")], all_or_none: false });
    expect(created.succeeded).toBe(1);

    let bulkUpdateBody: unknown;
    nock(BASE)
      .post(`${collectionPath}bulk-update/`, (body: unknown) => {
        bulkUpdateBody = body;
        return true;
      })
      .reply(200, { results: [{ index: 0, result: "updated", id: "1" }], succeeded: 1, failed: 0 });
    const patch = { [spec.identityField]: "B" } as AnyPatch;
    await resource.bulkUpdate([{ ...patch, id: "1" }], true);
    expect(bulkUpdateBody).toEqual({ items: [{ ...patch, id: "1" }], all_or_none: true });

    let bulkDeleteBody: unknown;
    nock(BASE)
      .post(`${collectionPath}bulk-delete/`, (body: unknown) => {
        bulkDeleteBody = body;
        return true;
      })
      .reply(200, { results: [{ index: 0, result: "deleted", id: "1" }], succeeded: 1, failed: 0 });
    await resource.bulkDelete(["1"]);
    expect(bulkDeleteBody).toEqual({ ids: ["1"], all_or_none: false });
  });

  it("rejects an empty bulk batch client-side, never hitting the network", async () => {
    const resource = spec.make();
    await expect(resource.bulkCreate([])).rejects.toThrow(/non-empty/);
    await expect(resource.bulkUpdate([])).rejects.toThrow(/non-empty/);
    await expect(resource.bulkDelete([])).rejects.toThrow(/non-empty/);
  });

  it("passes a valid order_by through, and rejects an unknown one client-side", async () => {
    const scope = nock(BASE)
      .get(collectionPath)
      .query({ order_by: "-created_at" })
      .reply(200, { data: [], pagination: { style: "offset" } });

    await spec.make().list({ order_by: "-created_at" });
    expect(scope.isDone()).toBe(true);

    await expect(spec.make().list({ order_by: "nope" as never })).rejects.toThrow(/Unknown order_by 'nope'/);
  });
});

describe("Cycles (v2, offline) — expand", () => {
  it("encodes a valid expand value and rejects an unknown one", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/cycles/")
      .query({ expand: "owned_by" })
      .reply(200, { data: [], pagination: { style: "offset" } });

    await new Cycles(makeTransport()).list(SLUG, PROJECT, { expand: ["owned_by"] });
    expect(scope.isDone()).toBe(true);

    await expect(new Cycles(makeTransport()).list(SLUG, PROJECT, { expand: ["nope" as never] })).rejects.toThrow(
      /Unknown expand value\(s\) for cycles_list: nope/
    );
  });

  it("narrows the row type to the requested fields", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/cycles/")
      .query({ fields: "id,name" })
      .reply(200, { data: [{ id: "1", name: "Sprint 1" }], pagination: { style: "offset" } });

    const dynamicFields: CycleField[] = ["id", "name"];
    const page = await new Cycles(makeTransport()).list(SLUG, PROJECT, { fields: dynamicFields });

    expect(page.data[0].name).toBe("Sprint 1");
  });
});

describe("Modules (v2, offline) — expand and status filters", () => {
  it("encodes both expand values, joined, and rejects an unknown one", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/modules/")
      .query({ expand: "lead,members" })
      .reply(200, { data: [], pagination: { style: "offset" } });

    await new Modules(makeTransport()).list(SLUG, PROJECT, { expand: ["lead", "members"] });
    expect(scope.isDone()).toBe(true);

    await expect(new Modules(makeTransport()).list(SLUG, PROJECT, { expand: ["nope" as never] })).rejects.toThrow(
      /Unknown expand value\(s\) for modules_list: nope/
    );
  });

  it("joins a status__in array into a comma-separated query value", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/modules/")
      .query({ status__in: "backlog,planned" })
      .reply(200, { data: [], pagination: { style: "offset" } });

    await new Modules(makeTransport()).list(SLUG, PROJECT, { status__in: ["backlog", "planned"] });
    expect(scope.isDone()).toBe(true);
  });

  it("filters by a single status", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/modules/")
      .query({ status: "completed" })
      .reply(200, { data: [], pagination: { style: "offset" } });

    await new Modules(makeTransport()).list(SLUG, PROJECT, { status: "completed" });
    expect(scope.isDone()).toBe(true);
  });
});

describe("Milestones (v2, offline) — no expand support", () => {
  it("rejects expand on an operation that carries no `expand` enum in the golden", async () => {
    // `ListMilestonesParams` has no `expand` field at all — the golden's milestones_list
    // never gained one — so this is deliberately typed around to exercise the kernel's
    // runtime guard (`encodeExpand`) for this operation id specifically.
    const params = { expand: ["anything"] } as unknown as Parameters<Milestones["list"]>[2];
    await expect(new Milestones(makeTransport()).list(SLUG, PROJECT, params)).rejects.toThrow(
      /milestones_list does not support the expand parameter/
    );
  });

  it("reads back `title`, not `name`, on the row", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/projects/ENG/milestones/")
      .reply(200, { data: [{ id: "1", title: "Launch" }], pagination: { style: "offset" } });

    const page = await new Milestones(makeTransport()).list(SLUG, PROJECT);

    expect(page.data[0].title).toBe("Launch");
  });

  it("write body carries `title`, not `name`", async () => {
    const scope = nock(BASE)
      .post("/api/v2/workspaces/acme/projects/ENG/milestones/", { title: "Launch" })
      .reply(201, { id: "1", title: "Launch" });

    await new Milestones(makeTransport()).create(SLUG, PROJECT, { title: "Launch" });
    expect(scope.isDone()).toBe(true);
  });
});
