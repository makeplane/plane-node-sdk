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
import type { ModuleStatusEnum } from './ModuleStatusEnum';
import {
    ModuleStatusEnumFromJSON,
    ModuleStatusEnumFromJSONTyped,
    ModuleStatusEnumToJSON,
    ModuleStatusEnumToJSONTyped,
} from './ModuleStatusEnum';

/**
 * Serializer for creating modules with member validation and date checking.
 * 
 * Handles module creation including member assignment validation, date range verification,
 * and duplicate name prevention for feature-based project organization setup.
 * @export
 * @interface ModuleCreateRequest
 */
export interface ModuleCreateRequest {
    /**
     * 
     * @type {string}
     * @memberof ModuleCreateRequest
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof ModuleCreateRequest
     */
    description?: string;
    /**
     * 
     * @type {Date}
     * @memberof ModuleCreateRequest
     */
    startDate?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof ModuleCreateRequest
     */
    targetDate?: Date | null;
    /**
     * 
     * @type {ModuleStatusEnum}
     * @memberof ModuleCreateRequest
     */
    status?: ModuleStatusEnum;
    /**
     * 
     * @type {string}
     * @memberof ModuleCreateRequest
     */
    lead?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof ModuleCreateRequest
     */
    members?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof ModuleCreateRequest
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ModuleCreateRequest
     */
    externalId?: string | null;
}



/**
 * Check if a given object implements the ModuleCreateRequest interface.
 */
export function instanceOfModuleCreateRequest(value: object): value is ModuleCreateRequest {
    if (!('name' in value) || value['name'] === undefined) return false;
    return true;
}

export function ModuleCreateRequestFromJSON(json: any): ModuleCreateRequest {
    return ModuleCreateRequestFromJSONTyped(json, false);
}

export function ModuleCreateRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModuleCreateRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'startDate': json['start_date'] == null ? undefined : (new Date(json['start_date'])),
        'targetDate': json['target_date'] == null ? undefined : (new Date(json['target_date'])),
        'status': json['status'] == null ? undefined : ModuleStatusEnumFromJSON(json['status']),
        'lead': json['lead'] == null ? undefined : json['lead'],
        'members': json['members'] == null ? undefined : json['members'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
    };
}

export function ModuleCreateRequestToJSON(json: any): ModuleCreateRequest {
    return ModuleCreateRequestToJSONTyped(json, false);
}

export function ModuleCreateRequestToJSONTyped(value?: ModuleCreateRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'description': value['description'],
        'start_date': value['startDate'] == null ? undefined : ((value['startDate'] as any).toISOString().substring(0,10)),
        'target_date': value['targetDate'] == null ? undefined : ((value['targetDate'] as any).toISOString().substring(0,10)),
        'status': ModuleStatusEnumToJSON(value['status']),
        'lead': value['lead'],
        'members': value['members'],
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
    };
}

