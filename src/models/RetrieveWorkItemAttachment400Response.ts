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
 * 
 * @export
 * @interface RetrieveWorkItemAttachment400Response
 */
export interface RetrieveWorkItemAttachment400Response {
    /**
     * Error message
     * @type {string}
     * @memberof RetrieveWorkItemAttachment400Response
     */
    error?: string;
    /**
     * Request status
     * @type {boolean}
     * @memberof RetrieveWorkItemAttachment400Response
     */
    status?: boolean;
}

/**
 * Check if a given object implements the RetrieveWorkItemAttachment400Response interface.
 */
export function instanceOfRetrieveWorkItemAttachment400Response(value: object): value is RetrieveWorkItemAttachment400Response {
    return true;
}

export function RetrieveWorkItemAttachment400ResponseFromJSON(json: any): RetrieveWorkItemAttachment400Response {
    return RetrieveWorkItemAttachment400ResponseFromJSONTyped(json, false);
}

export function RetrieveWorkItemAttachment400ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): RetrieveWorkItemAttachment400Response {
    if (json == null) {
        return json;
    }
    return {
        
        'error': json['error'] == null ? undefined : json['error'],
        'status': json['status'] == null ? undefined : json['status'],
    };
}

export function RetrieveWorkItemAttachment400ResponseToJSON(json: any): RetrieveWorkItemAttachment400Response {
    return RetrieveWorkItemAttachment400ResponseToJSONTyped(json, false);
}

export function RetrieveWorkItemAttachment400ResponseToJSONTyped(value?: RetrieveWorkItemAttachment400Response | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'error': value['error'],
        'status': value['status'],
    };
}

