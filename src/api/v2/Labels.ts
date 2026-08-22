import { BulkUpdateItem, BulkWriteResponse, Page } from "../../models/v2/common";
import { Label, UpdateLabel, CreateLabel } from "../../models/v2/Label";
import { LabelField, LabelOrderBy } from "./generated/constants";
import { AnyOperationId, V2Resource } from "./kernel/resource";

export interface ListLabelsParams {
  fields?: readonly LabelField[];
  name?: string;
  parent_id?: string;
  parent_id__isnull?: boolean;
  external_id?: string;
  external_source?: string;
  search?: string;
  order_by?: LabelOrderBy;
  offset?: number;
  per_page?: number;
  /** `"cursor"` opts into the cursor envelope; pair with a cursor-safe `order_by` or expect a 400. */
  paginate?: "cursor";
  count?: boolean;
}

/** Project labels, reached bound to a project (`project` accepts a project id or its key, e.g. `ENG`). */
export class Labels extends V2Resource<Label, CreateLabel, UpdateLabel> {
  protected path = "/workspaces/{slug}/projects/{project_id}/labels/";
  protected operations: Record<string, AnyOperationId> = {
    list: "labels_list",
    retrieve: "labels_retrieve",
    create: "labels_create",
    update: "labels_partial_update",
    upsert: "labels_upsert",
    delete: "labels_destroy",
    bulkCreate: "labels_bulk_create",
    bulkUpdate: "labels_bulk_update",
    bulkDelete: "labels_bulk_delete",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<LabelField, "all"> & keyof Label>(
    params: ListLabelsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<Label, F | "id">>>;
  list(params?: ListLabelsParams): Promise<Page<Label>>;
  list(params?: ListLabelsParams): Promise<Page<Label>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every label, following pages automatically. */
  iterate(params?: ListLabelsParams): AsyncGenerator<Label> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<LabelField, "all"> & keyof Label>(
    labelId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<Label, F | "id">>;
  retrieve(labelId: string, params?: { fields?: readonly LabelField[] }): Promise<Label>;
  retrieve(labelId: string, params?: { fields?: readonly LabelField[] }): Promise<Label> {
    return this.doRetrieve({ pk: labelId }, params as Record<string, unknown>);
  }

  /** The one label with this name; throws if none or several match. */
  findByName(name: string): Promise<Label> {
    return this.doFindOne({ name }, {});
  }

  create(data: CreateLabel): Promise<Label> {
    return this.doCreate(data, {});
  }

  update(labelId: string, data: UpdateLabel): Promise<Label> {
    return this.doUpdate(data, { pk: labelId });
  }

  delete(labelId: string): Promise<void> {
    return this.doDelete({ pk: labelId });
  }

  /** Reconciles on (external_source, external_id) when both are set. */
  upsert(data: CreateLabel): Promise<Label> {
    return this.doUpsert(data, {});
  }

  bulkCreate(items: CreateLabel[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkCreate(items, {}, allOrNone);
  }

  bulkUpdate(items: BulkUpdateItem<UpdateLabel>[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkUpdate(items, {}, allOrNone);
  }

  bulkDelete(ids: string[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkDelete(ids, {}, allOrNone);
  }
}
