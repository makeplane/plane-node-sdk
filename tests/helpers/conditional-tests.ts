/**
 * Test utilities for conditional test execution based on configuration
 */

/**
 * Creates a conditional describe block that skips all tests if condition is false
 * @param condition - Boolean condition to check
 * @param name - Name of the test suite
 * @param fn - Test suite function
 * @returns Jest describe block (either normal or skipped)
 */
export const describeIf = (condition: boolean, name: string, fn: () => void) => {
  return condition ? describe(name, fn) : describe.skip(name, fn);
};
