/**
 * `create`/`delete` on project membership need `TEST_SECONDARY_MEMBER_ID`; those tests self-skip when it's unset.
 */
import { v2Env } from "./support/env";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;
const secondaryMemberId = process.env.TEST_SECONDARY_MEMBER_ID;
const maybeWithMember = env.ready && secondaryMemberId ? it : it.skip;

maybe("v2 members (live)", () => {
  const suite = useV2Project("members", env);

  const ws = () => suite.client.v2.workspace(suite.workspaceSlug);
  const proj = () => ws().project(suite.projectId);

  describe("project-scoped", () => {
    it("lists the creating user as a project member", async () => {
      const page = await proj().members.list();
      expect(page.data.length).toBeGreaterThan(0);
    });

    maybeWithMember("adds, updates the role, then removes a project member", async () => {
      const created = await proj().members.create({
        member_id: secondaryMemberId!,
      });
      expect(created.member_id).toBe(secondaryMemberId);

      const updated = await proj().members.update(created.id, {
        role: "admin",
      });
      expect(updated.role).toBe("admin");

      await expect(proj().members.delete(created.id)).resolves.toBeUndefined();
    });
  });

  describe("workspace-scoped", () => {
    it("list lists the creating user as a workspace member", async () => {
      const page = await ws().members.list();
      expect(page.data.length).toBeGreaterThan(0);
    });

    it("iterate yields at least one member", async () => {
      const ids: string[] = [];
      for await (const m of ws().members.iterate()) ids.push(m.id);
      expect(ids.length).toBeGreaterThan(0);
    });

    // `remove` needs a real, removable email on this workspace — exercised structurally
    // (right endpoint, right error shape) rather than actually removing anyone.
    it("remove rejects an email that isn't a member of the workspace", async () => {
      await expect(
        ws().members.remove({
          email: "definitely-not-a-member@example.invalid",
        })
      ).rejects.toThrow();
    });
  });
});
