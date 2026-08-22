/**
 * `manageWorkItems` is reached as `proj.modules.manageWorkItems`, folded onto `Modules`, not a standalone resource.
 */
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 module work-item management (live)", () => {
  const suite = useV2Project("module-work-items", env);

  let moduleId: string;
  let workItemId: string;

  beforeAll(async () => {
    const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
    const testModule = await proj.modules.create({ name: uniqueName("module") });
    moduleId = testModule.id;
    const workItem = await proj.workItems.create({ name: uniqueName("module-wi") });
    workItemId = workItem.id;
  });

  afterAll(async () => {
    const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
    if (workItemId) {
      await proj.workItems.delete(workItemId).catch(() => undefined);
    }
    if (moduleId) {
      await proj.modules.delete(moduleId).catch(() => undefined);
    }
  });

  it("adds then removes a work item", async () => {
    const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);

    const added = await proj.modules.manageWorkItems(moduleId, { add: [workItemId] });
    expect(added.added).toContain(workItemId);

    const removed = await proj.modules.manageWorkItems(moduleId, { remove: [workItemId] });
    expect(removed.removed).toContain(workItemId);
  });
});
