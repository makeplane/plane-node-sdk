import { BulkUpdateItem, BulkWriteResponse, Page } from "../../../models/v2/common";
import { WorkItem, UpdateWorkItem, WorkItemPriority, CreateWorkItem } from "../../../models/v2/WorkItem";
import { WorkItemExpand, WorkItemField, WorkItemOrderBy } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
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

/** Work items — CRUD plus per-item sub-resources. Write DTOs accept human values, not ids. */
export class WorkItems extends V2Resource<WorkItem, CreateWorkItem, UpdateWorkItem> {
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

  public comments: Comments;
  public attachments: Attachments;
  public links: Links;
  public worklogs: WorkLogs;
  public activities: Activities;
  public relations: Relations;
  public dependencies: Dependencies;

  constructor(transport: V2Transport, scope: Record<string, string> = {}) {
    super(transport, scope);
    this.comments = new Comments(transport, scope);
    this.attachments = new Attachments(transport, scope);
    this.links = new Links(transport, scope);
    this.worklogs = new WorkLogs(transport, scope);
    this.activities = new Activities(transport, scope);
    this.relations = new Relations(transport, scope);
    this.dependencies = new Dependencies(transport, scope);
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkItemField, "all"> & keyof WorkItem>(
    params: ListWorkItemsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItem, F | "id">>>;
  list(params?: ListWorkItemsParams): Promise<Page<WorkItem>>;
  list(params?: ListWorkItemsParams): Promise<Page<WorkItem>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every work item in the project, following pages automatically. */
  iterate(params?: ListWorkItemsParams): AsyncGenerator<WorkItem> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkItemField, "all"> & keyof WorkItem>(
    workItemId: string,
    params: { fields: readonly F[]; expand?: readonly WorkItemExpand[] }
  ): Promise<Pick<WorkItem, F | "id">>;
  retrieve(
    workItemId: string,
    params?: { fields?: readonly WorkItemField[]; expand?: readonly WorkItemExpand[] }
  ): Promise<WorkItem>;
  retrieve(
    workItemId: string,
    params?: { fields?: readonly WorkItemField[]; expand?: readonly WorkItemExpand[] }
  ): Promise<WorkItem> {
    return this.doRetrieve({ pk: workItemId }, params as Record<string, unknown>);
  }

  create(
    data: CreateWorkItem,
    params?: { fields?: readonly WorkItemField[]; expand?: readonly WorkItemExpand[] }
  ): Promise<WorkItem> {
    return this.doCreate(data, {}, params as Record<string, unknown>);
  }

  update(
    workItemId: string,
    data: UpdateWorkItem,
    params?: { fields?: readonly WorkItemField[]; expand?: readonly WorkItemExpand[] }
  ): Promise<WorkItem> {
    return this.doUpdate(data, { pk: workItemId }, params as Record<string, unknown>);
  }

  delete(workItemId: string): Promise<void> {
    return this.doDelete({ pk: workItemId });
  }

  /** Reconciles on (external_source, external_id) when both are set. */
  upsert(
    data: CreateWorkItem,
    params?: { fields?: readonly WorkItemField[]; expand?: readonly WorkItemExpand[] }
  ): Promise<WorkItem> {
    return this.doUpsert(data, {}, params as Record<string, unknown>);
  }

  bulkCreate(items: CreateWorkItem[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkCreate(items, {}, allOrNone);
  }

  bulkUpdate(items: BulkUpdateItem<UpdateWorkItem>[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkUpdate(items, {}, allOrNone);
  }

  bulkDelete(ids: string[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkDelete(ids, {}, allOrNone);
  }

  /** Archive a work item. Returns the archived row. */
  archive(
    workItemId: string,
    params?: { fields?: readonly WorkItemField[]; expand?: readonly WorkItemExpand[] }
  ): Promise<WorkItem> {
    return this.doAction<WorkItem>("archive", { pk: workItemId }, params as Record<string, unknown>);
  }

  /** Unarchive a work item. Returns the restored row. */
  unarchive(
    workItemId: string,
    params?: { fields?: readonly WorkItemField[]; expand?: readonly WorkItemExpand[] }
  ): Promise<WorkItem> {
    return this.doAction<WorkItem>("unarchive", { pk: workItemId }, params as Record<string, unknown>);
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
} from "./Comments";
export type { ListWorkItemLinksParams, WorkItemLinkField, WorkItemLinkOrderBy } from "./Links";
export type {
  ListWorkItemWorklogsParams,
  WorkItemWorklogExpand,
  WorkItemWorklogField,
  WorkItemWorklogOrderBy,
} from "./WorkLogs";
