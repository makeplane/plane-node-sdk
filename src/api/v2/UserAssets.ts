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
  count?: boolean;
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

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<UserAssetField, "all"> & keyof UserAsset>(
    params: ListUserAssetsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<UserAsset, F | "id">>>;
  list(params?: ListUserAssetsParams): Promise<Page<UserAsset>>;
  list(params?: ListUserAssetsParams): Promise<Page<UserAsset>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every uploaded asset, following pages automatically. */
  iterate(params?: ListUserAssetsParams): AsyncGenerator<UserAsset> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<UserAssetField, "all"> & keyof UserAsset>(
    assetId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<UserAsset, F | "id">>;
  retrieve(assetId: string, params?: { fields?: readonly UserAssetField[] }): Promise<UserAsset>;
  retrieve(assetId: string, params?: { fields?: readonly UserAssetField[] }): Promise<UserAsset> {
    return this.doRetrieve({ pk: assetId }, params as Record<string, unknown>);
  }

  /** Step 1: get upload credentials. Follow up with `update(...)` once the bytes land. */
  create(data: UserAssetUploadRequest, params?: { fields?: readonly UserAssetField[] }): Promise<UserAsset> {
    return this.doCreate(data, {}, params as Record<string, unknown>);
  }

  /** Step 2: confirm the upload. Takes no body — see {@link UserAssetConfirmRequest}. */
  update(assetId: string, params?: { fields?: readonly UserAssetField[] }): Promise<UserAsset> {
    return this.doUpdate({}, { pk: assetId }, params as Record<string, unknown>);
  }

  delete(assetId: string): Promise<void> {
    return this.doDelete({ pk: assetId });
  }
}
