import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { WorkItems } from "./WorkItems";
import { Pages } from "./Pages";

/**
 * ProjectTemplates API resource
 * Container for work item and page template sub-resources
 */
export class ProjectTemplates extends BaseResource {
  public workItems: WorkItems;
  public pages: Pages;

  constructor(config: Configuration) {
    super(config);
    this.workItems = new WorkItems(config);
    this.pages = new Pages(config);
  }
}
