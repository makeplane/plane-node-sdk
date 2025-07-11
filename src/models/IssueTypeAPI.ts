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
 * @interface IssueTypeAPI
 */
export interface IssueTypeAPI {
    /**
     * 
     * @type {string}
     * @memberof IssueTypeAPI
     */
    readonly id?: string;
    /**
     * 
     * @type {Date}
     * @memberof IssueTypeAPI
     */
    readonly deletedAt?: Date | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof IssueTypeAPI
     */
    projectIds?: Array<string>;
    /**
     * 
     * @type {Date}
     * @memberof IssueTypeAPI
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof IssueTypeAPI
     */
    readonly updatedAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof IssueTypeAPI
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof IssueTypeAPI
     */
    description?: string;
    /**
     * 
     * @type {any}
     * @memberof IssueTypeAPI
     */
    readonly logoProps?: any | null;
    /**
     * 
     * @type {boolean}
     * @memberof IssueTypeAPI
     */
    isEpic?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof IssueTypeAPI
     */
    readonly isDefault?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof IssueTypeAPI
     */
    isActive?: boolean;
    /**
     * 
     * @type {number}
     * @memberof IssueTypeAPI
     */
    readonly level?: number;
    /**
     * 
     * @type {string}
     * @memberof IssueTypeAPI
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueTypeAPI
     */
    externalId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueTypeAPI
     */
    readonly createdBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueTypeAPI
     */
    readonly updatedBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueTypeAPI
     */
    readonly workspace?: string;
}

/**
 * Check if a given object implements the IssueTypeAPI interface.
 */
export function instanceOfIssueTypeAPI(value: object): value is IssueTypeAPI {
    if (!('name' in value) || value['name'] === undefined) return false;
    return true;
}

export function IssueTypeAPIFromJSON(json: any): IssueTypeAPI {
    return IssueTypeAPIFromJSONTyped(json, false);
}

export function IssueTypeAPIFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssueTypeAPI {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'deletedAt': json['deleted_at'] == null ? undefined : (new Date(json['deleted_at'])),
        'projectIds': json['project_ids'] == null ? undefined : json['project_ids'],
        'createdAt': json['created_at'] == null ? undefined : (new Date(json['created_at'])),
        'updatedAt': json['updated_at'] == null ? undefined : (new Date(json['updated_at'])),
        'name': json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'logoProps': json['logo_props'] == null ? undefined : json['logo_props'],
        'isEpic': json['is_epic'] == null ? undefined : json['is_epic'],
        'isDefault': json['is_default'] == null ? undefined : json['is_default'],
        'isActive': json['is_active'] == null ? undefined : json['is_active'],
        'level': json['level'] == null ? undefined : json['level'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'createdBy': json['created_by'] == null ? undefined : json['created_by'],
        'updatedBy': json['updated_by'] == null ? undefined : json['updated_by'],
        'workspace': json['workspace'] == null ? undefined : json['workspace'],
    };
}

export function IssueTypeAPIToJSON(json: any): IssueTypeAPI {
    return IssueTypeAPIToJSONTyped(json, false);
}

export function IssueTypeAPIToJSONTyped(value?: Omit<IssueTypeAPI, 'id'|'deleted_at'|'created_at'|'updated_at'|'logo_props'|'is_default'|'level'|'created_by'|'updated_by'|'workspace'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'project_ids': value['projectIds'],
        'name': value['name'],
        'description': value['description'],
        'is_epic': value['isEpic'],
        'is_active': value['isActive'],
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
    };
}

