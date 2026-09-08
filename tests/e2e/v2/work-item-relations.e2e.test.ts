/**
 * Relations and dependencies, driven off two fetched work item rows.
 *
 * Both are grandchildren of the project, so they need the work item's own id and are not
 * reachable from the project row alone. The "Relates to" definition id now comes from
 * `v2.workspaces.workItemRelationDefinitions` rather than the raw transport — that
 * resource exists on the flat surface, and reading it here is one more live check of its
 * URL.
 */
import { LoadedWorkItem } from "../../../src/api/v2/loaded/WorkItem";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 work item relations/dependencies (live)", () => {
  const suite = useV2Project("wirl", env);
  let workItemA: LoadedWorkItem;
  let workItemBId: string;
  let relatesToDefinitionId: string;

  beforeAll(async () => {
    const [a, b] = await Promise.all([
      suite.projectRow.workItems.create({ name: uniqueName("wirl-a") }),
      suite.projectRow.workItems.create({ name: uniqueName("wirl-b") }),
    ]);
    workItemA = a;
    workItemBId = b.id;

    const definitions = await suite.client.v2.workspaces.workItemRelationDefinitions.list(suite.workspaceSlug, {
      per_page: 100,
    });
    const relatesTo = definitions.data.find((definition) => definition.name === "Relates to");
    expect(relatesTo).toBeDefined(); // a default definition every workspace ships with
    relatesToDefinitionId = relatesTo!.id;
  });

  afterAll(async () => {
    // Best-effort cleanup: a live-environment delete-permission/timing quirk, not
    // an SDK defect (see work-item-subresources.e2e.test.ts's afterAll).
    if (workItemA) {
      await suite.projectRow.workItems.delete(workItemA.id).catch(() => undefined);
    }
    if (workItemBId) {
      await suite.projectRow.workItems.delete(workItemBId).catch(() => undefined);
    }
  });

  describe("relations", () => {
    it("list starts empty, grouped by direction label — not a page", async () => {
      const result = await workItemA.relations.list();
      expect(result["relates to"]).toEqual([]);
      expect((result as unknown as { data?: unknown }).data).toBeUndefined();
    });

    it("creates a relation, lists it, then deletes it by related_work_item_id", async () => {
      const created = await workItemA.relations.create({
        direction: "relates to",
        relation_definition_id: relatesToDefinitionId,
        work_item_ids: [workItemBId],
      });
      expect(created["relates to"]).toContain(workItemBId);

      const listed = await workItemA.relations.list();
      expect(listed["relates to"]).toContain(workItemBId);

      await workItemA.relations.delete(workItemBId);

      const afterDelete = await workItemA.relations.list();
      expect(afterDelete["relates to"]).not.toContain(workItemBId);
    });
  });

  describe("dependencies", () => {
    it("list starts empty, grouped by the six fixed keys — not a page", async () => {
      const result = await workItemA.dependencies.list();
      expect(result.blocking).toEqual([]);
      expect(result.blocked_by).toEqual([]);
    });

    it("creates a typed dependency, lists it, then deletes it by related_work_item_id", async () => {
      const created = await workItemA.dependencies.create({
        relation_type: "blocking",
        work_item_ids: [workItemBId],
      });
      expect(created.blocking).toContain(workItemBId);

      const listed = await workItemA.dependencies.list();
      expect(listed.blocking).toContain(workItemBId);

      await workItemA.dependencies.delete(workItemBId);

      const afterDelete = await workItemA.dependencies.list();
      expect(afterDelete.blocking).not.toContain(workItemBId);
    });
  });
});
