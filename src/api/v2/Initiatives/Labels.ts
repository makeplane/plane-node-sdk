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

const INITIATIVE_LABELS_BRIDGE_PATH = "/workspaces/{slug}/initiatives/{initiative_id}/labels/";

/** Initiative label catalog at `ws.initiatives.labels` — `create` defines a label, `add`/`remove` put one on / take one off an initiative. */
export class InitiativeLabels extends V2Resource<InitiativeLabel, CreateInitiativeLabel, UpdateInitiativeLabel> {
  protected path = "/workspaces/{slug}/initiatives/labels/";
  protected operations: Record<string, AnyOperationId> = {
    list: "initiative_labels_list",
    retrieve: "initiative_labels_retrieve",
    create: "initiative_labels_create",
    update: "initiative_labels_partial_update",
    delete: "initiative_labels_destroy",
    manage: "initiatives_labels",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<InitiativeLabelField, "all"> & keyof InitiativeLabel>(
    params: ListInitiativeLabelsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<InitiativeLabel, F | "id">>>;
  list(params?: ListInitiativeLabelsParams): Promise<Page<InitiativeLabel>>;
  list(params?: ListInitiativeLabelsParams): Promise<Page<InitiativeLabel>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every initiative label, following pages automatically. */
  iterate(params?: ListInitiativeLabelsParams): AsyncGenerator<InitiativeLabel> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<InitiativeLabelField, "all"> & keyof InitiativeLabel>(
    labelId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<InitiativeLabel, F | "id">>;
  retrieve(labelId: string, params?: { fields?: readonly InitiativeLabelField[] }): Promise<InitiativeLabel>;
  retrieve(labelId: string, params?: { fields?: readonly InitiativeLabelField[] }): Promise<InitiativeLabel> {
    return this.doRetrieve({ pk: labelId }, params as Record<string, unknown>);
  }

  /** The one initiative label with this name; throws if none or several match. */
  findByName(name: string): Promise<InitiativeLabel> {
    return this.doFindOne({ name }, {});
  }

  create(data: CreateInitiativeLabel): Promise<InitiativeLabel> {
    return this.doCreate(data, {});
  }

  update(labelId: string, data: UpdateInitiativeLabel): Promise<InitiativeLabel> {
    return this.doUpdate(data, { pk: labelId });
  }

  delete(labelId: string): Promise<void> {
    return this.doDelete({ pk: labelId });
  }

  /** Put catalog labels on an initiative (1..100 ids); resolves to the ids actually added. */
  add(initiativeId: string, labelIds: readonly string[]): Promise<string[]> {
    return this.doBridgeAt(
      this.urlFor(INITIATIVE_LABELS_BRIDGE_PATH, { initiative_id: initiativeId }),
      "add",
      labelIds
    );
  }

  /** Take labels off an initiative (1..100 ids); the catalog entries stay. Resolves to the ids actually removed. */
  remove(initiativeId: string, labelIds: readonly string[]): Promise<string[]> {
    return this.doBridgeAt(
      this.urlFor(INITIATIVE_LABELS_BRIDGE_PATH, { initiative_id: initiativeId }),
      "remove",
      labelIds
    );
  }
}
