/* tslint:disable */
/* eslint-disable */
/**
 * The Plane REST API
 * The Plane REST API  Visit our quick start guide and full API documentation at [developers.plane.so](https://developers.plane.so/api-reference/introduction).
 *
 * The version of the API Spec: 0.0.2
 * Contact: support@plane.so
 *
 * NOTE: This class is auto generated.
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  IssueLink,
  IssueLinkCreateRequest,
  PaginatedIssueLinkDetailResponse,
  PaginatedIssueLinkResponse,
  PatchedIssueLinkUpdateRequest,
} from '../models/index';
import {
    IssueLinkFromJSON,
    IssueLinkToJSON,
    IssueLinkCreateRequestFromJSON,
    IssueLinkCreateRequestToJSON,
    PaginatedIssueLinkDetailResponseFromJSON,
    PaginatedIssueLinkDetailResponseToJSON,
    PaginatedIssueLinkResponseFromJSON,
    PaginatedIssueLinkResponseToJSON,
    PatchedIssueLinkUpdateRequestFromJSON,
    PatchedIssueLinkUpdateRequestToJSON,
} from '../models/index';

export interface CreateWorkItemLinkRequest {
    issueId: string;
    projectId: string;
    slug: string;
    issueLinkCreateRequest: IssueLinkCreateRequest;
}

export interface DeleteWorkItemLinkRequest {
    issueId: string;
    pk: string;
    projectId: string;
    slug: string;
}

export interface ListWorkItemLinksRequest {
    issueId: string;
    projectId: string;
    slug: string;
    cursor?: string;
    expand?: string;
    fields?: string;
    orderBy?: string;
    perPage?: number;
}

export interface RetrieveWorkItemLinkRequest {
    issueId: string;
    pk: string;
    projectId: string;
    slug: string;
    cursor?: string;
    expand?: string;
    fields?: string;
    perPage?: number;
}

export interface UpdateIssueLinkRequest {
    issueId: string;
    pk: string;
    projectId: string;
    slug: string;
    patchedIssueLinkUpdateRequest?: PatchedIssueLinkUpdateRequest;
}

/**
 * 
 */
export class WorkItemLinksApi extends runtime.BaseAPI {

    /**
     * Add a new external link to a work item with URL, title, and metadata.
     * Endpoints for issue link create/update/delete and fetch issue link details
     */
    async createWorkItemLinkRaw(requestParameters: CreateWorkItemLinkRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IssueLink>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling createWorkItemLink().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling createWorkItemLink().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling createWorkItemLink().'
            );
        }

        if (requestParameters['issueLinkCreateRequest'] == null) {
            throw new runtime.RequiredError(
                'issueLinkCreateRequest',
                'Required parameter "issueLinkCreateRequest" was null or undefined when calling createWorkItemLink().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}/links/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: IssueLinkCreateRequestToJSON(requestParameters['issueLinkCreateRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssueLinkFromJSON(jsonValue));
    }

    /**
     * Add a new external link to a work item with URL, title, and metadata.
     * Endpoints for issue link create/update/delete and fetch issue link details
     */
    async createWorkItemLink(requestParameters: CreateWorkItemLinkRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IssueLink> {
        const response = await this.createWorkItemLinkRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Permanently remove an external link from a work item.
     * Endpoints for issue link create/update/delete and fetch issue link details
     */
    async deleteWorkItemLinkRaw(requestParameters: DeleteWorkItemLinkRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling deleteWorkItemLink().'
            );
        }

        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling deleteWorkItemLink().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling deleteWorkItemLink().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling deleteWorkItemLink().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}/links/{pk}/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Permanently remove an external link from a work item.
     * Endpoints for issue link create/update/delete and fetch issue link details
     */
    async deleteWorkItemLink(requestParameters: DeleteWorkItemLinkRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteWorkItemLinkRaw(requestParameters, initOverrides);
    }

    /**
     * Retrieve all links associated with a work item. Supports filtering by URL, title, and metadata.
     * Endpoints for issue link create/update/delete and fetch issue link details
     */
    async listWorkItemLinksRaw(requestParameters: ListWorkItemLinksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PaginatedIssueLinkResponse>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling listWorkItemLinks().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling listWorkItemLinks().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling listWorkItemLinks().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}/links/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PaginatedIssueLinkResponseFromJSON(jsonValue));
    }

    /**
     * Retrieve all links associated with a work item. Supports filtering by URL, title, and metadata.
     * Endpoints for issue link create/update/delete and fetch issue link details
     */
    async listWorkItemLinks(requestParameters: ListWorkItemLinksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PaginatedIssueLinkResponse> {
        const response = await this.listWorkItemLinksRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieve details of a specific work item link.
     * Endpoints for issue link create/update/delete and fetch issue link details
     */
    async retrieveWorkItemLinkRaw(requestParameters: RetrieveWorkItemLinkRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PaginatedIssueLinkDetailResponse>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling retrieveWorkItemLink().'
            );
        }

        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling retrieveWorkItemLink().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling retrieveWorkItemLink().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling retrieveWorkItemLink().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}/links/{pk}/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PaginatedIssueLinkDetailResponseFromJSON(jsonValue));
    }

    /**
     * Retrieve details of a specific work item link.
     * Endpoints for issue link create/update/delete and fetch issue link details
     */
    async retrieveWorkItemLink(requestParameters: RetrieveWorkItemLinkRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PaginatedIssueLinkDetailResponse> {
        const response = await this.retrieveWorkItemLinkRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Modify the URL, title, or metadata of an existing issue link.
     * Update an issue link
     */
    async updateIssueLinkRaw(requestParameters: UpdateIssueLinkRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IssueLink>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling updateIssueLink().'
            );
        }

        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling updateIssueLink().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling updateIssueLink().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling updateIssueLink().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}/links/{pk}/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: PatchedIssueLinkUpdateRequestToJSON(requestParameters['patchedIssueLinkUpdateRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssueLinkFromJSON(jsonValue));
    }

    /**
     * Modify the URL, title, or metadata of an existing issue link.
     * Update an issue link
     */
    async updateIssueLink(requestParameters: UpdateIssueLinkRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IssueLink> {
        const response = await this.updateIssueLinkRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
