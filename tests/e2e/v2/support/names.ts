/**
 * A name unlikely to collide with another test/run; state/label names are unique per project, case-sensitively.
 */
export function uniqueName(prefix: string): string {
  const suffix = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  return `${prefix}-${suffix}`;
}
