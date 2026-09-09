/**
 * `?name=` is case-insensitive but uniqueness is case-sensitive, so two differently-cased rows both match one lookup (the multi-match case).
 */
import { MultipleMatchesFoundError, NoMatchFoundError } from "../../../src/errors/PlaneApiError";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { opsFor, SPECS, WayIn } from "./support/specs";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

/**
 * Driven navigated: `findByName(slug, project, name)` loses two of its three leading
 * parameters through `owned()`, which is exactly the prepend order worth proving live.
 */
const WAY: WayIn = "navigated";

maybe("v2 findByName (live)", () => {
  const suite = useV2Project("findone", env);

  describe.each(SPECS)("$key", (spec) => {
    it("single match", async () => {
      const ops = opsFor(spec, WAY, suite);
      const name = uniqueName(`${spec.key}-single`);
      const created = await ops.create(spec.makeWrite(name));
      try {
        const found = await ops.findByName(name);
        expect(found.id).toBe(created.id);
      } finally {
        await ops.delete(created.id);
      }
    });

    it("zero match raises NoMatchFoundError", async () => {
      const ops = opsFor(spec, WAY, suite);
      await expect(ops.findByName(uniqueName(`${spec.key}-does-not-exist`))).rejects.toBeInstanceOf(NoMatchFoundError);
    });

    it("multiple match raises MultipleMatchesFoundError", async () => {
      const ops = opsFor(spec, WAY, suite);
      const base = uniqueName(`${spec.key}-multi`);
      const lower = await ops.create(spec.makeWrite(base.toLowerCase()));
      const upper = await ops.create(spec.makeWrite(base.toUpperCase()));
      try {
        await expect(ops.findByName(base)).rejects.toBeInstanceOf(MultipleMatchesFoundError);
      } finally {
        await ops.delete(lower.id);
        await ops.delete(upper.id);
      }
    });
  });
});
