import { Page } from "../../../models/v2/common";
import { ReleaseTag, UpdateReleaseTag, CreateReleaseTag } from "../../../models/v2/ReleaseTag";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";

export type ReleaseTagField = (typeof FIELDS)["release_tags_list"][number];
export type ReleaseTagOrderBy = (typeof ORDER_BY)["release_tags_list"][number];

export interface ListReleaseTagsParams {
  fields?: readonly ReleaseTagField[];
  version?: string;
  search?: string;
  order_by?: ReleaseTagOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** Workspace-level release tag definitions at `client.v2.workspace(slug).releases.tags`; a release points at one via `tag_id`. */
export class ReleaseTags extends V2Resource<ReleaseTag, CreateReleaseTag, UpdateReleaseTag> {
  protected path = "/workspaces/{slug}/releases/tags/";
  protected operations: Record<string, OperationId> = {
    list: "release_tags_list",
    retrieve: "release_tags_retrieve",
    create: "release_tags_create",
    update: "release_tags_partial_update",
    delete: "release_tags_destroy",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<ReleaseTagField, "all"> & keyof ReleaseTag>(
    params: ListReleaseTagsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<ReleaseTag, F | "id">>>;
  list(params?: ListReleaseTagsParams): Promise<Page<ReleaseTag>>;
  list(params?: ListReleaseTagsParams): Promise<Page<ReleaseTag>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every release tag definition, following pages automatically. */
  iterate(params?: ListReleaseTagsParams): AsyncGenerator<ReleaseTag> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<ReleaseTagField, "all"> & keyof ReleaseTag>(
    tagId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<ReleaseTag, F | "id">>;
  retrieve(tagId: string, params?: { fields?: readonly ReleaseTagField[] }): Promise<ReleaseTag>;
  retrieve(tagId: string, params?: { fields?: readonly ReleaseTagField[] }): Promise<ReleaseTag> {
    return this.doRetrieve({ pk: tagId }, params as Record<string, unknown>);
  }

  /** The one release tag with this version; throws if none or several match. */
  findByVersion(version: string): Promise<ReleaseTag> {
    return this.doFindOne({ version }, {});
  }

  create(data: CreateReleaseTag, params?: { fields?: readonly ReleaseTagField[] }): Promise<ReleaseTag> {
    return this.doCreate(data, {}, params as Record<string, unknown>);
  }

  update(tagId: string, data: UpdateReleaseTag, params?: { fields?: readonly ReleaseTagField[] }): Promise<ReleaseTag> {
    return this.doUpdate(data, { pk: tagId }, params as Record<string, unknown>);
  }

  delete(tagId: string): Promise<void> {
    return this.doDelete({ pk: tagId });
  }
}
