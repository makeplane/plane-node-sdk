import { BulkUpdateItem, BulkWriteResponse, Page } from "../../models/v2/common";
import { State, StateGroup, UpdateState, CreateState } from "../../models/v2/State";
import { StateField, StateOrderBy } from "./generated/constants";
import { AnyOperationId, V2Resource } from "./kernel/resource";

export interface ListStatesParams {
  fields?: readonly StateField[];
  name?: string;
  group?: StateGroup;
  /** Any of these groups — `?group__in=`, sent comma-separated. */
  group__in?: readonly StateGroup[];
  is_default?: boolean;
  external_id?: string;
  external_source?: string;
  search?: string;
  order_by?: StateOrderBy;
  offset?: number;
  per_page?: number;
  /** `"cursor"` opts into the cursor envelope; pair with a cursor-safe `order_by` or expect a 400. */
  paginate?: "cursor";
  count?: boolean;
}

/** `?fields=` on a single-row read or write. */
export interface StateFieldsParams {
  fields?: readonly StateField[];
}

/**
 * Project states.
 *
 * Reached flat — `v2.projects.states.list(slug, project)` — or from a fetched project,
 * which supplies both leading ids: `project.states.list()`. `project` accepts a project
 * UUID or its bare identifier (e.g. `ENG`).
 */
export class States extends V2Resource<State, CreateState, UpdateState> {
  protected path = "/workspaces/{slug}/projects/{project_id}/states/";
  protected operations: Record<string, AnyOperationId> = {
    list: "states_list",
    retrieve: "states_retrieve",
    create: "states_create",
    update: "states_partial_update",
    upsert: "states_upsert",
    delete: "states_destroy",
    bulkCreate: "states_bulk_create",
    bulkUpdate: "states_bulk_update",
    bulkDelete: "states_bulk_delete",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<StateField, "all"> & keyof State>(
    slug: string,
    project: string,
    params: ListStatesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<State, F | "id">>>;
  list(slug: string, project: string, params?: ListStatesParams): Promise<Page<State>>;
  list(slug: string, project: string, params?: ListStatesParams): Promise<Page<State>> {
    return this.doList({ slug, project_id: project }, params as Record<string, unknown>);
  }

  /** Every state in the project, following pages automatically. */
  iterate<F extends Exclude<StateField, "all"> & keyof State>(
    slug: string,
    project: string,
    params: ListStatesParams & { fields: readonly F[] }
  ): AsyncGenerator<Pick<State, F | "id">>;
  iterate(slug: string, project: string, params?: ListStatesParams): AsyncGenerator<State>;
  iterate(slug: string, project: string, params?: ListStatesParams): AsyncGenerator<State> {
    return this.doIterate({ slug, project_id: project }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<StateField, "all"> & keyof State>(
    slug: string,
    project: string,
    state: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<State, F | "id">>;
  retrieve(slug: string, project: string, state: string, params?: StateFieldsParams): Promise<State>;
  retrieve(slug: string, project: string, state: string, params?: StateFieldsParams): Promise<State> {
    return this.doRetrieve({ slug, project_id: project, pk: state }, params as Record<string, unknown>);
  }

  /** The one state with this name; throws if none or several match. */
  findByName(slug: string, project: string, name: string): Promise<State> {
    return this.doFindOne({ name }, { slug, project_id: project });
  }

  create(slug: string, project: string, data: CreateState, params?: StateFieldsParams): Promise<State> {
    return this.doCreate(data, { slug, project_id: project }, params as Record<string, unknown>);
  }

  update(slug: string, project: string, state: string, data: UpdateState, params?: StateFieldsParams): Promise<State> {
    return this.doUpdate(data, { slug, project_id: project, pk: state }, params as Record<string, unknown>);
  }

  delete(slug: string, project: string, state: string): Promise<void> {
    return this.doDelete({ slug, project_id: project, pk: state });
  }

  /** Reconciles on (external_source, external_id) when both are set. */
  upsert(slug: string, project: string, data: CreateState, params?: StateFieldsParams): Promise<State> {
    return this.doUpsert(data, { slug, project_id: project }, params as Record<string, unknown>);
  }

  bulkCreate(slug: string, project: string, items: CreateState[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkCreate(items, { slug, project_id: project }, allOrNone);
  }

  /** Each item is the patch plus the target `id`. */
  bulkUpdate(
    slug: string,
    project: string,
    items: BulkUpdateItem<UpdateState>[],
    allOrNone = false
  ): Promise<BulkWriteResponse> {
    return this.doBulkUpdate(items, { slug, project_id: project }, allOrNone);
  }

  bulkDelete(slug: string, project: string, ids: string[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkDelete(ids, { slug, project_id: project }, allOrNone);
  }
}
