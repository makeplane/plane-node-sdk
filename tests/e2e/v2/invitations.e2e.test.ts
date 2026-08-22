/**
 * list/retrieve/create/delete/bulk, workspace-scoped; uses disposable, never-real email addresses so nothing gets emailed.
 */
import { Invitations } from "../../../src/api/v2/Invitations";
import { createV2Client } from "./support/client";
import { v2Env } from "./support/env";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

function disposableEmail(label: string): string {
  return `sdk-v2-node-it-${label}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}@example.invalid`;
}

maybe("Invitations (v2 live)", () => {
  let resource: Invitations;
  let inviteId: string;

  beforeAll(() => {
    const client = createV2Client(env);
    resource = client.v2.workspace(env.workspaceSlug).invitations;
  });

  afterAll(async () => {
    if (!inviteId) return;
    await resource.delete(inviteId).catch(() => undefined);
  });

  it("creates, retrieves, lists, deletes a single invite", async () => {
    const email = disposableEmail("single");
    const created = await resource.create({ email });
    inviteId = created.id;
    expect(created.email).toBe(email);
    expect(created.accepted).toBe(false);

    const fetched = await resource.retrieve(inviteId);
    expect(fetched.id).toBe(inviteId);

    const page = await resource.list({ email });
    expect(page.data.some((row) => row.id === inviteId)).toBe(true);

    await resource.delete(inviteId);
    inviteId = "";
    await expect(resource.retrieve(created.id)).rejects.toThrow();
  });

  it("bulk-creates several invites in one call", async () => {
    const emails = [disposableEmail("bulk-a"), disposableEmail("bulk-b")];

    const created = await resource.bulk({ emails });

    expect(created).toHaveLength(2);
    for (const invite of created) {
      await resource.delete(invite.id).catch(() => undefined);
    }
  });
});
