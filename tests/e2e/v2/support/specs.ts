/**
 * `states`/`labels` share the same `V2Resource` kernel, so this suite is written once per behavior and driven over both via `SPECS`.
 *
 * Each spec also knows both ways into the SDK — {@link ResourceSpec.flat} passes the two
 * path ids per call, {@link ResourceSpec.navigated} takes them off a fetched project row
 * — so the behavior suites run twice over the same assertions rather than picking one
 * shape and leaving the other unexercised against a live server.
 */
import { PlaneClient } from "../../../../src/client/plane-client";
import { LoadedProject } from "../../../../src/api/v2/loaded/Project";
import { V2Suite } from "./suite";
import { Label, UpdateLabel, CreateLabel } from "../../../../src/models/v2/Label";
import { State, UpdateState, CreateState } from "../../../../src/models/v2/State";
import { BulkUpdateItem, BulkWriteResponse, Page } from "../../../../src/models/v2/common";

export const DEFAULT_COLOR = "#336699";

export interface ResourceOps<TRead, TWrite, TPatch> {
  list(params?: Record<string, unknown>): Promise<Page<TRead>>;
  iterate(params?: Record<string, unknown>): AsyncGenerator<TRead>;
  retrieve(id: string, params?: Record<string, unknown>): Promise<TRead>;
  findByName(name: string): Promise<TRead>;
  create(data: TWrite): Promise<TRead>;
  update(id: string, data: TPatch): Promise<TRead>;
  delete(id: string): Promise<void>;
  upsert(data: TWrite): Promise<TRead>;
  bulkCreate(items: TWrite[], allOrNone?: boolean): Promise<BulkWriteResponse>;
  bulkUpdate(items: BulkUpdateItem<TPatch>[], allOrNone?: boolean): Promise<BulkWriteResponse>;
  bulkDelete(ids: string[], allOrNone?: boolean): Promise<BulkWriteResponse>;
}

/**
 * Which way into the SDK a behavior suite is currently driving.
 *
 * Named in the test title so a failure says which shape broke: the two reach the same
 * HTTP, but only through different code — `owned()`'s positional prepending is only on
 * the `navigated` path.
 */
export type WayIn = "flat" | "navigated";

export const WAYS_IN: readonly WayIn[] = ["flat", "navigated"];

export interface ResourceSpec<TRead, TWrite, TPatch> {
  key: "states" | "labels";
  makeWrite(name: string, overrides?: Partial<TWrite>): TWrite;
  makePatch(fields: Partial<TWrite>): TPatch;
  /** The flat form: `v2.workspaces.projects.<key>`, both path ids passed on every call. */
  flat(client: PlaneClient, workspaceSlug: string, project: string): ResourceOps<TRead, TWrite, TPatch>;
  /** The navigated form: the same methods off a fetched project row, with the ids bound. */
  navigated(project: LoadedProject): ResourceOps<TRead, TWrite, TPatch>;
}

const statesSpec: ResourceSpec<State, CreateState, UpdateState> = {
  key: "states",
  makeWrite: (name, overrides = {}) => ({ name, color: DEFAULT_COLOR, ...overrides }),
  makePatch: (fields) => ({ ...fields }),
  flat: (client, slug, project) => {
    const states = client.v2.workspaces.projects.states;
    return {
      list: (params) => states.list(slug, project, params),
      iterate: (params) => states.iterate(slug, project, params),
      retrieve: (id, params) => states.retrieve(slug, project, id, params),
      findByName: (name) => states.findByName(slug, project, name),
      create: (data) => states.create(slug, project, data),
      update: (id, data) => states.update(slug, project, id, data),
      delete: (id) => states.delete(slug, project, id),
      upsert: (data) => states.upsert(slug, project, data),
      bulkCreate: (items, allOrNone) => states.bulkCreate(slug, project, items, allOrNone),
      bulkUpdate: (items, allOrNone) => states.bulkUpdate(slug, project, items, allOrNone),
      bulkDelete: (ids, allOrNone) => states.bulkDelete(slug, project, ids, allOrNone),
    };
  },
  navigated: (project) => project.states,
};

const labelsSpec: ResourceSpec<Label, CreateLabel, UpdateLabel> = {
  key: "labels",
  makeWrite: (name, overrides = {}) => ({ name, color: DEFAULT_COLOR, ...overrides }),
  makePatch: (fields) => ({ ...fields }),
  flat: (client, slug, project) => {
    const labels = client.v2.workspaces.projects.labels;
    return {
      list: (params) => labels.list(slug, project, params),
      iterate: (params) => labels.iterate(slug, project, params),
      retrieve: (id, params) => labels.retrieve(slug, project, id, params),
      findByName: (name) => labels.findByName(slug, project, name),
      create: (data) => labels.create(slug, project, data),
      update: (id, data) => labels.update(slug, project, id, data),
      delete: (id) => labels.delete(slug, project, id),
      upsert: (data) => labels.upsert(slug, project, data),
      bulkCreate: (items, allOrNone) => labels.bulkCreate(slug, project, items, allOrNone),
      bulkUpdate: (items, allOrNone) => labels.bulkUpdate(slug, project, items, allOrNone),
      bulkDelete: (ids, allOrNone) => labels.bulkDelete(slug, project, ids, allOrNone),
    };
  },
  navigated: (project) => project.labels,
};

/**
 * `TRead`/`TWrite`/`TPatch` are erased to the union here; each test gets real, resource-specific typing when driving `.states`/`.labels` directly.
 */
export const SPECS: ResourceSpec<State | Label, CreateState | CreateLabel, UpdateState | UpdateLabel>[] = [
  statesSpec as unknown as ResourceSpec<State | Label, CreateState | CreateLabel, UpdateState | UpdateLabel>,
  labelsSpec as unknown as ResourceSpec<State | Label, CreateState | CreateLabel, UpdateState | UpdateLabel>,
];

/**
 * The spec's operations, driven the requested way.
 *
 * Suites that only need one shape name it once at the top of the file and say why;
 * `crud.e2e.test.ts` runs its whole body over both. Between them every method on
 * `ResourceOps` — `list`, `iterate`, `retrieve`, `findByName`, the three `bulk*`, and the
 * plain writes — is exercised navigated at least once, which is what proves `owned()`
 * prepends the project's two ids into the right leading parameters against a live server.
 */
export function opsFor<TRead, TWrite, TPatch>(
  spec: ResourceSpec<TRead, TWrite, TPatch>,
  way: WayIn,
  suite: V2Suite
): ResourceOps<TRead, TWrite, TPatch> {
  return way === "flat"
    ? spec.flat(suite.client, suite.workspaceSlug, suite.projectId)
    : spec.navigated(suite.projectRow);
}
