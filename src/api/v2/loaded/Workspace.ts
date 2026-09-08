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
 * The band still on the pre-flat shape (`Customers`, `Initiatives`, `Releases`,
 * `Webhooks`, `WorkspaceAutomations`, `WorkspaceWorkItemProperties`,
 * `WorkspaceWorkItemTypes`) is deliberately absent: those classes take their `{slug}`
 * from the retired locator scope rather than as a leading parameter, so there is nothing
 * for `owned()` to bind. They are not exempt, they are *pending* —
 * `tests/unit/v2/workspace-band.test.ts` requires every migrated member of the band to be
 * attached here, and counts the rest against a ratchet task 3 has to shrink.
 *
 * `wiki` and `groupSync` are a different case and stay absent permanently: neither is a
 * `V2Resource` (they consume no path id of their own), so neither is a child a loaded row
 * can bind. Reach them as `v2.workspaces.groupSync.config.get(slug)` and, until the last
 * of the wiki band migrates, `v2.workspace(slug).wiki.pages`.
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
