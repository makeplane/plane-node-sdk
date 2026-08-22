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

/** Personal sticky notes at `client.v2.workspace(slug).stickies`; each caller sees only their own. */
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
    params: ListStickiesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<Sticky, F | "id">>>;
  list(params?: ListStickiesParams): Promise<Page<Sticky>>;
  list(params?: ListStickiesParams): Promise<Page<Sticky>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every sticky, following pages automatically. */
  iterate(params?: ListStickiesParams): AsyncGenerator<Sticky> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<StickyField, "all"> & keyof Sticky>(
    stickyId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<Sticky, F | "id">>;
  retrieve(stickyId: string, params?: { fields?: readonly StickyField[] }): Promise<Sticky>;
  retrieve(stickyId: string, params?: { fields?: readonly StickyField[] }): Promise<Sticky> {
    return this.doRetrieve({ pk: stickyId }, params as Record<string, unknown>);
  }

  create(data: CreateSticky): Promise<Sticky> {
    return this.doCreate(data, {});
  }

  update(stickyId: string, data: UpdateSticky): Promise<Sticky> {
    return this.doUpdate(data, { pk: stickyId });
  }

  delete(stickyId: string): Promise<void> {
    return this.doDelete({ pk: stickyId });
  }
}
