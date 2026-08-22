import { BulkUpdateItem, BulkWriteResponse, Page } from "../../models/v2/common";
import { Module, UpdateModule, ModuleStatus, CreateModule } from "../../models/v2/Module";
import { ModuleWorkItemManageRequest, ModuleWorkItemManageResponse } from "../../models/v2/ModuleWorkItemManage";
import { EXPAND, ModuleField, ModuleOrderBy } from "./generated/constants";
import { AnyOperationId, V2Resource } from "./kernel/resource";

/** `modules_list`'s expand targets — the module's lead and members as full objects instead of `*_id(s)`. */
export type ModuleExpand = (typeof EXPAND)["modules_list"][number];

export interface ListModulesParams {
  fields?: readonly ModuleField[];
  name?: string;
  lead_id?: string;
  status?: ModuleStatus;
  status__in?: readonly ModuleStatus[];
  external_id?: string;
  external_source?: string;
  search?: string;
  expand?: readonly ModuleExpand[];
  order_by?: ModuleOrderBy;
  offset?: number;
  per_page?: number;
  /** `"cursor"` opts into the cursor envelope; pair with a cursor-safe `order_by` or expect a 400. */
  paginate?: "cursor";
  count?: boolean;
}

/** Project modules, reached bound to a project. `manageWorkItems` is hand-written since `doAction` only issues a bodiless POST. */
export class Modules extends V2Resource<Module, CreateModule, UpdateModule> {
  protected path = "/workspaces/{slug}/projects/{project_id}/modules/";
  protected operations: Record<string, AnyOperationId> = {
    list: "modules_list",
    retrieve: "modules_retrieve",
    create: "modules_create",
    update: "modules_partial_update",
    upsert: "modules_upsert",
    delete: "modules_destroy",
    bulkCreate: "modules_bulk_create",
    bulkUpdate: "modules_bulk_update",
    bulkDelete: "modules_bulk_delete",
    manageWorkItems: "modules_work_items_manage",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<ModuleField, "all"> & keyof Module>(
    params: ListModulesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<Module, F | "id">>>;
  list(params?: ListModulesParams): Promise<Page<Module>>;
  list(params?: ListModulesParams): Promise<Page<Module>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every module, following pages automatically. */
  iterate(params?: ListModulesParams): AsyncGenerator<Module> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<ModuleField, "all"> & keyof Module>(
    moduleId: string,
    params: { fields: readonly F[]; expand?: readonly ModuleExpand[] }
  ): Promise<Pick<Module, F | "id">>;
  retrieve(
    moduleId: string,
    params?: { fields?: readonly ModuleField[]; expand?: readonly ModuleExpand[] }
  ): Promise<Module>;
  retrieve(
    moduleId: string,
    params?: { fields?: readonly ModuleField[]; expand?: readonly ModuleExpand[] }
  ): Promise<Module> {
    return this.doRetrieve({ pk: moduleId }, params as Record<string, unknown>);
  }

  /** The one module with this name; throws if none or several match. */
  findByName(name: string): Promise<Module> {
    return this.doFindOne({ name }, {});
  }

  create(data: CreateModule): Promise<Module> {
    return this.doCreate(data, {});
  }

  update(moduleId: string, data: UpdateModule): Promise<Module> {
    return this.doUpdate(data, { pk: moduleId });
  }

  delete(moduleId: string): Promise<void> {
    return this.doDelete({ pk: moduleId });
  }

  /** Reconciles on (external_source, external_id) when both are set. */
  upsert(data: CreateModule): Promise<Module> {
    return this.doUpsert(data, {});
  }

  bulkCreate(items: CreateModule[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkCreate(items, {}, allOrNone);
  }

  bulkUpdate(items: BulkUpdateItem<UpdateModule>[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkUpdate(items, {}, allOrNone);
  }

  bulkDelete(ids: string[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkDelete(ids, {}, allOrNone);
  }

  /** Bulk add/remove work items on `moduleId`'s membership in one call. */
  async manageWorkItems(moduleId: string, data: ModuleWorkItemManageRequest): Promise<ModuleWorkItemManageResponse> {
    const url = `${this.detailUrl({ pk: moduleId })}work-items/`;
    return this.transport.request<ModuleWorkItemManageResponse>("POST", url, { data });
  }
}
