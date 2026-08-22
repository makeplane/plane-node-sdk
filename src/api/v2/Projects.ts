import { BulkUpdateItem, BulkWriteResponse, Page } from "../../models/v2/common";
import { Project, UpdateProject, ProjectPriority, ProjectSummary, CreateProject } from "../../models/v2/Project";
import { ProjectRoleDistribution as ProjectRoleDistributionShape } from "../../models/v2/ProjectRoleDistribution";
import { EXPAND, FIELDS, ORDER_BY } from "./generated/constants";
import { AnyOperationId, V2Resource } from "./kernel/resource";

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

const PROJECT_ROLE_DISTRIBUTION_PATH = "/workspaces/{slug}/project-role-distribution/";

/** Workspace projects; every detail route accepts either the project's UUID or its bare `identifier` (e.g. `"ENG"`). No bulk-delete. */
export class Projects extends V2Resource<Project, CreateProject, UpdateProject> {
  protected path = "/workspaces/{slug}/projects/";
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

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<ProjectField, "all"> & keyof Project>(
    params: ListProjectsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<Project, F | "id">>>;
  list(params?: ListProjectsParams): Promise<Page<Project>>;
  list(params?: ListProjectsParams): Promise<Page<Project>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every project in the workspace, following pages automatically. */
  iterate(params?: ListProjectsParams): AsyncGenerator<Project> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  /** `project` accepts a project UUID or its bare identifier (e.g. `ENG`) — see this class's own doc comment. */
  retrieve<F extends Exclude<ProjectField, "all"> & keyof Project>(
    project: string,
    params: { fields: readonly F[]; expand?: readonly ProjectExpand[] }
  ): Promise<Pick<Project, F | "id">>;
  retrieve(
    project: string,
    params?: { fields?: readonly ProjectField[]; expand?: readonly ProjectExpand[] }
  ): Promise<Project>;
  retrieve(
    project: string,
    params?: { fields?: readonly ProjectField[]; expand?: readonly ProjectExpand[] }
  ): Promise<Project> {
    return this.doRetrieve({ pk: project }, params as Record<string, unknown>);
  }

  /** The one project with this name; throws if none or several match. */
  findByName(name: string): Promise<Project> {
    return this.doFindOne({ name }, {});
  }

  create(
    data: CreateProject,
    params?: { fields?: readonly ProjectField[]; expand?: readonly ProjectExpand[] }
  ): Promise<Project> {
    return this.doCreate(data, {}, params as Record<string, unknown>);
  }

  /** `project` accepts a project UUID or its bare identifier — see this class's own doc comment. */
  update(
    project: string,
    data: UpdateProject,
    params?: { fields?: readonly ProjectField[]; expand?: readonly ProjectExpand[] }
  ): Promise<Project> {
    return this.doUpdate(data, { pk: project }, params as Record<string, unknown>);
  }

  /** `project` accepts a project UUID or its bare identifier — see this class's own doc comment. */
  delete(project: string): Promise<void> {
    return this.doDelete({ pk: project });
  }

  /** Reconciles on (external_source, external_id) when both are set. */
  upsert(
    data: CreateProject,
    params?: { fields?: readonly ProjectField[]; expand?: readonly ProjectExpand[] }
  ): Promise<Project> {
    return this.doUpsert(data, {}, params as Record<string, unknown>);
  }

  bulkCreate(items: CreateProject[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkCreate(items, {}, allOrNone);
  }

  bulkUpdate(items: BulkUpdateItem<UpdateProject>[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkUpdate(items, {}, allOrNone);
  }

  // Deliberately no bulkDelete — see this class's own doc comment.

  /** Archive a project. `204` — no response body, so this returns `void`; re-`retrieve` for the row. */
  archive(project: string): Promise<void> {
    return this.doAction<void>("archive", { pk: project });
  }

  /** Unarchive a project. `project` accepts a UUID or bare identifier. `204` — no response body. */
  unarchive(project: string): Promise<void> {
    return this.doAction<void>("unarchive", { pk: project });
  }

  /** Project identity plus resource counts; `counts` narrows which keys are returned (see {@link ProjectSummaryCount}). */
  async summary(project: string, counts?: readonly ProjectSummaryCount[]): Promise<ProjectSummary> {
    return this.transport.request<ProjectSummary>("GET", `${this.detailUrl({ pk: project })}summary/`, {
      params: this.query(counts && counts.length > 0 ? { counts: counts.join(",") } : undefined, "summary"),
    });
  }

  /** Workspace-wide project role stats. A single aggregate object, not a per-`pk` row. */
  async roleDistribution(): Promise<ProjectRoleDistributionShape> {
    return this.transport.request<ProjectRoleDistributionShape>("GET", this.urlFor(PROJECT_ROLE_DISTRIBUTION_PATH, {}));
  }
}
