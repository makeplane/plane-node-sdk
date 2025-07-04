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

import { mapValues } from '../runtime';
/**
 * Serializer for updating work item external links.
 * 
 * Extends link creation with update-specific validation to prevent
 * URL conflicts and maintain link integrity during modifications.
 * @export
 * @interface PatchedIssueLinkUpdateRequest
 */
export interface PatchedIssueLinkUpdateRequest {
    /**
     * 
     * @type {string}
     * @memberof PatchedIssueLinkUpdateRequest
     */
    url?: string;
}

/**
 * Check if a given object implements the PatchedIssueLinkUpdateRequest interface.
 */
export function instanceOfPatchedIssueLinkUpdateRequest(value: object): value is PatchedIssueLinkUpdateRequest {
    return true;
}

export function PatchedIssueLinkUpdateRequestFromJSON(json: any): PatchedIssueLinkUpdateRequest {
    return PatchedIssueLinkUpdateRequestFromJSONTyped(json, false);
}

export function PatchedIssueLinkUpdateRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): PatchedIssueLinkUpdateRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'url': json['url'] == null ? undefined : json['url'],
    };
}

export function PatchedIssueLinkUpdateRequestToJSON(json: any): PatchedIssueLinkUpdateRequest {
    return PatchedIssueLinkUpdateRequestToJSONTyped(json, false);
}

export function PatchedIssueLinkUpdateRequestToJSONTyped(value?: PatchedIssueLinkUpdateRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'url': value['url'],
    };
}

