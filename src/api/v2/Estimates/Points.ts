import { BulkUpdateItem, BulkWriteResponse, Page } from "../../../models/v2/common";
import { EstimatePoint, UpdateEstimatePoint, CreateEstimatePoint } from "../../../models/v2/EstimatePoint";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";

export type EstimatePointField = (typeof FIELDS)["estimate_points_list"][number];
export type EstimatePointOrderBy = (typeof ORDER_BY)["estimate_points_list"][number];

export interface ListEstimatePointsParams {
  fields?: readonly EstimatePointField[];
  key?: number;
  value?: string;
  external_id?: string;
  external_source?: string;
  search?: string;
  order_by?: EstimatePointOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** The values on an {@link Estimate}'s scale (api_v2). Nested under a project's estimate. */
export class EstimatePoints extends V2Resource<EstimatePoint, CreateEstimatePoint, UpdateEstimatePoint> {
  protected path = "/workspaces/{slug}/projects/{project_id}/estimates/{estimate_id}/points/";
  protected operations: Record<string, AnyOperationId> = {
    list: "estimate_points_list",
    retrieve: "estimate_points_retrieve",
    create: "estimate_points_create",
    update: "estimate_points_partial_update",
    upsert: "estimate_points_upsert",
    delete: "estimate_points_destroy",
    bulkCreate: "estimate_points_bulk_create",
    bulkUpdate: "estimate_points_bulk_update",
    bulkDelete: "estimate_points_bulk_delete",
  };

  private pk(estimateId: string, id?: string): Record<string, string> {
    const params: Record<string, string> = { estimate_id: estimateId };
    if (id !== undefined) params.pk = id;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<EstimatePointField, "all"> & keyof EstimatePoint>(
    estimateId: string,
    params: ListEstimatePointsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<EstimatePoint, F | "id">>>;
  list(estimateId: string, params?: ListEstimatePointsParams): Promise<Page<EstimatePoint>>;
  list(estimateId: string, params?: ListEstimatePointsParams): Promise<Page<EstimatePoint>> {
    return this.doList(this.pk(estimateId), params as Record<string, unknown>);
  }

  /** Every point on the estimate's scale, following pages automatically. */
  iterate(estimateId: string, params?: ListEstimatePointsParams): AsyncGenerator<EstimatePoint> {
    return this.doIterate(this.pk(estimateId), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<EstimatePointField, "all"> & keyof EstimatePoint>(
    estimateId: string,
    pointId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<EstimatePoint, F | "id">>;
  retrieve(
    estimateId: string,
    pointId: string,
    params?: { fields?: readonly EstimatePointField[] }
  ): Promise<EstimatePoint>;
  retrieve(
    estimateId: string,
    pointId: string,
    params?: { fields?: readonly EstimatePointField[] }
  ): Promise<EstimatePoint> {
    return this.doRetrieve(this.pk(estimateId, pointId), params as Record<string, unknown>);
  }

  /** The one point with this numeric `key` on the estimate's scale, server-side via `?key=`; throws if none or several match. */
  findByKey(estimateId: string, key: number): Promise<EstimatePoint> {
    return this.doFindOne({ key }, this.pk(estimateId));
  }

  create(estimateId: string, data: CreateEstimatePoint): Promise<EstimatePoint> {
    return this.doCreate(data, this.pk(estimateId));
  }

  update(estimateId: string, pointId: string, data: UpdateEstimatePoint): Promise<EstimatePoint> {
    return this.doUpdate(data, this.pk(estimateId, pointId));
  }

  delete(estimateId: string, pointId: string): Promise<void> {
    return this.doDelete(this.pk(estimateId, pointId));
  }

  /** Reconciles on (external_source, external_id) when both are set. */
  upsert(estimateId: string, data: CreateEstimatePoint): Promise<EstimatePoint> {
    return this.doUpsert(data, this.pk(estimateId));
  }

  bulkCreate(estimateId: string, items: CreateEstimatePoint[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkCreate(items, this.pk(estimateId), allOrNone);
  }

  bulkUpdate(
    estimateId: string,
    items: BulkUpdateItem<UpdateEstimatePoint>[],
    allOrNone = false
  ): Promise<BulkWriteResponse> {
    return this.doBulkUpdate(items, this.pk(estimateId), allOrNone);
  }

  bulkDelete(estimateId: string, ids: string[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkDelete(ids, this.pk(estimateId), allOrNone);
  }
}
