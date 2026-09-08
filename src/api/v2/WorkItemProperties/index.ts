import { Page } from "../../../models/v2/common";
import { WorkItemProperty, UpdateWorkItemProperty, CreateWorkItemProperty } from "../../../models/v2/WorkItemProperty";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import { WorkItemPropertyOptions } from "./Options";

export type WorkItemPropertyField = (typeof FIELDS)["work_item_properties_list"][number];
export type WorkItemPropertyOrderBy = (typeof ORDER_BY)["work_item_properties_list"][number];

export interface ListWorkItemPropertiesParams {
  fields?: readonly WorkItemPropertyField[];
  name?: string;
  /** The label a user sees in the UI, as opposed to `name`, which is the server-derived slug. Case-insensitive exact match. */
  display_name?: string;
  external_id?: string;
  external_source?: string;
  search?: string;
  order_by?: WorkItemPropertyOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** Custom work item property definitions scoped to a project; see `WorkspaceWorkItemProperties` for the sibling. */
export class WorkItemProperties extends V2Resource<WorkItemProperty, CreateWorkItemProperty, UpdateWorkItemProperty> {
  protected path = "/workspaces/{slug}/projects/{project_id}/work-item-properties/";
  protected operations: Record<string, OperationId> = {
    list: "work_item_properties_list",
    retrieve: "work_item_properties_retrieve",
    create: "work_item_properties_create",
    update: "work_item_properties_partial_update",
    delete: "work_item_properties_destroy",
  };

  /** Options of an OPTION-typed property under this project. */
  public options: WorkItemPropertyOptions;

  constructor(transport: V2Transport, scope: Record<string, string> = {}) {
    super(transport, scope);
    this.options = new WorkItemPropertyOptions(transport, scope);
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkItemPropertyField, "all"> & keyof WorkItemProperty>(
    params: ListWorkItemPropertiesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItemProperty, F | "id">>>;
  list(params?: ListWorkItemPropertiesParams): Promise<Page<WorkItemProperty>>;
  list(params?: ListWorkItemPropertiesParams): Promise<Page<WorkItemProperty>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every property, following pages automatically. */
  iterate(params?: ListWorkItemPropertiesParams): AsyncGenerator<WorkItemProperty> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkItemPropertyField, "all"> & keyof WorkItemProperty>(
    propertyId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkItemProperty, F | "id">>;
  retrieve(propertyId: string, params?: { fields?: readonly WorkItemPropertyField[] }): Promise<WorkItemProperty>;
  retrieve(propertyId: string, params?: { fields?: readonly WorkItemPropertyField[] }): Promise<WorkItemProperty> {
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

export { WorkItemPropertyOptions } from "./Options";
export type { ListWorkItemPropertyOptionsParams, WorkItemPropertyOptionOrderBy } from "./Options";
