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

  private pk(releaseId: string, id?: string): Record<string, string> {
    const params: Record<string, string> = { release_id: releaseId };
    if (id !== undefined) params.pk = id;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<ReleaseLinkField, "all"> & keyof ReleaseLink>(
    releaseId: string,
    params: ListReleaseLinksParams & { fields: readonly F[] }
  ): Promise<Page<Pick<ReleaseLink, F | "id">>>;
  list(releaseId: string, params?: ListReleaseLinksParams): Promise<Page<ReleaseLink>>;
  list(releaseId: string, params?: ListReleaseLinksParams): Promise<Page<ReleaseLink>> {
    return this.doList(this.pk(releaseId), params as Record<string, unknown>);
  }

  /** Every link, following pages automatically. */
  iterate(releaseId: string, params?: ListReleaseLinksParams): AsyncGenerator<ReleaseLink> {
    return this.doIterate(this.pk(releaseId), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<ReleaseLinkField, "all"> & keyof ReleaseLink>(
    releaseId: string,
    linkId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<ReleaseLink, F | "id">>;
  retrieve(releaseId: string, linkId: string, params?: { fields?: readonly ReleaseLinkField[] }): Promise<ReleaseLink>;
  retrieve(releaseId: string, linkId: string, params?: { fields?: readonly ReleaseLinkField[] }): Promise<ReleaseLink> {
    return this.doRetrieve(this.pk(releaseId, linkId), params as Record<string, unknown>);
  }

  create(releaseId: string, data: CreateReleaseLink): Promise<ReleaseLink> {
    return this.doCreate(data, this.pk(releaseId));
  }

  update(releaseId: string, linkId: string, data: UpdateReleaseLink): Promise<ReleaseLink> {
    return this.doUpdate(data, this.pk(releaseId, linkId));
  }

  delete(releaseId: string, linkId: string): Promise<void> {
    return this.doDelete(this.pk(releaseId, linkId));
  }
}
