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
 * Serializer for transferring work items between cycles.
 * 
 * Handles work item migration between cycles including validation
 * and relationship updates for sprint reallocation workflows.
 * @export
 * @interface TransferCycleIssueRequestRequest
 */
export interface TransferCycleIssueRequestRequest {
    /**
     * ID of the target cycle to transfer issues to
     * @type {string}
     * @memberof TransferCycleIssueRequestRequest
     */
    newCycleId: string;
}

/**
 * Check if a given object implements the TransferCycleIssueRequestRequest interface.
 */
export function instanceOfTransferCycleIssueRequestRequest(value: object): value is TransferCycleIssueRequestRequest {
    if (!('newCycleId' in value) || value['newCycleId'] === undefined) return false;
    return true;
}

export function TransferCycleIssueRequestRequestFromJSON(json: any): TransferCycleIssueRequestRequest {
    return TransferCycleIssueRequestRequestFromJSONTyped(json, false);
}

export function TransferCycleIssueRequestRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): TransferCycleIssueRequestRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'newCycleId': json['new_cycle_id'],
    };
}

export function TransferCycleIssueRequestRequestToJSON(json: any): TransferCycleIssueRequestRequest {
    return TransferCycleIssueRequestRequestToJSONTyped(json, false);
}

export function TransferCycleIssueRequestRequestToJSONTyped(value?: TransferCycleIssueRequestRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'new_cycle_id': value['newCycleId'],
    };
}

