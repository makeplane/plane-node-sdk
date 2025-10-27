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
 * Serializer for issue relationships showing related issue details.
 * 
 * Provides comprehensive information about related issues including
 * project context, sequence ID, and relationship type.
 * @export
 * @interface IssueRelation
 */
export interface IssueRelation {
    /**
     * 
     * @type {string}
     * @memberof IssueRelation
     */
    readonly id?: string;
    /**
     * 
     * @type {string}
     * @memberof IssueRelation
     */
    readonly projectId?: string;
    /**
     * 
     * @type {number}
     * @memberof IssueRelation
     */
    readonly sequenceId?: number;
    /**
     * 
     * @type {string}
     * @memberof IssueRelation
     */
    readonly relationType?: string;
    /**
     * 
     * @type {string}
     * @memberof IssueRelation
     */
    readonly name?: string;
    /**
     * 
     * @type {string}
     * @memberof IssueRelation
     */
    readonly typeId?: string;
    /**
     * 
     * @type {boolean}
     * @memberof IssueRelation
     */
    readonly isEpic?: boolean;
    /**
     * 
     * @type {string}
     * @memberof IssueRelation
     */
    readonly stateId?: string;
    /**
     * 
     * @type {string}
     * @memberof IssueRelation
     */
    readonly priority?: string;
    /**
     * 
     * @type {string}
     * @memberof IssueRelation
     */
    readonly createdBy?: string | null;
    /**
     * 
     * @type {Date}
     * @memberof IssueRelation
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof IssueRelation
     */
    readonly updatedAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof IssueRelation
     */
    readonly updatedBy?: string | null;
}

/**
 * Check if a given object implements the IssueRelation interface.
 */
export function instanceOfIssueRelation(value: object): value is IssueRelation {
    return true;
}

export function IssueRelationFromJSON(json: any): IssueRelation {
    return IssueRelationFromJSONTyped(json, false);
}

export function IssueRelationFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssueRelation {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'projectId': json['project_id'] == null ? undefined : json['project_id'],
        'sequenceId': json['sequence_id'] == null ? undefined : json['sequence_id'],
        'relationType': json['relation_type'] == null ? undefined : json['relation_type'],
        'name': json['name'] == null ? undefined : json['name'],
        'typeId': json['type_id'] == null ? undefined : json['type_id'],
        'isEpic': json['is_epic'] == null ? undefined : json['is_epic'],
        'stateId': json['state_id'] == null ? undefined : json['state_id'],
        'priority': json['priority'] == null ? undefined : json['priority'],
        'createdBy': json['created_by'] == null ? undefined : json['created_by'],
        'createdAt': json['created_at'] == null ? undefined : (new Date(json['created_at'])),
        'updatedAt': json['updated_at'] == null ? undefined : (new Date(json['updated_at'])),
        'updatedBy': json['updated_by'] == null ? undefined : json['updated_by'],
    };
}

export function IssueRelationToJSON(json: any): IssueRelation {
    return IssueRelationToJSONTyped(json, false);
}

export function IssueRelationToJSONTyped(value?: Omit<IssueRelation, 'id'|'project_id'|'sequence_id'|'relation_type'|'name'|'type_id'|'is_epic'|'state_id'|'priority'|'created_by'|'created_at'|'updated_at'|'updated_by'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
    };
}

