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
 * @interface IssuePropertyValueAPIRequest
 */
export interface IssuePropertyValueAPIRequest {
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyValueAPIRequest
     */
    valueText?: string;
    /**
     * 
     * @type {boolean}
     * @memberof IssuePropertyValueAPIRequest
     */
    valueBoolean?: boolean;
    /**
     * 
     * @type {number}
     * @memberof IssuePropertyValueAPIRequest
     */
    valueDecimal?: number;
    /**
     * 
     * @type {Date}
     * @memberof IssuePropertyValueAPIRequest
     */
    valueDatetime?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyValueAPIRequest
     */
    valueUuid?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyValueAPIRequest
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyValueAPIRequest
     */
    externalId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyValueAPIRequest
     */
    issue: string;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyValueAPIRequest
     */
    property: string;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyValueAPIRequest
     */
    valueOption?: string | null;
}

/**
 * Check if a given object implements the IssuePropertyValueAPIRequest interface.
 */
export function instanceOfIssuePropertyValueAPIRequest(value: object): value is IssuePropertyValueAPIRequest {
    if (!('issue' in value) || value['issue'] === undefined) return false;
    if (!('property' in value) || value['property'] === undefined) return false;
    return true;
}

export function IssuePropertyValueAPIRequestFromJSON(json: any): IssuePropertyValueAPIRequest {
    return IssuePropertyValueAPIRequestFromJSONTyped(json, false);
}

export function IssuePropertyValueAPIRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssuePropertyValueAPIRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'valueText': json['value_text'] == null ? undefined : json['value_text'],
        'valueBoolean': json['value_boolean'] == null ? undefined : json['value_boolean'],
        'valueDecimal': json['value_decimal'] == null ? undefined : json['value_decimal'],
        'valueDatetime': json['value_datetime'] == null ? undefined : (new Date(json['value_datetime'])),
        'valueUuid': json['value_uuid'] == null ? undefined : json['value_uuid'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'issue': json['issue'],
        'property': json['property'],
        'valueOption': json['value_option'] == null ? undefined : json['value_option'],
    };
}

export function IssuePropertyValueAPIRequestToJSON(json: any): IssuePropertyValueAPIRequest {
    return IssuePropertyValueAPIRequestToJSONTyped(json, false);
}

export function IssuePropertyValueAPIRequestToJSONTyped(value?: IssuePropertyValueAPIRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'value_text': value['valueText'],
        'value_boolean': value['valueBoolean'],
        'value_decimal': value['valueDecimal'],
        'value_datetime': value['valueDatetime'] == null ? undefined : ((value['valueDatetime'] as any).toISOString()),
        'value_uuid': value['valueUuid'],
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
        'issue': value['issue'],
        'property': value['property'],
        'value_option': value['valueOption'],
    };
}

