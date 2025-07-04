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
  Issue,
  IssueRequest,
  IssueSearch,
  PaginatedWorkItemResponse,
  PatchedIssueRequest,
} from '../models/index';
import {
    IssueFromJSON,
    IssueToJSON,
    IssueRequestFromJSON,
    IssueRequestToJSON,
    IssueSearchFromJSON,
    IssueSearchToJSON,
    PaginatedWorkItemResponseFromJSON,
    PaginatedWorkItemResponseToJSON,
    PatchedIssueRequestFromJSON,
    PatchedIssueRequestToJSON,
} from '../models/index';

export interface CreateWorkItemRequest {
    projectId: string;
    slug: string;
    issueRequest: IssueRequest;
}

export interface DeleteWorkItemRequest {
    pk: string;
    projectId: string;
    slug: string;
}

export interface GetWorkspaceWorkItemRequest {
    issueIdentifier: number;
    projectIdentifier: string;
    slug: string;
}

export interface ListWorkItemsRequest {
    projectId: string;
    slug: string;
    cursor?: string;
    expand?: string;
    externalId?: string;
    externalSource?: string;
    fields?: string;
    orderBy?: string;
    perPage?: number;
}

export interface RetrieveWorkItemRequest {
    pk: string;
    projectId: string;
    slug: string;
    expand?: string;
    externalId?: string;
    externalSource?: string;
    fields?: string;
    orderBy?: string;
}

export interface SearchWorkItemsRequest {
    search: string;
    slug: string;
    limit?: number;
    projectId?: string;
    workspaceSearch?: string;
}

export interface UpdateWorkItemRequest {
    pk: string;
    projectId: string;
    slug: string;
    patchedIssueRequest?: PatchedIssueRequest;
}

/**
 * 
 */
export class WorkItemsApi extends runtime.BaseAPI {

