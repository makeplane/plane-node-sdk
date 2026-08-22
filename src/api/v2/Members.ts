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
  count?: boolean;
}

/** Project members, reached bound to a project. Full CRUD; the workspace-scoped sibling is a separate class, `WorkspaceMembers`. */
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
    params: ListMembersParams & { fields: readonly F[] }
  ): Promise<Page<Pick<ProjectMember, F | "id">>>;
  list(params?: ListMembersParams): Promise<Page<ProjectMember>>;
  list(params?: ListMembersParams): Promise<Page<ProjectMember>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every project member, following pages automatically. */
  iterate(params?: ListMembersParams): AsyncGenerator<ProjectMember> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<ProjectMemberField, "all"> & keyof ProjectMember>(
    memberId: string,
    params: { fields: readonly F[]; expand?: readonly ProjectMemberExpand[] }
  ): Promise<Pick<ProjectMember, F | "id">>;
  retrieve(
    memberId: string,
    params?: { fields?: readonly ProjectMemberField[]; expand?: readonly ProjectMemberExpand[] }
  ): Promise<ProjectMember>;
  retrieve(
    memberId: string,
    params?: { fields?: readonly ProjectMemberField[]; expand?: readonly ProjectMemberExpand[] }
  ): Promise<ProjectMember> {
    return this.doRetrieve({ pk: memberId }, params as Record<string, unknown>);
  }

  /** `member_id` is required; `role` defaults to `"member"` server-side when omitted. */
  create(
    data: CreateProjectMember,
    params?: { fields?: readonly ProjectMemberField[]; expand?: readonly ProjectMemberExpand[] }
  ): Promise<ProjectMember> {
    return this.doCreate(data, {}, params as Record<string, unknown>);
  }

  /** `role` only — `member_id` is immutable on update, see {@link UpdateProjectMember}. */
  update(
    memberId: string,
    data: UpdateProjectMember,
    params?: { fields?: readonly ProjectMemberField[]; expand?: readonly ProjectMemberExpand[] }
  ): Promise<ProjectMember> {
    return this.doUpdate(data, { pk: memberId }, params as Record<string, unknown>);
  }

  delete(memberId: string): Promise<void> {
    return this.doDelete({ pk: memberId });
  }
}
