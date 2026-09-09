/**
 * One end-to-end scenario, readable top to bottom: project -> work item types + properties -> states/labels
 * -> cycle + module -> work items (readable fields, membership, comment, transition, lookup by key)
 * -> wiki collection + pages -> cleanup. Set PLANE_E2E_KEEP=1 to keep the rows.
 *
 * **Written navigated on purpose.** This is the file that shows what the surface is
 * *for*: one `workspaces.retrieve`, one `projects.create`, and from there nothing repeats
 * an id. `workspace.projects.create(...)` answers a row keyed by the project's readable
 * identifier (`rowId` prefers it over the UUID), so every child call below addresses
 * `.../projects/EXYZ/...` without the scenario ever saying so. The pieces that stay flat
 * stay flat for structural reasons, each noted where it happens: `wiki` is a grouping node
 * with no path id of its own, and `workItems.retrieveByIdentifier` deliberately hangs off
 * the workspace so it needs no project at all.
 */
import { useCapability } from "./support/capability";
import { createV2Client } from "./support/client";
import { v2Env } from "./support/env";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;
const KEEP = process.env.PLANE_E2E_KEEP === "1";

maybe("v2 full scenario (live)", () => {
  // The scenario is core end to end except for the custom property it hangs off the work
  // item type: an unlicensed workspace answers 402 at step 5, six mutations in. The gate
  // catches that only after the `finally` below has undone all of them.
  const capability = useCapability("custom properties are not enabled for this workspace");

  capability.it("builds a project end to end and tears it down", async () => {
    const client = createV2Client(env);
    const slug = env.workspaceSlug;
    const ws = await client.v2.workspaces.retrieve(slug);
    // A grouping node: consumes no path id, so it is never a navigation property and its
    // children take the slug themselves.
    const wiki = client.v2.workspaces.wiki;
    const tag = Math.random().toString(36).slice(2, 7).toUpperCase();
    const cleanup: Array<[string, () => Promise<unknown>]> = []; // run in reverse order

    try {
      // ---- 1. Project ------------------------------------------------------------
      // `create` answers a navigable row keyed by `identifier`, so `proj` below addresses
      // the project by its readable key for the rest of the scenario without repeating it.
      const proj = await ws.projects.create({ name: `E2E Scenario ${tag}`, identifier: `E${tag}` });
      cleanup.push(["project", () => ws.projects.delete(proj.id)]);
      expect(proj.$loaded.ids).toEqual([slug, `E${tag}`]);

      // ---- 2. Work item types + a custom property (mode-aware) --------------------
      const workspaceMode = Boolean((await ws.features.retrieve()).is_work_item_types_enabled);
      let bugType, severity;
      if (workspaceMode) {
        bugType = await ws.workItemTypes.create({ name: `Bug ${tag}` });
        const typeId = bugType.id;
        cleanup.push(["type", () => ws.workItemTypes.delete(typeId)]);
        await proj.workItemTypes.import([typeId]);
        severity = await ws.workItemProperties.create({ display_name: `Severity ${tag}`, property_type: "TEXT" });
        const propertyId = severity.id;
        cleanup.push(["property", () => ws.workItemProperties.delete(propertyId)]);
        // Three deep: workspace row -> type row -> its attached properties.
        await bugType.properties.link([propertyId]);
        const attachedTo = bugType;
        cleanup.push(["unlink", () => attachedTo.properties.unlink(propertyId)]);
      } else {
        await proj.workItemTypes.enable();
        bugType = await proj.workItemTypes.create({ name: `Bug ${tag}` });
        const typeId = bugType.id;
        cleanup.push(["type", () => proj.workItemTypes.delete(typeId)]);
        severity = await proj.workItemProperties.create({ display_name: `Severity ${tag}`, property_type: "TEXT" });
        const propertyId = severity.id;
        cleanup.push(["property", () => proj.workItemProperties.delete(propertyId)]);
        await bugType.properties.link([propertyId]);
        const attachedTo = bugType;
        cleanup.push(["unlink", () => attachedTo.properties.unlink(propertyId)]);
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

      // The membership bridges hang off the cycle and the module, so each fetched row
      // supplies the id its own URL needs.
      await sprint.workItems.add([item.id, subtask.id]);
      await auth.workItems.add([item.id]);
      const inSprint = (await proj.workItems.list({ cycle_id: sprint.id })).data.map((row) => row.id);
      expect(inSprint).toEqual(expect.arrayContaining([item.id, subtask.id]));

      await item.comments.create({ comment_html: "<p>Repro attached.</p>" });
      expect((await item.comments.list()).data).toHaveLength(1);

      const moved = await proj.workItems.update(item.id, { state: "In Progress" });
      expect(moved.state_id).toBe(inProgress.id);

      // Flat, and that is the point: this route hangs off the workspace, so a readable
      // key alone finds the work item with no project named anywhere.
      const byKey = await client.v2.workspaces.workItems.retrieveByIdentifier(slug, item.identifier!);
      expect(byKey.id).toBe(item.id);
      expect(byKey.cycle_id).toBe(sprint.id);
      expect(byKey.module_ids).toContain(auth.id);

      // ---- 6. Wiki: a collection, a page inside it, and a project page -------------
      const handbook = await wiki.collections.create(slug, { name: `Handbook ${tag}` });
      cleanup.push(["collection", () => wiki.collections.delete(slug, handbook.id)]);
      const runbook = await wiki.pages.create(slug, { name: "Login runbook", collection_id: handbook.id });
      cleanup.push([
        "wiki page",
        () =>
          archiveThenDelete(
            {
              update: (id, data) => wiki.pages.update(slug, id, data),
              delete: (id) => wiki.pages.delete(slug, id),
            },
            runbook.id
          ),
      ]);
      expect(runbook.collection_id).toBe(handbook.id);
      const inHandbook = (await wiki.pages.list(slug, { collection_id: handbook.id })).data;
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
