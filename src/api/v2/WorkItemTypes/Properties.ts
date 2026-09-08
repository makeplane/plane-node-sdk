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

/**
 * Custom properties linked to a project-scoped work item type — `link`/`unlink` plus
 * reads; the definitions themselves live on `WorkItemProperties`.
 *
 * Reached flat — `v2.projects.workItemTypes.properties.list(slug, project, type)` — or
 * from a fetched type: `type.properties.list()`. The verbs copy the web app's CTA, which
 * is why they are `link`/`unlink` rather than `add`/`remove`.
 */
export class WorkItemTypeProperties extends V2Resource<WorkItemProperty, never, never> {
  protected path = "/workspaces/{slug}/projects/{project_id}/work-item-types/{type_id}/properties/";
  protected operations: Record<string, AnyOperationId> = {
    list: "work_item_type_properties_list",
    retrieve: "work_item_type_properties_retrieve",
    link: "work_item_type_properties_attach",
    unlink: "work_item_type_properties_detach",
  };

  private _at(slug: string, project: string, type: string, property?: string): Record<string, string> {
    const params: Record<string, string> = { slug, project_id: project, type_id: type };
    if (property !== undefined) params.pk = property;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkItemTypePropertyField, "all"> & keyof WorkItemProperty>(
    slug: string,
    project: string,
    type: string,
    params: ListWorkItemTypePropertiesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItemProperty, F | "id">>>;
  list(
    slug: string,
    project: string,
    type: string,
    params?: ListWorkItemTypePropertiesParams
  ): Promise<Page<WorkItemProperty>>;
  list(
    slug: string,
    project: string,
    type: string,
    params?: ListWorkItemTypePropertiesParams
  ): Promise<Page<WorkItemProperty>> {
    return this.doList(this._at(slug, project, type), params as Record<string, unknown>);
  }

  /** Every property linked to the type, following pages automatically. */
  iterate<F extends Exclude<WorkItemTypePropertyField, "all"> & keyof WorkItemProperty>(
    slug: string,
    project: string,
    type: string,
    params: ListWorkItemTypePropertiesParams & { fields: readonly F[] }
  ): AsyncGenerator<Pick<WorkItemProperty, F | "id">>;
  iterate(
    slug: string,
    project: string,
    type: string,
    params?: ListWorkItemTypePropertiesParams
  ): AsyncGenerator<WorkItemProperty>;
  iterate(
    slug: string,
    project: string,
    type: string,
    params?: ListWorkItemTypePropertiesParams
  ): AsyncGenerator<WorkItemProperty> {
    return this.doIterate(this._at(slug, project, type), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkItemTypePropertyField, "all"> & keyof WorkItemProperty>(
    slug: string,
    project: string,
    type: string,
    property: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkItemProperty, F | "id">>;
  retrieve(
    slug: string,
    project: string,
    type: string,
    property: string,
    params?: { fields?: readonly WorkItemTypePropertyField[] }
  ): Promise<WorkItemProperty>;
  retrieve(
    slug: string,
    project: string,
    type: string,
    property: string,
    params?: { fields?: readonly WorkItemTypePropertyField[] }
  ): Promise<WorkItemProperty> {
    return this.doRetrieve(this._at(slug, project, type, property), params as Record<string, unknown>);
  }

  /** Link already-defined properties to the type; no `fields`/`order_by`/`expand` to validate here. */
  link(slug: string, project: string, type: string, propertyIds: string[]): Promise<AttachedWorkItemTypeProperties> {
    return this.doCustomAction<AttachedWorkItemTypeProperties>("link", {
      method: "POST",
      pathParams: this._at(slug, project, type),
      data: { properties: propertyIds },
    });
  }

  /** Unlink one property from the type. Deletes that property's values on every work item of the type; the definition itself stays. */
  unlink(slug: string, project: string, type: string, property: string): Promise<void> {
    return this.doDelete(this._at(slug, project, type, property));
  }
}
