import { Page } from "../../models/v2/common";
import { UserAsset, UserAssetConfirmRequest, UserAssetUploadRequest } from "../../models/v2/UserAsset";
import { FIELDS, ORDER_BY } from "./generated/constants";
import { OperationId, V2Resource } from "./kernel/resource";

export type UserAssetField = (typeof FIELDS)["user_assets_list"][number];
export type UserAssetOrderBy = (typeof ORDER_BY)["user_assets_list"][number];

export interface ListUserAssetsParams {
  fields?: readonly UserAssetField[];
  order_by?: UserAssetOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=` on a single-row read or write. */
export interface UserAssetFieldsParams {
  fields?: readonly UserAssetField[];
}

/**
 * Personal avatar/cover assets (not workspace-scoped); two-step S3 upload via `create`+`update`.
 */
export class UserAssets extends V2Resource<UserAsset, UserAssetUploadRequest, UserAssetConfirmRequest> {
  protected path = "/users/me/assets/";
  protected operations: Record<string, OperationId> = {
    list: "user_assets_list",
    retrieve: "user_assets_retrieve",
    create: "user_assets_create",
    update: "user_assets_partial_update",
    delete: "user_assets_destroy",
  };

  /**
   * One page of `UserAsset` rows. Use `iterate` to follow pages automatically.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  list<F extends Exclude<UserAssetField, "all"> & keyof UserAsset>(
    params: ListUserAssetsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<UserAsset, F | "id">>>;
  /** One page of `UserAsset` rows. Use `iterate` to follow pages automatically. */
  list(params?: ListUserAssetsParams): Promise<Page<UserAsset>>;
  list(params?: ListUserAssetsParams): Promise<Page<UserAsset>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every uploaded asset, following pages automatically. */
  iterate<F extends Exclude<UserAssetField, "all"> & keyof UserAsset>(
    params: Omit<ListUserAssetsParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<Pick<UserAsset, F | "id">>;
  /** Every uploaded asset, following pages automatically. */
  iterate(params?: Omit<ListUserAssetsParams, "offset" | "count">): AsyncGenerator<UserAsset>;
  iterate(params?: Omit<ListUserAssetsParams, "offset" | "count">): AsyncGenerator<UserAsset> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<UserAssetField, "all"> & keyof UserAsset>(
    asset: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<UserAsset, F | "id">>;
  retrieve(asset: string, params?: UserAssetFieldsParams): Promise<UserAsset>;
  retrieve(asset: string, params?: UserAssetFieldsParams): Promise<UserAsset> {
    return this.doRetrieve({ pk: asset }, params as Record<string, unknown>);
  }

  /**
   * Step 1: get upload credentials. Follow up with `update(...)` once the bytes land.
   *
   * The user-scoped twin of `Assets.create`, and offers no `fields` for the same reason:
   * the presigned upload data is in this reply only and cannot be re-fetched. Named in
   * `ONE_TIME_RESPONSES` in `tests/unit/v2/fields-coverage.test.ts`.
   */
  create(data: UserAssetUploadRequest): Promise<UserAsset> {
    return this.doCreate(data, {});
  }

  /** Step 2: confirm the upload. Takes no body — see {@link UserAssetConfirmRequest}. */
  update<F extends Exclude<UserAssetField, "all"> & keyof UserAsset>(
    asset: string,
    params: UserAssetFieldsParams & { fields: readonly F[] }
  ): Promise<Pick<UserAsset, F | "id">>;
  /** Step 2: confirm the upload. Takes no body — see {@link UserAssetConfirmRequest}. */
  update(asset: string, params?: UserAssetFieldsParams): Promise<UserAsset>;
  update(asset: string, params?: UserAssetFieldsParams): Promise<UserAsset> {
    return this.doUpdate({}, { pk: asset }, params as Record<string, unknown>);
  }

  delete(asset: string): Promise<void> {
    return this.doDelete({ pk: asset });
  }
}
