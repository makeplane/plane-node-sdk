import { Page } from "../../../models/v2/common";
import { Initiative, UpdateInitiative, InitiativeState, CreateInitiative } from "../../../models/v2/Initiative";
import { EXPAND, FIELDS, ORDER_BY } from "../generated/constants";
import { LoadedMeta, LoadsNavigableRows, NavigationFactories, owned } from "../kernel/loaded";
import { AnyOperationId } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import { INITIATIVE_ID_NAMES, LoadedInitiative, LoadedInitiativeRow, InitiativeNavigation } from "../loaded/Initiative";
import { InitiativeLabels } from "./Labels";
import { InitiativeProjects } from "./Projects";
import { InitiativeWorkItems } from "./WorkItems";

export type InitiativeField = (typeof FIELDS)["initiatives_list"][number];
export type InitiativeOrderBy = (typeof ORDER_BY)["initiatives_list"][number];
/** Only `"lead"` is expandable on this resource. */
export type InitiativeExpand = (typeof EXPAND)["initiatives_list"][number];

export interface ListInitiativesParams {
  fields?: readonly InitiativeField[];
  expand?: readonly InitiativeExpand[];
  name?: string;
  lead_id?: string;
  state?: InitiativeState;
  state__in?: readonly InitiativeState[];
  search?: string;
  order_by?: InitiativeOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=`/`?expand=` on a single-row read or write. */
export interface InitiativeShapeParams {
  fields?: readonly InitiativeField[];
  expand?: readonly InitiativeExpand[];
}

/** Workspace initiatives — workspace-scoped (no `project_id` segment); `labels`/`projects`/`workItems` carry the memberships. */
export class Initiatives extends LoadsNavigableRows<
  Initiative,
  CreateInitiative,
  UpdateInitiative,
  InitiativeNavigation
> {
  protected path = "/workspaces/{slug}/initiatives/";
  protected operations: Record<string, AnyOperationId> = {
    list: "initiatives_list",
    retrieve: "initiatives_retrieve",
    create: "initiatives_create",
    update: "initiatives_partial_update",
    delete: "initiatives_destroy",
  };
  protected loadedIdNames = INITIATIVE_ID_NAMES;

  /** Label catalog plus `add`/`remove` of labels on an initiative — see {@link InitiativeLabels}. */
  public labels: InitiativeLabels;
  /** `add`/`remove` projects on an initiative — see {@link InitiativeProjects}. */
  public projects: InitiativeProjects;
  /** `add`/`remove` work items on an initiative — see {@link InitiativeWorkItems}. */
  public workItems: InitiativeWorkItems;

  constructor(transport: V2Transport) {
    super(transport);
    this.labels = new InitiativeLabels(transport);
    this.projects = new InitiativeProjects(transport);
    this.workItems = new InitiativeWorkItems(transport);
  }

  protected navigationOf(meta: LoadedMeta): NavigationFactories<InitiativeNavigation> {
    const ids = meta.ids as [string, string];
    return {
      labels: () => owned(this.labels, ids, meta.idNames),
      projects: () => owned(this.projects, ids, meta.idNames),
      workItems: () => owned(this.workItems, ids, meta.idNames),
    };
  }

  /**
   * One page of `Initiative` rows. Use `iterate` to follow pages automatically.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  list<F extends Exclude<InitiativeField, "all"> & keyof Initiative>(
    slug: string,
    params: ListInitiativesParams & { fields: readonly F[] }
  ): Promise<Page<LoadedInitiativeRow<Pick<Initiative, F | "id">>>>;
  /** One page of `Initiative` rows. Use `iterate` to follow pages automatically. */
  list(slug: string, params?: ListInitiativesParams): Promise<Page<LoadedInitiative>>;
  async list(slug: string, params?: ListInitiativesParams): Promise<Page<LoadedInitiative>> {
    const page = await this.doList({ slug }, params as Record<string, unknown>);
    return this.loadPage(page, [slug], params?.fields);
  }

  /** Every initiative, following pages automatically. */
  iterate<F extends Exclude<InitiativeField, "all"> & keyof Initiative>(
    slug: string,
    params: Omit<ListInitiativesParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<LoadedInitiativeRow<Pick<Initiative, F | "id">>>;
  /** Every initiative, following pages automatically. */
  iterate(slug: string, params?: Omit<ListInitiativesParams, "offset" | "count">): AsyncGenerator<LoadedInitiative>;
  iterate(slug: string, params?: Omit<ListInitiativesParams, "offset" | "count">): AsyncGenerator<LoadedInitiative> {
    return this.loadIterate(this.doIterate({ slug }, params as Record<string, unknown>), [slug], params?.fields);
  }

  retrieve<F extends Exclude<InitiativeField, "all"> & keyof Initiative>(
    slug: string,
    initiative: string,
    params: { fields: readonly F[]; expand?: readonly InitiativeExpand[] }
  ): Promise<LoadedInitiativeRow<Pick<Initiative, F | "id">>>;
  retrieve(slug: string, initiative: string, params?: InitiativeShapeParams): Promise<LoadedInitiative>;
  async retrieve(slug: string, initiative: string, params?: InitiativeShapeParams): Promise<LoadedInitiative> {
    const row = await this.doRetrieve({ slug, pk: initiative }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  /** The one initiative with this name; throws if none or several match. */
  async findByName(slug: string, name: string): Promise<LoadedInitiative> {
    const row = await this.doFindOne({ name }, { slug });
    return this.load(row, [slug]);
  }

  create<F extends Exclude<InitiativeField, "all"> & keyof Initiative>(
    slug: string,
    data: CreateInitiative,
    params: InitiativeShapeParams & { fields: readonly F[] }
  ): Promise<LoadedInitiativeRow<Pick<Initiative, F | "id">>>;
  create(slug: string, data: CreateInitiative, params?: InitiativeShapeParams): Promise<LoadedInitiative>;
  async create(slug: string, data: CreateInitiative, params?: InitiativeShapeParams): Promise<LoadedInitiative> {
    const row = await this.doCreate(data, { slug }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  update<F extends Exclude<InitiativeField, "all"> & keyof Initiative>(
    slug: string,
    initiative: string,
    data: UpdateInitiative,
    params: InitiativeShapeParams & { fields: readonly F[] }
  ): Promise<LoadedInitiativeRow<Pick<Initiative, F | "id">>>;
  update(
    slug: string,
    initiative: string,
    data: UpdateInitiative,
    params?: InitiativeShapeParams
  ): Promise<LoadedInitiative>;
  async update(
    slug: string,
    initiative: string,
    data: UpdateInitiative,
    params?: InitiativeShapeParams
  ): Promise<LoadedInitiative> {
    const row = await this.doUpdate(data, { slug, pk: initiative }, params as Record<string, unknown>);
    return this.load(row, [slug], params?.fields);
  }

  delete(slug: string, initiative: string): Promise<void> {
    return this.doDelete({ slug, pk: initiative });
  }
}

export { InitiativeLabels } from "./Labels";
export { InitiativeProjects } from "./Projects";
export { InitiativeWorkItems } from "./WorkItems";
export type { InitiativeLabelField, InitiativeLabelOrderBy, ListInitiativeLabelsParams } from "./Labels";
