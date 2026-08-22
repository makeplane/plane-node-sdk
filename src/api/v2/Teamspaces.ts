import { Page } from "../../models/v2/common";
import { Teamspace, UpdateTeamspace, CreateTeamspace } from "../../models/v2/Teamspace";
import { EXPAND, FIELDS, ORDER_BY } from "./generated/constants";
import { OperationId, V2Resource } from "./kernel/resource";

export type TeamspaceField = (typeof FIELDS)["teamspaces_list"][number];
export type TeamspaceOrderBy = (typeof ORDER_BY)["teamspaces_list"][number];
/** `teamspaces_list`'s only expand target — the teamspace's lead as a full member object instead of `lead_id`. */
export type TeamspaceExpand = (typeof EXPAND)["teamspaces_list"][number];

export interface ListTeamspacesParams {
  fields?: readonly TeamspaceField[];
  expand?: readonly TeamspaceExpand[];
  name?: string;
  lead_id?: string;
  search?: string;
  order_by?: TeamspaceOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** Teamspaces — named groups of members and projects — at `client.v2.workspace(slug).teamspaces`. */
export class Teamspaces extends V2Resource<Teamspace, CreateTeamspace, UpdateTeamspace> {
  protected path = "/workspaces/{slug}/teamspaces/";
  protected operations: Record<string, OperationId> = {
    list: "teamspaces_list",
    retrieve: "teamspaces_retrieve",
    create: "teamspaces_create",
    update: "teamspaces_partial_update",
    delete: "teamspaces_destroy",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<TeamspaceField, "all"> & keyof Teamspace>(
    params: ListTeamspacesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<Teamspace, F | "id">>>;
  list(params?: ListTeamspacesParams): Promise<Page<Teamspace>>;
  list(params?: ListTeamspacesParams): Promise<Page<Teamspace>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every teamspace, following pages automatically. */
  iterate(params?: ListTeamspacesParams): AsyncGenerator<Teamspace> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<TeamspaceField, "all"> & keyof Teamspace>(
    teamspaceId: string,
    params: { fields: readonly F[]; expand?: readonly TeamspaceExpand[] }
  ): Promise<Pick<Teamspace, F | "id">>;
  retrieve(
    teamspaceId: string,
    params?: { fields?: readonly TeamspaceField[]; expand?: readonly TeamspaceExpand[] }
  ): Promise<Teamspace>;
  retrieve(
    teamspaceId: string,
    params?: { fields?: readonly TeamspaceField[]; expand?: readonly TeamspaceExpand[] }
  ): Promise<Teamspace> {
    return this.doRetrieve({ pk: teamspaceId }, params as Record<string, unknown>);
  }

  /** The one teamspace with this name; throws if none or several match. */
  findByName(name: string): Promise<Teamspace> {
    return this.doFindOne({ name }, {});
  }

  create(data: CreateTeamspace, params?: { expand?: readonly TeamspaceExpand[] }): Promise<Teamspace> {
    return this.doCreate(data, {}, params as Record<string, unknown>);
  }

  update(
    teamspaceId: string,
    data: UpdateTeamspace,
    params?: { expand?: readonly TeamspaceExpand[] }
  ): Promise<Teamspace> {
    return this.doUpdate(data, { pk: teamspaceId }, params as Record<string, unknown>);
  }

  delete(teamspaceId: string): Promise<void> {
    return this.doDelete({ pk: teamspaceId });
  }
}
