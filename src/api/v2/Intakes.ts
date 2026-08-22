import { Page } from "../../models/v2/common";
import {
  IntakeWorkItem,
  UpdateIntakeWorkItem,
  IntakeWorkItemStatus,
  CreateIntakeWorkItem,
} from "../../models/v2/IntakeWorkItem";
import { FIELDS, ORDER_BY } from "./generated/constants";
import { OperationId, V2Resource } from "./kernel/resource";

export type IntakeWorkItemField = (typeof FIELDS)["intakes_list"][number];
export type IntakeWorkItemOrderBy = (typeof ORDER_BY)["intakes_list"][number];

export interface ListIntakeWorkItemsParams {
  fields?: readonly IntakeWorkItemField[];
  search?: string;
  source?: string;
  status?: IntakeWorkItemStatus;
  status__in?: readonly IntakeWorkItemStatus[];
  work_item_id?: string;
  external_id?: string;
  external_source?: string;
  order_by?: IntakeWorkItemOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** A project's intake (triage queue) items; the wire path is `intake-issues`, kept as-is. No `upsert`/bulk endpoints. */
export class Intakes extends V2Resource<IntakeWorkItem, CreateIntakeWorkItem, UpdateIntakeWorkItem> {
  protected path = "/workspaces/{slug}/projects/{project_id}/intake-issues/";
  protected operations: Record<string, OperationId> = {
    list: "intakes_list",
    retrieve: "intakes_retrieve",
    create: "intakes_create",
    update: "intakes_partial_update",
    delete: "intakes_destroy",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<IntakeWorkItemField, "all"> & keyof IntakeWorkItem>(
    params: ListIntakeWorkItemsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<IntakeWorkItem, F | "id">>>;
  list(params?: ListIntakeWorkItemsParams): Promise<Page<IntakeWorkItem>>;
  list(params?: ListIntakeWorkItemsParams): Promise<Page<IntakeWorkItem>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every intake item in the project, following pages automatically. */
  iterate(params?: ListIntakeWorkItemsParams): AsyncGenerator<IntakeWorkItem> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<IntakeWorkItemField, "all"> & keyof IntakeWorkItem>(
    intakeWorkItemId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<IntakeWorkItem, F | "id">>;
  retrieve(intakeWorkItemId: string, params?: { fields?: readonly IntakeWorkItemField[] }): Promise<IntakeWorkItem>;
  retrieve(intakeWorkItemId: string, params?: { fields?: readonly IntakeWorkItemField[] }): Promise<IntakeWorkItem> {
    return this.doRetrieve({ pk: intakeWorkItemId }, params as Record<string, unknown>);
  }

  create(data: CreateIntakeWorkItem): Promise<IntakeWorkItem> {
    return this.doCreate(data, {});
  }

  /** Ordinary field edits and/or a triage decision (`status`/`snoozed_till`/`duplicate_to_id`) in one call. */
  update(intakeWorkItemId: string, data: UpdateIntakeWorkItem): Promise<IntakeWorkItem> {
    return this.doUpdate(data, { pk: intakeWorkItemId });
  }

  delete(intakeWorkItemId: string): Promise<void> {
    return this.doDelete({ pk: intakeWorkItemId });
  }
}
