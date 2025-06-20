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
import type { GroupEnum } from './GroupEnum';
import {
    GroupEnumFromJSON,
    GroupEnumFromJSONTyped,
    GroupEnumToJSON,
    GroupEnumToJSONTyped,
} from './GroupEnum';

/**
 * Lightweight state serializer for minimal data transfer.
 * 
 * Provides essential state information including visual properties
 * and grouping data optimized for UI display and filtering.
 * @export
 * @interface StateLite
 */
export interface StateLite {
    /**
     * 
     * @type {string}
     * @memberof StateLite
     */
    readonly id?: string;
    /**
     * 
     * @type {string}
     * @memberof StateLite
     */
    readonly name?: string;
    /**
     * 
     * @type {string}
     * @memberof StateLite
     */
    readonly color?: string;
    /**
     * 
     * @type {GroupEnum}
     * @memberof StateLite
     */
    readonly group?: GroupEnum;
}



/**
 * Check if a given object implements the StateLite interface.
 */
export function instanceOfStateLite(value: object): value is StateLite {
    return true;
}

export function StateLiteFromJSON(json: any): StateLite {
    return StateLiteFromJSONTyped(json, false);
}

export function StateLiteFromJSONTyped(json: any, ignoreDiscriminator: boolean): StateLite {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'name': json['name'] == null ? undefined : json['name'],
        'color': json['color'] == null ? undefined : json['color'],
        'group': json['group'] == null ? undefined : GroupEnumFromJSON(json['group']),
    };
}

export function StateLiteToJSON(json: any): StateLite {
    return StateLiteToJSONTyped(json, false);
}

export function StateLiteToJSONTyped(value?: Omit<StateLite, 'id'|'name'|'color'|'group'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
    };
}

