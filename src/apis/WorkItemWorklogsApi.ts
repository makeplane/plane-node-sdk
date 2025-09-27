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
  IssueWorkLogAPI,
  IssueWorkLogAPIRequest,
  PatchedIssueWorkLogAPIRequest,
  ProjectWorklogSummary,
} from '../models/index';
import {
    IssueWorkLogAPIFromJSON,
    IssueWorkLogAPIToJSON,
    IssueWorkLogAPIRequestFromJSON,
    IssueWorkLogAPIRequestToJSON,
    PatchedIssueWorkLogAPIRequestFromJSON,
    PatchedIssueWorkLogAPIRequestToJSON,
    ProjectWorklogSummaryFromJSON,
    ProjectWorklogSummaryToJSON,
} from '../models/index';

export interface CreateIssueWorklogRequest {
    issueId: string;
    projectId: string;
    slug: string;
    issueWorkLogAPIRequest?: IssueWorkLogAPIRequest;
}

export interface DeleteIssueWorklogRequest {
    issueId: string;
    pk: string;
    projectId: string;
    slug: string;
}

export interface GetProjectWorklogSummaryRequest {
    projectId: string;
    slug: string;
}

export interface ListIssueWorklogsRequest {
    issueId: string;
    projectId: string;
    slug: string;
}

export interface UpdateIssueWorklogRequest {
    issueId: string;
    pk: string;
    projectId: string;
    slug: string;
    patchedIssueWorkLogAPIRequest?: PatchedIssueWorkLogAPIRequest;
}

/**
 * 
 */
export class WorkItemWorklogsApi extends runtime.BaseAPI {

    /**
     * Create a new worklog entry
     * Create a new worklog entry
     */
    async createIssueWorklogRaw(requestParameters: CreateIssueWorklogRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IssueWorkLogAPI>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling createIssueWorklog().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling createIssueWorklog().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling createIssueWorklog().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}/worklogs/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: IssueWorkLogAPIRequestToJSON(requestParameters['issueWorkLogAPIRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssueWorkLogAPIFromJSON(jsonValue));
    }

    /**
     * Create a new worklog entry
     * Create a new worklog entry
     */
    async createIssueWorklog(requestParameters: CreateIssueWorklogRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IssueWorkLogAPI> {
        const response = await this.createIssueWorklogRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Delete a worklog entry
     * Delete a worklog entry
     */
    async deleteIssueWorklogRaw(requestParameters: DeleteIssueWorklogRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling deleteIssueWorklog().'
            );
        }

        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling deleteIssueWorklog().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling deleteIssueWorklog().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling deleteIssueWorklog().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}/worklogs/{pk}/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete a worklog entry
     * Delete a worklog entry
     */
    async deleteIssueWorklog(requestParameters: DeleteIssueWorklogRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteIssueWorklogRaw(requestParameters, initOverrides);
    }

    /**
     * Get project worklog summary
     * Get project worklog summary
     */
    async getProjectWorklogSummaryRaw(requestParameters: GetProjectWorklogSummaryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<ProjectWorklogSummary>>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling getProjectWorklogSummary().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling getProjectWorklogSummary().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/total-worklogs/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(ProjectWorklogSummaryFromJSON));
    }

    /**
     * Get project worklog summary
     * Get project worklog summary
     */
    async getProjectWorklogSummary(requestParameters: GetProjectWorklogSummaryRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<ProjectWorklogSummary>> {
        const response = await this.getProjectWorklogSummaryRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * List worklog entries
     * List worklog entries
     */
    async listIssueWorklogsRaw(requestParameters: ListIssueWorklogsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<IssueWorkLogAPI>>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling listIssueWorklogs().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling listIssueWorklogs().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling listIssueWorklogs().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}/worklogs/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(IssueWorkLogAPIFromJSON));
    }

    /**
     * List worklog entries
     * List worklog entries
     */
    async listIssueWorklogs(requestParameters: ListIssueWorklogsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<IssueWorkLogAPI>> {
        const response = await this.listIssueWorklogsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Update a worklog entry
     * Update a worklog entry
     */
    async updateIssueWorklogRaw(requestParameters: UpdateIssueWorklogRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IssueWorkLogAPI>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling updateIssueWorklog().'
            );
        }

        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling updateIssueWorklog().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling updateIssueWorklog().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling updateIssueWorklog().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}/worklogs/{pk}/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: PatchedIssueWorkLogAPIRequestToJSON(requestParameters['patchedIssueWorkLogAPIRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssueWorkLogAPIFromJSON(jsonValue));
    }

    /**
     * Update a worklog entry
     * Update a worklog entry
     */
    async updateIssueWorklog(requestParameters: UpdateIssueWorklogRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IssueWorkLogAPI> {
        const response = await this.updateIssueWorklogRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
