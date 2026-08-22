/**
 * Cursor pagination needs an explicit cursor-safe `order_by`; default ordering 400s `ordering_not_cursor_eligible` (deliberate, see errors.e2e.test.ts).
 */
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { SPECS } from "./support/specs";
import { useV2Project } from "./support/suite";

const ROW_COUNT = 4;
const PER_PAGE = 2; // forces at least 2 pages over ROW_COUNT rows

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 pagination (live)", () => {
  const suite = useV2Project("page", env);

  describe.each(SPECS)("$key", (spec) => {
    // Starts empty (not unassigned) so afterAll's bulkDelete never runs on
    // undefined if beforeAll's bulkCreate throws first.
    let ids: string[] = [];
    let marker: string;

    beforeAll(async () => {
      const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
      marker = uniqueName(`${spec.key}-pg`);
      const items = Array.from({ length: ROW_COUNT }, (_, i) =>
        spec.makeWrite(uniqueName(`${spec.key}-pg-row`), { external_source: marker, external_id: String(i) })
      );
      const result = await ops.bulkCreate(items);
      ids = result.results.map((row) => row.id!);
    });

    afterAll(async () => {
      if (ids.length === 0) return;
      const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
      await ops.bulkDelete(ids);
    });

    it("offset: one page reports a next offset and total_count", async () => {
      const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
      const page = await ops.list({ external_source: marker, per_page: PER_PAGE });
      expect(page.data).toHaveLength(PER_PAGE);
      expect("next" in page && page.next).not.toBeNull();
      expect("total_count" in page && page.total_count).toBe(ROW_COUNT);
    });

    it("offset: iterate() follows every page", async () => {
      const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
      const rows = [];
      for await (const row of ops.iterate({ external_source: marker, per_page: PER_PAGE })) rows.push(row);
      expect(new Set(rows.map((r) => r.id))).toEqual(new Set(ids));
    });

    it("cursor: one page uses the cursor envelope (with an explicit order_by)", async () => {
      const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
      const page = await ops.list({
        external_source: marker,
        per_page: PER_PAGE,
        paginate: "cursor",
        order_by: "created_at",
      });
      expect(page.data).toHaveLength(PER_PAGE);
      expect("has_more" in page && page.has_more).toBe(true);
      expect("next_cursor" in page && page.next_cursor).toBeTruthy();
    });

    it("cursor: iterate() follows every page (with an explicit order_by)", async () => {
      const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
      const rows = [];
      for await (const row of ops.iterate({
        external_source: marker,
        per_page: PER_PAGE,
        paginate: "cursor",
        order_by: "created_at",
      })) {
        rows.push(row);
      }
      expect(new Set(rows.map((r) => r.id))).toEqual(new Set(ids));
    });
  });
});
