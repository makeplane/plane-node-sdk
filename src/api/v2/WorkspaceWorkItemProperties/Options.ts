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
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/**
 * Options of an OPTION-typed workspace property. A `pk` from a different property 404s.
 *
 * Reached flat — `v2.workspaces.workItemProperties.options.list(slug, property)` — or from
 * a fetched workspace property, where it is `property.propertyOptions.list()`: the row's
 * own `options` field is the inlined choice list, so the navigation property is spelled
 * differently (see `WorkspaceWorkItemPropertyNavigation`).
 */
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

  private _at(slug: string, property: string, option?: string): Record<string, string> {
    const params: Record<string, string> = { slug, property_id: property };
    if (option !== undefined) params.pk = option;
    return params;
  }

  list(
    slug: string,
    property: string,
    params?: ListWorkspaceWorkItemPropertyOptionsParams
  ): Promise<Page<WorkItemPropertyOptionLite>> {
    return this.doList(this._at(slug, property), params as Record<string, unknown>);
  }

  /** Every option, following pages automatically. */
  iterate(
    slug: string,
    property: string,
    params?: Omit<ListWorkspaceWorkItemPropertyOptionsParams, "offset" | "count">
  ): AsyncGenerator<WorkItemPropertyOptionLite> {
    return this.doIterate(this._at(slug, property), params as Record<string, unknown>);
  }

  retrieve(slug: string, property: string, option: string): Promise<WorkItemPropertyOptionLite> {
    return this.doRetrieve(this._at(slug, property, option));
  }

  /** The one option with this `name` on the workspace property, server-side via `?name=`; throws if none or several match. */
  findByName(slug: string, property: string, name: string): Promise<WorkItemPropertyOptionLite> {
    return this.doFindOne({ name }, this._at(slug, property));
  }

  create(slug: string, property: string, data: CreateWorkItemPropertyOption): Promise<WorkItemPropertyOptionLite> {
    return this.doCreate(data, this._at(slug, property));
  }

  update(
    slug: string,
    property: string,
    option: string,
    data: UpdateWorkItemPropertyOption
  ): Promise<WorkItemPropertyOptionLite> {
    return this.doUpdate(data, this._at(slug, property, option));
  }

  delete(slug: string, property: string, option: string): Promise<void> {
    return this.doDelete(this._at(slug, property, option));
  }
}
