import { Page } from "../../../models/v2/common";
import { ReleaseComment, UpdateReleaseComment, CreateReleaseComment } from "../../../models/v2/ReleaseComment";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";

export type ReleaseCommentField = (typeof FIELDS)["release_comments_list"][number];
export type ReleaseCommentOrderBy = (typeof ORDER_BY)["release_comments_list"][number];

export interface ListReleaseCommentsParams {
  fields?: readonly ReleaseCommentField[];
  is_resolved?: boolean;
  parent_id?: string;
  search?: string;
  order_by?: ReleaseCommentOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=` on a single-row read or write. The golden declares no `?expand=` on this family. */
export interface ReleaseCommentShapeParams {
  fields?: readonly ReleaseCommentField[];
}

/**
 * Comments on a release. No `expand`, `upsert`, or bulk actions.
 *
 * Reached flat — `v2.workspaces.releases.comments.list(slug, release)` — or from a fetched
 * release: `release.comments.list()`.
 */
export class Comments extends V2Resource<ReleaseComment, CreateReleaseComment, UpdateReleaseComment> {
  /** Exported from the v2 barrel as `ReleaseComments`; `exported-names.test.ts` pins the two together. */
  static readonly publicName = "ReleaseComments";

  protected path = "/workspaces/{slug}/releases/{release_id}/comments/";
  protected operations: Record<string, OperationId> = {
    list: "release_comments_list",
    retrieve: "release_comments_retrieve",
    create: "release_comments_create",
    update: "release_comments_partial_update",
    delete: "release_comments_destroy",
  };

  private _at(slug: string, release: string, comment?: string): Record<string, string> {
    const params: Record<string, string> = { slug, release_id: release };
    if (comment !== undefined) params.pk = comment;
    return params;
  }

  /**
   * One page of `ReleaseComment` rows. Use `iterate` to follow pages automatically.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  list<F extends Exclude<ReleaseCommentField, "all"> & keyof ReleaseComment>(
    slug: string,
    release: string,
    params: ListReleaseCommentsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<ReleaseComment, F | "id">>>;
  /** One page of `ReleaseComment` rows. Use `iterate` to follow pages automatically. */
  list(slug: string, release: string, params?: ListReleaseCommentsParams): Promise<Page<ReleaseComment>>;
  list(slug: string, release: string, params?: ListReleaseCommentsParams): Promise<Page<ReleaseComment>> {
    return this.doList(this._at(slug, release), params as Record<string, unknown>);
  }

  /** Every comment, following pages automatically. */
  iterate<F extends Exclude<ReleaseCommentField, "all"> & keyof ReleaseComment>(
    slug: string,
    release: string,
    params: Omit<ListReleaseCommentsParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<Pick<ReleaseComment, F | "id">>;
  /** Every comment, following pages automatically. */
  iterate(
    slug: string,
    release: string,
    params?: Omit<ListReleaseCommentsParams, "offset" | "count">
  ): AsyncGenerator<ReleaseComment>;
  iterate(
    slug: string,
    release: string,
    params?: Omit<ListReleaseCommentsParams, "offset" | "count">
  ): AsyncGenerator<ReleaseComment> {
    return this.doIterate(this._at(slug, release), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<ReleaseCommentField, "all"> & keyof ReleaseComment>(
    slug: string,
    release: string,
    comment: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<ReleaseComment, F | "id">>;
  retrieve(
    slug: string,
    release: string,
    comment: string,
    params?: { fields?: readonly ReleaseCommentField[] }
  ): Promise<ReleaseComment>;
  retrieve(
    slug: string,
    release: string,
    comment: string,
    params?: { fields?: readonly ReleaseCommentField[] }
  ): Promise<ReleaseComment> {
    return this.doRetrieve(this._at(slug, release, comment), params as Record<string, unknown>);
  }

  create<F extends Exclude<ReleaseCommentField, "all"> & keyof ReleaseComment>(
    slug: string,
    release: string,
    data: CreateReleaseComment,
    params: ReleaseCommentShapeParams & { fields: readonly F[] }
  ): Promise<Pick<ReleaseComment, F | "id">>;
  create(
    slug: string,
    release: string,
    data: CreateReleaseComment,
    params?: ReleaseCommentShapeParams
  ): Promise<ReleaseComment>;
  create(
    slug: string,
    release: string,
    data: CreateReleaseComment,
    params?: ReleaseCommentShapeParams
  ): Promise<ReleaseComment> {
    return this.doCreate(data, this._at(slug, release), params as Record<string, unknown>);
  }

  update<F extends Exclude<ReleaseCommentField, "all"> & keyof ReleaseComment>(
    slug: string,
    release: string,
    comment: string,
    data: UpdateReleaseComment,
    params: ReleaseCommentShapeParams & { fields: readonly F[] }
  ): Promise<Pick<ReleaseComment, F | "id">>;
  update(
    slug: string,
    release: string,
    comment: string,
    data: UpdateReleaseComment,
    params?: ReleaseCommentShapeParams
  ): Promise<ReleaseComment>;
  update(
    slug: string,
    release: string,
    comment: string,
    data: UpdateReleaseComment,
    params?: ReleaseCommentShapeParams
  ): Promise<ReleaseComment> {
    return this.doUpdate(data, this._at(slug, release, comment), params as Record<string, unknown>);
  }

  delete(slug: string, release: string, comment: string): Promise<void> {
    return this.doDelete(this._at(slug, release, comment));
  }
}
