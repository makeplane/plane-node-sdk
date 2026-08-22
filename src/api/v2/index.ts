import { Configuration } from "../../Configuration";
import { UserAssets } from "./UserAssets";
import { Users } from "./UsersMe";
import { Workspace } from "./Workspace";
import { V2Transport } from "./kernel/transport";

/** `users`/`userAssets` plus `workspace(slug)` — the entry point into every other v2 resource, all reached bound. */
export class V2Namespace {
  public transport: V2Transport;
  public users: Users;
  public userAssets: UserAssets;

  constructor(config: Configuration) {
    this.transport = new V2Transport(config);
    this.users = new Users(this.transport);
    this.userAssets = new UserAssets(this.transport);
  }

  /** Bind a workspace. Makes no request. */
  workspace(workspaceSlug: string): Workspace {
    return new Workspace(this.transport, workspaceSlug);
  }
}

export { Cycles } from "./Cycles";
export { Labels } from "./Labels";
export { Milestones } from "./Milestones";
export { Modules } from "./Modules";
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
export type { ListReleaseTagsParams, ReleaseTagField, ReleaseTagOrderBy } from "./Releases/Tags";
export type { ListReleaseCommentsParams, ReleaseCommentField, ReleaseCommentOrderBy } from "./Releases/Comments";
export type { ListReleaseLinksParams, ReleaseLinkField, ReleaseLinkOrderBy } from "./Releases/Links";
