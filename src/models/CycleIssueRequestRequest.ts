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
 * Serializer for bulk work item assignment to cycles.
 * 
 * Validates work item ID lists for batch operations including
 * cycle assignment and sprint planning workflows.
 * @export
 * @interface CycleIssueRequestRequest
 */
export interface CycleIssueRequestRequest {
    /**
     * List of issue IDs to add to the cycle
     * @type {Array<string>}
     * @memberof CycleIssueRequestRequest
     */
    issues: Array<string>;
}

/**
 * Check if a given object implements the CycleIssueRequestRequest interface.
 */
export function instanceOfCycleIssueRequestRequest(value: object): value is CycleIssueRequestRequest {
    if (!('issues' in value) || value['issues'] === undefined) return false;
    return true;
}

export function CycleIssueRequestRequestFromJSON(json: any): CycleIssueRequestRequest {
    return CycleIssueRequestRequestFromJSONTyped(json, false);
}

export function CycleIssueRequestRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): CycleIssueRequestRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'issues': json['issues'],
    };
}

export function CycleIssueRequestRequestToJSON(json: any): CycleIssueRequestRequest {
    return CycleIssueRequestRequestToJSONTyped(json, false);
}

export function CycleIssueRequestRequestToJSONTyped(value?: CycleIssueRequestRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'issues': value['issues'],
    };
}

