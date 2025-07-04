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
 * 
 * @export
 * @interface PatchedIssuePropertyOptionAPIRequest
 */
export interface PatchedIssuePropertyOptionAPIRequest {
    /**
     * 
     * @type {string}
     * @memberof PatchedIssuePropertyOptionAPIRequest
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof PatchedIssuePropertyOptionAPIRequest
     */
    description?: string;
    /**
     * 
     * @type {boolean}
     * @memberof PatchedIssuePropertyOptionAPIRequest
     */
    isActive?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PatchedIssuePropertyOptionAPIRequest
     */
    isDefault?: boolean;
    /**
     * 
     * @type {string}
     * @memberof PatchedIssuePropertyOptionAPIRequest
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedIssuePropertyOptionAPIRequest
     */
    externalId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedIssuePropertyOptionAPIRequest
     */
    parent?: string | null;
}

/**
 * Check if a given object implements the PatchedIssuePropertyOptionAPIRequest interface.
 */
export function instanceOfPatchedIssuePropertyOptionAPIRequest(value: object): value is PatchedIssuePropertyOptionAPIRequest {
    return true;
}

export function PatchedIssuePropertyOptionAPIRequestFromJSON(json: any): PatchedIssuePropertyOptionAPIRequest {
    return PatchedIssuePropertyOptionAPIRequestFromJSONTyped(json, false);
}

export function PatchedIssuePropertyOptionAPIRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): PatchedIssuePropertyOptionAPIRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'] == null ? undefined : json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'isActive': json['is_active'] == null ? undefined : json['is_active'],
        'isDefault': json['is_default'] == null ? undefined : json['is_default'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'parent': json['parent'] == null ? undefined : json['parent'],
    };
}

export function PatchedIssuePropertyOptionAPIRequestToJSON(json: any): PatchedIssuePropertyOptionAPIRequest {
    return PatchedIssuePropertyOptionAPIRequestToJSONTyped(json, false);
}

export function PatchedIssuePropertyOptionAPIRequestToJSONTyped(value?: PatchedIssuePropertyOptionAPIRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'description': value['description'],
        'is_active': value['isActive'],
        'is_default': value['isDefault'],
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
        'parent': value['parent'],
    };
}

