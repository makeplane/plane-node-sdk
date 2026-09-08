// Main client
export { PlaneClient } from "./client/plane-client";

// OAuth client
export { OAuthClient } from "./client/oauth-client";

// Configuration
export { Configuration } from "./Configuration";

// Base resource
export { BaseResource } from "./api/BaseResource";

// API Resources
export { Projects } from "./api/Projects";
export { WorkItems } from "./api/WorkItems";
export { WorkItemTypes } from "./api/WorkItemTypes";
export { WorkItemProperties } from "./api/WorkItemProperties";
export { Links } from "./api/Links";
export { Customers } from "./api/Customers";
export { Pages } from "./api/Pages";
export { Labels } from "./api/Labels";
export { States } from "./api/States";
export { Modules } from "./api/Modules";
export { Cycles } from "./api/Cycles";
export { Users } from "./api/Users";
export { Workspace } from "./api/Workspace";
export { Estimates } from "./api/Estimates";
export { Roles } from "./api/Roles";
export { Collections } from "./api/Collections";
export { Epics } from "./api/Epics";
export { Intake } from "./api/Intake";
export { Stickies } from "./api/Stickies";
export { Teamspaces } from "./api/Teamspaces";
export { Milestones } from "./api/Milestones";
export { Initiatives } from "./api/Initiatives";
export { AgentRuns } from "./api/AgentRuns";
export { WorkspaceTemplates } from "./api/WorkspaceTemplates";
export { WorkspaceWorkItemTypes } from "./api/WorkspaceWorkItemTypes";
export { WorkspaceWorkItemProperties } from "./api/WorkspaceWorkItemProperties";
export { WorkspaceProjectLabels } from "./api/WorkspaceProjectLabels";
export { WorkspaceProjectStates } from "./api/WorkspaceProjectStates";
export { WorkItemRelationDefinitions } from "./api/WorkItemRelationDefinitions";
export { Releases } from "./api/Releases";
export { Workflows } from "./api/Workflows";
export { ProjectTemplates } from "./api/ProjectTemplates";
export { WorkspaceStates } from "./api/WorkspaceStates";
export { WorkspaceWorkflows } from "./api/WorkspaceWorkflows";
export { WorkItemTypeGovernance } from "./api/WorkItemTypeGovernance";

// Sub-resources
export { Relations as WorkItemRelations } from "./api/WorkItems/Relations";
export { Attachments as WorkItemAttachments } from "./api/WorkItems/Attachments";
export { Comments as WorkItemComments } from "./api/WorkItems/Comments";
export { Activities as WorkItemActivities } from "./api/WorkItems/Activities";
export { WorkLogs } from "./api/WorkItems/WorkLogs";
export { Options as WorkItemPropertyOptions } from "./api/WorkItemProperties/Options";
export { Dependencies as WorkItemDependencies } from "./api/WorkItems/Dependencies";
export { CustomRelations as WorkItemCustomRelations } from "./api/WorkItems/CustomRelations";
export { Pages as WorkItemPages } from "./api/WorkItems/Pages";
export { Members as CollectionMembersResource } from "./api/Collections/Members";
export { Pages as CollectionPagesResource } from "./api/Collections/Pages";
export { Values as WorkItemPropertyValues } from "./api/WorkItemProperties/Values";
export { Properties as CustomerProperties } from "./api/Customers/Properties";
export { Requests as CustomerRequests } from "./api/Customers/Requests";
export { Projects as TeamspaceProjects } from "./api/Teamspaces/Projects";
export { Members as TeamspaceMembers } from "./api/Teamspaces/Members";
export { Labels as InitiativeLabels } from "./api/Initiatives/Labels";
export { Projects as InitiativeProjects } from "./api/Initiatives/Projects";
export { Epics as InitiativeEpics } from "./api/Initiatives/Epics";
export { Activities as AgentRunActivities } from "./api/AgentRuns/Activities";
export { WorkItems as WorkspaceWorkItemTemplates } from "./api/WorkspaceTemplates/WorkItems";
export { Projects as WorkspaceProjectTemplates } from "./api/WorkspaceTemplates/Projects";
export { Pages as WorkspacePageTemplates } from "./api/WorkspaceTemplates/Pages";
export { Properties as WorkspaceWorkItemTypeProperties } from "./api/WorkspaceWorkItemTypes/Properties";
export { Options as WorkspaceWorkItemPropertyOptions } from "./api/WorkspaceWorkItemProperties/Options";
export { Tags as ReleaseTags } from "./api/Releases/Tags";
export { Labels as ReleaseLabels } from "./api/Releases/Labels";
export { ItemLabels as ReleaseItemLabels } from "./api/Releases/ItemLabels";
export { Changelog as ReleaseChangelogResource } from "./api/Releases/Changelog";
export { Comments as ReleaseComments } from "./api/Releases/Comments";
export { Links as ReleaseLinks } from "./api/Releases/Links";
export { WorkItems as ReleaseWorkItems } from "./api/Releases/WorkItems";
export { States as WorkflowStates } from "./api/Workflows/States";
export { Transitions as WorkflowTransitions } from "./api/Workflows/Transitions";
export { Hooks as WorkflowTransitionHooks } from "./api/Workflows/Hooks";
export { WorkItems as ProjectWorkItemTemplates } from "./api/ProjectTemplates/WorkItems";
export { Pages as ProjectPageTemplates } from "./api/ProjectTemplates/Pages";
export { States as WorkspaceWorkflowStates } from "./api/WorkspaceWorkflows/States";
export { Transitions as WorkspaceWorkflowTransitions } from "./api/WorkspaceWorkflows/Transitions";
export { Hooks as WorkspaceWorkflowTransitionHooks } from "./api/WorkspaceWorkflows/Hooks";
export { Pins as WorkItemTypeWorkflowPins } from "./api/WorkItemTypeGovernance/Pins";
export { ProjectWorkflows as ProjectTypeWorkflows } from "./api/WorkItemTypeGovernance/ProjectWorkflows";

