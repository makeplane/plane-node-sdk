import { BulkUpdateItem, BulkWriteResponse, Page } from "../../../models/v2/common";
import { Milestone, UpdateMilestone, CreateMilestone } from "../../../models/v2/Milestone";
import { MilestoneField, MilestoneOrderBy } from "../generated/constants";
import { LoadedMeta, LoadsNavigableRows, NavigationFactories, owned } from "../kernel/loaded";
import { AnyOperationId } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import { LoadedMilestone, LoadedMilestoneRow, MILESTONE_ID_NAMES, MilestoneNavigation } from "../loaded/Milestone";
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
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=` on a single-row read. The golden declares no `?expand=` on this family. */
export interface MilestoneShapeParams {
  fields?: readonly MilestoneField[];
}

/**
 * Project milestones.
 *
 * Reached flat — `v2.workspaces.projects.milestones.list(slug, project)` — or from a fetched project,
 * which supplies both leading ids: `project.milestones.list()`. Every row-returning method
 * answers a {@link LoadedMilestone}, so `milestone.workItems.add([...])` needs nothing
 * repeated.
 */
export class Milestones extends LoadsNavigableRows<Milestone, CreateMilestone, UpdateMilestone, MilestoneNavigation> {
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
  protected loadedIdNames = MILESTONE_ID_NAMES;

  /** `add`/`remove` work items on a milestone — see {@link MilestoneWorkItems}. */
  public workItems: MilestoneWorkItems;

  constructor(transport: V2Transport) {
    super(transport);
    this.workItems = new MilestoneWorkItems(transport);
  }

  protected navigationOf(meta: LoadedMeta): NavigationFactories<MilestoneNavigation> {
    const ids = meta.ids as [string, string, string];
    return { workItems: () => owned(this.workItems, ids, meta.idNames) };
  }

  /**
   * One page of `Milestone` rows. Use `iterate` to follow pages automatically.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  list<F extends Exclude<MilestoneField, "all"> & keyof Milestone>(
    slug: string,
    project: string,
    params: ListMilestonesParams & { fields: readonly F[] }
  ): Promise<Page<LoadedMilestoneRow<Pick<Milestone, F | "id">>>>;
  /** One page of `Milestone` rows. Use `iterate` to follow pages automatically. */
  list(slug: string, project: string, params?: ListMilestonesParams): Promise<Page<LoadedMilestone>>;
  async list(slug: string, project: string, params?: ListMilestonesParams): Promise<Page<LoadedMilestone>> {
    const page = await this.doList({ slug, project_id: project }, params as Record<string, unknown>);
    return this.loadPage(page, [slug, project], params?.fields);
  }

  /** Every milestone in the project, following pages automatically — navigable rows included. */
  iterate<F extends Exclude<MilestoneField, "all"> & keyof Milestone>(
    slug: string,
    project: string,
    params: Omit<ListMilestonesParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<LoadedMilestoneRow<Pick<Milestone, F | "id">>>;
  /** Every milestone in the project, following pages automatically — navigable rows included. */
  iterate(
    slug: string,
    project: string,
    params?: Omit<ListMilestonesParams, "offset" | "count">
  ): AsyncGenerator<LoadedMilestone>;
  iterate(
    slug: string,
    project: string,
    params?: Omit<ListMilestonesParams, "offset" | "count">
  ): AsyncGenerator<LoadedMilestone> {
    return this.loadIterate(
      this.doIterate({ slug, project_id: project }, params as Record<string, unknown>),
      [slug, project],
      params?.fields
    );
  }

  retrieve<F extends Exclude<MilestoneField, "all"> & keyof Milestone>(
    slug: string,
    project: string,
    milestone: string,
    params: { fields: readonly F[] }
  ): Promise<LoadedMilestoneRow<Pick<Milestone, F | "id">>>;
  retrieve(slug: string, project: string, milestone: string, params?: MilestoneShapeParams): Promise<LoadedMilestone>;
  async retrieve(
    slug: string,
    project: string,
    milestone: string,
    params?: MilestoneShapeParams
  ): Promise<LoadedMilestone> {
    const row = await this.doRetrieve({ slug, project_id: project, pk: milestone }, params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  /** The one milestone with this title; throws if none or several match. Answers the same navigable row `retrieve` does. */
  async findByName(slug: string, project: string, name: string): Promise<LoadedMilestone> {
    const row = await this.doFindOne({ name }, { slug, project_id: project });
    return this.load(row, [slug, project]);
  }

  create<F extends Exclude<MilestoneField, "all"> & keyof Milestone>(
    slug: string,
    project: string,
    data: CreateMilestone,
    params: MilestoneShapeParams & { fields: readonly F[] }
  ): Promise<LoadedMilestoneRow<Pick<Milestone, F | "id">>>;
  create(slug: string, project: string, data: CreateMilestone, params?: MilestoneShapeParams): Promise<LoadedMilestone>;
  async create(
    slug: string,
    project: string,
    data: CreateMilestone,
    params?: MilestoneShapeParams
  ): Promise<LoadedMilestone> {
    const row = await this.doCreate(data, { slug, project_id: project }, params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  update<F extends Exclude<MilestoneField, "all"> & keyof Milestone>(
    slug: string,
    project: string,
    milestone: string,
    data: UpdateMilestone,
    params: MilestoneShapeParams & { fields: readonly F[] }
  ): Promise<LoadedMilestoneRow<Pick<Milestone, F | "id">>>;
  update(
    slug: string,
    project: string,
    milestone: string,
    data: UpdateMilestone,
    params?: MilestoneShapeParams
  ): Promise<LoadedMilestone>;
  async update(
    slug: string,
    project: string,
    milestone: string,
    data: UpdateMilestone,
    params?: MilestoneShapeParams
  ): Promise<LoadedMilestone> {
    const row = await this.doUpdate(
      data,
      { slug, project_id: project, pk: milestone },
      params as Record<string, unknown>
    );
    return this.load(row, [slug, project], params?.fields);
  }

  delete(slug: string, project: string, milestone: string): Promise<void> {
    return this.doDelete({ slug, project_id: project, pk: milestone });
  }

  /** Reconciles on (external_source, external_id) when both are set. */
  upsert<F extends Exclude<MilestoneField, "all"> & keyof Milestone>(
    slug: string,
    project: string,
    data: CreateMilestone,
    params: MilestoneShapeParams & { fields: readonly F[] }
  ): Promise<LoadedMilestoneRow<Pick<Milestone, F | "id">>>;
  /** Reconciles on (external_source, external_id) when both are set. */
  upsert(slug: string, project: string, data: CreateMilestone, params?: MilestoneShapeParams): Promise<LoadedMilestone>;
  async upsert(
    slug: string,
    project: string,
    data: CreateMilestone,
    params?: MilestoneShapeParams
  ): Promise<LoadedMilestone> {
    const row = await this.doUpsert(data, { slug, project_id: project }, params as Record<string, unknown>);
    return this.load(row, [slug, project], params?.fields);
  }

  bulkCreate(slug: string, project: string, items: CreateMilestone[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkCreate(items, { slug, project_id: project }, allOrNone);
  }

  bulkUpdate(
    slug: string,
    project: string,
    items: BulkUpdateItem<UpdateMilestone>[],
    allOrNone = false
  ): Promise<BulkWriteResponse> {
    return this.doBulkUpdate(items, { slug, project_id: project }, allOrNone);
  }

  bulkDelete(slug: string, project: string, ids: string[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkDelete(ids, { slug, project_id: project }, allOrNone);
  }
}

export { MilestoneWorkItems } from "./WorkItems";
