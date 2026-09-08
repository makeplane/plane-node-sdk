import { BulkUpdateItem, BulkWriteResponse, Page } from "../../models/v2/common";
import { Project, UpdateProject, ProjectPriority, ProjectSummary, CreateProject } from "../../models/v2/Project";
import { ProjectRoleDistribution as ProjectRoleDistributionShape } from "../../models/v2/ProjectRoleDistribution";
import { ProjectAutomations } from "./Automations/ProjectAutomations";
import { Cycles } from "./Cycles";
import { Estimates } from "./Estimates";
import { ProjectFeatures } from "./Features";
import { EXPAND, FIELDS, ORDER_BY } from "./generated/constants";
import { Intakes } from "./Intakes";
import { LoadedMeta, LoadsNavigableRows, NavigationFactories, owned } from "./kernel/loaded";
import { AnyOperationId } from "./kernel/resource";
import { V2Transport } from "./kernel/transport";
import { Labels } from "./Labels";
import { LoadedProject, LoadedProjectRow, PROJECT_ID_NAMES, ProjectNavigation } from "./loaded/Project";
import { ProjectMembers } from "./Members";
import { Milestones } from "./Milestones";
import { Modules } from "./Modules";
import { ProjectPages } from "./Pages";
import { ProjectPermissions } from "./Permissions";
import { ProjectWorklogs } from "./ProjectWorklogs";
import { States } from "./States";
import { ProjectViews } from "./Views";
import { ProjectWorkItemTemplates } from "./WorkItemTemplates/ProjectTemplates";
import { WorkItemProperties } from "./WorkItemProperties";
import { WorkItems } from "./WorkItems";
import { WorkItemTypes } from "./WorkItemTypes";
import { Workflows } from "./Workflows";

export type ProjectField = (typeof FIELDS)["projects_list"][number];
export type ProjectOrderBy = (typeof ORDER_BY)["projects_list"][number];
/** `default_assignee` | `project_lead` — replaces the corresponding `*_id` field with the full member object. */
export type ProjectExpand = (typeof EXPAND)["projects_list"][number];

export interface ListProjectsParams {
  fields?: readonly ProjectField[];
  expand?: readonly ProjectExpand[];
  name?: string;
  identifier?: string;
  key?: string;
  network?: number;
  priority?: ProjectPriority;
  priority__in?: readonly ProjectPriority[];
  is_archived?: boolean;
  include_archived?: boolean;
  external_id?: string;
  external_source?: string;
  search?: string;
  order_by?: ProjectOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** `?fields=`/`?expand=` on a single-row read or write. */
export interface ProjectShapeParams {
  fields?: readonly ProjectField[];
  expand?: readonly ProjectExpand[];
}

/** Comma-separated count keys for {@link Projects.summary}; omitting `counts` returns every key. */
export type ProjectSummaryCount =
  | "members"
  | "states"
  | "labels"
  | "cycles"
  | "modules"
  | "issues"
  | "intakes"
  | "work_item_types"
  | "work_item_properties"
  | "pages";

/**
 * Workspace projects; every detail route accepts either the project's UUID or its bare
 * `identifier` (e.g. `"ENG"`). No bulk-delete — deleting a project cascades everything
 * in it.
 *
 * Every row-returning method answers a {@link LoadedProject}: the row's own data plus
 * the path ids its children need, so `project.states.list()` works without repeating
 * `slug` or the project key. The project band hangs off this class, and
 * `tests/unit/v2/bands.test.ts` requires each family to arrive here as it migrates —
 * a family that is flat-shaped but only on the retiring `Project` locator is unreachable
 * from `v2.projects` and from every fetched project row.
 */
export class Projects extends LoadsNavigableRows<Project, CreateProject, UpdateProject, ProjectNavigation> {
  protected path = "/workspaces/{slug}/projects/";
  protected extraPaths = {
    // A workspace-wide report, not a row of this collection — its own sibling route.
    roleDistribution: "/workspaces/{slug}/project-role-distribution/",
  };
  protected operations: Record<string, AnyOperationId> = {
    list: "projects_list",
    retrieve: "projects_retrieve",
    create: "projects_create",
    update: "projects_partial_update",
    upsert: "projects_upsert",
    delete: "projects_destroy",
    archive: "projects_archive",
    unarchive: "projects_unarchive",
    bulkCreate: "projects_bulk_create",
    bulkUpdate: "projects_bulk_update",
    summary: "projects_summary",
    roleDistribution: "project_role_distribution",
  };
  protected loadedIdNames = PROJECT_ID_NAMES;

