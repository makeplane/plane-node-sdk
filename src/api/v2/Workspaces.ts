import { Workspace } from "../../models/v2/Workspace";
import { Artifacts } from "./Artifacts";
import { Assets } from "./Assets";
import { AuditLogs } from "./AuditLogs";
import { CustomerProperties } from "./CustomerProperties";
import { WorkspaceFeatures } from "./Features";
import { FIELDS } from "./generated/constants";
import { GroupSync } from "./GroupSync";
import { Invitations } from "./Invitations";
import { LoadedMeta, LoadsNavigableRows, NavigationFactories, owned } from "./kernel/loaded";
import { AnyOperationId } from "./kernel/resource";
import { V2Transport } from "./kernel/transport";
import { LoadedWorkspace, LoadedWorkspaceRow, WORKSPACE_ID_NAMES, WorkspaceNavigation } from "./loaded/Workspace";
import { WorkspacePermissions } from "./Permissions";
import { PermissionSchemes } from "./PermissionSchemes";
import { Projects } from "./Projects";
import { Roles } from "./Roles";
import { Stickies } from "./Stickies";
import { Teamspaces } from "./Teamspaces";
import { Wiki } from "./Wiki";
import { WorkItemRelationDefinitions } from "./WorkItemRelationDefinitions";
import { WorkspaceWorkItemTemplates } from "./WorkItemTemplates/WorkspaceTemplates";
import { WorkspaceMembers } from "./WorkspaceMembers";
import { WorkspaceViews } from "./WorkspaceViews";
import { WorkspaceAutomations } from "./Automations/WorkspaceAutomations";
import { Customers } from "./Customers";
import { Initiatives } from "./Initiatives";
import { Releases } from "./Releases";
import { ReleaseTags } from "./Releases/Tags";
import { Webhooks } from "./Webhooks";
import { WorkspaceWorkItemProperties } from "./WorkspaceWorkItemProperties";
import { WorkspaceWorkItems } from "./WorkspaceWorkItems";
import { WorkspaceWorkItemTypes } from "./WorkspaceWorkItemTypes";

export type WorkspaceField = (typeof FIELDS)["workspaces_retrieve"][number];

/** `?fields=` on the workspace read. There is no list, and no write — see {@link Workspaces}. */
export interface WorkspaceFieldsParams {
  fields?: readonly WorkspaceField[];
}

/**
 * Workspaces — the root of the v2 tree, reached as `v2.workspaces`.
 *
 * **One operation.** `GET /workspaces/{slug}/` is the whole resource: api_v2 has no
 * workspace list (a token is scoped to workspaces the caller already names) and no
 * workspace write (creating and renaming a workspace stays in the app). The detail route
 * has no pk of its own — the slug in the path *is* the key — so `retrieve` is a singleton
 * read rather than a `{collection}{pk}/` one.
 *
 * **It is also the place every workspace-scoped family lives.** A fetched workspace comes
 * back as a {@link LoadedWorkspace}: `(await v2.workspaces.retrieve("acme")).projects.list()`
 * needs the slug once, at fetch time, and the same holds for every other child. That is
 * the point of implementing this resource at all — "get workspace detail by slug" is what
 * plane-ee shipped PR #9389 for, and the row it answers is what reaches everything else.
 *
 * The whole workspace band is attached here. `tests/unit/v2/bands.test.ts` derives that
 * band from the resources' own URL templates — every path that is `/workspaces/{slug}/`
 * plus one collection segment — and requires each of them to be on this class, so a
 * family cannot be added to the SDK and quietly left off the root.
 */
export class Workspaces extends LoadsNavigableRows<Workspace, never, never, WorkspaceNavigation> {
  protected path = "/workspaces/{slug}/";
  protected operations: Record<string, AnyOperationId> = {
    retrieve: "workspaces_retrieve",
  };
  protected loadedIdNames = WORKSPACE_ID_NAMES;

  public projects: Projects;
  public members: WorkspaceMembers;
  public invitations: Invitations;
  public roles: Roles;
  public permissionSchemes: PermissionSchemes;
  public permissions: WorkspacePermissions;
  public features: WorkspaceFeatures;
  public auditLogs: AuditLogs;
  public views: WorkspaceViews;
  public workItems: WorkspaceWorkItems;
  public workItemRelationDefinitions: WorkItemRelationDefinitions;
  public workItemTemplates: WorkspaceWorkItemTemplates;
  public assets: Assets;
  public artifacts: Artifacts;
  public stickies: Stickies;
  public teamspaces: Teamspaces;
  public customerProperties: CustomerProperties;
  public workItemTypes: WorkspaceWorkItemTypes;
  public workItemProperties: WorkspaceWorkItemProperties;
  public automations: WorkspaceAutomations;
  public customers: Customers;
  public initiatives: Initiatives;
  public releases: Releases;
  /**
   * The workspace-level release-tag catalog. Not a child of `Releases`: a release points
   * at a tag through its own `tag_id`, and every route here takes the slug alone.
   */
  public releaseTags: ReleaseTags;
  public webhooks: Webhooks;
  /**
   * IdP group sync. A grouping node, not a resource: it consumes no path id of its own, so
   * it is not a navigation property on a fetched row (its children each take `slug`
   * themselves). Reach it as `v2.workspaces.groupSync.config.retrieve(slug)`.
   */
  public groupSync: GroupSync;
  /**
   * The workspace wiki. A grouping node like {@link groupSync}, so not a navigation
   * property either. Both children are flat: `v2.workspaces.wiki.pages.list(slug)` and
   * `v2.workspaces.wiki.collections.list(slug)`.
   */
  public wiki: Wiki;

