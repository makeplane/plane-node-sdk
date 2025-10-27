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
 * Serializer for work item activity and change history.
 * 
 * Tracks and represents work item modifications, state changes,
 * and user interactions for audit trails and activity feeds.
 * @export
 * @interface IssueActivity
 */
export interface IssueActivity {
    /**
     * 
     * @type {string}
     * @memberof IssueActivity
     */
    readonly id?: string;
    /**
     * 
     * @type {Date}
     * @memberof IssueActivity
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof IssueActivity
     */
    readonly updatedAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof IssueActivity
     */
    deletedAt?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof IssueActivity
     */
    verb?: string;
    /**
     * 
     * @type {string}
     * @memberof IssueActivity
     */
    field?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueActivity
     */
    oldValue?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueActivity
     */
    newValue?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueActivity
     */
    comment?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof IssueActivity
     */
    attachments?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof IssueActivity
     */
    oldIdentifier?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueActivity
     */
    newIdentifier?: string | null;
    /**
     * 
     * @type {number}
     * @memberof IssueActivity
     */
    epoch?: number | null;
    /**
     * 
     * @type {string}
     * @memberof IssueActivity
     */
    project: string;
    /**
     * 
     * @type {string}
     * @memberof IssueActivity
     */
    workspace: string;
    /**
     * 
     * @type {string}
     * @memberof IssueActivity
     */
    issue?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueActivity
     */
    issueComment?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueActivity
     */
    actor?: string | null;
}

/**
 * Check if a given object implements the IssueActivity interface.
 */
export function instanceOfIssueActivity(value: object): value is IssueActivity {
    if (!('project' in value) || value['project'] === undefined) return false;
    if (!('workspace' in value) || value['workspace'] === undefined) return false;
    return true;
}

export function IssueActivityFromJSON(json: any): IssueActivity {
    return IssueActivityFromJSONTyped(json, false);
}

export function IssueActivityFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssueActivity {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'createdAt': json['created_at'] == null ? undefined : (new Date(json['created_at'])),
        'updatedAt': json['updated_at'] == null ? undefined : (new Date(json['updated_at'])),
        'deletedAt': json['deleted_at'] == null ? undefined : (new Date(json['deleted_at'])),
        'verb': json['verb'] == null ? undefined : json['verb'],
        'field': json['field'] == null ? undefined : json['field'],
        'oldValue': json['old_value'] == null ? undefined : json['old_value'],
        'newValue': json['new_value'] == null ? undefined : json['new_value'],
        'comment': json['comment'] == null ? undefined : json['comment'],
        'attachments': json['attachments'] == null ? undefined : json['attachments'],
        'oldIdentifier': json['old_identifier'] == null ? undefined : json['old_identifier'],
        'newIdentifier': json['new_identifier'] == null ? undefined : json['new_identifier'],
        'epoch': json['epoch'] == null ? undefined : json['epoch'],
        'project': json['project'],
        'workspace': json['workspace'],
        'issue': json['issue'] == null ? undefined : json['issue'],
        'issueComment': json['issue_comment'] == null ? undefined : json['issue_comment'],
        'actor': json['actor'] == null ? undefined : json['actor'],
    };
}

export function IssueActivityToJSON(json: any): IssueActivity {
    return IssueActivityToJSONTyped(json, false);
}

export function IssueActivityToJSONTyped(value?: Omit<IssueActivity, 'id'|'created_at'|'updated_at'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'deleted_at': value['deletedAt'] == null ? undefined : ((value['deletedAt'] as any).toISOString()),
        'verb': value['verb'],
        'field': value['field'],
        'old_value': value['oldValue'],
        'new_value': value['newValue'],
        'comment': value['comment'],
        'attachments': value['attachments'],
        'old_identifier': value['oldIdentifier'],
        'new_identifier': value['newIdentifier'],
        'epoch': value['epoch'],
        'project': value['project'],
        'workspace': value['workspace'],
        'issue': value['issue'],
        'issue_comment': value['issueComment'],
        'actor': value['actor'],
    };
}

