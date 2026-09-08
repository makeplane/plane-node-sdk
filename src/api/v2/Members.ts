import { Page } from "../../models/v2/common";
import { ProjectMember, UpdateProjectMember, CreateProjectMember } from "../../models/v2/Member";
import { EXPAND, FIELDS, ORDER_BY } from "./generated/constants";
import { AnyOperationId, V2Resource } from "./kernel/resource";

export type ProjectMemberField = (typeof FIELDS)["project_members_list"][number];
export type ProjectMemberOrderBy = (typeof ORDER_BY)["project_members_list"][number];
export type ProjectMemberExpand = (typeof EXPAND)["project_members_list"][number];

/** Shared with `WorkspaceMembers` — both list ops carry identical `fields`/`order_by`/`expand` enums in the golden. */
export interface ListMembersParams {
  fields?: readonly ProjectMemberField[];
  expand?: readonly ProjectMemberExpand[];
  member_id?: string;
  member_id__in?: readonly string[];
  role?: string;
  role__in?: readonly string[];
  search?: string;
  order_by?: ProjectMemberOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=`/`?expand=` on a single-row read or write. */
export interface ProjectMemberShapeParams {
  fields?: readonly ProjectMemberField[];
  expand?: readonly ProjectMemberExpand[];
}

/** Project members. Full CRUD; the workspace-scoped sibling is a separate class, `WorkspaceMembers`. */
export class ProjectMembers extends V2Resource<ProjectMember, CreateProjectMember, UpdateProjectMember> {
  protected path = "/workspaces/{slug}/projects/{project_id}/members/";
  protected operations: Record<string, AnyOperationId> = {
    list: "project_members_list",
    retrieve: "project_members_retrieve",
    create: "project_members_create",
    update: "project_members_partial_update",
    delete: "project_members_destroy",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<ProjectMemberField, "all"> & keyof ProjectMember>(
    slug: string,
    project: string,
    params: ListMembersParams & { fields: readonly F[] }
  ): Promise<Page<Pick<ProjectMember, F | "id">>>;
  list(slug: string, project: string, params?: ListMembersParams): Promise<Page<ProjectMember>>;
  list(slug: string, project: string, params?: ListMembersParams): Promise<Page<ProjectMember>> {
    return this.doList({ slug, project_id: project }, params as Record<string, unknown>);
  }

  /** Every project member, following pages automatically. */
  iterate<F extends Exclude<ProjectMemberField, "all"> & keyof ProjectMember>(
    slug: string,
    project: string,
    params: Omit<ListMembersParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<Pick<ProjectMember, F | "id">>;
  iterate(
    slug: string,
    project: string,
    params?: Omit<ListMembersParams, "offset" | "count">
  ): AsyncGenerator<ProjectMember>;
  iterate(
    slug: string,
    project: string,
    params?: Omit<ListMembersParams, "offset" | "count">
  ): AsyncGenerator<ProjectMember> {
    return this.doIterate({ slug, project_id: project }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<ProjectMemberField, "all"> & keyof ProjectMember>(
    slug: string,
    project: string,
    member: string,
    params: { fields: readonly F[]; expand?: readonly ProjectMemberExpand[] }
  ): Promise<Pick<ProjectMember, F | "id">>;
  retrieve(slug: string, project: string, member: string, params?: ProjectMemberShapeParams): Promise<ProjectMember>;
  retrieve(slug: string, project: string, member: string, params?: ProjectMemberShapeParams): Promise<ProjectMember> {
    return this.doRetrieve({ slug, project_id: project, pk: member }, params as Record<string, unknown>);
  }

  /** `member_id` is required; `role` defaults to `"member"` server-side when omitted. */
  create<F extends Exclude<ProjectMemberField, "all"> & keyof ProjectMember>(
    slug: string,
    project: string,
    data: CreateProjectMember,
    params: ProjectMemberShapeParams & { fields: readonly F[] }
  ): Promise<Pick<ProjectMember, F | "id">>;
  create(
    slug: string,
    project: string,
    data: CreateProjectMember,
    params?: ProjectMemberShapeParams
  ): Promise<ProjectMember>;
  create(
    slug: string,
    project: string,
    data: CreateProjectMember,
    params?: ProjectMemberShapeParams
  ): Promise<ProjectMember> {
    return this.doCreate(data, { slug, project_id: project }, params as Record<string, unknown>);
  }

  /** `role` only — `member_id` is immutable on update, see {@link UpdateProjectMember}. */
  update<F extends Exclude<ProjectMemberField, "all"> & keyof ProjectMember>(
    slug: string,
    project: string,
    member: string,
    data: UpdateProjectMember,
    params: ProjectMemberShapeParams & { fields: readonly F[] }
  ): Promise<Pick<ProjectMember, F | "id">>;
  update(
    slug: string,
    project: string,
    member: string,
    data: UpdateProjectMember,
    params?: ProjectMemberShapeParams
  ): Promise<ProjectMember>;
  update(
    slug: string,
    project: string,
    member: string,
    data: UpdateProjectMember,
    params?: ProjectMemberShapeParams
  ): Promise<ProjectMember> {
    return this.doUpdate(data, { slug, project_id: project, pk: member }, params as Record<string, unknown>);
  }

  delete(slug: string, project: string, member: string): Promise<void> {
    return this.doDelete({ slug, project_id: project, pk: member });
  }
}
