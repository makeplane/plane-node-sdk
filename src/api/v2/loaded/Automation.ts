import type { Automation } from "../../../models/v2/Automation";
import type { ProjectAutomationActivities } from "../Automations/ProjectAutomationActivities";
import type { ProjectAutomationEdges } from "../Automations/ProjectAutomationEdges";
import type { ProjectAutomationNodes } from "../Automations/ProjectAutomationNodes";
import type { WorkspaceAutomationActivities } from "../Automations/WorkspaceAutomationActivities";
import type { WorkspaceAutomationEdges } from "../Automations/WorkspaceAutomationEdges";
import type { WorkspaceAutomationNodes } from "../Automations/WorkspaceAutomationNodes";
import type { Loaded, Owned } from "../kernel/loaded";

/**
 * Both scopes live here side by side so they stay diffable. A project-scoped automation
 * binds three ids and a workspace-scoped (global) one binds two; each reaches the same
 * three children, because the graph an automation owns is the same graph either way.
 */

/** The path ids a child of a project-scoped automation row needs, in URL order. */
export type AutomationIds = [slug: string, project: string, automation: string];

/** The parameter names behind {@link AutomationIds}, in the same order. */
export const AUTOMATION_ID_NAMES = ["slug", "project", "automation"] as const;

/** Everything a fetched project-scoped automation can reach: its graph and its audit log. */
export interface AutomationNavigation {
  readonly nodes: Owned<ProjectAutomationNodes, AutomationIds>;
  readonly edges: Owned<ProjectAutomationEdges, AutomationIds>;
  readonly activities: Owned<ProjectAutomationActivities, AutomationIds>;
}

/** A fetched project-scoped automation row that is also the place its graph lives. */
export type LoadedAutomationRow<TRow> = Loaded<TRow, AutomationNavigation>;

export type LoadedAutomation = LoadedAutomationRow<Automation>;

/** The path ids a child of a workspace-scoped automation row needs, in URL order. */
export type WorkspaceAutomationIds = [slug: string, automation: string];

/** The parameter names behind {@link WorkspaceAutomationIds}, in the same order. */
export const WORKSPACE_AUTOMATION_ID_NAMES = ["slug", "automation"] as const;

/** Everything a fetched workspace-scoped automation can reach. */
export interface WorkspaceAutomationNavigation {
  readonly nodes: Owned<WorkspaceAutomationNodes, WorkspaceAutomationIds>;
  readonly edges: Owned<WorkspaceAutomationEdges, WorkspaceAutomationIds>;
  readonly activities: Owned<WorkspaceAutomationActivities, WorkspaceAutomationIds>;
}

/** A fetched workspace-scoped automation row that is also the place its graph lives. */
export type LoadedWorkspaceAutomationRow<TRow> = Loaded<TRow, WorkspaceAutomationNavigation>;

export type LoadedWorkspaceAutomation = LoadedWorkspaceAutomationRow<Automation>;
