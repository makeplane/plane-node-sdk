import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { CreateWorkItemProperty, UpdateWorkItemProperty, WorkItemProperty } from "../../models/WorkItemProperty";
import { Options } from "./Options";

/**
 * WorkspaceWorkItemProperties API resource
 * Manages work item properties at the workspace level
 */
export class WorkspaceWorkItemProperties extends BaseResource {
  public options: Options;

  constructor(config: Configuration) {
    super(config);
    this.options = new Options(config);
  }

  async list(workspaceSlug: string): Promise<WorkItemProperty[]> {
    const data = await this.get<WorkItemProperty[] | { results: WorkItemProperty[] }>(
      `/workspaces/${workspaceSlug}/work-item-properties/`
    );
    return Array.isArray(data) ? data : data.results;
  }

  async create(workspaceSlug: string, data: CreateWorkItemProperty): Promise<WorkItemProperty> {
    return this.post<WorkItemProperty>(`/workspaces/${workspaceSlug}/work-item-properties/`, data);
  }

  async update(workspaceSlug: string, propertyId: string, data: UpdateWorkItemProperty): Promise<WorkItemProperty> {
    return this.patch<WorkItemProperty>(`/workspaces/${workspaceSlug}/work-item-properties/${propertyId}/`, data);
  }

  async del(workspaceSlug: string, propertyId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/work-item-properties/${propertyId}/`);
  }
}
