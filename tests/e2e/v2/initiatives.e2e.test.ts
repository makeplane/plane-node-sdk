/**
 * Workspace-scoped; uses `useV2Project` only to exercise `projects.add/remove`/`workItems.add/remove`. No feature-flag gate needed.
 *
 * The initiative collection and the label *catalog* (`/initiatives/labels/`, slug only)
 * are flat; the three bridge sub-resources hang off the initiative id, so they come off
 * the fetched initiative row.
 */
import { Initiatives } from "../../../src/api/v2/Initiatives";
import { LoadedInitiative } from "../../../src/api/v2/loaded/Initiative";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 initiatives (live)", () => {
  const suite = useV2Project("init", env);
  let initiatives: Initiatives;
  const slug = () => suite.workspaceSlug;
  let initiative: LoadedInitiative;

  beforeAll(async () => {
    initiatives = suite.client.v2.workspaces.initiatives;
    initiative = await initiatives.create(slug(), { name: uniqueName("e2e-initiative") });
  });

  afterAll(async () => {
    if (!initiative) return;
    await initiatives.delete(slug(), initiative.id).catch(() => undefined);
  });

  it("retrieves and patches the initiative", async () => {
    const fetched = await initiatives.retrieve(slug(), initiative.id);
    expect(fetched.id).toBe(initiative.id);

    const updated = await initiatives.update(slug(), initiative.id, { state: "ACTIVE" });
    expect(updated.state).toBe("ACTIVE");
  });

  it("finds by name and lists", async () => {
    const found = await initiatives.findByName(slug(), (await initiatives.retrieve(slug(), initiative.id)).name!);
    expect(found.id).toBe(initiative.id);

    const page = await initiatives.list(slug());
    expect(page.data.some((i) => i.id === initiative.id)).toBe(true);
  });

  describe("child bridge sub-resources", () => {
    it("adds then removes a project", async () => {
      const added = await initiative.projects.add([suite.projectId]);
      expect(added).toContain(suite.projectId);

      const removed = await initiative.projects.remove([suite.projectId]);
      expect(removed).toContain(suite.projectId);
    });

    it("adds then removes a work item", async () => {
      const workItems = suite.projectRow.workItems;
      const workItem = await workItems.create({
        name: uniqueName("init-linked-wi"),
      });

      const added = await initiative.workItems.add([workItem.id]);
      expect(added).toContain(workItem.id);

      const removed = await initiative.workItems.remove([workItem.id]);
      expect(removed).toContain(workItem.id);

      await workItems.delete(workItem.id).catch(() => undefined);
    });

    it("adds then removes a workspace initiative label", async () => {
      const label = await initiatives.labels.create(slug(), { name: uniqueName("init-label") });

      const added = await initiative.labels.add([label.id]);
      expect(added).toContain(label.id);

      const removed = await initiative.labels.remove([label.id]);
      expect(removed).toContain(label.id);

      await initiatives.labels.delete(slug(), label.id);
    });
  });

  describe("labels catalog", () => {
    it("creates, lists, updates and deletes a label independent of any initiative", async () => {
      const created = await initiatives.labels.create(slug(), {
        name: uniqueName("catalog-label"),
        color: "#00ff00",
      });

      const page = await initiatives.labels.list(slug());
      expect(page.data.some((l) => l.id === created.id)).toBe(true);

      const updated = await initiatives.labels.update(slug(), created.id, { color: "#0000ff" });
      expect(updated.color).toBe("#0000ff");

      await initiatives.labels.delete(slug(), created.id);
    });
  });

  it("rejects an unknown order_by", async () => {
    await expect(initiatives.list(slug(), { order_by: "name" as never })).rejects.toThrow(/Unknown order_by/);
  });
});
