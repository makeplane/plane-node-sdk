import { Page } from "../../../models/v2/common";
import { WorkItemProperty } from "../../../models/v2/WorkItemProperty";
import { AttachedWorkItemTypeProperties } from "../../../models/v2/WorkItemType";
import { AnyOperationId, V2Resource } from "../kernel/resource";
import { ListWorkItemTypePropertiesParams, WorkItemTypePropertyField } from "../WorkItemTypes/Properties";

/**
 * Properties linked to a workspace-scoped type — `link`/`unlink` plus reads; the
 * definitions live on `WorkspaceWorkItemProperties`.
 *
 * Reached flat — `v2.workspaces.workItemTypes.properties.list(slug, type)` — or from a
 * fetched workspace-scoped type: `type.properties.list()`.
 */
export class WorkspaceWorkItemTypeProperties extends V2Resource<WorkItemProperty, never, never> {
  protected path = "/workspaces/{slug}/work-item-types/{type_id}/properties/";
  protected operations: Record<string, AnyOperationId> = {
    list: "workspace_work_item_type_properties_list",
    retrieve: "workspace_work_item_type_properties_retrieve",
    link: "workspace_work_item_type_properties_attach",
    unlink: "workspace_work_item_type_properties_detach",
  };

  private _at(slug: string, type: string, property?: string): Record<string, string> {
    const params: Record<string, string> = { slug, type_id: type };
    if (property !== undefined) params.pk = property;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkItemTypePropertyField, "all"> & keyof WorkItemProperty>(
    slug: string,
    type: string,
    params: ListWorkItemTypePropertiesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItemProperty, F | "id">>>;
  list(slug: string, type: string, params?: ListWorkItemTypePropertiesParams): Promise<Page<WorkItemProperty>>;
  list(slug: string, type: string, params?: ListWorkItemTypePropertiesParams): Promise<Page<WorkItemProperty>> {
    return this.doList(this._at(slug, type), params as Record<string, unknown>);
  }

  /** Every property linked to the workspace-scoped type, following pages automatically. */
  iterate<F extends Exclude<WorkItemTypePropertyField, "all"> & keyof WorkItemProperty>(
    slug: string,
    type: string,
    params: Omit<ListWorkItemTypePropertiesParams, "offset" | "count"> & {
      fields: readonly F[];
    }
  ): AsyncGenerator<Pick<WorkItemProperty, F | "id">>;
  iterate(
    slug: string,
    type: string,
    params?: Omit<ListWorkItemTypePropertiesParams, "offset" | "count">
  ): AsyncGenerator<WorkItemProperty>;
  iterate(
    slug: string,
    type: string,
    params?: Omit<ListWorkItemTypePropertiesParams, "offset" | "count">
  ): AsyncGenerator<WorkItemProperty> {
    return this.doIterate(this._at(slug, type), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkItemTypePropertyField, "all"> & keyof WorkItemProperty>(
    slug: string,
    type: string,
    property: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkItemProperty, F | "id">>;
  retrieve(
    slug: string,
    type: string,
    property: string,
    params?: { fields?: readonly WorkItemTypePropertyField[] }
  ): Promise<WorkItemProperty>;
  retrieve(
    slug: string,
    type: string,
    property: string,
    params?: { fields?: readonly WorkItemTypePropertyField[] }
  ): Promise<WorkItemProperty> {
    return this.doRetrieve(this._at(slug, type, property), params as Record<string, unknown>);
  }

  /** Link already-defined workspace properties to the workspace-scoped type. */
  link(slug: string, type: string, propertyIds: string[]): Promise<AttachedWorkItemTypeProperties> {
    return this.doCustomAction<AttachedWorkItemTypeProperties>("link", {
      method: "POST",
      pathParams: this._at(slug, type),
      data: { properties: propertyIds },
    });
  }

  /** Unlink one property from the workspace-scoped type. Deletes that property's values on every work item of the type; the definition itself stays. */
  unlink(slug: string, type: string, property: string): Promise<void> {
    return this.doDelete(this._at(slug, type, property));
  }
}
