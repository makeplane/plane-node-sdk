import { MultipleMatchesFoundError, NoMatchFoundError } from "../../errors/PlaneApiError";
import { Page } from "../../models/v2/common";
import { Role, RoleNamespace } from "../../models/v2/Role";
import { FIELDS, ORDER_BY } from "./generated/constants";
import { OperationId, V2Resource } from "./kernel/resource";

export type RoleField = (typeof FIELDS)["roles_list"][number];
export type RoleOrderBy = (typeof ORDER_BY)["roles_list"][number];

export interface ListRolesParams {
  fields?: readonly RoleField[];
  is_system?: boolean;
  namespace?: RoleNamespace;
  /** Filter by the role's own `slug` field (e.g. `"admin"`) — distinct from the workspace slug in the path. */
  slug?: string;
  search?: string;
  order_by?: RoleOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** Permission roles at `client.v2.workspace(slug).roles`. Read-only: no create/update/delete/upsert. */
export class Roles extends V2Resource<Role, never, never> {
  protected path = "/workspaces/{slug}/roles/";
  protected operations: Record<string, OperationId> = {
    list: "roles_list",
    retrieve: "roles_retrieve",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<RoleField, "all"> & keyof Role>(
    params: ListRolesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<Role, F | "id">>>;
  list(params?: ListRolesParams): Promise<Page<Role>>;
  list(params?: ListRolesParams): Promise<Page<Role>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every role, following pages automatically. */
  iterate(params?: ListRolesParams): AsyncGenerator<Role> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<RoleField, "all"> & keyof Role>(
    roleId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<Role, F | "id">>;
  retrieve(roleId: string, params?: { fields?: readonly RoleField[] }): Promise<Role>;
  retrieve(roleId: string, params?: { fields?: readonly RoleField[] }): Promise<Role> {
    return this.doRetrieve({ pk: roleId }, params as Record<string, unknown>);
  }

  /** The one role with this name; throws if none/several match. Names are unique only *within* a `namespace`, not workspace-wide. */
  async findByName(name: string, params?: { namespace?: RoleNamespace }): Promise<Role> {
    const matches: Role[] = [];
    for await (const row of this.iterate(params?.namespace ? { namespace: params.namespace } : undefined)) {
      if (row.name === name) matches.push(row);
    }
    if (matches.length === 0) {
      throw new NoMatchFoundError(`No ${this.constructor.name} matched name=${JSON.stringify(name)}.`);
    }
    if (matches.length > 1) {
      throw new MultipleMatchesFoundError(
        `Multiple rows matched name=${JSON.stringify(name)}; use the id instead, or list to see every match.`
      );
    }
    return matches[0];
  }
}
