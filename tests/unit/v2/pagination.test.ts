import { iterate, isCursorPage } from "../../../src/api/v2/kernel/pagination";
import { Page } from "../../../src/models/v2/common";
import { PlaneError } from "../../../src/errors/PlaneError";

interface Row {
  id: string;
}

describe("pagination", () => {
  it("discriminates on pagination.style", () => {
    const offset: Page<Row> = { data: [], pagination: { style: "offset" } };
    const cursor: Page<Row> = { data: [], pagination: { style: "cursor" } };

    expect(isCursorPage(offset)).toBe(false);
    expect(isCursorPage(cursor)).toBe(true);
  });

  it("follows offset pages by echoing next into offset", async () => {
    const pages: Page<Row>[] = [
      { data: [{ id: "1" }], pagination: { style: "offset" }, next: 1 },
      { data: [{ id: "2" }], pagination: { style: "offset" }, next: null },
    ];
    const seen: Record<string, unknown>[] = [];

    const fetch = async (params: Record<string, unknown>) => {
      seen.push({ ...params });
      return pages[seen.length - 1];
    };

    const ids: string[] = [];
    for await (const row of iterate(fetch, {})) ids.push(row.id);

    expect(ids).toEqual(["1", "2"]);
    expect(seen[1].offset).toBe(1);
  });

  it("follows cursor pages by echoing next_cursor into cursor", async () => {
    const pages: Page<Row>[] = [
      { data: [{ id: "1" }], pagination: { style: "cursor" }, has_more: true, next_cursor: "c1" },
      { data: [{ id: "2" }], pagination: { style: "cursor" }, has_more: false, next_cursor: null },
    ];
    const seen: Record<string, unknown>[] = [];

    const fetch = async (params: Record<string, unknown>) => {
      seen.push({ ...params });
      return pages[seen.length - 1];
    };

    const ids: string[] = [];
    for await (const row of iterate(fetch, { paginate: "cursor" })) ids.push(row.id);

    expect(ids).toEqual(["1", "2"]);
    expect(seen[1].cursor).toBe("c1");
  });
  it("throws PlaneError when the server echoes the same offset (stalled)", async () => {
    const pages: Page<Row>[] = [
      { data: [{ id: "1" }], pagination: { style: "offset" }, next: 1 },
      { data: [{ id: "2" }], pagination: { style: "offset" }, next: 1 },
    ];
    const seen: Record<string, unknown>[] = [];

    const fetch = async (params: Record<string, unknown>) => {
      seen.push({ ...params });
      return pages[seen.length - 1];
    };

    let caught: unknown;
    try {
      for await (const _row of iterate(fetch, {})) {
        // drain
      }
    } catch (err) {
      caught = err;
    }

    expect(caught).toBeInstanceOf(PlaneError);
    expect((caught as Error).message).toMatch(/next=1/);
  });

  it("throws PlaneError when the server echoes the same cursor (stalled)", async () => {
    const pages: Page<Row>[] = [
      { data: [{ id: "1" }], pagination: { style: "cursor" }, has_more: true, next_cursor: "c1" },
      { data: [{ id: "2" }], pagination: { style: "cursor" }, has_more: true, next_cursor: "c1" },
    ];
    const seen: Record<string, unknown>[] = [];

    const fetch = async (params: Record<string, unknown>) => {
      seen.push({ ...params });
      return pages[seen.length - 1];
    };

    let caught: unknown;
    try {
      for await (const _row of iterate(fetch, { paginate: "cursor" })) {
        // drain
      }
    } catch (err) {
      caught = err;
    }

    expect(caught).toBeInstanceOf(PlaneError);
    expect((caught as Error).message).toMatch(/next_cursor=c1/);
  });

  it("does not treat a first-page next: 0 as a stall", async () => {
    const pages: Page<Row>[] = [
      { data: [{ id: "1" }], pagination: { style: "offset" }, next: 0 },
      { data: [{ id: "2" }], pagination: { style: "offset" }, next: null },
    ];
    const seen: Record<string, unknown>[] = [];

    const fetch = async (params: Record<string, unknown>) => {
      seen.push({ ...params });
      return pages[seen.length - 1];
    };

    const ids: string[] = [];
    for await (const row of iterate(fetch, {})) ids.push(row.id);

    expect(ids).toEqual(["1", "2"]);
    expect(seen[0].offset).toBeUndefined();
    expect(seen[1].offset).toBe(0);
  });
});
