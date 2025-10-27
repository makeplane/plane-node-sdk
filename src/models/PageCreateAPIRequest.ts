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
 * @interface PageCreateAPIRequest
 */
export interface PageCreateAPIRequest {
    /**
     * 
     * @type {string}
     * @memberof PageCreateAPIRequest
     */
    name: string;
    /**
     * 
     * @type {PageCreateAPIAccessEnum}
     * @memberof PageCreateAPIRequest
     */
    access?: PageCreateAPIAccessEnum;
    /**
     * 
     * @type {string}
     * @memberof PageCreateAPIRequest
     */
    color?: string;
    /**
     * 
     * @type {boolean}
     * @memberof PageCreateAPIRequest
     */
    isLocked?: boolean;
    /**
     * 
     * @type {Date}
     * @memberof PageCreateAPIRequest
     */
    archivedAt?: Date | null;
    /**
     * 
     * @type {any}
     * @memberof PageCreateAPIRequest
     */
    viewProps?: any | null;
    /**
     * 
     * @type {any}
     * @memberof PageCreateAPIRequest
     */
    logoProps?: any | null;
    /**
     * 
     * @type {string}
     * @memberof PageCreateAPIRequest
     */
    externalId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PageCreateAPIRequest
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PageCreateAPIRequest
     */
    descriptionHtml: string;
}



/**
 * Check if a given object implements the PageCreateAPIRequest interface.
 */
export function instanceOfPageCreateAPIRequest(value: object): value is PageCreateAPIRequest {
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('descriptionHtml' in value) || value['descriptionHtml'] === undefined) return false;
    return true;
}

export function PageCreateAPIRequestFromJSON(json: any): PageCreateAPIRequest {
    return PageCreateAPIRequestFromJSONTyped(json, false);
}

export function PageCreateAPIRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): PageCreateAPIRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'],
        'access': json['access'] == null ? undefined : PageCreateAPIAccessEnumFromJSON(json['access']),
        'color': json['color'] == null ? undefined : json['color'],
        'isLocked': json['is_locked'] == null ? undefined : json['is_locked'],
        'archivedAt': json['archived_at'] == null ? undefined : (new Date(json['archived_at'])),
        'viewProps': json['view_props'] == null ? undefined : json['view_props'],
        'logoProps': json['logo_props'] == null ? undefined : json['logo_props'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'descriptionHtml': json['description_html'],
    };
}

export function PageCreateAPIRequestToJSON(json: any): PageCreateAPIRequest {
    return PageCreateAPIRequestToJSONTyped(json, false);
}

export function PageCreateAPIRequestToJSONTyped(value?: PageCreateAPIRequest | null, ignoreDiscriminator: boolean = false): any {
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

