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
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=` on a single-row read or write. */
export interface IntakeWorkItemFieldsParams {
  fields?: readonly IntakeWorkItemField[];
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

  /**
   * One page of `IntakeWorkItem` rows. Use `iterate` to follow pages automatically.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  list<F extends Exclude<IntakeWorkItemField, "all"> & keyof IntakeWorkItem>(
    slug: string,
    project: string,
    params: ListIntakeWorkItemsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<IntakeWorkItem, F | "id">>>;
  /** One page of `IntakeWorkItem` rows. Use `iterate` to follow pages automatically. */
  list(slug: string, project: string, params?: ListIntakeWorkItemsParams): Promise<Page<IntakeWorkItem>>;
  list(slug: string, project: string, params?: ListIntakeWorkItemsParams): Promise<Page<IntakeWorkItem>> {
    return this.doList({ slug, project_id: project }, params as Record<string, unknown>);
  }

  /** Every intake item in the project, following pages automatically. */
  iterate<F extends Exclude<IntakeWorkItemField, "all"> & keyof IntakeWorkItem>(
    slug: string,
    project: string,
    params: Omit<ListIntakeWorkItemsParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<Pick<IntakeWorkItem, F | "id">>;
  /** Every intake item in the project, following pages automatically. */
  iterate(
    slug: string,
    project: string,
    params?: Omit<ListIntakeWorkItemsParams, "offset" | "count">
  ): AsyncGenerator<IntakeWorkItem>;
  iterate(
    slug: string,
    project: string,
    params?: Omit<ListIntakeWorkItemsParams, "offset" | "count">
  ): AsyncGenerator<IntakeWorkItem> {
    return this.doIterate({ slug, project_id: project }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<IntakeWorkItemField, "all"> & keyof IntakeWorkItem>(
    slug: string,
    project: string,
    intake: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<IntakeWorkItem, F | "id">>;
  retrieve(slug: string, project: string, intake: string, params?: IntakeWorkItemFieldsParams): Promise<IntakeWorkItem>;
  retrieve(
    slug: string,
    project: string,
    intake: string,
    params?: IntakeWorkItemFieldsParams
  ): Promise<IntakeWorkItem> {
    return this.doRetrieve({ slug, project_id: project, pk: intake }, params as Record<string, unknown>);
  }

  create<F extends Exclude<IntakeWorkItemField, "all"> & keyof IntakeWorkItem>(
    slug: string,
    project: string,
    data: CreateIntakeWorkItem,
    params: IntakeWorkItemFieldsParams & { fields: readonly F[] }
  ): Promise<Pick<IntakeWorkItem, F | "id">>;
  create(
    slug: string,
    project: string,
    data: CreateIntakeWorkItem,
    params?: IntakeWorkItemFieldsParams
  ): Promise<IntakeWorkItem>;
  create(
    slug: string,
    project: string,
    data: CreateIntakeWorkItem,
    params?: IntakeWorkItemFieldsParams
  ): Promise<IntakeWorkItem> {
    return this.doCreate(data, { slug, project_id: project }, params as Record<string, unknown>);
  }

  /** Ordinary field edits and/or a triage decision (`status`/`snoozed_till`/`duplicate_to_id`) in one call. */
  update<F extends Exclude<IntakeWorkItemField, "all"> & keyof IntakeWorkItem>(
    slug: string,
    project: string,
    intake: string,
    data: UpdateIntakeWorkItem,
    params: IntakeWorkItemFieldsParams & { fields: readonly F[] }
  ): Promise<Pick<IntakeWorkItem, F | "id">>;
  /** Ordinary field edits and/or a triage decision (`status`/`snoozed_till`/`duplicate_to_id`) in one call. */
  update(
    slug: string,
    project: string,
    intake: string,
    data: UpdateIntakeWorkItem,
    params?: IntakeWorkItemFieldsParams
  ): Promise<IntakeWorkItem>;
  update(
    slug: string,
    project: string,
    intake: string,
    data: UpdateIntakeWorkItem,
    params?: IntakeWorkItemFieldsParams
  ): Promise<IntakeWorkItem> {
    return this.doUpdate(data, { slug, project_id: project, pk: intake }, params as Record<string, unknown>);
  }

  delete(slug: string, project: string, intake: string): Promise<void> {
    return this.doDelete({ slug, project_id: project, pk: intake });
  }
}
