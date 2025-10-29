import { PlaneClient } from "../../src/client/plane-client";

/**
 * Creates a configured PlaneClient instance for testing
 * @returns PlaneClient instance with test configuration
 */
export function createTestClient(): PlaneClient {
  return new PlaneClient({
    apiKey: process.env.PLANE_API_KEY!,
    baseUrl: process.env.PLANE_BASE_URL!,
  });
}

/**
 * Waits for a given number of seconds
 * @param seconds - The number of seconds to wait
 * @returns A promise that resolves after the given number of seconds
 */
export function wait(seconds = 60): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

/**
 * Randomizes a name by appending a random string to the end
 * @param name - The name to randomize
 * @param length - The length of the random string to append
 * @returns The randomized name
 */
export function randomizeName(prefix: string = ""): string {
  return prefix + Math.random().toString(36).substring(2, 10);
}
