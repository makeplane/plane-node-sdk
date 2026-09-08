import { MultipleMatchesFoundError, NoMatchFoundError } from "../../errors/PlaneApiError";
import { Page } from "../../models/v2/common";
import { Page as WikiPage, UpdatePage, CreatePage } from "../../models/v2/Page";
import { OperationId, V2Resource } from "./kernel/resource";
import { ListWikiPagesParams, WikiPageExpand, WikiPageField, WikiPageShapeParams } from "./Pages";

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
    slug: string,
    params: ListWikiPagesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WikiPage, F | "id">>>;
  list(slug: string, params?: ListWikiPagesParams): Promise<Page<WikiPage>>;
  list(slug: string, params?: ListWikiPagesParams): Promise<Page<WikiPage>> {
    return this.doList({ slug }, params as Record<string, unknown>);
  }

  /** Every global page in the workspace, following pages automatically. */
  iterate<F extends Exclude<WikiPageField, "all"> & keyof WikiPage>(
    slug: string,
    params: Omit<ListWikiPagesParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<Pick<WikiPage, F | "id">>;
  iterate(slug: string, params?: Omit<ListWikiPagesParams, "offset" | "count">): AsyncGenerator<WikiPage>;
  iterate(slug: string, params?: Omit<ListWikiPagesParams, "offset" | "count">): AsyncGenerator<WikiPage> {
    return this.doIterate({ slug }, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WikiPageField, "all"> & keyof WikiPage>(
    slug: string,
    page: string,
    params: { fields: readonly F[]; expand?: readonly WikiPageExpand[] }
  ): Promise<Pick<WikiPage, F | "id">>;
  retrieve(slug: string, page: string, params?: WikiPageShapeParams): Promise<WikiPage>;
  retrieve(slug: string, page: string, params?: WikiPageShapeParams): Promise<WikiPage> {
    return this.doRetrieve({ slug, pk: page }, params as Record<string, unknown>);
  }

  /** The one wiki page with this name; throws if none or several match (filters client-side — see `ProjectPages.findByName`). */
  async findByName(slug: string, name: string): Promise<WikiPage> {
    const matches: WikiPage[] = [];
    for await (const row of this.iterate(slug)) {
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
  create<F extends Exclude<WikiPageField, "all"> & keyof WikiPage>(
    slug: string,
    data: CreatePage,
    params: WikiPageShapeParams & { fields: readonly F[] }
  ): Promise<Pick<WikiPage, F | "id">>;
  create(slug: string, data: CreatePage, params?: WikiPageShapeParams): Promise<WikiPage>;
  create(slug: string, data: CreatePage, params?: WikiPageShapeParams): Promise<WikiPage> {
    return this.doCreate(data, { slug }, params as Record<string, unknown>);
  }

  update<F extends Exclude<WikiPageField, "all"> & keyof WikiPage>(
    slug: string,
    page: string,
    data: UpdatePage,
    params: WikiPageShapeParams & { fields: readonly F[] }
  ): Promise<Pick<WikiPage, F | "id">>;
  update(slug: string, page: string, data: UpdatePage, params?: WikiPageShapeParams): Promise<WikiPage>;
  update(slug: string, page: string, data: UpdatePage, params?: WikiPageShapeParams): Promise<WikiPage> {
    return this.doUpdate(data, { slug, pk: page }, params as Record<string, unknown>);
  }

  delete(slug: string, page: string): Promise<void> {
    return this.doDelete({ slug, pk: page });
  }
}
