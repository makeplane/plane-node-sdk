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

import { mapValues } from '../runtime';
/**
 * Serializer for creating work item external links with validation.
 * 
 * Handles URL validation, format checking, and duplicate prevention
 * for attaching external resources to work items.
 * @export
 * @interface IssueLinkCreateRequest
 */
export interface IssueLinkCreateRequest {
    /**
     * 
     * @type {string}
     * @memberof IssueLinkCreateRequest
     */
    url: string;
}

/**
 * Check if a given object implements the IssueLinkCreateRequest interface.
 */
export function instanceOfIssueLinkCreateRequest(value: object): value is IssueLinkCreateRequest {
    if (!('url' in value) || value['url'] === undefined) return false;
    return true;
}

export function IssueLinkCreateRequestFromJSON(json: any): IssueLinkCreateRequest {
    return IssueLinkCreateRequestFromJSONTyped(json, false);
}

export function IssueLinkCreateRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssueLinkCreateRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'url': json['url'],
    };
}

export function IssueLinkCreateRequestToJSON(json: any): IssueLinkCreateRequest {
    return IssueLinkCreateRequestToJSONTyped(json, false);
}

export function IssueLinkCreateRequestToJSONTyped(value?: IssueLinkCreateRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'url': value['url'],
    };
}

