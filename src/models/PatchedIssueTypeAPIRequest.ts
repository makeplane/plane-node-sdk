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
 * @interface PatchedIssueTypeAPIRequest
 */
export interface PatchedIssueTypeAPIRequest {
    /**
     * 
     * @type {Array<string>}
     * @memberof PatchedIssueTypeAPIRequest
     */
    projectIds?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof PatchedIssueTypeAPIRequest
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof PatchedIssueTypeAPIRequest
     */
    description?: string;
    /**
     * 
     * @type {boolean}
     * @memberof PatchedIssueTypeAPIRequest
     */
    isEpic?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PatchedIssueTypeAPIRequest
     */
    isActive?: boolean;
    /**
     * 
     * @type {string}
     * @memberof PatchedIssueTypeAPIRequest
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedIssueTypeAPIRequest
     */
    externalId?: string | null;
}

/**
 * Check if a given object implements the PatchedIssueTypeAPIRequest interface.
 */
export function instanceOfPatchedIssueTypeAPIRequest(value: object): value is PatchedIssueTypeAPIRequest {
    return true;
}

export function PatchedIssueTypeAPIRequestFromJSON(json: any): PatchedIssueTypeAPIRequest {
    return PatchedIssueTypeAPIRequestFromJSONTyped(json, false);
}

export function PatchedIssueTypeAPIRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): PatchedIssueTypeAPIRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'projectIds': json['project_ids'] == null ? undefined : json['project_ids'],
        'name': json['name'] == null ? undefined : json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'isEpic': json['is_epic'] == null ? undefined : json['is_epic'],
        'isActive': json['is_active'] == null ? undefined : json['is_active'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
    };
}

export function PatchedIssueTypeAPIRequestToJSON(json: any): PatchedIssueTypeAPIRequest {
    return PatchedIssueTypeAPIRequestToJSONTyped(json, false);
}

export function PatchedIssueTypeAPIRequestToJSONTyped(value?: PatchedIssueTypeAPIRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'project_ids': value['projectIds'],
        'name': value['name'],
        'description': value['description'],
        'is_epic': value['isEpic'],
        'is_active': value['isActive'],
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
    };
}

