import { PlaneError } from "../../../errors/PlaneError";
import { CursorPage, OffsetPage, Page } from "../../../models/v2/common";

/** Discriminate on `pagination.style` — the API's own marker. */
export function isCursorPage<T>(page: Page<T>): page is CursorPage<T> {
  return page.pagination?.style === "cursor";
}

/** The `isCursorPage` complement, for narrowing the other way (e.g. to read `total_count`). */
export function isOffsetPage<T>(page: Page<T>): page is OffsetPage<T> {
  return page.pagination?.style !== "cursor";
}

/** Yields every row across pages, following whichever envelope came back, until a page has no successor. */
export async function* iterate<T>(
  fetch: (params: Record<string, unknown>) => Promise<Page<T>>,
  params: Record<string, unknown>
): AsyncGenerator<T> {
  const current = { ...params };
  for (;;) {
    const page = await fetch(current);
    for (const row of page.data) yield row;

    if (isCursorPage(page)) {
      if (!page.has_more || !page.next_cursor) return;
      // Forward-progress guard: a server echoing back the cursor we just sent would
      // loop forever. Silently stopping would return a truncated list as if it ended.
      if (page.next_cursor === current.cursor) {
        throw new PlaneError(
          `Pagination stalled: server returned next_cursor=${page.next_cursor} for the ` +
            `same cursor. Refusing to loop.`
        );
      }
      current.cursor = page.next_cursor;
    } else {
      if (page.next === null || page.next === undefined) return;
      if ("offset" in current && page.next === current.offset) {
        throw new PlaneError(
          `Pagination stalled: server returned next=${page.next} for the same offset. ` + `Refusing to loop.`
        );
      }
      current.offset = page.next;
    }
  }
}
