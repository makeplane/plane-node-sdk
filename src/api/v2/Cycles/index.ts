import { BulkUpdateItem, BulkWriteResponse, Page } from "../../../models/v2/common";
import { Cycle, UpdateCycle, CreateCycle } from "../../../models/v2/Cycle";
import { CycleTransferRequest, CycleTransferResult } from "../../../models/v2/CycleTransfer";
import { CycleField, CycleOrderBy, EXPAND } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import { CycleWorkItems } from "./WorkItems";

/** `cycles_list`'s only expand target — the cycle's owner as a full object instead of `owned_by_id`. */
export type CycleExpand = (typeof EXPAND)["cycles_list"][number];

export interface ListCyclesParams {
  fields?: readonly CycleField[];
  name?: string;
  owned_by_id?: string;
  external_id?: string;
  external_source?: string;
  search?: string;
  expand?: readonly CycleExpand[];
  order_by?: CycleOrderBy;
  offset?: number;
  per_page?: number;
  /** `"cursor"` opts into the cursor envelope; pair with a cursor-safe `order_by` or expect a 400. */
  paginate?: "cursor";
  count?: boolean;
}

/** Project cycles, reached bound to a project. `transfer` is hand-written since `doAction` only issues a bodiless POST; membership is `workItems`. */
export class Cycles extends V2Resource<Cycle, CreateCycle, UpdateCycle> {
  protected path = "/workspaces/{slug}/projects/{project_id}/cycles/";
  protected operations: Record<string, AnyOperationId> = {
    list: "cycles_list",
    retrieve: "cycles_retrieve",
    create: "cycles_create",
    update: "cycles_partial_update",
    upsert: "cycles_upsert",
    delete: "cycles_destroy",
    bulkCreate: "cycles_bulk_create",
    bulkUpdate: "cycles_bulk_update",
    bulkDelete: "cycles_bulk_delete",
    transfer: "cycles_transfer",
  };

  /** `add`/`remove` work items on a cycle — see {@link CycleWorkItems}. */
  public workItems: CycleWorkItems;

  constructor(transport: V2Transport, scope: Record<string, string> = {}) {
    super(transport, scope);
    this.workItems = new CycleWorkItems(transport, scope);
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<CycleField, "all"> & keyof Cycle>(
    params: ListCyclesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<Cycle, F | "id">>>;
  list(params?: ListCyclesParams): Promise<Page<Cycle>>;
  list(params?: ListCyclesParams): Promise<Page<Cycle>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every cycle, following pages automatically. */
  iterate(params?: ListCyclesParams): AsyncGenerator<Cycle> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<CycleField, "all"> & keyof Cycle>(
    cycleId: string,
    params: { fields: readonly F[]; expand?: readonly CycleExpand[] }
  ): Promise<Pick<Cycle, F | "id">>;
  retrieve(
    cycleId: string,
    params?: { fields?: readonly CycleField[]; expand?: readonly CycleExpand[] }
  ): Promise<Cycle>;
  retrieve(
    cycleId: string,
    params?: { fields?: readonly CycleField[]; expand?: readonly CycleExpand[] }
  ): Promise<Cycle> {
    return this.doRetrieve({ pk: cycleId }, params as Record<string, unknown>);
  }

  /** The one cycle with this name; throws if none or several match. */
  findByName(name: string): Promise<Cycle> {
    return this.doFindOne({ name }, {});
  }

  create(data: CreateCycle): Promise<Cycle> {
    return this.doCreate(data, {});
  }

  update(cycleId: string, data: UpdateCycle): Promise<Cycle> {
    return this.doUpdate(data, { pk: cycleId });
  }

  delete(cycleId: string): Promise<void> {
    return this.doDelete({ pk: cycleId });
  }

  /** Reconciles on (external_source, external_id) when both are set. */
  upsert(data: CreateCycle): Promise<Cycle> {
    return this.doUpsert(data, {});
  }

  bulkCreate(items: CreateCycle[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkCreate(items, {}, allOrNone);
  }

  bulkUpdate(items: BulkUpdateItem<UpdateCycle>[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkUpdate(items, {}, allOrNone);
  }

  bulkDelete(ids: string[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkDelete(ids, {}, allOrNone);
  }

  /** Move `cycleId`'s incomplete work items into `data.new_cycle_id`; `cycleId`'s cycle must already be completed. */
  async transfer(cycleId: string, data: CycleTransferRequest): Promise<CycleTransferResult> {
    return this.transport.request<CycleTransferResult>("POST", `${this.detailUrl({ pk: cycleId })}transfer/`, {
      data,
    });
  }
}

export { CycleWorkItems } from "./WorkItems";
