import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import {
  WorkItem,
  CreateWorkItem,
  UpdateWorkItem,
  ListWorkItemsParams,
  WorkItemExpandableFieldName,
  WorkItemBase,
  WorkItemSearch,
  AdvancedSearchWorkItem,
  AdvancedSearchResult,
  WorkItemCountParams,
  WorkItemCountResponse,
} from "../../models/WorkItem";
import { PaginatedResponse } from "../../models/common";
import { Links } from "../Links";
import { Relations } from "./Relations";
import { Attachments } from "./Attachments";
import { Comments } from "./Comments";
import { Activities } from "./Activities";
import { WorkLogs } from "./WorkLogs";
import { Dependencies } from "./Dependencies";
import { CustomRelations } from "./CustomRelations";
import { Pages } from "./Pages";

/**
 * WorkItems API resource
 * Handles all work item (issue) related operations
 */
export class WorkItems extends BaseResource {
  public links: Links;
  public relations: Relations;
  public attachments: Attachments;
  public comments: Comments;
  public activities: Activities;
  public workLogs: WorkLogs;
  public dependencies: Dependencies;
  public customRelations: CustomRelations;
  public pages: Pages;

  constructor(config: Configuration) {
    super(config);
    this.links = new Links(config);
    this.relations = new Relations(config);
    this.attachments = new Attachments(config);
    this.comments = new Comments(config);
    this.activities = new Activities(config);
    this.workLogs = new WorkLogs(config);
    this.dependencies = new Dependencies(config);
    this.customRelations = new CustomRelations(config);
    this.pages = new Pages(config);
  }

  /**
   * Create a new work item
   */
  async create(workspaceSlug: string, projectId: string, createWorkItem: CreateWorkItem): Promise<WorkItem> {
    return this.post<WorkItem>(`/workspaces/${workspaceSlug}/projects/${projectId}/work-items/`, createWorkItem);
  }

  // method overloads
  async retrieve(workspaceSlug: string, projectId: string, workItemId: string): Promise<WorkItemBase>;

  async retrieve<E extends WorkItemExpandableFieldName>(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    expand: E[]
  ): Promise<WorkItem<E>>;

  /**
   * Retrieve a work item by ID
   */
  async retrieve<E extends WorkItemExpandableFieldName>(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    expand?: E[]
  ): Promise<WorkItem<E>> {
    return this.get<WorkItem<E>>(`/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/`, {
      expand: expand?.join(","),
    });
  }

  /**
   * Update a work item
   */
  async update(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    updateWorkItem: UpdateWorkItem
  ): Promise<WorkItem> {
    return this.patch<WorkItem>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/`,
      updateWorkItem
    );
  }

  /**
   * Delete a work item
   */
  async delete(workspaceSlug: string, projectId: string, workItemId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/`);
  }

  /**
   * List work items with optional filtering
   */
  async list(
    workspaceSlug: string,
    projectId: string,
    params?: ListWorkItemsParams
  ): Promise<PaginatedResponse<WorkItem>> {
    return this.get<PaginatedResponse<WorkItem>>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/`,
      params
    );
  }

  /**
   * List work items across an entire workspace.
   *
   * Returns a paginated envelope of work items the caller can view, spanning
   * every project in the workspace (per-project authorization is honored
   * server-side). Supports `filters`, `pql`, `order_by`, `cursor`, `per_page`,
   * `fields`, and `expand` query params.
   */
  async listWorkspace(workspaceSlug: string, params?: ListWorkItemsParams): Promise<PaginatedResponse<WorkItem>> {
    return this.get<PaginatedResponse<WorkItem>>(`/workspaces/${workspaceSlug}/work-items/`, params);
  }

  /**
   * Return the count of work items across an entire workspace.
   *
   * Supports `filters`, `pql`, `group_by`, and `sub_group_by` query params.
   * `grouped_counts` keys are raw ORM field values: UUID strings for FK/M2M
   * dimensions, plain strings for `priority` / `state__group`, ISO-date strings
   * for `target_date` / `start_date`. "None" is used for empty values.
   */
  async countWorkspace(workspaceSlug: string, params?: WorkItemCountParams): Promise<WorkItemCountResponse> {
    return this.get<WorkItemCountResponse>(`/workspaces/${workspaceSlug}/work-items/count/`, params);
  }

  /**
   * List archived work items in a project.
   * Supports the same `filters` and `pql` query parameters as list().
   */
  async listArchived(
    workspaceSlug: string,
    projectId: string,
    params?: ListWorkItemsParams
  ): Promise<PaginatedResponse<WorkItem>> {
    return this.get<PaginatedResponse<WorkItem>>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/archived-work-items/`,
      params
    );
  }

  /**
   * Archive a work item.
   * Only work items in a completed or cancelled state can be archived.
   */
  async archive(workspaceSlug: string, projectId: string, workItemId: string): Promise<void> {
    await this.post<void>(`/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/archive/`, {});
  }

  /**
   * Unarchive a work item — restore it to active status.
   */
  async unarchive(workspaceSlug: string, projectId: string, workItemId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/unarchive/`);
  }

  // method overloads
  async retrieveByIdentifier(workspaceSlug: string, identifier: string): Promise<WorkItemBase>;

  async retrieveByIdentifier<E extends WorkItemExpandableFieldName>(
    workspaceSlug: string,
    identifier: string,
    expand: E[]
  ): Promise<WorkItem<E>>;

  // Implementation
  async retrieveByIdentifier<E extends WorkItemExpandableFieldName>(
    workspaceSlug: string,
    identifier: string,
    expand?: E[]
  ): Promise<WorkItem<E> | WorkItemBase> {
    return this.get<WorkItem<E>>(`/workspaces/${workspaceSlug}/work-items/${identifier}/`, {
      expand: expand?.join(","),
    });
  }

  /**
   * Search work items
   */
  async search(workspaceSlug: string, query: string, projectId?: string, params?: any): Promise<WorkItemSearch> {
    return this.get<WorkItemSearch>(`/workspaces/${workspaceSlug}/work-items/search/`, {
      ...params,
      search: query,
      project: projectId,
    });
  }

  /**
   * Perform advanced search on work items with filters.
   *
   * Supports text-based search via `query` and/or structured filters
   * using recursive AND/OR groups.
   */
  async advancedSearch(workspaceSlug: string, data: AdvancedSearchWorkItem): Promise<AdvancedSearchResult[]> {
    return this.post<AdvancedSearchResult[]>(`/workspaces/${workspaceSlug}/work-items/advanced-search/`, data);
  }
}
