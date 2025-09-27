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
  PageCreateAPI,
  PageCreateAPIRequest,
  PageDetailAPI,
} from '../models/index';
import {
    PageCreateAPIFromJSON,
    PageCreateAPIToJSON,
    PageCreateAPIRequestFromJSON,
    PageCreateAPIRequestToJSON,
    PageDetailAPIFromJSON,
    PageDetailAPIToJSON,
} from '../models/index';

export interface CreateProjectPageRequest {
    projectId: string;
    slug: string;
    pageCreateAPIRequest: PageCreateAPIRequest;
}

export interface CreateWorkspacePageRequest {
    slug: string;
    pageCreateAPIRequest: PageCreateAPIRequest;
}

export interface GetProjectPageDetailRequest {
    pk: string;
    projectId: string;
    slug: string;
}

export interface GetWorkspacePageDetailRequest {
    pk: string;
    slug: string;
}

/**
 * 
 */
export class PagesApi extends runtime.BaseAPI {

    /**
     * Create a project page
     * Create a project page
     */
    async createProjectPageRaw(requestParameters: CreateProjectPageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PageCreateAPI>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling createProjectPage().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling createProjectPage().'
            );
        }

        if (requestParameters['pageCreateAPIRequest'] == null) {
            throw new runtime.RequiredError(
                'pageCreateAPIRequest',
                'Required parameter "pageCreateAPIRequest" was null or undefined when calling createProjectPage().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/pages/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PageCreateAPIRequestToJSON(requestParameters['pageCreateAPIRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PageCreateAPIFromJSON(jsonValue));
    }

    /**
     * Create a project page
     * Create a project page
     */
    async createProjectPage(requestParameters: CreateProjectPageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PageCreateAPI> {
        const response = await this.createProjectPageRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Create a workspace page
     * Create a workspace page
     */
    async createWorkspacePageRaw(requestParameters: CreateWorkspacePageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PageCreateAPI>> {
        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling createWorkspacePage().'
            );
        }

        if (requestParameters['pageCreateAPIRequest'] == null) {
            throw new runtime.RequiredError(
                'pageCreateAPIRequest',
                'Required parameter "pageCreateAPIRequest" was null or undefined when calling createWorkspacePage().'
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
            path: `/api/v1/workspaces/{slug}/pages/`.replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: PageCreateAPIRequestToJSON(requestParameters['pageCreateAPIRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PageCreateAPIFromJSON(jsonValue));
    }

    /**
     * Create a workspace page
     * Create a workspace page
     */
    async createWorkspacePage(requestParameters: CreateWorkspacePageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PageCreateAPI> {
        const response = await this.createWorkspacePageRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get a project page by ID
     * Get a project page by ID
     */
    async getProjectPageDetailRaw(requestParameters: GetProjectPageDetailRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PageDetailAPI>> {
        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling getProjectPageDetail().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling getProjectPageDetail().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling getProjectPageDetail().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/pages/{pk}/`.replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PageDetailAPIFromJSON(jsonValue));
    }

    /**
     * Get a project page by ID
     * Get a project page by ID
     */
    async getProjectPageDetail(requestParameters: GetProjectPageDetailRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PageDetailAPI> {
        const response = await this.getProjectPageDetailRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get a workspace page by ID
     * Get a workspace page by ID
     */
    async getWorkspacePageDetailRaw(requestParameters: GetWorkspacePageDetailRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PageDetailAPI>> {
        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling getWorkspacePageDetail().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling getWorkspacePageDetail().'
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
            path: `/api/v1/workspaces/{slug}/pages/{pk}/`.replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PageDetailAPIFromJSON(jsonValue));
    }

    /**
     * Get a workspace page by ID
     * Get a workspace page by ID
     */
    async getWorkspacePageDetail(requestParameters: GetWorkspacePageDetailRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PageDetailAPI> {
        const response = await this.getWorkspacePageDetailRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
