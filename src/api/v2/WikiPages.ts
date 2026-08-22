import { MultipleMatchesFoundError, NoMatchFoundError } from "../../errors/PlaneApiError";
import { Page } from "../../models/v2/common";
import { Page as WikiPage, UpdatePage, CreatePage } from "../../models/v2/Page";
import { OperationId, V2Resource } from "./kernel/resource";
import { ListWikiPagesParams, WikiPageExpand, WikiPageField } from "./Pages";

/** Workspace-scoped wiki pages (`is_global=true`) — distinct from `ProjectPages`, reusing its param/field types. */
export class WikiPages extends V2Resource<WikiPage, CreatePage, UpdatePage> {
  protected path = "/workspaces/{slug}/pages/";
  protected operations: Record<string, OperationId> = {
    list: "workspace_pages_list",
    retrieve: "workspace_pages_retrieve",
    create: "workspace_pages_create",
    update: "workspace_pages_partial_update",
    delete: "workspace_pages_destroy",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WikiPageField, "all"> & keyof WikiPage>(
    params: ListWikiPagesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WikiPage, F | "id">>>;
  list(params?: ListWikiPagesParams): Promise<Page<WikiPage>>;
  list(params?: ListWikiPagesParams): Promise<Page<WikiPage>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every global page in the workspace, following pages automatically. */
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

  /** The one wiki page with this name; throws if none or several match (filters client-side — see `ProjectPages.findByName`). */
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

  /** Omitting `collection_id` lands **public** pages in the default ("General") collection; **private** pages need one explicitly. */
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
