import axios from "axios";
import nock from "nock";
import { OAuthClient } from "../../src/client/oauth-client";
import { PlaneClient } from "../../src/client/plane-client";
import { HttpError } from "../../src/errors";

/**
 * `enableLogging: true` describes requests; it must never change their outcome.
 * Offline, so it runs without a Plane instance.
 */
const BASE = "https://plane.example.com";
const API_KEY = "logging-test-secret";
const LABELS = "/api/v1/workspaces/ws/projects/p/labels/";
const REQUEST_LOG = "🚀 [REQUEST]";

let log: jest.SpyInstance;

const makeClient = () => new PlaneClient({ apiKey: API_KEY, baseUrl: BASE, enableLogging: true });

/** The payload of every `🚀 [REQUEST]` line logged so far. */
const requestLogs = () => log.mock.calls.filter(([label]) => label === REQUEST_LOG).map(([, entry]) => entry);

beforeEach(() => {
  log = jest.spyOn(console, "log").mockImplementation(() => undefined);
  jest.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  // The logger is installed on the global axios instance; start every test without one.
  axios.interceptors.request.clear();
  nock.cleanAll();
  jest.restoreAllMocks();
});

describe("BaseResource request logging", () => {
  it("sends a request whose body serializes past the truncation limit", async () => {
    const body = { name: "big", description: "x".repeat(1500) };
    const scope = nock(BASE).post(LABELS, body).reply(201, { id: "l1", name: "big" });

    await expect(makeClient().labels.create("ws", "p", body)).resolves.toMatchObject({ id: "l1" });

    expect(scope.isDone()).toBe(true);
  });

  it("logs a truncated body as a string, with the api key redacted", async () => {
    nock(BASE).post(LABELS).reply(201, { id: "l1" });

    await makeClient().labels.create("ws", "p", { name: "big", description: "x".repeat(1500) });

    const [entry] = requestLogs();
    expect(entry.data).toMatch(/\.\.\. \[TRUNCATED\]$/);
    expect(JSON.stringify(entry)).not.toContain(API_KEY);
  });

  it("logs each request once, however many resources the client built", async () => {
    nock(BASE).get(`${LABELS}l1/`).reply(200, { id: "l1" });

    await makeClient().labels.retrieve("ws", "p", "l1");

    expect(requestLogs()).toHaveLength(1);
  });

  it("raises HttpError for a failed request whose response body is large", async () => {
    nock(BASE)
      .get(`${LABELS}l1/`)
      .reply(502, `<html>${"x".repeat(1500)}</html>`);

    const failure = makeClient().labels.retrieve("ws", "p", "l1");

    await expect(failure).rejects.toBeInstanceOf(HttpError);
    await expect(failure).rejects.toMatchObject({ statusCode: 502 });
  });

  it("leaves the host application's own axios requests alone", async () => {
    makeClient(); // installs the logger on the global axios instance
    const scope = nock("https://elsewhere.example.com").post("/hook").reply(200, { ok: true });

    await expect(axios.post("https://elsewhere.example.com/hook", { blob: "z".repeat(1500) })).resolves.toMatchObject({
      status: 200,
    });

    expect(scope.isDone()).toBe(true);
    expect(requestLogs()).toHaveLength(0);
  });

  it("does not log the OAuth token exchange, whose body carries the client secret", async () => {
    makeClient(); // same baseUrl as the OAuth client, as with the api.plane.so defaults
    const scope = nock(BASE).post("/auth/o/token/").reply(200, { access_token: "a" });
    const oauth = new OAuthClient({
      baseUrl: BASE,
      clientId: "client-id",
      clientSecret: "oauth-client-secret",
      redirectUri: "https://app.example.com/callback",
    });

    await oauth.exchangeCodeForToken("auth-code");

    expect(scope.isDone()).toBe(true);
    expect(requestLogs()).toHaveLength(0);
    expect(JSON.stringify(log.mock.calls)).not.toContain("oauth-client-secret");
  });
});
