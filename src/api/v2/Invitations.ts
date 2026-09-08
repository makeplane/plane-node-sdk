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

/** `?fields=` on a single-row read or write. */
export interface WorkspaceInviteFieldsParams {
  fields?: readonly WorkspaceInviteField[];
}

/** Workspace invitations; no PATCH (accepted/declined by the invitee, not edited) and no `upsert`. */
export class Invitations extends V2Resource<WorkspaceInvite, CreateWorkspaceInvite, never> {
  protected path = "/workspaces/{slug}/invitations/";
  // `bulk` POSTs to `.../invitations/bulk/`, which is a template of its own rather than
  // a verb on a row — declared here so `urlFor` builds it and the sweeps check `bulk`'s
  // leading parameters against this template, not against `path`.
  protected extraPaths = { bulk: "/workspaces/{slug}/invitations/bulk/" };
  protected operations: Record<string, OperationId> = {
    list: "members_list",
    retrieve: "members_retrieve",
    create: "members_create",
    bulk: "members_bulk",
    delete: "members_destroy",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkspaceInviteField, "all"> & keyof WorkspaceInvite>(
    slug: string,
    params: ListInvitationsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkspaceInvite, F | "id">>>;
  list(slug: string, params?: ListInvitationsParams): Promise<Page<WorkspaceInvite>>;
  list(slug: string, params?: ListInvitationsParams): Promise<Page<WorkspaceInvite>> {
    return this.doList({ slug }, params as Record<string, unknown>);
  }

  /** Every invitation, following pages automatically. */
  iterate<F extends Exclude<WorkspaceInviteField, "all"> & keyof WorkspaceInvite>(
    slug: string,
    params: ListInvitationsParams & { fields: readonly F[] }
  ): AsyncGenerator<Pick<WorkspaceInvite, F | "id">>;
  iterate(slug: string, params?: ListInvitationsParams): AsyncGenerator<WorkspaceInvite>;
  iterate(slug: string, params?: ListInvitationsParams): AsyncGenerator<WorkspaceInvite> {
    return this.doIterate({ slug }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkspaceInviteField, "all"> & keyof WorkspaceInvite>(
    slug: string,
    invite: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkspaceInvite, F | "id">>;
  retrieve(slug: string, invite: string, params?: WorkspaceInviteFieldsParams): Promise<WorkspaceInvite>;
  retrieve(slug: string, invite: string, params?: WorkspaceInviteFieldsParams): Promise<WorkspaceInvite> {
    return this.doRetrieve({ slug, pk: invite }, params as Record<string, unknown>);
  }

  create(slug: string, data: CreateWorkspaceInvite, params?: WorkspaceInviteFieldsParams): Promise<WorkspaceInvite> {
    return this.doCreate(data, { slug }, params as Record<string, unknown>);
  }

  /** Revoke an invitation. The API rejects revoking one already accepted (400). */
  delete(slug: string, invite: string): Promise<void> {
    return this.doDelete({ slug, pk: invite });
  }

  /**
   * Invite up to 100 emails in one call; emails already invited are skipped server-side.
   *
   * Answers an array rather than one row (the golden's schema shows a single object; the
   * live view returns a list), so it goes through the kernel's custom-action helper at
   * its own `extraPaths` template.
   */
  bulk(
    slug: string,
    data: BulkCreateWorkspaceInvites,
    params?: WorkspaceInviteFieldsParams
  ): Promise<WorkspaceInvite[]> {
    return this.doCustomAction<WorkspaceInvite[]>("bulk", {
      pathParams: { slug },
      data,
      params: params as Record<string, unknown>,
    });
  }
}
