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
 * Serializer for work item file attachments.
 * 
 * Manages file asset associations with work items including metadata,
 * storage information, and access control for document management.
 * @export
 * @interface IssueAttachment
 */
export interface IssueAttachment {
    /**
     * 
     * @type {string}
     * @memberof IssueAttachment
     */
    readonly id?: string;
    /**
     * 
     * @type {Date}
     * @memberof IssueAttachment
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof IssueAttachment
     */
    readonly updatedAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof IssueAttachment
     */
    deletedAt?: Date | null;
    /**
     * 
     * @type {any}
     * @memberof IssueAttachment
     */
    attributes?: any | null;
    /**
     * 
     * @type {string}
     * @memberof IssueAttachment
     */
    asset: string;
    /**
     * 
     * @type {string}
     * @memberof IssueAttachment
     */
    entityType?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueAttachment
     */
    entityIdentifier?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof IssueAttachment
     */
    isDeleted?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof IssueAttachment
     */
    isArchived?: boolean;
    /**
     * 
     * @type {string}
     * @memberof IssueAttachment
     */
    externalId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueAttachment
     */
    externalSource?: string | null;
    /**
     * 
     * @type {number}
     * @memberof IssueAttachment
     */
    size?: number;
    /**
     * 
     * @type {boolean}
     * @memberof IssueAttachment
     */
    isUploaded?: boolean;
    /**
     * 
     * @type {any}
     * @memberof IssueAttachment
     */
    storageMetadata?: any | null;
    /**
     * 
     * @type {string}
     * @memberof IssueAttachment
     */
    createdBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueAttachment
     */
    readonly updatedBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueAttachment
     */
    user?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueAttachment
     */
    readonly workspace?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueAttachment
     */
    draftIssue?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueAttachment
     */
    readonly project?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueAttachment
     */
    readonly issue?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueAttachment
     */
    comment?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueAttachment
     */
    page?: string | null;
}

/**
 * Check if a given object implements the IssueAttachment interface.
 */
export function instanceOfIssueAttachment(value: object): value is IssueAttachment {
    if (!('asset' in value) || value['asset'] === undefined) return false;
    return true;
}

export function IssueAttachmentFromJSON(json: any): IssueAttachment {
    return IssueAttachmentFromJSONTyped(json, false);
}

export function IssueAttachmentFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssueAttachment {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'createdAt': json['created_at'] == null ? undefined : (new Date(json['created_at'])),
        'updatedAt': json['updated_at'] == null ? undefined : (new Date(json['updated_at'])),
        'deletedAt': json['deleted_at'] == null ? undefined : (new Date(json['deleted_at'])),
        'attributes': json['attributes'] == null ? undefined : json['attributes'],
        'asset': json['asset'],
        'entityType': json['entity_type'] == null ? undefined : json['entity_type'],
        'entityIdentifier': json['entity_identifier'] == null ? undefined : json['entity_identifier'],
        'isDeleted': json['is_deleted'] == null ? undefined : json['is_deleted'],
        'isArchived': json['is_archived'] == null ? undefined : json['is_archived'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'size': json['size'] == null ? undefined : json['size'],
        'isUploaded': json['is_uploaded'] == null ? undefined : json['is_uploaded'],
        'storageMetadata': json['storage_metadata'] == null ? undefined : json['storage_metadata'],
        'createdBy': json['created_by'] == null ? undefined : json['created_by'],
        'updatedBy': json['updated_by'] == null ? undefined : json['updated_by'],
        'user': json['user'] == null ? undefined : json['user'],
        'workspace': json['workspace'] == null ? undefined : json['workspace'],
        'draftIssue': json['draft_issue'] == null ? undefined : json['draft_issue'],
        'project': json['project'] == null ? undefined : json['project'],
        'issue': json['issue'] == null ? undefined : json['issue'],
        'comment': json['comment'] == null ? undefined : json['comment'],
        'page': json['page'] == null ? undefined : json['page'],
    };
}

export function IssueAttachmentToJSON(json: any): IssueAttachment {
    return IssueAttachmentToJSONTyped(json, false);
}

export function IssueAttachmentToJSONTyped(value?: Omit<IssueAttachment, 'id'|'created_at'|'updated_at'|'updated_by'|'workspace'|'project'|'issue'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'deleted_at': value['deletedAt'] == null ? undefined : ((value['deletedAt'] as any).toISOString()),
        'attributes': value['attributes'],
        'asset': value['asset'],
        'entity_type': value['entityType'],
        'entity_identifier': value['entityIdentifier'],
        'is_deleted': value['isDeleted'],
        'is_archived': value['isArchived'],
        'external_id': value['externalId'],
        'external_source': value['externalSource'],
        'size': value['size'],
        'is_uploaded': value['isUploaded'],
        'storage_metadata': value['storageMetadata'],
        'created_by': value['createdBy'],
        'user': value['user'],
        'draft_issue': value['draftIssue'],
        'comment': value['comment'],
        'page': value['page'],
    };
}

