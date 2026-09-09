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
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** Workspace-level release tag definitions at `v2.workspaces.releaseTags`.

 * Deliberately **not** a child of `Releases`: every route here takes the workspace slug
 * alone, and a release merely points at a tag through its own `tag_id`, so there is nothing
 * per-release for a fetched row to bind. See `ReleaseNavigation` for the whole reasoning; a release points at one via `tag_id`. */
export class ReleaseTags extends V2Resource<ReleaseTag, CreateReleaseTag, UpdateReleaseTag> {
  protected path = "/workspaces/{slug}/releases/tags/";
  protected operations: Record<string, OperationId> = {
    list: "release_tags_list",
    retrieve: "release_tags_retrieve",
    create: "release_tags_create",
    update: "release_tags_partial_update",
    delete: "release_tags_destroy",
  };

  /**
   * One page of `ReleaseTag` rows. Use `iterate` to follow pages automatically.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  list<F extends Exclude<ReleaseTagField, "all"> & keyof ReleaseTag>(
    slug: string,
    params: ListReleaseTagsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<ReleaseTag, F | "id">>>;
  /** One page of `ReleaseTag` rows. Use `iterate` to follow pages automatically. */
  list(slug: string, params?: ListReleaseTagsParams): Promise<Page<ReleaseTag>>;
  list(slug: string, params?: ListReleaseTagsParams): Promise<Page<ReleaseTag>> {
    return this.doList({ slug }, params as Record<string, unknown>);
  }

  /** Every release tag definition, following pages automatically. */
  iterate<F extends Exclude<ReleaseTagField, "all"> & keyof ReleaseTag>(
    slug: string,
    params: Omit<ListReleaseTagsParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<Pick<ReleaseTag, F | "id">>;
  /** Every release tag definition, following pages automatically. */
  iterate(slug: string, params?: Omit<ListReleaseTagsParams, "offset" | "count">): AsyncGenerator<ReleaseTag>;
  iterate(slug: string, params?: Omit<ListReleaseTagsParams, "offset" | "count">): AsyncGenerator<ReleaseTag> {
    return this.doIterate({ slug }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<ReleaseTagField, "all"> & keyof ReleaseTag>(
    slug: string,
    tag: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<ReleaseTag, F | "id">>;
  retrieve(slug: string, tag: string, params?: { fields?: readonly ReleaseTagField[] }): Promise<ReleaseTag>;
  retrieve(slug: string, tag: string, params?: { fields?: readonly ReleaseTagField[] }): Promise<ReleaseTag> {
    return this.doRetrieve({ slug, pk: tag }, params as Record<string, unknown>);
  }

  /** The one release tag with this version; throws if none or several match. */
  findByVersion(slug: string, version: string): Promise<ReleaseTag> {
    return this.doFindOne({ version }, { slug });
  }

  create<F extends Exclude<ReleaseTagField, "all"> & keyof ReleaseTag>(
    slug: string,
    data: CreateReleaseTag,
    params: { fields: readonly F[] }
  ): Promise<Pick<ReleaseTag, F | "id">>;
  create(slug: string, data: CreateReleaseTag, params?: { fields?: readonly ReleaseTagField[] }): Promise<ReleaseTag>;
  create(slug: string, data: CreateReleaseTag, params?: { fields?: readonly ReleaseTagField[] }): Promise<ReleaseTag> {
    return this.doCreate(data, { slug }, params as Record<string, unknown>);
  }

  update<F extends Exclude<ReleaseTagField, "all"> & keyof ReleaseTag>(
    slug: string,
    tag: string,
    data: UpdateReleaseTag,
    params: { fields: readonly F[] }
  ): Promise<Pick<ReleaseTag, F | "id">>;
  update(
    slug: string,
    tag: string,
    data: UpdateReleaseTag,
    params?: { fields?: readonly ReleaseTagField[] }
  ): Promise<ReleaseTag>;
  update(
    slug: string,
    tag: string,
    data: UpdateReleaseTag,
    params?: { fields?: readonly ReleaseTagField[] }
  ): Promise<ReleaseTag> {
    return this.doUpdate(data, { slug, pk: tag }, params as Record<string, unknown>);
  }

  delete(slug: string, tag: string): Promise<void> {
    return this.doDelete({ slug, pk: tag });
  }
}
