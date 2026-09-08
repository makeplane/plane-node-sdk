import { Release, UpdateRelease, CreateRelease } from "../../../models/v2/Release";
import { Page } from "../../../models/v2/common";
import { EXPAND, FIELDS, ORDER_BY } from "../generated/constants";
import { LoadedMeta, LoadsNavigableRows, NavigationFactories, owned } from "../kernel/loaded";
import { AnyOperationId } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import { RELEASE_ID_NAMES, LoadedRelease, LoadedReleaseRow, ReleaseNavigation } from "../loaded/Release";
import { Changelog } from "./Changelog";
import { Comments } from "./Comments";
import { Links } from "./Links";
import { ReleaseLabels } from "./Labels";
import { ReleaseWorkItems } from "./WorkItems";

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

/**
 * Releases — CRUD, per-release comments/links/changelog, the label catalog's bridge, and
 * `workItems` membership.
 *
 * Reached flat — `v2.workspaces.releases.list(slug)` — or from a fetched workspace:
 * `workspace.releases.list()`. Every row-returning method answers a {@link LoadedRelease}.
 *
 * The **tag** catalog is deliberately not a child here: every one of its routes takes the
 * slug alone and a release merely points at a tag through its own `tag_id`, so it hangs off
 * `Workspaces` as `releaseTags`. See {@link ReleaseNavigation} for the whole reasoning.
 */
export class Releases extends LoadsNavigableRows<Release, CreateRelease, UpdateRelease, ReleaseNavigation> {
  protected path = "/workspaces/{slug}/releases/";
  protected operations: Record<string, AnyOperationId> = {
    list: "releases_list",
    retrieve: "releases_retrieve",
    create: "releases_create",
    update: "releases_partial_update",
    delete: "releases_destroy",
  };
  protected loadedIdNames = RELEASE_ID_NAMES;

  /** Label catalog plus `add`/`remove` of labels on a release — see {@link ReleaseLabels}. */
  public labels: ReleaseLabels;
  public comments: Comments;
  public links: Links;
  public changelog: Changelog;
  /** `add`/`remove` work items on a release — see {@link ReleaseWorkItems}. */
  public workItems: ReleaseWorkItems;

  constructor(transport: V2Transport) {
    super(transport);
    this.labels = new ReleaseLabels(transport);
    this.comments = new Comments(transport);
    this.links = new Links(transport);
    this.changelog = new Changelog(transport);
    this.workItems = new ReleaseWorkItems(transport);
  }

  protected navigationOf(meta: LoadedMeta): NavigationFactories<ReleaseNavigation> {
    const ids = meta.ids as [string, string];
    return {
      labels: () => owned(this.labels, ids, meta.idNames),
      comments: () => owned(this.comments, ids, meta.idNames),
      links: () => owned(this.links, ids, meta.idNames),
      changelog: () => owned(this.changelog, ids, meta.idNames),
      workItems: () => owned(this.workItems, ids, meta.idNames),
    };
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<ReleaseField, "all"> & keyof Release>(
    slug: string,
    params: ListReleasesParams & { fields: readonly F[] }
  ): Promise<Page<LoadedReleaseRow<Pick<Release, F | "id">>>>;
  list(slug: string, params?: ListReleasesParams): Promise<Page<LoadedRelease>>;
  async list(slug: string, params?: ListReleasesParams): Promise<Page<LoadedRelease>> {
    const page = await this.doList({ slug }, params as Record<string, unknown>);
    return this.loadPage(page, [slug], params?.fields);
  }

  /** Every release in the workspace, following pages automatically. */
  iterate<F extends Exclude<ReleaseField, "all"> & keyof Release>(
    slug: string,
    params: ListReleasesParams & { fields: readonly F[] }
  ): AsyncGenerator<LoadedReleaseRow<Pick<Release, F | "id">>>;
  iterate(slug: string, params?: ListReleasesParams): AsyncGenerator<LoadedRelease>;
  iterate(slug: string, params?: ListReleasesParams): AsyncGenerator<LoadedRelease> {
    return this.loadIterate(this.doIterate({ slug }, params as Record<string, unknown>), [slug], params?.fields);
  }

  retrieve<F extends Exclude<ReleaseField, "all"> & keyof Release>(
    slug: string,
    release: string,
    params: { fields: readonly F[]; expand?: readonly ReleaseExpand[] }
  ): Promise<LoadedReleaseRow<Pick<Release, F | "id">>>;
  retrieve(
    slug: string,
    release: string,
    params?: { fields?: readonly ReleaseField[]; expand?: readonly ReleaseExpand[] }
  ): Promise<LoadedRelease>;
  async retrieve(
    slug: string,
    release: string,
    params?: { fields?: readonly ReleaseField[]; expand?: readonly ReleaseExpand[] }
  ): Promise<LoadedRelease> {
    const row = await this.doRetrieve({ slug, pk: release }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  /** The one release with this name; throws if none or several match. */
  async findByName(slug: string, name: string): Promise<LoadedRelease> {
    const row = await this.doFindOne({ name }, { slug });
    return this.load(row, [slug]);
  }

  async create(
    slug: string,
    data: CreateRelease,
    params?: { fields?: readonly ReleaseField[]; expand?: readonly ReleaseExpand[] }
  ): Promise<LoadedRelease> {
    const row = await this.doCreate(data, { slug }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  async update(
    slug: string,
    release: string,
    data: UpdateRelease,
    params?: { fields?: readonly ReleaseField[]; expand?: readonly ReleaseExpand[] }
  ): Promise<LoadedRelease> {
    const row = await this.doUpdate(data, { slug, pk: release }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  delete(slug: string, release: string): Promise<void> {
    return this.doDelete({ slug, pk: release });
  }
}

export { Changelog } from "./Changelog";
export { Comments } from "./Comments";
export { Links } from "./Links";
export { ReleaseLabels } from "./Labels";
export { ReleaseTags } from "./Tags";
export { ReleaseWorkItems } from "./WorkItems";
export type { ListReleaseCommentsParams, ReleaseCommentField, ReleaseCommentOrderBy } from "./Comments";
export type { ListReleaseLinksParams, ReleaseLinkField, ReleaseLinkOrderBy } from "./Links";
export type { ListReleaseLabelsParams, ReleaseLabelField, ReleaseLabelOrderBy } from "./Labels";
export type { ListReleaseTagsParams, ReleaseTagField, ReleaseTagOrderBy } from "./Tags";
