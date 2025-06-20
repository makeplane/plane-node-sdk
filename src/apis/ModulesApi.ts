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
  Module,
  ModuleCreateRequest,
  ModuleIssue,
  ModuleIssueRequestRequest,
  PaginatedArchivedModuleResponse,
  PaginatedModuleIssueResponse,
  PaginatedModuleResponse,
  PatchedModuleUpdateRequest,
} from '../models/index';
import {
    ModuleFromJSON,
    ModuleToJSON,
    ModuleCreateRequestFromJSON,
    ModuleCreateRequestToJSON,
    ModuleIssueFromJSON,
    ModuleIssueToJSON,
    ModuleIssueRequestRequestFromJSON,
    ModuleIssueRequestRequestToJSON,
    PaginatedArchivedModuleResponseFromJSON,
    PaginatedArchivedModuleResponseToJSON,
    PaginatedModuleIssueResponseFromJSON,
    PaginatedModuleIssueResponseToJSON,
    PaginatedModuleResponseFromJSON,
    PaginatedModuleResponseToJSON,
    PatchedModuleUpdateRequestFromJSON,
    PatchedModuleUpdateRequestToJSON,
} from '../models/index';

export interface AddModuleWorkItemsRequest {
    moduleId: string;
    projectId: string;
    slug: string;
    moduleIssueRequestRequest: ModuleIssueRequestRequest;
}

export interface ArchiveModuleRequest {
    pk: string;
    projectId: string;
    slug: string;
}

export interface CreateModuleRequest {
    projectId: string;
    slug: string;
    moduleCreateRequest: ModuleCreateRequest;
}

export interface DeleteModuleRequest {
    pk: string;
    projectId: string;
    slug: string;
}

export interface DeleteModuleWorkItemRequest {
    issueId: string;
    moduleId: string;
    projectId: string;
    slug: string;
}

export interface ListArchivedModulesRequest {
    projectId: string;
    slug: string;
    cursor?: string;
    expand?: string;
    fields?: string;
    orderBy?: string;
    perPage?: number;
}

export interface ListModuleWorkItemsRequest {
    moduleId: string;
    projectId: string;
    slug: string;
    cursor?: string;
    expand?: string;
    fields?: string;
    orderBy?: string;
    perPage?: number;
}

export interface ListModulesRequest {
    projectId: string;
    slug: string;
    cursor?: string;
    expand?: string;
    fields?: string;
    orderBy?: string;
    perPage?: number;
}

export interface RetrieveModuleRequest {
    pk: string;
    projectId: string;
    slug: string;
}

export interface UnarchiveModuleRequest {
    pk: string;
    projectId: string;
    slug: string;
}

export interface UpdateModuleRequest {
    pk: string;
    projectId: string;
    slug: string;
    patchedModuleUpdateRequest?: PatchedModuleUpdateRequest;
}

/**
 * 
 */
export class ModulesApi extends runtime.BaseAPI {

