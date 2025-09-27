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

export interface WorkspacesProjectsMembersCreateRequest {
    projectId: string;
    slug: string;
}

/**
 * 
 */
export class WorkspacesApi extends runtime.BaseAPI {

    /**
     * This enables timezone conversion according to the user set timezone
     */
    async workspacesProjectsMembersCreateRaw(requestParameters: WorkspacesProjectsMembersCreateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling workspacesProjectsMembersCreate().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling workspacesProjectsMembersCreate().'
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
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * This enables timezone conversion according to the user set timezone
     */
    async workspacesProjectsMembersCreate(requestParameters: WorkspacesProjectsMembersCreateRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.workspacesProjectsMembersCreateRaw(requestParameters, initOverrides);
    }

}
