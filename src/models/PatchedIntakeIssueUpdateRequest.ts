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
import type { IssueForIntakeRequest } from './IssueForIntakeRequest';
import {
    IssueForIntakeRequestFromJSON,
    IssueForIntakeRequestFromJSONTyped,
    IssueForIntakeRequestToJSON,
    IssueForIntakeRequestToJSONTyped,
} from './IssueForIntakeRequest';
import type { IntakeWorkItemStatusEnum } from './IntakeWorkItemStatusEnum';
import {
    IntakeWorkItemStatusEnumFromJSON,
    IntakeWorkItemStatusEnumFromJSONTyped,
    IntakeWorkItemStatusEnumToJSON,
    IntakeWorkItemStatusEnumToJSONTyped,
} from './IntakeWorkItemStatusEnum';

/**
 * Serializer for updating intake work items and their associated issues.
 * 
 * Handles intake work item modifications including status changes, triage decisions,
 * and embedded issue updates for issue queue processing workflows.
 * @export
 * @interface PatchedIntakeIssueUpdateRequest
 */
export interface PatchedIntakeIssueUpdateRequest {
    /**
     * 
     * @type {IntakeWorkItemStatusEnum}
     * @memberof PatchedIntakeIssueUpdateRequest
     */
    status?: IntakeWorkItemStatusEnum;
    /**
     * 
     * @type {Date}
     * @memberof PatchedIntakeIssueUpdateRequest
     */
    snoozedTill?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedIntakeIssueUpdateRequest
     */
    duplicateTo?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedIntakeIssueUpdateRequest
     */
    source?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedIntakeIssueUpdateRequest
     */
    sourceEmail?: string | null;
    /**
     * Issue data to update in the intake issue
     * @type {IssueForIntakeRequest}
     * @memberof PatchedIntakeIssueUpdateRequest
     */
    issue?: IssueForIntakeRequest;
}



/**
 * Check if a given object implements the PatchedIntakeIssueUpdateRequest interface.
 */
export function instanceOfPatchedIntakeIssueUpdateRequest(value: object): value is PatchedIntakeIssueUpdateRequest {
    return true;
}

export function PatchedIntakeIssueUpdateRequestFromJSON(json: any): PatchedIntakeIssueUpdateRequest {
    return PatchedIntakeIssueUpdateRequestFromJSONTyped(json, false);
}

export function PatchedIntakeIssueUpdateRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): PatchedIntakeIssueUpdateRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'status': json['status'] == null ? undefined : IntakeWorkItemStatusEnumFromJSON(json['status']),
        'snoozedTill': json['snoozed_till'] == null ? undefined : (new Date(json['snoozed_till'])),
        'duplicateTo': json['duplicate_to'] == null ? undefined : json['duplicate_to'],
        'source': json['source'] == null ? undefined : json['source'],
        'sourceEmail': json['source_email'] == null ? undefined : json['source_email'],
        'issue': json['issue'] == null ? undefined : IssueForIntakeRequestFromJSON(json['issue']),
    };
}

export function PatchedIntakeIssueUpdateRequestToJSON(json: any): PatchedIntakeIssueUpdateRequest {
    return PatchedIntakeIssueUpdateRequestToJSONTyped(json, false);
}

export function PatchedIntakeIssueUpdateRequestToJSONTyped(value?: PatchedIntakeIssueUpdateRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'status': IntakeWorkItemStatusEnumToJSON(value['status']),
        'snoozed_till': value['snoozedTill'] == null ? undefined : ((value['snoozedTill'] as any).toISOString()),
        'duplicate_to': value['duplicateTo'],
        'source': value['source'],
        'source_email': value['sourceEmail'],
        'issue': IssueForIntakeRequestToJSON(value['issue']),
    };
}

