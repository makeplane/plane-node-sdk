import { Page } from "../../models/v2/common";
import {
  CreatePermissionScheme,
  PermissionScheme,
  PermissionSchemeImpact,
  UpdatePermissionScheme,
} from "../../models/v2/PermissionScheme";
import { FIELDS, ORDER_BY } from "./generated/constants";
import { AnyOperationId, V2Resource } from "./kernel/resource";

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
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=` on a single-row read. */
export interface PermissionSchemeFieldsParams {
  fields?: readonly PermissionSchemeField[];
}

/** Workspace permission schemes. Read-only: no create/update/delete. */
export class PermissionSchemes extends V2Resource<PermissionScheme, CreatePermissionScheme, UpdatePermissionScheme> {
  protected path = "/workspaces/{slug}/permission-schemes/";
  protected operations: Record<string, AnyOperationId> = {
    list: "permission_schemes_list",
    retrieve: "permission_schemes_retrieve",
    create: "permission_schemes_create",
    update: "permission_schemes_partial_update",
    delete: "permission_schemes_destroy",
    impact: "permission_schemes_impact",
  };

  /**
   * One page of `PermissionScheme` rows. Use `iterate` to follow pages automatically.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  list<F extends Exclude<PermissionSchemeField, "all"> & keyof PermissionScheme>(
    slug: string,
    params: ListPermissionSchemesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<PermissionScheme, F | "id">>>;
  /** One page of `PermissionScheme` rows. Use `iterate` to follow pages automatically. */
  list(slug: string, params?: ListPermissionSchemesParams): Promise<Page<PermissionScheme>>;
  list(slug: string, params?: ListPermissionSchemesParams): Promise<Page<PermissionScheme>> {
    return this.doList({ slug }, params as Record<string, unknown>);
  }

  /** Every permission scheme, following pages automatically. */
  iterate<F extends Exclude<PermissionSchemeField, "all"> & keyof PermissionScheme>(
    slug: string,
    params: Omit<ListPermissionSchemesParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<Pick<PermissionScheme, F | "id">>;
  /** Every permission scheme, following pages automatically. */
  iterate(
    slug: string,
    params?: Omit<ListPermissionSchemesParams, "offset" | "count">
  ): AsyncGenerator<PermissionScheme>;
  iterate(
    slug: string,
    params?: Omit<ListPermissionSchemesParams, "offset" | "count">
  ): AsyncGenerator<PermissionScheme> {
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

  create<F extends Exclude<PermissionSchemeField, "all"> & keyof PermissionScheme>(
    slug: string,
    data: CreatePermissionScheme,
    params: PermissionSchemeFieldsParams & { fields: readonly F[] }
  ): Promise<Pick<PermissionScheme, F | "id">>;
  /** Create a custom scheme; the stored `permissions` include what the given ones need. */
  create(slug: string, data: CreatePermissionScheme, params?: PermissionSchemeFieldsParams): Promise<PermissionScheme>;
  create(slug: string, data: CreatePermissionScheme, params?: PermissionSchemeFieldsParams): Promise<PermissionScheme> {
    return this.doCreate(data, { slug }, params as Record<string, unknown>);
  }

  update<F extends Exclude<PermissionSchemeField, "all"> & keyof PermissionScheme>(
    slug: string,
    scheme: string,
    data: UpdatePermissionScheme,
    params: PermissionSchemeFieldsParams & { fields: readonly F[] }
  ): Promise<Pick<PermissionScheme, F | "id">>;
  update(
    slug: string,
    scheme: string,
    data: UpdatePermissionScheme,
    params?: PermissionSchemeFieldsParams
  ): Promise<PermissionScheme>;
  update(
    slug: string,
    scheme: string,
    data: UpdatePermissionScheme,
    params?: PermissionSchemeFieldsParams
  ): Promise<PermissionScheme> {
    return this.doUpdate(data, { slug, pk: scheme }, params as Record<string, unknown>);
  }

  /** Refused (409) while a role composes the scheme. */
  delete(slug: string, scheme: string): Promise<void> {
    return this.doDelete({ slug, pk: scheme });
  }

  /** The roles, people and projects a change to this scheme reaches. */
  impact(slug: string, scheme: string): Promise<PermissionSchemeImpact> {
    return this.doCustomAction<PermissionSchemeImpact>("impact", { method: "GET", pathParams: { slug }, pk: scheme });
  }
}
