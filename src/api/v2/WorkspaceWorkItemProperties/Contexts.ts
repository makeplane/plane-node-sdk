import { Page } from "../../../models/v2/common";
import {
  WorkItemPropertyContext,
  UpdateWorkItemPropertyContext,
  CreateWorkItemPropertyContext,
} from "../../../models/v2/WorkItemPropertyContext";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";

export type WorkItemPropertyContextField = (typeof FIELDS)["work_item_property_contexts_list"][number];
export type WorkItemPropertyContextOrderBy = (typeof ORDER_BY)["work_item_property_contexts_list"][number];

export interface ListWorkItemPropertyContextsParams {
  fields?: readonly WorkItemPropertyContextField[];
  name?: string;
  search?: string;
  order_by?: WorkItemPropertyContextOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** `?fields=` on a single-row read or write. The golden declares no `?expand=` here. */
export interface WorkItemPropertyContextShapeParams {
  fields?: readonly WorkItemPropertyContextField[];
}

/**
 * Scopes a workspace work item property's applicability/default to projects and/or work
 * item types.
 *
 * Reached flat — `v2.workspaces.workItemProperties.contexts.list(slug, property)` — or from
 * a fetched workspace property: `property.contexts.list()`.
 */
export class WorkItemPropertyContexts extends V2Resource<
  WorkItemPropertyContext,
  CreateWorkItemPropertyContext,
  UpdateWorkItemPropertyContext
> {
  protected path = "/workspaces/{slug}/work-item-properties/{property_id}/contexts/";
  protected operations: Record<string, OperationId> = {
    list: "work_item_property_contexts_list",
    retrieve: "work_item_property_contexts_retrieve",
    create: "work_item_property_contexts_create",
    update: "work_item_property_contexts_partial_update",
    delete: "work_item_property_contexts_destroy",
  };

  private _at(slug: string, property: string, context?: string): Record<string, string> {
    const params: Record<string, string> = { slug, property_id: property };
    if (context !== undefined) params.pk = context;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkItemPropertyContextField, "all"> & keyof WorkItemPropertyContext>(
    slug: string,
    property: string,
    params: ListWorkItemPropertyContextsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItemPropertyContext, F | "id">>>;
  list(
    slug: string,
    property: string,
    params?: ListWorkItemPropertyContextsParams
  ): Promise<Page<WorkItemPropertyContext>>;
  list(
    slug: string,
    property: string,
    params?: ListWorkItemPropertyContextsParams
  ): Promise<Page<WorkItemPropertyContext>> {
    return this.doList(this._at(slug, property), params as Record<string, unknown>);
  }

  /** Every context, following pages automatically. */
  iterate<F extends Exclude<WorkItemPropertyContextField, "all"> & keyof WorkItemPropertyContext>(
    slug: string,
    property: string,
    params: ListWorkItemPropertyContextsParams & { fields: readonly F[] }
  ): AsyncGenerator<Pick<WorkItemPropertyContext, F | "id">>;
  iterate(
    slug: string,
    property: string,
    params?: ListWorkItemPropertyContextsParams
  ): AsyncGenerator<WorkItemPropertyContext>;
  iterate(
    slug: string,
    property: string,
    params?: ListWorkItemPropertyContextsParams
  ): AsyncGenerator<WorkItemPropertyContext> {
    return this.doIterate(this._at(slug, property), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkItemPropertyContextField, "all"> & keyof WorkItemPropertyContext>(
    slug: string,
    property: string,
    context: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkItemPropertyContext, F | "id">>;
  retrieve(
    slug: string,
    property: string,
    context: string,
    params?: { fields?: readonly WorkItemPropertyContextField[] }
  ): Promise<WorkItemPropertyContext>;
  retrieve(
    slug: string,
    property: string,
    context: string,
    params?: { fields?: readonly WorkItemPropertyContextField[] }
  ): Promise<WorkItemPropertyContext> {
    return this.doRetrieve(this._at(slug, property, context), params as Record<string, unknown>);
  }

  /** The one context with this `name` on the property, server-side via `?name=`; throws if none or several match. */
  findByName(slug: string, property: string, name: string): Promise<WorkItemPropertyContext> {
    return this.doFindOne({ name }, this._at(slug, property));
  }

  create<F extends Exclude<WorkItemPropertyContextField, "all"> & keyof WorkItemPropertyContext>(
    slug: string,
    property: string,
    data: CreateWorkItemPropertyContext,
    params: WorkItemPropertyContextShapeParams & { fields: readonly F[] }
  ): Promise<Pick<WorkItemPropertyContext, F | "id">>;
  create(
    slug: string,
    property: string,
    data: CreateWorkItemPropertyContext,
    params?: WorkItemPropertyContextShapeParams
  ): Promise<WorkItemPropertyContext>;
  create(
    slug: string,
    property: string,
    data: CreateWorkItemPropertyContext,
    params?: WorkItemPropertyContextShapeParams
  ): Promise<WorkItemPropertyContext> {
    return this.doCreate(data, this._at(slug, property), params as Record<string, unknown>);
  }

  update<F extends Exclude<WorkItemPropertyContextField, "all"> & keyof WorkItemPropertyContext>(
    slug: string,
    property: string,
    context: string,
    data: UpdateWorkItemPropertyContext,
    params: WorkItemPropertyContextShapeParams & { fields: readonly F[] }
  ): Promise<Pick<WorkItemPropertyContext, F | "id">>;
  update(
    slug: string,
    property: string,
    context: string,
    data: UpdateWorkItemPropertyContext,
    params?: WorkItemPropertyContextShapeParams
  ): Promise<WorkItemPropertyContext>;
  update(
    slug: string,
    property: string,
    context: string,
    data: UpdateWorkItemPropertyContext,
    params?: WorkItemPropertyContextShapeParams
  ): Promise<WorkItemPropertyContext> {
    return this.doUpdate(data, this._at(slug, property, context), params as Record<string, unknown>);
  }

  delete(slug: string, property: string, context: string): Promise<void> {
    return this.doDelete(this._at(slug, property, context));
  }
}
