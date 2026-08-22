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

/** Workspace-scoped permission schemes at `client.v2.workspace(slug).permissionSchemes`; read-only, no create/update/delete. */
export class PermissionSchemes extends V2Resource<PermissionScheme, never, never> {
  protected path = "/workspaces/{slug}/permission-schemes/";
  protected operations: Record<string, OperationId> = {
    list: "permission_schemes_list",
    retrieve: "permission_schemes_retrieve",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<PermissionSchemeField, "all"> & keyof PermissionScheme>(
    params: ListPermissionSchemesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<PermissionScheme, F | "id">>>;
  list(params?: ListPermissionSchemesParams): Promise<Page<PermissionScheme>>;
  list(params?: ListPermissionSchemesParams): Promise<Page<PermissionScheme>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every permission scheme, following pages automatically. */
  iterate(params?: ListPermissionSchemesParams): AsyncGenerator<PermissionScheme> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<PermissionSchemeField, "all"> & keyof PermissionScheme>(
    schemeId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<PermissionScheme, F | "id">>;
  retrieve(schemeId: string, params?: { fields?: readonly PermissionSchemeField[] }): Promise<PermissionScheme>;
  retrieve(schemeId: string, params?: { fields?: readonly PermissionSchemeField[] }): Promise<PermissionScheme> {
    return this.doRetrieve({ pk: schemeId }, params as Record<string, unknown>);
  }
}
