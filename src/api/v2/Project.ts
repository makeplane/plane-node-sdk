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
 * @deprecated Use the flat form (`v2.projects.cycles.list(slug, project)`) or a fetched
 * project row (`project.cycles.list()`). Every family here is flat and also hangs off
 * `Projects`, which `tests/unit/v2/bands.test.ts` requires, so this binds nothing.
 *
 * Kept for the same reason as {@link Workspace}, and with the same caveat: the e2e suite
 * is no longer a consumer — it was migrated to the flat surface and fetched rows — so what
 * remains is the unit-level locator test and `tree-walk.ts`'s triangulation.
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
