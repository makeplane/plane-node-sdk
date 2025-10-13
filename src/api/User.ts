import { BaseResource } from './BaseResource';
import { Configuration } from '../Configuration';
import { UserLite } from '../models/schema-types';

/**
 * User API resource
 * Handles all user-related operations
 */
export class User extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Get current user information
   */
  async me(): Promise<UserLite> {
    return this.get<UserLite>('/users/me/');
  }
}
