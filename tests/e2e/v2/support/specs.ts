/**
 * `states`/`labels` share the same `V2Resource` kernel, so this suite is written once per behavior and driven over both via `SPECS`.
 */
import { PlaneClient } from "../../../../src/client/plane-client";
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

export interface ResourceSpec<TRead, TWrite, TPatch> {
  key: "states" | "labels";
  makeWrite(name: string, overrides?: Partial<TWrite>): TWrite;
  makePatch(fields: Partial<TWrite>): TPatch;
  chained(client: PlaneClient, workspaceSlug: string, project: string): ResourceOps<TRead, TWrite, TPatch>;
}

const statesSpec: ResourceSpec<State, CreateState, UpdateState> = {
  key: "states",
  makeWrite: (name, overrides = {}) => ({ name, color: DEFAULT_COLOR, ...overrides }),
  makePatch: (fields) => ({ ...fields }),
  chained: (client, workspaceSlug, project) => client.v2.workspace(workspaceSlug).project(project).states,
};

const labelsSpec: ResourceSpec<Label, CreateLabel, UpdateLabel> = {
  key: "labels",
  makeWrite: (name, overrides = {}) => ({ name, color: DEFAULT_COLOR, ...overrides }),
  makePatch: (fields) => ({ ...fields }),
  chained: (client, workspaceSlug, project) => client.v2.workspace(workspaceSlug).project(project).labels,
};

/**
 * `TRead`/`TWrite`/`TPatch` are erased to the union here; each test gets real, resource-specific typing when driving `.states`/`.labels` directly.
 */
export const SPECS: ResourceSpec<State | Label, CreateState | CreateLabel, UpdateState | UpdateLabel>[] = [
  statesSpec as unknown as ResourceSpec<State | Label, CreateState | CreateLabel, UpdateState | UpdateLabel>,
  labelsSpec as unknown as ResourceSpec<State | Label, CreateState | CreateLabel, UpdateState | UpdateLabel>,
];
