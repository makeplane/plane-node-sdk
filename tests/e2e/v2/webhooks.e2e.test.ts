/**
 * CRUD plus `regenerate`; every webhook points at a placeholder HTTPS URL, nothing here delivers a payload.
 */
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 webhooks (live)", () => {
  const suite = useV2Project("webhooks", env);

  const webhooks = () => suite.client.v2.workspace(suite.workspaceSlug).webhooks;

  it("create returns secret_key once; retrieve never carries it", async () => {
    const created = await webhooks().create({
      url: `https://example.com/hooks/${uniqueName("wh")}`,
    });
    try {
      expect(created.secret_key).toBeDefined();

      const fetched = await webhooks().retrieve(created.id);
      expect((fetched as { secret_key?: string }).secret_key).toBeUndefined();
    } finally {
      await webhooks()
        .delete(created.id)
        .catch(() => undefined);
    }
  });

  it("lists, updates, deletes", async () => {
    const created = await webhooks().create({
      url: `https://example.com/hooks/${uniqueName("wh-crud")}`,
      is_active: true,
    });

    const page = await webhooks().list();
    expect(page.data.some((w) => w.id === created.id)).toBe(true);

    const updated = await webhooks().update(created.id, { is_active: false });
    expect(updated.is_active).toBe(false);

    await expect(webhooks().delete(created.id)).resolves.toBeUndefined();
  });

  it("regenerate issues a fresh secret_key", async () => {
    const created = await webhooks().create({
      url: `https://example.com/hooks/${uniqueName("wh-regen")}`,
    });
    try {
      const regenerated = await webhooks().regenerate(created.id);
      expect(regenerated.secret_key).toBeDefined();
      expect(regenerated.secret_key).not.toBe(created.secret_key);
    } finally {
      await webhooks()
        .delete(created.id)
        .catch(() => undefined);
    }
  });
});
