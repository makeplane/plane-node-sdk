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
 * 
 * @export
 * @interface IssuePropertyOptionAPI
 */
export interface IssuePropertyOptionAPI {
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyOptionAPI
     */
    readonly id?: string;
    /**
     * 
     * @type {Date}
     * @memberof IssuePropertyOptionAPI
     */
    readonly deletedAt?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof IssuePropertyOptionAPI
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof IssuePropertyOptionAPI
     */
    readonly updatedAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyOptionAPI
     */
    name: string;
    /**
     * 
     * @type {number}
     * @memberof IssuePropertyOptionAPI
     */
    readonly sortOrder?: number;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyOptionAPI
     */
    description?: string;
    /**
     * 
     * @type {any}
     * @memberof IssuePropertyOptionAPI
     */
    readonly logoProps?: any | null;
    /**
     * 
     * @type {boolean}
     * @memberof IssuePropertyOptionAPI
     */
    isActive?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof IssuePropertyOptionAPI
     */
    isDefault?: boolean;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyOptionAPI
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyOptionAPI
     */
    externalId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyOptionAPI
     */
    readonly createdBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyOptionAPI
     */
    readonly updatedBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyOptionAPI
     */
    readonly workspace?: string;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyOptionAPI
     */
    readonly project?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyOptionAPI
     */
    readonly property?: string;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyOptionAPI
     */
    parent?: string | null;
}

/**
 * Check if a given object implements the IssuePropertyOptionAPI interface.
 */
export function instanceOfIssuePropertyOptionAPI(value: object): value is IssuePropertyOptionAPI {
    if (!('name' in value) || value['name'] === undefined) return false;
    return true;
}

export function IssuePropertyOptionAPIFromJSON(json: any): IssuePropertyOptionAPI {
    return IssuePropertyOptionAPIFromJSONTyped(json, false);
}

export function IssuePropertyOptionAPIFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssuePropertyOptionAPI {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'deletedAt': json['deleted_at'] == null ? undefined : (new Date(json['deleted_at'])),
        'createdAt': json['created_at'] == null ? undefined : (new Date(json['created_at'])),
        'updatedAt': json['updated_at'] == null ? undefined : (new Date(json['updated_at'])),
        'name': json['name'],
        'sortOrder': json['sort_order'] == null ? undefined : json['sort_order'],
        'description': json['description'] == null ? undefined : json['description'],
        'logoProps': json['logo_props'] == null ? undefined : json['logo_props'],
        'isActive': json['is_active'] == null ? undefined : json['is_active'],
        'isDefault': json['is_default'] == null ? undefined : json['is_default'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'createdBy': json['created_by'] == null ? undefined : json['created_by'],
        'updatedBy': json['updated_by'] == null ? undefined : json['updated_by'],
        'workspace': json['workspace'] == null ? undefined : json['workspace'],
        'project': json['project'] == null ? undefined : json['project'],
        'property': json['property'] == null ? undefined : json['property'],
        'parent': json['parent'] == null ? undefined : json['parent'],
    };
}

export function IssuePropertyOptionAPIToJSON(json: any): IssuePropertyOptionAPI {
    return IssuePropertyOptionAPIToJSONTyped(json, false);
}

export function IssuePropertyOptionAPIToJSONTyped(value?: Omit<IssuePropertyOptionAPI, 'id'|'deleted_at'|'created_at'|'updated_at'|'sort_order'|'logo_props'|'created_by'|'updated_by'|'workspace'|'project'|'property'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'description': value['description'],
        'is_active': value['isActive'],
        'is_default': value['isDefault'],
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
        'parent': value['parent'],
    };
}

