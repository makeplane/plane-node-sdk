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


/**
 * * `blocking` - Blocking
 * * `blocked_by` - Blocked By
 * * `duplicate` - Duplicate
 * * `relates_to` - Relates To
 * * `start_before` - Start Before
 * * `start_after` - Start After
 * * `finish_before` - Finish Before
 * * `finish_after` - Finish After
 * @export
 */
export const IssueRelationCreateRelationTypeEnum = {
    Blocking: 'blocking',
    BlockedBy: 'blocked_by',
    Duplicate: 'duplicate',
    RelatesTo: 'relates_to',
    StartBefore: 'start_before',
    StartAfter: 'start_after',
    FinishBefore: 'finish_before',
    FinishAfter: 'finish_after'
} as const;
export type IssueRelationCreateRelationTypeEnum = typeof IssueRelationCreateRelationTypeEnum[keyof typeof IssueRelationCreateRelationTypeEnum];


export function instanceOfIssueRelationCreateRelationTypeEnum(value: any): boolean {
    for (const key in IssueRelationCreateRelationTypeEnum) {
        if (Object.prototype.hasOwnProperty.call(IssueRelationCreateRelationTypeEnum, key)) {
            if (IssueRelationCreateRelationTypeEnum[key as keyof typeof IssueRelationCreateRelationTypeEnum] === value) {
                return true;
            }
        }
    }
    return false;
}

export function IssueRelationCreateRelationTypeEnumFromJSON(json: any): IssueRelationCreateRelationTypeEnum {
    return IssueRelationCreateRelationTypeEnumFromJSONTyped(json, false);
}

export function IssueRelationCreateRelationTypeEnumFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssueRelationCreateRelationTypeEnum {
    return json as IssueRelationCreateRelationTypeEnum;
}

export function IssueRelationCreateRelationTypeEnumToJSON(value?: IssueRelationCreateRelationTypeEnum | null): any {
    return value as any;
}

export function IssueRelationCreateRelationTypeEnumToJSONTyped(value: any, ignoreDiscriminator: boolean): IssueRelationCreateRelationTypeEnum {
    return value as IssueRelationCreateRelationTypeEnum;
}

