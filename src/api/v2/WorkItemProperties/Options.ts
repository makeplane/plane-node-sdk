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

/** Options of an OPTION-typed property, scoped under a project + property; `list`/`retrieve` have no `fields` param. */
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

  private pk(propertyId: string, id?: string): Record<string, string> {
    const params: Record<string, string> = { property_id: propertyId };
    if (id !== undefined) params.pk = id;
    return params;
  }

  list(propertyId: string, params?: ListWorkItemPropertyOptionsParams): Promise<Page<WorkItemPropertyOptionLite>> {
    return this.doList(this.pk(propertyId), params as Record<string, unknown>);
  }

  /** Every option, following pages automatically. */
  iterate(propertyId: string, params?: ListWorkItemPropertyOptionsParams): AsyncGenerator<WorkItemPropertyOptionLite> {
    return this.doIterate(this.pk(propertyId), params as Record<string, unknown>);
  }

  retrieve(propertyId: string, optionId: string): Promise<WorkItemPropertyOptionLite> {
    return this.doRetrieve(this.pk(propertyId, optionId));
  }

  /** The one option with this `name` on the property, server-side via `?name=`; throws if none or several match. */
  findByName(propertyId: string, name: string): Promise<WorkItemPropertyOptionLite> {
    return this.doFindOne({ name }, this.pk(propertyId));
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
