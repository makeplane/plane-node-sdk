/**
 * One end-to-end scenario, readable top to bottom: project -> work item types + properties -> states/labels
 * -> cycle + module -> work items (readable fields, membership, comment, transition, lookup by key)
 * -> wiki collection + pages -> cleanup. Set PLANE_E2E_KEEP=1 to keep the rows.
 */
import { PlaneApiError } from "../../../src/errors/PlaneApiError";
import { createV2Client } from "./support/client";
import { v2Env } from "./support/env";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;
const KEEP = process.env.PLANE_E2E_KEEP === "1";

maybe("v2 full scenario (live)", () => {
  it("builds a project end to end and tears it down", async () => {
    const client = createV2Client(env);
    const ws = client.v2.workspace(env.workspaceSlug);
    const tag = Math.random().toString(36).slice(2, 7).toUpperCase();
    const cleanup: Array<[string, () => Promise<unknown>]> = []; // run in reverse order

    try {
      // ---- 1. Project ------------------------------------------------------------
      const project = await ws.projects.create({ name: `E2E Scenario ${tag}`, identifier: `E${tag}` });
      cleanup.push(["project", () => ws.projects.delete(project.id)]);
      const proj = ws.project(project.identifier ?? project.id); // address by key from here on

      // ---- 2. Work item types + a custom property (mode-aware) --------------------
      const workspaceMode = Boolean((await ws.features.retrieve()).is_work_item_types_enabled);
      let bugType, severity;
      try {
        if (workspaceMode) {
          bugType = await ws.workItemTypes.create({ name: `Bug ${tag}` });
          const typeId = bugType.id;
          cleanup.push(["type", () => ws.workItemTypes.delete(typeId)]);
          await proj.workItemTypes.import([typeId]);
          severity = await ws.workItemProperties.create({ display_name: `Severity ${tag}`, property_type: "TEXT" });
          const propertyId = severity.id;
          cleanup.push(["property", () => ws.workItemProperties.delete(propertyId)]);
          await ws.workItemTypes.properties.link(typeId, [propertyId]);
          cleanup.push(["unlink", () => ws.workItemTypes.properties.unlink(typeId, propertyId)]);
        } else {
          await proj.workItemTypes.enable();
          bugType = await proj.workItemTypes.create({ name: `Bug ${tag}` });
          const typeId = bugType.id;
          cleanup.push(["type", () => proj.workItemTypes.delete(typeId)]);
          severity = await proj.workItemProperties.create({ display_name: `Severity ${tag}`, property_type: "TEXT" });
          const propertyId = severity.id;
          cleanup.push(["property", () => proj.workItemProperties.delete(propertyId)]);
          await proj.workItemTypes.properties.link(typeId, [propertyId]);
          cleanup.push(["unlink", () => proj.workItemTypes.properties.unlink(typeId, propertyId)]);
        }
      } catch (error) {
        if (error instanceof PlaneApiError && error.status === 402) {
          // eslint-disable-next-line no-console -- the harness has no runtime skip; log why nothing ran
          console.warn("v2 live suite: skipping — work item types are not enabled on this workspace's plan");
          return;
        }
        throw error;
      }
      const severityKey = severity.name!;
      expect((await proj.workItemTypes.list()).data.some((row) => row.id === bugType.id)).toBe(true);

      // ---- 3. States and labels --------------------------------------------------
      const todo = await proj.states.findByName("Todo"); // seeded with every new project
      const inProgress = await proj.states.findByName("In Progress");
      const bugLabel = await proj.labels.create({ name: "bug", color: "#d73a4a" });
      cleanup.push(["label", () => proj.labels.delete(bugLabel.id)]);

      // ---- 4. Cycle and module ---------------------------------------------------
      const sprint = await proj.cycles.create({ name: "Sprint 1" });
      cleanup.push(["cycle", () => proj.cycles.delete(sprint.id)]);
      const auth = await proj.modules.create({ name: "Auth" });
      cleanup.push(["module", () => proj.modules.delete(auth.id)]);

      // ---- 5. Work items: readable fields in, ids out -----------------------------
      const item = await proj.workItems.create({
        name: "Fix login bug",
        state: "Todo",
        labels: ["bug"],
        type: bugType.name,
        custom_fields: { [severityKey]: "high" },
      });
      cleanup.push(["work item", () => proj.workItems.delete(item.id)]);
      expect(item.state_id).toBe(todo.id);
      expect(item.label_ids).toContain(bugLabel.id);
      expect(item.type_id).toBe(bugType.id);
      expect(item.custom_fields![severityKey].value).toBe("high");
      expect(item.identifier).toBeTruthy(); // e.g. "E1A2B-1"

      const subtask = await proj.workItems.create({ name: "Add regression test", parent: item.identifier! });
      cleanup.push(["sub-task", () => proj.workItems.delete(subtask.id)]);
      expect(subtask.parent_id).toBe(item.id);

      await proj.cycles.workItems.add(sprint.id, [item.id, subtask.id]);
      await proj.modules.workItems.add(auth.id, [item.id]);
      const inSprint = (await proj.workItems.list({ cycle_id: sprint.id })).data.map((row) => row.id);
      expect(inSprint).toEqual(expect.arrayContaining([item.id, subtask.id]));

      await proj.workItems.comments.create(item.id, { comment_html: "<p>Repro attached.</p>" });
      expect((await proj.workItems.comments.list(item.id)).data).toHaveLength(1);

      const moved = await proj.workItems.update(item.id, { state: "In Progress" });
      expect(moved.state_id).toBe(inProgress.id);

      const byKey = await ws.workItems.retrieveByIdentifier(item.identifier!); // no project needed
      expect(byKey.id).toBe(item.id);
      expect(byKey.cycle_id).toBe(sprint.id);
      expect(byKey.module_ids).toContain(auth.id);

      // ---- 6. Wiki: a collection, a page inside it, and a project page -------------
      const handbook = await ws.wiki.collections.create({ name: `Handbook ${tag}` });
      cleanup.push(["collection", () => ws.wiki.collections.delete(handbook.id)]);
      const runbook = await ws.wiki.pages.create({ name: "Login runbook", collection_id: handbook.id });
      cleanup.push(["wiki page", () => archiveThenDelete(ws.wiki.pages, runbook.id)]);
      expect(runbook.collection_id).toBe(handbook.id);
      const inHandbook = (await ws.wiki.pages.list({ collection_id: handbook.id })).data;
      expect(inHandbook.some((row) => row.id === runbook.id)).toBe(true);

      const notes = await proj.pages.create({ name: "Sprint 1 notes" });
      cleanup.push(["project page", () => archiveThenDelete(proj.pages, notes.id)]);
      expect((await proj.pages.list()).data.some((row) => row.id === notes.id)).toBe(true);
    } finally {
      // ---- 7. Cleanup, newest first; every failure is reported, none is swallowed ------
      const failures: string[] = [];
      if (!KEEP) {
        for (const [label, undo] of cleanup.reverse()) {
          await undo().catch((error: unknown) => failures.push(`${label}: ${String(error)}`));
        }
      }
      expect(failures).toEqual([]);
    }
  });
});

/** v2 refuses to delete a live page: archive first (PATCH `archived_at`), then delete. */
async function archiveThenDelete(
  pages: {
    update(id: string, data: { archived_at?: string | null }): Promise<unknown>;
    delete(id: string): Promise<void>;
  },
  pageId: string
): Promise<void> {
  await pages.update(pageId, { archived_at: new Date().toISOString() });
  await pages.delete(pageId);
}
