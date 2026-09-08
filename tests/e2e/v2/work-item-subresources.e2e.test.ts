/**
 * Attachment `create` returns `{ upload_data, asset_id, asset_url, attachment }`, not the golden's bare `WorkItemAttachment`; only create differs.
 *
 * Driven off a fetched **work item** row rather than the project row: every family here
 * is a grandchild of the project, and `Owned` drops non-callable members, so
 * `projectRow.workItems.links` does not exist — the work item's own id is exactly what
 * the URL is missing. `workItem.links.create({...})` is the shape that works, and it is
 * the deepest navigation these routes have.
 */
import { LoadedWorkItem } from "../../../src/api/v2/loaded/WorkItem";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 work item sub-resources (live)", () => {
  const suite = useV2Project("wis", env);
  let workItem: LoadedWorkItem;

  beforeAll(async () => {
    await suite.client.v2.workspaces.projects.update(suite.workspaceSlug, suite.projectId, {
      is_time_tracking_enabled: true,
    });
    workItem = await suite.projectRow.workItems.create({ name: uniqueName("wis-parent") });
  });

  afterAll(async () => {
    if (!workItem) return;
    // Best-effort: this dev server intermittently answers work-item delete with a
    // transient 403 resolving to 404 shortly after — a live-environment timing
    // quirk, not an SDK defect. Project cleanup cascades regardless.
    await suite.projectRow.workItems.delete(workItem.id).catch(() => undefined);
  });

  describe("links", () => {
    it("creates, retrieves, updates, deletes", async () => {
      const created = await workItem.links.create({
        url: "https://example.com/doc",
        title: "Design doc",
      });
      expect(created.url).toBe("https://example.com/doc");

      const fetched = await workItem.links.retrieve(created.id);
      expect(fetched.title).toBe("Design doc");

      const updated = await workItem.links.update(created.id, { title: "Renamed doc" });
      expect(updated.title).toBe("Renamed doc");

      await workItem.links.delete(created.id);
      const page = await workItem.links.list();
      expect(page.data.some((row) => row.id === created.id)).toBe(false);
    });
  });

  describe("worklogs", () => {
    it("creates, retrieves, updates, deletes (requires is_time_tracking_enabled)", async () => {
      const created = await workItem.worklogs.create({ duration: 45, description: "Investigated" });
      expect(created.duration).toBe(45);

      const fetched = await workItem.worklogs.retrieve(created.id);
      expect(fetched.description).toBe("Investigated");

      const updated = await workItem.worklogs.update(created.id, { duration: 90 });
      expect(updated.duration).toBe(90);

      await workItem.worklogs.delete(created.id);
    });
  });

  describe("attachments", () => {
    it("is a two-step upload: create returns upload credentials, update confirms is_uploaded", async () => {
      const created = await workItem.attachments.create({ name: "diagram.png", size: 2048 });

      // See the file's own doc comment for why this reaches into the actual wire
      // shape instead of the SDK's static (golden-derived) WorkItemAttachment type.
      const wrapper = created as unknown as {
        asset_id?: string;
        attachment?: { id: string; name?: string; is_uploaded?: boolean };
      };
      const attachmentId = wrapper.attachment?.id ?? (created as unknown as { id: string }).id;
      expect(attachmentId).toBeTruthy();

      const confirmed = await workItem.attachments.update(attachmentId, { is_uploaded: true });
      expect(confirmed.is_uploaded).toBe(true);
      expect(confirmed.name).toBe("diagram.png");

      const fetched = await workItem.attachments.retrieve(attachmentId);
      expect(fetched.id).toBe(attachmentId);

      await workItem.attachments.delete(attachmentId);
    });
  });

  describe("activities (read-only)", () => {
    it("records the parent work item's creation, and lists/retrieves it", async () => {
      const page = await workItem.activities.list();
      expect(page.data.length).toBeGreaterThan(0);
      const createdActivity = page.data.find((row) => row.verb === "created");
      expect(createdActivity).toBeDefined();

      const fetched = await workItem.activities.retrieve(createdActivity!.id);
      expect(fetched.id).toBe(createdActivity!.id);
    });

    it("iterate() follows pages", async () => {
      const seen: string[] = [];
      for await (const row of workItem.activities.iterate({ per_page: 1 })) {
        seen.push(row.id);
      }
      expect(seen.length).toBeGreaterThan(0);
    });
  });
});
