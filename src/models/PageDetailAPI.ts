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
/**
 * 
 * @export
 * @interface PageDetailAPI
 */
export interface PageDetailAPI {
    /**
     * 
     * @type {string}
     * @memberof PageDetailAPI
     */
    readonly id?: string;
    /**
     * 
     * @type {string}
     * @memberof PageDetailAPI
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof PageDetailAPI
     */
    descriptionStripped?: string | null;
    /**
     * 
     * @type {Date}
     * @memberof PageDetailAPI
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof PageDetailAPI
     */
    readonly updatedAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof PageDetailAPI
     */
    readonly ownedBy?: string;
    /**
     * 
     * @type {string}
     * @memberof PageDetailAPI
     */
    readonly anchor?: string;
    /**
     * 
     * @type {string}
     * @memberof PageDetailAPI
     */
    readonly workspace?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof PageDetailAPI
     */
    readonly projects?: Array<string>;
}

/**
 * Check if a given object implements the PageDetailAPI interface.
 */
export function instanceOfPageDetailAPI(value: object): value is PageDetailAPI {
    return true;
}

export function PageDetailAPIFromJSON(json: any): PageDetailAPI {
    return PageDetailAPIFromJSONTyped(json, false);
}

export function PageDetailAPIFromJSONTyped(json: any, ignoreDiscriminator: boolean): PageDetailAPI {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'name': json['name'] == null ? undefined : json['name'],
        'descriptionStripped': json['description_stripped'] == null ? undefined : json['description_stripped'],
        'createdAt': json['created_at'] == null ? undefined : (new Date(json['created_at'])),
        'updatedAt': json['updated_at'] == null ? undefined : (new Date(json['updated_at'])),
        'ownedBy': json['owned_by'] == null ? undefined : json['owned_by'],
        'anchor': json['anchor'] == null ? undefined : json['anchor'],
        'workspace': json['workspace'] == null ? undefined : json['workspace'],
        'projects': json['projects'] == null ? undefined : json['projects'],
    };
}

export function PageDetailAPIToJSON(json: any): PageDetailAPI {
    return PageDetailAPIToJSONTyped(json, false);
}

export function PageDetailAPIToJSONTyped(value?: Omit<PageDetailAPI, 'id'|'created_at'|'updated_at'|'owned_by'|'anchor'|'workspace'|'projects'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'description_stripped': value['descriptionStripped'],
    };
}

