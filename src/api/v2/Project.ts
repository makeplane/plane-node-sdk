import { ProjectAutomations } from "./Automations/ProjectAutomations";
import { Cycles } from "./Cycles";
import { ProjectFeatures } from "./Features";
import { Estimates } from "./Estimates";
import { Intakes } from "./Intakes";
import { Labels } from "./Labels";
import { ProjectMembers } from "./Members";
import { Milestones } from "./Milestones";
import { Modules } from "./Modules";
import { ProjectPages } from "./Pages";
import { ProjectPermissions } from "./Permissions";
import { ProjectWorklogs } from "./ProjectWorklogs";
import { States } from "./States";
import { ProjectViews } from "./Views";
import { ProjectWorkItemTemplates } from "./WorkItemTemplates/ProjectTemplates";
import { WorkItemProperties } from "./WorkItemProperties";
import { WorkItemTypes } from "./WorkItemTypes";
import { WorkItems } from "./WorkItems";
import { Workflows } from "./Workflows";
import { V2Transport } from "./kernel/transport";

/** A project locator, bound once; each property is a resource already scoped to `{ slug, project_id }`. */
export class Project {
  public readonly workItems: WorkItems;
  public readonly cycles: Cycles;
  public readonly modules: Modules;
  public readonly milestones: Milestones;
  public readonly states: States;
  public readonly labels: Labels;
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
    this.workItems = new WorkItems(transport, scope);
    this.cycles = new Cycles(transport, scope);
    this.modules = new Modules(transport, scope);
    this.milestones = new Milestones(transport, scope);
    this.states = new States(transport, scope);
    this.labels = new Labels(transport, scope);
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
