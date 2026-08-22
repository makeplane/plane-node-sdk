import { MultipleMatchesFoundError, NoMatchFoundError } from "../../../errors/PlaneApiError";
import { Page } from "../../../models/v2/common";
import { Collection, UpdateCollection, CreateCollection } from "../../../models/v2/Collection";
import { PageAccess } from "../../../models/v2/Page";
import { EXPAND, FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
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
  count?: boolean;
}

/** Wiki collections — CRUD plus `members`/`pages` sub-resources. Golden operation ids are `pages_*` (historical). */
export class Collections extends V2Resource<Collection, CreateCollection, UpdateCollection> {
  protected path = "/workspaces/{slug}/collections/";
  protected operations: Record<string, OperationId> = {
    list: "pages_list",
    retrieve: "pages_retrieve",
    create: "pages_create",
    update: "pages_partial_update",
    delete: "pages_destroy",
  };

  public members: CollectionMembers;
  public pages: CollectionPages;

  constructor(transport: V2Transport, scope: Record<string, string> = {}) {
    super(transport, scope);
    this.members = new CollectionMembers(transport, scope);
    this.pages = new CollectionPages(transport, scope);
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<CollectionField, "all"> & keyof Collection>(
    params: ListCollectionsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<Collection, F | "id">>>;
  list(params?: ListCollectionsParams): Promise<Page<Collection>>;
  list(params?: ListCollectionsParams): Promise<Page<Collection>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every collection in the workspace, following pages automatically. */
  iterate(params?: ListCollectionsParams): AsyncGenerator<Collection> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<CollectionField, "all"> & keyof Collection>(
    collectionId: string,
    params: { fields: readonly F[]; expand?: readonly CollectionExpand[] }
  ): Promise<Pick<Collection, F | "id">>;
  retrieve(
    collectionId: string,
    params?: { fields?: readonly CollectionField[]; expand?: readonly CollectionExpand[] }
  ): Promise<Collection>;
  retrieve(
    collectionId: string,
    params?: { fields?: readonly CollectionField[]; expand?: readonly CollectionExpand[] }
  ): Promise<Collection> {
    return this.doRetrieve({ pk: collectionId }, params as Record<string, unknown>);
  }

  /** The one collection with this name; throws if none or several match. Filters client-side — no `?name=` filter exists. */
  async findByName(name: string): Promise<Collection> {
    const matches: Collection[] = [];
    for await (const row of this.iterate()) {
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

  create(
    data: CreateCollection,
    params?: { fields?: readonly CollectionField[]; expand?: readonly CollectionExpand[] }
  ): Promise<Collection> {
    return this.doCreate(data, {}, params as Record<string, unknown>);
  }

  update(
    collectionId: string,
    data: UpdateCollection,
    params?: { fields?: readonly CollectionField[]; expand?: readonly CollectionExpand[] }
  ): Promise<Collection> {
    return this.doUpdate(data, { pk: collectionId }, params as Record<string, unknown>);
  }

  delete(collectionId: string): Promise<void> {
    return this.doDelete({ pk: collectionId });
  }

  /** The workspace's default ("General") collection — the one with `is_default: true`. Every workspace has exactly one. */
  default(): Promise<Collection> {
    return this.doFindOne({ is_default: true }, {});
  }
}

export { CollectionMembers } from "./Members";
export { CollectionPages } from "./Pages";
export type { CollectionMemberExpand, CollectionMemberField, ListCollectionMembersParams } from "./Members";
export type { CollectionPageSearchField } from "./Pages";
