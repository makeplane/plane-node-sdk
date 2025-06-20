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
  GetWorkspaceMembers200ResponseInner,
  UserLite,
} from '../models/index';
import {
    GetWorkspaceMembers200ResponseInnerFromJSON,
    GetWorkspaceMembers200ResponseInnerToJSON,
    UserLiteFromJSON,
    UserLiteToJSON,
} from '../models/index';

export interface GetProjectMembersRequest {
    projectId: string;
    slug: string;
}

export interface GetWorkspaceMembersRequest {
    slug: string;
}

/**
 * 
 */
export class MembersApi extends runtime.BaseAPI {

    /**
     * Retrieve all users who are members of the specified project.
     * List project members
     */
    async getProjectMembersRaw(requestParameters: GetProjectMembersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserLite>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling getProjectMembers().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling getProjectMembers().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/members/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserLiteFromJSON(jsonValue));
    }

    /**
     * Retrieve all users who are members of the specified project.
     * List project members
     */
    async getProjectMembers(requestParameters: GetProjectMembersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserLite> {
        const response = await this.getProjectMembersRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieve all users who are members of the specified workspace.
     * List workspace members
     */
    async getWorkspaceMembersRaw(requestParameters: GetWorkspaceMembersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<GetWorkspaceMembers200ResponseInner>>> {
        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling getWorkspaceMembers().'
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
            path: `/api/v1/workspaces/{slug}/members/`.replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(GetWorkspaceMembers200ResponseInnerFromJSON));
    }

    /**
     * Retrieve all users who are members of the specified workspace.
     * List workspace members
     */
    async getWorkspaceMembers(requestParameters: GetWorkspaceMembersRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<GetWorkspaceMembers200ResponseInner>> {
        const response = await this.getWorkspaceMembersRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
