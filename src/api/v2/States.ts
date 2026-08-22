import { BulkUpdateItem, BulkWriteResponse, Page } from "../../models/v2/common";
import { State, UpdateState, CreateState } from "../../models/v2/State";
import { StateField, StateOrderBy } from "./generated/constants";
import { AnyOperationId, V2Resource } from "./kernel/resource";

export interface ListStatesParams {
  fields?: readonly StateField[];
  name?: string;
  group?: string;
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

/** Project states, reached via `client.v2.workspace(slug).project(project).states`. */
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
    params: ListStatesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<State, F | "id">>>;
  list(params?: ListStatesParams): Promise<Page<State>>;
  list(params?: ListStatesParams): Promise<Page<State>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every state, following pages automatically. */
  iterate(params?: ListStatesParams): AsyncGenerator<State> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<StateField, "all"> & keyof State>(
    stateId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<State, F | "id">>;
  retrieve(stateId: string, params?: { fields?: readonly StateField[] }): Promise<State>;
  retrieve(stateId: string, params?: { fields?: readonly StateField[] }): Promise<State> {
    return this.doRetrieve({ pk: stateId }, params as Record<string, unknown>);
  }

  /** The one state with this name; throws if none or several match. */
  findByName(name: string): Promise<State> {
    return this.doFindOne({ name }, {});
  }

  create(data: CreateState): Promise<State> {
    return this.doCreate(data, {});
  }

  update(stateId: string, data: UpdateState): Promise<State> {
    return this.doUpdate(data, { pk: stateId });
  }

  delete(stateId: string): Promise<void> {
    return this.doDelete({ pk: stateId });
  }

  /** Reconciles on (external_source, external_id) when both are set. */
  upsert(data: CreateState): Promise<State> {
    return this.doUpsert(data, {});
  }

  bulkCreate(items: CreateState[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkCreate(items, {}, allOrNone);
  }

  bulkUpdate(items: BulkUpdateItem<UpdateState>[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkUpdate(items, {}, allOrNone);
  }

  bulkDelete(ids: string[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkDelete(ids, {}, allOrNone);
  }
}