  public states: States;
  public labels: Labels;
  public workItems: WorkItems;
  public members: ProjectMembers;
  public pages: ProjectPages;
  public views: ProjectViews;
  public features: ProjectFeatures;
  public permissions: ProjectPermissions;
  public intakes: Intakes;
  public workItemTemplates: ProjectWorkItemTemplates;
  public worklogs: ProjectWorklogs;
  public cycles: Cycles;
  public modules: Modules;
  public milestones: Milestones;
  public estimates: Estimates;
  public workItemTypes: WorkItemTypes;
  public workItemProperties: WorkItemProperties;
  public workflows: Workflows;
  public automations: ProjectAutomations;

  constructor(transport: V2Transport) {
    super(transport);
    this.states = new States(transport);
    this.labels = new Labels(transport);
    this.workItems = new WorkItems(transport);
    this.members = new ProjectMembers(transport);
    this.pages = new ProjectPages(transport);
    this.views = new ProjectViews(transport);
    this.features = new ProjectFeatures(transport);
    this.permissions = new ProjectPermissions(transport);
    this.intakes = new Intakes(transport);
    this.workItemTemplates = new ProjectWorkItemTemplates(transport);
    this.worklogs = new ProjectWorklogs(transport);
    this.cycles = new Cycles(transport);
    this.modules = new Modules(transport);
    this.milestones = new Milestones(transport);
    this.estimates = new Estimates(transport);
    this.workItemTypes = new WorkItemTypes(transport);
    this.workItemProperties = new WorkItemProperties(transport);
    this.workflows = new Workflows(transport);
    this.automations = new ProjectAutomations(transport);
  }

  protected navigationOf(meta: LoadedMeta): NavigationFactories<ProjectNavigation> {
    const ids = meta.ids as [string, string];
    return {
      states: () => owned(this.states, ids, meta.idNames),
      labels: () => owned(this.labels, ids, meta.idNames),
      workItems: () => owned(this.workItems, ids, meta.idNames),
      members: () => owned(this.members, ids, meta.idNames),
      pages: () => owned(this.pages, ids, meta.idNames),
      views: () => owned(this.views, ids, meta.idNames),
      features: () => owned(this.features, ids, meta.idNames),
      permissions: () => owned(this.permissions, ids, meta.idNames),
      intakes: () => owned(this.intakes, ids, meta.idNames),
      workItemTemplates: () => owned(this.workItemTemplates, ids, meta.idNames),
      worklogs: () => owned(this.worklogs, ids, meta.idNames),
      cycles: () => owned(this.cycles, ids, meta.idNames),
      modules: () => owned(this.modules, ids, meta.idNames),
      milestones: () => owned(this.milestones, ids, meta.idNames),
      estimates: () => owned(this.estimates, ids, meta.idNames),
      workItemTypes: () => owned(this.workItemTypes, ids, meta.idNames),
      workItemProperties: () => owned(this.workItemProperties, ids, meta.idNames),
      workflows: () => owned(this.workflows, ids, meta.idNames),
      automations: () => owned(this.automations, ids, meta.idNames),
    };
  }

