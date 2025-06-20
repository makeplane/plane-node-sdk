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
  IntakeIssue,
  IntakeIssueCreateRequest,
  PaginatedIntakeIssueResponse,
  PatchedIntakeIssueUpdateRequest,
} from '../models/index';
import {
    IntakeIssueFromJSON,
    IntakeIssueToJSON,
    IntakeIssueCreateRequestFromJSON,
    IntakeIssueCreateRequestToJSON,
    PaginatedIntakeIssueResponseFromJSON,
    PaginatedIntakeIssueResponseToJSON,
    PatchedIntakeIssueUpdateRequestFromJSON,
    PatchedIntakeIssueUpdateRequestToJSON,
} from '../models/index';

export interface CreateIntakeWorkItemRequest {
    projectId: string;
    slug: string;
    intakeIssueCreateRequest: IntakeIssueCreateRequest;
}

export interface DeleteIntakeWorkItemRequest {
    issueId: string;
    projectId: string;
    slug: string;
}

export interface GetIntakeWorkItemsListRequest {
    projectId: string;
    slug: string;
    cursor?: string;
    expand?: string;
    fields?: string;
    perPage?: number;
}

export interface RetrieveIntakeWorkItemRequest {
    issueId: string;
    projectId: string;
    slug: string;
}

export interface UpdateIntakeWorkItemRequest {
    issueId: string;
    projectId: string;
    slug: string;
    patchedIntakeIssueUpdateRequest?: PatchedIntakeIssueUpdateRequest;
}

/**
 * 
 */
export class IntakeApi extends runtime.BaseAPI {

    /**
     * Submit a new work item to the project\'s intake queue for review and triage. Automatically creates the work item with default triage state and tracks activity.
     * Create intake work item
     */
    async createIntakeWorkItemRaw(requestParameters: CreateIntakeWorkItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IntakeIssue>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling createIntakeWorkItem().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling createIntakeWorkItem().'
            );
        }

        if (requestParameters['intakeIssueCreateRequest'] == null) {
            throw new runtime.RequiredError(
                'intakeIssueCreateRequest',
                'Required parameter "intakeIssueCreateRequest" was null or undefined when calling createIntakeWorkItem().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/intake-issues/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: IntakeIssueCreateRequestToJSON(requestParameters['intakeIssueCreateRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IntakeIssueFromJSON(jsonValue));
    }

    /**
     * Submit a new work item to the project\'s intake queue for review and triage. Automatically creates the work item with default triage state and tracks activity.
     * Create intake work item
     */
    async createIntakeWorkItem(requestParameters: CreateIntakeWorkItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IntakeIssue> {
        const response = await this.createIntakeWorkItemRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Permanently remove an intake work item from the triage queue. Also deletes the underlying work item if it hasn\'t been accepted yet.
     * Delete intake work item
     */
    async deleteIntakeWorkItemRaw(requestParameters: DeleteIntakeWorkItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling deleteIntakeWorkItem().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling deleteIntakeWorkItem().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling deleteIntakeWorkItem().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/intake-issues/{issue_id}/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Permanently remove an intake work item from the triage queue. Also deletes the underlying work item if it hasn\'t been accepted yet.
     * Delete intake work item
     */
    async deleteIntakeWorkItem(requestParameters: DeleteIntakeWorkItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteIntakeWorkItemRaw(requestParameters, initOverrides);
    }

    /**
     * Retrieve all work items in the project\'s intake queue. Returns paginated results when listing all intake work items.
     * List intake work items
     */
    async getIntakeWorkItemsListRaw(requestParameters: GetIntakeWorkItemsListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PaginatedIntakeIssueResponse>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling getIntakeWorkItemsList().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling getIntakeWorkItemsList().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/intake-issues/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PaginatedIntakeIssueResponseFromJSON(jsonValue));
    }

    /**
     * Retrieve all work items in the project\'s intake queue. Returns paginated results when listing all intake work items.
     * List intake work items
     */
    async getIntakeWorkItemsList(requestParameters: GetIntakeWorkItemsListRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PaginatedIntakeIssueResponse> {
        const response = await this.getIntakeWorkItemsListRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieve details of a specific intake work item.
     * Retrieve intake work item
     */
    async retrieveIntakeWorkItemRaw(requestParameters: RetrieveIntakeWorkItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IntakeIssue>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling retrieveIntakeWorkItem().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling retrieveIntakeWorkItem().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling retrieveIntakeWorkItem().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/intake-issues/{issue_id}/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IntakeIssueFromJSON(jsonValue));
    }

    /**
     * Retrieve details of a specific intake work item.
     * Retrieve intake work item
     */
    async retrieveIntakeWorkItem(requestParameters: RetrieveIntakeWorkItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IntakeIssue> {
        const response = await this.retrieveIntakeWorkItemRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Modify an existing intake work item\'s properties or status for triage processing. Supports status changes like accept, reject, or mark as duplicate.
     * Update intake work item
     */
    async updateIntakeWorkItemRaw(requestParameters: UpdateIntakeWorkItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IntakeIssue>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling updateIntakeWorkItem().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling updateIntakeWorkItem().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling updateIntakeWorkItem().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/intake-issues/{issue_id}/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: PatchedIntakeIssueUpdateRequestToJSON(requestParameters['patchedIntakeIssueUpdateRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IntakeIssueFromJSON(jsonValue));
    }

    /**
     * Modify an existing intake work item\'s properties or status for triage processing. Supports status changes like accept, reject, or mark as duplicate.
     * Update intake work item
     */
    async updateIntakeWorkItem(requestParameters: UpdateIntakeWorkItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IntakeIssue> {
        const response = await this.updateIntakeWorkItemRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
