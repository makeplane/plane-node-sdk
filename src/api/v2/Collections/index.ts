import { MultipleMatchesFoundError, NoMatchFoundError } from "../../../errors/PlaneApiError";
import { Page } from "../../../models/v2/common";
import { Collection, UpdateCollection, CreateCollection } from "../../../models/v2/Collection";
import { PageAccess } from "../../../models/v2/Page";
import { EXPAND, FIELDS, ORDER_BY } from "../generated/constants";
import { LoadedMeta, LoadsNavigableRows, NavigationFactories, owned } from "../kernel/loaded";
import { OperationId } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import { COLLECTION_ID_NAMES, LoadedCollection, LoadedCollectionRow, CollectionNavigation } from "../loaded/Collection";
import { CollectionMembers } from "./Members";
import { CollectionPages } from "./Pages";

export type CollectionField = (typeof FIELDS)["pages_list"][number];
export type CollectionOrderBy = (typeof ORDER_BY)["pages_list"][number];
export type CollectionExpand = (typeof EXPAND)["pages_list"][number];

export interface ListCollectionsParams {
  fields?: readonly CollectionField[];
  expand?: readonly CollectionExpand[];
  access?: PageAccess;
  is_default?: boolean;
  is_global?: boolean;
  owned_by_id?: string;
  search?: string;
  order_by?: CollectionOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** Wiki collections — CRUD plus `members`/`pages` sub-resources. Golden operation ids are `pages_*` (historical). */
export class Collections extends LoadsNavigableRows<
  Collection,
  CreateCollection,
  UpdateCollection,
  CollectionNavigation
> {
  protected path = "/workspaces/{slug}/collections/";
  protected operations: Record<string, OperationId> = {
    list: "pages_list",
    retrieve: "pages_retrieve",
    create: "pages_create",
    update: "pages_partial_update",
    delete: "pages_destroy",
  };
  protected loadedIdNames = COLLECTION_ID_NAMES;

  public members: CollectionMembers;
  public pages: CollectionPages;

  constructor(transport: V2Transport) {
    super(transport);
    this.members = new CollectionMembers(transport);
    this.pages = new CollectionPages(transport);
  }

  protected navigationOf(meta: LoadedMeta): NavigationFactories<CollectionNavigation> {
    const ids = meta.ids as [string, string];
    return {
      members: () => owned(this.members, ids, meta.idNames),
      pages: () => owned(this.pages, ids, meta.idNames),
    };
  }

  /**
   * One page of `Collection` rows. Use `iterate` to follow pages automatically.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  list<F extends Exclude<CollectionField, "all"> & keyof Collection>(
    slug: string,
    params: ListCollectionsParams & { fields: readonly F[] }
  ): Promise<Page<LoadedCollectionRow<Pick<Collection, F | "id">>>>;
  /** One page of `Collection` rows. Use `iterate` to follow pages automatically. */
  list(slug: string, params?: ListCollectionsParams): Promise<Page<LoadedCollection>>;
  async list(slug: string, params?: ListCollectionsParams): Promise<Page<LoadedCollection>> {
    const page = await this.doList({ slug }, params as Record<string, unknown>);
    return this.loadPage(page, [slug], params?.fields);
  }

  /** Every collection in the workspace, following pages automatically. */
  iterate<F extends Exclude<CollectionField, "all"> & keyof Collection>(
    slug: string,
    params: Omit<ListCollectionsParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<LoadedCollectionRow<Pick<Collection, F | "id">>>;
  /** Every collection in the workspace, following pages automatically. */
  iterate(slug: string, params?: Omit<ListCollectionsParams, "offset" | "count">): AsyncGenerator<LoadedCollection>;
  iterate(slug: string, params?: Omit<ListCollectionsParams, "offset" | "count">): AsyncGenerator<LoadedCollection> {
    return this.loadIterate(this.doIterate({ slug }, params as Record<string, unknown>), [slug], params?.fields);
  }

  retrieve<F extends Exclude<CollectionField, "all"> & keyof Collection>(
    slug: string,
    collection: string,
    params: { fields: readonly F[]; expand?: readonly CollectionExpand[] }
  ): Promise<LoadedCollectionRow<Pick<Collection, F | "id">>>;
  retrieve(
    slug: string,
    collection: string,
    params?: { fields?: readonly CollectionField[]; expand?: readonly CollectionExpand[] }
  ): Promise<LoadedCollection>;
  async retrieve(
    slug: string,
    collection: string,
    params?: { fields?: readonly CollectionField[]; expand?: readonly CollectionExpand[] }
  ): Promise<LoadedCollection> {
    const row = await this.doRetrieve({ slug, pk: collection }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  /** The one collection with this name; throws if none or several match. Filters client-side — no `?name=` filter exists. */
  async findByName(slug: string, name: string): Promise<LoadedCollection> {
    const matches: LoadedCollection[] = [];
    for await (const row of this.iterate(slug)) {
      if (row.name === name) matches.push(row);
    }
    if (matches.length === 0) {
      throw new NoMatchFoundError(`No ${this.constructor.name} matched name=${JSON.stringify(name)}.`);
    }
    if (matches.length > 1) {
      throw new MultipleMatchesFoundError(
        `Multiple rows matched name=${JSON.stringify(name)}; use the id instead, or list to see every match.`
      );
    }
    return matches[0];
  }

  create<F extends Exclude<CollectionField, "all"> & keyof Collection>(
    slug: string,
    data: CreateCollection,
    params: { fields?: readonly CollectionField[]; expand?: readonly CollectionExpand[] } & { fields: readonly F[] }
  ): Promise<LoadedCollectionRow<Pick<Collection, F | "id">>>;
  create(
    slug: string,
    data: CreateCollection,
    params?: { fields?: readonly CollectionField[]; expand?: readonly CollectionExpand[] }
  ): Promise<LoadedCollection>;
  async create(
    slug: string,
    data: CreateCollection,
    params?: { fields?: readonly CollectionField[]; expand?: readonly CollectionExpand[] }
  ): Promise<LoadedCollection> {
    const row = await this.doCreate(data, { slug }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  update<F extends Exclude<CollectionField, "all"> & keyof Collection>(
    slug: string,
    collection: string,
    data: UpdateCollection,
    params: { fields?: readonly CollectionField[]; expand?: readonly CollectionExpand[] } & { fields: readonly F[] }
  ): Promise<LoadedCollectionRow<Pick<Collection, F | "id">>>;
  update(
    slug: string,
    collection: string,
    data: UpdateCollection,
    params?: { fields?: readonly CollectionField[]; expand?: readonly CollectionExpand[] }
  ): Promise<LoadedCollection>;
  async update(
    slug: string,
    collection: string,
    data: UpdateCollection,
    params?: { fields?: readonly CollectionField[]; expand?: readonly CollectionExpand[] }
  ): Promise<LoadedCollection> {
    const row = await this.doUpdate(data, { slug, pk: collection }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  delete(slug: string, collection: string): Promise<void> {
    return this.doDelete({ slug, pk: collection });
  }

  /** The workspace's default ("General") collection — the one with `is_default: true`. Every workspace has exactly one. */
  async default(slug: string): Promise<LoadedCollection> {
    const row = await this.doFindOne({ is_default: true }, { slug });
    return this.load(row, [slug]);
  }
}

export { CollectionMembers } from "./Members";
export { CollectionPages } from "./Pages";
export type { CollectionMemberExpand, CollectionMemberField, ListCollectionMembersParams } from "./Members";
export type { CollectionPageSearchField } from "./Pages";
