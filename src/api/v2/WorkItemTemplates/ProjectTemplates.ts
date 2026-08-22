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
    params: ListProjectWorkItemTemplatesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItemTemplate, F | "id">>>;
  list(params?: ListProjectWorkItemTemplatesParams): Promise<Page<WorkItemTemplate>>;
  list(params?: ListProjectWorkItemTemplatesParams): Promise<Page<WorkItemTemplate>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every template in the project, following pages automatically. */
  iterate(params?: ListProjectWorkItemTemplatesParams): AsyncGenerator<WorkItemTemplate> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkItemTemplateField, "all"> & keyof WorkItemTemplate>(
    templateId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkItemTemplate, F | "id">>;
  retrieve(templateId: string, params?: { fields?: readonly WorkItemTemplateField[] }): Promise<WorkItemTemplate>;
  retrieve(templateId: string, params?: { fields?: readonly WorkItemTemplateField[] }): Promise<WorkItemTemplate> {
    return this.doRetrieve({ pk: templateId }, params as Record<string, unknown>);
  }

  create(data: CreateWorkItemTemplate): Promise<WorkItemTemplate> {
    return this.doCreate(data, {});
  }

  update(templateId: string, data: UpdateWorkItemTemplate): Promise<WorkItemTemplate> {
    return this.doUpdate(data, { pk: templateId });
  }

  delete(templateId: string): Promise<void> {
    return this.doDelete({ pk: templateId });
  }

  /** Instantiate a work item from this template; omit `data` to use its seed data as-is, or override with `name`/`project_id`. */
  // Declared `async` so a synchronous throw from `this.query(...)` (invalid `fields`/
  // `expand`) rejects the returned promise instead of escaping the call.
  async use(
    templateId: string,
    data?: WorkItemTemplateUseRequest,
    params?: { fields?: readonly WorkItemTemplateUseField[]; expand?: readonly WorkItemTemplateUseExpand[] }
  ): Promise<WorkItem> {
    return this.transport.request<WorkItem>("POST", `${this.detailUrl({ pk: templateId })}use/`, {
      params: this.query(params as Record<string, unknown>, "use"),
      data,
    });
  }
}
