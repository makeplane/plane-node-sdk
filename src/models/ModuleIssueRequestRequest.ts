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
 * Serializer for bulk work item assignment to modules.
 * 
 * Validates work item ID lists for batch operations including
 * module assignment and work item organization workflows.
 * @export
 * @interface ModuleIssueRequestRequest
 */
export interface ModuleIssueRequestRequest {
    /**
     * List of issue IDs to add to the module
     * @type {Array<string>}
     * @memberof ModuleIssueRequestRequest
     */
    issues: Array<string>;
}

/**
 * Check if a given object implements the ModuleIssueRequestRequest interface.
 */
export function instanceOfModuleIssueRequestRequest(value: object): value is ModuleIssueRequestRequest {
    if (!('issues' in value) || value['issues'] === undefined) return false;
    return true;
}

export function ModuleIssueRequestRequestFromJSON(json: any): ModuleIssueRequestRequest {
    return ModuleIssueRequestRequestFromJSONTyped(json, false);
}

export function ModuleIssueRequestRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModuleIssueRequestRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'issues': json['issues'],
    };
}

export function ModuleIssueRequestRequestToJSON(json: any): ModuleIssueRequestRequest {
    return ModuleIssueRequestRequestToJSONTyped(json, false);
}

export function ModuleIssueRequestRequestToJSONTyped(value?: ModuleIssueRequestRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'issues': value['issues'],
    };
}

