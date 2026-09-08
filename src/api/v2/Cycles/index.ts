import { BulkUpdateItem, BulkWriteResponse, Page } from "../../../models/v2/common";
import { Cycle, UpdateCycle, CreateCycle } from "../../../models/v2/Cycle";
import { CycleTransferRequest, CycleTransferResult } from "../../../models/v2/CycleTransfer";
import { CycleField, CycleOrderBy, EXPAND } from "../generated/constants";
import { LoadedMeta, LoadsNavigableRows, NavigationFactories, owned } from "../kernel/loaded";
import { AnyOperationId } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import { CYCLE_ID_NAMES, CycleNavigation, LoadedCycle, LoadedCycleRow } from "../loaded/Cycle";
import { CycleWorkItems } from "./WorkItems";

/** `cycles_list`'s only expand target — the cycle's owner as a full object instead of `owned_by_id`. */
export type CycleExpand = (typeof EXPAND)["cycles_list"][number];

export interface ListCyclesParams {
  fields?: readonly CycleField[];
  name?: string;
  owned_by_id?: string;
  external_id?: string;
  external_source?: string;
  search?: string;
  expand?: readonly CycleExpand[];
  order_by?: CycleOrderBy;
  offset?: number;
  per_page?: number;
  /** `"cursor"` opts into the cursor envelope; pair with a cursor-safe `order_by` or expect a 400. */
  paginate?: "cursor";
  count?: boolean;
}

/** `?fields=`/`?expand=` on a single-row read. */
export interface CycleShapeParams {
  fields?: readonly CycleField[];
  expand?: readonly CycleExpand[];
}

/**
 * Project cycles.
 *
 * Reached flat — `v2.projects.cycles.list(slug, project)` — or from a fetched project,
 * which supplies both leading ids: `project.cycles.list()`. Every row-returning method
 * answers a {@link LoadedCycle}, so `cycle.workItems.add([...])` needs nothing repeated.
 *
 * `transfer` has a request body and a response envelope of its own, so it goes through
 * `doCustomAction` rather than the bodiless `doAction`; membership is `workItems`.
 */
export class Cycles extends LoadsNavigableRows<Cycle, CreateCycle, UpdateCycle, CycleNavigation> {
  protected path = "/workspaces/{slug}/projects/{project_id}/cycles/";
  protected operations: Record<string, AnyOperationId> = {
    list: "cycles_list",
    retrieve: "cycles_retrieve",
    create: "cycles_create",
    update: "cycles_partial_update",
    upsert: "cycles_upsert",
    delete: "cycles_destroy",
    bulkCreate: "cycles_bulk_create",
    bulkUpdate: "cycles_bulk_update",
    bulkDelete: "cycles_bulk_delete",
    transfer: "cycles_transfer",
  };
  protected loadedIdNames = CYCLE_ID_NAMES;

  /** `add`/`remove` work items on a cycle — see {@link CycleWorkItems}. */
  public workItems: CycleWorkItems;

  constructor(transport: V2Transport) {
    super(transport);
    this.workItems = new CycleWorkItems(transport);
  }

