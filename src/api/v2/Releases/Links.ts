import { Page } from "../../../models/v2/common";
import { ReleaseLink, UpdateReleaseLink, CreateReleaseLink } from "../../../models/v2/ReleaseLink";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";

export type ReleaseLinkField = (typeof FIELDS)["release_links_list"][number];
export type ReleaseLinkOrderBy = (typeof ORDER_BY)["release_links_list"][number];

export interface ListReleaseLinksParams {
  fields?: readonly ReleaseLinkField[];
  search?: string;
  order_by?: ReleaseLinkOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** `?fields=` on a single-row read or write. The golden declares no `?expand=` on this family. */
export interface ReleaseLinkShapeParams {
  fields?: readonly ReleaseLinkField[];
}

/** Links attached to a release, at `client.v2.workspace(slug).releases.links`. */
export class Links extends V2Resource<ReleaseLink, CreateReleaseLink, UpdateReleaseLink> {
  protected path = "/workspaces/{slug}/releases/{release_id}/links/";
  protected operations: Record<string, OperationId> = {
    list: "release_links_list",
    retrieve: "release_links_retrieve",
    create: "release_links_create",
    update: "release_links_partial_update",
    delete: "release_links_destroy",
  };

  private _at(slug: string, release: string, link?: string): Record<string, string> {
    const params: Record<string, string> = { slug, release_id: release };
    if (link !== undefined) params.pk = link;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<ReleaseLinkField, "all"> & keyof ReleaseLink>(
    slug: string,
    release: string,
    params: ListReleaseLinksParams & { fields: readonly F[] }
  ): Promise<Page<Pick<ReleaseLink, F | "id">>>;
  list(slug: string, release: string, params?: ListReleaseLinksParams): Promise<Page<ReleaseLink>>;
  list(slug: string, release: string, params?: ListReleaseLinksParams): Promise<Page<ReleaseLink>> {
    return this.doList(this._at(slug, release), params as Record<string, unknown>);
  }

  /** Every link, following pages automatically. */
  iterate<F extends Exclude<ReleaseLinkField, "all"> & keyof ReleaseLink>(
    slug: string,
    release: string,
    params: ListReleaseLinksParams & { fields: readonly F[] }
  ): AsyncGenerator<Pick<ReleaseLink, F | "id">>;
  iterate(slug: string, release: string, params?: ListReleaseLinksParams): AsyncGenerator<ReleaseLink>;
  iterate(slug: string, release: string, params?: ListReleaseLinksParams): AsyncGenerator<ReleaseLink> {
    return this.doIterate(this._at(slug, release), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<ReleaseLinkField, "all"> & keyof ReleaseLink>(
    slug: string,
    release: string,
    link: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<ReleaseLink, F | "id">>;
  retrieve(
    slug: string,
    release: string,
    link: string,
    params?: { fields?: readonly ReleaseLinkField[] }
  ): Promise<ReleaseLink>;
  retrieve(
    slug: string,
    release: string,
    link: string,
    params?: { fields?: readonly ReleaseLinkField[] }
  ): Promise<ReleaseLink> {
    return this.doRetrieve(this._at(slug, release, link), params as Record<string, unknown>);
  }

  create(
    slug: string,
    release: string,
    data: CreateReleaseLink,
    params?: ReleaseLinkShapeParams
  ): Promise<ReleaseLink> {
    return this.doCreate(data, this._at(slug, release), params as Record<string, unknown>);
  }

  update(
    slug: string,
    release: string,
    link: string,
    data: UpdateReleaseLink,
    params?: ReleaseLinkShapeParams
  ): Promise<ReleaseLink> {
    return this.doUpdate(data, this._at(slug, release, link), params as Record<string, unknown>);
  }

  delete(slug: string, release: string, link: string): Promise<void> {
    return this.doDelete(this._at(slug, release, link));
  }
}
