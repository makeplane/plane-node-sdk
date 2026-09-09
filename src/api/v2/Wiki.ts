import { Collections } from "./Collections";
import { WikiPages } from "./WikiPages";
import { V2Transport } from "./kernel/transport";

/**
 * A workspace's wiki; `.pages` is workspace-scoped pages, `.collections` is collection CRUD
 * — see `Collections`.
 *
 * A grouping node, not a resource: it consumes no path id of its own, so it is never a
 * navigation property on a fetched row — a row has nothing to bind into it. Both children
 * are flat and take the slug per call, so `new Wiki(transport)` is what `Workspaces`
 * attaches and both `v2.workspaces.wiki.pages.list(slug)` and
 * `v2.workspaces.wiki.collections.list(slug)` work.
 */
export class Wiki {
  public readonly pages: WikiPages;
  public readonly collections: Collections;

  constructor(transport: V2Transport) {
    this.pages = new WikiPages(transport);
    this.collections = new Collections(transport);
  }
}
