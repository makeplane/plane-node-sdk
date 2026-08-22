/**
 * `manageWorkItems` is reached as `proj.milestones.manageWorkItems`, folded onto `Milestones`, not a standalone resource.
 */
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 milestone work-item management (live)", () => {
  const suite = useV2Project("milestone-work-items", env);

  let milestoneId: string;
  let workItemId: string;

  beforeAll(async () => {
    const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
    const milestone = await proj.milestones.create({ title: uniqueName("milestone") });
    milestoneId = milestone.id;
    const workItem = await proj.workItems.create({ name: uniqueName("milestone-wi") });
    workItemId = workItem.id;
  });

  afterAll(async () => {
    const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
    if (workItemId) {
      await proj.workItems.delete(workItemId).catch(() => undefined);
    }
    if (milestoneId) {
      await proj.milestones.delete(milestoneId).catch(() => undefined);
    }
  });

  it("adds then removes a work item", async () => {
    const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);

    const added = await proj.milestones.manageWorkItems(milestoneId, { add: [workItemId] });
    expect(added.added).toContain(workItemId);

    const removed = await proj.milestones.manageWorkItems(milestoneId, { remove: [workItemId] });
    expect(removed.removed).toContain(workItemId);
  });
});
