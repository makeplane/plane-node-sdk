import { V2Transport } from "../kernel/transport";
import { ProjectAutomations } from "./ProjectAutomations";
import { WorkspaceAutomations } from "./WorkspaceAutomations";

/** Automations — project-scoped and workspace-scoped (global) variants, each with its own path/operation ids. */
export class Automations {
  public project: ProjectAutomations;
  public workspace: WorkspaceAutomations;

  constructor(transport: V2Transport) {
    this.project = new ProjectAutomations(transport);
    this.workspace = new WorkspaceAutomations(transport);
  }
}

export { ProjectAutomations } from "./ProjectAutomations";
export type {
  ListProjectAutomationsParams,
  ProjectAutomationField,
  ProjectAutomationOrderBy,
} from "./ProjectAutomations";
export { WorkspaceAutomations } from "./WorkspaceAutomations";
export type {
  ListWorkspaceAutomationsParams,
  WorkspaceAutomationField,
  WorkspaceAutomationOrderBy,
} from "./WorkspaceAutomations";

export { ProjectAutomationNodes } from "./ProjectAutomationNodes";
export type {
  ListProjectAutomationNodesParams,
  ProjectAutomationNodeField,
  ProjectAutomationNodeOrderBy,
} from "./ProjectAutomationNodes";
export { WorkspaceAutomationNodes } from "./WorkspaceAutomationNodes";
export type {
  ListWorkspaceAutomationNodesParams,
  WorkspaceAutomationNodeField,
  WorkspaceAutomationNodeOrderBy,
} from "./WorkspaceAutomationNodes";

export { ProjectAutomationEdges } from "./ProjectAutomationEdges";
export type {
  ListProjectAutomationEdgesParams,
  ProjectAutomationEdgeField,
  ProjectAutomationEdgeOrderBy,
} from "./ProjectAutomationEdges";
export { WorkspaceAutomationEdges } from "./WorkspaceAutomationEdges";
export type {
  ListWorkspaceAutomationEdgesParams,
  WorkspaceAutomationEdgeField,
  WorkspaceAutomationEdgeOrderBy,
} from "./WorkspaceAutomationEdges";

export { ProjectAutomationActivities } from "./ProjectAutomationActivities";
export type {
  ListProjectAutomationActivitiesParams,
  ProjectAutomationActivityField,
  ProjectAutomationActivityOrderBy,
} from "./ProjectAutomationActivities";
export { WorkspaceAutomationActivities } from "./WorkspaceAutomationActivities";
export type {
  ListWorkspaceAutomationActivitiesParams,
  WorkspaceAutomationActivityField,
  WorkspaceAutomationActivityOrderBy,
} from "./WorkspaceAutomationActivities";
