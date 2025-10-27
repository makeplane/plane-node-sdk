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
 * Serializer for creating cycles with timezone handling and date validation.
 * 
 * Manages cycle creation including project timezone conversion, date range validation,
 * and UTC normalization for time-bound iteration planning and sprint management.
 * @export
 * @interface CycleCreateRequest
 */
export interface CycleCreateRequest {
    /**
     * 
     * @type {string}
     * @memberof CycleCreateRequest
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof CycleCreateRequest
     */
    description?: string;
    /**
     * 
     * @type {Date}
     * @memberof CycleCreateRequest
     */
    startDate?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof CycleCreateRequest
     */
    endDate?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof CycleCreateRequest
     */
    ownedBy: string;
    /**
     * 
     * @type {string}
     * @memberof CycleCreateRequest
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof CycleCreateRequest
     */
    externalId?: string | null;
    /**
     * 
     * @type {TimezoneEnum}
     * @memberof CycleCreateRequest
     */
    timezone?: TimezoneEnum;
}



/**
 * Check if a given object implements the CycleCreateRequest interface.
 */
export function instanceOfCycleCreateRequest(value: object): value is CycleCreateRequest {
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('ownedBy' in value) || value['ownedBy'] === undefined) return false;
    return true;
}

export function CycleCreateRequestFromJSON(json: any): CycleCreateRequest {
    return CycleCreateRequestFromJSONTyped(json, false);
}

export function CycleCreateRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): CycleCreateRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'startDate': json['start_date'] == null ? undefined : (new Date(json['start_date'])),
        'endDate': json['end_date'] == null ? undefined : (new Date(json['end_date'])),
        'ownedBy': json['owned_by'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'timezone': json['timezone'] == null ? undefined : TimezoneEnumFromJSON(json['timezone']),
    };
}

export function CycleCreateRequestToJSON(json: any): CycleCreateRequest {
    return CycleCreateRequestToJSONTyped(json, false);
}

export function CycleCreateRequestToJSONTyped(value?: CycleCreateRequest | null, ignoreDiscriminator: boolean = false): any {
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

