/**
 * Needs the project's `intake_view` flag on (off by default, 400s otherwise); this suite flips it right after project creation.
 */
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("Intakes (v2 live)", () => {
  const suite = useV2Project("intakes", env);
  // Navigated: bound off the suite's fetched project row.
  const resource = () => suite.projectRow.intakes;

  beforeAll(async () => {
    await suite.client.v2.projects.update(suite.workspaceSlug, suite.projectId, { intake_view: true });
  });

  it("creates, retrieves, lists, and folds a triage decision into one PATCH", async () => {
    const created = await resource().create({ name: uniqueName("intake") });
    expect(created.status).toBe(-2); // Pending
    expect(created.work_item_id).toBeTruthy();

    const fetched = await resource().retrieve(created.id);
    expect(fetched.id).toBe(created.id);

    const page = await resource().list({ per_page: 100 });
    expect(page.data.some((row) => row.id === created.id)).toBe(true);

    const accepted = await resource().update(created.id, { status: 1 });
    expect(accepted.status).toBe(1); // Accepted

    await resource().delete(created.id);
    await expect(resource().retrieve(created.id)).rejects.toThrow();
  });
});
