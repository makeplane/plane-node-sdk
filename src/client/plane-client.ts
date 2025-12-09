import { Configuration } from "../Configuration";
import { Projects } from "../api/Projects";
import { WorkItems } from "../api/WorkItems";
import { WorkItemTypes } from "../api/WorkItemTypes";
import { WorkItemProperties } from "../api/WorkItemProperties";
import { Links } from "../api/Links";
import { Customers } from "../api/Customers";
import { Pages } from "../api/Pages";
import { Labels } from "../api/Labels";
import { States } from "../api/States";
import { Members } from "../api/Members";
import { Modules } from "../api/Modules";
import { Cycles } from "../api/Cycles";
import { Users } from "../api/Users";
import { Workspace } from "../api/Workspace";
import { Epics } from "../api/Epics";
import { Intake } from "../api/Intake";
import { Stickies } from "../api/Stickies";
import { Teamspaces } from "../api/Teamspaces";
import { Initiatives } from "../api/Initiatives";
import { AgentRuns } from "../api/AgentRuns";

/**
 * Main Plane Client class
 * Provides access to all Plane API resources
 */
export class PlaneClient {
  public config: Configuration;
  public workItems: WorkItems;
  public workItemTypes: WorkItemTypes;
  public workItemProperties: WorkItemProperties;
  public links: Links;
  public customers: Customers;
  public pages: Pages;
  public projects: Projects;
  public labels: Labels;
  public states: States;
  public members: Members;
  public modules: Modules;
  public cycles: Cycles;
  public users: Users;
  public workspace: Workspace;
  public epics: Epics;
  public intake: Intake;
  public stickies: Stickies;
  public teamspaces: Teamspaces;
  public initiatives: Initiatives;
  public agentRuns: AgentRuns;

  constructor(config: { baseUrl?: string; apiKey?: string; accessToken?: string; enableLogging?: boolean }) {
    this.config = new Configuration({
      baseUrl: config.baseUrl,
      apiKey: config.apiKey,
      accessToken: config.accessToken,
      enableLogging: config.enableLogging,
    });

    // Validate configuration
    this.config.validate();

    // Initialize API resources
    this.workItems = new WorkItems(this.config);
    this.workItemTypes = new WorkItemTypes(this.config);
    this.workItemProperties = new WorkItemProperties(this.config);
    this.links = new Links(this.config);
    this.customers = new Customers(this.config);
    this.pages = new Pages(this.config);
    this.projects = new Projects(this.config);
    this.labels = new Labels(this.config);
    this.states = new States(this.config);
    this.members = new Members(this.config);
    this.modules = new Modules(this.config);
    this.cycles = new Cycles(this.config);
    this.users = new Users(this.config);
    this.workspace = new Workspace(this.config);
    this.epics = new Epics(this.config);
    this.intake = new Intake(this.config);
    this.stickies = new Stickies(this.config);
    this.teamspaces = new Teamspaces(this.config);
    this.initiatives = new Initiatives(this.config);
    this.agentRuns = new AgentRuns(this.config);
  }
}
