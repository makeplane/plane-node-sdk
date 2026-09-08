import { BulkUpdateItem, BulkWriteResponse, Page } from "../../../models/v2/common";
import { WorkItem, UpdateWorkItem, WorkItemPriority, CreateWorkItem } from "../../../models/v2/WorkItem";
import { WorkItemExpand, WorkItemField, WorkItemOrderBy } from "../generated/constants";
import { LoadedMeta, LoadsNavigableRows, NavigationFactories, owned } from "../kernel/loaded";
import { AnyOperationId } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import { LoadedWorkItem, LoadedWorkItemRow, WORK_ITEM_ID_NAMES, WorkItemNavigation } from "../loaded/WorkItem";
import { Activities } from "./Activities";
import { Attachments } from "./Attachments";
import { Comments } from "./Comments";
import { Dependencies } from "./Dependencies";
import { Links } from "./Links";
import { Relations } from "./Relations";
import { WorkLogs } from "./WorkLogs";

export interface ListWorkItemsParams {
  fields?: readonly WorkItemField[];
  expand?: readonly WorkItemExpand[];
  order_by?: WorkItemOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
  search?: string;
  external_id?: string;
  external_source?: string;
  sequence_id?: number;
  is_draft?: boolean;

  assignee_id?: string;
  assignee_id__in?: readonly string[];
  assignee_id__isnull?: boolean;
  cycle_id?: string;
  cycle_id__in?: readonly string[];
  cycle_id__isnull?: boolean;
  label_id?: string;
  label_id__in?: readonly string[];
  label_id__isnull?: boolean;
  module_id?: string;
  module_id__in?: readonly string[];
  module_id__isnull?: boolean;
  parent_id?: string;
  parent_id__in?: readonly string[];
  parent_id__isnull?: boolean;
  /** A single project's uuid — meaningful on `WorkspaceWorkItems.list`; a no-op filter on this project-scoped `list`. */
  project_id?: string;
  project_id__in?: readonly string[];
  priority?: WorkItemPriority;
  priority__in?: readonly WorkItemPriority[];
  state_id?: string;
  state_id__in?: readonly string[];
  state_group?: string;
  state_group__in?: readonly string[];
  type_id?: string;
  type_id__in?: readonly string[];

  created_at__gte?: string;
  created_at__lte?: string;
  updated_at__gte?: string;
  updated_at__lte?: string;
  start_date__gte?: string;
  start_date__lte?: string;
  target_date__gte?: string;
  target_date__lte?: string;
}

/** `?fields=`/`?expand=` on a single-row read or write. */
export interface WorkItemShapeParams {
  fields?: readonly WorkItemField[];
  expand?: readonly WorkItemExpand[];
}

/**
 * Work items — CRUD plus per-item sub-resources. Write DTOs accept human values, not ids.
 *
 * Reached flat — `v2.workspaces.projects.workItems.list(slug, project)` — or from a fetched
 * project, which supplies both leading ids: `project.workItems.list()`. Every
 * row-returning method answers a {@link LoadedWorkItem}: the row's own data plus the
 * path ids its children need, so `workItem.comments.list()` needs nothing repeated.
 */
export class WorkItems extends LoadsNavigableRows<WorkItem, CreateWorkItem, UpdateWorkItem, WorkItemNavigation> {
  protected path = "/workspaces/{slug}/projects/{project_id}/work-items/";
  protected operations: Record<string, AnyOperationId> = {
    list: "work_items_list",
    retrieve: "work_items_retrieve",
    create: "work_items_create",
    update: "work_items_partial_update",
    upsert: "work_items_upsert",
    archive: "work_items_archive",
    unarchive: "work_items_unarchive",
    delete: "work_items_destroy",
    bulkCreate: "work_items_bulk_create",
    bulkUpdate: "work_items_bulk_update",
    bulkDelete: "work_items_bulk_delete",
  };
  protected loadedIdNames = WORK_ITEM_ID_NAMES;

  public comments: Comments;
  public attachments: Attachments;
  public links: Links;
  public worklogs: WorkLogs;
  public activities: Activities;
  public relations: Relations;
  public dependencies: Dependencies;

  constructor(transport: V2Transport) {
    super(transport);
    this.comments = new Comments(transport);
    this.attachments = new Attachments(transport);
    this.links = new Links(transport);
    this.worklogs = new WorkLogs(transport);
    this.activities = new Activities(transport);
    this.relations = new Relations(transport);
    this.dependencies = new Dependencies(transport);
  }

