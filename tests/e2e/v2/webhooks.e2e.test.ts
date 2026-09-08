/**
 * CRUD plus `regenerate`; every webhook points at a placeholder HTTPS URL, nothing here delivers a payload.
 *
 * Flat, because `create`'s one-time `secret_key` only survives on the flat overloads —
 * `Owned` resolves against the general signature and the narrowed `Pick<..., "secret_key">`
 * shape is only reachable by calling the resource directly. A fetched webhook's `logs`
 * navigation is exercised at the end.
 */
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 webhooks (live)", () => {
  const suite = useV2Project("webhooks", env);

  const webhooks = () => suite.client.v2.workspaces.webhooks;
  const slug = () => suite.workspaceSlug;

  it("create returns secret_key once; retrieve never carries it", async () => {
    const created = await webhooks().create(slug(), {
      url: `https://example.com/hooks/${uniqueName("wh")}`,
    });
    try {
      expect(created.secret_key).toBeDefined();

      const fetched = await webhooks().retrieve(slug(), created.id);
      expect((fetched as { secret_key?: string }).secret_key).toBeUndefined();
    } finally {
      await webhooks()
        .delete(slug(), created.id)
        .catch(() => undefined);
    }
  });

  it("lists, updates, deletes", async () => {
    const created = await webhooks().create(slug(), {
      url: `https://example.com/hooks/${uniqueName("wh-crud")}`,
      is_active: true,
    });

    const page = await webhooks().list(slug());
    expect(page.data.some((w) => w.id === created.id)).toBe(true);

    const updated = await webhooks().update(slug(), created.id, { is_active: false });
    expect(updated.is_active).toBe(false);

    await expect(webhooks().delete(slug(), created.id)).resolves.toBeUndefined();
  });

  it("a fetched webhook reaches its own delivery logs", async () => {
    const created = await webhooks().create(slug(), {
      url: `https://example.com/hooks/${uniqueName("wh-logs")}`,
      is_active: false,
    });
    try {
      // `create` answers a navigable row, so the logs of *this* webhook are one hop
      // away with no ids repeated — the flat call is `webhooks.logs.list(slug, id)`.
      const page = await created.logs.list();
      expect(Array.isArray(page.data)).toBe(true);
    } finally {
      await webhooks()
        .delete(slug(), created.id)
        .catch(() => undefined);
    }
  });

  it("regenerate issues a fresh secret_key", async () => {
    const created = await webhooks().create(slug(), {
      url: `https://example.com/hooks/${uniqueName("wh-regen")}`,
    });
    try {
      const regenerated = await webhooks().regenerate(slug(), created.id);
      expect(regenerated.secret_key).toBeDefined();
      expect(regenerated.secret_key).not.toBe(created.secret_key);
    } finally {
      await webhooks()
        .delete(slug(), created.id)
        .catch(() => undefined);
    }
  });
});
