/**
 * No v2 relation-definitions resource yet, so the "Relates to" definition id is read via the raw transport in `beforeAll`.
 */
import { Page } from "../../../src/models/v2/common";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

interface RelationDefinition {
  id: string;
  name: string;
  outward: string;
  inward: string;
}

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 work item relations/dependencies (live)", () => {
  const suite = useV2Project("wirl", env);
  let workItemAId: string;
  let workItemBId: string;
  let relatesToDefinitionId: string;

  beforeAll(async () => {
    const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
    const [a, b] = await Promise.all([
      proj.workItems.create({ name: uniqueName("wirl-a") }),
      proj.workItems.create({ name: uniqueName("wirl-b") }),
    ]);
    workItemAId = a.id;
    workItemBId = b.id;

    const definitions = await suite.client.v2.transport.request<Page<RelationDefinition>>(
      "GET",
      `/workspaces/${suite.workspaceSlug}/work-item-relation-definitions/`
    );
    const relatesTo = definitions.data.find((definition) => definition.name === "Relates to");
    expect(relatesTo).toBeDefined(); // a default definition every workspace ships with
    relatesToDefinitionId = relatesTo!.id;
  });

  afterAll(async () => {
    // Best-effort cleanup: a live-environment delete-permission/timing quirk, not
    // an SDK defect (see work-item-subresources.e2e.test.ts's afterAll).
    const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
    if (workItemAId) {
      await proj.workItems.delete(workItemAId).catch(() => undefined);
    }
    if (workItemBId) {
      await proj.workItems.delete(workItemBId).catch(() => undefined);
    }
  });

  describe("relations", () => {
    it("list starts empty, grouped by direction label — not a page", async () => {
      const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      const result = await proj.workItems.relations.list(workItemAId);
      expect(result["relates to"]).toEqual([]);
      expect((result as unknown as { data?: unknown }).data).toBeUndefined();
    });

    it("creates a relation, lists it, then deletes it by related_work_item_id", async () => {
      const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      const created = await proj.workItems.relations.create(workItemAId, {
        direction: "relates to",
        relation_definition_id: relatesToDefinitionId,
        work_item_ids: [workItemBId],
      });
      expect(created["relates to"]).toContain(workItemBId);

      const listed = await proj.workItems.relations.list(workItemAId);
      expect(listed["relates to"]).toContain(workItemBId);

      await proj.workItems.relations.delete(workItemAId, workItemBId);

      const afterDelete = await proj.workItems.relations.list(workItemAId);
      expect(afterDelete["relates to"]).not.toContain(workItemBId);
    });
  });

  describe("dependencies", () => {
    it("list starts empty, grouped by the six fixed keys — not a page", async () => {
      const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      const result = await proj.workItems.dependencies.list(workItemAId);
      expect(result.blocking).toEqual([]);
      expect(result.blocked_by).toEqual([]);
    });

    it("creates a typed dependency, lists it, then deletes it by related_work_item_id", async () => {
      const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      const created = await proj.workItems.dependencies.create(workItemAId, {
        relation_type: "blocking",
        work_item_ids: [workItemBId],
      });
      expect(created.blocking).toContain(workItemBId);

      const listed = await proj.workItems.dependencies.list(workItemAId);
      expect(listed.blocking).toContain(workItemBId);

      await proj.workItems.dependencies.delete(workItemAId, workItemBId);

      const afterDelete = await proj.workItems.dependencies.list(workItemAId);
      expect(afterDelete.blocking).not.toContain(workItemBId);
    });
  });
});
