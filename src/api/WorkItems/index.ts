import { BaseResource } from '../BaseResource';
import { Configuration } from '../../Configuration';
import {
  WorkItem,
  CreateWorkItem,
  UpdateWorkItem,
  ListWorkItemsParams,
  WorkItemExpandableFieldName,
  WorkItemBase,
} from '../../models/WorkItem';
import { PaginatedResponse } from '../../models/common';
import { Links } from '../Links';
import { Relations } from './Relations';
import { Attachments } from './Attachments';
import { Comments } from './Comments';
import { Activities } from './Activities';
import { WorkLogs } from './WorkLogs';
import { WorkItemSearch } from '../../models/schema-types';

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
  async create(
    workspaceSlug: string,
    projectId: string,
    createWorkItem: CreateWorkItem
  ): Promise<WorkItem> {
    return this.post<WorkItem>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/`,
      createWorkItem
    );
  }

  // method overloads
  async retrieve(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
  ): Promise<WorkItemBase>;

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
    return this.get<WorkItem<E>>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/`,
      { expand: expand?.join(',') }
    );
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
  async del(
    workspaceSlug: string,
    projectId: string,
    workItemId: string
  ): Promise<void> {
    return this.delete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/`
    );
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

  // method overloads
  async retrieveByIdentifier(
    workspaceSlug: string,
    identifier: string,
  ): Promise<WorkItemBase>;

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
    return this.get<WorkItem<E>>(
      `/workspaces/${workspaceSlug}/work-items/${identifier}/`,
      { expand: expand?.join(',') }
    );
  }

  /**
   * Search work items
   */
  async search(
    workspaceSlug: string,
    projectId: string,
    query: string,
    params?: any
  ): Promise<WorkItemSearch> {
    return this.get<WorkItemSearch>(
      `/workspaces/${workspaceSlug}/work-items/search/`,
      { ...params, search: query, project: projectId }
    );
  }
}
