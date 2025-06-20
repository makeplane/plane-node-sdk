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
 * Lightweight module serializer for minimal data transfer.
 * 
 * Provides essential module information without computed metrics,
 * optimized for list views and reference lookups.
 * @export
 * @interface ModuleLite
 */
export interface ModuleLite {
    /**
     * 
     * @type {string}
     * @memberof ModuleLite
     */
    readonly id?: string;
    /**
     * 
     * @type {Date}
     * @memberof ModuleLite
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof ModuleLite
     */
    readonly updatedAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof ModuleLite
     */
    deletedAt: Date | null;
    /**
     * 
     * @type {string}
     * @memberof ModuleLite
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof ModuleLite
     */
    description?: string;
    /**
     * 
     * @type {any}
     * @memberof ModuleLite
     */
    descriptionText?: any | null;
    /**
     * 
     * @type {any}
     * @memberof ModuleLite
     */
    descriptionHtml?: any | null;
    /**
     * 
     * @type {Date}
     * @memberof ModuleLite
     */
    startDate?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof ModuleLite
     */
    targetDate?: Date | null;
    /**
     * 
     * @type {ModuleStatusEnum}
     * @memberof ModuleLite
     */
    status?: ModuleStatusEnum;
    /**
     * 
     * @type {any}
     * @memberof ModuleLite
     */
    viewProps?: any | null;
    /**
     * 
     * @type {number}
     * @memberof ModuleLite
     */
    sortOrder?: number;
    /**
     * 
     * @type {string}
     * @memberof ModuleLite
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ModuleLite
     */
    externalId?: string | null;
    /**
     * 
     * @type {Date}
     * @memberof ModuleLite
     */
    archivedAt?: Date | null;
    /**
     * 
     * @type {any}
     * @memberof ModuleLite
     */
    logoProps?: any | null;
    /**
     * 
     * @type {string}
     * @memberof ModuleLite
     */
    createdBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ModuleLite
     */
    updatedBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ModuleLite
     */
    project: string;
    /**
     * 
     * @type {string}
     * @memberof ModuleLite
     */
    workspace: string;
    /**
     * 
     * @type {string}
     * @memberof ModuleLite
     */
    lead?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof ModuleLite
     */
    readonly members?: Array<string>;
}



/**
 * Check if a given object implements the ModuleLite interface.
 */
export function instanceOfModuleLite(value: object): value is ModuleLite {
    if (!('deletedAt' in value) || value['deletedAt'] === undefined) return false;
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('project' in value) || value['project'] === undefined) return false;
    if (!('workspace' in value) || value['workspace'] === undefined) return false;
    return true;
}

export function ModuleLiteFromJSON(json: any): ModuleLite {
    return ModuleLiteFromJSONTyped(json, false);
}

export function ModuleLiteFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModuleLite {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'createdAt': json['created_at'] == null ? undefined : (new Date(json['created_at'])),
        'updatedAt': json['updated_at'] == null ? undefined : (new Date(json['updated_at'])),
        'deletedAt': (json['deleted_at'] == null ? null : new Date(json['deleted_at'])),
        'name': json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'descriptionText': json['description_text'] == null ? undefined : json['description_text'],
        'descriptionHtml': json['description_html'] == null ? undefined : json['description_html'],
        'startDate': json['start_date'] == null ? undefined : (new Date(json['start_date'])),
        'targetDate': json['target_date'] == null ? undefined : (new Date(json['target_date'])),
        'status': json['status'] == null ? undefined : ModuleStatusEnumFromJSON(json['status']),
        'viewProps': json['view_props'] == null ? undefined : json['view_props'],
        'sortOrder': json['sort_order'] == null ? undefined : json['sort_order'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'archivedAt': json['archived_at'] == null ? undefined : (new Date(json['archived_at'])),
        'logoProps': json['logo_props'] == null ? undefined : json['logo_props'],
        'createdBy': json['created_by'] == null ? undefined : json['created_by'],
        'updatedBy': json['updated_by'] == null ? undefined : json['updated_by'],
        'project': json['project'],
        'workspace': json['workspace'],
        'lead': json['lead'] == null ? undefined : json['lead'],
        'members': json['members'] == null ? undefined : json['members'],
    };
}

export function ModuleLiteToJSON(json: any): ModuleLite {
    return ModuleLiteToJSONTyped(json, false);
}

export function ModuleLiteToJSONTyped(value?: Omit<ModuleLite, 'id'|'created_at'|'updated_at'|'members'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'deleted_at': (value['deletedAt'] == null ? null : (value['deletedAt'] as any).toISOString()),
        'name': value['name'],
        'description': value['description'],
        'description_text': value['descriptionText'],
        'description_html': value['descriptionHtml'],
        'start_date': value['startDate'] == null ? undefined : ((value['startDate'] as any).toISOString().substring(0,10)),
        'target_date': value['targetDate'] == null ? undefined : ((value['targetDate'] as any).toISOString().substring(0,10)),
        'status': ModuleStatusEnumToJSON(value['status']),
        'view_props': value['viewProps'],
        'sort_order': value['sortOrder'],
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
        'archived_at': value['archivedAt'] == null ? undefined : ((value['archivedAt'] as any).toISOString()),
        'logo_props': value['logoProps'],
        'created_by': value['createdBy'],
        'updated_by': value['updatedBy'],
        'project': value['project'],
        'workspace': value['workspace'],
        'lead': value['lead'],
    };
}

