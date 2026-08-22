import { BulkUpdateItem, BulkWriteResponse, Page } from "../../../models/v2/common";
import { Estimate, UpdateEstimate, EstimateType, CreateEstimate } from "../../../models/v2/Estimate";
import { EXPAND, FIELDS, ORDER_BY } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import { EstimatePoints } from "./Points";

export type EstimateField = (typeof FIELDS)["estimates_list"][number];
export type EstimateOrderBy = (typeof ORDER_BY)["estimates_list"][number];
/** Only `"points"` — inlines the estimate's point scale instead of a separate `points.list()` call. */
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

/** Project estimate systems, each a named scale of points reachable via `.points`. */
export class Estimates extends V2Resource<Estimate, CreateEstimate, UpdateEstimate> {
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

  /** The point values on each estimate's scale. */
  public points: EstimatePoints;

  constructor(transport: V2Transport, scope: Record<string, string> = {}) {
    super(transport, scope);
    this.points = new EstimatePoints(transport, scope);
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<EstimateField, "all"> & keyof Estimate>(
    params: ListEstimatesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<Estimate, F | "id">>>;
  list(params?: ListEstimatesParams): Promise<Page<Estimate>>;
  list(params?: ListEstimatesParams): Promise<Page<Estimate>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every estimate in the project, following pages automatically. */
  iterate(params?: ListEstimatesParams): AsyncGenerator<Estimate> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<EstimateField, "all"> & keyof Estimate>(
    estimateId: string,
    params: { fields: readonly F[]; expand?: readonly EstimateExpand[] }
  ): Promise<Pick<Estimate, F | "id">>;
  retrieve(
    estimateId: string,
    params?: { fields?: readonly EstimateField[]; expand?: readonly EstimateExpand[] }
  ): Promise<Estimate>;
  retrieve(
    estimateId: string,
    params?: { fields?: readonly EstimateField[]; expand?: readonly EstimateExpand[] }
  ): Promise<Estimate> {
    return this.doRetrieve({ pk: estimateId }, params as Record<string, unknown>);
  }

  /** The one estimate with this name; throws if none or several match. */
  findByName(name: string): Promise<Estimate> {
    return this.doFindOne({ name }, {});
  }

  create(
    data: CreateEstimate,
    params?: { fields?: readonly EstimateField[]; expand?: readonly EstimateExpand[] }
  ): Promise<Estimate> {
    return this.doCreate(data, {}, params as Record<string, unknown>);
  }

  update(
    estimateId: string,
    data: UpdateEstimate,
    params?: { fields?: readonly EstimateField[]; expand?: readonly EstimateExpand[] }
  ): Promise<Estimate> {
    return this.doUpdate(data, { pk: estimateId }, params as Record<string, unknown>);
  }

  delete(estimateId: string): Promise<void> {
    return this.doDelete({ pk: estimateId });
  }

  /** Reconciles on (external_source, external_id) when both are set. */
  upsert(
    data: CreateEstimate,
    params?: { fields?: readonly EstimateField[]; expand?: readonly EstimateExpand[] }
  ): Promise<Estimate> {
    return this.doUpsert(data, {}, params as Record<string, unknown>);
  }

  bulkCreate(items: CreateEstimate[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkCreate(items, {}, allOrNone);
  }

  bulkUpdate(items: BulkUpdateItem<UpdateEstimate>[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkUpdate(items, {}, allOrNone);
  }

  bulkDelete(ids: string[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkDelete(ids, {}, allOrNone);
  }
}

export { EstimatePoints } from "./Points";
export type { EstimatePointField, EstimatePointOrderBy, ListEstimatePointsParams } from "./Points";
