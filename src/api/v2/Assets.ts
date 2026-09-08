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

/** `?fields=` on a single-row read or write. */
export interface WorkspaceAssetFieldsParams {
  fields?: readonly WorkspaceAssetField[];
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
    slug: string,
    params: ListWorkspaceAssetsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkspaceAsset, F | "id">>>;
  list(slug: string, params?: ListWorkspaceAssetsParams): Promise<Page<WorkspaceAsset>>;
  list(slug: string, params?: ListWorkspaceAssetsParams): Promise<Page<WorkspaceAsset>> {
    return this.doList({ slug }, params as Record<string, unknown>);
  }

  /** Every uploaded asset, following pages automatically. */
  iterate<F extends Exclude<WorkspaceAssetField, "all"> & keyof WorkspaceAsset>(
    slug: string,
    params: ListWorkspaceAssetsParams & { fields: readonly F[] }
  ): AsyncGenerator<Pick<WorkspaceAsset, F | "id">>;
  iterate(slug: string, params?: ListWorkspaceAssetsParams): AsyncGenerator<WorkspaceAsset>;
  iterate(slug: string, params?: ListWorkspaceAssetsParams): AsyncGenerator<WorkspaceAsset> {
    return this.doIterate({ slug }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkspaceAssetField, "all"> & keyof WorkspaceAsset>(
    slug: string,
    asset: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkspaceAsset, F | "id">>;
  retrieve(slug: string, asset: string, params?: WorkspaceAssetFieldsParams): Promise<WorkspaceAsset>;
  retrieve(slug: string, asset: string, params?: WorkspaceAssetFieldsParams): Promise<WorkspaceAsset> {
    return this.doRetrieve({ slug, pk: asset }, params as Record<string, unknown>);
  }

  /**
   * Step 1: get upload credentials. Follow up with `update(...)` once the bytes land.
   *
   * Deliberately offers no `fields`, though `assets_create` declares it: the presigned
   * upload data exists only in this one reply and cannot be re-fetched, so a projection
   * could silently strand the caller mid-upload. Named in `ONE_TIME_RESPONSES` in
   * `tests/unit/v2/fields-coverage.test.ts`.
   */
  create(slug: string, data: WorkspaceAssetUploadRequest): Promise<WorkspaceAsset> {
    return this.doCreate(data, { slug });
  }

  /** Step 2: confirm the upload. Takes no body — see {@link WorkspaceAssetConfirmRequest}. */
  update<F extends Exclude<WorkspaceAssetField, "all"> & keyof WorkspaceAsset>(
    slug: string,
    asset: string,
    params: WorkspaceAssetFieldsParams & { fields: readonly F[] }
  ): Promise<Pick<WorkspaceAsset, F | "id">>;
  update(slug: string, asset: string, params?: WorkspaceAssetFieldsParams): Promise<WorkspaceAsset>;
  update(slug: string, asset: string, params?: WorkspaceAssetFieldsParams): Promise<WorkspaceAsset> {
    return this.doUpdate({}, { slug, pk: asset }, params as Record<string, unknown>);
  }

  delete(slug: string, asset: string): Promise<void> {
    return this.doDelete({ slug, pk: asset });
  }
}
