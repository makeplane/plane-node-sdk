import { Page } from "../../models/v2/common";
import { PermissionScheme } from "../../models/v2/PermissionScheme";
import { FIELDS, ORDER_BY } from "./generated/constants";
import { OperationId, V2Resource } from "./kernel/resource";

export type PermissionSchemeField = (typeof FIELDS)["permission_schemes_list"][number];
export type PermissionSchemeOrderBy = (typeof ORDER_BY)["permission_schemes_list"][number];

export interface ListPermissionSchemesParams {
  fields?: readonly PermissionSchemeField[];
  search?: string;
  order_by?: PermissionSchemeOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** `?fields=` on a single-row read. */
export interface PermissionSchemeFieldsParams {
  fields?: readonly PermissionSchemeField[];
}

/** Workspace permission schemes. Read-only: no create/update/delete. */
export class PermissionSchemes extends V2Resource<PermissionScheme, never, never> {
  protected path = "/workspaces/{slug}/permission-schemes/";
  protected operations: Record<string, OperationId> = {
    list: "permission_schemes_list",
    retrieve: "permission_schemes_retrieve",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<PermissionSchemeField, "all"> & keyof PermissionScheme>(
    slug: string,
    params: ListPermissionSchemesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<PermissionScheme, F | "id">>>;
  list(slug: string, params?: ListPermissionSchemesParams): Promise<Page<PermissionScheme>>;
  list(slug: string, params?: ListPermissionSchemesParams): Promise<Page<PermissionScheme>> {
    return this.doList({ slug }, params as Record<string, unknown>);
  }

  /** Every permission scheme, following pages automatically. */
  iterate(slug: string, params?: ListPermissionSchemesParams): AsyncGenerator<PermissionScheme> {
    return this.doIterate({ slug }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<PermissionSchemeField, "all"> & keyof PermissionScheme>(
    slug: string,
    scheme: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<PermissionScheme, F | "id">>;
  retrieve(slug: string, scheme: string, params?: PermissionSchemeFieldsParams): Promise<PermissionScheme>;
  retrieve(slug: string, scheme: string, params?: PermissionSchemeFieldsParams): Promise<PermissionScheme> {
    return this.doRetrieve({ slug, pk: scheme }, params as Record<string, unknown>);
  }
}
