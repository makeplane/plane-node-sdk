import { Artifacts } from "./Artifacts";
import { Assets } from "./Assets";
import { AuditLogs } from "./AuditLogs";
import { WorkspaceAutomations } from "./Automations/WorkspaceAutomations";
import { CustomerProperties } from "./CustomerProperties";
import { Customers } from "./Customers";
import { WorkspaceFeatures } from "./Features";
import { GroupSync } from "./GroupSync";
import { Initiatives } from "./Initiatives";
import { Invitations } from "./Invitations";
import { WorkspacePermissions } from "./Permissions";
import { PermissionSchemes } from "./PermissionSchemes";
import { Project } from "./Project";
import { Releases } from "./Releases";
import { Roles } from "./Roles";
import { Stickies } from "./Stickies";
import { Teamspaces } from "./Teamspaces";
import { Webhooks } from "./Webhooks";
import { Wiki } from "./Wiki";
import { WorkItemRelationDefinitions } from "./WorkItemRelationDefinitions";
import { WorkspaceWorkItemTemplates } from "./WorkItemTemplates/WorkspaceTemplates";
import { V2Transport } from "./kernel/transport";
import { WorkspaceMembers } from "./WorkspaceMembers";
import { WorkspaceViews } from "./WorkspaceViews";
import { WorkspaceWorkItemProperties } from "./WorkspaceWorkItemProperties";
import { WorkspaceWorkItems } from "./WorkspaceWorkItems";
import { WorkspaceWorkItemTypes } from "./WorkspaceWorkItemTypes";

/**
 * A workspace, bound once; no I/O on construction. Every property is a resource already
 * scoped to `{ slug }`.
 *
 * **Being retired**, exactly as `Project` is: a resource leaves this class as its flat
 * migration lands. `projects` has already moved to `v2.projects`.
 */
export class Workspace {
  public readonly members: WorkspaceMembers;
  public readonly invitations: Invitations;
  public readonly roles: Roles;
  public readonly permissionSchemes: PermissionSchemes;
  public readonly permissions: WorkspacePermissions;
  public readonly features: WorkspaceFeatures;
  public readonly auditLogs: AuditLogs;
  public readonly views: WorkspaceViews;
  public readonly workItems: WorkspaceWorkItems;
  public readonly workItemTypes: WorkspaceWorkItemTypes;
  public readonly workItemProperties: WorkspaceWorkItemProperties;
  public readonly workItemRelationDefinitions: WorkItemRelationDefinitions;
  public readonly workItemTemplates: WorkspaceWorkItemTemplates;
  public readonly groupSync: GroupSync;
  public readonly automations: WorkspaceAutomations;
  public readonly assets: Assets;
  public readonly artifacts: Artifacts;
  public readonly webhooks: Webhooks;
  public readonly stickies: Stickies;
  public readonly teamspaces: Teamspaces;
  public readonly customers: Customers;
  public readonly customerProperties: CustomerProperties;
  public readonly initiatives: Initiatives;
  public readonly releases: Releases;
  public readonly wiki: Wiki;

  constructor(
    private transport: V2Transport,
    private slug: string
  ) {
    const scope = { slug };
    this.members = new WorkspaceMembers(transport, scope);
    this.invitations = new Invitations(transport, scope);
    this.roles = new Roles(transport, scope);
    this.permissionSchemes = new PermissionSchemes(transport, scope);
    this.permissions = new WorkspacePermissions(transport, scope);
    this.features = new WorkspaceFeatures(transport, scope);
    this.auditLogs = new AuditLogs(transport, scope);
    this.views = new WorkspaceViews(transport, scope);
    this.workItems = new WorkspaceWorkItems(transport, scope);
    this.workItemTypes = new WorkspaceWorkItemTypes(transport, scope);
    this.workItemProperties = new WorkspaceWorkItemProperties(transport, scope);
    this.workItemRelationDefinitions = new WorkItemRelationDefinitions(transport, scope);
    this.workItemTemplates = new WorkspaceWorkItemTemplates(transport, scope);
    this.groupSync = new GroupSync(transport, scope);
    this.automations = new WorkspaceAutomations(transport, scope);
    this.assets = new Assets(transport, scope);
    this.artifacts = new Artifacts(transport, scope);
    this.webhooks = new Webhooks(transport, scope);
    this.stickies = new Stickies(transport, scope);
    this.teamspaces = new Teamspaces(transport, scope);
    this.customers = new Customers(transport, scope);
    this.customerProperties = new CustomerProperties(transport, scope);
    this.initiatives = new Initiatives(transport, scope);
    this.releases = new Releases(transport, scope);
    this.wiki = new Wiki(transport, slug);
  }

  /** Bind a project. `project` accepts a project id or its key (e.g. `ENG`). Makes no request. */
  project(project: string): Project {
    return new Project(this.transport, this.slug, project);
  }
}
