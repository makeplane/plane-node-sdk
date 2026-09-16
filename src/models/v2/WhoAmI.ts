export type PrincipalKind = "oauth" | "api_key" | "other";

/** The calling principal, returned by `GET /users/me/`. Every field is required (no `?fields=` support). */
export interface WhoAmI {
  id: string;
  display_name: string;
  email: string;
  principal_kind: PrincipalKind;
  scopes: string[];
}
