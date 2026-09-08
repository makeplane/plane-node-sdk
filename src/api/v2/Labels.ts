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
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=` on a single-row read or write. */
export interface LabelFieldsParams {
  fields?: readonly LabelField[];
}

/**
 * Project labels.
 *
 * Reached flat — `v2.workspaces.projects.labels.list(slug, project)` — or from a fetched project,
 * which supplies both leading ids: `project.labels.list()`. `project` accepts a project
 * UUID or its bare identifier (e.g. `ENG`).
 */
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

  /**
   * One page of `Label` rows. Use `iterate` to follow pages automatically.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  list<F extends Exclude<LabelField, "all"> & keyof Label>(
    slug: string,
    project: string,
    params: ListLabelsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<Label, F | "id">>>;
  /** One page of `Label` rows. Use `iterate` to follow pages automatically. */
  list(slug: string, project: string, params?: ListLabelsParams): Promise<Page<Label>>;
  list(slug: string, project: string, params?: ListLabelsParams): Promise<Page<Label>> {
    return this.doList({ slug, project_id: project }, params as Record<string, unknown>);
  }

  /** Every label in the project, following pages automatically. */
  iterate<F extends Exclude<LabelField, "all"> & keyof Label>(
    slug: string,
    project: string,
    params: Omit<ListLabelsParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<Pick<Label, F | "id">>;
  /** Every label in the project, following pages automatically. */
  iterate(slug: string, project: string, params?: Omit<ListLabelsParams, "offset" | "count">): AsyncGenerator<Label>;
  iterate(slug: string, project: string, params?: Omit<ListLabelsParams, "offset" | "count">): AsyncGenerator<Label> {
    return this.doIterate({ slug, project_id: project }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<LabelField, "all"> & keyof Label>(
    slug: string,
    project: string,
    label: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<Label, F | "id">>;
  retrieve(slug: string, project: string, label: string, params?: LabelFieldsParams): Promise<Label>;
  retrieve(slug: string, project: string, label: string, params?: LabelFieldsParams): Promise<Label> {
    return this.doRetrieve({ slug, project_id: project, pk: label }, params as Record<string, unknown>);
  }

  /** The one label with this name; throws if none or several match. */
  findByName(slug: string, project: string, name: string): Promise<Label> {
    return this.doFindOne({ name }, { slug, project_id: project });
  }

  create<F extends Exclude<LabelField, "all"> & keyof Label>(
    slug: string,
    project: string,
    data: CreateLabel,
    params: LabelFieldsParams & { fields: readonly F[] }
  ): Promise<Pick<Label, F | "id">>;
  create(slug: string, project: string, data: CreateLabel, params?: LabelFieldsParams): Promise<Label>;
  create(slug: string, project: string, data: CreateLabel, params?: LabelFieldsParams): Promise<Label> {
    return this.doCreate(data, { slug, project_id: project }, params as Record<string, unknown>);
  }

  update<F extends Exclude<LabelField, "all"> & keyof Label>(
    slug: string,
    project: string,
    label: string,
    data: UpdateLabel,
    params: LabelFieldsParams & { fields: readonly F[] }
  ): Promise<Pick<Label, F | "id">>;
  update(slug: string, project: string, label: string, data: UpdateLabel, params?: LabelFieldsParams): Promise<Label>;
  update(slug: string, project: string, label: string, data: UpdateLabel, params?: LabelFieldsParams): Promise<Label> {
    return this.doUpdate(data, { slug, project_id: project, pk: label }, params as Record<string, unknown>);
  }

  delete(slug: string, project: string, label: string): Promise<void> {
    return this.doDelete({ slug, project_id: project, pk: label });
  }

  /** Reconciles on (external_source, external_id) when both are set. */
  upsert<F extends Exclude<LabelField, "all"> & keyof Label>(
    slug: string,
    project: string,
    data: CreateLabel,
    params: LabelFieldsParams & { fields: readonly F[] }
  ): Promise<Pick<Label, F | "id">>;
  /** Reconciles on (external_source, external_id) when both are set. */
  upsert(slug: string, project: string, data: CreateLabel, params?: LabelFieldsParams): Promise<Label>;
  upsert(slug: string, project: string, data: CreateLabel, params?: LabelFieldsParams): Promise<Label> {
    return this.doUpsert(data, { slug, project_id: project }, params as Record<string, unknown>);
  }

  bulkCreate(slug: string, project: string, items: CreateLabel[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkCreate(items, { slug, project_id: project }, allOrNone);
  }

  /** Each item is the patch plus the target `id`. */
  bulkUpdate(
    slug: string,
    project: string,
    items: BulkUpdateItem<UpdateLabel>[],
    allOrNone = false
  ): Promise<BulkWriteResponse> {
    return this.doBulkUpdate(items, { slug, project_id: project }, allOrNone);
  }

  bulkDelete(slug: string, project: string, ids: string[], allOrNone = false): Promise<BulkWriteResponse> {
    return this.doBulkDelete(ids, { slug, project_id: project }, allOrNone);
  }
}
