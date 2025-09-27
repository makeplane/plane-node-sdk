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
import type { PageCreateAPIAccessEnum } from './PageCreateAPIAccessEnum';
import {
    PageCreateAPIAccessEnumFromJSON,
    PageCreateAPIAccessEnumFromJSONTyped,
    PageCreateAPIAccessEnumToJSON,
    PageCreateAPIAccessEnumToJSONTyped,
} from './PageCreateAPIAccessEnum';

/**
 * 
 * @export
 * @interface PageCreateAPI
 */
export interface PageCreateAPI {
    /**
     * 
     * @type {string}
     * @memberof PageCreateAPI
     */
    readonly id?: string;
    /**
     * 
     * @type {string}
     * @memberof PageCreateAPI
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof PageCreateAPI
     */
    readonly ownedBy?: string;
    /**
     * 
     * @type {PageCreateAPIAccessEnum}
     * @memberof PageCreateAPI
     */
    access?: PageCreateAPIAccessEnum;
    /**
     * 
     * @type {string}
     * @memberof PageCreateAPI
     */
    color?: string;
    /**
     * 
     * @type {boolean}
     * @memberof PageCreateAPI
     */
    isLocked?: boolean;
    /**
     * 
     * @type {Date}
     * @memberof PageCreateAPI
     */
    archivedAt?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof PageCreateAPI
     */
    readonly workspace?: string;
    /**
     * 
     * @type {Date}
     * @memberof PageCreateAPI
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof PageCreateAPI
     */
    readonly updatedAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof PageCreateAPI
     */
    readonly createdBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PageCreateAPI
     */
    readonly updatedBy?: string | null;
    /**
     * 
     * @type {any}
     * @memberof PageCreateAPI
     */
    viewProps?: any | null;
    /**
     * 
     * @type {any}
     * @memberof PageCreateAPI
     */
    logoProps?: any | null;
    /**
     * 
     * @type {string}
     * @memberof PageCreateAPI
     */
    externalId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PageCreateAPI
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PageCreateAPI
     */
    readonly parentId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PageCreateAPI
     */
    descriptionHtml: string;
}



/**
 * Check if a given object implements the PageCreateAPI interface.
 */
export function instanceOfPageCreateAPI(value: object): value is PageCreateAPI {
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('descriptionHtml' in value) || value['descriptionHtml'] === undefined) return false;
    return true;
}

export function PageCreateAPIFromJSON(json: any): PageCreateAPI {
    return PageCreateAPIFromJSONTyped(json, false);
}

export function PageCreateAPIFromJSONTyped(json: any, ignoreDiscriminator: boolean): PageCreateAPI {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'name': json['name'],
        'ownedBy': json['owned_by'] == null ? undefined : json['owned_by'],
        'access': json['access'] == null ? undefined : PageCreateAPIAccessEnumFromJSON(json['access']),
        'color': json['color'] == null ? undefined : json['color'],
        'isLocked': json['is_locked'] == null ? undefined : json['is_locked'],
        'archivedAt': json['archived_at'] == null ? undefined : (new Date(json['archived_at'])),
        'workspace': json['workspace'] == null ? undefined : json['workspace'],
        'createdAt': json['created_at'] == null ? undefined : (new Date(json['created_at'])),
        'updatedAt': json['updated_at'] == null ? undefined : (new Date(json['updated_at'])),
        'createdBy': json['created_by'] == null ? undefined : json['created_by'],
        'updatedBy': json['updated_by'] == null ? undefined : json['updated_by'],
        'viewProps': json['view_props'] == null ? undefined : json['view_props'],
        'logoProps': json['logo_props'] == null ? undefined : json['logo_props'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'parentId': json['parent_id'] == null ? undefined : json['parent_id'],
        'descriptionHtml': json['description_html'],
    };
}

export function PageCreateAPIToJSON(json: any): PageCreateAPI {
    return PageCreateAPIToJSONTyped(json, false);
}

export function PageCreateAPIToJSONTyped(value?: Omit<PageCreateAPI, 'id'|'owned_by'|'workspace'|'created_at'|'updated_at'|'created_by'|'updated_by'|'parent_id'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'access': PageCreateAPIAccessEnumToJSON(value['access']),
        'color': value['color'],
        'is_locked': value['isLocked'],
        'archived_at': value['archivedAt'] == null ? undefined : ((value['archivedAt'] as any).toISOString().substring(0,10)),
        'view_props': value['viewProps'],
        'logo_props': value['logoProps'],
        'external_id': value['externalId'],
        'external_source': value['externalSource'],
        'description_html': value['descriptionHtml'],
    };
}

