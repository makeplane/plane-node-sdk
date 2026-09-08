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

/** `?fields=` on a single-row read or write. */
export interface WorkItemLinkFieldsParams {
  fields?: readonly WorkItemLinkField[];
}

/** Links attached to a work item. */
export class Links extends V2Resource<WorkItemLink, CreateWorkItemLink, UpdateWorkItemLink> {
  protected path = "/workspaces/{slug}/projects/{project_id}/work-items/{work_item_id}/links/";
  protected operations: Record<string, OperationId> = {
    list: "links_list",
    retrieve: "links_retrieve",
    create: "links_create",
    update: "links_partial_update",
    delete: "links_destroy",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkItemLinkField, "all"> & keyof WorkItemLink>(
    slug: string,
    project: string,
    workItem: string,
    params: ListWorkItemLinksParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItemLink, F | "id">>>;
  list(slug: string, project: string, workItem: string, params?: ListWorkItemLinksParams): Promise<Page<WorkItemLink>>;
  list(slug: string, project: string, workItem: string, params?: ListWorkItemLinksParams): Promise<Page<WorkItemLink>> {
    return this.doList({ slug, project_id: project, work_item_id: workItem }, params as Record<string, unknown>);
  }

  /** Every link, following pages automatically. */
  iterate<F extends Exclude<WorkItemLinkField, "all"> & keyof WorkItemLink>(
    slug: string,
    project: string,
    workItem: string,
    params: ListWorkItemLinksParams & { fields: readonly F[] }
  ): AsyncGenerator<Pick<WorkItemLink, F | "id">>;
  iterate(
    slug: string,
    project: string,
    workItem: string,
    params?: ListWorkItemLinksParams
  ): AsyncGenerator<WorkItemLink>;
  iterate(
    slug: string,
    project: string,
    workItem: string,
    params?: ListWorkItemLinksParams
  ): AsyncGenerator<WorkItemLink> {
    return this.doIterate({ slug, project_id: project, work_item_id: workItem }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkItemLinkField, "all"> & keyof WorkItemLink>(
    slug: string,
    project: string,
    workItem: string,
    link: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkItemLink, F | "id">>;
  retrieve(
    slug: string,
    project: string,
    workItem: string,
    link: string,
    params?: WorkItemLinkFieldsParams
  ): Promise<WorkItemLink>;
  retrieve(
    slug: string,
    project: string,
    workItem: string,
    link: string,
    params?: WorkItemLinkFieldsParams
  ): Promise<WorkItemLink> {
    return this.doRetrieve(
      { slug, project_id: project, work_item_id: workItem, pk: link },
      params as Record<string, unknown>
    );
  }

  create(
    slug: string,
    project: string,
    workItem: string,
    data: CreateWorkItemLink,
    params?: WorkItemLinkFieldsParams
  ): Promise<WorkItemLink> {
    return this.doCreate(
      data,
      { slug, project_id: project, work_item_id: workItem },
      params as Record<string, unknown>
    );
  }

  update(
    slug: string,
    project: string,
    workItem: string,
    link: string,
    data: UpdateWorkItemLink,
    params?: WorkItemLinkFieldsParams
  ): Promise<WorkItemLink> {
    return this.doUpdate(
      data,
      { slug, project_id: project, work_item_id: workItem, pk: link },
      params as Record<string, unknown>
    );
  }

  delete(slug: string, project: string, workItem: string, link: string): Promise<void> {
    return this.doDelete({ slug, project_id: project, work_item_id: workItem, pk: link });
  }
}
