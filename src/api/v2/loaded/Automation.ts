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
export type ProjectAutomationIds = [slug: string, project: string, automation: string];

/** The parameter names behind {@link ProjectAutomationIds}, in the same order. */
export const PROJECT_AUTOMATION_ID_NAMES = ["slug", "project", "automation"] as const;

/** Everything a fetched project-scoped automation can reach: its graph and its audit log. */
export interface ProjectAutomationNavigation {
  /**
   * ProjectAutomationNodes with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly nodes: Owned<ProjectAutomationNodes, ProjectAutomationIds>;
  /**
   * ProjectAutomationEdges with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly edges: Owned<ProjectAutomationEdges, ProjectAutomationIds>;
  /**
   * ProjectAutomationActivities with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly activities: Owned<ProjectAutomationActivities, ProjectAutomationIds>;
}

/** A fetched project-scoped automation row that is also the place its graph lives. */
export type LoadedProjectAutomationRow<TRow> = Loaded<TRow, ProjectAutomationNavigation>;

export type LoadedProjectAutomation = LoadedProjectAutomationRow<Automation>;

/** The path ids a child of a workspace-scoped automation row needs, in URL order. */
export type WorkspaceAutomationIds = [slug: string, automation: string];

/** The parameter names behind {@link WorkspaceAutomationIds}, in the same order. */
export const WORKSPACE_AUTOMATION_ID_NAMES = ["slug", "automation"] as const;

/** Everything a fetched workspace-scoped automation can reach. */
export interface WorkspaceAutomationNavigation {
  /**
   * WorkspaceAutomationNodes with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly nodes: Owned<WorkspaceAutomationNodes, WorkspaceAutomationIds>;
  /**
   * WorkspaceAutomationEdges with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly edges: Owned<WorkspaceAutomationEdges, WorkspaceAutomationIds>;
  /**
   * WorkspaceAutomationActivities with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly activities: Owned<WorkspaceAutomationActivities, WorkspaceAutomationIds>;
}

/** A fetched workspace-scoped automation row that is also the place its graph lives. */
export type LoadedWorkspaceAutomationRow<TRow> = Loaded<TRow, WorkspaceAutomationNavigation>;

export type LoadedWorkspaceAutomation = LoadedWorkspaceAutomationRow<Automation>;
