import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { CreateWorkItemCustomRelationRequest, WorkItemWithRelationType } from "../../models/WorkItem";

/**
 * WorkItemCustomRelations API resource
 * Manages custom (definition-based) work item relations.
 *
 * Custom relations are workspace-level types defined via the
 * work-item-relation-definitions endpoint. Each definition has an outward
 * label and an inward label that controls directionality.
 */
export class CustomRelations extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * List all custom relations for a work item grouped by definition label.
   * Response keys are the outward/inward labels from active workspace relation
   * definitions (e.g. "implements", "implemented by", "relates to").
   */
  async list(
    workspaceSlug: string,
    projectId: string,
    workItemId: string
  ): Promise<Record<string, WorkItemWithRelationType[]>> {
    return this.get<Record<string, WorkItemWithRelationType[]>>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/work-item-relations/`
    );
  }

  /**
   * Create one or more custom relations for a work item
   */
  async create(
    workspaceSlug: string,
    projectId: string,
    workItemId: string,
    createRelation: CreateWorkItemCustomRelationRequest
  ): Promise<WorkItemWithRelationType[]> {
    return this.post<WorkItemWithRelationType[]>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/work-item-relations/`,
      createRelation
    );
  }

  /**
   * Remove a custom relation between this work item and a target
   */
  async remove(workspaceSlug: string, projectId: string, workItemId: string, relatedWorkItemId: string): Promise<void> {
    return this.httpDelete(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-items/${workItemId}/work-item-relations/${relatedWorkItemId}/`
    );
  }
}
