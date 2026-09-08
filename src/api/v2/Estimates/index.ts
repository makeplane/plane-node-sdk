import { BulkUpdateItem, BulkWriteResponse, Page } from "../../../models/v2/common";
import { Estimate, UpdateEstimate, EstimateType, CreateEstimate } from "../../../models/v2/Estimate";
import { EXPAND, FIELDS, ORDER_BY } from "../generated/constants";
import { LoadedMeta, LoadsNavigableRows, NavigationFactories, owned } from "../kernel/loaded";
import { AnyOperationId } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import { ESTIMATE_ID_NAMES, EstimateNavigation, LoadedEstimate, LoadedEstimateRow } from "../loaded/Estimate";
import { EstimatePoints } from "./Points";

export type EstimateField = (typeof FIELDS)["estimates_list"][number];
export type EstimateOrderBy = (typeof ORDER_BY)["estimates_list"][number];
/** Only `"points"` — inlines the estimate's point scale instead of a separate `estimatePoints.list()` call. */
export type EstimateExpand = (typeof EXPAND)["estimates_list"][number];

export interface ListEstimatesParams {
  fields?: readonly EstimateField[];
  name?: string;
  type?: EstimateType;
  type__in?: readonly EstimateType[];
  external_id?: string;
  external_source?: string;
  search?: string;
  expand?: readonly EstimateExpand[];
  order_by?: EstimateOrderBy;
  offset?: number;
  per_page?: number;
  /** `"cursor"` needs a cursor-safe `order_by` (e.g. `"created_at"`) or it 400s. */
  paginate?: "cursor";
  count?: boolean;
}

/** `?fields=`/`?expand=` on a single-row read or write. */
export interface EstimateShapeParams {
  fields?: readonly EstimateField[];
  expand?: readonly EstimateExpand[];
}

/**
 * Project estimate systems, each a named scale of points.
 *
 * Reached flat — `v2.workspaces.projects.estimates.list(slug, project)` — or from a fetched project,
 * which supplies both leading ids: `project.estimates.list()`. Every row-returning method
 * answers a {@link LoadedEstimate}, whose scale is reached as
 * `estimate.estimatePoints.list()` — **not** `points`, which is the name of the inline
 * point data `?expand=points` returns and which a navigation property may not shadow (see
 * {@link EstimateNavigation}).
 */
export class Estimates extends LoadsNavigableRows<Estimate, CreateEstimate, UpdateEstimate, EstimateNavigation> {
  protected path = "/workspaces/{slug}/projects/{project_id}/estimates/";
  protected operations: Record<string, AnyOperationId> = {
    list: "estimates_list",
    retrieve: "estimates_retrieve",
    create: "estimates_create",
    update: "estimates_partial_update",
    upsert: "estimates_upsert",
    delete: "estimates_destroy",
    bulkCreate: "estimates_bulk_create",
    bulkUpdate: "estimates_bulk_update",
    bulkDelete: "estimates_bulk_delete",
  };
  protected loadedIdNames = ESTIMATE_ID_NAMES;

  /** The point values on each estimate's scale; reached from a row as `estimatePoints`. */
  public points: EstimatePoints;

  constructor(transport: V2Transport) {
    super(transport);
    this.points = new EstimatePoints(transport);
  }

