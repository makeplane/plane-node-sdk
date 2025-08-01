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
 * Lightweight label serializer for minimal data transfer.
 * 
 * Provides essential label information with visual properties,
 * optimized for UI display and performance-critical operations.
 * @export
 * @interface LabelLite
 */
export interface LabelLite {
    /**
     * 
     * @type {string}
     * @memberof LabelLite
     */
    readonly id?: string;
    /**
     * 
     * @type {string}
     * @memberof LabelLite
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof LabelLite
     */
    color?: string;
}

/**
 * Check if a given object implements the LabelLite interface.
 */
export function instanceOfLabelLite(value: object): value is LabelLite {
    if (!('name' in value) || value['name'] === undefined) return false;
    return true;
}

export function LabelLiteFromJSON(json: any): LabelLite {
    return LabelLiteFromJSONTyped(json, false);
}

export function LabelLiteFromJSONTyped(json: any, ignoreDiscriminator: boolean): LabelLite {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'name': json['name'],
        'color': json['color'] == null ? undefined : json['color'],
    };
}

export function LabelLiteToJSON(json: any): LabelLite {
    return LabelLiteToJSONTyped(json, false);
}

export function LabelLiteToJSONTyped(value?: Omit<LabelLite, 'id'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'color': value['color'],
    };
}

