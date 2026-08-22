/**
 * A cycle is "completed" once `end_date` is in the past; a completed cycle rejects new work items via either path, confirmed live.
 */
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("Cycles.transfer/manageWorkItems (v2 live)", () => {
  const suite = useV2Project("cycAct", env);
  const proj = () => suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);

  it("adds/removes work items, then transfers a completed cycle's leftovers", async () => {
    const sourceCycle = await proj().cycles.create({
      name: uniqueName("cyc-source"),
      // No end_date yet — the cycle must stay open until it has been populated;
      // see this file's own doc comment for why.
    });
    const targetCycle = await proj().cycles.create({ name: uniqueName("cyc-target") });

    const workItem = await proj().workItems.create({ name: uniqueName("cycAct-wi") });

    // manageWorkItems.add is itself blocked once the cycle is "completed" (mirrors
    // `roles.py`'s own "already completed" guard) — exercise add/remove on a fresh,
    // not-yet-completed cycle instead, then transfer separately below.
    const openCycle = await proj().cycles.create({ name: uniqueName("cyc-open") });
    const added = await proj().cycles.manageWorkItems(openCycle.id, { add: [workItem.id] });
    expect(added.added).toContain(workItem.id);

    const removed = await proj().cycles.manageWorkItems(openCycle.id, { remove: [workItem.id] });
    expect(removed.removed).toContain(workItem.id);

    // Populate the still-open source cycle directly via the work item's own
    // `cycle_id` — this would 400 (`cycle_id`: "This cycle is already completed;
    // no new work items can be added to it.") if the cycle were completed first.
    const cycleWorkItem = await proj().workItems.create({
      name: uniqueName("cycAct-transfer-wi"),
      cycle_id: sourceCycle.id,
    });
    expect(cycleWorkItem.cycle_id).toBe(sourceCycle.id);

    // Only now move the source cycle's end_date into the past, completing it —
    // `transfer`'s own precondition.
    await proj().cycles.update(sourceCycle.id, { start_date: "2020-01-01", end_date: "2020-01-31" });

    const transferred = await proj().cycles.transfer(sourceCycle.id, { new_cycle_id: targetCycle.id });
    expect(transferred.new_cycle_id).toBe(targetCycle.id);

    const moved = await proj().workItems.retrieve(cycleWorkItem.id, { fields: ["cycle_id"] });
    expect(moved.cycle_id).toBe(targetCycle.id);
  });
});
