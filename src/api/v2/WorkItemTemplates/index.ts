import { V2Transport } from "../kernel/transport";
import { ProjectWorkItemTemplates } from "./ProjectTemplates";
import { WorkspaceWorkItemTemplates } from "./WorkspaceTemplates";

/** Work-item templates: composes the project-scoped resource (which also has `use`) with its workspace-scoped sibling. */
export class WorkItemTemplates {
  public project: ProjectWorkItemTemplates;
  public workspace: WorkspaceWorkItemTemplates;

  constructor(transport: V2Transport) {
    this.project = new ProjectWorkItemTemplates(transport);
    this.workspace = new WorkspaceWorkItemTemplates(transport);
  }
}

export { ProjectWorkItemTemplates } from "./ProjectTemplates";
export type {
  ListProjectWorkItemTemplatesParams,
  WorkItemTemplateField,
  WorkItemTemplateOrderBy,
  WorkItemTemplateUseExpand,
  WorkItemTemplateUseField,
} from "./ProjectTemplates";
export { WorkspaceWorkItemTemplates } from "./WorkspaceTemplates";
export type {
  ListWorkspaceWorkItemTemplatesParams,
  WorkspaceWorkItemTemplateField,
  WorkspaceWorkItemTemplateOrderBy,
} from "./WorkspaceTemplates";
