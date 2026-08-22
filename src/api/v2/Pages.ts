import { MultipleMatchesFoundError, NoMatchFoundError } from "../../errors/PlaneApiError";
import { Page } from "../../models/v2/common";
import { Page as WikiPage, PageAccess, UpdatePage, PageTypeFilter, CreatePage } from "../../models/v2/Page";
import { EXPAND, FIELDS, ORDER_BY } from "./generated/constants";
import { OperationId, V2Resource } from "./kernel/resource";

export type WikiPageField = (typeof FIELDS)["project_pages_list"][number];
export type WikiPageOrderBy = (typeof ORDER_BY)["project_pages_list"][number];
export type WikiPageExpand = (typeof EXPAND)["project_pages_list"][number];

/** Shared with {@link WikiPages} — same `fields`/`order_by`/`expand` params cover both scopes. */
export interface ListWikiPagesParams {
  fields?: readonly WikiPageField[];
  expand?: readonly WikiPageExpand[];
  access?: PageAccess;
  collection_id?: string;
  external_id?: string;
  external_source?: string;
  is_global?: boolean;
  is_locked?: boolean;
  owned_by_id?: string;
  parent_id?: string;
  search?: string;
  type?: PageTypeFilter;
  order_by?: WikiPageOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** Project-scoped wiki pages, reached via `client.v2.workspace(slug).project(project).pages`; workspace-scoped sibling is {@link WikiPages}. */
export class ProjectPages extends V2Resource<WikiPage, CreatePage, UpdatePage> {
  protected path = "/workspaces/{slug}/projects/{project_id}/pages/";
  protected operations: Record<string, OperationId> = {
    list: "project_pages_list",
    retrieve: "project_pages_retrieve",
    create: "project_pages_create",
    update: "project_pages_partial_update",
    delete: "project_pages_destroy",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WikiPageField, "all"> & keyof WikiPage>(
    params: ListWikiPagesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WikiPage, F | "id">>>;
  list(params?: ListWikiPagesParams): Promise<Page<WikiPage>>;
  list(params?: ListWikiPagesParams): Promise<Page<WikiPage>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every page in the project, following pages automatically. */
  iterate(params?: ListWikiPagesParams): AsyncGenerator<WikiPage> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WikiPageField, "all"> & keyof WikiPage>(
    pageId: string,
    params: { fields: readonly F[]; expand?: readonly WikiPageExpand[] }
  ): Promise<Pick<WikiPage, F | "id">>;
  retrieve(
    pageId: string,
    params?: { fields?: readonly WikiPageField[]; expand?: readonly WikiPageExpand[] }
  ): Promise<WikiPage>;
  retrieve(
    pageId: string,
    params?: { fields?: readonly WikiPageField[]; expand?: readonly WikiPageExpand[] }
  ): Promise<WikiPage> {
    return this.doRetrieve({ pk: pageId }, params as Record<string, unknown>);
  }

  /** The one page with this name; throws if none or several match. Filters client-side — `search` is fuzzy, not exact. */
  async findByName(name: string): Promise<WikiPage> {
    const matches: WikiPage[] = [];
    for await (const row of this.iterate()) {
      if (row.name === name) matches.push(row);
    }
    if (matches.length === 0) {
      throw new NoMatchFoundError(`No ${this.constructor.name} matched name=${JSON.stringify(name)}.`);
    }
    if (matches.length > 1) {
      throw new MultipleMatchesFoundError(
        `Multiple rows matched name=${JSON.stringify(name)}; use the id instead, or list to see every match.`
      );
    }
    return matches[0];
  }

  /** Omitting `collection_id` lands a **public** page in the default ("General") collection; **private** pages need one explicitly. */
  create(
    data: CreatePage,
    params?: { fields?: readonly WikiPageField[]; expand?: readonly WikiPageExpand[] }
  ): Promise<WikiPage> {
    return this.doCreate(data, {}, params as Record<string, unknown>);
  }

  update(
    pageId: string,
    data: UpdatePage,
    params?: { fields?: readonly WikiPageField[]; expand?: readonly WikiPageExpand[] }
  ): Promise<WikiPage> {
    return this.doUpdate(data, { pk: pageId }, params as Record<string, unknown>);
  }

  delete(pageId: string): Promise<void> {
    return this.doDelete({ pk: pageId });
  }
}
