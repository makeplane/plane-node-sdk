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
  IssueTypeAPI,
  IssueTypeAPIRequest,
  PatchedIssueTypeAPIRequest,
} from '../models/index';
import {
    IssueTypeAPIFromJSON,
    IssueTypeAPIToJSON,
    IssueTypeAPIRequestFromJSON,
    IssueTypeAPIRequestToJSON,
    PatchedIssueTypeAPIRequestFromJSON,
    PatchedIssueTypeAPIRequestToJSON,
} from '../models/index';

export interface CreateIssueTypeRequest {
    projectId: string;
    slug: string;
    issueTypeAPIRequest: IssueTypeAPIRequest;
}

export interface DeleteIssueTypeRequest {
    projectId: string;
    slug: string;
    typeId: string;
}

export interface ListIssueTypesRequest {
    projectId: string;
    slug: string;
}

export interface RetrieveIssueTypeRequest {
    projectId: string;
    slug: string;
    typeId: string;
}

export interface UpdateIssueTypeRequest {
    projectId: string;
    slug: string;
    typeId: string;
    patchedIssueTypeAPIRequest?: PatchedIssueTypeAPIRequest;
}

/**
 * 
 */
export class WorkItemTypesApi extends runtime.BaseAPI {

    /**
     * Create a new issue type for a project
     * Create a new issue type
     */
    async createIssueTypeRaw(requestParameters: CreateIssueTypeRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IssueTypeAPI>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling createIssueType().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling createIssueType().'
            );
        }

        if (requestParameters['issueTypeAPIRequest'] == null) {
            throw new runtime.RequiredError(
                'issueTypeAPIRequest',
                'Required parameter "issueTypeAPIRequest" was null or undefined when calling createIssueType().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issue-types/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: IssueTypeAPIRequestToJSON(requestParameters['issueTypeAPIRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssueTypeAPIFromJSON(jsonValue));
    }

    /**
     * Create a new issue type for a project
     * Create a new issue type
     */
    async createIssueType(requestParameters: CreateIssueTypeRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IssueTypeAPI> {
        const response = await this.createIssueTypeRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Delete an issue type
     * Delete an issue type
     */
    async deleteIssueTypeRaw(requestParameters: DeleteIssueTypeRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling deleteIssueType().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling deleteIssueType().'
            );
        }

        if (requestParameters['typeId'] == null) {
            throw new runtime.RequiredError(
                'typeId',
                'Required parameter "typeId" was null or undefined when calling deleteIssueType().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issue-types/{type_id}/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))).replace(`{${"type_id"}}`, encodeURIComponent(String(requestParameters['typeId']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete an issue type
     * Delete an issue type
     */
    async deleteIssueType(requestParameters: DeleteIssueTypeRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteIssueTypeRaw(requestParameters, initOverrides);
    }

    /**
     * List all issue types for a project
     * List issue types
     */
    async listIssueTypesRaw(requestParameters: ListIssueTypesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<IssueTypeAPI>>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling listIssueTypes().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling listIssueTypes().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issue-types/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(IssueTypeAPIFromJSON));
    }

    /**
     * List all issue types for a project
     * List issue types
     */
    async listIssueTypes(requestParameters: ListIssueTypesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<IssueTypeAPI>> {
        const response = await this.listIssueTypesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieve an issue type by id
     * Retrieve an issue type by id
     */
    async retrieveIssueTypeRaw(requestParameters: RetrieveIssueTypeRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IssueTypeAPI>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling retrieveIssueType().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling retrieveIssueType().'
            );
        }

        if (requestParameters['typeId'] == null) {
            throw new runtime.RequiredError(
                'typeId',
                'Required parameter "typeId" was null or undefined when calling retrieveIssueType().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issue-types/{type_id}/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))).replace(`{${"type_id"}}`, encodeURIComponent(String(requestParameters['typeId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssueTypeAPIFromJSON(jsonValue));
    }

    /**
     * Retrieve an issue type by id
     * Retrieve an issue type by id
     */
    async retrieveIssueType(requestParameters: RetrieveIssueTypeRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IssueTypeAPI> {
        const response = await this.retrieveIssueTypeRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Update an issue type
     * Update an issue type
     */
    async updateIssueTypeRaw(requestParameters: UpdateIssueTypeRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IssueTypeAPI>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling updateIssueType().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling updateIssueType().'
            );
        }

        if (requestParameters['typeId'] == null) {
            throw new runtime.RequiredError(
                'typeId',
                'Required parameter "typeId" was null or undefined when calling updateIssueType().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issue-types/{type_id}/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))).replace(`{${"type_id"}}`, encodeURIComponent(String(requestParameters['typeId']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: PatchedIssueTypeAPIRequestToJSON(requestParameters['patchedIssueTypeAPIRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssueTypeAPIFromJSON(jsonValue));
    }

    /**
     * Update an issue type
     * Update an issue type
     */
    async updateIssueType(requestParameters: UpdateIssueTypeRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IssueTypeAPI> {
        const response = await this.updateIssueTypeRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
