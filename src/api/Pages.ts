import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import { Page, CreatePage } from "../models/Page";

/**
 * Pages API resource
 * Handles both workspace and project page operations
 */
export class Pages extends BaseResource {
  constructor(config: Configuration) {
    super(config);
  }

  // ===== WORKSPACE PAGES API METHODS =====

  /**
   * Create a workspace page
   */
  async createWorkspacePage(workspaceSlug: string, createPage: CreatePage): Promise<Page> {
    return this.post<Page>(`/workspaces/${workspaceSlug}/pages/`, createPage);
  }

  /**
   * Get a workspace page by ID
   */
  async getWorkspacePage(workspaceSlug: string, pageId: string): Promise<Page> {
    return this.get<Page>(`/workspaces/${workspaceSlug}/pages/${pageId}/`);
  }

  // ===== PROJECT PAGES API METHODS =====

  /**
   * Create a project page
   */
  async createProjectPage(workspaceSlug: string, projectId: string, createPage: CreatePage): Promise<Page> {
    return this.post<Page>(`/workspaces/${workspaceSlug}/projects/${projectId}/pages/`, createPage);
  }

  /**
   * Get a project page by ID
   */
  async getProjectPage(workspaceSlug: string, projectId: string, pageId: string): Promise<Page> {
    return this.get<Page>(`/workspaces/${workspaceSlug}/projects/${projectId}/pages/${pageId}/`);
  }

  /**
   * Retrieve workspace page
   */
  async retrieveWorkspacePage(workspaceSlug: string, pageId: string): Promise<Page> {
    return this.getWorkspacePage(workspaceSlug, pageId);
  }

  /**
   * Retrieve project page
   */
  async retrieveProjectPage(workspaceSlug: string, projectId: string, pageId: string): Promise<Page> {
    return this.getProjectPage(workspaceSlug, projectId, pageId);
  }
}
