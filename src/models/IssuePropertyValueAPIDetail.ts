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
 * Serializer for aggregated issue property values response.
 * This serializer handles the response format from the query_annotator method
 * which returns property_id and values (ArrayAgg of property values).
 * @export
 * @interface IssuePropertyValueAPIDetail
 */
export interface IssuePropertyValueAPIDetail {
    /**
     * The ID of the issue property
     * @type {string}
     * @memberof IssuePropertyValueAPIDetail
     */
    propertyId: string;
    /**
     * List of aggregated property values for the given property
     * @type {Array<string>}
     * @memberof IssuePropertyValueAPIDetail
     */
    values: Array<string>;
}

/**
 * Check if a given object implements the IssuePropertyValueAPIDetail interface.
 */
export function instanceOfIssuePropertyValueAPIDetail(value: object): value is IssuePropertyValueAPIDetail {
    if (!('propertyId' in value) || value['propertyId'] === undefined) return false;
    if (!('values' in value) || value['values'] === undefined) return false;
    return true;
}

export function IssuePropertyValueAPIDetailFromJSON(json: any): IssuePropertyValueAPIDetail {
    return IssuePropertyValueAPIDetailFromJSONTyped(json, false);
}

export function IssuePropertyValueAPIDetailFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssuePropertyValueAPIDetail {
    if (json == null) {
        return json;
    }
    return {
        
        'propertyId': json['property_id'],
        'values': json['values'],
    };
}

export function IssuePropertyValueAPIDetailToJSON(json: any): IssuePropertyValueAPIDetail {
    return IssuePropertyValueAPIDetailToJSONTyped(json, false);
}

export function IssuePropertyValueAPIDetailToJSONTyped(value?: IssuePropertyValueAPIDetail | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'property_id': value['propertyId'],
        'values': value['values'],
    };
}

