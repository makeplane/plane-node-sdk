import { BulkUpdateItem, BulkWriteResponse, Page } from "../../../models/v2/common";
import { Milestone, UpdateMilestone, CreateMilestone } from "../../../models/v2/Milestone";
import { MilestoneField, MilestoneOrderBy } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import { MilestoneWorkItems } from "./WorkItems";

export interface ListMilestonesParams {
  fields?: readonly MilestoneField[];
  /** Filters on `title` — the golden names this parameter `name` for consistency with every other resource. */
  name?: string;
  target_date?: string;
  target_date__gte?: string;
  target_date__lte?: string;
  external_id?: string;
  external_source?: string;
  search?: string;
  order_by?: MilestoneOrderBy;
  offset?: number;
  per_page?: number;
  /** `"cursor"` opts into the cursor envelope; pair with a cursor-safe `order_by` or expect a 400. */
  paginate?: "cursor";
  count?: boolean;
}

/** Project milestones, reached bound to a project; membership is `workItems`. */
export class Milestones extends V2Resource<Milestone, CreateMilestone, UpdateMilestone> {
  protected path = "/workspaces/{slug}/projects/{project_id}/milestones/";
  protected operations: Record<string, AnyOperationId> = {
    list: "milestones_list",
    retrieve: "milestones_retrieve",
    create: "milestones_create",
    update: "milestones_partial_update",
    upsert: "milestones_upsert",
    delete: "milestones_destroy",
    bulkCreate: "milestones_bulk_create",
    bulkUpdate: "milestones_bulk_update",
    bulkDelete: "milestones_bulk_delete",
  };

  /** `add`/`remove` work items on a milestone — see {@link MilestoneWorkItems}. */
  public workItems: MilestoneWorkItems;

  constructor(transport: V2Transport, scope: Record<string, string> = {}) {
    super(transport, scope);
    this.workItems = new MilestoneWorkItems(transport, scope);
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<MilestoneField, "all"> & keyof Milestone>(
    params: ListMilestonesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<Milestone, F | "id">>>;
  list(params?: ListMilestonesParams): Promise<Page<Milestone>>;
  list(params?: ListMilestonesParams): Promise<Page<Milestone>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every milestone, following pages automatically. */
  iterate(params?: ListMilestonesParams): AsyncGenerator<Milestone> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<MilestoneField, "all"> & keyof Milestone>(
    milestoneId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<Milestone, F | "id">>;
  retrieve(milestoneId: string, params?: { fields?: readonly MilestoneField[] }): Promise<Milestone>;
  retrieve(milestoneId: string, params?: { fields?: readonly MilestoneField[] }): Promise<Milestone> {
    return this.doRetrieve({ pk: milestoneId }, params as Record<string, unknown>);
  }

  /** The one milestone with this title; throws if none or several match. */
  findByName(name: string): Promise<Milestone> {
    return this.doFindOne({ name }, {});
  }

  create(data: CreateMilestone): Promise<Milestone> {
    return this.doCreate(data, {});
  }

  update(milestoneId: string, data: UpdateMilestone): Promise<Milestone> {
    return this.doUpdate(data, { pk: milestoneId });
  }

  delete(milestoneId: string): Promise<void> {
    return this.doDelete({ pk: milestoneId });
  }

  /** Reconciles on (external_source, external_id) when both are set. */
  upsert(data: CreateMilestone): Promise<Milestone> {
    return this.doUpsert(data, {});
  }

  bulkCreate(items: CreateMilestone[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkCreate(items, {}, allOrNone);
  }

  bulkUpdate(items: BulkUpdateItem<UpdateMilestone>[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkUpdate(items, {}, allOrNone);
  }

  bulkDelete(ids: string[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkDelete(ids, {}, allOrNone);
  }
}

export { MilestoneWorkItems } from "./WorkItems";
