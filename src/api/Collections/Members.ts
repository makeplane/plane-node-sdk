import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { CollectionMember, CreateCollectionMember, UpdateCollectionMember } from "../../models/Collection";

/**
 * CollectionMembers sub-resource
 * Manages members of a (typically private) collection
 */
export class Members extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * List members of a collection
   */
  async list(workspaceSlug: string, collectionId: string): Promise<CollectionMember[]> {
    const data = await this.get<CollectionMember[] | { results: CollectionMember[] }>(
      `/workspaces/${workspaceSlug}/collections/${collectionId}/members/`
    );
    return Array.isArray(data) ? data : data.results;
  }

  /**
   * Add a member to a collection
   */
  async add(
    workspaceSlug: string,
    collectionId: string,
    memberData: CreateCollectionMember
  ): Promise<CollectionMember> {
    return this.post<CollectionMember>(`/workspaces/${workspaceSlug}/collections/${collectionId}/members/`, memberData);
  }

  /**
   * Update a collection member's access level.
   *
   * @param memberId - UUID of the CollectionMember row (not the user id)
   */
  async update(
    workspaceSlug: string,
    collectionId: string,
    memberId: string,
    memberData: UpdateCollectionMember
  ): Promise<CollectionMember> {
    return this.patch<CollectionMember>(
      `/workspaces/${workspaceSlug}/collections/${collectionId}/members/${memberId}/`,
      memberData
    );
  }

  /**
   * Remove a member from a collection.
   *
   * @param memberId - UUID of the CollectionMember row (not the user id)
   */
  async remove(workspaceSlug: string, collectionId: string, memberId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/collections/${collectionId}/members/${memberId}/`);
  }
}
