import { Page } from "../../../models/v2/common";
import { WorkItemLink, UpdateWorkItemLink, CreateWorkItemLink } from "../../../models/v2/WorkItemLink";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";

export type WorkItemLinkField = (typeof FIELDS)["links_list"][number];
export type WorkItemLinkOrderBy = (typeof ORDER_BY)["links_list"][number];

export interface ListWorkItemLinksParams {
  fields?: readonly WorkItemLinkField[];
  title?: string;
  url?: string;
  search?: string;
  order_by?: WorkItemLinkOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** Links attached to a work item (api_v2). */
export class Links extends V2Resource<WorkItemLink, CreateWorkItemLink, UpdateWorkItemLink> {
  protected path = "/workspaces/{slug}/projects/{project_id}/work-items/{work_item_id}/links/";
  protected operations: Record<string, OperationId> = {
    list: "links_list",
    retrieve: "links_retrieve",
    create: "links_create",
    update: "links_partial_update",
    delete: "links_destroy",
  };

  private pk(workItemId: string, id?: string): Record<string, string> {
    const params: Record<string, string> = { work_item_id: workItemId };
    if (id !== undefined) params.pk = id;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkItemLinkField, "all"> & keyof WorkItemLink>(
    workItemId: string,
    params: ListWorkItemLinksParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItemLink, F | "id">>>;
  list(workItemId: string, params?: ListWorkItemLinksParams): Promise<Page<WorkItemLink>>;
  list(workItemId: string, params?: ListWorkItemLinksParams): Promise<Page<WorkItemLink>> {
    return this.doList(this.pk(workItemId), params as Record<string, unknown>);
  }

  /** Every link, following pages automatically. */
  iterate(workItemId: string, params?: ListWorkItemLinksParams): AsyncGenerator<WorkItemLink> {
    return this.doIterate(this.pk(workItemId), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkItemLinkField, "all"> & keyof WorkItemLink>(
    workItemId: string,
    linkId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkItemLink, F | "id">>;
  retrieve(
    workItemId: string,
    linkId: string,
    params?: { fields?: readonly WorkItemLinkField[] }
  ): Promise<WorkItemLink>;
  retrieve(
    workItemId: string,
    linkId: string,
    params?: { fields?: readonly WorkItemLinkField[] }
  ): Promise<WorkItemLink> {
    return this.doRetrieve(this.pk(workItemId, linkId), params as Record<string, unknown>);
  }

  create(
    workItemId: string,
    data: CreateWorkItemLink,
    params?: { fields?: readonly WorkItemLinkField[] }
  ): Promise<WorkItemLink> {
    return this.doCreate(data, this.pk(workItemId), params as Record<string, unknown>);
  }

  update(
    workItemId: string,
    linkId: string,
    data: UpdateWorkItemLink,
    params?: { fields?: readonly WorkItemLinkField[] }
  ): Promise<WorkItemLink> {
    return this.doUpdate(data, this.pk(workItemId, linkId), params as Record<string, unknown>);
  }

  delete(workItemId: string, linkId: string): Promise<void> {
    return this.doDelete(this.pk(workItemId, linkId));
  }
}