// API v2
export * as v2 from "./api/v2";
// v1 request types declared in api/* files: exported explicitly so their bare root names
// stay pinned to v1 now that v2 declares Create*/Update* types of the same names.
export type { CreateLabel, UpdateLabel } from "./api/Labels";
export type {
  CreateReleaseComment,
  UpdateReleaseComment,
  CreateReleaseLabel,
  UpdateReleaseLabel,
} from "./models/Release";
export type { UpdateWorkItemRelationDefinition } from "./models/WorkItemRelationDefinition";
export type { UpdateWorkflowState } from "./models/Workflow";
export * as v2models from "./models/v2";
// Two independent, sufficient triggers for the collision below: `PlaneClient.v2:
// V2Namespace` (client/plane-client.ts) AND the two `export * as` lines just above.
// Verified both directions: deleting every v2 export from this file but leaving
// `PlaneClient.v2` reachable through the `PlaneClient` export still fires the same
// six-item dts-bundle-generator warning; separately, removing `PlaneClient.v2` but
// leaving only `export * as v2`/`export * as v2models` also fires it (same six
// classes, different file paths in the message, since it's now v2's side of each
// pair being named). dts-bundle-generator's `--export-referenced-types` (on by
// default) forces a name for every type reachable from *any* exported declaration's
// public signature, and both `V2Namespace` and the barrel exports separately reach
// `States`/`Labels`, whose method signatures pull in
// `State`/`Label`/`Page`/`ListStatesParams`/`ListLabelsParams`. Removing either one
// on its own would not remove the collision — only removing both would (at the cost
// of making v2 unusable from the package root, which defeats this task).
//
// No v1 name is actually dropped by dts-bundle-generator: `Label$1 as Label` (etc.)
// is still emitted in the trailing consolidated `export {}` block. The real failure
// is a *duplicate* export of one external name from two different declarations — an
// inline `export interface Label` for v2 alongside `Label$1 as Label` for v1, both
// targeting "Label". With `skipLibCheck: false` that's `error TS2484: Export
// declaration conflicts with exported declaration of 'Label'`; with the default
// `skipLibCheck: true` (this repo's setting) tsc doesn't check the emitted .d.ts, so
// no error surfaces at build time — instead a consumer's `import { Label }` silently
// resolves to whichever side dts-bundle-generator happened to give the bare
// identifier to, which was v2's shape before this fix.
//
// Explicitly aliasing each v2 type here — the same technique already used below for
// the four differently-sourced `Labels` classes — resolves the duplicate: v1 keeps
// the bare names (verified with excess-property probes: root `Label`/`State`/
// `ListStatesParams`/`ListLabelsParams` reject v2-only fields) and these aliases,
// plus `v2models.*`, correctly resolve to v2's shapes (also probe-verified).
// `ListLabelsParams` needed one more line: unlike the other four, v1's copy (declared
// in api/Labels.ts, not re-exported by name anywhere) was only ever nameable because
// it had the bare identifier to itself; once v2 added a competitor it lost even
// though it was never touched, so it gets the same explicit protection here.
//
// `pnpm build` runs `scripts/check-types-bundle.mjs`, which snapshots the bundle's
// full public export surface (scripts/__fixtures__/types-bundle-exports.snapshot.txt:
// for every exported name, root-scope and inside each `declare namespace`, which
// local declaration backs it) and fails the build on any diff. This — not an error
// count — is the guard: a referenced-only collision (the class most new v2 types
// will hit; see the script's own header comment) produces no dts-bundle-generator
// warning and no tsc diagnostic, so counting either misses it. The dts-bundle-
// generator console warning above still prints regardless of whether the collision
// is actually resolved (it's emitted during an early detection pass, before it can
// know a caller supplied a working alias downstream) — that text is expected and is
// not what the guard checks.
export type { Label as V2Label } from "./models/v2/Label";
export type { State as V2State } from "./models/v2/State";
// v2 request models whose Create*/Update* names collide with v1's (same mechanism as above).
export type { CreateCollection as V2CreateCollection } from "./models/v2/Collection";
export type { CreateCustomer as V2CreateCustomer } from "./models/v2/Customer";
export type { CreateCustomerRequest as V2CreateCustomerRequest } from "./models/v2/CustomerRequest";
export type { CreateInitiative as V2CreateInitiative } from "./models/v2/Initiative";
export type { CreateInitiativeLabel as V2CreateInitiativeLabel } from "./models/v2/InitiativeLabel";
export type { CreateLabel as V2CreateLabel } from "./models/v2/Label";
export type { CreatePage as V2CreatePage } from "./models/v2/Page";
export type { CreateProject as V2CreateProject } from "./models/v2/Project";
export type { CreateRelease as V2CreateRelease } from "./models/v2/Release";
export type { CreateReleaseComment as V2CreateReleaseComment } from "./models/v2/ReleaseComment";
export type { CreateReleaseLabel as V2CreateReleaseLabel } from "./models/v2/ReleaseLabel";
export type { CreateReleaseLink as V2CreateReleaseLink } from "./models/v2/ReleaseLink";
export type { CreateReleaseTag as V2CreateReleaseTag } from "./models/v2/ReleaseTag";
export type { CreateState as V2CreateState } from "./models/v2/State";
export type { CreateSticky as V2CreateSticky } from "./models/v2/Sticky";
export type { CreateTeamspace as V2CreateTeamspace } from "./models/v2/Teamspace";
export type { CreateWorkItem as V2CreateWorkItem } from "./models/v2/WorkItem";
export type { CreateWorkItemProperty as V2CreateWorkItemProperty } from "./models/v2/WorkItemProperty";
export type { CreateWorkItemPropertyOption as V2CreateWorkItemPropertyOption } from "./models/v2/WorkItemPropertyOption";
export type { CreateWorkItemRelationDefinition as V2CreateWorkItemRelationDefinition } from "./models/v2/WorkItemRelationDefinition";
export type { CreateWorkItemTemplate as V2CreateWorkItemTemplate } from "./models/v2/WorkItemTemplate";
export type { CreateWorkItemType as V2CreateWorkItemType } from "./models/v2/WorkItemType";
export type { CreateWorkflow as V2CreateWorkflow } from "./models/v2/Workflow";
export type { CreateWorkflowTransition as V2CreateWorkflowTransition } from "./models/v2/WorkflowTransition";
export type { UpdateCollection as V2UpdateCollection } from "./models/v2/Collection";
export type { UpdateCustomer as V2UpdateCustomer } from "./models/v2/Customer";
export type { UpdateCustomerRequest as V2UpdateCustomerRequest } from "./models/v2/CustomerRequest";
export type { UpdateInitiative as V2UpdateInitiative } from "./models/v2/Initiative";
export type { UpdateInitiativeLabel as V2UpdateInitiativeLabel } from "./models/v2/InitiativeLabel";
export type { UpdateLabel as V2UpdateLabel } from "./models/v2/Label";
export type { UpdatePage as V2UpdatePage } from "./models/v2/Page";
export type { UpdateProject as V2UpdateProject } from "./models/v2/Project";
export type { UpdateRelease as V2UpdateRelease } from "./models/v2/Release";
export type { UpdateReleaseChangelog as V2UpdateReleaseChangelog } from "./models/v2/ReleaseChangelog";
export type { UpdateReleaseComment as V2UpdateReleaseComment } from "./models/v2/ReleaseComment";
export type { UpdateReleaseLabel as V2UpdateReleaseLabel } from "./models/v2/ReleaseLabel";
export type { UpdateReleaseLink as V2UpdateReleaseLink } from "./models/v2/ReleaseLink";
export type { UpdateReleaseTag as V2UpdateReleaseTag } from "./models/v2/ReleaseTag";
export type { UpdateState as V2UpdateState } from "./models/v2/State";
export type { UpdateSticky as V2UpdateSticky } from "./models/v2/Sticky";
export type { UpdateTeamspace as V2UpdateTeamspace } from "./models/v2/Teamspace";
export type { UpdateWorkItem as V2UpdateWorkItem } from "./models/v2/WorkItem";
export type { UpdateWorkItemProperty as V2UpdateWorkItemProperty } from "./models/v2/WorkItemProperty";
export type { UpdateWorkItemPropertyOption as V2UpdateWorkItemPropertyOption } from "./models/v2/WorkItemPropertyOption";
export type { UpdateWorkItemRelationDefinition as V2UpdateWorkItemRelationDefinition } from "./models/v2/WorkItemRelationDefinition";
export type { UpdateWorkItemTemplate as V2UpdateWorkItemTemplate } from "./models/v2/WorkItemTemplate";
export type { UpdateWorkItemType as V2UpdateWorkItemType } from "./models/v2/WorkItemType";
export type { UpdateWorkflow as V2UpdateWorkflow } from "./models/v2/Workflow";
export type { UpdateWorkflowState as V2UpdateWorkflowState } from "./models/v2/WorkflowState";
export type { UpdateWorkflowTransition as V2UpdateWorkflowTransition } from "./models/v2/WorkflowTransition";
// `V2Page` names the wiki page model (`models/v2/Page.ts`), matching the golden
// schema name and the Python SDK — see that file's own doc comment on why every
// *consuming* file still imports it under a local `WikiPage` alias. The generic
// pagination envelope `Page<T>` (`models/v2/common.ts`) needed the root alias first
// and kept the `V2Page` name until this rename; it is `V2PageEnvelope` now so the
// wiki page model can have `V2Page`.
export type { Page as V2Page } from "./models/v2/Page";
export type { Page as V2PageEnvelope } from "./models/v2/common";
export type { ListLabelsParams as V2ListLabelsParams } from "./api/v2/Labels";
export type { ListStatesParams as V2ListStatesParams } from "./api/v2/States";
export type { ListLabelsParams } from "./api/Labels";
// Same bare-name collision as Label/State above, triggered the same two ways (the
// `PlaneClient.v2.cycles`/`.modules`/`.milestones` member signatures, and the `export
// * as v2`/`v2models` barrels): v1 already exports `Cycle`/`Module`/`Milestone`
// interfaces by those exact names (`src/models/Cycle.ts`, `Module.ts`,
// `Milestone.ts`), so v2's copies need their own explicit alias too.
export type { Cycle as V2Cycle } from "./models/v2/Cycle";
export type { Module as V2Module } from "./models/v2/Module";
export type { Milestone as V2Milestone } from "./models/v2/Milestone";

