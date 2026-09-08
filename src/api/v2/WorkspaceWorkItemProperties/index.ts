import { Page } from "../../../models/v2/common";
import { WorkItemProperty, UpdateWorkItemProperty, CreateWorkItemProperty } from "../../../models/v2/WorkItemProperty";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import { WorkItemPropertyContexts } from "./Contexts";
import { WorkspaceWorkItemPropertyOptions } from "./Options";

export type WorkspaceWorkItemPropertyField = (typeof FIELDS)["workspace_work_item_properties_list"][number];
export type WorkspaceWorkItemPropertyOrderBy = (typeof ORDER_BY)["workspace_work_item_properties_list"][number];

export interface ListWorkspaceWorkItemPropertiesParams {
  fields?: readonly WorkspaceWorkItemPropertyField[];
  name?: string;
  /** The label a user sees in the UI, as opposed to `name`, which is the server-derived slug. Case-insensitive exact match. */
  display_name?: string;
  external_id?: string;
  external_source?: string;
  search?: string;
  order_by?: WorkspaceWorkItemPropertyOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** Custom work item property definitions shared across the whole workspace, not owned by one project. */
export class WorkspaceWorkItemProperties extends V2Resource<
  WorkItemProperty,
  CreateWorkItemProperty,
  UpdateWorkItemProperty
> {
  protected path = "/workspaces/{slug}/work-item-properties/";
  protected operations: Record<string, OperationId> = {
    list: "workspace_work_item_properties_list",
    retrieve: "workspace_work_item_properties_retrieve",
    create: "workspace_work_item_properties_create",
    update: "workspace_work_item_properties_partial_update",
    delete: "workspace_work_item_properties_destroy",
  };

  /** Contexts scoping this property's applicability/default to projects and/or work item types. */
  public contexts: WorkItemPropertyContexts;
  /** Options of an OPTION-typed workspace property. */
  public options: WorkspaceWorkItemPropertyOptions;

  constructor(transport: V2Transport, scope: Record<string, string> = {}) {
    super(transport, scope);
    this.contexts = new WorkItemPropertyContexts(transport, scope);
    this.options = new WorkspaceWorkItemPropertyOptions(transport, scope);
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkspaceWorkItemPropertyField, "all"> & keyof WorkItemProperty>(
    params: ListWorkspaceWorkItemPropertiesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItemProperty, F | "id">>>;
  list(params?: ListWorkspaceWorkItemPropertiesParams): Promise<Page<WorkItemProperty>>;
  list(params?: ListWorkspaceWorkItemPropertiesParams): Promise<Page<WorkItemProperty>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every workspace property, following pages automatically. */
  iterate(params?: ListWorkspaceWorkItemPropertiesParams): AsyncGenerator<WorkItemProperty> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkspaceWorkItemPropertyField, "all"> & keyof WorkItemProperty>(
    propertyId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkItemProperty, F | "id">>;
  retrieve(
    propertyId: string,
    params?: { fields?: readonly WorkspaceWorkItemPropertyField[] }
  ): Promise<WorkItemProperty>;
  retrieve(
    propertyId: string,
    params?: { fields?: readonly WorkspaceWorkItemPropertyField[] }
  ): Promise<WorkItemProperty> {
    return this.doRetrieve({ pk: propertyId }, params as Record<string, unknown>);
  }

  /** The one property with this `name`, server-side via `?name=`. `name` is the property key (e.g. `story-points`, hyphen-slugified), not the UI label. */
  findByName(name: string): Promise<WorkItemProperty> {
    return this.doFindOne({ name }, {});
  }

  /**
   * The one property with this display name, server-side via `?display_name=`; throws if
   * none or several match.
   *
   * `displayName` is the label a user sees in the UI — `name` is the slugified key the
   * server derives from it, so this is the lookup a person reaching for a property they
   * can see on screen actually wants. The match is case-insensitive.
   */
  findByDisplayName(displayName: string): Promise<WorkItemProperty> {
    return this.doFindOne({ display_name: displayName }, {});
  }

  create(data: CreateWorkItemProperty): Promise<WorkItemProperty> {
    return this.doCreate(data, {});
  }

  update(propertyId: string, data: UpdateWorkItemProperty): Promise<WorkItemProperty> {
    return this.doUpdate(data, { pk: propertyId });
  }

  delete(propertyId: string): Promise<void> {
    return this.doDelete({ pk: propertyId });
  }
}

export { WorkItemPropertyContexts } from "./Contexts";
export { WorkspaceWorkItemPropertyOptions } from "./Options";
export type { ListWorkItemPropertyContextsParams, WorkItemPropertyContextOrderBy } from "./Contexts";
export type { ListWorkspaceWorkItemPropertyOptionsParams, WorkspaceWorkItemPropertyOptionOrderBy } from "./Options";
