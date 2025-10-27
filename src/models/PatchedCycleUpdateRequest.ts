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
import type { TimezoneEnum } from './TimezoneEnum';
import {
    TimezoneEnumFromJSON,
    TimezoneEnumFromJSONTyped,
    TimezoneEnumToJSON,
    TimezoneEnumToJSONTyped,
} from './TimezoneEnum';

/**
 * Serializer for updating cycles with enhanced ownership management.
 * 
 * Extends cycle creation with update-specific features including ownership
 * assignment and modification tracking for cycle lifecycle management.
 * @export
 * @interface PatchedCycleUpdateRequest
 */
export interface PatchedCycleUpdateRequest {
    /**
     * 
     * @type {string}
     * @memberof PatchedCycleUpdateRequest
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof PatchedCycleUpdateRequest
     */
    description?: string;
    /**
     * 
     * @type {Date}
     * @memberof PatchedCycleUpdateRequest
     */
    startDate?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof PatchedCycleUpdateRequest
     */
    endDate?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedCycleUpdateRequest
     */
    ownedBy?: string;
    /**
     * 
     * @type {string}
     * @memberof PatchedCycleUpdateRequest
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedCycleUpdateRequest
     */
    externalId?: string | null;
    /**
     * 
     * @type {TimezoneEnum}
     * @memberof PatchedCycleUpdateRequest
     */
    timezone?: TimezoneEnum;
}



/**
 * Check if a given object implements the PatchedCycleUpdateRequest interface.
 */
export function instanceOfPatchedCycleUpdateRequest(value: object): value is PatchedCycleUpdateRequest {
    return true;
}

export function PatchedCycleUpdateRequestFromJSON(json: any): PatchedCycleUpdateRequest {
    return PatchedCycleUpdateRequestFromJSONTyped(json, false);
}

export function PatchedCycleUpdateRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): PatchedCycleUpdateRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'] == null ? undefined : json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'startDate': json['start_date'] == null ? undefined : (new Date(json['start_date'])),
        'endDate': json['end_date'] == null ? undefined : (new Date(json['end_date'])),
        'ownedBy': json['owned_by'] == null ? undefined : json['owned_by'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'timezone': json['timezone'] == null ? undefined : TimezoneEnumFromJSON(json['timezone']),
    };
}

export function PatchedCycleUpdateRequestToJSON(json: any): PatchedCycleUpdateRequest {
    return PatchedCycleUpdateRequestToJSONTyped(json, false);
}

export function PatchedCycleUpdateRequestToJSONTyped(value?: PatchedCycleUpdateRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'description': value['description'],
        'start_date': value['startDate'] == null ? undefined : ((value['startDate'] as any).toISOString()),
        'end_date': value['endDate'] == null ? undefined : ((value['endDate'] as any).toISOString()),
        'owned_by': value['ownedBy'],
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
        'timezone': TimezoneEnumToJSON(value['timezone']),
    };
}

