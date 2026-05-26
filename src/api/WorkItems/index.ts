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
} from "../../models/WorkItem";
import { PaginatedResponse } from "../../models/common";
import { Links } from "../Links";
import { Relations } from "./Relations";
import { Attachments } from "./Attachments";
import { Comments } from "./Comments";
import { Activities } from "./Activities";
import { WorkLogs } from "./WorkLogs";

/**
 * Prepare query params for work-item list endpoints.
 *
 * The backend's `filters=` query parameter expects a JSON-encoded string,
 * not an exploded object — so we stringify it here before letting axios
 * URL-encode the result into a single query value. Everything else passes
 * through unchanged.
 *
 * Exported for reuse from sibling resources (Cycles, Modules) that list
 * work items.
 */
export function prepareWorkItemParams(params?: ListWorkItemsParams): Record<string, unknown> | undefined {
  if (!params) return undefined;
  if (params.filters === undefined) return params as Record<string, unknown>;
  const { filters, ...rest } = params;
  return { ...rest, filters: JSON.stringify(filters) };
}

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

  constructor(config: Configuration) {
    super(config);
    this.links = new Links(config);
    this.relations = new Relations(config);
    this.attachments = new Attachments(config);
    this.comments = new Comments(config);
    this.activities = new Activities(config);
    this.workLogs = new WorkLogs(config);
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
   * List work items in a project with optional filtering.
   *
   * Supports rich filtering via `filters` (structured) and `pql` (Plane
   * Query Language). The `filters` object is JSON-encoded into a single
   * `filters=` query parameter before sending.
   *
   * @example
   * ```ts
   * await client.workItems.list("my-workspace", "project-id", {
   *   filters: { and: [{ priority: "urgent" }, { state_group__in: ["unstarted", "started"] }] },
   *   order_by: "-created_at",
   *   per_page: 50,
   * });
   *
   * await client.workItems.list("my-workspace", "project-id", {
   *   pql: 'priority = "urgent" AND assignee = currentUser()',
   * });
   * ```
   */
  async list(
    workspaceSlug: string,
    projectId: string,
    params?: ListWorkItemsParams
  ): Promise<PaginatedResponse<WorkItem>> {
    return this.get<PaginatedResponse<WorkItem>>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/`,
      prepareWorkItemParams(params)
    );
  }

  /**
   * List work items across an entire workspace.
   *
   * Returns a paginated envelope of work items the caller can view,
   * spanning every project in the workspace (per-project authorization
   * and conditional grants are honored server-side). Supports the same
   * `filters` and `pql` query parameters as {@link WorkItems.list}.
   *
   * @example
   * ```ts
   * await client.workItems.listWorkspace("my-workspace", {
   *   filters: { priority: "urgent" },
   *   order_by: "-created_at",
   *   per_page: 50,
   * });
   * ```
   */
  async listWorkspace(workspaceSlug: string, params?: ListWorkItemsParams): Promise<PaginatedResponse<WorkItem>> {
    return this.get<PaginatedResponse<WorkItem>>(
      `/workspaces/${workspaceSlug}/work-items/`,
      prepareWorkItemParams(params)
    );
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
