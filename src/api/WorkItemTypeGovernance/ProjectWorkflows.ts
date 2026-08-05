import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import {
  GovernancePreview,
  ProjectTypeWorkflow,
  ProjectWorkflowPickResult,
  SetProjectWorkflowPick,
  WorkflowFallbackPreviewRequest,
} from "../../models/WorkItemTypeGovernance";

type GovernancePreviewResponse = { preview?: GovernancePreview } | GovernancePreview;

function unwrapPreview(response: GovernancePreviewResponse): GovernancePreview {
  return "preview" in response && response.preview ? response.preview : (response as GovernancePreview);
}

/**
 * WorkItemTypeGovernance.projectWorkflows sub-resource
 *
 * Reports each active type's governance mode and the workflow it effectively
 * resolves to within a project, and manages the project's own workflow pick
 * for a type.
 */
export class ProjectWorkflows extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * List every active type's governance mode, effective workflow, and
   * pickable options for a project
   */
  async list(workspaceSlug: string, projectId: string): Promise<ProjectTypeWorkflow[]> {
    const data = await this.get<ProjectTypeWorkflow[] | { results: ProjectTypeWorkflow[] }>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-types/workflows/`
    );
    return Array.isArray(data) ? data : data.results;
  }

  /**
   * Retrieve one type's governance mode and effective workflow in a project
   */
  async retrieve(workspaceSlug: string, projectId: string, typeId: string): Promise<ProjectTypeWorkflow> {
    return this.get<ProjectTypeWorkflow>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-types/${typeId}/workflows/`
    );
  }

  /**
   * Retrieve the project's current workflow pick context for a type
   */
  async retrievePick(workspaceSlug: string, projectId: string, typeId: string): Promise<ProjectTypeWorkflow> {
    return this.get<ProjectTypeWorkflow>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-types/${typeId}/workflow/`
    );
  }

  /**
   * Set the project's workflow pick for a type.
   * Runs the workflow fallback for stranded work items; every orphan must be
   * covered by `data.state_mapping` (400 with an orphan report otherwise).
   */
  async updatePick(
    workspaceSlug: string,
    projectId: string,
    typeId: string,
    data: SetProjectWorkflowPick
  ): Promise<ProjectWorkflowPickResult> {
    return this.put<ProjectWorkflowPickResult>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/work-item-types/${typeId}/workflow/`,
      data
    );
  }

  /**
   * Dry-run the project's workflow fallback (re-type / switch dialogs)
   */
  async previewFallback(
    workspaceSlug: string,
    projectId: string,
    data: WorkflowFallbackPreviewRequest
  ): Promise<GovernancePreview> {
    const response = await this.post<GovernancePreviewResponse>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/workflow-fallback-preview/`,
      data
    );
    return unwrapPreview(response);
  }
}
