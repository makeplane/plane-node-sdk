import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import {
  CreateWorkItemRelationDefinition,
  ListWorkItemRelationDefinitionsParams,
  UpdateWorkItemRelationDefinition,
  WorkItemRelationDefinition,
} from "../models/WorkItemRelationDefinition";

/**
 * WorkItemRelationDefinitions API resource
 * Manages work item relation definitions at the workspace level
 */
export class WorkItemRelationDefinitions extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  async list(
    workspaceSlug: string,
    params?: ListWorkItemRelationDefinitionsParams
  ): Promise<WorkItemRelationDefinition[]> {
    const query: Record<string, string> = {};
    if (params?.is_default !== undefined) query["is_default"] = String(params.is_default);
    if (params?.is_active !== undefined) query["is_active"] = String(params.is_active);

    const data = await this.get<WorkItemRelationDefinition[] | { results: WorkItemRelationDefinition[] }>(
      `/workspaces/${workspaceSlug}/work-item-relation-definitions/`,
      Object.keys(query).length ? query : undefined
    );
    return Array.isArray(data) ? data : data.results;
  }

  async create(workspaceSlug: string, data: CreateWorkItemRelationDefinition): Promise<WorkItemRelationDefinition> {
    return this.post<WorkItemRelationDefinition>(`/workspaces/${workspaceSlug}/work-item-relation-definitions/`, data);
  }

  async update(
    workspaceSlug: string,
    definitionId: string,
    data: UpdateWorkItemRelationDefinition
  ): Promise<WorkItemRelationDefinition> {
    return this.patch<WorkItemRelationDefinition>(
      `/workspaces/${workspaceSlug}/work-item-relation-definitions/${definitionId}/`,
      data
    );
  }

  async del(workspaceSlug: string, definitionId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/work-item-relation-definitions/${definitionId}/`);
  }
}
