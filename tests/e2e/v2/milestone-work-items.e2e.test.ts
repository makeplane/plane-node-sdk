/**
 * `add`/`remove` is a bridge sub-resource on `Milestones`. Driven three navigations deep
 * — project row, milestone row, then the bridge — for the same reason as
 * `module-work-items.e2e.test.ts`: a grandchild needs its own row's id, which `Owned`
 * cannot supply from the project row alone.
 */
import { LoadedMilestone } from "../../../src/api/v2/loaded/Milestone";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 milestone work-item management (live)", () => {
  const suite = useV2Project("milestone-work-items", env);

  let milestone: LoadedMilestone;
  let workItemId: string;

  beforeAll(async () => {
    milestone = await suite.projectRow.milestones.create({ title: uniqueName("milestone") });
    const workItem = await suite.projectRow.workItems.create({ name: uniqueName("milestone-wi") });
    workItemId = workItem.id;
  });

  afterAll(async () => {
    if (workItemId) {
      await suite.projectRow.workItems.delete(workItemId).catch(() => undefined);
    }
    if (milestone) {
      await suite.projectRow.milestones.delete(milestone.id).catch(() => undefined);
    }
  });

  it("adds then removes a work item, navigated (milestone row -> workItems)", async () => {
    const added = await milestone.workItems.add([workItemId]);
    expect(added).toContain(workItemId);

    const removed = await milestone.workItems.remove([workItemId]);
    expect(removed).toContain(workItemId);
  });
});
