/**
 * Workspace-scoped; uses `useV2Project` only to exercise `projects.add/remove`/`workItems.add/remove`. No feature-flag gate needed.
 */
import { Initiatives } from "../../../src/api/v2/Initiatives";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 initiatives (live)", () => {
  const suite = useV2Project("init", env);
  let initiatives: Initiatives;
  let initiativeId: string;

  beforeAll(async () => {
    initiatives = suite.client.v2.workspace(suite.workspaceSlug).initiatives;
    const created = await initiatives.create({ name: uniqueName("e2e-initiative") });
    initiativeId = created.id;
  });

  afterAll(async () => {
    if (!initiativeId) return;
    await initiatives.delete(initiativeId).catch(() => undefined);
  });

  it("retrieves and patches the initiative", async () => {
    const fetched = await initiatives.retrieve(initiativeId);
    expect(fetched.id).toBe(initiativeId);

    const updated = await initiatives.update(initiativeId, { state: "ACTIVE" });
    expect(updated.state).toBe("ACTIVE");
  });

  it("finds by name and lists", async () => {
    const found = await initiatives.findByName((await initiatives.retrieve(initiativeId)).name!);
    expect(found.id).toBe(initiativeId);

    const page = await initiatives.list();
    expect(page.data.some((i) => i.id === initiativeId)).toBe(true);
  });

  describe("child bridge sub-resources", () => {
    it("adds then removes a project", async () => {
      const added = await initiatives.projects.add(initiativeId, [suite.projectId]);
      expect(added).toContain(suite.projectId);

      const removed = await initiatives.projects.remove(initiativeId, [suite.projectId]);
      expect(removed).toContain(suite.projectId);
    });

    it("adds then removes a work item", async () => {
      const workItems = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId).workItems;
      const workItem = await workItems.create({
        name: uniqueName("init-linked-wi"),
      });

      const added = await initiatives.workItems.add(initiativeId, [workItem.id]);
      expect(added).toContain(workItem.id);

      const removed = await initiatives.workItems.remove(initiativeId, [workItem.id]);
      expect(removed).toContain(workItem.id);

      await workItems.delete(workItem.id).catch(() => undefined);
    });

    it("adds then removes a workspace initiative label", async () => {
      const label = await initiatives.labels.create({ name: uniqueName("init-label") });

      const added = await initiatives.labels.add(initiativeId, [label.id]);
      expect(added).toContain(label.id);

      const removed = await initiatives.labels.remove(initiativeId, [label.id]);
      expect(removed).toContain(label.id);

      await initiatives.labels.delete(label.id);
    });
  });

  describe("labels catalog", () => {
    it("creates, lists, updates and deletes a label independent of any initiative", async () => {
      const created = await initiatives.labels.create({
        name: uniqueName("catalog-label"),
        color: "#00ff00",
      });

      const page = await initiatives.labels.list();
      expect(page.data.some((l) => l.id === created.id)).toBe(true);

      const updated = await initiatives.labels.update(created.id, { color: "#0000ff" });
      expect(updated.color).toBe("#0000ff");

      await initiatives.labels.delete(created.id);
    });
  });

  it("rejects an unknown order_by", async () => {
    await expect(initiatives.list({ order_by: "name" as never })).rejects.toThrow(/Unknown order_by/);
  });
});
