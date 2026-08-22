import { Collections } from "./Collections";
import { WikiPages } from "./WikiPages";
import { V2Transport } from "./kernel/transport";

/** A workspace's wiki; `.pages` is workspace-scoped pages, `.collections` is collection CRUD — see `Collections`. */
export class Wiki {
  public readonly pages: WikiPages;
  public readonly collections: Collections;

  constructor(transport: V2Transport, slug: string) {
    const scope = { slug };
    this.pages = new WikiPages(transport, scope);
    this.collections = new Collections(transport, scope);
  }
}