// Same bare-name collision as above, now for every other v2 model wired onto
// `V2Namespace` — reachable the same two independent ways
// (a wired resource's method signature, and `export * as v2models`). Every name
// below is also exported bare from v1 (`src/models/*.ts`, spread through
// `export * from "./models"` below), so each v2 counterpart needs its own explicit
// alias here, same as `Label`/`State`/`Cycle`/`Module`/`Milestone` above.
export type { Collection as V2Collection } from "./models/v2/Collection";
export type { CollectionMember as V2CollectionMember } from "./models/v2/Collection";
export type { CollectionMemberAccess as V2CollectionMemberAccess } from "./models/v2/Collection";
export type { Customer as V2Customer } from "./models/v2/Customer";
export type { CustomerProperty as V2CustomerProperty } from "./models/v2/CustomerProperty";
export type { CustomerRequest as V2CustomerRequest } from "./models/v2/CustomerRequest";
export type { Estimate as V2Estimate } from "./models/v2/Estimate";
export type { EstimatePoint as V2EstimatePoint } from "./models/v2/EstimatePoint";
export type { EstimateType as V2EstimateType } from "./models/v2/Estimate";
export type { Initiative as V2Initiative } from "./models/v2/Initiative";
export type { InitiativeLabel as V2InitiativeLabel } from "./models/v2/InitiativeLabel";
export type { InitiativeState as V2InitiativeState } from "./models/v2/Initiative";
export type { IntakeWorkItem as V2IntakeWorkItem } from "./models/v2/IntakeWorkItem";
export type { Project as V2Project } from "./models/v2/Project";
export type { ProjectMember as V2ProjectMember } from "./models/v2/Member";
export type { ProjectRoleDistribution as V2ProjectRoleDistribution } from "./models/v2/ProjectRoleDistribution";
export type { ProjectRoleDistributionEntry as V2ProjectRoleDistributionEntry } from "./models/v2/ProjectRoleDistribution";
export type { Release as V2Release } from "./models/v2/Release";
export type { ReleaseChangelog as V2ReleaseChangelog } from "./models/v2/ReleaseChangelog";
export type { ReleaseComment as V2ReleaseComment } from "./models/v2/ReleaseComment";
export type { ReleaseLabel as V2ReleaseLabel } from "./models/v2/ReleaseLabel";
export type { ReleaseLink as V2ReleaseLink } from "./models/v2/ReleaseLink";
export type { ReleaseStatus as V2ReleaseStatus } from "./models/v2/Release";
export type { ReleaseTag as V2ReleaseTag } from "./models/v2/ReleaseTag";
export type { Role as V2Role } from "./models/v2/Role";
export type { RoleNamespace as V2RoleNamespace } from "./models/v2/Role";
export type { Sticky as V2Sticky } from "./models/v2/Sticky";
export type { Teamspace as V2Teamspace } from "./models/v2/Teamspace";
export type { UserAssetEntityType as V2UserAssetEntityType } from "./models/v2/UserAsset";
export type { UserAssetUploadRequest as V2UserAssetUploadRequest } from "./models/v2/UserAsset";
export type { WorkItem as V2WorkItem } from "./models/v2/WorkItem";
export type { WorkItemActivity as V2WorkItemActivity } from "./models/v2/WorkItemActivity";
export type { WorkItemAttachment as V2WorkItemAttachment } from "./models/v2/WorkItemAttachment";
export type { WorkItemAttachmentUploadRequest as V2WorkItemAttachmentUploadRequest } from "./models/v2/WorkItemAttachment";
export type { WorkItemComment as V2WorkItemComment } from "./models/v2/WorkItemComment";
export type { WorkItemProperty as V2WorkItemProperty } from "./models/v2/WorkItemProperty";
export type { WorkItemRelationCreateRequest as V2WorkItemRelationCreateRequest } from "./models/v2/WorkItemRelation";
export type { WorkItemRelationDefinition as V2WorkItemRelationDefinition } from "./models/v2/WorkItemRelationDefinition";
export type { WorkItemTemplate as V2WorkItemTemplate } from "./models/v2/WorkItemTemplate";
export type { WorkItemType as V2WorkItemType } from "./models/v2/WorkItemType";
export type { Workflow as V2Workflow } from "./models/v2/Workflow";
export type { WorkflowState as V2WorkflowState } from "./models/v2/WorkflowState";
export type { WorkflowTransition as V2WorkflowTransition } from "./models/v2/WorkflowTransition";
export type { Workspace as V2Workspace } from "./models/v2/Workspace";
export type { WorkspaceMember as V2WorkspaceMember } from "./models/v2/Member";

// Same `ListLabelsParams` situation (a referenced-only v1 type that only ever had
// the bare identifier to itself, losing it once a same-named v2 type became
// reachable): v1's `WorkItemTypes.list` params type shares a name with v2's.
export type { ListWorkItemTypesParams as V2ListWorkItemTypesParams } from "./api/v2/WorkItemTypes";
export type { ListWorkItemTypesParams } from "./api/WorkItemTypes";

// Models
export * from "./models";

// Errors
export * from "./errors";
