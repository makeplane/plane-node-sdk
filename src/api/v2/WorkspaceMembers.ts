import { Page } from "../../models/v2/common";
import { WorkspaceMember, WorkspaceMemberRemoveRequest } from "../../models/v2/Member";
import { AnyOperationId, V2Resource } from "./kernel/resource";
import { ListMembersParams, ProjectMemberField } from "./Members";

/** Every member of the workspace itself, not a project. `list`/`iterate` only, plus `remove` (bulk-remove-by-email). */
export class WorkspaceMembers extends V2Resource<WorkspaceMember, never, never> {
  protected path = "/workspaces/{slug}/members/";
  // `remove` POSTs to `.../members/remove/`, its own template rather than a verb on a
  // row — it is keyed on an email, not a member id.
  protected extraPaths = { remove: "/workspaces/{slug}/members/remove/" };
  protected operations: Record<string, AnyOperationId> = {
    list: "workspace_members_list",
    remove: "workspace_members_remove",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<ProjectMemberField, "all"> & keyof WorkspaceMember>(
    slug: string,
    params: ListMembersParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkspaceMember, F | "id">>>;
  list(slug: string, params?: ListMembersParams): Promise<Page<WorkspaceMember>>;
  list(slug: string, params?: ListMembersParams): Promise<Page<WorkspaceMember>> {
    return this.doList({ slug }, params as Record<string, unknown>);
  }

  /** Every member of the workspace, following pages automatically. */
  iterate<F extends Exclude<ProjectMemberField, "all"> & keyof WorkspaceMember>(
    slug: string,
    params: ListMembersParams & { fields: readonly F[] }
  ): AsyncGenerator<Pick<WorkspaceMember, F | "id">>;
  iterate(slug: string, params?: ListMembersParams): AsyncGenerator<WorkspaceMember>;
  iterate(slug: string, params?: ListMembersParams): AsyncGenerator<WorkspaceMember> {
    return this.doIterate({ slug }, params as Record<string, unknown>);
  }

  /**
   * Remove a member from the workspace by email (v1 parity) — soft-deactivates and
   * cascades out of every project. Not addressed by a member id.
   *
   * Resolves to `void`, unlike the `add`/`remove` bridge pairs elsewhere that resolve to
   * the ids the server reports: this has no `add` counterpart and is not one side of a
   * membership bridge, and the golden answers 204 with no body.
   */
  async remove(slug: string, data: WorkspaceMemberRemoveRequest): Promise<void> {
    await this.doCustomAction<void>("remove", { pathParams: { slug }, data });
  }
}
