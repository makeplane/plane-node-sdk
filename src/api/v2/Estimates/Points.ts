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
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=` on a single-row read or write. The golden declares no `?expand=` on this family. */
export interface EstimatePointShapeParams {
  fields?: readonly EstimatePointField[];
}

/**
 * The values on an {@link Estimate}'s scale.
 *
 * Reached flat — `v2.workspaces.projects.estimates.points.list(slug, project, estimate)` — or from a
 * fetched estimate, where it is `estimate.estimatePoints.list()`: the row's own `points`
 * key is the inline scale `?expand=points` returns, so the navigation property is spelled
 * differently (see `EstimateNavigation`).
 */
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

  // Underscore-prefixed because `private` is compile-time only: `owned()` walks the
  // runtime prototype, so an un-prefixed helper would land on a fetched estimate's
  // `estimatePoints` view as a public method (the navigation sweep caught exactly that).
  private _at(slug: string, project: string, estimate: string, point?: string): Record<string, string> {
    const params: Record<string, string> = { slug, project_id: project, estimate_id: estimate };
    if (point !== undefined) params.pk = point;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<EstimatePointField, "all"> & keyof EstimatePoint>(
    slug: string,
    project: string,
    estimate: string,
    params: ListEstimatePointsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<EstimatePoint, F | "id">>>;
  list(
    slug: string,
    project: string,
    estimate: string,
    params?: ListEstimatePointsParams
  ): Promise<Page<EstimatePoint>>;
  list(
    slug: string,
    project: string,
    estimate: string,
    params?: ListEstimatePointsParams
  ): Promise<Page<EstimatePoint>> {
    return this.doList(this._at(slug, project, estimate), params as Record<string, unknown>);
  }

  /** Every point on the estimate's scale, following pages automatically. */
  iterate<F extends Exclude<EstimatePointField, "all"> & keyof EstimatePoint>(
    slug: string,
    project: string,
    estimate: string,
    params: Omit<ListEstimatePointsParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<Pick<EstimatePoint, F | "id">>;
  iterate(
    slug: string,
    project: string,
    estimate: string,
    params?: Omit<ListEstimatePointsParams, "offset" | "count">
  ): AsyncGenerator<EstimatePoint>;
  iterate(
    slug: string,
    project: string,
    estimate: string,
    params?: Omit<ListEstimatePointsParams, "offset" | "count">
  ): AsyncGenerator<EstimatePoint> {
    return this.doIterate(this._at(slug, project, estimate), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<EstimatePointField, "all"> & keyof EstimatePoint>(
    slug: string,
    project: string,
    estimate: string,
    point: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<EstimatePoint, F | "id">>;
  retrieve(
    slug: string,
    project: string,
    estimate: string,
    point: string,
    params?: { fields?: readonly EstimatePointField[] }
  ): Promise<EstimatePoint>;
  retrieve(
    slug: string,
    project: string,
    estimate: string,
    point: string,
    params?: { fields?: readonly EstimatePointField[] }
  ): Promise<EstimatePoint> {
    return this.doRetrieve(this._at(slug, project, estimate, point), params as Record<string, unknown>);
  }

  /** The one point with this numeric `key` on the estimate's scale, server-side via `?key=`; throws if none or several match. */
  findByKey(slug: string, project: string, estimate: string, key: number): Promise<EstimatePoint> {
    return this.doFindOne({ key }, this._at(slug, project, estimate));
  }

  create<F extends Exclude<EstimatePointField, "all"> & keyof EstimatePoint>(
    slug: string,
    project: string,
    estimate: string,
    data: CreateEstimatePoint,
    params: EstimatePointShapeParams & { fields: readonly F[] }
  ): Promise<Pick<EstimatePoint, F | "id">>;
  create(
    slug: string,
    project: string,
    estimate: string,
    data: CreateEstimatePoint,
    params?: EstimatePointShapeParams
  ): Promise<EstimatePoint>;
  create(
    slug: string,
    project: string,
    estimate: string,
    data: CreateEstimatePoint,
    params?: EstimatePointShapeParams
  ): Promise<EstimatePoint> {
    return this.doCreate(data, this._at(slug, project, estimate), params as Record<string, unknown>);
  }

  update<F extends Exclude<EstimatePointField, "all"> & keyof EstimatePoint>(
    slug: string,
    project: string,
    estimate: string,
    point: string,
    data: UpdateEstimatePoint,
    params: EstimatePointShapeParams & { fields: readonly F[] }
  ): Promise<Pick<EstimatePoint, F | "id">>;
  update(
    slug: string,
    project: string,
    estimate: string,
    point: string,
    data: UpdateEstimatePoint,
    params?: EstimatePointShapeParams
  ): Promise<EstimatePoint>;
  update(
    slug: string,
    project: string,
    estimate: string,
    point: string,
    data: UpdateEstimatePoint,
    params?: EstimatePointShapeParams
  ): Promise<EstimatePoint> {
    return this.doUpdate(data, this._at(slug, project, estimate, point), params as Record<string, unknown>);
  }

  delete(slug: string, project: string, estimate: string, point: string): Promise<void> {
    return this.doDelete(this._at(slug, project, estimate, point));
  }

  /** Reconciles on (external_source, external_id) when both are set. */
  upsert<F extends Exclude<EstimatePointField, "all"> & keyof EstimatePoint>(
    slug: string,
    project: string,
    estimate: string,
    data: CreateEstimatePoint,
    params: EstimatePointShapeParams & { fields: readonly F[] }
  ): Promise<Pick<EstimatePoint, F | "id">>;
  upsert(
    slug: string,
    project: string,
    estimate: string,
    data: CreateEstimatePoint,
    params?: EstimatePointShapeParams
  ): Promise<EstimatePoint>;
  upsert(
    slug: string,
    project: string,
    estimate: string,
    data: CreateEstimatePoint,
    params?: EstimatePointShapeParams
  ): Promise<EstimatePoint> {
    return this.doUpsert(data, this._at(slug, project, estimate), params as Record<string, unknown>);
  }

  bulkCreate(
    slug: string,
    project: string,
    estimate: string,
    items: CreateEstimatePoint[],
    allOrNone = false
  ): Promise<BulkWriteResponse> {
    return this.doBulkCreate(items, this._at(slug, project, estimate), allOrNone);
  }

  bulkUpdate(
    slug: string,
    project: string,
    estimate: string,
    items: BulkUpdateItem<UpdateEstimatePoint>[],
    allOrNone = false
  ): Promise<BulkWriteResponse> {
    return this.doBulkUpdate(items, this._at(slug, project, estimate), allOrNone);
  }

  bulkDelete(
    slug: string,
    project: string,
    estimate: string,
    ids: string[],
    allOrNone = false
  ): Promise<BulkWriteResponse> {
    return this.doBulkDelete(ids, this._at(slug, project, estimate), allOrNone);
  }
}
