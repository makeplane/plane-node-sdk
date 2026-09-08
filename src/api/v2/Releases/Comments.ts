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
  count?: boolean;
}

/** `?fields=` on a single-row read or write. The golden declares no `?expand=` on this family. */
export interface ReleaseCommentShapeParams {
  fields?: readonly ReleaseCommentField[];
}

/** Comments on a release, at `client.v2.workspace(slug).releases.comments`. No `expand`, `upsert`, or bulk actions. */
export class Comments extends V2Resource<ReleaseComment, CreateReleaseComment, UpdateReleaseComment> {
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

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<ReleaseCommentField, "all"> & keyof ReleaseComment>(
    slug: string,
    release: string,
    params: ListReleaseCommentsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<ReleaseComment, F | "id">>>;
  list(slug: string, release: string, params?: ListReleaseCommentsParams): Promise<Page<ReleaseComment>>;
  list(slug: string, release: string, params?: ListReleaseCommentsParams): Promise<Page<ReleaseComment>> {
    return this.doList(this._at(slug, release), params as Record<string, unknown>);
  }

  /** Every comment, following pages automatically. */
  iterate<F extends Exclude<ReleaseCommentField, "all"> & keyof ReleaseComment>(
    slug: string,
    release: string,
    params: ListReleaseCommentsParams & { fields: readonly F[] }
  ): AsyncGenerator<Pick<ReleaseComment, F | "id">>;
  iterate(slug: string, release: string, params?: ListReleaseCommentsParams): AsyncGenerator<ReleaseComment>;
  iterate(slug: string, release: string, params?: ListReleaseCommentsParams): AsyncGenerator<ReleaseComment> {
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

  create(
    slug: string,
    release: string,
    data: CreateReleaseComment,
    params?: ReleaseCommentShapeParams
  ): Promise<ReleaseComment> {
    return this.doCreate(data, this._at(slug, release), params as Record<string, unknown>);
  }

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
