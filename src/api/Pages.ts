import { BaseResource } from "./BaseResource";
import { Configuration } from "../Configuration";
import { Page, CreatePage, UpdatePage } from "../models/Page";
import { PaginatedResponse } from "../models/common";

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

  /**
   * List workspace pages
   */
  async listWorkspacePages(workspaceSlug: string, params?: any): Promise<PaginatedResponse<Page>> {
    return this.get<PaginatedResponse<Page>>(`/workspaces/${workspaceSlug}/pages/`, params);
  }

  /**
   * Update a workspace page's name, content, or both. A page that is locked or
   * archived is refused.
   *
   * Content is written through Plane's live collaboration service, which owns the
   * document. If it is unreachable the API answers 502 and nothing is written,
   * rather than leaving the editor showing the old text.
   */
  async updateWorkspacePage(workspaceSlug: string, pageId: string, updatePage: UpdatePage): Promise<Page> {
    return this.put<Page>(`/workspaces/${workspaceSlug}/pages/${pageId}/`, updatePage);
  }

  /**
   * Archive a workspace page. Archiving is the reversible step the API requires
   * before a page can be deleted.
   */
  async archiveWorkspacePage(workspaceSlug: string, pageId: string): Promise<void> {
    return this.post<void>(`/workspaces/${workspaceSlug}/pages/${pageId}/archive/`);
  }

  /**
   * Restore an archived workspace page
   */
  async unarchiveWorkspacePage(workspaceSlug: string, pageId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/pages/${pageId}/archive/`);
  }

  /**
   * Delete a workspace page. The page must be archived first; the API answers 400
   * "The page should be archived before deleting" otherwise.
   */
  async deleteWorkspacePage(workspaceSlug: string, pageId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/pages/${pageId}/`);
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
   * List project pages
   */
  async listProjectPages(workspaceSlug: string, projectId: string, params?: any): Promise<PaginatedResponse<Page>> {
    return this.get<PaginatedResponse<Page>>(`/workspaces/${workspaceSlug}/projects/${projectId}/pages/`, params);
  }

  /**
   * Update a project page's name, content, or both. A page that is locked or
   * archived is refused.
   *
   * Content is written through Plane's live collaboration service, which owns the
   * document. If it is unreachable the API answers 502 and nothing is written,
   * rather than leaving the editor showing the old text.
   */
  async updateProjectPage(
    workspaceSlug: string,
    projectId: string,
    pageId: string,
    updatePage: UpdatePage
  ): Promise<Page> {
    return this.put<Page>(`/workspaces/${workspaceSlug}/projects/${projectId}/pages/${pageId}/`, updatePage);
  }

  /**
   * Archive a project page. Archiving is the reversible step the API requires
   * before a page can be deleted.
   */
  async archiveProjectPage(workspaceSlug: string, projectId: string, pageId: string): Promise<void> {
    return this.post<void>(`/workspaces/${workspaceSlug}/projects/${projectId}/pages/${pageId}/archive/`);
  }

  /**
   * Restore an archived project page
   */
  async unarchiveProjectPage(workspaceSlug: string, projectId: string, pageId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/projects/${projectId}/pages/${pageId}/archive/`);
  }

  /**
   * Delete a project page. The page must be archived first; the API answers 400
   * "The page should be archived before deleting" otherwise.
   */
  async deleteProjectPage(workspaceSlug: string, projectId: string, pageId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/projects/${projectId}/pages/${pageId}/`);
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
