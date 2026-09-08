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
  /**
   * The golden's own `?slug=` filter — the *role's* slug (e.g. `"admin"`).
   *
   * Spelled `roleSlug` here, and only here, because the leading path id on every method
   * of this class is also `slug` and means the workspace. Leaving it as `slug` would put
   * two different things called `slug` in one call; suppressing it would make a filter
   * the API really offers unreachable. `list` maps it back onto the `slug` query key.
   */
  roleSlug?: string;
  search?: string;
  order_by?: RoleOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=` on a single-row read. */
export interface RoleFieldsParams {
  fields?: readonly RoleField[];
}

/** `{ roleSlug: "admin" }` -> `{ slug: "admin" }`: the query key the golden declares. */
function withRoleSlug(params?: ListRolesParams): Record<string, unknown> | undefined {
  if (params === undefined) return undefined;
  const { roleSlug, ...rest } = params;
  return roleSlug === undefined ? { ...rest } : { ...rest, slug: roleSlug };
}

/** Workspace roles — system and custom. Read-only: no create/update/delete/upsert (full role CRUD lives only in the app UI). */
export class Roles extends V2Resource<Role, never, never> {
  protected path = "/workspaces/{slug}/roles/";
  protected operations: Record<string, OperationId> = {
    list: "roles_list",
    retrieve: "roles_retrieve",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<RoleField, "all"> & keyof Role>(
    slug: string,
    params: ListRolesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<Role, F | "id">>>;
  list(slug: string, params?: ListRolesParams): Promise<Page<Role>>;
  list(slug: string, params?: ListRolesParams): Promise<Page<Role>> {
    return this.doList({ slug }, withRoleSlug(params));
  }

  /** Every role, following pages automatically. */
  iterate<F extends Exclude<RoleField, "all"> & keyof Role>(
    slug: string,
    params: Omit<ListRolesParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<Pick<Role, F | "id">>;
  iterate(slug: string, params?: Omit<ListRolesParams, "offset" | "count">): AsyncGenerator<Role>;
  iterate(slug: string, params?: Omit<ListRolesParams, "offset" | "count">): AsyncGenerator<Role> {
    return this.doIterate({ slug }, withRoleSlug(params));
  }

  retrieve<F extends Exclude<RoleField, "all"> & keyof Role>(
    slug: string,
    role: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<Role, F | "id">>;
  retrieve(slug: string, role: string, params?: RoleFieldsParams): Promise<Role>;
  retrieve(slug: string, role: string, params?: RoleFieldsParams): Promise<Role> {
    return this.doRetrieve({ slug, pk: role }, params as Record<string, unknown>);
  }

  /**
   * The one role with this name; throws if none or several match.
   *
   * Filters client-side: `roles_list` declares no `?name=`, so there is no server-side
   * way to ask. Names are unique only *within* a `namespace`, not workspace-wide.
   */
  async findByName(slug: string, name: string, params?: { namespace?: RoleNamespace }): Promise<Role> {
    const matches: Role[] = [];
    for await (const row of this.iterate(slug, params?.namespace ? { namespace: params.namespace } : undefined)) {
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

  /**
   * The one role with this slug, server-side via `?slug=` — one request, not a scan.
   *
   * `slug` is the workspace; `roleSlug` is the role (e.g. `"admin"`). Slugs are unique
   * only within a namespace, so pass `namespace` or expect `MultipleMatchesFoundError`.
   */
  findBySlug(slug: string, roleSlug: string, params?: { namespace?: RoleNamespace }): Promise<Role> {
    return this.doFindOne(params?.namespace ? { slug: roleSlug, namespace: params.namespace } : { slug: roleSlug }, {
      slug,
    });
  }
}
