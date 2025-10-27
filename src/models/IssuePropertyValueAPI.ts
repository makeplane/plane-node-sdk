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
 * @interface IssuePropertyValueAPI
 */
export interface IssuePropertyValueAPI {
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyValueAPI
     */
    readonly id?: string;
    /**
     * 
     * @type {Date}
     * @memberof IssuePropertyValueAPI
     */
    readonly deletedAt?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof IssuePropertyValueAPI
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof IssuePropertyValueAPI
     */
    readonly updatedAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyValueAPI
     */
    valueText?: string;
    /**
     * 
     * @type {boolean}
     * @memberof IssuePropertyValueAPI
     */
    valueBoolean?: boolean;
    /**
     * 
     * @type {number}
     * @memberof IssuePropertyValueAPI
     */
    valueDecimal?: number;
    /**
     * 
     * @type {Date}
     * @memberof IssuePropertyValueAPI
     */
    valueDatetime?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyValueAPI
     */
    valueUuid?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyValueAPI
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyValueAPI
     */
    externalId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyValueAPI
     */
    readonly createdBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyValueAPI
     */
    readonly updatedBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyValueAPI
     */
    readonly workspace?: string;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyValueAPI
     */
    readonly project?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyValueAPI
     */
    issue: string;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyValueAPI
     */
    property: string;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyValueAPI
     */
    valueOption?: string | null;
}

/**
 * Check if a given object implements the IssuePropertyValueAPI interface.
 */
export function instanceOfIssuePropertyValueAPI(value: object): value is IssuePropertyValueAPI {
    if (!('issue' in value) || value['issue'] === undefined) return false;
    if (!('property' in value) || value['property'] === undefined) return false;
    return true;
}

export function IssuePropertyValueAPIFromJSON(json: any): IssuePropertyValueAPI {
    return IssuePropertyValueAPIFromJSONTyped(json, false);
}

export function IssuePropertyValueAPIFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssuePropertyValueAPI {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'deletedAt': json['deleted_at'] == null ? undefined : (new Date(json['deleted_at'])),
        'createdAt': json['created_at'] == null ? undefined : (new Date(json['created_at'])),
        'updatedAt': json['updated_at'] == null ? undefined : (new Date(json['updated_at'])),
        'valueText': json['value_text'] == null ? undefined : json['value_text'],
        'valueBoolean': json['value_boolean'] == null ? undefined : json['value_boolean'],
        'valueDecimal': json['value_decimal'] == null ? undefined : json['value_decimal'],
        'valueDatetime': json['value_datetime'] == null ? undefined : (new Date(json['value_datetime'])),
        'valueUuid': json['value_uuid'] == null ? undefined : json['value_uuid'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'createdBy': json['created_by'] == null ? undefined : json['created_by'],
        'updatedBy': json['updated_by'] == null ? undefined : json['updated_by'],
        'workspace': json['workspace'] == null ? undefined : json['workspace'],
        'project': json['project'] == null ? undefined : json['project'],
        'issue': json['issue'],
        'property': json['property'],
        'valueOption': json['value_option'] == null ? undefined : json['value_option'],
    };
}

export function IssuePropertyValueAPIToJSON(json: any): IssuePropertyValueAPI {
    return IssuePropertyValueAPIToJSONTyped(json, false);
}

export function IssuePropertyValueAPIToJSONTyped(value?: Omit<IssuePropertyValueAPI, 'id'|'deleted_at'|'created_at'|'updated_at'|'created_by'|'updated_by'|'workspace'|'project'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'value_text': value['valueText'],
        'value_boolean': value['valueBoolean'],
        'value_decimal': value['valueDecimal'],
        'value_datetime': value['valueDatetime'] == null ? undefined : ((value['valueDatetime'] as any).toISOString()),
        'value_uuid': value['valueUuid'],
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
        'issue': value['issue'],
        'property': value['property'],
        'value_option': value['valueOption'],
    };
}