  protected navigationOf(meta: LoadedMeta): NavigationFactories<EstimateNavigation> {
    const ids = meta.ids as [string, string, string];
    return { estimatePoints: () => owned(this.points, ids, meta.idNames) };
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<EstimateField, "all"> & keyof Estimate>(
    slug: string,
    project: string,
    params: ListEstimatesParams & { fields: readonly F[] }
  ): Promise<Page<LoadedEstimateRow<Pick<Estimate, F | "id">>>>;
  list(slug: string, project: string, params?: ListEstimatesParams): Promise<Page<LoadedEstimate>>;
  async list(slug: string, project: string, params?: ListEstimatesParams): Promise<Page<LoadedEstimate>> {
    const page = await this.doList({ slug, project_id: project }, params as Record<string, unknown>);
    return this.loadPage(page, [slug, project], params?.fields);
  }

  /** Every estimate in the project, following pages automatically — navigable rows included. */
  iterate<F extends Exclude<EstimateField, "all"> & keyof Estimate>(
    slug: string,
    project: string,
    params: ListEstimatesParams & { fields: readonly F[] }
  ): AsyncGenerator<LoadedEstimateRow<Pick<Estimate, F | "id">>>;
  iterate(slug: string, project: string, params?: ListEstimatesParams): AsyncGenerator<LoadedEstimate>;
  iterate(slug: string, project: string, params?: ListEstimatesParams): AsyncGenerator<LoadedEstimate> {
    return this.loadIterate(
      this.doIterate({ slug, project_id: project }, params as Record<string, unknown>),
      [slug, project],
      params?.fields
    );
  }

  retrieve<F extends Exclude<EstimateField, "all"> & keyof Estimate>(
    slug: string,
    project: string,
    estimate: string,
    params: { fields: readonly F[]; expand?: readonly EstimateExpand[] }
  ): Promise<LoadedEstimateRow<Pick<Estimate, F | "id">>>;
  retrieve(slug: string, project: string, estimate: string, params?: EstimateShapeParams): Promise<LoadedEstimate>;
  async retrieve(
    slug: string,
    project: string,
    estimate: string,
    params?: EstimateShapeParams
  ): Promise<LoadedEstimate> {
    const row = await this.doRetrieve({ slug, project_id: project, pk: estimate }, params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  /** The one estimate with this name; throws if none or several match. Answers the same navigable row `retrieve` does. */
  async findByName(slug: string, project: string, name: string): Promise<LoadedEstimate> {
    const row = await this.doFindOne({ name }, { slug, project_id: project });
    return this.load(row, [slug, project]);
  }

  create<F extends Exclude<EstimateField, "all"> & keyof Estimate>(
    slug: string,
    project: string,
    data: CreateEstimate,
    params: EstimateShapeParams & { fields: readonly F[] }
  ): Promise<LoadedEstimateRow<Pick<Estimate, F | "id">>>;
  create(slug: string, project: string, data: CreateEstimate, params?: EstimateShapeParams): Promise<LoadedEstimate>;
  async create(
    slug: string,
    project: string,
    data: CreateEstimate,
    params?: EstimateShapeParams
  ): Promise<LoadedEstimate> {
    const row = await this.doCreate(data, { slug, project_id: project }, params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  update<F extends Exclude<EstimateField, "all"> & keyof Estimate>(
    slug: string,
    project: string,
    estimate: string,
    data: UpdateEstimate,
    params: EstimateShapeParams & { fields: readonly F[] }
  ): Promise<LoadedEstimateRow<Pick<Estimate, F | "id">>>;
  update(
    slug: string,
    project: string,
    estimate: string,
    data: UpdateEstimate,
    params?: EstimateShapeParams
  ): Promise<LoadedEstimate>;
  async update(
    slug: string,
    project: string,
    estimate: string,
    data: UpdateEstimate,
    params?: EstimateShapeParams
  ): Promise<LoadedEstimate> {
    const row = await this.doUpdate(
      data,
      { slug, project_id: project, pk: estimate },
      params as Record<string, unknown>
    );
    return this.load(row, [slug, project], params?.fields);
  }

  delete(slug: string, project: string, estimate: string): Promise<void> {
    return this.doDelete({ slug, project_id: project, pk: estimate });
  }

  /** Reconciles on (external_source, external_id) when both are set. */
  upsert<F extends Exclude<EstimateField, "all"> & keyof Estimate>(
    slug: string,
    project: string,
    data: CreateEstimate,
    params: EstimateShapeParams & { fields: readonly F[] }
  ): Promise<LoadedEstimateRow<Pick<Estimate, F | "id">>>;
  upsert(slug: string, project: string, data: CreateEstimate, params?: EstimateShapeParams): Promise<LoadedEstimate>;
  async upsert(
    slug: string,
    project: string,
    data: CreateEstimate,
    params?: EstimateShapeParams
  ): Promise<LoadedEstimate> {
    const row = await this.doUpsert(data, { slug, project_id: project }, params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  bulkCreate(slug: string, project: string, items: CreateEstimate[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkCreate(items, { slug, project_id: project }, allOrNone);
  }

  bulkUpdate(
    slug: string,
    project: string,
    items: BulkUpdateItem<UpdateEstimate>[],
    allOrNone = false
  ): Promise<BulkWriteResponse> {
    return this.doBulkUpdate(items, { slug, project_id: project }, allOrNone);
  }

  bulkDelete(slug: string, project: string, ids: string[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkDelete(ids, { slug, project_id: project }, allOrNone);
  }
}

export { EstimatePoints } from "./Points";
export type {
  EstimatePointField,
  EstimatePointOrderBy,
  EstimatePointShapeParams,
  ListEstimatePointsParams,
} from "./Points";
