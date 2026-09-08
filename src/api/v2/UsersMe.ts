import { WhoAmI } from "../../models/v2/WhoAmI";
import { AnyOperationId, V2Resource } from "./kernel/resource";

/** `GET /api/v2/users/me/` — the calling principal; not workspace-scoped. */
export class Users extends V2Resource<WhoAmI, never, never> {
  protected path = "/users/me/";
  protected operations: Record<string, AnyOperationId> = {
    me: "users_me_retrieve",
  };

  /**
   * The calling principal (id, display name, email, principal kind, granted scopes).
   *
   * A singleton with no path ids at all — `/users/me/` names no workspace, which is why
   * this is the one resource in api_v2 whose methods take no leading `slug`.
   */
  me(): Promise<WhoAmI> {
    return this.doRetrieveSingleton<WhoAmI>({}, "me");
  }
}
