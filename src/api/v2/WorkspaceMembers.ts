import { Page } from "../../models/v2/common";
import { WorkspaceMember, WorkspaceMemberRemoveRequest } from "../../models/v2/Member";
import { AnyOperationId, V2Resource } from "./kernel/resource";
import { ListMembersParams, ProjectMemberField } from "./Members";

/** Every member of the workspace itself, not a project. `list`/`iterate` only, plus `remove` (bulk-remove-by-email). */
export class WorkspaceMembers extends V2Resource<WorkspaceMember, never, never> {
  protected path = "/workspaces/{slug}/members/";
  protected operations: Record<string, AnyOperationId> = {
    list: "workspace_members_list",
    remove: "workspace_members_remove",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<ProjectMemberField, "all"> & keyof WorkspaceMember>(
    params: ListMembersParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkspaceMember, F | "id">>>;
  list(params?: ListMembersParams): Promise<Page<WorkspaceMember>>;
  list(params?: ListMembersParams): Promise<Page<WorkspaceMember>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every member of the workspace, following pages automatically. */
  iterate(params?: ListMembersParams): AsyncGenerator<WorkspaceMember> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  /** Remove a member from the workspace by email (v1 parity) — not addressed by member id. */
  async remove(data: WorkspaceMemberRemoveRequest): Promise<void> {
    await this.transport.request<void>("POST", `${this.collectionUrl({})}remove/`, {
      data,
    });
  }
}
