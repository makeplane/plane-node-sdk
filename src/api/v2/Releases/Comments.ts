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

  private pk(releaseId: string, id?: string): Record<string, string> {
    const params: Record<string, string> = { release_id: releaseId };
    if (id !== undefined) params.pk = id;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<ReleaseCommentField, "all"> & keyof ReleaseComment>(
    releaseId: string,
    params: ListReleaseCommentsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<ReleaseComment, F | "id">>>;
  list(releaseId: string, params?: ListReleaseCommentsParams): Promise<Page<ReleaseComment>>;
  list(releaseId: string, params?: ListReleaseCommentsParams): Promise<Page<ReleaseComment>> {
    return this.doList(this.pk(releaseId), params as Record<string, unknown>);
  }

  /** Every comment, following pages automatically. */
  iterate(releaseId: string, params?: ListReleaseCommentsParams): AsyncGenerator<ReleaseComment> {
    return this.doIterate(this.pk(releaseId), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<ReleaseCommentField, "all"> & keyof ReleaseComment>(
    releaseId: string,
    commentId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<ReleaseComment, F | "id">>;
  retrieve(
    releaseId: string,
    commentId: string,
    params?: { fields?: readonly ReleaseCommentField[] }
  ): Promise<ReleaseComment>;
  retrieve(
    releaseId: string,
    commentId: string,
    params?: { fields?: readonly ReleaseCommentField[] }
  ): Promise<ReleaseComment> {
    return this.doRetrieve(this.pk(releaseId, commentId), params as Record<string, unknown>);
  }

  create(releaseId: string, data: CreateReleaseComment): Promise<ReleaseComment> {
    return this.doCreate(data, this.pk(releaseId));
  }

  update(releaseId: string, commentId: string, data: UpdateReleaseComment): Promise<ReleaseComment> {
    return this.doUpdate(data, this.pk(releaseId, commentId));
  }

  delete(releaseId: string, commentId: string): Promise<void> {
    return this.doDelete(this.pk(releaseId, commentId));
  }
}
