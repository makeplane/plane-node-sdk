import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import {
  CreateWorkItemDependencyRequest,
  WorkItemDependencyResponse,
  WorkItemWithRelationType,
} from "../../models/WorkItem";

/**
 * WorkItemDependencies API resource
 * Manages work item dependency relations across the six built-in directions:
 * blocking / blocked_by / start_before / start_after / finish_before / finish_after
 */
export class Dependencies extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * List all dependency relations for a work item grouped by direction
   */
  async list(workspaceSlug: string, projectId: string, workItemId: string): Promise<WorkItemDependencyResponse> {
    return this.get<WorkItemDependencyResponse>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/dependencies/`
    );
  }

  /**
   * Create one or more dependency relations for a work item
   */
  async create(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    createDependency: CreateWorkItemDependencyRequest
  ): Promise<WorkItemWithRelationType[]> {
    return this.post<WorkItemWithRelationType[]>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/dependencies/`,
      createDependency
    );
  }

  /**
   * Remove a dependency relation between this work item and a target
   */
  async remove(workspaceSlug: string, projectId: string, workItemId: string, relatedWorkItemId: string): Promise<void> {
    return this.httpDelete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/dependencies/${relatedWorkItemId}/`
    );
  }
}
