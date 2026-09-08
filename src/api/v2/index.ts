import { Configuration } from "../../Configuration";
import { UserAssets } from "./UserAssets";
import { Users } from "./UsersMe";
import { Workspaces } from "./Workspaces";
import { V2Transport } from "./kernel/transport";

/**
 * Root of the v2 surface, reached as `client.v2`.
 *
 * Two ways in, both flat: a resource is a plain attribute **at the position its URL puts
 * it** — `v2.workspaces.projects.states.list(slug, project)` — and a row it hands back
 * carries those ids, so `(await v2.workspaces.projects.retrieve(slug, "ENG")).states.list()`
 * needs nothing repeated.
 *
 * There is exactly one attribute path to any resource. `projects` used to hang off this
 * root *as well as* off `workspaces`, which put the whole 38-node project subtree on two
 * paths at once: it contradicted the flat rule (a project's URL is
 * `/workspaces/{slug}/projects/`, so `workspaces` is where it belongs), it disagreed with
 * the Python SDK, and documentation generated from the two would have disagreed too.
 */
export class V2Namespace {
  public transport: V2Transport;
  public users: Users;
  public userAssets: UserAssets;
  /**
   * The workspace root: `v2.workspaces.retrieve(slug)` answers a row that reaches every
   * workspace-scoped family — projects included — without the slug being repeated.
   */
  public workspaces: Workspaces;

  constructor(config: Configuration) {
    this.transport = new V2Transport(config);
    this.users = new Users(this.transport);
    this.userAssets = new UserAssets(this.transport);
    this.workspaces = new Workspaces(this.transport);
  }
}

export { Cycles, CycleWorkItems } from "./Cycles";
export { Labels } from "./Labels";
export { Milestones, MilestoneWorkItems } from "./Milestones";
export { Modules, ModuleWorkItems } from "./Modules";
export { States } from "./States";
export { Workspaces } from "./Workspaces";
export type { WorkspaceField, WorkspaceFieldsParams } from "./Workspaces";
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
export { LoadsNavigableRows, OWNED, loadPage, loadRow, owned, ownedBinding } from "./kernel/loaded";
export type { Loaded, LoadedMeta, NavigationFactories, Owned, OwnedBinding } from "./kernel/loaded";
export { PROJECT_ID_NAMES } from "./loaded/Project";
export type { LoadedProject, LoadedProjectRow, ProjectIds, ProjectNavigation } from "./loaded/Project";
export { WORK_ITEM_ID_NAMES } from "./loaded/WorkItem";
export type { LoadedWorkItem, LoadedWorkItemRow, WorkItemIds, WorkItemNavigation } from "./loaded/WorkItem";
export { WORKSPACE_ID_NAMES } from "./loaded/Workspace";
export type { LoadedWorkspace, LoadedWorkspaceRow, WorkspaceIds, WorkspaceNavigation } from "./loaded/Workspace";
// The rows task 3's families answer with — one module per family, both scopes together
// where a family has two (work item types/properties, automations).
export { AUTOMATION_ID_NAMES, WORKSPACE_AUTOMATION_ID_NAMES } from "./loaded/Automation";
export type {
  AutomationIds,
  AutomationNavigation,
  LoadedAutomation,
  LoadedAutomationRow,
  LoadedWorkspaceAutomation,
  LoadedWorkspaceAutomationRow,
  WorkspaceAutomationIds,
  WorkspaceAutomationNavigation,
} from "./loaded/Automation";
export { COLLECTION_ID_NAMES } from "./loaded/Collection";
export type { CollectionIds, CollectionNavigation, LoadedCollection, LoadedCollectionRow } from "./loaded/Collection";
export { CUSTOMER_ID_NAMES } from "./loaded/Customer";
export type { CustomerIds, CustomerNavigation, LoadedCustomer, LoadedCustomerRow } from "./loaded/Customer";
export { CYCLE_ID_NAMES } from "./loaded/Cycle";
export type { CycleIds, CycleNavigation, LoadedCycle, LoadedCycleRow } from "./loaded/Cycle";
export { ESTIMATE_ID_NAMES } from "./loaded/Estimate";
export type { EstimateIds, EstimateNavigation, LoadedEstimate, LoadedEstimateRow } from "./loaded/Estimate";
export { INITIATIVE_ID_NAMES } from "./loaded/Initiative";
export type { InitiativeIds, InitiativeNavigation, LoadedInitiative, LoadedInitiativeRow } from "./loaded/Initiative";
export { MILESTONE_ID_NAMES } from "./loaded/Milestone";
export type { LoadedMilestone, LoadedMilestoneRow, MilestoneIds, MilestoneNavigation } from "./loaded/Milestone";
export { MODULE_ID_NAMES } from "./loaded/Module";
export type { LoadedModule, LoadedModuleRow, ModuleIds, ModuleNavigation } from "./loaded/Module";
export { RELEASE_ID_NAMES } from "./loaded/Release";
export type { LoadedRelease, LoadedReleaseRow, ReleaseIds, ReleaseNavigation } from "./loaded/Release";
export { WEBHOOK_ID_NAMES } from "./loaded/Webhook";
export type { LoadedWebhook, LoadedWebhookRow, WebhookIds, WebhookNavigation } from "./loaded/Webhook";
export { WORKFLOW_ID_NAMES } from "./loaded/Workflow";
export type { LoadedWorkflow, LoadedWorkflowRow, WorkflowIds, WorkflowNavigation } from "./loaded/Workflow";
export { WORK_ITEM_PROPERTY_ID_NAMES, WORKSPACE_WORK_ITEM_PROPERTY_ID_NAMES } from "./loaded/WorkItemProperty";
export type {
  LoadedWorkItemProperty,
  LoadedWorkItemPropertyRow,
  LoadedWorkspaceWorkItemProperty,
  LoadedWorkspaceWorkItemPropertyRow,
  WorkItemPropertyIds,
  WorkItemPropertyNavigation,
  WorkspaceWorkItemPropertyIds,
  WorkspaceWorkItemPropertyNavigation,
} from "./loaded/WorkItemProperty";
export { WORK_ITEM_TYPE_ID_NAMES, WORKSPACE_WORK_ITEM_TYPE_ID_NAMES } from "./loaded/WorkItemType";
export type {
  LoadedWorkItemType,
  LoadedWorkItemTypeRow,
  LoadedWorkspaceWorkItemType,
  LoadedWorkspaceWorkItemTypeRow,
  WorkItemTypeIds,
  WorkItemTypeNavigation,
  WorkspaceWorkItemTypeIds,
  WorkspaceWorkItemTypeNavigation,
} from "./loaded/WorkItemType";
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

// Every other v2 resource, reachable through the `workspaces` root and wired onto the
// `Workspaces`/`Projects`/`Wiki` nodes above.
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
