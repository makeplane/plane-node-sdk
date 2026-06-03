import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { WorkItems } from "./WorkItems";
import { Projects } from "./Projects";
import { Pages } from "./Pages";

/**
 * WorkspaceTemplates API resource
 * Container for workspace-level template sub-resources
 */
export class WorkspaceTemplates extends BaseResource {
  public workItems: WorkItems;
  public projects: Projects;
  public pages: Pages;

  constructor(config: Configuration) {
    super(config);
    this.workItems = new WorkItems(config);
    this.projects = new Projects(config);
    this.pages = new Pages(config);
  }
}
