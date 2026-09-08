import { BulkUpdateItem, BulkWriteResponse, Page } from "../../../models/v2/common";
import { Module, UpdateModule, ModuleStatus, CreateModule } from "../../../models/v2/Module";
import { EXPAND, ModuleField, ModuleOrderBy } from "../generated/constants";
import { LoadedMeta, LoadsNavigableRows, NavigationFactories, owned } from "../kernel/loaded";
import { AnyOperationId } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import { LoadedModule, LoadedModuleRow, MODULE_ID_NAMES, ModuleNavigation } from "../loaded/Module";
import { ModuleWorkItems } from "./WorkItems";

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
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=`/`?expand=` on a single-row read. */
export interface ModuleShapeParams {
  fields?: readonly ModuleField[];
  expand?: readonly ModuleExpand[];
}

/**
 * Project modules.
 *
 * Reached flat — `v2.workspaces.projects.modules.list(slug, project)` — or from a fetched project,
 * which supplies both leading ids: `project.modules.list()`. Every row-returning method
 * answers a {@link LoadedModule}, so `module.workItems.add([...])` needs nothing repeated.
 */
export class Modules extends LoadsNavigableRows<Module, CreateModule, UpdateModule, ModuleNavigation> {
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
  };
  protected loadedIdNames = MODULE_ID_NAMES;

  /** `add`/`remove` work items on a module — see {@link ModuleWorkItems}. */
  public workItems: ModuleWorkItems;

  constructor(transport: V2Transport) {
    super(transport);
    this.workItems = new ModuleWorkItems(transport);
  }

  protected navigationOf(meta: LoadedMeta): NavigationFactories<ModuleNavigation> {
    const ids = meta.ids as [string, string, string];
    return { workItems: () => owned(this.workItems, ids, meta.idNames) };
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<ModuleField, "all"> & keyof Module>(
    slug: string,
    project: string,
    params: ListModulesParams & { fields: readonly F[] }
  ): Promise<Page<LoadedModuleRow<Pick<Module, F | "id">>>>;
  list(slug: string, project: string, params?: ListModulesParams): Promise<Page<LoadedModule>>;
  async list(slug: string, project: string, params?: ListModulesParams): Promise<Page<LoadedModule>> {
    const page = await this.doList({ slug, project_id: project }, params as Record<string, unknown>);
    return this.loadPage(page, [slug, project], params?.fields);
  }

  /** Every module in the project, following pages automatically — navigable rows included. */
  iterate<F extends Exclude<ModuleField, "all"> & keyof Module>(
    slug: string,
    project: string,
    params: Omit<ListModulesParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<LoadedModuleRow<Pick<Module, F | "id">>>;
  iterate(
    slug: string,
    project: string,
    params?: Omit<ListModulesParams, "offset" | "count">
  ): AsyncGenerator<LoadedModule>;
  iterate(
    slug: string,
    project: string,
    params?: Omit<ListModulesParams, "offset" | "count">
  ): AsyncGenerator<LoadedModule> {
    return this.loadIterate(
      this.doIterate({ slug, project_id: project }, params as Record<string, unknown>),
      [slug, project],
      params?.fields
    );
  }

  retrieve<F extends Exclude<ModuleField, "all"> & keyof Module>(
    slug: string,
    project: string,
    module: string,
    params: { fields: readonly F[]; expand?: readonly ModuleExpand[] }
  ): Promise<LoadedModuleRow<Pick<Module, F | "id">>>;
  retrieve(slug: string, project: string, module: string, params?: ModuleShapeParams): Promise<LoadedModule>;
  async retrieve(slug: string, project: string, module: string, params?: ModuleShapeParams): Promise<LoadedModule> {
    const row = await this.doRetrieve({ slug, project_id: project, pk: module }, params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  /** The one module with this name; throws if none or several match. Answers the same navigable row `retrieve` does. */
  async findByName(slug: string, project: string, name: string): Promise<LoadedModule> {
    const row = await this.doFindOne({ name }, { slug, project_id: project });
    return this.load(row, [slug, project]);
  }

  create<F extends Exclude<ModuleField, "all"> & keyof Module>(
    slug: string,
    project: string,
    data: CreateModule,
    params: ModuleShapeParams & { fields: readonly F[] }
  ): Promise<LoadedModuleRow<Pick<Module, F | "id">>>;
  create(slug: string, project: string, data: CreateModule, params?: ModuleShapeParams): Promise<LoadedModule>;
  async create(slug: string, project: string, data: CreateModule, params?: ModuleShapeParams): Promise<LoadedModule> {
    const row = await this.doCreate(data, { slug, project_id: project }, params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  update<F extends Exclude<ModuleField, "all"> & keyof Module>(
    slug: string,
    project: string,
    module: string,
    data: UpdateModule,
    params: ModuleShapeParams & { fields: readonly F[] }
  ): Promise<LoadedModuleRow<Pick<Module, F | "id">>>;
  update(
    slug: string,
    project: string,
    module: string,
    data: UpdateModule,
    params?: ModuleShapeParams
  ): Promise<LoadedModule>;
  async update(
    slug: string,
    project: string,
    module: string,
    data: UpdateModule,
    params?: ModuleShapeParams
  ): Promise<LoadedModule> {
    const row = await this.doUpdate(data, { slug, project_id: project, pk: module }, params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  delete(slug: string, project: string, module: string): Promise<void> {
    return this.doDelete({ slug, project_id: project, pk: module });
  }

  /** Reconciles on (external_source, external_id) when both are set. */
  upsert<F extends Exclude<ModuleField, "all"> & keyof Module>(
    slug: string,
    project: string,
    data: CreateModule,
    params: ModuleShapeParams & { fields: readonly F[] }
  ): Promise<LoadedModuleRow<Pick<Module, F | "id">>>;
  upsert(slug: string, project: string, data: CreateModule, params?: ModuleShapeParams): Promise<LoadedModule>;
  async upsert(slug: string, project: string, data: CreateModule, params?: ModuleShapeParams): Promise<LoadedModule> {
    const row = await this.doUpsert(data, { slug, project_id: project }, params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  bulkCreate(slug: string, project: string, items: CreateModule[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkCreate(items, { slug, project_id: project }, allOrNone);
  }

  bulkUpdate(
    slug: string,
    project: string,
    items: BulkUpdateItem<UpdateModule>[],
    allOrNone = false
  ): Promise<BulkWriteResponse> {
    return this.doBulkUpdate(items, { slug, project_id: project }, allOrNone);
  }

  bulkDelete(slug: string, project: string, ids: string[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkDelete(ids, { slug, project_id: project }, allOrNone);
  }
}

export { ModuleWorkItems } from "./WorkItems";
