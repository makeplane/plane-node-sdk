import type { Workspace } from "../../../models/v2/Workspace";
import type { Artifacts } from "../Artifacts";
import type { Assets } from "../Assets";
import type { AuditLogs } from "../AuditLogs";
import type { CustomerProperties } from "../CustomerProperties";
import type { WorkspaceFeatures } from "../Features";
import type { Invitations } from "../Invitations";
import type { WorkspacePermissions } from "../Permissions";
import type { PermissionSchemes } from "../PermissionSchemes";
import type { Projects } from "../Projects";
import type { Roles } from "../Roles";
import type { Stickies } from "../Stickies";
import type { Teamspaces } from "../Teamspaces";
import type { Loaded, Owned } from "../kernel/loaded";
import type { WorkspaceMembers } from "../WorkspaceMembers";
import type { WorkspaceViews } from "../WorkspaceViews";
import type { WorkspaceAutomations } from "../Automations/WorkspaceAutomations";
import type { Customers } from "../Customers";
import type { Initiatives } from "../Initiatives";
import type { Releases } from "../Releases";
import type { ReleaseTags } from "../Releases/Tags";
import type { Webhooks } from "../Webhooks";
import type { WorkspaceWorkItemProperties } from "../WorkspaceWorkItemProperties";
import type { WorkspaceWorkItems } from "../WorkspaceWorkItems";
import type { WorkspaceWorkItemTypes } from "../WorkspaceWorkItemTypes";
import type { WorkItemRelationDefinitions } from "../WorkItemRelationDefinitions";
import type { WorkspaceWorkItemTemplates } from "../WorkItemTemplates/WorkspaceTemplates";

/**
 * The path ids a child of a workspace row needs: just the workspace's own slug.
 *
 * The root of the tree, so there is nothing above it to bind — one id, and `Owned` drops
 * exactly that one from every child method, leaving `workspace.projects.list()` where the
 * flat call is `Projects.list(slug)`.
 */
export type WorkspaceIds = [slug: string];

/** The parameter names behind {@link WorkspaceIds}, in the same order. */
export const WORKSPACE_ID_NAMES = ["slug"] as const;

/**
 * Everything a fetched workspace can reach.
 *
 * One property per child `Workspaces` attaches, and
 * `tests/unit/v2/loaded-navigation.test.ts` compares the two sets rather than trusting
 * them: attach a child without a property here and it fails by name. This is the row the
 * Python SDK shipped bare — `workspaces.retrieve()` answered a plain model whose two dozen
 * children were unreachable, and the navigation sweep could not see it because it selected
 * on `loaded_model`. The Node sweep enumerates `migratedEntries()` instead, so a resource
 * that attaches a migrated child and is *not* navigable fails on that ground alone.
 *
 * The whole band is here: `tests/unit/v2/bands.test.ts` requires every workspace family to
 * be attached to `Workspaces`, and its pending count is now zero.
 *
 * `releaseTags` is on the workspace rather than on a release on purpose — a release points
 * at a tag through its own `tag_id`, and every route of that catalog takes the slug alone
 * (see `ReleaseNavigation`).
 *
 * `wiki` and `groupSync` are a different case and stay absent permanently: neither is a
 * `V2Resource` (they consume no path id of their own), so neither is a child a loaded row
 * can bind. Reach them as `v2.workspaces.groupSync.config.get(slug)` and
 * `v2.workspaces.wiki.pages.list(slug)`.
 */
export interface WorkspaceNavigation {
  readonly projects: Owned<Projects, WorkspaceIds>;
  readonly members: Owned<WorkspaceMembers, WorkspaceIds>;
  readonly invitations: Owned<Invitations, WorkspaceIds>;
  readonly roles: Owned<Roles, WorkspaceIds>;
  readonly permissionSchemes: Owned<PermissionSchemes, WorkspaceIds>;
  readonly permissions: Owned<WorkspacePermissions, WorkspaceIds>;
  readonly features: Owned<WorkspaceFeatures, WorkspaceIds>;
  readonly auditLogs: Owned<AuditLogs, WorkspaceIds>;
  readonly views: Owned<WorkspaceViews, WorkspaceIds>;
  readonly workItems: Owned<WorkspaceWorkItems, WorkspaceIds>;
  readonly workItemRelationDefinitions: Owned<WorkItemRelationDefinitions, WorkspaceIds>;
  readonly workItemTemplates: Owned<WorkspaceWorkItemTemplates, WorkspaceIds>;
  readonly assets: Owned<Assets, WorkspaceIds>;
  readonly artifacts: Owned<Artifacts, WorkspaceIds>;
  readonly stickies: Owned<Stickies, WorkspaceIds>;
  readonly teamspaces: Owned<Teamspaces, WorkspaceIds>;
  readonly customerProperties: Owned<CustomerProperties, WorkspaceIds>;
  readonly workItemTypes: Owned<WorkspaceWorkItemTypes, WorkspaceIds>;
  readonly workItemProperties: Owned<WorkspaceWorkItemProperties, WorkspaceIds>;
  readonly automations: Owned<WorkspaceAutomations, WorkspaceIds>;
  readonly customers: Owned<Customers, WorkspaceIds>;
  readonly initiatives: Owned<Initiatives, WorkspaceIds>;
  readonly releases: Owned<Releases, WorkspaceIds>;
  readonly releaseTags: Owned<ReleaseTags, WorkspaceIds>;
  readonly webhooks: Owned<Webhooks, WorkspaceIds>;
}

/**
 * A fetched workspace row that is also the place its children live.
 *
 * Generic over the row so a projection composes: `retrieve(slug, { fields: ["name"] })`
 * answers `LoadedWorkspaceRow<Pick<Workspace, "id" | "name">>` — still navigable, still
 * narrowed to what was asked for.
 */
export type LoadedWorkspaceRow<TRow> = Loaded<TRow, WorkspaceNavigation>;

export type LoadedWorkspace = LoadedWorkspaceRow<Workspace>;
