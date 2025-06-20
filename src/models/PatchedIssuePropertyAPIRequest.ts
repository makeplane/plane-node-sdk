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
import type { RelationTypeEnum } from './RelationTypeEnum';
import {
    RelationTypeEnumFromJSON,
    RelationTypeEnumFromJSONTyped,
    RelationTypeEnumToJSON,
    RelationTypeEnumToJSONTyped,
} from './RelationTypeEnum';
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
 * @interface PatchedIssuePropertyAPIRequest
 */
export interface PatchedIssuePropertyAPIRequest {
    /**
     * 
     * @type {RelationTypeEnum}
     * @memberof PatchedIssuePropertyAPIRequest
     */
    relationType?: RelationTypeEnum;
    /**
     * 
     * @type {string}
     * @memberof PatchedIssuePropertyAPIRequest
     */
    displayName?: string;
    /**
     * 
     * @type {string}
     * @memberof PatchedIssuePropertyAPIRequest
     */
    description?: string | null;
    /**
     * 
     * @type {PropertyTypeEnum}
     * @memberof PatchedIssuePropertyAPIRequest
     */
    propertyType?: PropertyTypeEnum;
    /**
     * 
     * @type {boolean}
     * @memberof PatchedIssuePropertyAPIRequest
     */
    isRequired?: boolean;
    /**
     * 
     * @type {Array<string>}
     * @memberof PatchedIssuePropertyAPIRequest
     */
    defaultValue?: Array<string>;
    /**
     * 
     * @type {any}
     * @memberof PatchedIssuePropertyAPIRequest
     */
    settings?: any | null;
    /**
     * 
     * @type {boolean}
     * @memberof PatchedIssuePropertyAPIRequest
     */
    isActive?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PatchedIssuePropertyAPIRequest
     */
    isMulti?: boolean;
    /**
     * 
     * @type {any}
     * @memberof PatchedIssuePropertyAPIRequest
     */
    validationRules?: any | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedIssuePropertyAPIRequest
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedIssuePropertyAPIRequest
     */
    externalId?: string | null;
}



/**
 * Check if a given object implements the PatchedIssuePropertyAPIRequest interface.
 */
export function instanceOfPatchedIssuePropertyAPIRequest(value: object): value is PatchedIssuePropertyAPIRequest {
    return true;
}

export function PatchedIssuePropertyAPIRequestFromJSON(json: any): PatchedIssuePropertyAPIRequest {
    return PatchedIssuePropertyAPIRequestFromJSONTyped(json, false);
}

export function PatchedIssuePropertyAPIRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): PatchedIssuePropertyAPIRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'relationType': json['relation_type'] == null ? undefined : RelationTypeEnumFromJSON(json['relation_type']),
        'displayName': json['display_name'] == null ? undefined : json['display_name'],
        'description': json['description'] == null ? undefined : json['description'],
        'propertyType': json['property_type'] == null ? undefined : PropertyTypeEnumFromJSON(json['property_type']),
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

export function PatchedIssuePropertyAPIRequestToJSON(json: any): PatchedIssuePropertyAPIRequest {
    return PatchedIssuePropertyAPIRequestToJSONTyped(json, false);
}

export function PatchedIssuePropertyAPIRequestToJSONTyped(value?: PatchedIssuePropertyAPIRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'relation_type': RelationTypeEnumToJSON(value['relationType']),
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

