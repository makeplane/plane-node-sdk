import { ProjectAutomations } from "./Automations/ProjectAutomations";
import { Cycles } from "./Cycles";
import { ProjectFeatures } from "./Features";
import { Estimates } from "./Estimates";
import { Intakes } from "./Intakes";
import { ProjectMembers } from "./Members";
import { Milestones } from "./Milestones";
import { Modules } from "./Modules";
import { ProjectPages } from "./Pages";
import { ProjectPermissions } from "./Permissions";
import { ProjectWorklogs } from "./ProjectWorklogs";
import { ProjectViews } from "./Views";
import { ProjectWorkItemTemplates } from "./WorkItemTemplates/ProjectTemplates";
import { WorkItemProperties } from "./WorkItemProperties";
import { WorkItemTypes } from "./WorkItemTypes";
import { Workflows } from "./Workflows";
import { V2Transport } from "./kernel/transport";

/**
 * A project locator, bound once.
 *
 * **Being retired.** This is the pre-flat shape. `states`, `labels` and `workItems` have
 * already left, because `Projects` gave them a flat home and a navigable row
 * (`v2.projects.states.list(slug, project)`, or `project.states.list()`). The rest are
 * mostly migrated too and take their ids per call; they are still listed here only
 * because nothing else reaches them until the tree wiring in the last task of the
 * variant-F plan, which then deletes this class.
 */
export class Project {
  public readonly cycles: Cycles;
  public readonly modules: Modules;
  public readonly milestones: Milestones;
  public readonly members: ProjectMembers;
  public readonly pages: ProjectPages;
  public readonly views: ProjectViews;
  public readonly features: ProjectFeatures;
  public readonly permissions: ProjectPermissions;
  public readonly intakes: Intakes;
  public readonly estimates: Estimates;
  public readonly workItemTypes: WorkItemTypes;
  public readonly workItemProperties: WorkItemProperties;
  public readonly workItemTemplates: ProjectWorkItemTemplates;
  public readonly workflows: Workflows;
  public readonly automations: ProjectAutomations;
  public readonly worklogs: ProjectWorklogs;

  constructor(transport: V2Transport, slug: string, project: string) {
    const scope = { slug, project_id: project };
    this.cycles = new Cycles(transport, scope);
    this.modules = new Modules(transport, scope);
    this.milestones = new Milestones(transport, scope);
    this.members = new ProjectMembers(transport, scope);
    this.pages = new ProjectPages(transport, scope);
    this.views = new ProjectViews(transport, scope);
    this.features = new ProjectFeatures(transport, scope);
    this.permissions = new ProjectPermissions(transport, scope);
    this.intakes = new Intakes(transport, scope);
    this.estimates = new Estimates(transport, scope);
    this.workItemTypes = new WorkItemTypes(transport, scope);
    this.workItemProperties = new WorkItemProperties(transport, scope);
    this.workItemTemplates = new ProjectWorkItemTemplates(transport, scope);
    this.workflows = new Workflows(transport, scope);
    this.automations = new ProjectAutomations(transport, scope);
    this.worklogs = new ProjectWorklogs(transport, scope);
  }
}
