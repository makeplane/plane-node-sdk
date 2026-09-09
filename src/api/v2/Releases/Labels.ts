import { Page } from "../../../models/v2/common";
import { ReleaseLabel, UpdateReleaseLabel, CreateReleaseLabel } from "../../../models/v2/ReleaseLabel";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";

export type ReleaseLabelField = (typeof FIELDS)["release_labels_list"][number];
export type ReleaseLabelOrderBy = (typeof ORDER_BY)["release_labels_list"][number];

export interface ListReleaseLabelsParams {
  fields?: readonly ReleaseLabelField[];
  name?: string;
  search?: string;
  order_by?: ReleaseLabelOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/**
 * The release label catalog **and** the per-release bridge, in one class because they are
 * one catalog: `create` defines a label at the workspace level, `add`/`remove` put one on
 * or take one off a release.
 *
 * The two halves bind different numbers of ids, which is why a fetched release reaches only
 * `add`/`remove` through `release.labels` while the catalog stays flat at
 * `v2.workspaces.releases.labels.list(slug)`. Recorded in `CATALOG_SIBLINGS` in
 * `tests/unit/v2/loaded-navigation.test.ts`, which refuses the entry if the split ever
 * stops being real.
 */
export class ReleaseLabels extends V2Resource<ReleaseLabel, CreateReleaseLabel, UpdateReleaseLabel> {
  protected path = "/workspaces/{slug}/releases/labels/";
  protected extraPaths = {
    // The per-release bridge, a different route from this catalog's own collection —
    // `urlFor` picks it for `add`/`remove` and the sweeps read the same template.
    add: "/workspaces/{slug}/releases/{release_id}/labels/",
    remove: "/workspaces/{slug}/releases/{release_id}/labels/",
  };
  protected operations: Record<string, AnyOperationId> = {
    list: "release_labels_list",
    retrieve: "release_labels_retrieve",
    create: "release_labels_create",
    update: "release_labels_partial_update",
    delete: "release_labels_destroy",
    // One operation, two verbs — see `CycleWorkItems.operations`.
    add: "releases_labels",
    remove: "releases_labels",
  };

  /**
   * One page of `ReleaseLabel` rows. Use `iterate` to follow pages automatically.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  list<F extends Exclude<ReleaseLabelField, "all"> & keyof ReleaseLabel>(
    slug: string,
    params: ListReleaseLabelsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<ReleaseLabel, F | "id">>>;
  /** One page of `ReleaseLabel` rows. Use `iterate` to follow pages automatically. */
  list(slug: string, params?: ListReleaseLabelsParams): Promise<Page<ReleaseLabel>>;
  list(slug: string, params?: ListReleaseLabelsParams): Promise<Page<ReleaseLabel>> {
    return this.doList({ slug }, params as Record<string, unknown>);
  }

  /** Every release label definition, following pages automatically. */
  iterate<F extends Exclude<ReleaseLabelField, "all"> & keyof ReleaseLabel>(
    slug: string,
    params: Omit<ListReleaseLabelsParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<Pick<ReleaseLabel, F | "id">>;
  /** Every release label definition, following pages automatically. */
  iterate(slug: string, params?: Omit<ListReleaseLabelsParams, "offset" | "count">): AsyncGenerator<ReleaseLabel>;
  iterate(slug: string, params?: Omit<ListReleaseLabelsParams, "offset" | "count">): AsyncGenerator<ReleaseLabel> {
    return this.doIterate({ slug }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<ReleaseLabelField, "all"> & keyof ReleaseLabel>(
    slug: string,
    label: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<ReleaseLabel, F | "id">>;
  retrieve(slug: string, label: string, params?: { fields?: readonly ReleaseLabelField[] }): Promise<ReleaseLabel>;
  retrieve(slug: string, label: string, params?: { fields?: readonly ReleaseLabelField[] }): Promise<ReleaseLabel> {
    return this.doRetrieve({ slug, pk: label }, params as Record<string, unknown>);
  }

  /** The one release label with this name; throws if none or several match. */
  findByName(slug: string, name: string): Promise<ReleaseLabel> {
    return this.doFindOne({ name }, { slug });
  }

  create<F extends Exclude<ReleaseLabelField, "all"> & keyof ReleaseLabel>(
    slug: string,
    data: CreateReleaseLabel,
    params: { fields: readonly F[] }
  ): Promise<Pick<ReleaseLabel, F | "id">>;
  create(
    slug: string,
    data: CreateReleaseLabel,
    params?: { fields?: readonly ReleaseLabelField[] }
  ): Promise<ReleaseLabel>;
  create(
    slug: string,
    data: CreateReleaseLabel,
    params?: { fields?: readonly ReleaseLabelField[] }
  ): Promise<ReleaseLabel> {
    return this.doCreate(data, { slug }, params as Record<string, unknown>);
  }

  update<F extends Exclude<ReleaseLabelField, "all"> & keyof ReleaseLabel>(
    slug: string,
    label: string,
    data: UpdateReleaseLabel,
    params: { fields: readonly F[] }
  ): Promise<Pick<ReleaseLabel, F | "id">>;
  update(
    slug: string,
    label: string,
    data: UpdateReleaseLabel,
    params?: { fields?: readonly ReleaseLabelField[] }
  ): Promise<ReleaseLabel>;
  update(
    slug: string,
    label: string,
    data: UpdateReleaseLabel,
    params?: { fields?: readonly ReleaseLabelField[] }
  ): Promise<ReleaseLabel> {
    return this.doUpdate(data, { slug, pk: label }, params as Record<string, unknown>);
  }

  delete(slug: string, label: string): Promise<void> {
    return this.doDelete({ slug, pk: label });
  }

  /** Put catalog labels on a release (1..100 ids); resolves to the ids actually added. */
  add(slug: string, release: string, labelIds: readonly string[]): Promise<string[]> {
    return this.doBridge("add", labelIds, { slug, release_id: release });
  }

  /** Take labels off a release (1..100 ids); the catalog entries stay. Resolves to the ids actually removed. */
  remove(slug: string, release: string, labelIds: readonly string[]): Promise<string[]> {
    return this.doBridge("remove", labelIds, { slug, release_id: release });
  }
}
