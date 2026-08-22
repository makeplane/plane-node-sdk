/**
 * bulkCreate/bulkUpdate/bulkDelete against a real server; mirrors plane-python-sdk/tests/v2/integration/test_bulk.py.
 */
import { isBulkFailure, raiseForFailures } from "../../../src/api/v2";
import { PlaneApiError } from "../../../src/errors/PlaneApiError";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { SPECS } from "./support/specs";
import { useV2Project } from "./support/suite";

const MISSING_ID = "00000000-0000-0000-0000-000000000000";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 bulk writes (live)", () => {
  const suite = useV2Project("bulk", env);

  describe.each(SPECS)("$key", (spec) => {
    describe("bulkCreate", () => {
      it("all rows succeed", async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        const items = [0, 1, 2].map(() => spec.makeWrite(uniqueName(`${spec.key}-bc`)));
        const result = await ops.bulkCreate(items);
        try {
          expect(result.succeeded).toBe(3);
          expect(result.failed).toBe(0);
          expect(result.results.every((row) => row.result !== "failed")).toBe(true);
        } finally {
          // A `BulkRowFailure` carries no `id` — only succeeded rows are safe to feed
          // back into `bulkDelete`. Every row in this test is expected to succeed, but
          // filtering keeps cleanup correct even if that expectation above ever fails.
          const ids = result.results.filter((row) => !isBulkFailure(row)).map((row) => row.id!);
          if (ids.length > 0) await ops.bulkDelete(ids);
        }
      });

      it("partial failure reports the failing row", async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        const takenName = uniqueName(`${spec.key}-taken`);
        const existing = await ops.create(spec.makeWrite(takenName));
        const goodName = uniqueName(`${spec.key}-ok`);
        let goodRowId: string | undefined;
        try {
          const result = await ops.bulkCreate([spec.makeWrite(goodName), spec.makeWrite(takenName)]);
          expect(result.succeeded).toBe(1);
          expect(result.failed).toBe(1);

          const failures = result.results.filter(isBulkFailure);
          expect(failures).toHaveLength(1);
          const failure = failures[0];
          expect(failure.index).toBe(1);
          expect(failure.code).toBeTruthy(); // a real code, e.g. "conflict"
          expect(failure.detail).toBeTruthy();

          expect(() => raiseForFailures(result)).toThrow(PlaneApiError);
          expect(() => raiseForFailures(result)).toThrow(/1 of 2 rows failed/);

          goodRowId = result.results.find((row) => !isBulkFailure(row))?.id;
        } finally {
          // Both rows this test can create must be cleaned up even if an assertion
          // above throws first — not just `existing`, which is why `goodRowId` is
          // captured outside the try body instead of deleted at the end of it.
          if (goodRowId) await ops.delete(goodRowId).catch(() => undefined);
          await ops.delete(existing.id);
        }
      });

      it("allOrNone turns a failing row into 409 batch_failed", async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        const takenName = uniqueName(`${spec.key}-taken-aon`);
        const existing = await ops.create(spec.makeWrite(takenName));
        const goodName = uniqueName(`${spec.key}-ok-aon`);
        try {
          await expect(
            ops.bulkCreate([spec.makeWrite(goodName), spec.makeWrite(takenName)], true)
          ).rejects.toMatchObject<Partial<PlaneApiError>>({ status: 409, code: "batch_failed" });

          // Nothing was applied: the good row must not exist.
          const page = await ops.list({ name: goodName });
          expect(page.data).toHaveLength(0);
        } finally {
          await ops.delete(existing.id);
        }
      });
    });

    describe("bulkUpdate", () => {
      it("all rows succeed", async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        const created = await ops.bulkCreate([0, 1].map(() => spec.makeWrite(uniqueName(`${spec.key}-bu`))));
        const ids = created.results.map((row) => row.id!);
        try {
          const result = await ops.bulkUpdate(
            ids.map((id) => ({ ...spec.makePatch({ name: uniqueName(`${spec.key}-bu-renamed`) }), id }))
          );
          expect(result.succeeded).toBe(2);
          expect(result.failed).toBe(0);
        } finally {
          await ops.bulkDelete(ids);
        }
      });

      it("partial failure on an unknown id", async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        const created = await ops.create(spec.makeWrite(uniqueName(`${spec.key}-bu-ok`)));
        try {
          const result = await ops.bulkUpdate([
            { ...spec.makePatch({ name: uniqueName(`${spec.key}-bu-renamed`) }), id: created.id },
            { ...spec.makePatch({ name: "irrelevant" }), id: MISSING_ID },
          ]);
          expect(result.succeeded).toBe(1);
          expect(result.failed).toBe(1);
          const failure = result.results.find(isBulkFailure);
          expect(failure?.index).toBe(1);
          expect(failure?.code).toBeTruthy();

          expect(() => raiseForFailures(result)).toThrow(PlaneApiError);
        } finally {
          await ops.delete(created.id);
        }
      });
    });

    describe("bulkDelete", () => {
      it("all rows succeed", async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        const created = await ops.bulkCreate([0, 1].map(() => spec.makeWrite(uniqueName(`${spec.key}-bd`))));
        const ids = created.results.map((row) => row.id!);
        const result = await ops.bulkDelete(ids);
        expect(result.succeeded).toBe(2);
        expect(result.failed).toBe(0);
      });

      it("partial failure on an unknown id", async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        const created = await ops.create(spec.makeWrite(uniqueName(`${spec.key}-bd-ok`)));
        const result = await ops.bulkDelete([created.id, MISSING_ID]);
        expect(result.succeeded).toBe(1);
        expect(result.failed).toBe(1);
        const failure = result.results.find(isBulkFailure);
        expect(failure?.code).toBeTruthy();
      });
    });

    describe("empty batch rejected client-side", () => {
      it("bulkCreate([]) never hits the network", async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        await expect(ops.bulkCreate([])).rejects.toThrow(/non-empty/);
      });

      it("bulkUpdate([]) never hits the network", async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        await expect(ops.bulkUpdate([])).rejects.toThrow(/non-empty/);
      });

      it("bulkDelete([]) never hits the network", async () => {
        const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
        await expect(ops.bulkDelete([])).rejects.toThrow(/non-empty/);
      });
    });
  });
});
