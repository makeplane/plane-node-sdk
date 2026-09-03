import { AttachedWorkItemTypeProperties } from "../../../models/v2/WorkItemType";
import { Page } from "../../../models/v2/common";
import { WorkItemProperty } from "../../../models/v2/WorkItemProperty";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";

export type WorkItemTypePropertyField = (typeof FIELDS)["work_item_type_properties_list"][number];
export type WorkItemTypePropertyOrderBy = (typeof ORDER_BY)["work_item_type_properties_list"][number];

export interface ListWorkItemTypePropertiesParams {
  fields?: readonly WorkItemTypePropertyField[];
  order_by?: WorkItemTypePropertyOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** Custom properties linked to a work item type — `link`/`unlink` plus reads; definitions live on `WorkItemProperties`. */
export class WorkItemTypeProperties extends V2Resource<WorkItemProperty, never, never> {
  protected path = "/workspaces/{slug}/projects/{project_id}/work-item-types/{type_id}/properties/";
  protected operations: Record<string, AnyOperationId> = {
    list: "work_item_type_properties_list",
    retrieve: "work_item_type_properties_retrieve",
    attach: "work_item_type_properties_attach",
    detach: "work_item_type_properties_detach",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkItemTypePropertyField, "all"> & keyof WorkItemProperty>(
    typeId: string,
    params: ListWorkItemTypePropertiesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItemProperty, F | "id">>>;
  list(typeId: string, params?: ListWorkItemTypePropertiesParams): Promise<Page<WorkItemProperty>>;
  list(typeId: string, params?: ListWorkItemTypePropertiesParams): Promise<Page<WorkItemProperty>> {
    return this.doList({ type_id: typeId }, params as Record<string, unknown>);
  }

  /** Every property linked to the type, following pages automatically. */
  iterate(typeId: string, params?: ListWorkItemTypePropertiesParams): AsyncGenerator<WorkItemProperty> {
    return this.doIterate({ type_id: typeId }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkItemTypePropertyField, "all"> & keyof WorkItemProperty>(
    typeId: string,
    propertyId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkItemProperty, F | "id">>;
  retrieve(
    typeId: string,
    propertyId: string,
    params?: { fields?: readonly WorkItemTypePropertyField[] }
  ): Promise<WorkItemProperty>;
  retrieve(
    typeId: string,
    propertyId: string,
    params?: { fields?: readonly WorkItemTypePropertyField[] }
  ): Promise<WorkItemProperty> {
    return this.doRetrieve({ type_id: typeId, pk: propertyId }, params as Record<string, unknown>);
  }

  /** Link already-defined properties to the type; no `fields`/`order_by`/`expand` to validate here. */
  async link(typeId: string, propertyIds: string[]): Promise<AttachedWorkItemTypeProperties> {
    return this.transport.request<AttachedWorkItemTypeProperties>("POST", this.collectionUrl({ type_id: typeId }), {
      data: { properties: propertyIds },
    });
  }

  /** Unlink one property from the type. Deletes that property's values on every work item of the type; the definition itself stays. */
  unlink(typeId: string, propertyId: string): Promise<void> {
    return this.doDelete({ type_id: typeId, pk: propertyId });
  }
}
