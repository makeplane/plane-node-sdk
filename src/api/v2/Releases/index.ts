import {
  Release,
  ReleaseChildManageRequest,
  ReleaseChildManageResponse,
  UpdateRelease,
  CreateRelease,
} from "../../../models/v2/Release";
import { Page } from "../../../models/v2/common";
import { EXPAND, FIELDS, ORDER_BY } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import { Changelog } from "./Changelog";
import { Comments } from "./Comments";
import { Links } from "./Links";
import { ReleaseLabels } from "./Labels";
import { ReleaseTags } from "./Tags";

export type ReleaseField = (typeof FIELDS)["releases_list"][number];
export type ReleaseOrderBy = (typeof ORDER_BY)["releases_list"][number];
export type ReleaseExpand = (typeof EXPAND)["releases_list"][number];
/** `unreleased` | `released` | `cancelled` — the golden's `ReleaseStatusEnum`, as used by the `status`/`status__in` filters. */
export type ReleaseStatusFilter = "unreleased" | "released" | "cancelled";

export interface ListReleasesParams {
  fields?: readonly ReleaseField[];
  expand?: readonly ReleaseExpand[];
  order_by?: ReleaseOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
  search?: string;
  is_latest?: boolean;
  is_prerelease?: boolean;
  lead_id?: string;
  name?: string;
  release_date?: string;
  status?: ReleaseStatusFilter;
  status__in?: readonly ReleaseStatusFilter[];
  tag_id?: string;
  target_date?: string;
}

/** Releases at `client.v2.workspace(slug).releases` — CRUD, per-release comments/links/changelog, label/tag catalogs. */
export class Releases extends V2Resource<Release, CreateRelease, UpdateRelease> {
  protected path = "/workspaces/{slug}/releases/";
  protected operations: Record<string, AnyOperationId> = {
    list: "releases_list",
    retrieve: "releases_retrieve",
    create: "releases_create",
    update: "releases_partial_update",
    delete: "releases_destroy",
    manageLabels: "releases_labels",
    manageWorkItems: "releases_work_items",
  };

  public labels: ReleaseLabels;
  public tags: ReleaseTags;
  public comments: Comments;
  public links: Links;
  public changelog: Changelog;

  constructor(transport: V2Transport, scope: Record<string, string> = {}) {
    super(transport, scope);
    this.labels = new ReleaseLabels(transport, scope);
    this.tags = new ReleaseTags(transport, scope);
    this.comments = new Comments(transport, scope);
    this.links = new Links(transport, scope);
    this.changelog = new Changelog(transport, scope);
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<ReleaseField, "all"> & keyof Release>(
    params: ListReleasesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<Release, F | "id">>>;
  list(params?: ListReleasesParams): Promise<Page<Release>>;
  list(params?: ListReleasesParams): Promise<Page<Release>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every release in the workspace, following pages automatically. */
  iterate(params?: ListReleasesParams): AsyncGenerator<Release> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<ReleaseField, "all"> & keyof Release>(
    releaseId: string,
    params: { fields: readonly F[]; expand?: readonly ReleaseExpand[] }
  ): Promise<Pick<Release, F | "id">>;
  retrieve(
    releaseId: string,
    params?: { fields?: readonly ReleaseField[]; expand?: readonly ReleaseExpand[] }
  ): Promise<Release>;
  retrieve(
    releaseId: string,
    params?: { fields?: readonly ReleaseField[]; expand?: readonly ReleaseExpand[] }
  ): Promise<Release> {
    return this.doRetrieve({ pk: releaseId }, params as Record<string, unknown>);
  }

  /** The one release with this name; throws if none or several match. */
  findByName(name: string): Promise<Release> {
    return this.doFindOne({ name }, {});
  }

  create(
    data: CreateRelease,
    params?: { fields?: readonly ReleaseField[]; expand?: readonly ReleaseExpand[] }
  ): Promise<Release> {
    return this.doCreate(data, {}, params as Record<string, unknown>);
  }

  update(
    releaseId: string,
    data: UpdateRelease,
    params?: { fields?: readonly ReleaseField[]; expand?: readonly ReleaseExpand[] }
  ): Promise<Release> {
    return this.doUpdate(data, { pk: releaseId }, params as Record<string, unknown>);
  }

  delete(releaseId: string): Promise<void> {
    return this.doDelete({ pk: releaseId });
  }

  /** Bulk add/remove workspace release labels on this release. Label definitions live under `labels`. */
  manageLabels(releaseId: string, data: ReleaseChildManageRequest): Promise<ReleaseChildManageResponse> {
    return this.transport.request<ReleaseChildManageResponse>("POST", `${this.detailUrl({ pk: releaseId })}labels/`, {
      data,
    });
  }

  /** Bulk add/remove work items on this release. */
  manageWorkItems(releaseId: string, data: ReleaseChildManageRequest): Promise<ReleaseChildManageResponse> {
    return this.transport.request<ReleaseChildManageResponse>(
      "POST",
      `${this.detailUrl({ pk: releaseId })}work-items/`,
      { data }
    );
  }
}

export { Changelog } from "./Changelog";
export { Comments } from "./Comments";
export { Links } from "./Links";
export { ReleaseLabels } from "./Labels";
export { ReleaseTags } from "./Tags";
export type { ListReleaseCommentsParams, ReleaseCommentField, ReleaseCommentOrderBy } from "./Comments";
export type { ListReleaseLinksParams, ReleaseLinkField, ReleaseLinkOrderBy } from "./Links";
export type { ListReleaseLabelsParams, ReleaseLabelField, ReleaseLabelOrderBy } from "./Labels";
export type { ListReleaseTagsParams, ReleaseTagField, ReleaseTagOrderBy } from "./Tags";