  constructor(transport: V2Transport) {
    super(transport);
    this.projects = new Projects(transport);
    this.members = new WorkspaceMembers(transport);
    this.invitations = new Invitations(transport);
    this.roles = new Roles(transport);
    this.permissionSchemes = new PermissionSchemes(transport);
    this.permissions = new WorkspacePermissions(transport);
    this.features = new WorkspaceFeatures(transport);
    this.auditLogs = new AuditLogs(transport);
    this.views = new WorkspaceViews(transport);
    this.workItems = new WorkspaceWorkItems(transport);
    this.workItemRelationDefinitions = new WorkItemRelationDefinitions(transport);
    this.workItemTemplates = new WorkspaceWorkItemTemplates(transport);
    this.assets = new Assets(transport);
    this.artifacts = new Artifacts(transport);
    this.stickies = new Stickies(transport);
    this.teamspaces = new Teamspaces(transport);
    this.customerProperties = new CustomerProperties(transport);
    this.workItemTypes = new WorkspaceWorkItemTypes(transport);
    this.workItemProperties = new WorkspaceWorkItemProperties(transport);
    this.automations = new WorkspaceAutomations(transport);
    this.customers = new Customers(transport);
    this.initiatives = new Initiatives(transport);
    this.releases = new Releases(transport);
    this.releaseTags = new ReleaseTags(transport);
    this.webhooks = new Webhooks(transport);
    this.groupSync = new GroupSync(transport);
    this.wiki = new Wiki(transport);
  }

  protected navigationOf(meta: LoadedMeta): NavigationFactories<WorkspaceNavigation> {
    const ids = meta.ids as [string];
    return {
      projects: () => owned(this.projects, ids, meta.idNames),
      members: () => owned(this.members, ids, meta.idNames),
      invitations: () => owned(this.invitations, ids, meta.idNames),
      roles: () => owned(this.roles, ids, meta.idNames),
      permissionSchemes: () => owned(this.permissionSchemes, ids, meta.idNames),
      permissions: () => owned(this.permissions, ids, meta.idNames),
      features: () => owned(this.features, ids, meta.idNames),
      auditLogs: () => owned(this.auditLogs, ids, meta.idNames),
      views: () => owned(this.views, ids, meta.idNames),
      workItems: () => owned(this.workItems, ids, meta.idNames),
      workItemRelationDefinitions: () => owned(this.workItemRelationDefinitions, ids, meta.idNames),
      workItemTemplates: () => owned(this.workItemTemplates, ids, meta.idNames),
      assets: () => owned(this.assets, ids, meta.idNames),
      artifacts: () => owned(this.artifacts, ids, meta.idNames),
      stickies: () => owned(this.stickies, ids, meta.idNames),
      teamspaces: () => owned(this.teamspaces, ids, meta.idNames),
      customerProperties: () => owned(this.customerProperties, ids, meta.idNames),
      workItemTypes: () => owned(this.workItemTypes, ids, meta.idNames),
      workItemProperties: () => owned(this.workItemProperties, ids, meta.idNames),
      automations: () => owned(this.automations, ids, meta.idNames),
      customers: () => owned(this.customers, ids, meta.idNames),
      initiatives: () => owned(this.initiatives, ids, meta.idNames),
      releases: () => owned(this.releases, ids, meta.idNames),
      releaseTags: () => owned(this.releaseTags, ids, meta.idNames),
      webhooks: () => owned(this.webhooks, ids, meta.idNames),
    };
  }

  /**
   * Children address a workspace by its **slug** — `/workspaces/acme/projects/` — never
   * the UUID `id`, which that path segment does not accept.
   *
   * {@link retrieve} fills `slug` back in when a projection dropped it, so the `id`
   * fallback is unreachable through the public API; it exists because `rowId` is called
   * for any row handed to `load`, and answering `undefined` would build
   * `/workspaces/undefined/...`.
   */
  protected rowId(row: Workspace): string {
    return row.slug ?? row.id;
  }

  /**
   * Fetch one workspace by slug.
   *
   * Answers a navigable row, so `workspace.projects.list()` and every other family work
   * without repeating the slug.
   */
  retrieve<F extends Exclude<WorkspaceField, "all"> & keyof Workspace>(
    slug: string,
    params: { fields: readonly F[] }
  ): Promise<LoadedWorkspaceRow<Pick<Workspace, F | "id">>>;
  retrieve(slug: string, params?: WorkspaceFieldsParams): Promise<LoadedWorkspace>;
  async retrieve(slug: string, params?: WorkspaceFieldsParams): Promise<LoadedWorkspace> {
    // A singleton read: the slug in the path is the key, so there is no pk to append.
    const row = await this.doRetrieveSingleton<Workspace>({ slug }, "retrieve", params as Record<string, unknown>);
    if (row.slug === undefined) {
      // `fields` projected the slug away. Every other resource falls back to `id` for the
      // child path segment; a workspace cannot, because `{slug}` does not accept the UUID.
      // The caller's own argument is the value this row was just fetched by, so fill it in
      // rather than build `/workspaces/undefined/...` children off the row.
      //
      // This does not widen what the caller can read. The narrowing overload answers
      // `Pick<Workspace, F | "id">`, which has no `slug` unless they asked for it, and
      // `loadRow` intersects `$loaded.present` with the same `fields`.
      row.slug = slug;
    }
    return this.load(row, [], params?.fields);
  }
}
