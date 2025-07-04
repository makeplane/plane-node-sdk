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
 * @interface PatchedIssueWorkLogAPIRequest
 */
export interface PatchedIssueWorkLogAPIRequest {
    /**
     * 
     * @type {string}
     * @memberof PatchedIssueWorkLogAPIRequest
     */
    description?: string;
    /**
     * 
     * @type {number}
     * @memberof PatchedIssueWorkLogAPIRequest
     */
    duration?: number;
    /**
     * 
     * @type {string}
     * @memberof PatchedIssueWorkLogAPIRequest
     */
    createdBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedIssueWorkLogAPIRequest
     */
    updatedBy?: string | null;
}

/**
 * Check if a given object implements the PatchedIssueWorkLogAPIRequest interface.
 */
export function instanceOfPatchedIssueWorkLogAPIRequest(value: object): value is PatchedIssueWorkLogAPIRequest {
    return true;
}

export function PatchedIssueWorkLogAPIRequestFromJSON(json: any): PatchedIssueWorkLogAPIRequest {
    return PatchedIssueWorkLogAPIRequestFromJSONTyped(json, false);
}

export function PatchedIssueWorkLogAPIRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): PatchedIssueWorkLogAPIRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'description': json['description'] == null ? undefined : json['description'],
        'duration': json['duration'] == null ? undefined : json['duration'],
        'createdBy': json['created_by'] == null ? undefined : json['created_by'],
        'updatedBy': json['updated_by'] == null ? undefined : json['updated_by'],
    };
}

export function PatchedIssueWorkLogAPIRequestToJSON(json: any): PatchedIssueWorkLogAPIRequest {
    return PatchedIssueWorkLogAPIRequestToJSONTyped(json, false);
}

export function PatchedIssueWorkLogAPIRequestToJSONTyped(value?: PatchedIssueWorkLogAPIRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'description': value['description'],
        'duration': value['duration'],
        'created_by': value['createdBy'],
        'updated_by': value['updatedBy'],
    };
}

