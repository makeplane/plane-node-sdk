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
 * @interface TransferCycleWorkItems200Response
 */
export interface TransferCycleWorkItems200Response {
    /**
     * Success message
     * @type {string}
     * @memberof TransferCycleWorkItems200Response
     */
    message?: string;
}

/**
 * Check if a given object implements the TransferCycleWorkItems200Response interface.
 */
export function instanceOfTransferCycleWorkItems200Response(value: object): value is TransferCycleWorkItems200Response {
    return true;
}

export function TransferCycleWorkItems200ResponseFromJSON(json: any): TransferCycleWorkItems200Response {
    return TransferCycleWorkItems200ResponseFromJSONTyped(json, false);
}

export function TransferCycleWorkItems200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): TransferCycleWorkItems200Response {
    if (json == null) {
        return json;
    }
    return {
        
        'message': json['message'] == null ? undefined : json['message'],
    };
}

export function TransferCycleWorkItems200ResponseToJSON(json: any): TransferCycleWorkItems200Response {
    return TransferCycleWorkItems200ResponseToJSONTyped(json, false);
}

export function TransferCycleWorkItems200ResponseToJSONTyped(value?: TransferCycleWorkItems200Response | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'message': value['message'],
    };
}

