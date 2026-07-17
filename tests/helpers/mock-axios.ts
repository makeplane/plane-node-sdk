import axios, { AxiosResponse } from "axios";
import { PlaneClient } from "../../src/client/plane-client";

/**
 * Shared helpers for the mocked (no-network) release unit tests.
 *
 * IMPORTANT: every test file that imports from here MUST call
 * `jest.mock("axios")` at the top level so the `axios` import below resolves
 * to the auto-mock. These tests never hit the network and require no creds.
 */
export const mockedAxios = axios as jest.Mocked<typeof axios>;

export const MOCK_BASE_URL = "https://api.example.com";
export const MOCK_API_KEY = "test-api-key";
export const MOCK_SLUG = "test-workspace";

/** Build the fully-qualified URL the SDK is expected to call (base + /api/v1 + path). */
export const mockUrl = (path: string): string => `${MOCK_BASE_URL}/api/v1${path}`;

/** Wrap a payload as a minimal AxiosResponse-shaped object. */
export const axiosResponse = <T>(data: T): AxiosResponse<T> =>
  ({ data, status: 200, statusText: "OK", headers: {}, config: {} }) as unknown as AxiosResponse<T>;

/** A fresh PlaneClient wired to the mocked axios. */
export const createMockClient = (): PlaneClient => new PlaneClient({ apiKey: MOCK_API_KEY, baseUrl: MOCK_BASE_URL });

/** Matcher for the request-options object carrying the auth header. */
export const withAuthHeaders = (): unknown =>
  expect.objectContaining({
    headers: expect.objectContaining({ "X-Api-Key": MOCK_API_KEY }),
  });
