import { Page } from "../../models/v2/common";
import {
  WorkspaceAsset,
  WorkspaceAssetConfirmRequest,
  WorkspaceAssetUploadRequest,
} from "../../models/v2/WorkspaceAsset";
import { FIELDS, ORDER_BY } from "./generated/constants";
import { OperationId, V2Resource } from "./kernel/resource";

export type WorkspaceAssetField = (typeof FIELDS)["assets_list"][number];
export type WorkspaceAssetOrderBy = (typeof ORDER_BY)["assets_list"][number];

export interface ListWorkspaceAssetsParams {
  fields?: readonly WorkspaceAssetField[];
  order_by?: WorkspaceAssetOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** Workspace file assets — two-step upload: `create` returns S3 credentials, `update` (empty PATCH) confirms. `list` only shows uploaded assets. */
export class Assets extends V2Resource<WorkspaceAsset, WorkspaceAssetUploadRequest, WorkspaceAssetConfirmRequest> {
  protected path = "/workspaces/{slug}/assets/";
  protected operations: Record<string, OperationId> = {
    list: "assets_list",
    retrieve: "assets_retrieve",
    create: "assets_create",
    update: "assets_partial_update",
    delete: "assets_destroy",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkspaceAssetField, "all"> & keyof WorkspaceAsset>(
    params: ListWorkspaceAssetsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkspaceAsset, F | "id">>>;
  list(params?: ListWorkspaceAssetsParams): Promise<Page<WorkspaceAsset>>;
  list(params?: ListWorkspaceAssetsParams): Promise<Page<WorkspaceAsset>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every uploaded asset, following pages automatically. */
  iterate(params?: ListWorkspaceAssetsParams): AsyncGenerator<WorkspaceAsset> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkspaceAssetField, "all"> & keyof WorkspaceAsset>(
    assetId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkspaceAsset, F | "id">>;
  retrieve(assetId: string, params?: { fields?: readonly WorkspaceAssetField[] }): Promise<WorkspaceAsset>;
  retrieve(assetId: string, params?: { fields?: readonly WorkspaceAssetField[] }): Promise<WorkspaceAsset> {
    return this.doRetrieve({ pk: assetId }, params as Record<string, unknown>);
  }

  /** Step 1: get upload credentials. Follow up with `update(...)` once the bytes land. */
  create(
    data: WorkspaceAssetUploadRequest,
    params?: { fields?: readonly WorkspaceAssetField[] }
  ): Promise<WorkspaceAsset> {
    return this.doCreate(data, {}, params as Record<string, unknown>);
  }

  /** Step 2: confirm the upload. Takes no body — see {@link WorkspaceAssetConfirmRequest}. */
  update(assetId: string, params?: { fields?: readonly WorkspaceAssetField[] }): Promise<WorkspaceAsset> {
    return this.doUpdate({}, { pk: assetId }, params as Record<string, unknown>);
  }

  delete(assetId: string): Promise<void> {
    return this.doDelete({ pk: assetId });
  }
}
