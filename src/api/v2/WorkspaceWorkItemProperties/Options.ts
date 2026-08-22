import { Page } from "../../../models/v2/common";
import {
  WorkItemPropertyOptionLite,
  UpdateWorkItemPropertyOption,
  CreateWorkItemPropertyOption,
} from "../../../models/v2/WorkItemPropertyOption";
import { ORDER_BY } from "../generated/constants";
import { AnyOperationId, OperationId, V2Resource } from "../kernel/resource";

export type WorkspaceWorkItemPropertyOptionOrderBy =
  (typeof ORDER_BY)["workspace_work_item_property_options_list"][number];

export interface ListWorkspaceWorkItemPropertyOptionsParams {
  name?: string;
  external_id?: string;
  external_source?: string;
  search?: string;
  order_by?: WorkspaceWorkItemPropertyOptionOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** Options of an OPTION-typed workspace property. A `pk` from a different property 404s. */
export class WorkspaceWorkItemPropertyOptions extends V2Resource<
  WorkItemPropertyOptionLite,
  CreateWorkItemPropertyOption,
  UpdateWorkItemPropertyOption
> {
  protected path = "/workspaces/{slug}/work-item-properties/{property_id}/options/";
  protected operations: Record<string, AnyOperationId> = {
    // See `WorkItemPropertyOptions.operations` for why this cast is necessary and safe.
    list: "workspace_work_item_property_options_list" as OperationId,
    create: "workspace_work_item_property_options_create",
    delete: "workspace_work_item_property_options_destroy",
    update: "workspace_work_item_property_options_partial_update",
    retrieve: "workspace_work_item_property_options_retrieve",
  };

  private pk(propertyId: string, id?: string): Record<string, string> {
    const params: Record<string, string> = { property_id: propertyId };
    if (id !== undefined) params.pk = id;
    return params;
  }

  list(
    propertyId: string,
    params?: ListWorkspaceWorkItemPropertyOptionsParams
  ): Promise<Page<WorkItemPropertyOptionLite>> {
    return this.doList(this.pk(propertyId), params as Record<string, unknown>);
  }

  /** Every option, following pages automatically. */
  iterate(
    propertyId: string,
    params?: ListWorkspaceWorkItemPropertyOptionsParams
  ): AsyncGenerator<WorkItemPropertyOptionLite> {
    return this.doIterate(this.pk(propertyId), params as Record<string, unknown>);
  }

  retrieve(propertyId: string, optionId: string): Promise<WorkItemPropertyOptionLite> {
    return this.doRetrieve(this.pk(propertyId, optionId));
  }

  create(propertyId: string, data: CreateWorkItemPropertyOption): Promise<WorkItemPropertyOptionLite> {
    return this.doCreate(data, this.pk(propertyId));
  }

  update(
    propertyId: string,
    optionId: string,
    data: UpdateWorkItemPropertyOption
  ): Promise<WorkItemPropertyOptionLite> {
    return this.doUpdate(data, this.pk(propertyId, optionId));
  }

  delete(propertyId: string, optionId: string): Promise<void> {
    return this.doDelete(this.pk(propertyId, optionId));
  }
}
