/**
 * Gated behind `is_time_tracking_enabled` (off by default); this file flips it in its own `beforeAll`.
 */
import { useCapability } from "./support/capability";
import { v2Env } from "./support/env";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 project worklogs summary (live)", () => {
  const suite = useV2Project("worklogs-summary", env);

  // The project toggle is free; reading the worklog rollup behind it is EE-gated.
  const capability = useCapability("FeatureFlag.ISSUE_WORKLOG is not enabled for this workspace");

  capability.beforeAll(async () => {
    await suite.client.v2.workspaces.projects.update(suite.workspaceSlug, suite.projectId, {
      is_time_tracking_enabled: true,
    });
  });

  capability.it("returns a bare array for the project (empty when nothing's been logged)", async () => {
    const rows = await suite.projectRow.worklogs.summary();
    expect(Array.isArray(rows)).toBe(true);
  });
});
