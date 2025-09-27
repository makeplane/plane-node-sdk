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
 * @interface IssuePropertyAPIRequest
 */
export interface IssuePropertyAPIRequest {
    /**
     * 
     * @type {IssuePropertyAPIRelationTypeEnum}
     * @memberof IssuePropertyAPIRequest
     */
    relationType?: IssuePropertyAPIRelationTypeEnum | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyAPIRequest
     */
    displayName: string;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyAPIRequest
     */
    description?: string | null;
    /**
     * 
     * @type {PropertyTypeEnum}
     * @memberof IssuePropertyAPIRequest
     */
    propertyType: PropertyTypeEnum;
    /**
     * 
     * @type {boolean}
     * @memberof IssuePropertyAPIRequest
     */
    isRequired?: boolean;
    /**
     * 
     * @type {Array<string>}
     * @memberof IssuePropertyAPIRequest
     */
    defaultValue?: Array<string>;
    /**
     * 
     * @type {any}
     * @memberof IssuePropertyAPIRequest
     */
    settings?: any | null;
    /**
     * 
     * @type {boolean}
     * @memberof IssuePropertyAPIRequest
     */
    isActive?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof IssuePropertyAPIRequest
     */
    isMulti?: boolean;
    /**
     * 
     * @type {any}
     * @memberof IssuePropertyAPIRequest
     */
    validationRules?: any | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyAPIRequest
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyAPIRequest
     */
    externalId?: string | null;
}



/**
 * Check if a given object implements the IssuePropertyAPIRequest interface.
 */
export function instanceOfIssuePropertyAPIRequest(value: object): value is IssuePropertyAPIRequest {
    if (!('displayName' in value) || value['displayName'] === undefined) return false;
    if (!('propertyType' in value) || value['propertyType'] === undefined) return false;
    return true;
}

export function IssuePropertyAPIRequestFromJSON(json: any): IssuePropertyAPIRequest {
    return IssuePropertyAPIRequestFromJSONTyped(json, false);
}

export function IssuePropertyAPIRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssuePropertyAPIRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'relationType': json['relation_type'] == null ? undefined : IssuePropertyAPIRelationTypeEnumFromJSON(json['relation_type']),
        'displayName': json['display_name'],
        'description': json['description'] == null ? undefined : json['description'],
        'propertyType': PropertyTypeEnumFromJSON(json['property_type']),
        'isRequired': json['is_required'] == null ? undefined : json['is_required'],
        'defaultValue': json['default_value'] == null ? undefined : json['default_value'],
        'settings': json['settings'] == null ? undefined : json['settings'],
        'isActive': json['is_active'] == null ? undefined : json['is_active'],
        'isMulti': json['is_multi'] == null ? undefined : json['is_multi'],
        'validationRules': json['validation_rules'] == null ? undefined : json['validation_rules'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
    };
}

export function IssuePropertyAPIRequestToJSON(json: any): IssuePropertyAPIRequest {
    return IssuePropertyAPIRequestToJSONTyped(json, false);
}

export function IssuePropertyAPIRequestToJSONTyped(value?: IssuePropertyAPIRequest | null, ignoreDiscriminator: boolean = false): any {
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

