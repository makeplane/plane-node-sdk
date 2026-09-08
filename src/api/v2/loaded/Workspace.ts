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
 * can bind. Reach them as `v2.workspaces.groupSync.config.retrieve(slug)` and
 * `v2.workspaces.wiki.pages.list(slug)`.
 */
export interface WorkspaceNavigation {
  /**
   * Projects with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly projects: Owned<Projects, WorkspaceIds>;
  /**
   * WorkspaceMembers with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly members: Owned<WorkspaceMembers, WorkspaceIds>;
  /**
   * Invitations with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly invitations: Owned<Invitations, WorkspaceIds>;
  /**
   * Roles with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly roles: Owned<Roles, WorkspaceIds>;
  /**
   * PermissionSchemes with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly permissionSchemes: Owned<PermissionSchemes, WorkspaceIds>;
  /**
   * WorkspacePermissions with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly permissions: Owned<WorkspacePermissions, WorkspaceIds>;
  /**
   * WorkspaceFeatures with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly features: Owned<WorkspaceFeatures, WorkspaceIds>;
  /**
   * AuditLogs with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly auditLogs: Owned<AuditLogs, WorkspaceIds>;
  /**
   * WorkspaceViews with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly views: Owned<WorkspaceViews, WorkspaceIds>;
  /**
   * WorkspaceWorkItems with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly workItems: Owned<WorkspaceWorkItems, WorkspaceIds>;
  /**
   * WorkItemRelationDefinitions with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly workItemRelationDefinitions: Owned<WorkItemRelationDefinitions, WorkspaceIds>;
  /**
   * WorkspaceWorkItemTemplates with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly workItemTemplates: Owned<WorkspaceWorkItemTemplates, WorkspaceIds>;
  /**
   * Assets with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly assets: Owned<Assets, WorkspaceIds>;
  /**
   * Artifacts with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly artifacts: Owned<Artifacts, WorkspaceIds>;
  /**
   * Stickies with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly stickies: Owned<Stickies, WorkspaceIds>;
  /**
   * Teamspaces with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly teamspaces: Owned<Teamspaces, WorkspaceIds>;
  /**
   * CustomerProperties with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly customerProperties: Owned<CustomerProperties, WorkspaceIds>;
  /**
   * WorkspaceWorkItemTypes with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly workItemTypes: Owned<WorkspaceWorkItemTypes, WorkspaceIds>;
  /**
   * WorkspaceWorkItemProperties with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly workItemProperties: Owned<WorkspaceWorkItemProperties, WorkspaceIds>;
  /**
   * WorkspaceAutomations with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly automations: Owned<WorkspaceAutomations, WorkspaceIds>;
  /**
   * Customers with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly customers: Owned<Customers, WorkspaceIds>;
  /**
   * Initiatives with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly initiatives: Owned<Initiatives, WorkspaceIds>;
  /**
   * Releases with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly releases: Owned<Releases, WorkspaceIds>;
  /**
   * ReleaseTags with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly releaseTags: Owned<ReleaseTags, WorkspaceIds>;
  /**
   * Webhooks with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
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