  protected navigationOf(meta: LoadedMeta): NavigationFactories<WorkItemNavigation> {
    const ids = meta.ids as [string, string, string];
    return {
      comments: () => owned(this.comments, ids, meta.idNames),
      attachments: () => owned(this.attachments, ids, meta.idNames),
      links: () => owned(this.links, ids, meta.idNames),
      worklogs: () => owned(this.worklogs, ids, meta.idNames),
      activities: () => owned(this.activities, ids, meta.idNames),
      relations: () => owned(this.relations, ids, meta.idNames),
      dependencies: () => owned(this.dependencies, ids, meta.idNames),
    };
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkItemField, "all"> & keyof WorkItem>(
    slug: string,
    project: string,
    params: ListWorkItemsParams & { fields: readonly F[] }
  ): Promise<Page<LoadedWorkItemRow<Pick<WorkItem, F | "id">>>>;
  list(slug: string, project: string, params?: ListWorkItemsParams): Promise<Page<LoadedWorkItem>>;
  async list(slug: string, project: string, params?: ListWorkItemsParams): Promise<Page<LoadedWorkItem>> {
    const page = await this.doList({ slug, project_id: project }, params as Record<string, unknown>);
    return this.loadPage(page, [slug, project], params?.fields);
  }

  /** Every work item in the project, following pages automatically — navigable rows included. */
  iterate<F extends Exclude<WorkItemField, "all"> & keyof WorkItem>(
    slug: string,
    project: string,
    params: ListWorkItemsParams & { fields: readonly F[] }
  ): AsyncGenerator<LoadedWorkItemRow<Pick<WorkItem, F | "id">>>;
  iterate(slug: string, project: string, params?: ListWorkItemsParams): AsyncGenerator<LoadedWorkItem>;
  iterate(slug: string, project: string, params?: ListWorkItemsParams): AsyncGenerator<LoadedWorkItem> {
    return this.loadIterate(
      this.doIterate({ slug, project_id: project }, params as Record<string, unknown>),
      [slug, project],
      params?.fields
    );
  }

  retrieve<F extends Exclude<WorkItemField, "all"> & keyof WorkItem>(
    slug: string,
    project: string,
    workItem: string,
    params: { fields: readonly F[]; expand?: readonly WorkItemExpand[] }
  ): Promise<LoadedWorkItemRow<Pick<WorkItem, F | "id">>>;
  retrieve(slug: string, project: string, workItem: string, params?: WorkItemShapeParams): Promise<LoadedWorkItem>;
  async retrieve(
    slug: string,
    project: string,
    workItem: string,
    params?: WorkItemShapeParams
  ): Promise<LoadedWorkItem> {
    const row = await this.doRetrieve({ slug, project_id: project, pk: workItem }, params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  create<F extends Exclude<WorkItemField, "all"> & keyof WorkItem>(
    slug: string,
    project: string,
    data: CreateWorkItem,
    params: WorkItemShapeParams & { fields: readonly F[] }
  ): Promise<LoadedWorkItemRow<Pick<WorkItem, F | "id">>>;
  create(slug: string, project: string, data: CreateWorkItem, params?: WorkItemShapeParams): Promise<LoadedWorkItem>;
  async create(
    slug: string,
    project: string,
    data: CreateWorkItem,
    params?: WorkItemShapeParams
  ): Promise<LoadedWorkItem> {
    const row = await this.doCreate(data, { slug, project_id: project }, params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  update<F extends Exclude<WorkItemField, "all"> & keyof WorkItem>(
    slug: string,
    project: string,
    workItem: string,
    data: UpdateWorkItem,
    params: WorkItemShapeParams & { fields: readonly F[] }
  ): Promise<LoadedWorkItemRow<Pick<WorkItem, F | "id">>>;
  update(
    slug: string,
    project: string,
    workItem: string,
    data: UpdateWorkItem,
    params?: WorkItemShapeParams
  ): Promise<LoadedWorkItem>;
  async update(
    slug: string,
    project: string,
    workItem: string,
    data: UpdateWorkItem,
    params?: WorkItemShapeParams
  ): Promise<LoadedWorkItem> {
    const row = await this.doUpdate(
      data,
      { slug, project_id: project, pk: workItem },
      params as Record<string, unknown>
    );
    return this.load(row, [slug, project], params?.fields);
  }

  delete(slug: string, project: string, workItem: string): Promise<void> {
    return this.doDelete({ slug, project_id: project, pk: workItem });
  }

  /** Reconciles on (external_source, external_id) when both are set. */
  upsert<F extends Exclude<WorkItemField, "all"> & keyof WorkItem>(
    slug: string,
    project: string,
    data: CreateWorkItem,
    params: WorkItemShapeParams & { fields: readonly F[] }
  ): Promise<LoadedWorkItemRow<Pick<WorkItem, F | "id">>>;
  upsert(slug: string, project: string, data: CreateWorkItem, params?: WorkItemShapeParams): Promise<LoadedWorkItem>;
  async upsert(
    slug: string,
    project: string,
    data: CreateWorkItem,
    params?: WorkItemShapeParams
  ): Promise<LoadedWorkItem> {
    const row = await this.doUpsert(data, { slug, project_id: project }, params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  bulkCreate(slug: string, project: string, items: CreateWorkItem[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkCreate(items, { slug, project_id: project }, allOrNone);
  }

  /** Each item is the patch plus the target `id`. */
  bulkUpdate(
    slug: string,
    project: string,
    items: BulkUpdateItem<UpdateWorkItem>[],
    allOrNone = false
  ): Promise<BulkWriteResponse> {
    return this.doBulkUpdate(items, { slug, project_id: project }, allOrNone);
  }

  bulkDelete(slug: string, project: string, ids: string[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkDelete(ids, { slug, project_id: project }, allOrNone);
  }

  /** Archive a work item. Returns the archived row. */
  archive<F extends Exclude<WorkItemField, "all"> & keyof WorkItem>(
    slug: string,
    project: string,
    workItem: string,
    params: WorkItemShapeParams & { fields: readonly F[] }
  ): Promise<LoadedWorkItemRow<Pick<WorkItem, F | "id">>>;
  archive(slug: string, project: string, workItem: string, params?: WorkItemShapeParams): Promise<LoadedWorkItem>;
  async archive(
    slug: string,
    project: string,
    workItem: string,
    params?: WorkItemShapeParams
  ): Promise<LoadedWorkItem> {
    const row = await this.doAction<WorkItem>(
      "archive",
      { slug, project_id: project, pk: workItem },
      params as Record<string, unknown>
    );
    return this.load(row, [slug, project], params?.fields);
  }

  /** Unarchive a work item. Returns the restored row. */
  unarchive<F extends Exclude<WorkItemField, "all"> & keyof WorkItem>(
    slug: string,
    project: string,
    workItem: string,
    params: WorkItemShapeParams & { fields: readonly F[] }
  ): Promise<LoadedWorkItemRow<Pick<WorkItem, F | "id">>>;
  unarchive(slug: string, project: string, workItem: string, params?: WorkItemShapeParams): Promise<LoadedWorkItem>;
  async unarchive(
    slug: string,
    project: string,
    workItem: string,
    params?: WorkItemShapeParams
  ): Promise<LoadedWorkItem> {
    const row = await this.doAction<WorkItem>(
      "unarchive",
      { slug, project_id: project, pk: workItem },
      params as Record<string, unknown>
    );
    return this.load(row, [slug, project], params?.fields);
  }
}

export { Activities } from "./Activities";
export { Attachments } from "./Attachments";
export { Comments } from "./Comments";
export { Dependencies } from "./Dependencies";
export { Links } from "./Links";
export { Relations } from "./Relations";
export { WorkLogs } from "./WorkLogs";
export type {
  ListWorkItemActivitiesParams,
  WorkItemActivityExpand,
  WorkItemActivityField,
  WorkItemActivityOrderBy,
} from "./Activities";
export type { ListWorkItemAttachmentsParams, WorkItemAttachmentField, WorkItemAttachmentOrderBy } from "./Attachments";
export type {
  ListWorkItemCommentsParams,
  WorkItemCommentExpand,
  WorkItemCommentField,
  WorkItemCommentOrderBy,
  WorkItemCommentShapeParams,
} from "./Comments";
export type { ListWorkItemLinksParams, WorkItemLinkField, WorkItemLinkOrderBy } from "./Links";
export type {
  ListWorkItemWorklogsParams,
  WorkItemWorklogExpand,
  WorkItemWorklogField,
  WorkItemWorklogOrderBy,
} from "./WorkLogs";
