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
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=` on a single-row read or write. */
export interface WorkItemLinkFieldsParams {
  fields?: readonly WorkItemLinkField[];
}

/** Links attached to a work item. */
export class Links extends V2Resource<WorkItemLink, CreateWorkItemLink, UpdateWorkItemLink> {
  /** Exported from the v2 barrel as `WorkItemLinks`; `exported-names.test.ts` pins the two together. */
  static readonly publicName = "WorkItemLinks";

  protected path = "/workspaces/{slug}/projects/{project_id}/work-items/{work_item_id}/links/";
  protected operations: Record<string, OperationId> = {
    list: "links_list",
    retrieve: "links_retrieve",
    create: "links_create",
    update: "links_partial_update",
    delete: "links_destroy",
  };

  /**
   * One page of `WorkItemLink` rows. Use `iterate` to follow pages automatically.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  list<F extends Exclude<WorkItemLinkField, "all"> & keyof WorkItemLink>(
    slug: string,
    project: string,
    workItem: string,
    params: ListWorkItemLinksParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItemLink, F | "id">>>;
  /** One page of `WorkItemLink` rows. Use `iterate` to follow pages automatically. */
  list(slug: string, project: string, workItem: string, params?: ListWorkItemLinksParams): Promise<Page<WorkItemLink>>;
  list(slug: string, project: string, workItem: string, params?: ListWorkItemLinksParams): Promise<Page<WorkItemLink>> {
    return this.doList({ slug, project_id: project, work_item_id: workItem }, params as Record<string, unknown>);
  }

  /** Every link, following pages automatically. */
  iterate<F extends Exclude<WorkItemLinkField, "all"> & keyof WorkItemLink>(
    slug: string,
    project: string,
    workItem: string,
    params: Omit<ListWorkItemLinksParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<Pick<WorkItemLink, F | "id">>;
  /** Every link, following pages automatically. */
  iterate(
    slug: string,
    project: string,
    workItem: string,
    params?: Omit<ListWorkItemLinksParams, "offset" | "count">
  ): AsyncGenerator<WorkItemLink>;
  iterate(
    slug: string,
    project: string,
    workItem: string,
    params?: Omit<ListWorkItemLinksParams, "offset" | "count">
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

  create<F extends Exclude<WorkItemLinkField, "all"> & keyof WorkItemLink>(
    slug: string,
    project: string,
    workItem: string,
    data: CreateWorkItemLink,
    params: WorkItemLinkFieldsParams & { fields: readonly F[] }
  ): Promise<Pick<WorkItemLink, F | "id">>;
  create(
    slug: string,
    project: string,
    workItem: string,
    data: CreateWorkItemLink,
    params?: WorkItemLinkFieldsParams
  ): Promise<WorkItemLink>;
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

  update<F extends Exclude<WorkItemLinkField, "all"> & keyof WorkItemLink>(
    slug: string,
    project: string,
    workItem: string,
    link: string,
    data: UpdateWorkItemLink,
    params: WorkItemLinkFieldsParams & { fields: readonly F[] }
  ): Promise<Pick<WorkItemLink, F | "id">>;
  update(
    slug: string,
    project: string,
    workItem: string,
    link: string,
    data: UpdateWorkItemLink,
    params?: WorkItemLinkFieldsParams
  ): Promise<WorkItemLink>;
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
