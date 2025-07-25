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
 * @interface IssueWorkLogAPI
 */
export interface IssueWorkLogAPI {
    /**
     * 
     * @type {string}
     * @memberof IssueWorkLogAPI
     */
    readonly id?: string;
    /**
     * 
     * @type {Date}
     * @memberof IssueWorkLogAPI
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof IssueWorkLogAPI
     */
    readonly updatedAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof IssueWorkLogAPI
     */
    description?: string;
    /**
     * 
     * @type {number}
     * @memberof IssueWorkLogAPI
     */
    duration?: number;
    /**
     * 
     * @type {string}
     * @memberof IssueWorkLogAPI
     */
    createdBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueWorkLogAPI
     */
    updatedBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueWorkLogAPI
     */
    readonly projectId?: string;
    /**
     * 
     * @type {string}
     * @memberof IssueWorkLogAPI
     */
    readonly workspaceId?: string;
    /**
     * 
     * @type {string}
     * @memberof IssueWorkLogAPI
     */
    readonly loggedBy?: string;
}

/**
 * Check if a given object implements the IssueWorkLogAPI interface.
 */
export function instanceOfIssueWorkLogAPI(value: object): value is IssueWorkLogAPI {
    return true;
}

export function IssueWorkLogAPIFromJSON(json: any): IssueWorkLogAPI {
    return IssueWorkLogAPIFromJSONTyped(json, false);
}

export function IssueWorkLogAPIFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssueWorkLogAPI {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'createdAt': json['created_at'] == null ? undefined : (new Date(json['created_at'])),
        'updatedAt': json['updated_at'] == null ? undefined : (new Date(json['updated_at'])),
        'description': json['description'] == null ? undefined : json['description'],
        'duration': json['duration'] == null ? undefined : json['duration'],
        'createdBy': json['created_by'] == null ? undefined : json['created_by'],
        'updatedBy': json['updated_by'] == null ? undefined : json['updated_by'],
        'projectId': json['project_id'] == null ? undefined : json['project_id'],
        'workspaceId': json['workspace_id'] == null ? undefined : json['workspace_id'],
        'loggedBy': json['logged_by'] == null ? undefined : json['logged_by'],
    };
}

export function IssueWorkLogAPIToJSON(json: any): IssueWorkLogAPI {
    return IssueWorkLogAPIToJSONTyped(json, false);
}

export function IssueWorkLogAPIToJSONTyped(value?: Omit<IssueWorkLogAPI, 'id'|'created_at'|'updated_at'|'project_id'|'workspace_id'|'logged_by'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'description': value['description'],
        'duration': value['duration'],
        'created_by': value['createdBy'],
        'updated_by': value['updatedBy'],
    };
}

