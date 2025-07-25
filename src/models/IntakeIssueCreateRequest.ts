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
 * Serializer for creating intake work items with embedded issue data.
 * 
 * Manages intake work item creation including nested issue creation,
 * status assignment, and source tracking for issue queue management.
 * @export
 * @interface IntakeIssueCreateRequest
 */
export interface IntakeIssueCreateRequest {
    /**
     * Issue data for the intake issue
     * @type {IssueForIntakeRequest}
     * @memberof IntakeIssueCreateRequest
     */
    issue: IssueForIntakeRequest;
    /**
     * 
     * @type {string}
     * @memberof IntakeIssueCreateRequest
     */
    intake: string;
    /**
     * 
     * @type {IntakeWorkItemStatusEnum}
     * @memberof IntakeIssueCreateRequest
     */
    status?: IntakeWorkItemStatusEnum;
    /**
     * 
     * @type {Date}
     * @memberof IntakeIssueCreateRequest
     */
    snoozedTill?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof IntakeIssueCreateRequest
     */
    duplicateTo?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IntakeIssueCreateRequest
     */
    source?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IntakeIssueCreateRequest
     */
    sourceEmail?: string | null;
}



/**
 * Check if a given object implements the IntakeIssueCreateRequest interface.
 */
export function instanceOfIntakeIssueCreateRequest(value: object): value is IntakeIssueCreateRequest {
    if (!('issue' in value) || value['issue'] === undefined) return false;
    if (!('intake' in value) || value['intake'] === undefined) return false;
    return true;
}

export function IntakeIssueCreateRequestFromJSON(json: any): IntakeIssueCreateRequest {
    return IntakeIssueCreateRequestFromJSONTyped(json, false);
}

export function IntakeIssueCreateRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): IntakeIssueCreateRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'issue': IssueForIntakeRequestFromJSON(json['issue']),
        'intake': json['intake'],
        'status': json['status'] == null ? undefined : IntakeWorkItemStatusEnumFromJSON(json['status']),
        'snoozedTill': json['snoozed_till'] == null ? undefined : (new Date(json['snoozed_till'])),
        'duplicateTo': json['duplicate_to'] == null ? undefined : json['duplicate_to'],
        'source': json['source'] == null ? undefined : json['source'],
        'sourceEmail': json['source_email'] == null ? undefined : json['source_email'],
    };
}

export function IntakeIssueCreateRequestToJSON(json: any): IntakeIssueCreateRequest {
    return IntakeIssueCreateRequestToJSONTyped(json, false);
}

export function IntakeIssueCreateRequestToJSONTyped(value?: IntakeIssueCreateRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'issue': IssueForIntakeRequestToJSON(value['issue']),
        'intake': value['intake'],
        'status': IntakeWorkItemStatusEnumToJSON(value['status']),
        'snoozed_till': value['snoozedTill'] == null ? undefined : ((value['snoozedTill'] as any).toISOString()),
        'duplicate_to': value['duplicateTo'],
        'source': value['source'],
        'source_email': value['sourceEmail'],
    };
}

