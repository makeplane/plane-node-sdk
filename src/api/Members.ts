import { BaseResource } from './BaseResource';
import { Configuration } from '../Configuration';

/**
 * Member model interfaces
 */
export interface Member {
  id: string;
  user: string;
  project: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMember {
  user: string;
  project: string;
  role: string;
}

export interface UpdateMember {
  role?: string;
}

export interface ListMembersParams {
  project?: string;
  user?: string;
  role?: string;
  limit?: number;
  offset?: number;
}

/**
 * Members API resource
 * Handles all team membership related operations
 */
export class Members extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Create a new member
   */
  async create(createMember: CreateMember): Promise<Member> {
    return this.post<Member>('', createMember);
  }

  /**
   * Retrieve a member by ID
   */
  async retrieve(memberId: string): Promise<Member> {
    return this.get<Member>(`/${memberId}`);
  }

  /**
   * Update a member
   */
  async update(memberId: string, updateMember: UpdateMember): Promise<Member> {
    return this.patch<Member>(`/${memberId}`, updateMember);
  }

  /**
   * Delete a member
   */
  async delete(memberId: string): Promise<void> {
    return this.delete(`/${memberId}`);
  }

  /**
   * List members with optional filtering
   */
  async list(params?: ListMembersParams): Promise<Member[]> {
    return this.get<Member[]>('', params);
  }
}
