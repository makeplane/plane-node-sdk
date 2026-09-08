import { Page } from "../../models/v2/common";
import { Sticky, UpdateSticky, CreateSticky } from "../../models/v2/Sticky";
import { FIELDS, ORDER_BY } from "./generated/constants";
import { OperationId, V2Resource } from "./kernel/resource";

export type StickyField = (typeof FIELDS)["stickies_list"][number];
export type StickyOrderBy = (typeof ORDER_BY)["stickies_list"][number];

export interface ListStickiesParams {
  fields?: readonly StickyField[];
  color?: string;
  owner_id?: string;
  search?: string;
  order_by?: StickyOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** `?fields=` on a single-row read or write. */
export interface StickyFieldsParams {
  fields?: readonly StickyField[];
}

/** Personal sticky notes; each caller sees only their own. */
export class Stickies extends V2Resource<Sticky, CreateSticky, UpdateSticky> {
  protected path = "/workspaces/{slug}/stickies/";
  protected operations: Record<string, OperationId> = {
    list: "stickies_list",
    retrieve: "stickies_retrieve",
    create: "stickies_create",
    update: "stickies_partial_update",
    delete: "stickies_destroy",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<StickyField, "all"> & keyof Sticky>(
    slug: string,
    params: ListStickiesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<Sticky, F | "id">>>;
  list(slug: string, params?: ListStickiesParams): Promise<Page<Sticky>>;
  list(slug: string, params?: ListStickiesParams): Promise<Page<Sticky>> {
    return this.doList({ slug }, params as Record<string, unknown>);
  }

  /** Every sticky, following pages automatically. */
  iterate(slug: string, params?: ListStickiesParams): AsyncGenerator<Sticky> {
    return this.doIterate({ slug }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<StickyField, "all"> & keyof Sticky>(
    slug: string,
    sticky: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<Sticky, F | "id">>;
  retrieve(slug: string, sticky: string, params?: StickyFieldsParams): Promise<Sticky>;
  retrieve(slug: string, sticky: string, params?: StickyFieldsParams): Promise<Sticky> {
    return this.doRetrieve({ slug, pk: sticky }, params as Record<string, unknown>);
  }

  create(slug: string, data: CreateSticky, params?: StickyFieldsParams): Promise<Sticky> {
    return this.doCreate(data, { slug }, params as Record<string, unknown>);
  }

  update(slug: string, sticky: string, data: UpdateSticky, params?: StickyFieldsParams): Promise<Sticky> {
    return this.doUpdate(data, { slug, pk: sticky }, params as Record<string, unknown>);
  }

  delete(slug: string, sticky: string): Promise<void> {
    return this.doDelete({ slug, pk: sticky });
  }
}