    /**
     * Assign multiple work items to a module or move them from another module. Automatically handles bulk creation and updates with activity tracking.
     * Add Work Items to Module
     */
    async addModuleWorkItemsRaw(requestParameters: AddModuleWorkItemsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ModuleIssue>> {
        if (requestParameters['moduleId'] == null) {
            throw new runtime.RequiredError(
                'moduleId',
                'Required parameter "moduleId" was null or undefined when calling addModuleWorkItems().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling addModuleWorkItems().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling addModuleWorkItems().'
            );
        }

        if (requestParameters['moduleIssueRequestRequest'] == null) {
            throw new runtime.RequiredError(
                'moduleIssueRequestRequest',
                'Required parameter "moduleIssueRequestRequest" was null or undefined when calling addModuleWorkItems().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/modules/{module_id}/module-issues/`.replace(`{${"module_id"}}`, encodeURIComponent(String(requestParameters['moduleId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ModuleIssueRequestRequestToJSON(requestParameters['moduleIssueRequestRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ModuleIssueFromJSON(jsonValue));
    }

    /**
     * Assign multiple work items to a module or move them from another module. Automatically handles bulk creation and updates with activity tracking.
     * Add Work Items to Module
     */
    async addModuleWorkItems(requestParameters: AddModuleWorkItemsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ModuleIssue> {
        const response = await this.addModuleWorkItemsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Move a module to archived status for historical tracking.
     * Archive module
     */
    async archiveModuleRaw(requestParameters: ArchiveModuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling archiveModule().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling archiveModule().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling archiveModule().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/modules/{pk}/archive/`.replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Move a module to archived status for historical tracking.
     * Archive module
     */
    async archiveModule(requestParameters: ArchiveModuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.archiveModuleRaw(requestParameters, initOverrides);
    }

    /**
     * Create a new project module with specified name, description, and timeline.
     * Create module
     */
    async createModuleRaw(requestParameters: CreateModuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Module>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling createModule().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling createModule().'
            );
        }

        if (requestParameters['moduleCreateRequest'] == null) {
            throw new runtime.RequiredError(
                'moduleCreateRequest',
                'Required parameter "moduleCreateRequest" was null or undefined when calling createModule().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/modules/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ModuleCreateRequestToJSON(requestParameters['moduleCreateRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ModuleFromJSON(jsonValue));
    }

    /**
     * Create a new project module with specified name, description, and timeline.
     * Create module
     */
    async createModule(requestParameters: CreateModuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Module> {
        const response = await this.createModuleRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Permanently remove a module and all its associated issue relationships.
     * Delete module
     */
    async deleteModuleRaw(requestParameters: DeleteModuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling deleteModule().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling deleteModule().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling deleteModule().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/modules/{pk}/`.replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Permanently remove a module and all its associated issue relationships.
     * Delete module
     */
    async deleteModule(requestParameters: DeleteModuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteModuleRaw(requestParameters, initOverrides);
    }

    /**
     * Remove a work item from a module while keeping the work item in the project.
     * Delete module work item
     */
    async deleteModuleWorkItemRaw(requestParameters: DeleteModuleWorkItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling deleteModuleWorkItem().'
            );
        }

        if (requestParameters['moduleId'] == null) {
            throw new runtime.RequiredError(
                'moduleId',
                'Required parameter "moduleId" was null or undefined when calling deleteModuleWorkItem().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling deleteModuleWorkItem().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling deleteModuleWorkItem().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/modules/{module_id}/module-issues/{issue_id}/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"module_id"}}`, encodeURIComponent(String(requestParameters['moduleId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Remove a work item from a module while keeping the work item in the project.
     * Delete module work item
     */
    async deleteModuleWorkItem(requestParameters: DeleteModuleWorkItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteModuleWorkItemRaw(requestParameters, initOverrides);
    }

    /**
     * Retrieve all modules that have been archived in the project.
     * List archived modules
     */
    async listArchivedModulesRaw(requestParameters: ListArchivedModulesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PaginatedArchivedModuleResponse>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling listArchivedModules().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling listArchivedModules().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/archived-modules/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PaginatedArchivedModuleResponseFromJSON(jsonValue));
    }

    /**
     * Retrieve all modules that have been archived in the project.
     * List archived modules
     */
    async listArchivedModules(requestParameters: ListArchivedModulesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PaginatedArchivedModuleResponse> {
        const response = await this.listArchivedModulesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieve all work items assigned to a module with detailed information.
     * List module work items
     */
    async listModuleWorkItemsRaw(requestParameters: ListModuleWorkItemsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PaginatedModuleIssueResponse>> {
        if (requestParameters['moduleId'] == null) {
            throw new runtime.RequiredError(
                'moduleId',
                'Required parameter "moduleId" was null or undefined when calling listModuleWorkItems().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling listModuleWorkItems().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling listModuleWorkItems().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/modules/{module_id}/module-issues/`.replace(`{${"module_id"}}`, encodeURIComponent(String(requestParameters['moduleId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PaginatedModuleIssueResponseFromJSON(jsonValue));
    }

    /**
     * Retrieve all work items assigned to a module with detailed information.
     * List module work items
     */
    async listModuleWorkItems(requestParameters: ListModuleWorkItemsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PaginatedModuleIssueResponse> {
        const response = await this.listModuleWorkItemsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieve all modules in a project.
     * List modules
     */
    async listModulesRaw(requestParameters: ListModulesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PaginatedModuleResponse>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling listModules().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling listModules().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/modules/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PaginatedModuleResponseFromJSON(jsonValue));
    }

    /**
     * Retrieve all modules in a project.
     * List modules
     */
    async listModules(requestParameters: ListModulesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PaginatedModuleResponse> {
        const response = await this.listModulesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieve details of a specific module.
     * Retrieve module
     */
    async retrieveModuleRaw(requestParameters: RetrieveModuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Module>> {
        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling retrieveModule().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling retrieveModule().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling retrieveModule().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/modules/{pk}/`.replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ModuleFromJSON(jsonValue));
    }

    /**
     * Retrieve details of a specific module.
     * Retrieve module
     */
    async retrieveModule(requestParameters: RetrieveModuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Module> {
        const response = await this.retrieveModuleRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Restore an archived module to active status, making it available for regular use.
     * Unarchive module
     */
    async unarchiveModuleRaw(requestParameters: UnarchiveModuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling unarchiveModule().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling unarchiveModule().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling unarchiveModule().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/archived-modules/{pk}/unarchive/`.replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Restore an archived module to active status, making it available for regular use.
     * Unarchive module
     */
    async unarchiveModule(requestParameters: UnarchiveModuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.unarchiveModuleRaw(requestParameters, initOverrides);
    }

    /**
     * Modify an existing module\'s properties like name, description, status, or timeline.
     * Update module
     */
    async updateModuleRaw(requestParameters: UpdateModuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Module>> {
        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling updateModule().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling updateModule().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling updateModule().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/modules/{pk}/`.replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: PatchedModuleUpdateRequestToJSON(requestParameters['patchedModuleUpdateRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ModuleFromJSON(jsonValue));
    }

    /**
     * Modify an existing module\'s properties like name, description, status, or timeline.
     * Update module
     */
    async updateModule(requestParameters: UpdateModuleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Module> {
        const response = await this.updateModuleRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
