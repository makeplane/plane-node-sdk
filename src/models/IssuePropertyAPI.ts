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
import type { IssuePropertyAPIRelationTypeEnum } from './IssuePropertyAPIRelationTypeEnum';
import {
    IssuePropertyAPIRelationTypeEnumFromJSON,
    IssuePropertyAPIRelationTypeEnumFromJSONTyped,
    IssuePropertyAPIRelationTypeEnumToJSON,
    IssuePropertyAPIRelationTypeEnumToJSONTyped,
} from './IssuePropertyAPIRelationTypeEnum';
import type { PropertyTypeEnum } from './PropertyTypeEnum';
import {
    PropertyTypeEnumFromJSON,
    PropertyTypeEnumFromJSONTyped,
    PropertyTypeEnumToJSON,
    PropertyTypeEnumToJSONTyped,
} from './PropertyTypeEnum';

/**
 * 
 * @export
 * @interface IssuePropertyAPI
 */
export interface IssuePropertyAPI {
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyAPI
     */
    readonly id?: string;
    /**
     * 
     * @type {Date}
     * @memberof IssuePropertyAPI
     */
    readonly deletedAt?: Date | null;
    /**
     * 
     * @type {IssuePropertyAPIRelationTypeEnum}
     * @memberof IssuePropertyAPI
     */
    relationType?: IssuePropertyAPIRelationTypeEnum | null;
    /**
     * 
     * @type {Date}
     * @memberof IssuePropertyAPI
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof IssuePropertyAPI
     */
    readonly updatedAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyAPI
     */
    readonly name?: string;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyAPI
     */
    displayName: string;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyAPI
     */
    description?: string | null;
    /**
     * 
     * @type {any}
     * @memberof IssuePropertyAPI
     */
    readonly logoProps?: any | null;
    /**
     * 
     * @type {number}
     * @memberof IssuePropertyAPI
     */
    readonly sortOrder?: number;
    /**
     * 
     * @type {PropertyTypeEnum}
     * @memberof IssuePropertyAPI
     */
    propertyType: PropertyTypeEnum;
    /**
     * 
     * @type {boolean}
     * @memberof IssuePropertyAPI
     */
    isRequired?: boolean;
    /**
     * 
     * @type {Array<string>}
     * @memberof IssuePropertyAPI
     */
    defaultValue?: Array<string>;
    /**
     * 
     * @type {any}
     * @memberof IssuePropertyAPI
     */
    settings?: any | null;
    /**
     * 
     * @type {boolean}
     * @memberof IssuePropertyAPI
     */
    isActive?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof IssuePropertyAPI
     */
    isMulti?: boolean;
    /**
     * 
     * @type {any}
     * @memberof IssuePropertyAPI
     */
    validationRules?: any | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyAPI
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyAPI
     */
    externalId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyAPI
     */
    readonly createdBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyAPI
     */
    readonly updatedBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyAPI
     */
    readonly workspace?: string;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyAPI
     */
    readonly project?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyAPI
     */
    readonly issueType?: string;
}



/**
 * Check if a given object implements the IssuePropertyAPI interface.
 */
export function instanceOfIssuePropertyAPI(value: object): value is IssuePropertyAPI {
    if (!('displayName' in value) || value['displayName'] === undefined) return false;
    if (!('propertyType' in value) || value['propertyType'] === undefined) return false;
    return true;
}

export function IssuePropertyAPIFromJSON(json: any): IssuePropertyAPI {
    return IssuePropertyAPIFromJSONTyped(json, false);
}

export function IssuePropertyAPIFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssuePropertyAPI {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'deletedAt': json['deleted_at'] == null ? undefined : (new Date(json['deleted_at'])),
        'relationType': json['relation_type'] == null ? undefined : IssuePropertyAPIRelationTypeEnumFromJSON(json['relation_type']),
        'createdAt': json['created_at'] == null ? undefined : (new Date(json['created_at'])),
        'updatedAt': json['updated_at'] == null ? undefined : (new Date(json['updated_at'])),
        'name': json['name'] == null ? undefined : json['name'],
        'displayName': json['display_name'],
        'description': json['description'] == null ? undefined : json['description'],
        'logoProps': json['logo_props'] == null ? undefined : json['logo_props'],
        'sortOrder': json['sort_order'] == null ? undefined : json['sort_order'],
        'propertyType': PropertyTypeEnumFromJSON(json['property_type']),
        'isRequired': json['is_required'] == null ? undefined : json['is_required'],
        'defaultValue': json['default_value'] == null ? undefined : json['default_value'],
        'settings': json['settings'] == null ? undefined : json['settings'],
        'isActive': json['is_active'] == null ? undefined : json['is_active'],
        'isMulti': json['is_multi'] == null ? undefined : json['is_multi'],
        'validationRules': json['validation_rules'] == null ? undefined : json['validation_rules'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'createdBy': json['created_by'] == null ? undefined : json['created_by'],
        'updatedBy': json['updated_by'] == null ? undefined : json['updated_by'],
        'workspace': json['workspace'] == null ? undefined : json['workspace'],
        'project': json['project'] == null ? undefined : json['project'],
        'issueType': json['issue_type'] == null ? undefined : json['issue_type'],
    };
}

export function IssuePropertyAPIToJSON(json: any): IssuePropertyAPI {
    return IssuePropertyAPIToJSONTyped(json, false);
}

export function IssuePropertyAPIToJSONTyped(value?: Omit<IssuePropertyAPI, 'id'|'deleted_at'|'created_at'|'updated_at'|'name'|'logo_props'|'sort_order'|'created_by'|'updated_by'|'workspace'|'project'|'issue_type'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'relation_type': IssuePropertyAPIRelationTypeEnumToJSON(value['relationType']),
        'display_name': value['displayName'],
        'description': value['description'],
        'property_type': PropertyTypeEnumToJSON(value['propertyType']),
        'is_required': value['isRequired'],
        'default_value': value['defaultValue'],
        'settings': value['settings'],
        'is_active': value['isActive'],
        'is_multi': value['isMulti'],
        'validation_rules': value['validationRules'],
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
    };
}

