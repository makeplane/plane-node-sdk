/* tslint:disable */
/* eslint-disable */
/**
 * The Plane REST API
 * The Plane REST API  Visit our quick start guide and full API documentation at [developers.plane.so](https://developers.plane.so/api-reference/introduction).
 *
 * The version of the API Spec: 0.0.1
 * Contact: support@plane.so
 *
 * NOTE: This class is auto generated.
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  PaginatedProjectResponse,
  PatchedProjectUpdateRequest,
  Project,
  ProjectCreateRequest,
} from '../models/index';
import {
    PaginatedProjectResponseFromJSON,
    PaginatedProjectResponseToJSON,
    PatchedProjectUpdateRequestFromJSON,
    PatchedProjectUpdateRequestToJSON,
    ProjectFromJSON,
    ProjectToJSON,
    ProjectCreateRequestFromJSON,
    ProjectCreateRequestToJSON,
} from '../models/index';

export interface ArchiveProjectRequest {
    projectId: string;
    slug: string;
}

export interface CreateProjectRequest {
    slug: string;
    projectCreateRequest: ProjectCreateRequest;
}

export interface DeleteProjectRequest {
    pk: string;
    slug: string;
}

export interface ListProjectsRequest {
    slug: string;
    cursor?: string;
    expand?: string;
    fields?: string;
    orderBy?: string;
    perPage?: number;
}

export interface RetrieveProjectRequest {
    pk: string;
    slug: string;
}

export interface UnarchiveProjectRequest {
    projectId: string;
    slug: string;
}

export interface UpdateProjectRequest {
    pk: string;
    slug: string;
    patchedProjectUpdateRequest?: PatchedProjectUpdateRequest;
}

/**
 * 
 */
export class ProjectsApi extends runtime.BaseAPI {

    /**
     * Move a project to archived status, hiding it from active project lists.
     * Archive project
     */
    async archiveProjectRaw(requestParameters: ArchiveProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling archiveProject().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling archiveProject().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-API-Key"] = await this.configuration.apiKey("X-API-Key"); // ApiKeyAuthentication authentication
        }

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2Authentication", []);
        }

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/archive/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Move a project to archived status, hiding it from active project lists.
     * Archive project
     */
    async archiveProject(requestParameters: ArchiveProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.archiveProjectRaw(requestParameters, initOverrides);
    }

    /**
     * Create a new project in the workspace with default states and member assignments.
     * Create project
     */
    async createProjectRaw(requestParameters: CreateProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Project>> {
        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling createProject().'
            );
        }

        if (requestParameters['projectCreateRequest'] == null) {
            throw new runtime.RequiredError(
                'projectCreateRequest',
                'Required parameter "projectCreateRequest" was null or undefined when calling createProject().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-API-Key"] = await this.configuration.apiKey("X-API-Key"); // ApiKeyAuthentication authentication
        }

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2Authentication", []);
        }

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/workspaces/{slug}/projects/`.replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ProjectCreateRequestToJSON(requestParameters['projectCreateRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProjectFromJSON(jsonValue));
    }

    /**
     * Create a new project in the workspace with default states and member assignments.
     * Create project
     */
    async createProject(requestParameters: CreateProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Project> {
        const response = await this.createProjectRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Permanently remove a project and all its associated data from the workspace.
     * Delete project
     */
    async deleteProjectRaw(requestParameters: DeleteProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling deleteProject().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling deleteProject().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-API-Key"] = await this.configuration.apiKey("X-API-Key"); // ApiKeyAuthentication authentication
        }

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2Authentication", []);
        }

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/workspaces/{slug}/projects/{pk}/`.replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Permanently remove a project and all its associated data from the workspace.
     * Delete project
     */
    async deleteProject(requestParameters: DeleteProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteProjectRaw(requestParameters, initOverrides);
    }

    /**
     * Retrieve all projects in a workspace or get details of a specific project.
     * List or retrieve projects
     */
    async listProjectsRaw(requestParameters: ListProjectsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PaginatedProjectResponse>> {
        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling listProjects().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['cursor'] != null) {
            queryParameters['cursor'] = requestParameters['cursor'];
        }

        if (requestParameters['expand'] != null) {
            queryParameters['expand'] = requestParameters['expand'];
        }

        if (requestParameters['fields'] != null) {
            queryParameters['fields'] = requestParameters['fields'];
        }

        if (requestParameters['orderBy'] != null) {
            queryParameters['order_by'] = requestParameters['orderBy'];
        }

        if (requestParameters['perPage'] != null) {
            queryParameters['per_page'] = requestParameters['perPage'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-API-Key"] = await this.configuration.apiKey("X-API-Key"); // ApiKeyAuthentication authentication
        }

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2Authentication", []);
        }

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/workspaces/{slug}/projects/`.replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PaginatedProjectResponseFromJSON(jsonValue));
    }

    /**
     * Retrieve all projects in a workspace or get details of a specific project.
     * List or retrieve projects
     */
    async listProjects(requestParameters: ListProjectsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PaginatedProjectResponse> {
        const response = await this.listProjectsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieve details of a specific project.
     * Retrieve project
     */
    async retrieveProjectRaw(requestParameters: RetrieveProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Project>> {
        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling retrieveProject().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling retrieveProject().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-API-Key"] = await this.configuration.apiKey("X-API-Key"); // ApiKeyAuthentication authentication
        }

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2Authentication", []);
        }

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/workspaces/{slug}/projects/{pk}/`.replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProjectFromJSON(jsonValue));
    }

    /**
     * Retrieve details of a specific project.
     * Retrieve project
     */
    async retrieveProject(requestParameters: RetrieveProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Project> {
        const response = await this.retrieveProjectRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Restore an archived project to active status, making it available in regular workflows.
     * Unarchive project
     */
    async unarchiveProjectRaw(requestParameters: UnarchiveProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling unarchiveProject().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling unarchiveProject().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-API-Key"] = await this.configuration.apiKey("X-API-Key"); // ApiKeyAuthentication authentication
        }

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2Authentication", []);
        }

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/archive/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Restore an archived project to active status, making it available in regular workflows.
     * Unarchive project
     */
    async unarchiveProject(requestParameters: UnarchiveProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.unarchiveProjectRaw(requestParameters, initOverrides);
    }

    /**
     * Partially update an existing project\'s properties like name, description, or settings.
     * Update project
     */
    async updateProjectRaw(requestParameters: UpdateProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Project>> {
        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling updateProject().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling updateProject().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-API-Key"] = await this.configuration.apiKey("X-API-Key"); // ApiKeyAuthentication authentication
        }

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2Authentication", []);
        }

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/workspaces/{slug}/projects/{pk}/`.replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: PatchedProjectUpdateRequestToJSON(requestParameters['patchedProjectUpdateRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProjectFromJSON(jsonValue));
    }

    /**
     * Partially update an existing project\'s properties like name, description, or settings.
     * Update project
     */
    async updateProject(requestParameters: UpdateProjectRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Project> {
        const response = await this.updateProjectRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
