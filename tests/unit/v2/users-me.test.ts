import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { Users } from "../../../src/api/v2/UsersMe";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";

const makeUsersMe = () => new Users(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })));

afterEach(() => nock.cleanAll());

describe("Users (v2)", () => {
  it("retrieves the calling principal with no workspace scoping at all", async () => {
    const scope = nock(BASE)
      .get("/api/v2/users/me/")
      .reply(200, {
        id: "user-1",
        display_name: "Ada Lovelace",
        email: "ada@example.com",
        principal_kind: "api_key",
        scopes: ["read", "write"],
      });

    const me = await makeUsersMe().me();

    expect(scope.isDone()).toBe(true);
    expect(me).toEqual({
      id: "user-1",
      display_name: "Ada Lovelace",
      email: "ada@example.com",
      principal_kind: "api_key",
      scopes: ["read", "write"],
    });
  });

  it("sends the configured api key, not a workspace-scoped auth path", async () => {
    const scope = nock(BASE).get("/api/v2/users/me/").matchHeader("X-Api-Key", "secret").reply(200, {
      id: "user-1",
      display_name: "Ada Lovelace",
      email: "ada@example.com",
      principal_kind: "oauth",
      scopes: [],
    });

    await makeUsersMe().me();

    expect(scope.isDone()).toBe(true);
  });
});
