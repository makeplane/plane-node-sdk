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
 * **Retired in all but name.** Every family listed here is flat and also hangs off
 * `Projects`, so each is reachable as `v2.projects.cycles.list(slug, project)` and from a
 * fetched project as `project.cycles.list()` — `tests/unit/v2/bands.test.ts` requires
 * both. `states`, `labels` and `workItems` left this list first; the rest followed in task
 * 3. What is left is a holder nothing reads, kept so the last task of the plan can delete
 * it and the `scope` constructor parameter together.
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
    this.cycles = new Cycles(transport);
    this.modules = new Modules(transport);
    this.milestones = new Milestones(transport);
    this.members = new ProjectMembers(transport, scope);
    this.pages = new ProjectPages(transport, scope);
    this.views = new ProjectViews(transport, scope);
    this.features = new ProjectFeatures(transport, scope);
    this.permissions = new ProjectPermissions(transport, scope);
    this.intakes = new Intakes(transport, scope);
    this.estimates = new Estimates(transport);
    this.workItemTypes = new WorkItemTypes(transport);
    this.workItemProperties = new WorkItemProperties(transport);
    this.workItemTemplates = new ProjectWorkItemTemplates(transport, scope);
    this.workflows = new Workflows(transport);
    this.automations = new ProjectAutomations(transport);
    this.worklogs = new ProjectWorklogs(transport, scope);
  }
}
