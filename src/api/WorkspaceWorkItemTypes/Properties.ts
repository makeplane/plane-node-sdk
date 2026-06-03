import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { WorkItemProperty } from "../../models/WorkItemProperty";
import { WorkspaceWorkItemTypePropertyLink } from "../../models/WorkItemType";

/**
 * WorkspaceWorkItemTypeProperties sub-resource
 * Manages property links on workspace-level work item types
 */
export class Properties extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  async list(workspaceSlug: string, typeId: string): Promise<WorkItemProperty[]> {
    const data = await this.get<WorkItemProperty[] | { results: WorkItemProperty[] }>(
      `/workspaces/${workspaceSlug}/work-item-types/${typeId}/properties/`
    );
    return Array.isArray(data) ? data : data.results;
  }

  async create(
    workspaceSlug: string,
    typeId: string,
    data: WorkspaceWorkItemTypePropertyLink
  ): Promise<WorkItemProperty> {
    return this.post<WorkItemProperty>(`/workspaces/${workspaceSlug}/work-item-types/${typeId}/properties/`, data);
  }

  async del(workspaceSlug: string, typeId: string, propertyId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/work-item-types/${typeId}/properties/${propertyId}/`);
  }
}