  /**
   * Children address a project by its readable identifier where the server returned one
   * — `.../projects/ENG/states/`, not the UUID.
   */
  protected rowId(row: Project): string {
    return row.identifier ?? row.id;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<ProjectField, "all"> & keyof Project>(
    slug: string,
    params: ListProjectsParams & { fields: readonly F[] }
  ): Promise<Page<LoadedProjectRow<Pick<Project, F | "id">>>>;
  list(slug: string, params?: ListProjectsParams): Promise<Page<LoadedProject>>;
  async list(slug: string, params?: ListProjectsParams): Promise<Page<LoadedProject>> {
    const page = await this.doList({ slug }, params as Record<string, unknown>);
    return this.loadPage(page, [slug], params?.fields);
  }

  /** Every project in the workspace, following pages automatically — navigable rows included. */
  iterate<F extends Exclude<ProjectField, "all"> & keyof Project>(
    slug: string,
    params: ListProjectsParams & { fields: readonly F[] }
  ): AsyncGenerator<LoadedProjectRow<Pick<Project, F | "id">>>;
  iterate(slug: string, params?: ListProjectsParams): AsyncGenerator<LoadedProject>;
  iterate(slug: string, params?: ListProjectsParams): AsyncGenerator<LoadedProject> {
    return this.loadIterate(this.doIterate({ slug }, params as Record<string, unknown>), [slug], params?.fields);
  }

  /** `project` accepts a project UUID or its bare identifier (e.g. `ENG`) — see this class's own doc comment. */
  retrieve<F extends Exclude<ProjectField, "all"> & keyof Project>(
    slug: string,
    project: string,
    params: { fields: readonly F[]; expand?: readonly ProjectExpand[] }
  ): Promise<LoadedProjectRow<Pick<Project, F | "id">>>;
  retrieve(slug: string, project: string, params?: ProjectShapeParams): Promise<LoadedProject>;
  async retrieve(slug: string, project: string, params?: ProjectShapeParams): Promise<LoadedProject> {
    const row = await this.doRetrieve({ slug, pk: project }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  /**
   * The one project with this name; throws if none or several match. Answers the same
   * navigable row `retrieve` does — a lookup handing back a plain row would silently
   * drop `.states`/`.labels`/`.workItems`.
   */
  async findByName(slug: string, name: string): Promise<LoadedProject> {
    const row = await this.doFindOne({ name }, { slug });
    return this.load(row, [slug]);
  }

  create<F extends Exclude<ProjectField, "all"> & keyof Project>(
    slug: string,
    data: CreateProject,
    params: ProjectShapeParams & { fields: readonly F[] }
  ): Promise<LoadedProjectRow<Pick<Project, F | "id">>>;
  create(slug: string, data: CreateProject, params?: ProjectShapeParams): Promise<LoadedProject>;
  async create(slug: string, data: CreateProject, params?: ProjectShapeParams): Promise<LoadedProject> {
    const row = await this.doCreate(data, { slug }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  /** `project` accepts a project UUID or its bare identifier — see this class's own doc comment. */
  update<F extends Exclude<ProjectField, "all"> & keyof Project>(
    slug: string,
    project: string,
    data: UpdateProject,
    params: ProjectShapeParams & { fields: readonly F[] }
  ): Promise<LoadedProjectRow<Pick<Project, F | "id">>>;
  update(slug: string, project: string, data: UpdateProject, params?: ProjectShapeParams): Promise<LoadedProject>;
  async update(
    slug: string,
    project: string,
    data: UpdateProject,
    params?: ProjectShapeParams
  ): Promise<LoadedProject> {
    const row = await this.doUpdate(data, { slug, pk: project }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  /** `project` accepts a project UUID or its bare identifier — see this class's own doc comment. */
  delete(slug: string, project: string): Promise<void> {
    return this.doDelete({ slug, pk: project });
  }

  /** Reconciles on (external_source, external_id) when both are set. */
  upsert<F extends Exclude<ProjectField, "all"> & keyof Project>(
    slug: string,
    data: CreateProject,
    params: ProjectShapeParams & { fields: readonly F[] }
  ): Promise<LoadedProjectRow<Pick<Project, F | "id">>>;
  upsert(slug: string, data: CreateProject, params?: ProjectShapeParams): Promise<LoadedProject>;
  async upsert(slug: string, data: CreateProject, params?: ProjectShapeParams): Promise<LoadedProject> {
    const row = await this.doUpsert(data, { slug }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  bulkCreate(slug: string, items: CreateProject[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkCreate(items, { slug }, allOrNone);
  }

  /** Each item is the patch plus the target `id`. */
  bulkUpdate(slug: string, items: BulkUpdateItem<UpdateProject>[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkUpdate(items, { slug }, allOrNone);
  }

  // Deliberately no bulkDelete — see this class's own doc comment.

  /** Archive a project. `204` — no response body, so this returns `void`; re-`retrieve` for the row. */
  archive(slug: string, project: string): Promise<void> {
    return this.doVoidAction("archive", { slug, pk: project });
  }

  /** Unarchive a project. `project` accepts a UUID or bare identifier. `204` — no response body. */
  unarchive(slug: string, project: string): Promise<void> {
    return this.doVoidAction("unarchive", { slug, pk: project });
  }

  /** Project identity plus resource counts; `counts` narrows which keys are returned (see {@link ProjectSummaryCount}). */
  summary(slug: string, project: string, counts?: readonly ProjectSummaryCount[]): Promise<ProjectSummary> {
    return this.doCustomAction<ProjectSummary>("summary", {
      method: "GET",
      pathParams: { slug },
      pk: project,
      params: counts && counts.length > 0 ? { counts: counts.join(",") } : undefined,
    });
  }

  /**
   * Workspace-wide project role stats. A single read-only report, not a row of this
   * collection — one object per workspace, no `id`, and its own template in `extraPaths`.
   */
  roleDistribution(slug: string): Promise<ProjectRoleDistributionShape> {
    return this.doCustomAction<ProjectRoleDistributionShape>("roleDistribution", {
      method: "GET",
      pathParams: { slug },
    });
  }
}
