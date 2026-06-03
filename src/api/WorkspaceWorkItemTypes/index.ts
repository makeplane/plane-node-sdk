import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { WorkItemType, CreateWorkItemType, UpdateWorkItemType } from "../../models/WorkItemType";
import { Properties } from "./Properties";

/**
 * WorkspaceWorkItemTypes API resource
 * Manages work item types at the workspace level
 */
export class WorkspaceWorkItemTypes extends BaseResource {
  public properties: Properties;

  constructor(config: Configuration) {
    super(config);
    this.properties = new Properties(config);
  }

  async list(workspaceSlug: string): Promise<WorkItemType[]> {
    const data = await this.get<WorkItemType[] | { results: WorkItemType[] }>(
      `/workspaces/${workspaceSlug}/work-item-types/`
    );
    return Array.isArray(data) ? data : data.results;
  }

  async create(workspaceSlug: string, data: CreateWorkItemType): Promise<WorkItemType> {
    return this.post<WorkItemType>(`/workspaces/${workspaceSlug}/work-item-types/`, data);
  }

  async update(workspaceSlug: string, typeId: string, data: UpdateWorkItemType): Promise<WorkItemType> {
    return this.patch<WorkItemType>(`/workspaces/${workspaceSlug}/work-item-types/${typeId}/`, data);
  }
}
