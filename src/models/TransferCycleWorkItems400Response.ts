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
 * @interface TransferCycleWorkItems400Response
 */
export interface TransferCycleWorkItems400Response {
    /**
     * Error message
     * @type {string}
     * @memberof TransferCycleWorkItems400Response
     */
    error?: string;
}

/**
 * Check if a given object implements the TransferCycleWorkItems400Response interface.
 */
export function instanceOfTransferCycleWorkItems400Response(value: object): value is TransferCycleWorkItems400Response {
    return true;
}

export function TransferCycleWorkItems400ResponseFromJSON(json: any): TransferCycleWorkItems400Response {
    return TransferCycleWorkItems400ResponseFromJSONTyped(json, false);
}

export function TransferCycleWorkItems400ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): TransferCycleWorkItems400Response {
    if (json == null) {
        return json;
    }
    return {
        
        'error': json['error'] == null ? undefined : json['error'],
    };
}

export function TransferCycleWorkItems400ResponseToJSON(json: any): TransferCycleWorkItems400Response {
    return TransferCycleWorkItems400ResponseToJSONTyped(json, false);
}

export function TransferCycleWorkItems400ResponseToJSONTyped(value?: TransferCycleWorkItems400Response | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'error': value['error'],
    };
}

