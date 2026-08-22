import { Page } from "../../models/v2/common";
import { WorkspaceInvite, BulkCreateWorkspaceInvites, CreateWorkspaceInvite } from "../../models/v2/WorkspaceInvite";
import { FIELDS, ORDER_BY } from "./generated/constants";
import { OperationId, V2Resource } from "./kernel/resource";

export type WorkspaceInviteField = (typeof FIELDS)["members_list"][number];
export type WorkspaceInviteOrderBy = (typeof ORDER_BY)["members_list"][number];

export interface ListInvitationsParams {
  fields?: readonly WorkspaceInviteField[];
  accepted?: boolean;
  email?: string;
  search?: string;
  order_by?: WorkspaceInviteOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** Workspace invitations; no PATCH (accepted/declined by the invitee, not edited) and no `upsert`. */
export class Invitations extends V2Resource<WorkspaceInvite, CreateWorkspaceInvite, never> {
  protected path = "/workspaces/{slug}/invitations/";
  protected operations: Record<string, OperationId> = {
    list: "members_list",
    retrieve: "members_retrieve",
    create: "members_create",
    bulk: "members_bulk",
    delete: "members_destroy",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkspaceInviteField, "all"> & keyof WorkspaceInvite>(
    params: ListInvitationsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkspaceInvite, F | "id">>>;
  list(params?: ListInvitationsParams): Promise<Page<WorkspaceInvite>>;
  list(params?: ListInvitationsParams): Promise<Page<WorkspaceInvite>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every invitation, following pages automatically. */
  iterate(params?: ListInvitationsParams): AsyncGenerator<WorkspaceInvite> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkspaceInviteField, "all"> & keyof WorkspaceInvite>(
    inviteId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkspaceInvite, F | "id">>;
  retrieve(inviteId: string, params?: { fields?: readonly WorkspaceInviteField[] }): Promise<WorkspaceInvite>;
  retrieve(inviteId: string, params?: { fields?: readonly WorkspaceInviteField[] }): Promise<WorkspaceInvite> {
    return this.doRetrieve({ pk: inviteId }, params as Record<string, unknown>);
  }

  create(data: CreateWorkspaceInvite): Promise<WorkspaceInvite> {
    return this.doCreate(data, {});
  }

  /** Revoke an invitation. The API rejects revoking one already accepted (400). */
  delete(inviteId: string): Promise<void> {
    return this.doDelete({ pk: inviteId });
  }

  /** Invite up to 100 emails. Golden's schema shows a single object; the live view returns an array — modeled as such. */
  async bulk(
    data: BulkCreateWorkspaceInvites,
    params?: { fields?: readonly WorkspaceInviteField[] }
  ): Promise<WorkspaceInvite[]> {
    return this.transport.request<WorkspaceInvite[]>("POST", `${this.collectionUrl({})}bulk/`, {
      params: this.query(params, "bulk"),
      data,
    });
  }
}
