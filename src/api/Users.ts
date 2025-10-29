import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import { User } from "../models/User";

/**
 * User API resource
 * Handles all user-related operations
 */
export class Users extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Get current user information
   */
  async me(): Promise<User> {
    return this.get<User>("/users/me/");
  }
}
