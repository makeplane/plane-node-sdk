import { Page } from "../../../models/v2/common";
import { InitiativeLabel, UpdateInitiativeLabel, CreateInitiativeLabel } from "../../../models/v2/InitiativeLabel";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";

export type InitiativeLabelField = (typeof FIELDS)["initiative_labels_list"][number];
export type InitiativeLabelOrderBy = (typeof ORDER_BY)["initiative_labels_list"][number];

export interface ListInitiativeLabelsParams {
  fields?: readonly InitiativeLabelField[];
  name?: string;
  search?: string;
  order_by?: InitiativeLabelOrderBy;
  offset?: number;
  per_page?: number;
  /** `"cursor"` needs a cursor-safe `order_by` (e.g. `"created_at"`) or it 400s. */
  paginate?: "cursor";
  count?: boolean;
}

/** `?fields=` on a single-row read or write. The golden declares no `?expand=` on this family. */
export interface InitiativeLabelShapeParams {
  fields?: readonly InitiativeLabelField[];
}

/** Initiative label catalog at `ws.initiatives.labels` — `create` defines a label, `add`/`remove` put one on / take one off an initiative. */
export class InitiativeLabels extends V2Resource<InitiativeLabel, CreateInitiativeLabel, UpdateInitiativeLabel> {
  protected path = "/workspaces/{slug}/initiatives/labels/";
  protected extraPaths = {
    // The per-initiative bridge, a different route from this catalog's own collection —
    // `urlFor` picks it for `add`/`remove` and the sweeps read the same template.
    add: "/workspaces/{slug}/initiatives/{initiative_id}/labels/",
    remove: "/workspaces/{slug}/initiatives/{initiative_id}/labels/",
  };
  protected operations: Record<string, AnyOperationId> = {
    list: "initiative_labels_list",
    retrieve: "initiative_labels_retrieve",
    create: "initiative_labels_create",
    update: "initiative_labels_partial_update",
    delete: "initiative_labels_destroy",
    // One operation, two verbs — see `CycleWorkItems.operations`.
    add: "initiatives_labels",
    remove: "initiatives_labels",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<InitiativeLabelField, "all"> & keyof InitiativeLabel>(
    slug: string,
    params: ListInitiativeLabelsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<InitiativeLabel, F | "id">>>;
  list(slug: string, params?: ListInitiativeLabelsParams): Promise<Page<InitiativeLabel>>;
  list(slug: string, params?: ListInitiativeLabelsParams): Promise<Page<InitiativeLabel>> {
    return this.doList({ slug }, params as Record<string, unknown>);
  }

  /** Every initiative label, following pages automatically. */
  iterate<F extends Exclude<InitiativeLabelField, "all"> & keyof InitiativeLabel>(
    slug: string,
    params: ListInitiativeLabelsParams & { fields: readonly F[] }
  ): AsyncGenerator<Pick<InitiativeLabel, F | "id">>;
  iterate(slug: string, params?: ListInitiativeLabelsParams): AsyncGenerator<InitiativeLabel>;
  iterate(slug: string, params?: ListInitiativeLabelsParams): AsyncGenerator<InitiativeLabel> {
    return this.doIterate({ slug }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<InitiativeLabelField, "all"> & keyof InitiativeLabel>(
    slug: string,
    label: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<InitiativeLabel, F | "id">>;
  retrieve(
    slug: string,
    label: string,
    params?: { fields?: readonly InitiativeLabelField[] }
  ): Promise<InitiativeLabel>;
  retrieve(
    slug: string,
    label: string,
    params?: { fields?: readonly InitiativeLabelField[] }
  ): Promise<InitiativeLabel> {
    return this.doRetrieve({ slug, pk: label }, params as Record<string, unknown>);
  }

  /** The one initiative label with this name; throws if none or several match. */
  findByName(slug: string, name: string): Promise<InitiativeLabel> {
    return this.doFindOne({ name }, { slug });
  }

  create(slug: string, data: CreateInitiativeLabel, params?: InitiativeLabelShapeParams): Promise<InitiativeLabel> {
    return this.doCreate(data, { slug }, params as Record<string, unknown>);
  }

  update(
    slug: string,
    label: string,
    data: UpdateInitiativeLabel,
    params?: InitiativeLabelShapeParams
  ): Promise<InitiativeLabel> {
    return this.doUpdate(data, { slug, pk: label }, params as Record<string, unknown>);
  }

  delete(slug: string, label: string): Promise<void> {
    return this.doDelete({ slug, pk: label });
  }

  /** Put catalog labels on an initiative (1..100 ids); resolves to the ids actually added. */
  add(slug: string, initiative: string, labelIds: readonly string[]): Promise<string[]> {
    return this.doBridge("add", labelIds, { slug, initiative_id: initiative });
  }

  /** Take labels off an initiative (1..100 ids); the catalog entries stay. Resolves to the ids actually removed. */
  remove(slug: string, initiative: string, labelIds: readonly string[]): Promise<string[]> {
    return this.doBridge("remove", labelIds, { slug, initiative_id: initiative });
  }
}
