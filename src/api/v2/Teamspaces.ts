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

/** `?fields=`/`?expand=` on a single-row read or write. */
export interface TeamspaceShapeParams {
  fields?: readonly TeamspaceField[];
  expand?: readonly TeamspaceExpand[];
}

/** Teamspaces — named groups of members and projects. */
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
    slug: string,
    params: ListTeamspacesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<Teamspace, F | "id">>>;
  list(slug: string, params?: ListTeamspacesParams): Promise<Page<Teamspace>>;
  list(slug: string, params?: ListTeamspacesParams): Promise<Page<Teamspace>> {
    return this.doList({ slug }, params as Record<string, unknown>);
  }

  /** Every teamspace, following pages automatically. */
  iterate(slug: string, params?: ListTeamspacesParams): AsyncGenerator<Teamspace> {
    return this.doIterate({ slug }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<TeamspaceField, "all"> & keyof Teamspace>(
    slug: string,
    teamspace: string,
    params: { fields: readonly F[]; expand?: readonly TeamspaceExpand[] }
  ): Promise<Pick<Teamspace, F | "id">>;
  retrieve(slug: string, teamspace: string, params?: TeamspaceShapeParams): Promise<Teamspace>;
  retrieve(slug: string, teamspace: string, params?: TeamspaceShapeParams): Promise<Teamspace> {
    return this.doRetrieve({ slug, pk: teamspace }, params as Record<string, unknown>);
  }

  /** The one teamspace with this name; throws if none or several match. */
  findByName(slug: string, name: string): Promise<Teamspace> {
    return this.doFindOne({ name }, { slug });
  }

  create(slug: string, data: CreateTeamspace, params?: TeamspaceShapeParams): Promise<Teamspace> {
    return this.doCreate(data, { slug }, params as Record<string, unknown>);
  }

  update(slug: string, teamspace: string, data: UpdateTeamspace, params?: TeamspaceShapeParams): Promise<Teamspace> {
    return this.doUpdate(data, { slug, pk: teamspace }, params as Record<string, unknown>);
  }

  delete(slug: string, teamspace: string): Promise<void> {
    return this.doDelete({ slug, pk: teamspace });
  }
}
