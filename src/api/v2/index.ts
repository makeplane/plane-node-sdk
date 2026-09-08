import { Configuration } from "../../Configuration";
import { Projects } from "./Projects";
import { UserAssets } from "./UserAssets";
import { Users } from "./UsersMe";
import { Workspace } from "./Workspace";
import { V2Transport } from "./kernel/transport";

/**
 * Root of the v2 surface, reached as `client.v2`.
 *
 * Two ways in, both flat: a resource is a plain attribute and takes the ids its URL
 * names — `v2.projects.states.list(slug, project)` — and a row it hands back carries
 * those ids, so `(await v2.projects.retrieve(slug, "ENG")).states.list()` needs nothing
 * repeated.
 *
 * `workspace(slug)` is the pre-flat locator chain, shrinking as each family migrates;
 * the last task of the variant-F plan removes it.
 */
export class V2Namespace {
  public transport: V2Transport;
  public users: Users;
  public userAssets: UserAssets;
  public projects: Projects;

  constructor(config: Configuration) {
    this.transport = new V2Transport(config);
    this.users = new Users(this.transport);
    this.userAssets = new UserAssets(this.transport);
    this.projects = new Projects(this.transport);
  }

  /** Bind a workspace. Makes no request. */
  workspace(workspaceSlug: string): Workspace {
    return new Workspace(this.transport, workspaceSlug);
  }
}

export { Cycles, CycleWorkItems } from "./Cycles";
export { Labels } from "./Labels";
export { Milestones, MilestoneWorkItems } from "./Milestones";
export { Modules, ModuleWorkItems } from "./Modules";
export { States } from "./States";
export { Workspace } from "./Workspace";
export { Project } from "./Project";
export { Wiki } from "./Wiki";
export { Activities, Attachments, Comments, Dependencies, Links, Relations, WorkItems, WorkLogs } from "./WorkItems";
export type {
  ListWorkItemActivitiesParams,
  ListWorkItemAttachmentsParams,
  ListWorkItemCommentsParams,
  ListWorkItemLinksParams,
  ListWorkItemsParams,
  ListWorkItemWorklogsParams,
  WorkItemActivityExpand,
  WorkItemActivityField,
  WorkItemActivityOrderBy,
  WorkItemAttachmentField,
  WorkItemAttachmentOrderBy,
  WorkItemCommentExpand,
  WorkItemCommentField,
  WorkItemCommentOrderBy,
  WorkItemLinkField,
  WorkItemLinkOrderBy,
  WorkItemWorklogExpand,
  WorkItemWorklogField,
  WorkItemWorklogOrderBy,
} from "./WorkItems";
export type { CycleExpand, ListCyclesParams } from "./Cycles";
export type { ListMilestonesParams } from "./Milestones";
export type { ListModulesParams, ModuleExpand } from "./Modules";
export { V2Transport } from "./kernel/transport";
export { bulkFailures, isBulkFailure, raiseForFailures } from "./kernel/bulk";
// Navigable rows: the types a fetched row resolves to, and the machinery behind them.
export { LoadsNavigableRows, loadPage, loadRow, owned } from "./kernel/loaded";
export type { Loaded, LoadedMeta, NavigationFactories, Owned } from "./kernel/loaded";
export { PROJECT_ID_NAMES } from "./loaded/Project";
export type { LoadedProject, LoadedProjectRow, ProjectIds, ProjectNavigation } from "./loaded/Project";
export { WORK_ITEM_ID_NAMES } from "./loaded/WorkItem";
export type { LoadedWorkItem, LoadedWorkItemRow, WorkItemIds, WorkItemNavigation } from "./loaded/WorkItem";
// Narrow a `Page<T>` to its offset or cursor envelope — see README "API v2".
export { isCursorPage, isOffsetPage } from "./kernel/pagination";
// Field-name/order_by unions for dynamically-built `fields`/`order_by` values, and the
// generated data backing them — see README "API v2".
export type {
  CycleField,
  CycleOrderBy,
  LabelField,
  LabelOrderBy,
  MilestoneField,
  MilestoneOrderBy,
  ModuleField,
  ModuleOrderBy,
  StateField,
  StateOrderBy,
  WorkItemExpand,
  WorkItemField,
  WorkItemOrderBy,
} from "./generated/constants";
export { BULK_MAX_ITEMS, EXPAND, FIELDS, OPENAPI_VERSION, ORDER_BY } from "./generated/constants";

// Every other v2 resource, reachable directly and wired onto `Workspace`/`Project`/`Wiki` above.
export * from "./Artifacts";
export * from "./Assets";
export * from "./AuditLogs";
export * from "./Automations";
export * from "./Collections";
export * from "./CustomerProperties";
export * from "./Customers";
export * from "./Estimates";
export * from "./Features";
export * from "./GroupSync";
export * from "./Initiatives";
export * from "./Intakes";
export * from "./Invitations";
export * from "./Members";
export * from "./WorkspaceMembers";
export * from "./Pages";
export * from "./WikiPages";
export * from "./PermissionSchemes";
export * from "./Permissions";
export * from "./ProjectWorklogs";
export * from "./Projects";
export * from "./Roles";
export * from "./Stickies";
export * from "./Teamspaces";
export * from "./UserAssets";
export * from "./UsersMe";
export * from "./Views";
export * from "./WorkspaceViews";
export * from "./WebhookLogs";
export * from "./Webhooks";
export * from "./WorkItemProperties";
export * from "./WorkItemRelationDefinitions";
export * from "./WorkItemTemplates";
export * from "./WorkItemTypes";
export * from "./WorkspaceWorkItemTypes";
export * from "./Workflows";
export * from "./WorkspaceWorkItemProperties";
export * from "./WorkspaceWorkItems";

// Releases is exported explicitly (not `export *`): its `Comments`/`Links` share names with
// `WorkItems`' own, and `export *` would make TS silently drop the ambiguous names instead of erroring.
export {
  Changelog as ReleaseChangelogResource,
  Comments as ReleaseComments,
  Links as ReleaseLinks,
  Releases,
} from "./Releases";
export type { ListReleasesParams, ReleaseExpand, ReleaseField, ReleaseOrderBy, ReleaseStatusFilter } from "./Releases";
export { ReleaseLabels } from "./Releases/Labels";
export type { ListReleaseLabelsParams, ReleaseLabelField, ReleaseLabelOrderBy } from "./Releases/Labels";
export { ReleaseTags } from "./Releases/Tags";
export { ReleaseWorkItems } from "./Releases/WorkItems";
export type { ListReleaseTagsParams, ReleaseTagField, ReleaseTagOrderBy } from "./Releases/Tags";
export type { ListReleaseCommentsParams, ReleaseCommentField, ReleaseCommentOrderBy } from "./Releases/Comments";
export type { ListReleaseLinksParams, ReleaseLinkField, ReleaseLinkOrderBy } from "./Releases/Links";
