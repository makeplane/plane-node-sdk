/**
 * Gated behind `is_time_tracking_enabled` (off by default); this file flips it in its own `beforeAll`.
 */
import { v2Env } from "./support/env";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 project worklogs summary (live)", () => {
  const suite = useV2Project("worklogs-summary", env);

  beforeAll(async () => {
    await suite.client.v2.transport.request(
      "PATCH",
      `/workspaces/${suite.workspaceSlug}/projects/${suite.projectId}/`,
      { data: { is_time_tracking_enabled: true } }
    );
  });

  it("returns a bare array for the project (empty when nothing's been logged)", async () => {
    const summary = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId).worklogs;

    const rows = await summary.summary();
    expect(Array.isArray(rows)).toBe(true);
  });
});
