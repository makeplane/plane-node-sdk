import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { CreateWorkItemTypeWorkflowPins, WorkItemTypeWorkflowPin } from "../../models/WorkItemTypeGovernance";

/**
 * WorkItemTypeGovernance.pins sub-resource
 *
 * A pin forces one project to resolve a type to a specific workflow,
 * overriding the workspace default and the constrained allowlist.
 */
export class Pins extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * List a type's project-to-workflow pins
   */
  async list(workspaceSlug: string, typeId: string): Promise<WorkItemTypeWorkflowPin[]> {
    const data = await this.get<WorkItemTypeWorkflowPin[] | { results: WorkItemTypeWorkflowPin[] }>(
      `/workspaces/${workspaceSlug}/work-item-types/${typeId}/governance/pins/`
    );
    return Array.isArray(data) ? data : data.results;
  }

  /**
   * Pin a workflow for this type across one or more projects.
   * Returns the type's pins after the change.
   */
  async create(
    workspaceSlug: string,
    typeId: string,
    data: CreateWorkItemTypeWorkflowPins
  ): Promise<WorkItemTypeWorkflowPin[]> {
    const response = await this.post<WorkItemTypeWorkflowPin[] | { results: WorkItemTypeWorkflowPin[] }>(
      `/workspaces/${workspaceSlug}/work-item-types/${typeId}/governance/pins/`,
      data
    );
    return Array.isArray(response) ? response : response.results;
  }

  /**
   * Remove a pin
   */
  async delete(workspaceSlug: string, typeId: string, pinId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/work-item-types/${typeId}/governance/pins/${pinId}/`);
  }
}
