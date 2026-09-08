import { Page } from "../../../models/v2/common";
import { WorkItem } from "../../../models/v2/WorkItem";
import {
  WorkItemTemplate,
  UpdateWorkItemTemplate,
  WorkItemTemplateUseRequest,
  CreateWorkItemTemplate,
} from "../../../models/v2/WorkItemTemplate";
import { EXPAND, FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";

export type WorkItemTemplateField = (typeof FIELDS)["project_work_item_templates_list"][number];
export type WorkItemTemplateOrderBy = (typeof ORDER_BY)["project_work_item_templates_list"][number];
/** The row shape `POST .../use/` returns — a different, narrower field set than the template row itself. */
export type WorkItemTemplateUseField = (typeof FIELDS)["work_items_use"][number];
export type WorkItemTemplateUseExpand = (typeof EXPAND)["work_items_use"][number];

export interface ListProjectWorkItemTemplatesParams {
  fields?: readonly WorkItemTemplateField[];
  is_published?: boolean;
  short_id?: string;
  search?: string;
  order_by?: WorkItemTemplateOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** `?fields=` on a single-row read or write. */
export interface WorkItemTemplateFieldsParams {
  fields?: readonly WorkItemTemplateField[];
}

/** `?fields=`/`?expand=` on the work item `use` mints — a different, narrower set than the template row's own. */
export interface WorkItemTemplateUseParams {
  fields?: readonly WorkItemTemplateUseField[];
  expand?: readonly WorkItemTemplateUseExpand[];
}

/** Project-scoped work-item templates; `use` instantiates one in a single call. `WorkspaceWorkItemTemplates` has no `use`. */
export class ProjectWorkItemTemplates extends V2Resource<
  WorkItemTemplate,
  CreateWorkItemTemplate,
  UpdateWorkItemTemplate
> {
  protected path = "/workspaces/{slug}/projects/{project_id}/work-item-templates/";
  protected operations: Record<string, OperationId> = {
    list: "project_work_item_templates_list",
    retrieve: "project_work_item_templates_retrieve",
    create: "project_work_item_templates_create",
    update: "project_work_item_templates_partial_update",
    use: "work_items_use",
    delete: "project_work_item_templates_destroy",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkItemTemplateField, "all"> & keyof WorkItemTemplate>(
    slug: string,
    project: string,
    params: ListProjectWorkItemTemplatesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItemTemplate, F | "id">>>;
  list(slug: string, project: string, params?: ListProjectWorkItemTemplatesParams): Promise<Page<WorkItemTemplate>>;
  list(slug: string, project: string, params?: ListProjectWorkItemTemplatesParams): Promise<Page<WorkItemTemplate>> {
    return this.doList({ slug, project_id: project }, params as Record<string, unknown>);
  }

  /** Every template in the project, following pages automatically. */
  iterate<F extends Exclude<WorkItemTemplateField, "all"> & keyof WorkItemTemplate>(
    slug: string,
    project: string,
    params: ListProjectWorkItemTemplatesParams & { fields: readonly F[] }
  ): AsyncGenerator<Pick<WorkItemTemplate, F | "id">>;
  iterate(slug: string, project: string, params?: ListProjectWorkItemTemplatesParams): AsyncGenerator<WorkItemTemplate>;
  iterate(
    slug: string,
    project: string,
    params?: ListProjectWorkItemTemplatesParams
  ): AsyncGenerator<WorkItemTemplate> {
    return this.doIterate({ slug, project_id: project }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkItemTemplateField, "all"> & keyof WorkItemTemplate>(
    slug: string,
    project: string,
    template: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkItemTemplate, F | "id">>;
  retrieve(
    slug: string,
    project: string,
    template: string,
    params?: WorkItemTemplateFieldsParams
  ): Promise<WorkItemTemplate>;
  retrieve(
    slug: string,
    project: string,
    template: string,
    params?: WorkItemTemplateFieldsParams
  ): Promise<WorkItemTemplate> {
    return this.doRetrieve({ slug, project_id: project, pk: template }, params as Record<string, unknown>);
  }

  create<F extends Exclude<WorkItemTemplateField, "all"> & keyof WorkItemTemplate>(
    slug: string,
    project: string,
    data: CreateWorkItemTemplate,
    params: WorkItemTemplateFieldsParams & { fields: readonly F[] }
  ): Promise<Pick<WorkItemTemplate, F | "id">>;
  create(
    slug: string,
    project: string,
    data: CreateWorkItemTemplate,
    params?: WorkItemTemplateFieldsParams
  ): Promise<WorkItemTemplate>;
  create(
    slug: string,
    project: string,
    data: CreateWorkItemTemplate,
    params?: WorkItemTemplateFieldsParams
  ): Promise<WorkItemTemplate> {
    return this.doCreate(data, { slug, project_id: project }, params as Record<string, unknown>);
  }

  update<F extends Exclude<WorkItemTemplateField, "all"> & keyof WorkItemTemplate>(
    slug: string,
    project: string,
    template: string,
    data: UpdateWorkItemTemplate,
    params: WorkItemTemplateFieldsParams & { fields: readonly F[] }
  ): Promise<Pick<WorkItemTemplate, F | "id">>;
  update(
    slug: string,
    project: string,
    template: string,
    data: UpdateWorkItemTemplate,
    params?: WorkItemTemplateFieldsParams
  ): Promise<WorkItemTemplate>;
  update(
    slug: string,
    project: string,
    template: string,
    data: UpdateWorkItemTemplate,
    params?: WorkItemTemplateFieldsParams
  ): Promise<WorkItemTemplate> {
    return this.doUpdate(data, { slug, project_id: project, pk: template }, params as Record<string, unknown>);
  }

  delete(slug: string, project: string, template: string): Promise<void> {
    return this.doDelete({ slug, project_id: project, pk: template });
  }

  /**
   * Instantiate a work item from this template; omit `data` to use its seed data as-is,
   * or override with `name`/`project_id`.
   *
   * The response is a {@link WorkItem}, not a template row, so this goes through the
   * kernel's custom-action helper rather than `doAction`.
   */
  use<F extends Exclude<WorkItemTemplateUseField, "all"> & keyof WorkItem>(
    slug: string,
    project: string,
    template: string,
    data: WorkItemTemplateUseRequest | undefined,
    params: WorkItemTemplateUseParams & { fields: readonly F[] }
  ): Promise<Pick<WorkItem, F | "id">>;
  use(
    slug: string,
    project: string,
    template: string,
    data?: WorkItemTemplateUseRequest,
    params?: WorkItemTemplateUseParams
  ): Promise<WorkItem>;
  use(
    slug: string,
    project: string,
    template: string,
    data?: WorkItemTemplateUseRequest,
    params?: WorkItemTemplateUseParams
  ): Promise<WorkItem> {
    return this.doCustomAction<WorkItem>("use", {
      pathParams: { slug, project_id: project },
      pk: template,
      data,
      params: params as Record<string, unknown>,
    });
  }
}
