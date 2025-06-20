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
  IssueComment,
  IssueCommentCreateRequest,
  PaginatedIssueCommentResponse,
  PatchedIssueCommentCreateRequest,
} from '../models/index';
import {
    IssueCommentFromJSON,
    IssueCommentToJSON,
    IssueCommentCreateRequestFromJSON,
    IssueCommentCreateRequestToJSON,
    PaginatedIssueCommentResponseFromJSON,
    PaginatedIssueCommentResponseToJSON,
    PatchedIssueCommentCreateRequestFromJSON,
    PatchedIssueCommentCreateRequestToJSON,
} from '../models/index';

export interface CreateWorkItemCommentRequest {
    issueId: string;
    projectId: string;
    slug: string;
    issueCommentCreateRequest?: IssueCommentCreateRequest;
}

export interface DeleteWorkItemCommentRequest {
    issueId: string;
    pk: string;
    projectId: string;
    slug: string;
}

export interface ListWorkItemCommentsRequest {
    issueId: string;
    projectId: string;
    slug: string;
    cursor?: string;
    expand?: string;
    fields?: string;
    orderBy?: string;
    perPage?: number;
}

export interface RetrieveWorkItemCommentRequest {
    issueId: string;
    pk: string;
    projectId: string;
    slug: string;
}

export interface UpdateWorkItemCommentRequest {
    issueId: string;
    pk: string;
    projectId: string;
    slug: string;
    patchedIssueCommentCreateRequest?: PatchedIssueCommentCreateRequest;
}

/**
 * 
 */
export class WorkItemCommentsApi extends runtime.BaseAPI {

    /**
     * Add a new comment to a work item with HTML content.
     * Endpoints for issue comment create/update/delete and fetch issue comment details
     */
    async createWorkItemCommentRaw(requestParameters: CreateWorkItemCommentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IssueComment>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling createWorkItemComment().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling createWorkItemComment().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling createWorkItemComment().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}/comments/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: IssueCommentCreateRequestToJSON(requestParameters['issueCommentCreateRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssueCommentFromJSON(jsonValue));
    }

    /**
     * Add a new comment to a work item with HTML content.
     * Endpoints for issue comment create/update/delete and fetch issue comment details
     */
    async createWorkItemComment(requestParameters: CreateWorkItemCommentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IssueComment> {
        const response = await this.createWorkItemCommentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Permanently remove a comment from a work item. Records deletion activity for audit purposes.
     * Endpoints for issue comment create/update/delete and fetch issue comment details
     */
    async deleteWorkItemCommentRaw(requestParameters: DeleteWorkItemCommentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling deleteWorkItemComment().'
            );
        }

        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling deleteWorkItemComment().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling deleteWorkItemComment().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling deleteWorkItemComment().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}/comments/{pk}/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Permanently remove a comment from a work item. Records deletion activity for audit purposes.
     * Endpoints for issue comment create/update/delete and fetch issue comment details
     */
    async deleteWorkItemComment(requestParameters: DeleteWorkItemCommentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteWorkItemCommentRaw(requestParameters, initOverrides);
    }

    /**
     * Retrieve all comments for a work item.
     * Endpoints for issue comment create/update/delete and fetch issue comment details
     */
    async listWorkItemCommentsRaw(requestParameters: ListWorkItemCommentsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PaginatedIssueCommentResponse>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling listWorkItemComments().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling listWorkItemComments().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling listWorkItemComments().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}/comments/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PaginatedIssueCommentResponseFromJSON(jsonValue));
    }

    /**
     * Retrieve all comments for a work item.
     * Endpoints for issue comment create/update/delete and fetch issue comment details
     */
    async listWorkItemComments(requestParameters: ListWorkItemCommentsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PaginatedIssueCommentResponse> {
        const response = await this.listWorkItemCommentsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieve details of a specific comment.
     * Endpoints for issue comment create/update/delete and fetch issue comment details
     */
    async retrieveWorkItemCommentRaw(requestParameters: RetrieveWorkItemCommentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IssueComment>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling retrieveWorkItemComment().'
            );
        }

        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling retrieveWorkItemComment().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling retrieveWorkItemComment().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling retrieveWorkItemComment().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}/comments/{pk}/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssueCommentFromJSON(jsonValue));
    }

    /**
     * Retrieve details of a specific comment.
     * Endpoints for issue comment create/update/delete and fetch issue comment details
     */
    async retrieveWorkItemComment(requestParameters: RetrieveWorkItemCommentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IssueComment> {
        const response = await this.retrieveWorkItemCommentRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Modify the content of an existing comment on a work item.
     * Endpoints for issue comment create/update/delete and fetch issue comment details
     */
    async updateWorkItemCommentRaw(requestParameters: UpdateWorkItemCommentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IssueComment>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling updateWorkItemComment().'
            );
        }

        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling updateWorkItemComment().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling updateWorkItemComment().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling updateWorkItemComment().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}/comments/{pk}/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: PatchedIssueCommentCreateRequestToJSON(requestParameters['patchedIssueCommentCreateRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssueCommentFromJSON(jsonValue));
    }

    /**
     * Modify the content of an existing comment on a work item.
     * Endpoints for issue comment create/update/delete and fetch issue comment details
     */
    async updateWorkItemComment(requestParameters: UpdateWorkItemCommentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IssueComment> {
        const response = await this.updateWorkItemCommentRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
