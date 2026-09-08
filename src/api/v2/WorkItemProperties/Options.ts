import { Page } from "../../../models/v2/common";
import {
  WorkItemPropertyOptionLite,
  UpdateWorkItemPropertyOption,
  CreateWorkItemPropertyOption,
} from "../../../models/v2/WorkItemPropertyOption";
import { ORDER_BY } from "../generated/constants";
import { AnyOperationId, OperationId, V2Resource } from "../kernel/resource";

export type WorkItemPropertyOptionOrderBy = (typeof ORDER_BY)["work_item_property_options_list"][number];

export interface ListWorkItemPropertyOptionsParams {
  name?: string;
  external_id?: string;
  external_source?: string;
  search?: string;
  order_by?: WorkItemPropertyOptionOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/**
 * Options of an OPTION-typed property, scoped under a project + property; `list`/`retrieve`
 * have no `fields` param.
 *
 * Reached flat — `v2.projects.workItemProperties.options.list(slug, project, property)` —
 * or from a fetched property, where it is `property.propertyOptions.list()`: the row's own
 * `options` field is the inlined choice list, so the navigation property is spelled
 * differently (see `WorkItemPropertyNavigation`).
 */
export class WorkItemPropertyOptions extends V2Resource<
  WorkItemPropertyOptionLite,
  CreateWorkItemPropertyOption,
  UpdateWorkItemPropertyOption
> {
  protected path = "/workspaces/{slug}/projects/{project_id}/work-item-properties/{property_id}/options/";
  protected operations: Record<string, AnyOperationId> = {
    // Cast: this id has no `fields` param so it's missing from `FIELDS`/`OperationId`,
    // but `encodeOrderBy` validates the string at runtime against `ORDER_BY`.
    list: "work_item_property_options_list" as OperationId,
    create: "work_item_property_options_create",
    delete: "work_item_property_options_destroy",
    update: "work_item_property_options_partial_update",
    retrieve: "work_item_property_options_retrieve",
  };

  private _at(slug: string, project: string, property: string, option?: string): Record<string, string> {
    const params: Record<string, string> = { slug, project_id: project, property_id: property };
    if (option !== undefined) params.pk = option;
    return params;
  }

  list(
    slug: string,
    project: string,
    property: string,
    params?: ListWorkItemPropertyOptionsParams
  ): Promise<Page<WorkItemPropertyOptionLite>> {
    return this.doList(this._at(slug, project, property), params as Record<string, unknown>);
  }

  /** Every option, following pages automatically. */
  iterate(
    slug: string,
    project: string,
    property: string,
    params?: ListWorkItemPropertyOptionsParams
  ): AsyncGenerator<WorkItemPropertyOptionLite> {
    return this.doIterate(this._at(slug, project, property), params as Record<string, unknown>);
  }

  retrieve(slug: string, project: string, property: string, option: string): Promise<WorkItemPropertyOptionLite> {
    return this.doRetrieve(this._at(slug, project, property, option));
  }

  /** The one option with this `name` on the property, server-side via `?name=`; throws if none or several match. */
  findByName(slug: string, project: string, property: string, name: string): Promise<WorkItemPropertyOptionLite> {
    return this.doFindOne({ name }, this._at(slug, project, property));
  }

  create(
    slug: string,
    project: string,
    property: string,
    data: CreateWorkItemPropertyOption
  ): Promise<WorkItemPropertyOptionLite> {
    return this.doCreate(data, this._at(slug, project, property));
  }

  update(
    slug: string,
    project: string,
    property: string,
    option: string,
    data: UpdateWorkItemPropertyOption
  ): Promise<WorkItemPropertyOptionLite> {
    return this.doUpdate(data, this._at(slug, project, property, option));
  }

  delete(slug: string, project: string, property: string, option: string): Promise<void> {
    return this.doDelete(this._at(slug, project, property, option));
  }
}
