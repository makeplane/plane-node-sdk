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
import type { TimezoneEnum } from './TimezoneEnum';
import {
    TimezoneEnumFromJSON,
    TimezoneEnumFromJSONTyped,
    TimezoneEnumToJSON,
    TimezoneEnumToJSONTyped,
} from './TimezoneEnum';

/**
 * Lightweight cycle serializer for minimal data transfer.
 * 
 * Provides essential cycle information without computed metrics,
 * optimized for list views and reference lookups.
 * @export
 * @interface CycleLite
 */
export interface CycleLite {
    /**
     * 
     * @type {string}
     * @memberof CycleLite
     */
    readonly id?: string;
    /**
     * 
     * @type {Date}
     * @memberof CycleLite
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof CycleLite
     */
    readonly updatedAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof CycleLite
     */
    deletedAt?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof CycleLite
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof CycleLite
     */
    description?: string;
    /**
     * 
     * @type {Date}
     * @memberof CycleLite
     */
    startDate?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof CycleLite
     */
    endDate?: Date | null;
    /**
     * 
     * @type {any}
     * @memberof CycleLite
     */
    viewProps?: any | null;
    /**
     * 
     * @type {number}
     * @memberof CycleLite
     */
    sortOrder?: number;
    /**
     * 
     * @type {string}
     * @memberof CycleLite
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof CycleLite
     */
    externalId?: string | null;
    /**
     * 
     * @type {any}
     * @memberof CycleLite
     */
    progressSnapshot?: any | null;
    /**
     * 
     * @type {Date}
     * @memberof CycleLite
     */
    archivedAt?: Date | null;
    /**
     * 
     * @type {any}
     * @memberof CycleLite
     */
    logoProps?: any | null;
    /**
     * 
     * @type {TimezoneEnum}
     * @memberof CycleLite
     */
    timezone?: TimezoneEnum;
    /**
     * 
     * @type {number}
     * @memberof CycleLite
     */
    version?: number;
    /**
     * 
     * @type {string}
     * @memberof CycleLite
     */
    createdBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof CycleLite
     */
    updatedBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof CycleLite
     */
    project: string;
    /**
     * 
     * @type {string}
     * @memberof CycleLite
     */
    workspace: string;
    /**
     * 
     * @type {string}
     * @memberof CycleLite
     */
    ownedBy: string;
}



/**
 * Check if a given object implements the CycleLite interface.
 */
export function instanceOfCycleLite(value: object): value is CycleLite {
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('project' in value) || value['project'] === undefined) return false;
    if (!('workspace' in value) || value['workspace'] === undefined) return false;
    if (!('ownedBy' in value) || value['ownedBy'] === undefined) return false;
    return true;
}

export function CycleLiteFromJSON(json: any): CycleLite {
    return CycleLiteFromJSONTyped(json, false);
}

export function CycleLiteFromJSONTyped(json: any, ignoreDiscriminator: boolean): CycleLite {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'createdAt': json['created_at'] == null ? undefined : (new Date(json['created_at'])),
        'updatedAt': json['updated_at'] == null ? undefined : (new Date(json['updated_at'])),
        'deletedAt': json['deleted_at'] == null ? undefined : (new Date(json['deleted_at'])),
        'name': json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'startDate': json['start_date'] == null ? undefined : (new Date(json['start_date'])),
        'endDate': json['end_date'] == null ? undefined : (new Date(json['end_date'])),
        'viewProps': json['view_props'] == null ? undefined : json['view_props'],
        'sortOrder': json['sort_order'] == null ? undefined : json['sort_order'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'progressSnapshot': json['progress_snapshot'] == null ? undefined : json['progress_snapshot'],
        'archivedAt': json['archived_at'] == null ? undefined : (new Date(json['archived_at'])),
        'logoProps': json['logo_props'] == null ? undefined : json['logo_props'],
        'timezone': json['timezone'] == null ? undefined : TimezoneEnumFromJSON(json['timezone']),
        'version': json['version'] == null ? undefined : json['version'],
        'createdBy': json['created_by'] == null ? undefined : json['created_by'],
        'updatedBy': json['updated_by'] == null ? undefined : json['updated_by'],
        'project': json['project'],
        'workspace': json['workspace'],
        'ownedBy': json['owned_by'],
    };
}

export function CycleLiteToJSON(json: any): CycleLite {
    return CycleLiteToJSONTyped(json, false);
}

export function CycleLiteToJSONTyped(value?: Omit<CycleLite, 'id'|'created_at'|'updated_at'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'deleted_at': value['deletedAt'] == null ? undefined : ((value['deletedAt'] as any).toISOString()),
        'name': value['name'],
        'description': value['description'],
        'start_date': value['startDate'] == null ? undefined : ((value['startDate'] as any).toISOString()),
        'end_date': value['endDate'] == null ? undefined : ((value['endDate'] as any).toISOString()),
        'view_props': value['viewProps'],
        'sort_order': value['sortOrder'],
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
        'progress_snapshot': value['progressSnapshot'],
        'archived_at': value['archivedAt'] == null ? undefined : ((value['archivedAt'] as any).toISOString()),
        'logo_props': value['logoProps'],
        'timezone': TimezoneEnumToJSON(value['timezone']),
        'version': value['version'],
        'created_by': value['createdBy'],
        'updated_by': value['updatedBy'],
        'project': value['project'],
        'workspace': value['workspace'],
        'owned_by': value['ownedBy'],
    };
}