    /**
     * Create a new work item in the specified project with the provided details.
     * Create work item
     */
    async createWorkItemRaw(requestParameters: CreateWorkItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Issue>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling createWorkItem().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling createWorkItem().'
            );
        }

        if (requestParameters['issueRequest'] == null) {
            throw new runtime.RequiredError(
                'issueRequest',
                'Required parameter "issueRequest" was null or undefined when calling createWorkItem().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: IssueRequestToJSON(requestParameters['issueRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssueFromJSON(jsonValue));
    }

    /**
     * Create a new work item in the specified project with the provided details.
     * Create work item
     */
    async createWorkItem(requestParameters: CreateWorkItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Issue> {
        const response = await this.createWorkItemRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Permanently delete an existing work item from the project. Only admins or the item creator can perform this action.
     * Delete work item
     */
    async deleteWorkItemRaw(requestParameters: DeleteWorkItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling deleteWorkItem().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling deleteWorkItem().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling deleteWorkItem().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/{pk}/`.replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Permanently delete an existing work item from the project. Only admins or the item creator can perform this action.
     * Delete work item
     */
    async deleteWorkItem(requestParameters: DeleteWorkItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteWorkItemRaw(requestParameters, initOverrides);
    }

    /**
     * Retrieve a specific work item using workspace slug, project identifier, and issue identifier.
     * Retrieve work item by identifiers
     */
    async getWorkspaceWorkItemRaw(requestParameters: GetWorkspaceWorkItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Issue>> {
        if (requestParameters['issueIdentifier'] == null) {
            throw new runtime.RequiredError(
                'issueIdentifier',
                'Required parameter "issueIdentifier" was null or undefined when calling getWorkspaceWorkItem().'
            );
        }

        if (requestParameters['projectIdentifier'] == null) {
            throw new runtime.RequiredError(
                'projectIdentifier',
                'Required parameter "projectIdentifier" was null or undefined when calling getWorkspaceWorkItem().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling getWorkspaceWorkItem().'
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
            path: `/api/v1/workspaces/{slug}/issues/{project_identifier}-{issue_identifier}/`.replace(`{${"issue_identifier"}}`, encodeURIComponent(String(requestParameters['issueIdentifier']))).replace(`{${"project_identifier"}}`, encodeURIComponent(String(requestParameters['projectIdentifier']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssueFromJSON(jsonValue));
    }

    /**
     * Retrieve a specific work item using workspace slug, project identifier, and issue identifier.
     * Retrieve work item by identifiers
     */
    async getWorkspaceWorkItem(requestParameters: GetWorkspaceWorkItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Issue> {
        const response = await this.getWorkspaceWorkItemRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieve a paginated list of all work items in a project. Supports filtering, ordering, and field selection through query parameters.
     * List work items
     */
    async listWorkItemsRaw(requestParameters: ListWorkItemsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PaginatedWorkItemResponse>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling listWorkItems().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling listWorkItems().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['cursor'] != null) {
            queryParameters['cursor'] = requestParameters['cursor'];
        }

        if (requestParameters['expand'] != null) {
            queryParameters['expand'] = requestParameters['expand'];
        }

        if (requestParameters['externalId'] != null) {
            queryParameters['external_id'] = requestParameters['externalId'];
        }

        if (requestParameters['externalSource'] != null) {
            queryParameters['external_source'] = requestParameters['externalSource'];
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PaginatedWorkItemResponseFromJSON(jsonValue));
    }

    /**
     * Retrieve a paginated list of all work items in a project. Supports filtering, ordering, and field selection through query parameters.
     * List work items
     */
    async listWorkItems(requestParameters: ListWorkItemsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PaginatedWorkItemResponse> {
        const response = await this.listWorkItemsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieve details of a specific work item.
     * Retrieve work item
     */
    async retrieveWorkItemRaw(requestParameters: RetrieveWorkItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Issue>> {
        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling retrieveWorkItem().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling retrieveWorkItem().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling retrieveWorkItem().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['expand'] != null) {
            queryParameters['expand'] = requestParameters['expand'];
        }

        if (requestParameters['externalId'] != null) {
            queryParameters['external_id'] = requestParameters['externalId'];
        }

        if (requestParameters['externalSource'] != null) {
            queryParameters['external_source'] = requestParameters['externalSource'];
        }

        if (requestParameters['fields'] != null) {
            queryParameters['fields'] = requestParameters['fields'];
        }

        if (requestParameters['orderBy'] != null) {
            queryParameters['order_by'] = requestParameters['orderBy'];
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/{pk}/`.replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssueFromJSON(jsonValue));
    }

    /**
     * Retrieve details of a specific work item.
     * Retrieve work item
     */
    async retrieveWorkItem(requestParameters: RetrieveWorkItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Issue> {
        const response = await this.retrieveWorkItemRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Perform semantic search across issue names, sequence IDs, and project identifiers.
     */
    async searchWorkItemsRaw(requestParameters: SearchWorkItemsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IssueSearch>> {
        if (requestParameters['search'] == null) {
            throw new runtime.RequiredError(
                'search',
                'Required parameter "search" was null or undefined when calling searchWorkItems().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling searchWorkItems().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['limit'] != null) {
            queryParameters['limit'] = requestParameters['limit'];
        }

        if (requestParameters['projectId'] != null) {
            queryParameters['project_id'] = requestParameters['projectId'];
        }

        if (requestParameters['search'] != null) {
            queryParameters['search'] = requestParameters['search'];
        }

        if (requestParameters['workspaceSearch'] != null) {
            queryParameters['workspace_search'] = requestParameters['workspaceSearch'];
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
            path: `/api/v1/workspaces/{slug}/issues/search/`.replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssueSearchFromJSON(jsonValue));
    }

    /**
     * Perform semantic search across issue names, sequence IDs, and project identifiers.
     */
    async searchWorkItems(requestParameters: SearchWorkItemsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IssueSearch> {
        const response = await this.searchWorkItemsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Partially update an existing work item with the provided fields. Supports external ID validation to prevent conflicts.
     * Partially update work item
     */
    async updateWorkItemRaw(requestParameters: UpdateWorkItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Issue>> {
        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling updateWorkItem().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling updateWorkItem().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling updateWorkItem().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/{pk}/`.replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: PatchedIssueRequestToJSON(requestParameters['patchedIssueRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssueFromJSON(jsonValue));
    }

    /**
     * Partially update an existing work item with the provided fields. Supports external ID validation to prevent conflicts.
     * Partially update work item
     */
    async updateWorkItem(requestParameters: UpdateWorkItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Issue> {
        const response = await this.updateWorkItemRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
