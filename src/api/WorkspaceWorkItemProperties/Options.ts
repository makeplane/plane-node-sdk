import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import {
  CreateWorkItemPropertyOption,
  UpdateWorkItemPropertyOption,
  WorkItemPropertyOption,
} from "../../models/WorkItemProperty";

/**
 * WorkspaceWorkItemPropertyOptions sub-resource
 * Manages options on workspace-level work item properties
 */
export class Options extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  async list(workspaceSlug: string, propertyId: string): Promise<WorkItemPropertyOption[]> {
    const data = await this.get<WorkItemPropertyOption[] | { results: WorkItemPropertyOption[] }>(
      `/workspaces/${workspaceSlug}/work-item-properties/${propertyId}/options/`
    );
    return Array.isArray(data) ? data : data.results;
  }

  async create(
    workspaceSlug: string,
    propertyId: string,
    data: CreateWorkItemPropertyOption
  ): Promise<WorkItemPropertyOption> {
    return this.post<WorkItemPropertyOption>(
      `/workspaces/${workspaceSlug}/work-item-properties/${propertyId}/options/`,
      data
    );
  }

  async retrieve(workspaceSlug: string, propertyId: string, optionId: string): Promise<WorkItemPropertyOption> {
    return this.get<WorkItemPropertyOption>(
      `/workspaces/${workspaceSlug}/work-item-properties/${propertyId}/options/${optionId}/`
    );
  }

  async update(
    workspaceSlug: string,
    propertyId: string,
    optionId: string,
    data: UpdateWorkItemPropertyOption
  ): Promise<WorkItemPropertyOption> {
    return this.patch<WorkItemPropertyOption>(
      `/workspaces/${workspaceSlug}/work-item-properties/${propertyId}/options/${optionId}/`,
      data
    );
  }

  async delete(workspaceSlug: string, propertyId: string, optionId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/work-item-properties/${propertyId}/options/${optionId}/`);
  }
}
