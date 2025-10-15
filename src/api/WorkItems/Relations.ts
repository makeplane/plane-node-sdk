import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import {
  WorkItemRelationCreateRequest,
  WorkItemRelationRemoveRequest,
  WorkItemRelationResponse,
} from "../../models/WorkItemRelation";

/**
 * WorkItemRelations API resource
 * Handles all work item relation operations
 */
export class Relations extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Create relations between work items
   */
  async create(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    relationData: WorkItemRelationCreateRequest
  ): Promise<void> {
    return this.post<void>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/relations/`,
      relationData
    );
  }

  /**
   * Delete a relation between work items
   */
  async del(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    relationData: WorkItemRelationRemoveRequest
  ): Promise<void> {
    return this.post(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/relations/remove/`,
      relationData
    );
  }

  /**
   * List relations for a work item
   */
  async list(
    workspaceSlug: string,
    projectId: string,
    workItemId: string
  ): Promise<WorkItemRelationResponse> {
    return this.get<WorkItemRelationResponse>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/relations/`
    );
  }
}
