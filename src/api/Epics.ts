import { BaseResource } from './BaseResource';
import { Configuration } from '../Configuration';
import { Epic } from '../models/schema-types';
import { PaginatedResponse } from '../models/common';

/**
 * Epics API resource
 * Handles all epic-related operations
 */
export class Epics extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  /**
   * Retrieve an epic by ID
   */
  async retrieve(
    workspaceSlug: string,
    projectId: string,
    epicId: string
  ): Promise<Epic> {
    return this.get<Epic>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/epics/${epicId}/`
    );
  }

  /**
   * List epics with optional filtering
   */
  async list(
    workspaceSlug: string,
    projectId: string,
    params?: any
  ): Promise<PaginatedResponse<Epic>> {
    return this.get<PaginatedResponse<Epic>>(
      `/workspaces/${workspaceSlug}/projects/${projectId}/epics/`,
      params
    );
  }
}