  protected navigationOf(meta: LoadedMeta): NavigationFactories<CycleNavigation> {
    const ids = meta.ids as [string, string, string];
    return { workItems: () => owned(this.workItems, ids, meta.idNames) };
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<CycleField, "all"> & keyof Cycle>(
    slug: string,
    project: string,
    params: ListCyclesParams & { fields: readonly F[] }
  ): Promise<Page<LoadedCycleRow<Pick<Cycle, F | "id">>>>;
  list(slug: string, project: string, params?: ListCyclesParams): Promise<Page<LoadedCycle>>;
  async list(slug: string, project: string, params?: ListCyclesParams): Promise<Page<LoadedCycle>> {
    const page = await this.doList({ slug, project_id: project }, params as Record<string, unknown>);
    return this.loadPage(page, [slug, project], params?.fields);
  }

  /** Every cycle in the project, following pages automatically — navigable rows included. */
  iterate<F extends Exclude<CycleField, "all"> & keyof Cycle>(
    slug: string,
    project: string,
    params: ListCyclesParams & { fields: readonly F[] }
  ): AsyncGenerator<LoadedCycleRow<Pick<Cycle, F | "id">>>;
  iterate(slug: string, project: string, params?: ListCyclesParams): AsyncGenerator<LoadedCycle>;
  iterate(slug: string, project: string, params?: ListCyclesParams): AsyncGenerator<LoadedCycle> {
    return this.loadIterate(
      this.doIterate({ slug, project_id: project }, params as Record<string, unknown>),
      [slug, project],
      params?.fields
    );
  }

  retrieve<F extends Exclude<CycleField, "all"> & keyof Cycle>(
    slug: string,
    project: string,
    cycle: string,
    params: { fields: readonly F[]; expand?: readonly CycleExpand[] }
  ): Promise<LoadedCycleRow<Pick<Cycle, F | "id">>>;
  retrieve(slug: string, project: string, cycle: string, params?: CycleShapeParams): Promise<LoadedCycle>;
  async retrieve(slug: string, project: string, cycle: string, params?: CycleShapeParams): Promise<LoadedCycle> {
    const row = await this.doRetrieve({ slug, project_id: project, pk: cycle }, params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  /** The one cycle with this name; throws if none or several match. Answers the same navigable row `retrieve` does. */
  async findByName(slug: string, project: string, name: string): Promise<LoadedCycle> {
    const row = await this.doFindOne({ name }, { slug, project_id: project });
    return this.load(row, [slug, project]);
  }

  create<F extends Exclude<CycleField, "all"> & keyof Cycle>(
    slug: string,
    project: string,
    data: CreateCycle,
    params: CycleShapeParams & { fields: readonly F[] }
  ): Promise<LoadedCycleRow<Pick<Cycle, F | "id">>>;
  create(slug: string, project: string, data: CreateCycle, params?: CycleShapeParams): Promise<LoadedCycle>;
  async create(slug: string, project: string, data: CreateCycle, params?: CycleShapeParams): Promise<LoadedCycle> {
    const row = await this.doCreate(data, { slug, project_id: project }, params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  update<F extends Exclude<CycleField, "all"> & keyof Cycle>(
    slug: string,
    project: string,
    cycle: string,
    data: UpdateCycle,
    params: CycleShapeParams & { fields: readonly F[] }
  ): Promise<LoadedCycleRow<Pick<Cycle, F | "id">>>;
  update(
    slug: string,
    project: string,
    cycle: string,
    data: UpdateCycle,
    params?: CycleShapeParams
  ): Promise<LoadedCycle>;
  async update(
    slug: string,
    project: string,
    cycle: string,
    data: UpdateCycle,
    params?: CycleShapeParams
  ): Promise<LoadedCycle> {
    const row = await this.doUpdate(data, { slug, project_id: project, pk: cycle }, params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  delete(slug: string, project: string, cycle: string): Promise<void> {
    return this.doDelete({ slug, project_id: project, pk: cycle });
  }

  /** Reconciles on (external_source, external_id) when both are set. */
  upsert<F extends Exclude<CycleField, "all"> & keyof Cycle>(
    slug: string,
    project: string,
    data: CreateCycle,
    params: CycleShapeParams & { fields: readonly F[] }
  ): Promise<LoadedCycleRow<Pick<Cycle, F | "id">>>;
  upsert(slug: string, project: string, data: CreateCycle, params?: CycleShapeParams): Promise<LoadedCycle>;
  async upsert(slug: string, project: string, data: CreateCycle, params?: CycleShapeParams): Promise<LoadedCycle> {
    const row = await this.doUpsert(data, { slug, project_id: project }, params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  bulkCreate(slug: string, project: string, items: CreateCycle[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkCreate(items, { slug, project_id: project }, allOrNone);
  }

  bulkUpdate(
    slug: string,
    project: string,
    items: BulkUpdateItem<UpdateCycle>[],
    allOrNone = false
  ): Promise<BulkWriteResponse> {
    return this.doBulkUpdate(items, { slug, project_id: project }, allOrNone);
  }

  bulkDelete(slug: string, project: string, ids: string[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkDelete(ids, { slug, project_id: project }, allOrNone);
  }

  /**
   * Move `cycle`'s incomplete work items into `data.new_cycle_id`; `cycle` must already be
   * completed. `new_cycle_id` is a request-body field, not a path id, so it keeps the
   * golden's own spelling.
   */
  transfer(slug: string, project: string, cycle: string, data: CycleTransferRequest): Promise<CycleTransferResult> {
    return this.doCustomAction<CycleTransferResult>("transfer", {
      method: "POST",
      pathParams: { slug, project_id: project },
      pk: cycle,
      data,
    });
  }
}

export { CycleWorkItems } from "./WorkItems";
