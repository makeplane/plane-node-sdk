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
import type { AccessEnum } from './AccessEnum';
import {
    AccessEnumFromJSON,
    AccessEnumFromJSONTyped,
    AccessEnumToJSON,
    AccessEnumToJSONTyped,
} from './AccessEnum';

/**
 * Full serializer for work item comments with membership context.
 * 
 * Provides complete comment data including member status, content formatting,
 * and edit tracking for collaborative work item discussions.
 * @export
 * @interface IssueComment
 */
export interface IssueComment {
    /**
     * 
     * @type {string}
     * @memberof IssueComment
     */
    readonly id?: string;
    /**
     * 
     * @type {boolean}
     * @memberof IssueComment
     */
    readonly isMember?: boolean;
    /**
     * 
     * @type {Date}
     * @memberof IssueComment
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof IssueComment
     */
    readonly updatedAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof IssueComment
     */
    deletedAt?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof IssueComment
     */
    commentStripped?: string;
    /**
     * 
     * @type {string}
     * @memberof IssueComment
     */
    commentHtml?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof IssueComment
     */
    attachments?: Array<string>;
    /**
     * 
     * @type {AccessEnum}
     * @memberof IssueComment
     */
    access?: AccessEnum;
    /**
     * 
     * @type {string}
     * @memberof IssueComment
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueComment
     */
    externalId?: string | null;
    /**
     * 
     * @type {Date}
     * @memberof IssueComment
     */
    editedAt?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof IssueComment
     */
    readonly createdBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueComment
     */
    readonly updatedBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueComment
     */
    readonly project?: string;
    /**
     * 
     * @type {string}
     * @memberof IssueComment
     */
    readonly workspace?: string;
    /**
     * 
     * @type {string}
     * @memberof IssueComment
     */
    readonly issue?: string;
    /**
     * 
     * @type {string}
     * @memberof IssueComment
     */
    actor?: string | null;
}



/**
 * Check if a given object implements the IssueComment interface.
 */
export function instanceOfIssueComment(value: object): value is IssueComment {
    return true;
}

export function IssueCommentFromJSON(json: any): IssueComment {
    return IssueCommentFromJSONTyped(json, false);
}

export function IssueCommentFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssueComment {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'isMember': json['is_member'] == null ? undefined : json['is_member'],
        'createdAt': json['created_at'] == null ? undefined : (new Date(json['created_at'])),
        'updatedAt': json['updated_at'] == null ? undefined : (new Date(json['updated_at'])),
        'deletedAt': json['deleted_at'] == null ? undefined : (new Date(json['deleted_at'])),
        'commentStripped': json['comment_stripped'] == null ? undefined : json['comment_stripped'],
        'commentHtml': json['comment_html'] == null ? undefined : json['comment_html'],
        'attachments': json['attachments'] == null ? undefined : json['attachments'],
        'access': json['access'] == null ? undefined : AccessEnumFromJSON(json['access']),
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'editedAt': json['edited_at'] == null ? undefined : (new Date(json['edited_at'])),
        'createdBy': json['created_by'] == null ? undefined : json['created_by'],
        'updatedBy': json['updated_by'] == null ? undefined : json['updated_by'],
        'project': json['project'] == null ? undefined : json['project'],
        'workspace': json['workspace'] == null ? undefined : json['workspace'],
        'issue': json['issue'] == null ? undefined : json['issue'],
        'actor': json['actor'] == null ? undefined : json['actor'],
    };
}

export function IssueCommentToJSON(json: any): IssueComment {
    return IssueCommentToJSONTyped(json, false);
}

export function IssueCommentToJSONTyped(value?: Omit<IssueComment, 'id'|'is_member'|'created_at'|'updated_at'|'created_by'|'updated_by'|'project'|'workspace'|'issue'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'deleted_at': value['deletedAt'] == null ? undefined : ((value['deletedAt'] as any).toISOString()),
        'comment_stripped': value['commentStripped'],
        'comment_html': value['commentHtml'],
        'attachments': value['attachments'],
        'access': AccessEnumToJSON(value['access']),
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
        'edited_at': value['editedAt'] == null ? undefined : ((value['editedAt'] as any).toISOString()),
        'actor': value['actor'],
    };
}

