import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import {
  GovernancePreview,
  TypeGovernance,
  TypeGovernancePreviewRequest,
  UpdateTypeGovernance,
} from "../../models/WorkItemTypeGovernance";
import { Pins } from "./Pins";
import { ProjectWorkflows } from "./ProjectWorkflows";

type GovernancePreviewResponse = { preview?: GovernancePreview } | GovernancePreview;

function unwrapPreview(response: GovernancePreviewResponse): GovernancePreview {
  return "preview" in response && response.preview ? response.preview : (response as GovernancePreview);
}

/**
 * WorkItemTypeGovernance API resource (workspace governance only)
 *
 * Governs which workflows a workspace-level work item type may use
 * (`any` / `constrained` / `required` modes and allowlists). Per-project pins
 * live on `.pins`; the project-side view of effective workflows and picks
 * lives on `.projectWorkflows`. Every endpoint requires the workspace to own
 * states and workflows — otherwise the API responds 400 with code
 * `workspace_not_managed`.
 */
export class WorkItemTypeGovernance extends BaseResource {
  public pins: Pins;
  public projectWorkflows: ProjectWorkflows;

  constructor(config: Configuration) {
    super(config);
    this.pins = new Pins(config);
    this.projectWorkflows = new ProjectWorkflows(config);
  }

  /**
   * Retrieve a type's governance settings (mode, required workflow, allowlist)
   */
  async retrieve(workspaceSlug: string, typeId: string): Promise<TypeGovernance> {
    return this.get<TypeGovernance>(`/workspaces/${workspaceSlug}/work-item-types/${typeId}/governance/`);
  }

  /**
   * Update a type's governance mode / allowlist / required workflow.
   * Destructive changes (dropping in-use workflows, mandating one) require
   * `data.acknowledge` and may need a `data.state_mapping` for orphaned work
   * items.
   */
  async update(workspaceSlug: string, typeId: string, data: UpdateTypeGovernance): Promise<TypeGovernance> {
    return this.patch<TypeGovernance>(`/workspaces/${workspaceSlug}/work-item-types/${typeId}/governance/`, data);
  }

  /**
   * Dry-run a governance change and report affected work items (no writes)
   */
  async preview(workspaceSlug: string, typeId: string, data: TypeGovernancePreviewRequest): Promise<GovernancePreview> {
    const response = await this.post<GovernancePreviewResponse>(
      `/workspaces/${workspaceSlug}/work-item-types/${typeId}/governance/preview/`,
      data
    );
    return unwrapPreview(response);
  }
}
