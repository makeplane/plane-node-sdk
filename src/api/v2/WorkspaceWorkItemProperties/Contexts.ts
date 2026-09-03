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

/** Scopes a workspace work item property's applicability/default to projects and/or work item types. */
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

  private pk(propertyId: string, id?: string): Record<string, string> {
    const params: Record<string, string> = { property_id: propertyId };
    if (id !== undefined) params.pk = id;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkItemPropertyContextField, "all"> & keyof WorkItemPropertyContext>(
    propertyId: string,
    params: ListWorkItemPropertyContextsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItemPropertyContext, F | "id">>>;
  list(propertyId: string, params?: ListWorkItemPropertyContextsParams): Promise<Page<WorkItemPropertyContext>>;
  list(propertyId: string, params?: ListWorkItemPropertyContextsParams): Promise<Page<WorkItemPropertyContext>> {
    return this.doList(this.pk(propertyId), params as Record<string, unknown>);
  }

  /** Every context, following pages automatically. */
  iterate(propertyId: string, params?: ListWorkItemPropertyContextsParams): AsyncGenerator<WorkItemPropertyContext> {
    return this.doIterate(this.pk(propertyId), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkItemPropertyContextField, "all"> & keyof WorkItemPropertyContext>(
    propertyId: string,
    contextId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkItemPropertyContext, F | "id">>;
  retrieve(
    propertyId: string,
    contextId: string,
    params?: { fields?: readonly WorkItemPropertyContextField[] }
  ): Promise<WorkItemPropertyContext>;
  retrieve(
    propertyId: string,
    contextId: string,
    params?: { fields?: readonly WorkItemPropertyContextField[] }
  ): Promise<WorkItemPropertyContext> {
    return this.doRetrieve(this.pk(propertyId, contextId), params as Record<string, unknown>);
  }

  /** The one context with this `name` on the property, server-side via `?name=`; throws if none or several match. */
  findByName(propertyId: string, name: string): Promise<WorkItemPropertyContext> {
    return this.doFindOne({ name }, this.pk(propertyId));
  }

  create(propertyId: string, data: CreateWorkItemPropertyContext): Promise<WorkItemPropertyContext> {
    return this.doCreate(data, this.pk(propertyId));
  }

  update(propertyId: string, contextId: string, data: UpdateWorkItemPropertyContext): Promise<WorkItemPropertyContext> {
    return this.doUpdate(data, this.pk(propertyId, contextId));
  }

  delete(propertyId: string, contextId: string): Promise<void> {
    return this.doDelete(this.pk(propertyId, contextId));
  }
}
