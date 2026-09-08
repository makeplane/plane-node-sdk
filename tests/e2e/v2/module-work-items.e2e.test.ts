/**
 * `add`/`remove` is a bridge sub-resource on `Modules`, reached flat as
 * `v2.workspaces.projects.modules.workItems.add(slug, project, module, ids)` — or, as here, three
 * navigations deep: a fetched project hands back `modules`, a fetched module hands back
 * `workItems`, and the bridge call names only the ids it adds.
 *
 * A grandchild is *not* reachable from the project row alone: `Owned` drops non-callable
 * members, so `projectRow.modules.workItems` does not exist. It needs the module's own
 * row, which is exactly the id the URL is missing. This file is where that chain is
 * exercised against a live server.
 */
import { LoadedModule } from "../../../src/api/v2/loaded/Module";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 module work-item management (live)", () => {
  const suite = useV2Project("module-work-items", env);

  let testModule: LoadedModule;
  let workItemId: string;

  beforeAll(async () => {
    testModule = await suite.projectRow.modules.create({ name: uniqueName("module") });
    const workItem = await suite.projectRow.workItems.create({ name: uniqueName("module-wi") });
    workItemId = workItem.id;
  });

  afterAll(async () => {
    if (workItemId) {
      await suite.projectRow.workItems.delete(workItemId).catch(() => undefined);
    }
    if (testModule) {
      await suite.projectRow.modules.delete(testModule.id).catch(() => undefined);
    }
  });

  it("adds then removes a work item, navigated (module row -> workItems)", async () => {
    const added = await testModule.workItems.add([workItemId]);
    expect(added).toContain(workItemId);

    const removed = await testModule.workItems.remove([workItemId]);
    expect(removed).toContain(workItemId);
  });

  it("the flat call reaches the same bridge", async () => {
    const modules = suite.client.v2.workspaces.projects.modules;
    const added = await modules.workItems.add(suite.workspaceSlug, suite.projectId, testModule.id, [workItemId]);
    expect(added).toContain(workItemId);

    const removed = await modules.workItems.remove(suite.workspaceSlug, suite.projectId, testModule.id, [workItemId]);
    expect(removed).toContain(workItemId);
  });
});
