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
  PaginatedStateResponse,
  PatchedStateRequest,
  State,
  StateRequest,
} from '../models/index';
import {
    PaginatedStateResponseFromJSON,
    PaginatedStateResponseToJSON,
    PatchedStateRequestFromJSON,
    PatchedStateRequestToJSON,
    StateFromJSON,
    StateToJSON,
    StateRequestFromJSON,
    StateRequestToJSON,
} from '../models/index';

export interface CreateStateRequest {
    projectId: string;
    slug: string;
    stateRequest: StateRequest;
}

export interface DeleteStateRequest {
    projectId: string;
    slug: string;
    stateId: string;
}

export interface ListStatesRequest {
    projectId: string;
    slug: string;
    cursor?: string;
    expand?: string;
    fields?: string;
    perPage?: number;
}

export interface RetrieveStateRequest {
    projectId: string;
    slug: string;
    stateId: string;
}

export interface UpdateStateRequest {
    projectId: string;
    slug: string;
    stateId: string;
    patchedStateRequest?: PatchedStateRequest;
}

/**
 * 
 */
export class StatesApi extends runtime.BaseAPI {

    /**
     * Create a new workflow state for a project with specified name, color, and group.
     * Create state
     */
    async createStateRaw(requestParameters: CreateStateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<State>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling createState().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling createState().'
            );
        }

        if (requestParameters['stateRequest'] == null) {
            throw new runtime.RequiredError(
                'stateRequest',
                'Required parameter "stateRequest" was null or undefined when calling createState().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/states/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: StateRequestToJSON(requestParameters['stateRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StateFromJSON(jsonValue));
    }

    /**
     * Create a new workflow state for a project with specified name, color, and group.
     * Create state
     */
    async createState(requestParameters: CreateStateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<State> {
        const response = await this.createStateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Permanently remove a workflow state from a project. Default states and states with existing work items cannot be deleted.
     * Delete state
     */
    async deleteStateRaw(requestParameters: DeleteStateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling deleteState().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling deleteState().'
            );
        }

        if (requestParameters['stateId'] == null) {
            throw new runtime.RequiredError(
                'stateId',
                'Required parameter "stateId" was null or undefined when calling deleteState().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/states/{state_id}/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))).replace(`{${"state_id"}}`, encodeURIComponent(String(requestParameters['stateId']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Permanently remove a workflow state from a project. Default states and states with existing work items cannot be deleted.
     * Delete state
     */
    async deleteState(requestParameters: DeleteStateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteStateRaw(requestParameters, initOverrides);
    }

    /**
     * Retrieve all workflow states for a project.
     * List states
     */
    async listStatesRaw(requestParameters: ListStatesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PaginatedStateResponse>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling listStates().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling listStates().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/states/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PaginatedStateResponseFromJSON(jsonValue));
    }

    /**
     * Retrieve all workflow states for a project.
     * List states
     */
    async listStates(requestParameters: ListStatesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PaginatedStateResponse> {
        const response = await this.listStatesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieve details of a specific state.
     * Retrieve state
     */
    async retrieveStateRaw(requestParameters: RetrieveStateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<State>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling retrieveState().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling retrieveState().'
            );
        }

        if (requestParameters['stateId'] == null) {
            throw new runtime.RequiredError(
                'stateId',
                'Required parameter "stateId" was null or undefined when calling retrieveState().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/states/{state_id}/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))).replace(`{${"state_id"}}`, encodeURIComponent(String(requestParameters['stateId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StateFromJSON(jsonValue));
    }

    /**
     * Retrieve details of a specific state.
     * Retrieve state
     */
    async retrieveState(requestParameters: RetrieveStateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<State> {
        const response = await this.retrieveStateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Partially update an existing workflow state\'s properties like name, color, or group.
     * Update state
     */
    async updateStateRaw(requestParameters: UpdateStateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<State>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling updateState().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling updateState().'
            );
        }

        if (requestParameters['stateId'] == null) {
            throw new runtime.RequiredError(
                'stateId',
                'Required parameter "stateId" was null or undefined when calling updateState().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/states/{state_id}/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))).replace(`{${"state_id"}}`, encodeURIComponent(String(requestParameters['stateId']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: PatchedStateRequestToJSON(requestParameters['patchedStateRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StateFromJSON(jsonValue));
    }

    /**
     * Partially update an existing workflow state\'s properties like name, color, or group.
     * Update state
     */
    async updateState(requestParameters: UpdateStateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<State> {
        const response = await this.updateStateRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
