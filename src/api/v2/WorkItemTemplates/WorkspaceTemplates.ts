import { Page } from "../../../models/v2/common";
import { WorkItemTemplate, UpdateWorkItemTemplate, CreateWorkItemTemplate } from "../../../models/v2/WorkItemTemplate";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";

export type WorkspaceWorkItemTemplateField = (typeof FIELDS)["workspace_work_item_templates_list"][number];
export type WorkspaceWorkItemTemplateOrderBy = (typeof ORDER_BY)["workspace_work_item_templates_list"][number];

export interface ListWorkspaceWorkItemTemplatesParams {
  fields?: readonly WorkspaceWorkItemTemplateField[];
  is_published?: boolean;
  short_id?: string;
  search?: string;
  order_by?: WorkspaceWorkItemTemplateOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** Workspace-scoped work-item templates; same row shape as `ProjectWorkItemTemplates` but no `use`. */
export class WorkspaceWorkItemTemplates extends V2Resource<
  WorkItemTemplate,
  CreateWorkItemTemplate,
  UpdateWorkItemTemplate
> {
  protected path = "/workspaces/{slug}/work-item-templates/";
  protected operations: Record<string, OperationId> = {
    list: "workspace_work_item_templates_list",
    retrieve: "workspace_work_item_templates_retrieve",
    create: "workspace_work_item_templates_create",
    update: "workspace_work_item_templates_partial_update",
    delete: "workspace_work_item_templates_destroy",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkspaceWorkItemTemplateField, "all"> & keyof WorkItemTemplate>(
    params: ListWorkspaceWorkItemTemplatesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkItemTemplate, F | "id">>>;
  list(params?: ListWorkspaceWorkItemTemplatesParams): Promise<Page<WorkItemTemplate>>;
  list(params?: ListWorkspaceWorkItemTemplatesParams): Promise<Page<WorkItemTemplate>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every workspace template, following pages automatically. */
  iterate(params?: ListWorkspaceWorkItemTemplatesParams): AsyncGenerator<WorkItemTemplate> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkspaceWorkItemTemplateField, "all"> & keyof WorkItemTemplate>(
    templateId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkItemTemplate, F | "id">>;
  retrieve(
    templateId: string,
    params?: { fields?: readonly WorkspaceWorkItemTemplateField[] }
  ): Promise<WorkItemTemplate>;
  retrieve(
    templateId: string,
    params?: { fields?: readonly WorkspaceWorkItemTemplateField[] }
  ): Promise<WorkItemTemplate> {
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
}
