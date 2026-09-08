import { Collections } from "./Collections";
import { WikiPages } from "./WikiPages";
import { V2Transport } from "./kernel/transport";

/**
 * A workspace's wiki; `.pages` is workspace-scoped pages, `.collections` is collection CRUD
 * — see `Collections`.
 *
 * A grouping node, not a resource: it consumes no path id of its own, so it is never a
 * navigation property on a fetched row. Its two children are at different stages of the
 * migration, which is why `slug` is optional. `WikiPages` is flat and takes the slug per
 * call, so `new Wiki(transport)` is what `Workspaces` attaches and
 * `v2.workspaces.wiki.pages.list(slug)` works. `Collections` is still pre-flat and reads
 * `{slug}` from the retired scope, so it only works off the locator
 * (`v2.workspace(slug).wiki.collections`) until task 3 migrates it — recorded, with that
 * reason, in `tests/unit/v2/workspace-band.test.ts`.
 */
export class Wiki {
  public readonly pages: WikiPages;
  public readonly collections: Collections;

  constructor(transport: V2Transport, slug?: string) {
    const scope: Record<string, string> = slug === undefined ? {} : { slug };
    this.pages = new WikiPages(transport, scope);
    this.collections = new Collections(transport, scope);
  }
}
