/**
 * Reconciliation keys on `(external_source, external_id)`: posting the same pair twice updates in place, not a second row.
 */
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { SPECS } from "./support/specs";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 upsert (live)", () => {
  const suite = useV2Project("upsert", env);

  describe.each(SPECS)("$key", (spec) => {
    it("creates when no row matches", async () => {
      const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
      const marker = uniqueName(`${spec.key}-upsert-create`);
      const created = await ops.upsert(spec.makeWrite(marker, { external_source: marker, external_id: "1" }));
      try {
        expect(created.name).toBe(marker);
        expect(created.external_id).toBe("1");
      } finally {
        await ops.delete(created.id);
      }
    });

    it("reconciles on second call instead of duplicating", async () => {
      const ops = spec.chained(suite.client, suite.workspaceSlug, suite.projectId);
      const marker = uniqueName(`${spec.key}-upsert-reconcile`);
      const first = await ops.upsert(spec.makeWrite(marker, { external_source: marker, external_id: "1" }));
      const renamed = `${marker}-renamed`;
      try {
        const second = await ops.upsert(spec.makeWrite(renamed, { external_source: marker, external_id: "1" }));
        expect(second.id).toBe(first.id); // same (external_source, external_id) must reconcile
        expect(second.name).toBe(renamed);

        const page = await ops.list({ external_source: marker, external_id: "1" });
        expect(page.data).toHaveLength(1); // reconcile must not leave a duplicate row behind
        expect(page.data[0].id).toBe(first.id);
      } finally {
        await ops.delete(first.id);
      }
    });
  });
});
